import format from 'date-fns/format';

export const displayTotaltime = seconds => {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  var hDisplay = h > 0 ? h + (h == 1 ? ' hr, ' : ' hrs, ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' min, ' : ' mins, ') : '';
  return dDisplay + hDisplay + mDisplay;
};

export const formatDate = date => {
  try {
    let formatedDate = format(new Date(date), 'dd MMM, yyyy');
    return formatedDate;
  } catch (error) {
    return '';
  }
  
};

export const formatDateV2 = date => {
  let formatedDate = format(new Date(date), 'yyyy-MM-dd');
  return formatedDate;
};

export const fullDateTime = () => {
  var d = new Date();
  var n = d.toLocaleString([], {hour12: true});
  return n;
};

export const formatDateV3 = date => {
  console.log(date, 'date');
  let formatedDate = format(new Date(date), 'dd MMM, yyyy hh:mm:ss 	aa');
  return formatedDate;
};
export const formatDateV6 = () => {
  let formatedDate = format(new Date(), 'dd MMM, yyyy hh:mm:ss 	a..aa');
  return formatedDate;
};
export const formatDateV5 = date => {
  let formatedDate = format(new Date(date), 'dd MMM, yy hh:mm:ss 	aa');
  return formatedDate;
};

export const formatDateV4 = date => {
  let formatedDate = format(new Date(date), 'MMM do');
  return formatedDate;
};

export const formatCustomDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
};

export const formatCustomDateWithTime = () => {
  let todayWithTime = new Date();
  let dd = String(todayWithTime.getDate()).padStart(2, '0');
  let mm = String(todayWithTime.getMonth() + 1).padStart(2, '0');
  let yyyy = todayWithTime.getFullYear();
  let hh = String(todayWithTime.getHours()).padStart(2, '0');
  let min = String(todayWithTime.getMinutes()).padStart(2, '0');
  todayWithTime = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min;
  return todayWithTime;
};

export const formatCustomDateWithTimeV2 = date => {
  let todayWithTime = new Date(date);
  let dd = String(todayWithTime.getDate()).padStart(2, '0');
  let mm = String(todayWithTime.getMonth() + 1).padStart(2, '0');
  let yyyy = todayWithTime.getFullYear();
  let hh = String(todayWithTime.getHours()).padStart(2, '0');
  let min = String(todayWithTime.getMinutes()).padStart(2, '0');
  todayWithTime = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min;
  return todayWithTime;
};

export const getFullAddress = data => {
  let result = '';
  if (data?.house_no) {
    result = '#' + data?.house_no;
  }
  if (data?.street) {
    result = result + ', ' + data?.street;
  }
  if (data?.landmark) {
    result = result + ', ' + data?.landmark;
  }
  if (data?.city) {
    result = result + ', ' + data?.city;
  }
  if (data?.pincode) {
    result = result + ', ' + data?.pincode;
  }
  if (data?.district) {
    result = result + ', ' + data?.district;
  }
  if (data?.state) {
    result = result + ', ' + data?.state;
  }
  return result;
};
