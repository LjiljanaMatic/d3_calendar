  /**
   * Defined label and color scale for QAMI Widget
   * in order in witch bars are written
   * @const colorAndLabels
  */
export const colorAndLabels = [
  new Map([['', 'bc-nothing'], ['portfolio_view_legend_qami', 'bc-qami']]),
  new Map([['portfolio_view_legend_not_spec', 'bc-not-spec'], ['common_specified', 'bc-spec']]),
  new Map([
    ['portfolio_view_legend_no_run', 'bc-no-run'],
    ['common_failed', 'bc-failed'],
    ['common_passed', 'bc-passed']
  ]),
  new Map([
    ['common_manual', 'bc-manual'],
    ['common_hybrid', 'bc-hybrid'],
    ['common_automated', 'bc-auto']
  ]),
  new Map([
    ['common_no_priority', 'bc-not-set'],
    ['common_low', 'bc-low'],
    ['common_medium', 'bc-medium'],
    ['common_high', 'bc-high'],
    ['common_veryhigh', 'bc-very-high'],
    ['common_critical', 'bc-urgent']
  ])
];
