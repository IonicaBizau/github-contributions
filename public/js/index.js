var $year = $(".gh-contributions");
var $tmp = $("<div>");

var now = getDateTime(true);
now.day = parseInt(now.day);
now.month = parseInt(now.month);

var $table = $("<table>");
var $tbody = $("<tbody>");
var dateDay = 0;

for (var day = 1; day <= 7; ++day) {

    var $row = $("<tr>");
    for (var month = 0; month < 54; ++month) {

        var dateMonth = now.month + month;
        var dateYear  = now.year - 1;

        if (dateMonth > 12) {
            dateMonth = 12 - dateMonth;
            ++dateYear;
        }

        var $td = $("<td>");
        ++dateDay;
        if (dateDay > daysInMonth(dateYear)) {
            dateDay = 1;
        }

        var dateStr = dateYear + "-" + dateMonth + "-" + dateDay;
        var $day = $("<div>")
                    .addClass("day")
                    .attr("data-date", dateStr)
                    .attr("title", dateStr)
                    .attr("data-unix", Date.parse(dateStr) / 1000);
        $td.append($day);
        $row.append($td);
    }
    $tbody.append($row);
}

$table.append($tbody);
$(".gh-contributions").append($table);

$(".day").on("click", function () {
    $(this).toggleClass("active");
}).tooltip({
    placement: "bottom"
});;

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function getDateTime(obj) {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    if (obj) {
        return {
            year: year,
            month: month,
            day: day
        }
    }
    return year + "-" + month + "-" + day;
}
