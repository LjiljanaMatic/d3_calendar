import { qamiCalculationMetrics } from './qamiMetrics/qamiCalculationMetrics.js';
import { colorAndLabels } from './qamiMetrics/colorAndLabels.js';

/**
 * Initialises QAMI widget on PSR / PSV
 * @namespace window.bulletChart
 * @class qamiWidget
 * @method constructor - sets id and data into class instance
 * @method reInit - reinitialise specific QAMI widget
 * @method createVisualization - initialises new QAMI widget
*/
window.qamiWidget = class qamiWidget extends qamiCalculationMetrics {
  constructor(id, data, settings) {
    super(data, settings);
    this.id = id;
    this.data = data;
  };
  /**
   * Builds visualisation after successfull data preparation
   * @method createVisualization
  */
  createVisualization() {
    const container = d3.select(`#${this.id}`).select('.qami-chart');
    const svgWidth = document.getElementById(this.id).clientWidth;
    const svgHeight = 200;
    const cellHeight = 25;
    const width = svgWidth - 220;
    const legendX = svgWidth - 200;
    const widthCalc = svgWidth <= 1000 ? 18 : 6;
    const preparedData = this.getPreparedData();

    const svg = container.classed('u_overflow-hidden', true)
      .append('svg')
        .classed('svg-qami', true)
        .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
        .attr('preserveAspectRatio', 'xMidYMin slice');

    preparedData.forEach((data, j) => {
      const colors = [...colorAndLabels[j].values()];
      const ranges = this.calculateRange(data);
      const yPosition = (cellHeight * 1.5) * j;
      const qamiRectGroup = svg.append('g').attr('class', 'qami-group');

      const xScale = d3.scale.linear()
        .domain([0, ranges[0]])
        .range([0, width]);

      const qamiRange = qamiRectGroup.selectAll('rect')
        .data(ranges)
        .enter().append('rect')
          .attr('class', (d, i) => colors[i]);

      qamiRange.attr('height', cellHeight)
        .attr('width', 0)
        .attr('y', yPosition)
        .attr('x', 0)
        .transition()
        .duration(1000)
        .attr('width', xScale);

      const qamiValue = qamiRectGroup.selectAll('text')
        .data(data.reverse())
        .enter().append('text')
          .attr('x', 0)
          .attr('id', (d, i) => colors[i])
          .attr('y', yPosition + 15)
          .transition()
          .duration(1000)
          .attr('x', (d, i) => xScale(ranges[i]) - 25)
          .text((d, i) => {
            const curentScale = xScale(ranges[i]);
            const nextScale = xScale(ranges[i + 1]);
            if (curentScale - nextScale <= 25 || curentScale <= 25) {
              return '';
            } else {
              const qami = colors[i] === 'bc-qami';
              if (this.isPercent(true, false) || qami) {
                return `${d}%`;
              }
              return d;
            }
          });
    });

    const qamiCell = svg.selectAll('.qami-legend')
      .data([this.data])
      .enter()
      .append('g')
        .attr('class', 'qami-legend');

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 18)
      .text(QACube.i18n.t('common_qami'));

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 47)
      .text(`${QACube.i18n.t('common_requirements')} ${QACube.i18n.t('common_specification')}`);

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 60)
      .text(d => `(${QACube.i18n.t('common_total')}: ${d.requirementCount || 0})`);

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 86)
      .text(`${QACube.i18n.t('common_test_cases')} ${QACube.i18n.t('common_execution')}`);

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 98)
      .text(d => `(${QACube.i18n.t('common_total')}: ${d.reqTC || 0})`);

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 123)
      .text(`${QACube.i18n.t('common_test_cases')} ${QACube.i18n.t('common_automation')}`);

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 136)
      .text(d => `(${QACube.i18n.t('common_total')}: ${d.reqTC || 0})`);

    qamiCell.append('svg:text')
      .attr('id', 'defText')
      .attr('x', legendX)
      .attr('y', 160)
      .text(d => {
        const defectLabel = this.isSeverity('common_severity','common_priority');
        return `${QACube.i18n.t('common_defects')} ${QACube.i18n.t(defectLabel)}`;
      });

    qamiCell.append('svg:text')
      .attr('x', legendX)
      .attr('y', 173)
      .text(d => {
        const defectValue = this.isSeverity(d.severityTotalO,d.prioTotalO);
        return `(${QACube.i18n.t('common_total')}: ${defectValue || 0})`;
      });

    const legendContainer = container.append('div')
      .attr('class', 'qamiLegendContainer');

    colorAndLabels.forEach(item => {
      for (const [key, value] of item.entries()) {
        const legendDiv = legendContainer.append('div')
          .attr('id', value)
          .attr('class', 'qamiLegend')
          .style('width', `${widthCalc}%`);

        legendDiv.append('svg')
          .attr('height', '10')
          .attr('width', '10')
          .append('rect')
            .classed(value, true)
            .attr('height', '10')
            .attr('width', '10');

        legendDiv.append('div')
          .classed('qamiLegendText', true)
          .html(QACube.i18n.t(key));
      }
    });

    // Setting padding-top for IE > 10
    if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document.documentMode === true)) {
      container.select('.qamiLegendContainer').attr('style', 'padding-top: 5%');
    };
  }
  /**
   * Reinitialise QAMI widget on Drag and drop so it can recalculate width of grid
   */
  reInit() {
    d3.select(`#${this.id}`).select('.svg-qami').remove();
    d3.select(`#${this.id}`).select('.qamiLegendContainer').remove();
    this.createVisualization();
  };
};
