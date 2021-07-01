import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YYYY';
const DATETIME_DATE_FORMAT = 'YYYY/MM/DD';

export const DATE_OPTIONS = [
  {
    label: 'Last 30 Days',
    value: 1,
  },
  {
    label: 'Custom Date Range',
    value: 2,
  },
];

export const CUSTOM_DATE_RANGE = DATE_OPTIONS[1].value;

export function formatDateRange(lastThirtyDays = 0, format = {
  withSpaces: false, forDateTime: false, sep: '-', string: '',
}) {
  const selectedFormat = format.forDateTime ? DATETIME_DATE_FORMAT : DATE_FORMAT;

  let { sep } = format;

  if (!format.sep) {
    sep = '-';
  }

  if (lastThirtyDays === 1) {
    const today = moment();
    const thirtyDaysAgo = moment().subtract(30, 'days');

    if (format.withSpaces) {
      return `${thirtyDaysAgo.format(selectedFormat)} ${sep} ${today.format(selectedFormat)}`;
    }

    return `${thirtyDaysAgo.format(selectedFormat)}${sep}${today.format(selectedFormat)}`;
  }

  if (format.string) {
    const dates = format.string.split('-');

    if (dates && dates.length > 1) {
      if (format.withSpaces) {
        return `${moment(dates[0]).format(selectedFormat)} ${sep} ${moment(dates[1]).format(selectedFormat)}`;
      }

      return `${moment(dates[0]).format(selectedFormat)}${sep}${moment(dates[1]).format(selectedFormat)}`;
    }
  }

  return '';
}
