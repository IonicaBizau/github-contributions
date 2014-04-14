// jQuery elements
var $btnGenerate        = $(".btn-generate")
  , $btnGenerateRepo    = $(".btn-generate-repo")
  , $loadingText        = $("#loading-text")
  , $btnImport          = $(".btn-import")
  , $ghGenerated        = $(".gh-generated")
  , $days               = null
  ;

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

// .day click handler
$(document).on("click", ".day", function () {

    // get the clicked day
    var $thisDay = $(this);

    // return if the day is disabled
    if ($thisDay.attr("class").indexOf('disabled') !== -1) { return; }

    // toggle class active
    if ($thisDay.attr("class").indexOf("active") !== -1) {
        $thisDay.attr("class", function (index, classNames) {
            return classNames.replace("active",  "");
        });
    } else {
        $thisDay.attr("class", function (index, classNames) {
            return classNames + " active";
        });
    }
});

// generate click handler
$btnGenerate.on("click", function () {

    // get the dates
    var dates = [];
    $(".active").each(function () {
        dates.push(getDayPoint($(this)));
    });

    // stringify the dates
    $ghGenerated.val(
        JSON.stringify({
            coordinates: dates
          , commitsPerDay: 2
        }, null, 4)
    );
});

// generate repository click handler
$btnGenerateRepo.on("click", function () {

    // get the generated data
    var generated = $ghGenerated.val();

    // show loading
    $loadingText
        .css("color", "black")
        .text("Generating repository, please wait.").show("slow");

    // and make the ajax call
    $.ajax({

        // type post
        type: "POST"

        // to url
      , url: "/get-zip"

        // with data
      , data: generated

        // set content type: json
      , contentType: "json"

        // with data type: json
      , dataType: "json"

        // set the success handler
      , success: function (data) {

            // show the download link
            $loadingText
                .css("color", "green")
                .html("Successfully generated repository. Click <a href='" + data.output + "'>here</a> to download the repository.");
        }

        // set the error handler
      , error: function (data) {

            // get the json response
            data = data.responseJSON || {};

            // and show message
            $loadingText
                .css("color", "red")
                .text("Error: " + data.error).hide().show("slow");
        }
    });
});

// button import click handler
$btnImport.on("click", function () {

    // get the generated array and get all days
    var generated = $ghGenerated.val()
      ;

    try {
        var dates = JSON.parse(generated);
    } catch (e) { return alert(e.message); }

    $days.each(function () {

        // get the current day
        var $day = $(this)
          , point = getDayPoint($day)
          ;

        // each date
        for (var j = 0; j < dates.length; ++j) {

            // we found this day
            if (point.x === dates[j].x && point.y === dates[j].y) {
                // click it
                $day.click();
            }
        }
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
