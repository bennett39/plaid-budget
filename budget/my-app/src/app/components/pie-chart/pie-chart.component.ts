import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private catCount = [];

  constructor() { }

  ngOnInit() {
    this.drawCatPieChart(this.data, 400, 400);
  }

  drawCatPieChart(data, len, hei) {

    console.log(data);

    d3.select('svg.pie_chart').remove();

    const radius = Math.min(len, hei) / 2;

    const color = d3.scaleOrdinal()
      .range(['#4286f4', '#4d9b5e', '#9b4d56', '#c4a65c', '#603ba5', '#ea9d38']);

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const labelArc = d3.arc()
      .outerRadius(radius - 60)
      .innerRadius(radius - 60);

    const pie = d3.pie()
      .sort(null)
      .value(function (d) { return d.total; });

    const svg = d3.select('.pie_chart').append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 400 400')
      .append('g')
      .attr('transform', 'translate(' + len / 2 + ',' + hei / 2 + ')');

    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', function (d) { return color(d.data['category']); });

    g.append('text')
      .attr('transform', function (d) { return 'translate(' + labelArc.centroid(d) + ')'; })
      .text(function (d) { return d.data['category']; })
      .style('font-size', '1.2em')
      .style('font-weight', '700');
  }

}

