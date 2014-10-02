// jQuery elements
var $btnGenerate        = $(".btn-generate")
  , $btnGenerateRepo    = $(".btn-generate-repo")
  , $loadingText        = $("#loading-text")
  , $btnToggle          = $(".btn-toggle")
  , $btnClear           = $(".btn-clear")
  , $ghGenerated        = $(".gh-generated")
  , $days               = null
  , socket              = io.connect();

// listen for progress
socket.on("progress", function(data) {

    // get the progress bar element
    var $progress = $(".progress-bar");

    // set the value and the message
    $progress
        .css("width", data.value + "%")
        .text(data.message);

});

socket.on("complete", function (data) {

    // handle error
    if (data.error) {
        $loadingText
            .css("color", "red")
            .text("Error: " + data.error).hide().show("slow");
        return;
    }

    $loadingText
        .css("color", "green")
        .html("Successfully generated repository. Click <a href='" + data.output + "'>here</a> to download the repository.");
});

/**
 *  Returns an object containing `x` and `y` fields that represent the
 *  point coordinates of the commit
 *
 */
function getDayPoint($day) {
    return {
        x: $day.parent().index() + 1,
        y: $day.index() + 1
    };
}

/**
 *  Converts a point to a day jQuery element
 *
 */
function getDayAtPoint(point) {
    return $("g").eq(point.x - 1).children(".day").eq(point.x - 1);
}

function activateDay($day) {
    $day.attr("class", function (index, classNames) {
        return classNames + " active";
    });
}
function deactivateDay($day) {
    $day.attr("class", function (index, classNames) {
        return classNames.replace("active",  "");
    });
}

function isDayDisabled($day) {
  return $day.attr("class").indexOf('disabled') !== -1;
}

function tryToggleDay($day) {
    // return if the day is disabled
    if (isDayDisabled($day)) { return; }

    // toggle class active
    if ($day.attr("class").indexOf("active") !== -1) {
        deactivateDay($day);
    } else {
        activateDay($day);
    }
}

// Deactivate tooltips if the smooth painting/erasure mode has been activated
// and vice versa
$(document).on("keydown keyup", function (evt) {
    if (evt.shiftKey || evt.ctrlKey) {
        $(".day").tooltip('disable');
    }
    else {
        $(".day").tooltip('enable');
    }
});

$(document).on("mouseenter", ".day", function (evt) {
    $day = $(this);
    if (isDayDisabled($day)) {
        return;
    }

    if (evt.shiftKey) {
      activateDay($day);
    }
    else if (evt.ctrlKey) {
      deactivateDay($day);
    }
});

// .day click handler
$(document).on("click", ".day", function () {
    tryToggleDay($(this));
});

// generate click handler
$btnGenerate.on("click", function () {

    // get the dates
    var dates = [];
    $(".day.active").each(function () {
        dates.push(getDayPoint($(this)));
    });

    // stringify the dates
    $ghGenerated.val(generateData(dates));
});

// generate repository click handler
$btnGenerateRepo.on("click", function () {

    // get the generated data
    var generated = $ghGenerated.val();

    // show loading
    $loadingText
        .css("color", "black")
        .text("Generating repository, please wait.").show("slow");

    // reset the progress value
    $(".progress-bar").css("width", "0");

    socket.emit("getZip", generated);
});

// button toggle click handler
$btnToggle.on("click", function () {

    // get the generated array and get all days
    var generated = $ghGenerated.val();

    try {
        var coordinates = JSON.parse(generated).coordinates;
    } catch (e) {
        return alert('Error: ' + e.message + '.  Ensure JSON data is loaded.');
    }

    // each day
    $days.each(function () {

        // get the current day
        var $day = $(this)
          , point = getDayPoint($day)
          ;

        // each date
        for (var j = 0; j < coordinates.length; ++j) {

            // we found this day
            if (point.x === coordinates[j].x && point.y === coordinates[j].y) {

                // click it
                $day.click();
            }
        }
    });
});

// clear calendar click handler
$btnClear.on("click", function () {

    $days.each(function () {
        deactivateDay($(this));
    });
});

$(function () {

    var day = new Date()
      , dayOfWeek = day.getDay()
      , $today = $("g:last > .day").eq(dayOfWeek).attr("title", getDateTime(day))
      , $prevDaysInWeek = $today.prevAll(".day")
      , $prevWeeks = $today.parent().prevAll("g")
      , enabledDays = 1
      ;

    // add today and disabled classes
    $today.attr("class", function (index, classNames) {
        return classNames + " today";
    });
    $today.nextAll(".day").attr("class", function (index, classNames) {
        return classNames + " disabled";
    });

    var i = 0;
    // each day
    $prevDaysInWeek.each(function () {

        // get the current day
        day = new Date();

        // set its date
        day.setDate(day.getDate() - (i++) - 1);

        // add title attribute
        $(this).attr("title", getDateTime(day));

        ++enabledDays;
    });

    // each week
    $prevWeeks.each(function () {

        // get the days of this week
        var $daysInWeek = $(this).children(".day");

        // each day
        for (var i = $daysInWeek.length - 1; i >= 0; i--) {

            // set the new date
            day.setDate(day.getDate() - 1);

            // today
            if (day.getFullYear() < new Date().getFullYear()) {
                $($daysInWeek[i]).attr("class", function (index, classNames) {
                    return classNames + " today";
                });
            }

            // add title attribute
            $daysInWeek.eq(i).attr("title", getDateTime(day));

            // disable day
            if (enabledDays >= 366) {
                $daysInWeek[i].classList.add("disabled");
            }
            ++enabledDays;
        }
    });

    // get all days
    $days = $(".day");

    // init tooltip
    $days.not(".disabled").tooltip({
        placement: "bottom",
        container: "body"
    });
});

/**
 *  Generates nicely-formatted JSON data from coordinates.
 *
 */
function generateData(coordinates) {
    var lines = [
        '{',
        '    "coordinates": ['
    ];

    for (var i = 0; i < coordinates.length; i++) {
        var c = coordinates[i];
        lines.push('        { "x": ' + c.x
            + ', "y": ' + c.y
            + (i == coordinates.length - 1 ? ' }' : ' },'));
    }

    lines.push('    ],');
    lines.push('    "commitsPerDay": 2');
    lines.push('}');

    return lines.join('\n');
}

/**
 *  Adds `0` to stringified number if this is needed
 *
 */
function padWithZero(x) {
    return (x < 10 ? "0" : "") + x;
}

/**
 *  Returns a stringified date
 */
function getDateTime(date) {

    // no date provided, create a new date
    if (!date) {
        date = new Date();
    }

    //  get year, month and day
    var year = date.getFullYear()
      , month = date.getMonth() + 1
      , day  = date.getDate()
      ;

    // pad with zero
    month = padWithZero(month);
    day   = padWithZero(day);

    // return the strinified date
    return year + "-" + month + "-" + day;
}
