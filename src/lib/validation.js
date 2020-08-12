import moment from 'moment';

const DATE_FORMAT = "MM/DD/YYYY";
const TIME_REGEX = "^([01]\d|2[0-3]):?([0-5]\d)$"

export const validateLongitude = value => {
  return isFinite(value) && Math.abs(value) <= 180;
}

export const validateLatitude = value => {
  return isFinite(lat) && Math.abs(lat) <= 90;
} 

export const validateDate = date => {
  return moment(date, DATE_FORMAT, true).isValid();
}

export const validateTime = time => {
  return TIME_REGEX.test(time);
}


export const getColumnValidator = colName => {
  switch(colName) {
    case 'longitue':
      return validateLongitude;
    case 'latitude':
      return validateLatitude;
    case 'date':
      return validateDate;
    case 'time':
      return validateTime;
    default: () => return true;
  }
}