// var $container = $(".js-graph.js-calendar-graph");
// var $svg = $("<svg width='721' height='110' id='calendar-graph'>");
//
// var delta = 13;
// var g = {
//     x: 13,
//     y: 0
// };
// var rect = {
//     y: 0
// }
//
// for (var i = 0; i < 53; ++i) {
//     var $g = $("<g transform='translate(" + g.x + "," + g.y + ")'>");
//     rect.x += delta;
//     for (var j = 0; j < 7; ++j) {
//         var $rect = $('<rect class="day" width="11" height="11" y="' + rect.y + '"></rect>');
//         rect.y += delta;
//         $g.append($rect);
//     }
//     $svg.append($g);
//     g.x += delta;
// }
//
// $container.append($svg);

var $btnGenerate = $(".btn-generate");
var $btnImport = $(".btn-import");
var $ghGenerated = $(".gh-generated");
var $days = $(".day");

function getDayPoint($day) {
    return {
        x: $day.parent().index() + 1,
        y: $day.index() + 1
    };
}

function getDayAtPoint(point) {
    return $("g").eq(point.x - 1).children(".day").eq(point.x - 1);
}

$(document).on("click", ".day", function () {
    if (this.classList.contains("active")) {
        this.classList.remove("active");
    } else {
        this.classList.add("active");
    }
});

$btnGenerate.on("click", function (i, e) {
    var dates = [];
    var a = $(".active");
    for (var i = 0; i < a.length; ++i) {
        dates.push(getDayPoint($(a[i])));
    }
    $ghGenerated.val(JSON.stringify(dates, null, 4));
});

$btnImport.on("click", function () {
    var generated = $ghGenerated.val();
    var dates;

    try {
        dates = JSON.parse(generated);
    } catch (e) { return alert(e.message); }

    for (var i = 0; i < $days.length; ++i) {
        var $day = $($days[i]);
        var point = getDayPoint($day);

        for (var j = 0; j < dates.length; ++j) {
            if (point.x === dates[j].x && point.y === dates[j].y) {
                $day.click();
            }
        }
    }
});

$(function () {
    var dayOfWeek = new Date(Date.now()).getDay();
    var day = new Date();
    var $today = $("g:last > .day").eq(dayOfWeek).attr("title", getDateTime(day));
    $today[0].classList.add("today");
    var $prevDaysInWeek = $today.prevAll(".day");
    $prevDaysInWeek.each(function (i, e) {
        day = new Date();
        day.setDate(day.getDate() - i - 1);
        $(e).attr("title", getDateTime(day));
    });
    var $prevWeeks = $today.parent().prevAll("g");
    $prevWeeks.each(function (i, e) {
        var $daysInWeek = $(e).children(".day");
        for (var i = $daysInWeek.length - 1; i >= 0; i--) {
            day.setDate(day.getDate() - 1);
            if (day.getFullYear() < new Date().getFullYear()) {
                $daysInWeek[i].classList.add("today");
            }
            $daysInWeek.eq(i).attr("title", getDateTime(day));
        }
    });

    $days.tooltip({
        placement: "bottom",
        container: "body" // http://stackoverflow.com/questions/17120821/bootstrap-tooltip-not-showing-on-svg-hover
    });
});

function padWithZero(x) {
    return (x < 10 ? "0" : "") + x;
}

function getDateTime(date) {
    if (!date) {
        date = new Date();
    }

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = padWithZero(month);

    var day  = date.getDate();
    day = padWithZero(day);

    return year + "-" + month + "-" + day;
}
