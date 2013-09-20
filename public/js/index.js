function createContributionsGraph (howManyEmptyDays) {
    var $year = $(".gh-contributions");
    var $tmp = $("<div>");

    var now = getDateTime(true);
    now.day = parseInt(now.day);
    now.month = parseInt(now.month);

    var tmpDay = 0;
    var $week;

    var date = {
        day: now.day,
        month: now.month,
        year: now.year - 1
    };

    for (var dayId = 0 - howManyEmptyDays; dayId < 366; ++dayId) {

        var $day = $("<div>");
        if (dayId < 0) {
            $day.addClass("emptyDay");
        }
        else {
            date.day += 1;

            if (date.day > daysInMonth (date.year, date.month)) {
                date.day = 1;
                ++date.month;
                if (date.month > 12) {
                    ++date.year;
                    date.month = 1;
                }
            }



            var dateStr = date.year + "-" + date.month + "-" + date.day;
            $day.addClass("day")
                .attr("data-date", dateStr)
                .attr("title", dateStr)
                .attr("data-unix", Date.parse(dateStr) / 1000);
        }

        if (++tmpDay % 7 === 1) {
            if ($week) {
                $tmp.append($week);
            }

            $week = $("<div>").addClass("week");
        }
        $week.append($day);
    }

    $(".gh-contributions").html($tmp.html());
    $(".day").tooltip({
        placement: "bottom"
    });

}

$(document).on("click", ".day", function () {
    $(this).toggleClass("active");
})

var howMany = 0;
$(".btn-add").on("click", function () {
    createContributionsGraph(++howMany);
});

$(".btn-generate").on("click", function () {
    var dates = [];

    $(".gh-contributions .day.active").each(function () {
        dates.push(parseInt($(this).attr("data-unix")));
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
