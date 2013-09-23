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

function getDayPoint($day) {
    return {
        x: $day.parent().index() + 1,
        y: $day.index() + 1
    };
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

    var a = $(".day");
    for (var i = 0; i < a.length; ++i ) {
        var $day = $(a[i]);
        var point = getDayPoint($day);

        for (var j = 0; j < dates.length; ++j) {
            if (point.x === dates[j].x && point.y === dates[j].y) {
                $day.click();
            }
        }
    }
});
