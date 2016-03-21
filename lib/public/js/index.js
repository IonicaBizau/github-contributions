$(document).ready(function () {

    // jQuery elements
    var $btnGenerate = $(".btn-generate")
      , $btnGenerateRepo = $(".btn-generate-repo")
      , $btnGenerateText = $(".btn-generate-text")
      , $generateText = $(".generate-text")
      , $loadingText = $("#loading-text")
      , $btnToggle = $(".btn-toggle")
      , $btnClear = $(".btn-clear")
      , $ghGenerated = $(".gh-generated")
      , $days = $(".day")
      , socket = io.connect()
      ;

    // Server -- event:progres --> Client
    socket.on("progress", function (data) {
        var message = "Generating repository, please wait. Completed: " + data.value.toFixed(2) + "%";
        if (/100\.00\%/.test(message)) {
            message = "Archiving the repository. This may take a while. Please wait...";
        }
        $("#loading-text").text(message);
    });

    // Server -- event:complete --> Client
    socket.on("complete", function (data) {
        // handle error
        if (data.error) {
            $loadingText
                .css("color", "#E74C3C")
                .text("Error: " + data.error).hide().show("slow");
            return;
        }

        if (!data.mannual) {
            $loadingText
                .css("color", "#2ecc71")
                .html("Successfully generated repository. The repository has been already opened from: <p><code>" + data.output + "</code></p>");   
        } else {
            $loadingText
                .css("color", "#2ecc71")
                .html("Successfully generated repository. Please open it manually: <p><code>" + data.output + "</code></p>");
        }
    });


    /*!
     * getDayPoint
     * Returns the day coordinates.
     *
     * @name getDayPoint
     * @function
     * @param {jQuery} $day The jQuery object of the day element.
     * @return {Object} An object containing the `x` and `y` fields.
     */
    function getDayPoint($day) {
        return {
            x: $day.parent().index() + 1,
            y: $day.index() + 1
        };
    }

    /*!
     * getDayAtPoint
     * Gets the jQuery day element providing the point.
     *
     * @name getDayAtPoint
     * @function
     * @param {Object} point The object returned by the `getDayPoint` function.
     * @return {jQuery} The jQuery day element.
     */
    function getDayAtPoint(point) {
        return $("g").eq(point.x - 1).children(".day").eq(point.x - 1);
    }

    /*!
     * activateDay
     * Activates a day.
     *
     * @name activateDay
     * @function
     * @param {jQuery} $day The jQuery object of the day element.
     * @return {undefined}
     */
    function activateDay($day) {
        $day.attr("class", function (index, classNames) {
            return classNames + " active";
        });
    }

    /*!
     * deactivateDay
     * Deactivates a day.
     *
     * @name deactivateDay
     * @function
     * @param {jQuery} $day The jQuery object of the day element.
     * @return {undefined}
     */
    function deactivateDay($day) {
        $day.attr("class", function (index, classNames) {
            return classNames.replace("active",  "");
        });
    }

    /*!
     * isDayDisabled
     * Checks if the day is disabled.
     *
     * @name isDayDisabled
     * @function
     * @param {jQuery} $day The jQuery object of the day element.
     * @return {Boolean} `true` if the day is not active, or `false` otherwise.
     */
    function isDayDisabled($day) {
      return $day.attr("class").indexOf("disabled") !== -1;
    }

    /*!
     * tryToggleDay
     * Toggles an active day.
     *
     * @name tryToggleDay
     * @function
     * @param {jQuery} $day The jQuery object of the day element.
     * @return {undefined}
     */
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

    /*!
     * generateData
     * Generates nicely-formatted JSON data from coordinates.
     *
     * @name generateData
     * @function
     * @param {Object} coordinates The coordinates object.
     * @return {String} The beautified JSON.
     */
    function generateData(coordinates) {
        return JSON.stringify({
            coordinates: coordinates,
            commitsPerDay: 10
        }, null, 4);
    }

    /*!
     * padWithZero
     * Adds `0` to stringified number if this is needed
     *
     * @name padWithZero
     * @function
     * @param {String} x The input string.
     * @return {String} The padded input with 0.
     */
    function padWithZero(x) {
        return (x < 10 ? "0" : "") + x;
    }

    /*!
     * getDateTime
     *
     * @name getDateTime
     * @function
     * @param {Date} date An optional date.
     * @return {String} The stringified date.
     */
    function getDateTime(date) {

        // no date provided, create a new date
        if (!date) {
            date = new Date();
        }

        //  get year, month and day
        var year = date.getFullYear()
          , month = date.getMonth() + 1
          , day = date.getDate()
          ;

        // pad with zero
        month = padWithZero(month);
        day = padWithZero(day);

        // return the strinified date
        return year + "-" + month + "-" + day;
    }

    /*!
     * initCalendar
     * Inits the calendar days.
     *
     * @name initCalendar
     * @function
     * @return {undefined}
     */
    function initCalendar() {
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
    }

    // Handle smooth drawing
    $(document).on("mouseenter", ".day", function (evt) {
        $day = $(this);

        if (isDayDisabled($day)) {
            return;
        }

        if (evt.shiftKey) {
            activateDay($day);
        } else if (evt.ctrlKey) {
            deactivateDay($day);
        }
    });

    // .day click handler
    $(document).on("click", ".day", function () {
        tryToggleDay($(this));
    });

    // Generate data from text
    $btnGenerateText.on("click", function () {
        var text = $generateText.val()
          , coordinates = []
          , x = 3
          , xMax = 0
          , c = null
          , i = 0
          ;

        for (; i < text.length; i++) {
            c = text.charCodeAt(i);
            if (pixelFont[c]) {
                $.each(pixelFont[c].data, function (_, point) {
                    xMax = Math.max(xMax, x + point.x);
                    coordinates.push({
                        x : x + point.x,
                        y : 2 + point.y
                    });
                });
                x += pixelFont[c].width;
            }
        }

        if (xMax > 52) {
            alert("Warning: Text extends to week " + xMax
                + "; longest recommended extent is 52.");
        }

        $ghGenerated.val(generateData(coordinates));
    });

    // Toggle the calendar days
    $btnToggle.on("click", function () {
        var generated = $ghGenerated.val();

        try {
            var coordinates = JSON.parse(generated).coordinates;
        } catch (e) {
            return alert("Error: " + e.message + ".  Ensure JSON data is loaded.");
        }

        $days.each(function () {
            var $day = $(this)
              , point = getDayPoint($day)
              ;

            for (var j = 0; j < coordinates.length; ++j) {
                if (point.x === coordinates[j].x && point.y === coordinates[j].y) {
                    $day.click();
                }
            }
        });
    });

    // Clear calendar
    $btnClear.on("click", function () {
        $days.each(function () {
            deactivateDay($(this));
        });
    });

    // Generate repository
    $btnGenerate.on("click", function () {
        var dates = [];
        $(".day.active").each(function () {
            dates.push(getDayPoint($(this)));
        });
        $ghGenerated.val(generateData(dates));
    });

    // Generate repository click handler
    $btnGenerateRepo.on("click", function () {
        var generated = $ghGenerated.val();
        $loadingText
            .css("color", "black")
            .text("Generating repository, please wait.").show("slow")
            ;

        $(".progress-bar").css("width", "0");
        socket.emit("getZip", generated);
    });

    // Init the calendar
    initCalendar();
});
