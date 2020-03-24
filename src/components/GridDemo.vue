<template>
  <div>
    <smart-grid id="grid"></smart-grid>
  </div>
</template>

<script>
import "@/source-dev/styles/smart.default.css";

import '@/framework/smart.element-dev.js';
import '@/source-dev/smart.element.js';
import '@/source-dev/smart.elements.js';
import '@/source-dev/smart.data.js';
import '@/source-dev/smart.grid.js';
import '@/source-dev/smart.button.js';

export default {
  name: 'GridDemo',
  mounted: function() {
    window.Smart(
      "#grid", class 
      {
        get properties() {
          return {
            appearance: {
              showRowHeaderNumber: true
            },
            columns: [
              { label: 'First Name', dataField: 'firstName',   allowEdit: false },
              { label: 'Last Name',  dataField: 'lastName',    allowEdit: false },
              { label: 'Product',    dataField: 'productName', allowEdit: false },
              { label: 'Customer',   dataField: 'customer', template: 'checkBox', editor: 'checkBox' },
              { label: 'Sale Date',  dataField: 'saleDate', cellsFormat: 'yyyy/MM/dd hh:mm',
                width: 150,
                editor: {
                  template: 'dateTimePicker',
                  formatString: 'yyyy/MM/dd hh:mm',
                  onInit(index, dataField, editor){
                    console.log(`onInit index[${index}] dataField[${dataField}], editor[${editor}]`);
                  },
                  onRender(index, dataField, editor){
                    console.log(`onRender index[${index}] dataField[${dataField}], editor[${editor}]`);
                  }
                }
              },
              { label: 'Quantity',   dataField: 'quantity',  cellsFormat: 'N', editor: 'numberInput' },
              { label: 'Unit Price', dataField: 'unitPrice', cellsFormat: 'c2', editor: 'numberInput'  }
            ],
            sorting: {
              enabled: true
            },	
            filtering: {
              enabled: true
            },
            grouping: {
              enabled: true
            },
            editing: {
                batch: true,
                enabled: true,
                commandBar: {
                    visible: true,
                    position: 'far'
                }
            },
            paging: {
              enabled: true
            },
            pager: {
              visible: true,
              summary: { visible: true }
            },
            onCommand: function({name, handled}) {
              console.log(`onCommand [${name}]`);
              // SI graba
              if (name === 'commandBarBatchSaveCommand') {
                console.log(this.getBatchEditChanges());
                let { updated } = this.getBatchEditChanges();
                // PARA CADA celda modificada
                updated.forEach(updt => {
                  // id: "3"
                  // dataField: "customer"
                  // oldValue: false
                  // newValue: true
                  console.log(updt);
                  console.log(this.rows[updt.id]);
                  console.log(this.dataSource[updt.id]);
                });
              }
              handled = false;
            },
            onCellUpdate: function(pcell, pold, pnew, pconfirm) {
              console.log(`onCellUpdate row.id [${pcell.row.id}] column.dataField [${pcell.column.dataField}]`);
              console.log(`ID  [${pcell.row.data['id']}]`);
              console.log(`OLD [${pcell.row.data[pcell.column.dataField]}]`);
              console.log(`NEW [${pnew}]`);
              if ( pconfirm ) pconfirm(true);
            },
            dataSource: new window.Smart.DataAdapter(
            {
              dataSource: [
                { "id": 11,  "firstName": "Beate",  "lastName": "Wilson", "productName": "Caramel Latte",  "customer": "0", "saleDate": "2019-04-21T10:00:00Z", "quantity": "1", "unitPrice": "6"},
                { "id": 12,  "firstName": "Ian",    "lastName": "Nodier", "productName": "Caramel Latte",  "customer": "1", "saleDate": "2019-04-21T10:00:00Z", "quantity": "1", "unitPrice": "2"},
                { "id": 13,  "firstName": "Petra",  "lastName": "Vileid", "productName": "Green Tea",      "customer": "1", "saleDate": "2019-04-09T08:00:00Z", "quantity": "1", "unitPrice": "3"},
                { "id": 14,  "firstName": "Mayumi", "lastName": "Ohno",   "productName": "Caramel Latte",  "customer": "0", "saleDate": "2019-04-04T14:00:00Z", "quantity": "1", "unitPrice": "5"},
                { "id": 15,  "firstName": "Mayumi", "lastName": "Saylor", "productName": "Espresso con Panna", "customer": "0", "saleDate": "2019-04-02T15:00:00Z", "quantity": "1", "unitPrice": "8"},
                { "id": 16,  "firstName": "Regina", "lastName": "Fuller", "productName": "Caffe Americano", "customer": "0", "saleDate": "2019-04-16T18:00:00Z", "quantity": "1", "unitPrice": "12"},
                { "id": 17,  "firstName": "Regina", "lastName": "Burke",  "productName": "Caramel Latte",   "customer": "0", "saleDate": "2019-04-19T09:00:00Z", "quantity": "1", "unitPrice": "3"},
                { "id": 18,  "firstName": "Andrew", "lastName": "Petersen", "productName": "Caffe Americano",    "customer": "0", "saleDate": "2019-04-01T08:00:00Z", "quantity": "1", "unitPrice": "12"},
                { "id": 19,  "firstName": "Martin", "lastName": "Ohno",     "productName": "Espresso con Panna", "customer": "0", "saleDate": "2019-04-04T09:00:00Z", "quantity": "1", "unitPrice": "11"},
                { "id": 20,  "firstName": "Beate",  "lastName": "Devling",  "productName": "Green Tea",          "customer": "0", "saleDate": "2019-04-06T08:00:00Z", "quantity": "1", "unitPrice": "5"},
                { "id": 21,  "firstName": "Sven",   "lastName": "Devling",  "productName": "Espresso Truffle",   "customer": "0", "saleDate": "2019-04-11T12:00:00Z", "quantity": "1", "unitPrice": "6"},
                { "id": 22,  "firstName": "Petra",  "lastName": "Burke",    "productName": "Peppermint Mocha Twist", "customer": "0", "saleDate": "2019-04-10T10:00:00Z", "quantity": "1", "unitPrice": "9"},
                { "id": 23,  "firstName": "Marco",  "lastName": "Johnes",   "productName": "Caffe Mocha",            "customer": "0", "saleDate": "2019-04-12T11:00:00Z", "quantity": "1", "unitPrice": "21"},
              ],
              dataFields:
              [
                'id: number',
                'firstName: string',
                'lastName: string',
                'productName: string',
                'customer: bool',
                'saleDate: date',
                'quantity: number',
                'unitPrice: number'
              ]
            })
            , locale: 'es'
            , messages: {
              extend: true,
              'es': {
                "pagerSummaryString": "de",
                "pagerSummaryPrefix": "de",
                "columnMenuItemSortAsc": "Ordena {{mode}}",
                "columnMenuItemSortDesc": "Ordena {{mode}}",
                "columnMenuItemRemoveSort": "No Ordena",
                "columnMenuItemFilter": "Filtra",
                "columnMenuItemRemoveFilter": "No Filtra",
                "columnMenuItemGroupBy": "Agrupa por esta columna",
                "columnMenuItemRemoveGroupBy": "No Agrupa",
                "commandBarBatchRevert": "Cancela",
                "commandBarBatchSave": "Graba",
                "calendar": {
                  "/": "/",
                  ":": ":",
                  "firstDay": 1,
                  "days": {
                    "names": [
                      "Domingo",
                      "Lunes",
                      "Martes",
                      "Miercoles",
                      "Jueves",
                      "Viernes",
                      "Sabado"
                    ],
                    "namesAbbr": [
                      "Dom",
                      "Lun",
                      "Mar",
                      "Mie",
                      "Jue",
                      "Vie",
                      "Sab"
                    ],
                    "namesShort": [
                      "Do",
                      "Lu",
                      "Ma",
                      "Mi",
                      "Ju",
                      "Vi",
                      "Sa"
                    ]
                  },
                  "months": {
                    "names": [
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio",
                      "Julio",
                      "Agosto",
                      "Septiembre",
                      "Octubre",
                      "Noviembre",
                      "Diciembre",
                      ""
                    ],
                    "namesAbbr": [
                      "Ene",
                      "Feb",
                      "Mar",
                      "Abr",
                      "May",
                      "Jun",
                      "Jul",
                      "Ago",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dic",
                      ""
                    ]
                  },
                  "AM": [
                    "AM",
                    "am",
                    "AM"
                  ],
                  "PM": [
                    "PM",
                    "pm",
                    "PM"
                  ],
                  "eras": [
                    {
                      "name": "A.D.",
                      "start": null,
                      "offset": 0
                    }
                  ],
                  "currencySymbol": "€",
                  "currencySymbolPosition": "before",
                  "decimalSeparator": '.',
                  "thousandsSeparator": ','
                }
              }
            }
          }
        }
      }
    );
  }
}
</script>

<style scoped>
  body {
    min-height: 700px;
  }
  smart-grid {
    width: 100%;
    height: auto;
  }
</style>
