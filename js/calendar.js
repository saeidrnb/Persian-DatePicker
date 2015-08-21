(function ($) {
    function PersianCalendar(language) {
        this.local = this.regional[language || ''] || this.regional[''];
    }
    PersianCalendar.prototype = new $.calendars.baseCalendar;
    $.extend(PersianCalendar.prototype,
					{
					    name: 'Persian',
					    jdEpoch: 1948320.5,
					    daysPerMonth: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
					    hasYearZero: false,
					    minMonth: 1,
					    firstMonth: 1,
					    minDay: 1,
					    regional: {
					        '': {
					            name: 'Persian',
					            epochs: ['BP', 'AP'],
					            monthNames: ['فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دي', 'بهمن', 'اسفند'],
					            monthNamesShort: ['Far', 'Ord', 'Kho', 'Tir', 'Mor', 'Sha', 'Meh', 'Aba', 'Aza', 'Day', 'Bah', 'Esf'],
					            dayNames: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
					            dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
					            dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
					            dateFormat: 'yyyy/mm/dd',
					            firstDay: 6,
					            isRTL: true
					        }
					    },
					    leapYear: function (year) {
					        var date = this._validate(year, this.minMonth,
									this.minDay, $.calendars.local.invalidYear);
					        return (((((date.year() - (date.year() > 0 ? 474
									: 473)) % 2820) + 474 + 38) * 682) % 2816) < 682;
					    },
					    weekOfYear: function (year, month, day) {
					        var checkDate = this.newDate(year, month, day);
					        checkDate.add(-((checkDate.dayOfWeek() + 1) % 7), 'd');
					        return Math.floor((checkDate.dayOfYear() - 1) / 7) + 1;
					    },
					    daysInMonth: function (year, month) {
					        var date = this._validate(year, month, this.minDay,
									$.calendars.local.invalidMonth);
					        return this.daysPerMonth[date.month() - 1]
									+ (date.month() == 12 && this.leapYear(date.year()) ? 1 : 0);
					    },
					    weekDay: function (year, month, day) {
					        return this.dayOfWeek(year, month, day) != 5;
					    },
					    toJD: function (year, month, day) {
					        var date = this._validate(year, month, day,
									$.calendars.local.invalidDate);
					        year = date.year();
					        month = date.month();
					        day = date.day();
					        var epBase = year - (year >= 0 ? 474 : 473);
					        var epYear = 474 + mod(epBase, 2820);
					        return day
									+ (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6)
									+ Math.floor((epYear * 682 - 110) / 2816)
									+ (epYear - 1) * 365
									+ Math.floor(epBase / 2820) * 1029983
									+ this.jdEpoch - 1;
					    },
					    fromJD: function (jd) {
					        jd = Math.floor(jd) + 0.5;
					        var depoch = jd - this.toJD(475, 1, 1);
					        var cycle = Math.floor(depoch / 1029983);
					        var cyear = mod(depoch, 1029983);
					        var ycycle = 2820;
					        if (cyear != 1029982) {
					            var aux1 = Math.floor(cyear / 366);
					            var aux2 = mod(cyear, 366);
					            ycycle = Math.floor(((2134 * aux1)
										+ (2816 * aux2) + 2815) / 1028522)
										+ aux1 + 1;
					        }
					        var year = ycycle + (2820 * cycle) + 474;
					        year = (year <= 0 ? year - 1 : year);
					        var yday = jd - this.toJD(year, 1, 1) + 1;
					        var month = (yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30));
					        var day = jd - this.toJD(year, month, 1) + 1;
					        return this.newDate(year, month, day);
					    }
					});
    function mod(a, b) {
        return a - (b * Math.floor(a / b));
    }
    $.calendars.calendars.persian = PersianCalendar;
    $.calendars.calendars.jalali = PersianCalendar;
})(jQuery);


(function ($) {
    $.calendarsPicker.regionalOptions['fa'] = {
        renderer: $.calendarsPicker.defaultRenderer,
        prevText: '<i class="fa fa-chevron-right"></i>', prevStatus: 'نمايش ماه قبل',
        prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
        nextText: '<i class="fa fa-chevron-left"></i>', nextStatus: 'نمايش ماه بعد',
        nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
        currentText: 'امروز', currentStatus: 'نمايش ماه جاري',
        todayText: 'امروز', todayStatus: 'نمايش ماه جاري',
        clearText: '<i class="fa fa-minus-circle"></i>', clearStatus: 'پاک کردن تاريخ جاري',
        closeText: '<i class="fa fa-times"></i>', closeStatus: 'بستن بدون اعمال تغييرات',
        yearStatus: 'نمايش سال متفاوت', monthStatus: 'نمايش ماه متفاوت',
        weekText: 'هف', weekStatus: 'هفتهِ سال',
        dayStatus: 'انتخاب D, M d', defaultStatus: 'انتخاب تاريخ',
        isRTL: true
    };
    $.calendarsPicker.setDefaults($.calendarsPicker.regionalOptions['fa']);
})(jQuery);



