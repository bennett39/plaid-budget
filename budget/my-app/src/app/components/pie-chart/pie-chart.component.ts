import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  constructor() { }

  ngOnInit() {
    this.drawCatPieChart(this.data, 800, 800);
  }

  drawCatPieChart(data, len, hei) {

    d3.select('svg.pie_chart').remove();

    const radius = Math.min(len - 300, hei - 300) / 2;

    const color = d3.scaleOrdinal()
        .range(['#004c6d',
        '#2d6484',
        '#4c7c9b',
        '#6996b3',
        '#86b0cc',
        '#a3cbe5',
        '#c1e7ff']);

    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(150);

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    const pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.total; });

    const svg = d3.select('.pie_chart').append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 150 800 800')
        .append('g')
        .attr('transform', 'translate(' + len / 2 + ',' + hei / 2 + ')');

    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
        .attr('d', arc)
        .style('fill', function(d) { return color(d.data['category']); });

    g.append('text')
        .text(function(d) { return d.data['category'] + ' ' + '(' + d.data['total'] + ')'; })
        .attr('transform', function(d) {
          const pos = outerArc.centroid(d);
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 1.25;
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
      .style('text-anchor', function(d) {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 1.25;
          return (midangle < Math.PI ? 'start' : 'end');
      })
      .attr('text-anchor', function(d) {
          // are we past the center?
          return (d.endAngle + d.startAngle) / 1.25 > Math.PI ?
              'end' : 'start';
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '1.75em')
      .style('font-weight', '700')
      .style('color', '#fff');

      g.append('polyline')
        .attr('stroke', 'black')
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', function(d) {
          const posA = arc.centroid(d); // line insertion in the slice
          const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(d); // Label position = almost the same as posB
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 1.25;
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC];
        });



  }

}
