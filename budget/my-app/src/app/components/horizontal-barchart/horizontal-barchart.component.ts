import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-horizontal-barchart',
  templateUrl: './horizontal-barchart.component.html',
  styleUrls: ['./horizontal-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalBarchartComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private hei: number;
  private len: number;
  private chart: any;

  constructor() { }

  drawBarChart(data, len, hei) {

    d3.select('svg').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 100 };

    len = len - margin.left - margin.right,
      hei = hei - margin.top - margin.bottom;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });

    const max_height = d3.max(data, function (d) { return d.value; }) + 1000;
    const rounded = Math.round(max_height / 1000) * 1000;

    // set scales for bars
    const XScale = d3.scaleLinear().range([0, len]);
    XScale.domain([0, rounded]);

    const YScale = d3.scaleBand()
      .range([(hei / 3) - margin.bottom - 10, 0])
      .round(true)
      .padding(0.2);

    YScale.domain(data.map(function (d) { return d.name; }));

    // create main svg
    const svg = d3.select('.chart-wrapper')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '20 0 400 90')
      .append('g')
      .classed('bar-chart', true);

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
    const transactions = svg.append('g')
      .classed('transactions', true)
      .attr('transform', 'translate(0,0)');

    const yAxis = d3.axisLeft(YScale).tickSize(0);

    transactions.append('g')
      .attr('class', 'y-axis-transactions')
      .attr('transform', 'translate(' + margin.left + ',0)')
      .call(yAxis)
      .style('font-size', '1.2em')
      .style('font-weight', '700');

    // append the bars
    const bars = svg.selectAll('bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar');

    bars.append('rect')
      .attr('class', 'bar')
      .attr('x', margin.left + 10)
      .attr('y', function (d) {
        return YScale(d['name']);
      })
      .attr('width', function (d) {
        return XScale(d['value']);
      })
      .attr('height', YScale.bandwidth())
      .attr('fill', 'url(#areaGradient)');

    bars.append('text')
      .attr('class', 'label')
      .text(function (d) {
        return formatter.format(d.value);
      })
      .attr('x', function (d) {
        return XScale(d['value']) + 112;
      })
      .attr('y', function (d) {
        return YScale(d['name']) + YScale.bandwidth() / 2 + 2;
      })
      .attr('font-weight', '800')
      .attr('fill', '#333')
      .attr('color', '#ddd')
      .attr('font-size', '1.3em')
      .transition().duration(1000)
      .ease(d3.easeExp);
  }

  ngOnInit() {
    this.drawBarChart(this.data, 400, 400);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    this.drawBarChart(this.data, 400, 400);
  }

}

