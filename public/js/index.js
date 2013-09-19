var $year = $(".gh-contributions");
var $tmp = $("<div>");

var now = getDateTime(true);
now.day = parseInt(now.day);
now.month = parseInt(now.month);

var tmpDay = 0;
var $week;
for (var month = 0; month <= now.month; ++month) {

    var dateMonth = now.month + month;
    var dateYear  = now.year - 1;

    if (dateMonth > 12) {
        dateMonth = dateMonth - 12;
        ++dateYear;
    }


    for (var day = 1; day < daysInMonth(dateYear, month); ++day) {
        if (++tmpDay % 7 === 1) {
            if ($week) {
                $tmp.append($week);
            }

            $week = $("<div>").addClass("week");
        }

        var dateStr = dateYear + "-" + dateMonth + "-" + day;
        var $day = $("<div>")
                    .addClass("day")
                    .attr("data-date", dateStr)
                    .attr("title", dateStr)
                    .attr("data-unix", Date.parse(dateStr) / 1000);

        $week.append($day);
    }
}

$(".gh-contributions").html($tmp.html());

$(".day").on("click", function () {
    $(this).toggleClass("active");
}).tooltip({
    placement: "bottom"
});

$(".btn-generate").on("click", function () {
    var dates = [];

    $(".gh-contributions .day.active").each(function () {
        dates.push($(this).attr("data-unix"));
    });

    console.log(JSON.stringify(dates));
});

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
