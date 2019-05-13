import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import * as transactionsTest from '../../../../my-app/src/app/transactions-sandbox.json';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  // line_array: Array<any>;
  line_array = [];

  constructor() { }


  ngOnInit() {

      console.log(transactionsTest['default'].transactions);

      const transactions = transactionsTest['default'].transactions;

      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      transactions.map(element => {
        if (element['date'].substring(5, 7) === '05' || element['date'].substring(5, 7) === '04') {
          this.line_array.push(
            {'date': Date.parse(element['date']), 'cost': element['amount']}
          )
        }
      })

      console.log(this.line_array);

      // https://www.creative-tim.com/product/material-dashboard-angular2
  }
}
