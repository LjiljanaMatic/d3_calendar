/**
 * Metrics for calculating each entity for QAMI Widget
 * @class qamiCalculationMetrics
 * @param {data} - raw data provided from BE
 * @param {settings} - object that holds info if
 * severity / priority or percentage / value is enabled
*/
export class qamiCalculationMetrics {
  constructor(data, settings) {
    this.data = data;
    this.defects = settings.defects;
    this.display = settings.display;
  };
  /**
   * Prepared data based on if percentage / value is enabled
   * or if severity / priority is selected
   * @method getPreparedData
   * @return {Array} - array for calculating range and showing data
  */
  getPreparedData() {
    return [
      [this.getPfQAMI(), this.getPfQAMIRest()],
      [this.getSpecified(), this.getSpecified()],
      [this.getTCExecutionPassed(), this.getTCExecutionFailed(), this.getTCExecutionNotRun()],
      [this.getTCAutomationAuto(), this.getTCAutomationHybrid(), this.getTCAutomationManual()],
      [
        this.getCritical(),
        this.getVeryHigh(),
        this.getHigh(),
        this.getMedium(),
        this.getLow(),
        this.getNotSet()
      ]
    ];
  };
  /**
   * Calculates and sorts range array
   * @method calculateRange
   * @param {data} - each array from getPreparedData()
   * @return {Array} - sorted range array
  */
  calculateRange(data) {
    const ranges = [];
    const totalRange = data.reduce((sum, value, index) => {
      if (index !== 0) { ranges.push(sum); }
      return sum + value;
    }, 0);
    ranges.push(totalRange);

    ranges.sort(d3.descending);

    return ranges;
  };
  /**
   * Checks if severity or priority is enabled
   * @method isSeverity
   * @param {severity}
   * @param {priority}
   * @return {Boolean}
  */
  isSeverity(severity, priority) {
    return this.defects === '0' ? severity : priority;
  };
  /**
   * Checks if percent or value is enabled
   * @method isPercent
   * @param {percent}
   * @param {value}
   * @return {Boolean}
  */
  isPercent(percent, value) {
    return this.display === '0' ? percent : value;
  };
  /**
   * Calculates QAMI percentage
   * @method getPfQAMI
   * @return {Number} - QAMI percent
  */
  getPfQAMI() {
    const qami = (
      this.data.execPassed + this.data.execFailed + this.data.tcAutomate + this.data.tcHybrid
      + this.data.spec) / 3;
    return getRounded(qami, 1);
  };
  /**
   * Calculates QAMI percentage rest out of 100%
   * @method getPfQAMI
   * @return {Number} - QAMI percent rest
  */
  getPfQAMIRest() {
    return 100 - this.getPfQAMI();
  };
  /**
   * Calculates specified requirements percent or value
   * @method getSpecified
   * @return {Number} - specified value
  */
  getSpecified() {
    const enabledPercentage = getRounded(this.data.spec, 1);
    const disabledPercentage = getRounded(this.data.spec / 100 * this.data.requirementCount, 1);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
  /**
   * Calculates not specified requirements percent or value
   * @method getNotSpecified
   * @return {Number} - specified value
  */
  getNotSpecified() {
    const enabledPercentage = getRounded(this.data.notSpec, 1);
    const disabledPercentage = getRounded(this.data.notSpec / 100 * this.data.requirementCount, 1);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
  /**
   * Calculates executed Test Cases percent or value
   * @method getTCExecutionPassed
   * @return {Number} - execution passed value
  */
  getTCExecutionPassed() {
    const enabledPercentage = getRounded(this.data.execPassed, 1);
    return this.isPercent(enabledPercentage, this.data.execPassedTotal);
  };
  /**
   * Calculates failed Test Cases percent or value
   * @method getTCExecutionFailed
   * @return {Number} - execution failed value
  */
  getTCExecutionFailed() {
    const enabledPercentage = getRounded(this.data.execFailed, 1);
    return this.isPercent(enabledPercentage, this.data.execFailedTotal);
  };
  /**
   * Calculates not run Test Cases percent or value
   * @method getTCExecutionNotRun
   * @return {Number} - execution not run value
  */
  getTCExecutionNotRun() {
    const enabledPercentage = getRounded(this.data.execNoRun, 1);
    return this.isPercent(enabledPercentage, this.data.execNoRunTotal);
  };
  /**
   * Calculates automated Test Cases percent and value
   * @method getTCAutomationAuto
   * @return {Number} - automated value
  */
  getTCAutomationAuto() {
    const enabledPercentage = getRounded(this.data.tcAutomate, 1);
    return this.isPercent(enabledPercentage, this.data.tcAutomateTotal);
  };
  /**
   * Calculates hybrid Test Cases percent and value
   * @method getTCAutomationHybrid
   * @return {Number} - hybrid value
  */
  getTCAutomationHybrid() {
    const enabledPercentage = getRounded(this.data.tcHybrid, 1);
    return this.isPercent(enabledPercentage, this.data.tcHybridTotal);
  };
  /**
   * Calculates manual Test Cases percent and value
   * @method getTCAutomationManual
   * @return {Number} - manual value
  */
  getTCAutomationManual() {
    const enabledPercentage = getRounded(this.data.tcManual, 1);
    return this.isPercent(enabledPercentage, this.data.tcManualTotal);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getCritical
   * @return {Number} - Critical defects value
  */
  getCritical() {
    const enabled = this.isSeverity(this.data.severityCritical, this.data.prioCritical);
    const disabled = this.isSeverity(this.data.severityCriticalO, this.data.prioCriticalO);
    return this.isPercent(enabled, disabled);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getVeryHigh
   * @return {Number} - Very high defects value
  */
  getVeryHigh() {
    const enabled = this.isSeverity(this.data.severityVeryHigh, this.data.prioVeryHigh);
    const disabled = this.isSeverity(this.data.severityVeryHighO, this.data.prioVeryHighO);
    return this.isPercent(enabled, disabled);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getHigh
   * @return {Number} - High defects value
  */
  getHigh() {
    const enabledPercentage = this.isSeverity(this.data.severityHigh, this.data.prioHigh);
    const disabledPercentage = this.isSeverity(this.data.severityHighO, this.data.prioHighO);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getMedium
   * @return {Number} - Medium defects value
  */
  getMedium() {
    const enabledPercentage = this.isSeverity(this.data.severityMedium, this.data.prioMedium);
    const disabledPercentage = this.isSeverity(this.data.severityMediumO, this.data.prioMediumO);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getLow
   * @return {Number} - Low defects value
  */
  getLow() {
    const enabledPercentage = this.isSeverity(this.data.severityLow, this.data.prioLow);
    const disabledPercentage = this.isSeverity(this.data.severityLowO, this.data.prioLowO);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
  /**
   * Method passes priority or severity based on enabled defecs in settings
   * also priority or severity percentage based on enabled display in settings
   * @method getNotSet
   * @return {Number} - Not set defects value
  */
  getNotSet() {
    const enabledPercentage = this.isSeverity(this.data.severityNotSet, this.data.prioNotSet);
    const disabledPercentage = this.isSeverity(this.data.severityNotSetO, this.data.prioNotSetO);
    return this.isPercent(enabledPercentage, disabledPercentage);
  };
};
/**
 * Rounds number acording to its factor
 * @method getRoundedNumberByFactor
 * @param {number} - number for rounding
 * @param {factor} - factor for rounding
 * @return {Number} - rounded number
*/
const getRounded = (number, factor) => Math.round(number / factor);
