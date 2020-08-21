import moment from 'moment';

const DATE_FORMAT = "MM/DD/YYYY";
const TIME_REGEX = new RegExp("^([01]\d|2[0-3]):?([0-5]\d)$")


export const getColumnValidation = (colName, value) => {
  switch(colName) {
    case 'longitude':
      return isFinite(value) && Math.abs(value) <= 180;
    case 'latitude':
      return isFinite(value) && Math.abs(value) <= 90;
    case 'date':
      return moment(value, DATE_FORMAT, true).isValid();
    case 'time':
      return TIME_REGEX.test(value);
    default:
      return true
  }
}