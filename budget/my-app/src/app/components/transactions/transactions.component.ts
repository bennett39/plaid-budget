import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../services/transactions.service';
import * as d3 from 'd3';
import * as moment from 'moment';
import * as transactionsTest from '../../../app/transactions-sandbox.json';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {
// tslint:disable-next-line: variable-name
  chart_obj: Array<any>;
// tslint:disable-next-line: variable-name
  chart_obj_vert: Array<any>;
// tslint:disable-next-line: variable-name
  year_calc;
  showTicks;
  autoTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;
  serverError = false;
  currentDay: number;
  finalDay: number;
  myValue: any;
  dateShow = new Date();
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  sliderDayShow: any;
  sliderDayShowLastMon: any;
  firstDayShowCurrentMonth: any;
  firstDayShowLastMonth: any;
  currentMonthSpec;
  lastMonthSpec;
// tslint:disable-next-line: variable-name
  currentMonthTrans_array;
  lastMonthTrans_array;
  lastMonthTotal: number;
  currentMonthTotal: number;
  transactionTotal: number;
  lastMonthClick = false;
  lastMonthShowMonth;
  currentMonthTotalSlider;
  lastMonthTotalSlider;
  dayShowUndefined;
  transactions_data;
  catCount;
  columns = ['Date', 'Amount', 'Transaction Name'];

  sixMonth_obj = [
    { month: 'January', code: '01' },
    { month: 'February', code: '02' },
    { month: 'March', code: '03' },
    { month: 'April', code: '04' },
    { month: 'May', code: '05' },
    { month: 'June', code: '06' },
    { month: 'July', code: '07' },
    { month: 'August', code: '08' },
    { month: 'September', code: '09' },
    { month: 'October', code: '10' },
    { month: 'November', code: '11' },
    { month: 'December', code: '12' }
  ];

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  updateSlider(event: any) {
    this.dayShowUndefined = false;
    const currentDay = event.value;
    if (!this.lastMonthClick) {
      this.slidertoDate(currentDay);
      this.filterData(this.sliderDayShow);
    }
    if (this.lastMonthClick) {
      this.slidertoDate(currentDay);
      this.filterData(this.sliderDayShowLastMon);
    }

  }

  currentMonthCalc() {
    const formattedDateFirst = this.year + '-' + this.month + '-' + '01';
    const firstDate = moment(formattedDateFirst, 'YYYY-MM-DD').toDate();
    const firstDay = firstDate.toISOString().slice(0, 10);
    this.currentMonthSpec = firstDate.toISOString().slice(5, 7);
    this.firstDayShowCurrentMonth = firstDay;
  }

  lastMonthCalc() {
    const date = new Date(this.dateShow);
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    const firstDay = date.toISOString().slice(0, 10);
    this.lastMonthShowMonth = date;
    this.lastMonthSpec = date.toISOString().slice(5, 7);
    this.firstDayShowLastMonth = firstDay;
  }

  slidertoDate(value) {
    const formattedDate = this.year + '-' + this.month + '-' + value;
    const formattedDateLastMon = this.year + '-' + (this.month - 1) + '-' + value;
    const finalDate = moment(formattedDate, 'YYYY-MM-DD').toDate();
    const finalDateLastMon = moment(formattedDateLastMon, 'YYYY-MM-DD').toDate();
    const finalDay = finalDate.toISOString().slice(0, 10);
    const lastMonFinalDay = finalDateLastMon.toISOString().slice(0, 10);
    const sliderDay = finalDate.toISOString().slice(8, 10);
    this.sliderDayShow = finalDay;
    this.sliderDayShowLastMon = lastMonFinalDay;
  }

  filterData(sliderDate) {
    this.pullTransactions();
    let date;
    date = new Date(sliderDate).toISOString();
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sliderRange_transactions = [];

    if (!this.lastMonthClick) {
      this.currentMonthTrans_array.map(data => {
        if (data.date <= date) {
          sliderRange_transactions.push(data.amount);
        }
      });
      this.currentMonthTotalSlider = sliderRange_transactions.reduce(reducer);
      this.chart_obj = [
        {
          'name': 'As of ' + this.sliderDayShow.split('-').join('/').substring(5, 10),
          'value': this.currentMonthTotalSlider
        },
        {
          'name': this.lastMonthShowMonth.toLocaleString('en-us', { month: 'long' }) + ' Total',
          'value': this.lastMonthTotal
        }
      ];
    }

    if (this.lastMonthClick) {
      this.lastMonthTrans_array.map(data => {
        if (data.date <= date) {
          sliderRange_transactions.push(data.amount);
        }
      });
      this.lastMonthTotalSlider = sliderRange_transactions.reduce(reducer);

      this.chart_obj = [
        {
          'name': 'As of ' + this.sliderDayShowLastMon.split('-').join('/').substring(5, 10),
          'value': this.lastMonthTotalSlider
        },
        {
          'name': this.lastMonthShowMonth.toLocaleString('en-us', { month: 'long' }) + ' Total',
          'value': this.lastMonthTotal
        },
      ];
    }
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    if (value >= 32) {
      return value;
    }
    return value;
  }

  constructor(
    private transactionsService: TransactionsService
  ) { }

  returnTransactions() {
    this.transactionsService.getTransactions()
      .subscribe(data => {
        const all_transactions = [];
        const current_month_transactions = [];
        const last_month_transactions = [];
        const transaction_category = [];
        this.catCount = [];
        const counts = {};

        // filter data based on date
        const transactions_array = data['transactions'].transactions;
        // tslint:disable-next-line: no-shadowed-variable
        transactions_array.map(data => {
          transaction_category.push(data.category[0]);
        });

        console.log(transactions_array);

        transaction_category.forEach(function (x) {
          counts[x] = (counts[x] || 0) + 1;
        });

        const uniqueCat = [...Array.from(new Set(transaction_category))];
        // tslint:disable-next-line: no-shadowed-variable
        uniqueCat.map(data => {
          this.catCount.push({
            'category': data,
            'total': counts[data]
          });
        });
        // tslint:disable-next-line: no-shadowed-variable
        this.currentMonthTrans_array = transactions_array.filter(data => data.date.substring(5, 7) === this.currentMonthSpec);
        // tslint:disable-next-line: no-shadowed-variable
        this.lastMonthTrans_array = transactions_array.filter(data => data.date.substring(5, 7) === this.lastMonthSpec);

        // separate into different arrays based on time
        transactions_array.map(dollars => {
          all_transactions.push(dollars.amount);
        });
        this.currentMonthTrans_array.map(dollars => {
          current_month_transactions.push(dollars.amount);
        });
        this.lastMonthTrans_array.map(dollars => {
          last_month_transactions.push(dollars.amount);
        });
        console.log(this.catCount);

        // perform sum calculations on array
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        this.transactionTotal = all_transactions.reduce(reducer);
        this.currentMonthTotal = current_month_transactions.reduce(reducer);
        this.lastMonthTotal = last_month_transactions.reduce(reducer);

        this.chart_obj = [
          {
            'name': this.dateShow.toLocaleString('en-us', { month: 'long' }),
            'value': this.currentMonthTotal
          },
          {
            'name': this.lastMonthShowMonth.toLocaleString('en-us', { month: 'long' }) + ' Total',
            'value': this.lastMonthTotal
          }
        ];
        this.filterByMonth(transactionsTest.default.transactions);
      },
         (error) => this.serverError = true
     );
  }

  pullTransactions() {
    this.transactionsService.getTransactions()
      .subscribe(data => {
        this.transactions_data = transactionsTest.default.transactions;
        this.filterByMonth(transactionsTest.default.transactions);
      },
         (error) => this.serverError = true
      );
  }

  ngOnInit() {
    this.currentMonthCalc();
    this.lastMonthCalc();
    this.dayShowUndefined = true;
    this.returnTransactions();
    this.pullTransactions();
  }

  lastMonthPull() {
    this.lastMonthClick = true;
    this.chart_obj = [
      {
        'name': this.lastMonthShowMonth.toLocaleString('en-us', { month: 'long' }),
        'value': this.lastMonthTotal
      }
    ];
  }

  filterByMonth(data) {
    const evaluator = [];
    this.year_calc = [];
    if (this.sixMonth_obj !== undefined) {
      this.sixMonth_obj.map((month, index) => {
        month['transactions'] = data.filter(data => data['date'].substring(5, 7) === month['code']);
        month['transaction_amount'] = month['transactions'].map(transact => {
          month['year'] = transact['date'].substring(0, 4);
          return transact.amount;
        });
        month['sum'] = month['transaction_amount'].reduce(function (a, b) { return a + b; }, 0);
      });
      this.sixMonth_obj = this.sixMonth_obj.filter(data => data['transaction_amount'].length !== 0);
    }
  }

  sixMonthChart() {
    this.filterByMonth(transactionsTest.default.transactions);
    this.chart_obj_vert = [];
    this.sixMonth_obj.map(months => {
      this.chart_obj_vert.push(
        {
          'name': months['month'] + ' ' + months['year'],
          'value': months['sum'],
// tslint:disable-next-line: no-string-literal
          'sortOrder': (+this.dateShow - +new Date(months['transactions'][0]['date'])) / (86400000),
          'year': months['year']
        }
      );

    });
    this.chart_obj_vert = this.chart_obj_vert.sort((a, b) => (a['sortOrder'] < b['sortOrder']) ? 1 : -1);
  }

  currMonthPull() {
    this.lastMonthClick = false;
    this.returnTransactions();
  }

}

