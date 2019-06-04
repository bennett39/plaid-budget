import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as transactionsTest from '../../../../my-app/src/app/transactions-sandbox.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  // line_array: Array<any>;
  line_array = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December' ];

  constructor() { }


  ngOnInit() {

      console.log(transactionsTest['default'].transactions);

      const transactions = transactionsTest['default'].transactions;
      // this.line_array = this.data;


      transactions.map(element => {
        if (element['date'].substring(5, 7) === '05' || element['date'].substring(5, 7) === '04') {
          this.line_array.push(
            {
              'month': this.months[(new Date(element['date'].substring(5, 7)).getMonth()).toLocaleString('en-us')],
              'date': parseInt(element['date'].substring(8, 10)),
              'cost': element['amount']
            }
          )
        }
      })

      console.log(this.line_array);

      // https://www.creative-tim.com/product/material-dashboard-angular2
  }
}
