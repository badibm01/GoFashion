odoo.define('pos_retail.RetailTableWidget', function (require) {
    'use strict';

    const TableWidget = require('pos_restaurant.TableWidget');
    const Registries = require('point_of_sale.Registries');

    const RetailTableWidget = (TableWidget) =>
        class extends TableWidget {

            mounted() {
                // super.mounted()
                Object.assign(this.el.style, {})
            }

            willUnmount() {
                super.willUnmount();
            }

            get getStyletable() {
                const floor_id = this.props.floor_id
                const table = this.props.table
                console.log('style of table: ' + table.id + " of floor id: " + floor_id)
                function unit(val) {
                    return `${val}px`;
                }
                let style = ""
                if (floor_id == 0) {
                    style = "display: inline-block !important; "
                    style += "position: relative !important; "
                    style += "margin: 1em !important; "
                    style += "top: unset !important; "
                    style += "left: unset !important; "
                    style += "width: " + unit(table.width) + "; "
                    style += "height:" + unit(table.height) + "; "
                    style += "line-height:" + unit(table.height) + "; "
                    let border_radius = table.shape === 'round' ? unit(1000) : '3px'
                    style += "border-radius: " + border_radius + '; '
                    return style
                } else {
                    style = "width:" + unit(table.width) + ';'
                    style += "height:" + unit(table.height) + "; "
                    style += "top:" + unit(table.position_v) + ';'
                    style += "left:" + unit(table.position_h) + ';'
                    style += "line-height:" + unit(table.height) + ";"
                    let border_radius = table.shape === 'round' ? unit(1000) : '3px'
                    style += "border-radius: " + border_radius + '; '
                    if (table.height >= 150 && table.width >= 150) {
                        style += "font-size: 32px;"
                    }
                }
                return style
            }


            get checkedIn() {
                const orders = this.env.pos.get_table_orders(this.props.table);
                if (orders.length > 0) {
                    return true
                } else {
                    return false
                }
            }

            get tableInformation() {
                let info = {
                    'checkedIn': null,
                    'amount': 0,
                }
                const orders = this.env.pos.get_table_orders(this.props.table);
                if (orders.length > 0) {
                    for (let i = 0; i < orders.length; i++) {
                        let order = orders[i]
                        info['checkedIn'] = order['created_time']
                        info['amount'] = order.get_total_with_tax()
                    }
                    return info
                } else {
                    return info
                }
            }

            get getCountItemsWaitingDelivery() {
                var count = 0;
                const orders = this.env.pos.get_table_orders(this.props.table);
                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i];
                    let receiptOrders = this.env.pos.db.getOrderReceiptByUid(order.uid);
                    for (let j = 0; j < receiptOrders.length; j++) {
                        let receiptOrder = receiptOrders[j];
                        let linesReadyTransfer = receiptOrder.new.filter(n => n.state == 'Ready Transfer' || n.state == 'Kitchen Requesting Cancel')
                        count += linesReadyTransfer.length
                    }
                }
                return count
            }
        }
    Registries.Component.extend(TableWidget, RetailTableWidget);

    return RetailTableWidget
});
