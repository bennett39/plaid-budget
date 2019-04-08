import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-vertical-barchart',
  templateUrl: './vertical-barchart.component.html',
  styleUrls: ['./vertical-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalBarchartComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private sixMonth_obj = [];

  constructor() { }

  ngOnInit() {
    this.drawSixMonthVerticalBar(this.data, 400, 250);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    this.drawSixMonthVerticalBar(this.data, 400, 300);
  }

  drawSixMonthVerticalBar(data, len, hei) {

    d3.select('svg.chart-div').remove();

    const color = d3.scaleOrdinal().range(['#36d1dc', '#5b86e5']);

    const margin = { top: 0, right: 0, bottom: 20, left: 40 };
    len = len - margin.left - margin.right,
      hei = hei - margin.top - margin.bottom;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });

    const transaction_array = [];

    this.sixMonth_obj.map(data => {
      transaction_array.push({
        'month': data.month,
        'data': data['sum']
      });
    });

    const XScale = d3.scaleBand().rangeRound([margin.left, len - margin.right]).padding(0.3);
    XScale.domain(data.map(function (d) { return d['name']; }));

    const YScale = d3.scaleLinear().range([hei, 0]);
    YScale.domain([0, d3.max(data, function (d) { return d['value'] + 1000; })]);

    // create main svg
    const svg = d3.select('.chart_vert')
      .append('svg').classed('chart-div', true)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 -10 400 300')
      .append('g');


    const barGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    barGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#606c88')
      .attr('stop-opacity', 0.6);

    barGradient.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', '#3f4c6b')
      .attr('stop-opacity', 0.6);

    // create svgs for bar graph
    const transactions = svg.append('g');

    const yAxis = d3.axisLeft(YScale).tickSize(0);
    const xAxis = d3.axisBottom(XScale).ticks(XScale).tickSize(0);

    transactions.append('g')
      .attr('class', 'x-axis-transactions-vert')
      .attr('transform', 'translate(0,' + hei + ')')
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-60)')
      .attr('y', 5)
      .attr('x', -25)
      .style('font-size', '0.65em')
      .style('font-weight', '700');

    transactions.append('line')
      .data(data)
      .attr('x', -40)
      .attr('x1', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 7;
      })
      .attr('y1', 0)
      .attr('x2', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 7;
      })
      .attr('y2', hei)
      .style('stroke-width', 1)
      .style('stroke', '#ddd')
      .style('fill', 'none');

    // append the bars
    const bars = svg.selectAll('bar')
      .data(data)
      .enter()
      .append('g');

    bars.append('rect')
      .attr('class', 'bar')
      .attr('x', function (d, i) {
        return XScale(d['name']);
      })
      .attr('y', function (d) {
        return YScale(d['value']);
      })
      .attr('width', function (d) {
        return XScale.bandwidth();
      })
      .attr('height', function (d) {
        return hei - YScale(d['value']);
      })
      .attr('fill', 'url(#areaGradient)');

    bars.append('text')
      .attr('class', 'label')
      .text(function (d) {
        return formatter.format(d['value']);
      })
      .attr('x', function (d) {
        return XScale(d['name']);
      })
      .attr('y', function (d) {
        return YScale(d['value']) - 10;
      })
      .attr('font-weight', '800')
      .attr('fill', '#333')
      .attr('color', '#ddd')
      .attr('font-size', '1.3em');

    transactions.append('rect')
      .attr('x', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 7;
      })
      .attr('y', hei / 2 - 9.5)
      .attr('width', 25)
      .attr('height', 14)
      .attr('fill', '#333')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5);

    transactions.append('rect')
      .attr('x', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 32;
      })
      .attr('y', hei / 2 + 30.5)
      .attr('width', 25)
      .attr('height', 14)
      .attr('fill', '#333')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5);

    console.log(data);

    transactions.raise().append('text')
      .classed('year_label', true)
      .data(data)
      .text('2019')
      .attr('x', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 2;
      })
      .attr('y', hei / 2)
      .attr('font-weight', '800')
      .attr('fill', '#aaa');

    transactions.raise().append('text')
      .classed('year_label', true)
      .data(data)
      .text('2018')
      .attr('x', function () {
        let value = data.map(months => {
          if (months['name'] === 'January 2019') {
            return XScale(months['name']);
          }
        });
        value = value.filter(element => {
          return element !== undefined;
        });
        value = value[0];
        return value - 27;
      })
      .attr('y', hei / 2 + 40)
      .attr('font-weight', '800')
      .attr('fill', '#aaa');



  }

}

