import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private hei: number;
  private len: number;
  private chart: any;

  constructor() { }

  drawLineChart(data, len, hei) {

    d3.select('svg').remove();

    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    len = len - margin.left - margin.right,
    hei = hei - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleTime().range([0, len]);
    const y = d3.scaleLinear().range([hei, 0]);

    // define the line
    const line = d3.line()
    .x(function(d) { return x(d['date']); })
    .y(function(d) { return y(d['cost']); });

    // Nest data by month.
    const months = d3.nest()
    .key(function(d) { return d['month']; })
    .entries(data);

    console.log(months);

    // Compute the maximum cost per month, needed for the y-domain.
    months.forEach(function(s) {
      s.maxCost = d3.max(s.values, function(d) { return d.cost; });
    });

  // Compute the minimum and maximum date across symbols.
  // We assume values are sorted by date.
  x.domain([
    d3.min(months, function(s) { return s.values[0].date; }),
    d3.max(months, function(s) { return s.values[s.values.length - 1].date; })
  ]);


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('.chart_line').append('svg')
    .attr('width', len + margin.left + margin.right)
    .attr('height', hei + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');


    // Add the valueline path.
    svg.append('path')
      .data(months)
      .attr('class', 'line')
      .attr('d', function() {
        y.domain([0, months[0].maxCost]);
        return line(months[0].values);
      })

    svg.append('path')
    .data(months)
    .attr('class', 'line')
    .attr('d', function() {
      y.domain([0, months[1].maxCost]);
      return line(months[1].values);
    })

    
    // svg.append('path')
    // .data(months)
    // .attr('class', 'line')
    // .attr('d', function(d) {
    //   y.domain([0, d.maxCost]);
    // })
      
    // Add the X Axis
    svg.append('g')
      .attr('transform', 'translate(0,' + hei + ')')
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));
}

  ngOnInit() {
    this.drawLineChart(this.data, 500, 400);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    this.drawLineChart(this.data, 500, 400);
  }

}

