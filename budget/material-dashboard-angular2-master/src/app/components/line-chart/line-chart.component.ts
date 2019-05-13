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
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    len = len - margin.left - margin.right,
    hei = hei - margin.top - margin.bottom;

    // parse the date / time
    var parseDate = d3.timeFormat("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, len]);
    var y = d3.scaleLinear().range([hei, 0]);

    var formatDate = d3.timeFormat("%m");

    data.forEach(element => {
      formatDate(parseDate(element['date']))
    })

    console.log(data);

    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d['date']); })
    .y(function(d) { return y(d['cost']); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('.chart_line').append("svg")
    .attr("width", len + margin.left + margin.right)
    .attr("height", hei + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.cost; })]);

    // Add the valueline path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + hei + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
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

