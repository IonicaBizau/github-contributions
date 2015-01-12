/**
 *  Returns the time in the moment when it's called
 *  If `obj` is true an object is returned
 *
 */
function getDateTime(obj) {

    // get date, hour, minute, second, year, month and day
    var date = new Date()
      , hour = date.getHours()
      , min  = date.getMinutes()
      , sec  = date.getSeconds()
      , year = date.getFullYear()
      , month = date.getMonth() + 1
      , day  = date.getDate()
      ;

    // add `0` if needed
    hour  = padWithZero(hour);
    min   = padWithZero(min);
    sec   = padWithZero(sec);
    month = padWithZero(month);
    day   = padWithZero(day);

    // obj is true, return an object
    if (obj) {
        return {
            year: year,
            month: parseInt(month),
            day: parseInt(day),
            cDay: date.getDay()
        }
    }

    // return a string
    return year + "-" + month + "-" + day;
}

/**
 *  Adds `0` to stringified number if this is needed
 *
 */
function padWithZero(x) {
    return (x < 10 ? "0" : "") + x;
}

module.exports = function (options) {

    // Initialize year array and the dateObj
    var year = []
      , Now = getDateTime(true)
      , dayCount = 0
      , week = []
      , date = {
            year: Now.year - 1,
            month: Now.month - 1,
            day: Now.day,
            cDay: Now.cDay - 1,
            hour: options.time.hour
        }
      , dateObj = new Date(date.year, date.month, date.day, date.hour)
      ;

    // Each day in year
    for (var i = 0; i < 366; ++i) {

        // Get the unix stamp
        if (dateObj < new Date(2014, 2, 10)) { // Before Mar 10, 2014, GitHub treats commit date in UTC−08:00 timezone.
          var timezoneOffset = -8 * 60 + dateObj.getTimezoneOffset();
          var unixStamp = dateObj.getTime() / 1000 - timezoneOffset * 60;
        } else {
          var unixStamp = dateObj.getTime() / 1000;
        }

        // Set the unix stamp in the current day
        week[dateObj.getDay()] = {
            date: unixStamp
        };

        // We have a new week
        if (dateObj.getDay() === 6) {
            year.push(week);
            week = [];
        }

        // Update the date
        dateObj.setDate(dateObj.getDate() + 1);
    }

    // Push the last week
    if (week.length > 0) {
        year.push(week);
    }

    // Initialize dates
    options.dates = [];

    // Each point in coordinates
    for (var i = 0; i < options.coordinates.length; ++i) {
        var cPoint = options.coordinates[i];
        options.dates.push(year[cPoint.x - 1][cPoint.y - 1].date);
    }
};
