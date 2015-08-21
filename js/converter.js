$(document).ready(function () {
    var jalaliDate = new Array();
    var hijriDate = new Array();
    var gregorianDate = new Array();
    var fixd;
    $('.gregorianDate').calendarsPicker({
        dateFormat: 'yyyy/m/d', yearRange: '1970:2020',
    });
    $('#dateConverter .jalaliDate ,#dateConverter .jalaliDatePicker').calendarsPicker({
        calendar: $.calendars.instance('persian'), dateFormat: 'yyyy/m/d', yearRange: '1330:1400',
    });
    $('#dateConverter input').not('.hijriDate').click(function () {
        $('.gregorianDate,.jalaliDate,.hijriDate').val('');
    });

    $('#dateConverter input').blur(function () {
        $('.gregorianDate').val('میلادی');
        $('.jalaliDate').val('شمسی');
        $('.hijriDate').val('قمری');
    });
    //$("#dateConverter .gregorianDate").attr('disabled', 'disabled').css({ 'background': 'transparent','cursor': 'text' });
    $('#doConvert').click(function () {

        if ($('#dateConverter .gregorianDate').val() != 'میلادی') {
            gregorianDate = $('#dateConverter .gregorianDate').val().split('/');
            gregorianDate = JalaliDate.gregorianToJalali(gregorianDate[0], gregorianDate[1], gregorianDate[2]);
            $('#dateConverter .jalaliDate').val(gregorianDate[0] + '/' + gregorianDate[1] + '/' + gregorianDate[2]);
        }

        if ($('#dateConverter .jalaliDate').val() != 'شمسی') {
            jalaliDate = $('#dateConverter .jalaliDate').val().split('/');
            jalaliDate = JalaliDate.jalaliToGregorian(jalaliDate[0], jalaliDate[1], jalaliDate[2]);
            $('#dateConverter .gregorianDate').val(jalaliDate[0] + '/' + jalaliDate[1] + '/' + jalaliDate[2]);
        }

        gregorianDate = $('#dateConverter .gregorianDate').val().split('/');
        hijriDate = gregorianToHijri(parseInt(gregorianDate[0]), parseInt(gregorianDate[1]), parseInt(gregorianDate[2]));
        $('#dateConverter .hijriDate').val(hijriDate[0] + '/' + hijriDate[1] + '/' + hijriDate[2]);

    });

    JalaliDate = {
        g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    };

    JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
        j_y = parseInt(j_y);
        j_m = parseInt(j_m);
        j_d = parseInt(j_d);
        var jy = j_y - 979;
        var jm = j_m - 1;
        var jd = j_d - 1;

        var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
        for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

        j_day_no += jd;

        var g_day_no = j_day_no + 79;

        var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        g_day_no = g_day_no % 146097;

        var leap = true;
        if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
            g_day_no--;
            gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
            g_day_no = g_day_no % 36524;

            if (g_day_no >= 365)
                g_day_no++;
            else
                leap = false;
        }

        gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
        g_day_no %= 1461;

        if (g_day_no >= 366) {
            leap = false;

            g_day_no--;
            gy += parseInt(g_day_no / 365);
            g_day_no = g_day_no % 365;
        }

        for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap) ; i++)
            g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
        var gm = i + 1;
        var gd = g_day_no + 1;

        return [gy, gm, gd];
    };

    JalaliDate.checkDate = function (j_y, j_m, j_d) {
        return !(j_y < 0 || j_y > 32767 || j_m < 1 || j_m > 12 || j_d < 1 || j_d >
            (JalaliDate.j_days_in_month[j_m - 1] + (j_m == 12 && !((j_y - 979) % 33 % 4))));
    };

    JalaliDate.gregorianToJalali = function (g_y, g_m, g_d) {
        g_y = parseInt(g_y);
        g_m = parseInt(g_m);
        g_d = parseInt(g_d);
        var gy = g_y - 1600;
        var gm = g_m - 1;
        var gd = g_d - 1;

        var g_day_no = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);

        for (var i = 0; i < gm; ++i)
            g_day_no += JalaliDate.g_days_in_month[i];
        if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
            /* leap and after Feb */
            ++g_day_no;
        g_day_no += gd;

        var j_day_no = g_day_no - 79;

        var j_np = parseInt(j_day_no / 12053);
        j_day_no %= 12053;

        var jy = 979 + 33 * j_np + 4 * parseInt(j_day_no / 1461);

        j_day_no %= 1461;

        if (j_day_no >= 366) {
            jy += parseInt((j_day_no - 1) / 365);
            j_day_no = (j_day_no - 1) % 365;
        }

        for (var i = 0; i < 11 && j_day_no >= JalaliDate.j_days_in_month[i]; ++i) {
            j_day_no -= JalaliDate.j_days_in_month[i];
        }
        var jm = i + 1;
        var jd = j_day_no + 1;

        return [jy, jm, jd];
    };
    function isGregLeapYear(year) {
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }


    function gregToFixed(year, month, day) {
        var a = Math.floor((year - 1) / 4);
        var b = Math.floor((year - 1) / 100);
        var c = Math.floor((year - 1) / 400);
        var d = Math.floor((367 * month - 362) / 12);

        if (month <= 2)
            e = 0;
        else if (month > 2 && isGregLeapYear(year))
            e = -1;
        else
            e = -2;

        return 1 - 1 + 365 * (year - 1) + a - b + c + d + e + day;
    }

    function Hijri(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.toFixed = hijriToFixed;
        this.toString = hijriToString;
    }

    function hijriToFixed() {
        return this.day + Math.ceil(29.5 * (this.month - 1)) + (this.year - 1) * 354 +
            Math.floor((3 + 11 * this.year) / 30) + 227015 - 1;
    }

    function hijriToString() {

        return [this.year, this.month, this.day];
    }

    function fixedToHijri(f) {
        var i = new Hijri(1100, 1, 1);
        i.year = Math.floor((30 * (f - 227015) + 10646) / 10631);
        var i2 = new Hijri(i.year, 1, 1);
        var m = Math.ceil((f - 29 - i2.toFixed()) / 29.5) + 1;
        i.month = Math.min(m, 12);
        i2.year = i.year;
        i2.month = i.month;
        i2.day = 1;
        i.day = f - i2.toFixed() + 1;
        return i;
    }

    function gregorianToHijri(y, m, d) {
        fixd = gregToFixed(y, m, d);
        var h = new Hijri(1421, 11, 28);
        h = fixedToHijri(fixd);
        return h.toString();
    }

});

