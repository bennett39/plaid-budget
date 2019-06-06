import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as transactionsTest from '../../../../my-app/src/app/transactions-sandbox.json';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  line_array = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December' ];

  constructor() { }


  ngOnInit() {


      const transactions = transactionsTest['default'].transactions;
      const parseDate = d3.timeParse('%Y-%m-%d');

      transactions.map((element, index) => {
        if (element['date'].substring(5, 7) === '05' || element['date'].substring(5, 7) === '04') {
          this.line_array.push(
            {
              'month': this.months[(new Date(element['date'].substring(5, 7)).getMonth()).toLocaleString('en-us')],
              'date': parseDate(element['date']).getDate(),
              'cost': element['amount']
            }
          )
        }
      })
      console.log(this.line_array);
  }
}
