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
  costs = [];

  constructor() { }

  drawLineChart(data, len, hei) {

    d3.select('svg').remove();

    const lineOpacity = '0.45';
    const lineOpacityHover = '1';
    const otherLinesOpacityHover = '0.1';
    const lineStroke = '3px';
    const lineStrokeHover = '5px';

    const circleOpacity = '0.85';
    const circleOpacityOnLineHover = '0.1'
    const circleRadius = 5;
    const circleRadiusHover = 7;
    const duration = 100;

    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    len = len - margin.left - margin.right,
    hei = hei - margin.top - margin.bottom;


    // Nest data by month.
    const months = d3.nest()
    .key(function(d) { return d['month']; })
    .entries(data);

    for (let i = 0; i < 2; i++) {
      months[i].values.map((d, index) => {
        if (index === 0) {
          months[i].values[index]['sum'] = d['cost'];
        } else {
          months[i].values[index]['sum'] = d['cost'] + months[i].values[index - 1]['sum'];
        }
      })
    }

    console.log(months);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Scale */
    const xScale = d3.scaleTime()
    .domain([1, 31])
    .range([margin.left, len]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(months[0].values, d => d.sum + 1000)])
    .range([hei, 0]);

    /* Add SVG */
    const svg = d3.select('.chart_line').append('svg')
    .attr('width', len + margin.left + margin.right)
    .attr('height', hei + margin.top + margin.bottom)
    .append('g')
    .attr('transform', margin.left + ',' + margin.top + ')');

    /* Add line into SVG */
    const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.sum))
    .curve(d3.curveCardinal);

    const lines = svg.append('g')
    .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(months).enter()
      .append('g')
      .attr('class', 'line-group')
      .on('mouseover', function(d, i) {
        svg.append('text')
          .attr('class', 'title-text')
          .style('fill', color(i))
          .text(d.key)
          .attr('text-anchor', 'middle')
          .attr('x', margin.left + 40)
          .attr('y', 25);
      })
      .on('mouseout', function(d) {
        svg.select('.title-text').remove();
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on('mouseover', function(d) {
          d3.selectAll('.line')
              .style('opacity', otherLinesOpacityHover);
          d3.selectAll('.circle')
              .style('opacity', circleOpacityOnLineHover);
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style('stroke-width', lineStrokeHover)
            .style('cursor', 'pointer');
        })
      .on('mouseout', function(d) {
          d3.selectAll('.line')
              .style('opacity', lineOpacity);
          d3.selectAll('.circle')
              .style('opacity', circleOpacity);
          d3.select(this)
            .style('stroke-width', lineStroke)
            .style('cursor', 'none');
        });

        /* Add circles in the line */
        lines.selectAll('circle-group')
        .data(months).enter()
        .append('g')
        .style('fill', (d, i) => color(i))
        .selectAll('circle')
        .data(d => d.values).enter()
        .append('g')
        .attr('class', 'circle')
        .on('mouseover', function(d) {
            d3.select(this)
              .style('cursor', 'pointer')
              .style('font-weight', '700')
              .append('text')
              .attr('class', 'text')
              .text(`${d.month}` + ' ' + `${d.date}` + ': ' + '$' + `${d.sum.toFixed(2)}`)
              .attr('x', margin.left + 20)
              .attr('y', 20);
          })
        .on('mouseout', function(d) {
            d3.select(this)
              .style('cursor', 'none')
              .transition()
              .duration(duration)
              .selectAll('.text').remove();
          })
        .append('circle')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.sum))
        .attr('r', circleRadius)
        .style('opacity', circleOpacity)
        .on('mouseover', function(d) {
              d3.select(this)
                .transition()
                .duration(duration)
                .attr('r', circleRadiusHover);
            })
          .on('mouseout', function(d) {
              d3.select(this)
                .transition()
                .duration(duration)
                .attr('r', circleRadius);
            });

      /* Add Axis into SVG */
      const xAxis = d3.axisBottom(xScale).ticks(15).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).ticks(8);



      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + `${hei}` + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .call(yAxis)
        .append('text')
        .attr('y', 15)

        svg.append('circle')
        .attr('cx', len - 90)
        .attr('cy', hei - 70)
        .attr('r', 6)
        .style('fill', 'rgb(255, 127, 14)')
        .attr('opacity', '0.45')

        svg.append('circle')
        .attr('cx', len - 90)
        .attr('cy', hei - 50)
        .attr('r', 6)
        .style('fill', 'rgb(31, 119, 180)')
        .attr('opacity', '0.45')

        svg.append('text')
        .attr('x', len - 80)
        .attr('y', hei - 70)
        .text('May 2019')
        .style('font-size', '15px')
        .attr('fill', '#555')
        .attr('alignment-baseline', 'middle')

        svg.append('text')
        .attr('x', len - 80)
        .attr('y', hei - 50)
        .text('April 2019')
        .style('font-size', '15px')
        .attr('fill', '#555')
        .attr('alignment-baseline', 'middle')



}

  ngOnInit() {
    this.drawLineChart(this.data, 500, 400);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    this.drawLineChart(this.data, 500, 400);
  }

}

