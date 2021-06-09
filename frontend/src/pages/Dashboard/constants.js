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
    }
];

export const CUSTOM_DATE_RANGE = DATE_OPTIONS[1].value;

export function formatDateRange(option = 0, format = {withSpaces: false, forDateTime: false}) {

    const selectedFormat = format.forDateTime ? DATETIME_DATE_FORMAT : DATE_FORMAT;

    if( option == 1 ) {

        const today = moment();
        const thirtyDaysAgo = moment().subtract(30, 'days');

        if( format.withSpaces ) {
            return `${thirtyDaysAgo.format(selectedFormat)} - ${today.format(selectedFormat)}`;
        }       


        return `${thirtyDaysAgo.format(selectedFormat)}-${today.format(selectedFormat)}`
    }

    return "";
}
