/**
 * ES6 responsive D3 calendar
 * Initialises responsive calendar which shows curent and 6 previous months
 * prerequest: div with class calendarWrapper and defined width and height
 * @namespace window.rcbCalendar
 * @method rcbCalendar
 * @return {Function} init
*/
window.rcbCalendar = function() {
  this.initialState = () => {
    this.buildChart();
  };

  /**
   * Builds calendar chart
   * @method buildChart
  */
  this.buildChart = () => {
    const svgWidth = 1200;
    const svgHeight = 175;
    const margin = { top: 16, bottom: 16 }
    const heightScale = svgHeight - margin.top - margin.bottom;

    const scaleX = d3.scale.ordinal()
      .domain(d3.range(0, 6))
      .rangeBands([0, 225 / 1.9]);
    const scaleY = d3.scale.ordinal()
      .domain(d3.range(1, 8))
      .rangeBands([heightScale, 0]);

    const scaleDays = d3.scale.ordinal()
      .domain([Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday])
      .rangeBands([heightScale, 0]);

    const scaleMonth = d3.scale.ordinal()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .range([January,February,March,April,May,June,July,August,September,October,November,December]);

    const svg = d3.select('.calendarWrapper')
      .append('svg')
        .classed('svg', true)
        .attr('viewBox',`0 0 ${svgWidth} ${svgHeight}`)
        .attr('preserveAspectRatio', 'xMidYMin slice');

    const canvas = svg.append('g')
      .attr('class', 'calendarDays')
      .attr('transform', 'translate(0,20)');

    const yAxisProp = d3.svg.axis()
      .scale(scaleDays)
      .orient('left')
      .ticks(7)
      .innerTickSize(0)
      .outerTickSize([0]);

    const yAxis = canvas.append('g')
      .classed('yAxisCal', true)
      .call(yAxisProp);

    yAxis.selectAll('text')
      .attr('dx', 30)
      .attr('dy', 15)
      .style('text-anchor', 'left');

    const calendarMonths = svg.append('g')
      .attr('class', 'calendarMonths')
      .attr('transform', 'translate(30,15)');

    /**
     * Loops backwards for current and 6 previous months
     * Example: first month will be December and last June
    */
    for (let i = 7, counter = 0; i > 0; i--, counter++) {
      const d = new Date();
      const fromDate = new Date(d.setMonth(d.getMonth() - (i - 1)));
      const fromMonth = fromDate.getMonth();
      const fromYear = fromDate.getFullYear();
  
      const dd = new Date();
      const toDate = new Date(dd.setMonth(dd.getMonth() - (i - 2)));
      const toMonth = toDate.getMonth();
      const toYear = toDate.getFullYear();

      const dates = d3.time.scale()
        .domain([new Date(fromYear, fromMonth, 1), new Date(toYear, toMonth, 0)])
        .ticks(d3.time.day, 1);

      const monthGroup = calendarMonths.append('g')
        .attr('class', 'month');

      let canvas = monthGroup.append('g')
        .attr('class', 'canvas' + fromMonth)
        .attr('transform', `translate(${(120 * counter) + 20},15)`);

      let monthLabel = monthGroup.append('g')
        .attr('class', 'monthLabel')
        .attr('transform', `translate(${(120 * counter) + 40},10)`);

      monthLabel.append('text')
        .attr('class', 'monthLabel')
        .text(scaleMonth(dates[0].getMonth()))
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'black')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('opacity', 1)
        .attr('font-size', 12);

      dates.forEach(function(date) {
        let currentDate = date.getDate();
        // Set number of week days. Monday is 1 and Sunday 7
        let weekDay = date.getDay() === 0 ? 7 : date.getDay();
        // Set number of weeks in month. First week is 0 and last is 4 or 5
        let weekNumber = Math.ceil((currentDate - weekDay) / 7);
        // class format 02-05-2017
        const formatDay = ('0' + currentDate).slice(-2);
        const formatMonth = ('0' + (fromMonth+1)).slice(-2);
        const formatedDate = `${formatDay}-${formatMonth}-${fromYear}`;

        let rect = canvas.append('rect')
          .classed(`date_${formatedDate}`, true)
          .attr('width', 19)
          .attr('height', 19)
          .attr('x', scaleX(weekNumber))
          .attr('y', scaleY(weekDay))
          .attr('rx', 0)
          .attr('ry', 0)
          .style('fill-opacity', 0.6)
          .style('stroke-width', 1)
          .attr('stroke', 'white')
          .attr('fill', '#ecf0f1')
          .on('click', function() {
            // reset previously selected date style
            d3.select('.selected').attr('stroke', 'white');
            d3.select('.selected').classed('selected', false)
              .on('mouseout',  function() {
                d3.select(this).attr('stroke', 'white');
              })
              .on('mouseover', function() {
                d3.select(this).attr('stroke', 'orange');
              });
            // selected date style
            d3.select(this).classed('selected', true)
              .attr('stroke', 'black')
              .on('mouseout', function() {
                d3.select(this)
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
              })
              .on('mouseover', function() {
                d3.select(this)
                  .attr('stroke', 'black')
                  .attr('stroke-width', 1);
              });
          })
          .on('mouseout', function() {
            d3.select(this).attr('stroke', 'white');
          })
          .on('mouseover', function() {
            d3.select(this).attr('stroke', 'orange');
          });

        let label = canvas.append('text')
          .attr('class', 'labelVal no-select')
          .text(currentDate)
          .attr('x', scaleX(weekNumber))
          .attr('y', scaleY(weekDay))
          .attr('fill', 'black')
          .attr('style', 'user-select: none;')
          .attr('style', 'pointer-events: none;')
          .attr('dx', 7)
          .attr('dy', 15)
          .attr('opacity', 1)
          .attr('font-size', 10)
          .attr('text-anchor', 'middle');
      });
    };
  };
  return {
    init: this.initialState
  };
};