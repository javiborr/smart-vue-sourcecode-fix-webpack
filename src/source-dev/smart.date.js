
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

const localTimezoneOffset = -1 * new Date().getTimezoneOffset();

const __timeZones = [
    { id: 'Local', offset: localTimezoneOffset, offsetHours: localTimezoneOffset / 60, displayName: '', supportsDaylightSavingTime: false },
    { id: 'Dateline Standard Time', offset: -720, offsetHours: -12, displayName: '(UTC-12:00) International Date Line West', supportsDaylightSavingTime: false },
    { id: 'UTC-11', offset: -660, offsetHours: -11, displayName: '(UTC-11:00) Coordinated Universal Time-11', supportsDaylightSavingTime: false },
    { id: 'Hawaiteratoran Standard Time', offset: -600, offsetHours: -10, displayName: '(UTC-10:00) Hawaiterator', supportsDaylightSavingTime: false },
    { id: 'Alaskan Standard Time', offset: -540, offsetHours: -9, displayName: '(UTC-09:00) Alaska', supportsDaylightSavingTime: true },
    { id: 'Pacific Standard Time (Mexico)', offset: -480, offsetHours: -8, displayName: '(UTC-08:00) Baja California', supportsDaylightSavingTime: true },
    { id: 'Pacific Standard Time', offset: -480, offsetHours: -8, displayName: '(UTC-08:00) Pacific Time (US & Canada)', supportsDaylightSavingTime: true },
    { id: 'US Mountain Standard Time', offset: -420, offsetHours: -7, displayName: '(UTC-07:00) Arizona', supportsDaylightSavingTime: false },
    { id: 'Mountain Standard Time (Mexico)', offset: -420, offsetHours: -7, displayName: '(UTC-07:00) Chihuahua, La Paz, Mazatlan', supportsDaylightSavingTime: true },
    { id: 'Mountain Standard Time', offset: -420, offsetHours: -7, displayName: '(UTC-07:00) Mountain Time (US & Canada)', supportsDaylightSavingTime: true },
    { id: 'Central Standard Time', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Central Time (US & Canada)', supportsDaylightSavingTime: true },
    { id: 'Central America Standard Time', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Central America', supportsDaylightSavingTime: false },
    { id: 'Canada Central Standard Time', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Saskatchewan', supportsDaylightSavingTime: false },
    { id: 'Central Standard Time (Mexico)', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Guadalajara, Mexico City, Monterrey', supportsDaylightSavingTime: true },
    { id: 'SA Pacific Standard Time', offset: -300, offsetHours: -5, displayName: '(UTC-05:00) Bogota, Lima, Quito, Rio Branco', supportsDaylightSavingTime: false },
    { id: 'Eastern Standard Time', offset: -300, offsetHours: -5, displayName: '(UTC-05:00) Eastern Time (US & Canada)', supportsDaylightSavingTime: true },
    { id: 'US Eastern Standard Time', offset: -300, offsetHours: -5, displayName: '(UTC-05:00) Indiana (East)', supportsDaylightSavingTime: true },
    { id: 'Venezuela Standard Time', offset: -270, offsetHours: -4.5, displayName: '(UTC-04:30) Caracas', supportsDaylightSavingTime: false },
    { id: 'Atlantic Standard Time', offset: -240, offsetHours: -4, displayName: '(UTC-04:00) Atlantic Time (Canada)', supportsDaylightSavingTime: true },
    { id: 'Paraguay Standard Time', offset: -240, offsetHours: -4, displayName: '(UTC-04:00) Asuncion', supportsDaylightSavingTime: true },
    { id: 'Central Brazilian Standard Time', offset: -240, offsetHours: -4, displayName: '(UTC-04:00) Cuiaba', supportsDaylightSavingTime: true },
    { id: 'Pacific SA Standard Time', offset: -240, offsetHours: -4, displayName: '(UTC-04:00) Santiago', supportsDaylightSavingTime: true },
    { id: 'SA Western Standard Time', offset: -240, offsetHours: -4, displayName: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan', supportsDaylightSavingTime: false },
    { id: 'Newfoundland Standard Time', offset: -210, offsetHours: -3.5, displayName: '(UTC-03:30) Newfoundland', supportsDaylightSavingTime: true },
    { id: 'SA Eastern Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Cayenne, Fortaleza', supportsDaylightSavingTime: false },
    { id: 'Argentina Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Buenos Aires', supportsDaylightSavingTime: true },
    { id: 'E. South America Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Brasilia', supportsDaylightSavingTime: true },
    { id: 'Bahia Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Salvador', supportsDaylightSavingTime: true },
    { id: 'Montevideo Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Montevideo', supportsDaylightSavingTime: true },
    { id: 'Greenland Standard Time', offset: -180, offsetHours: -3, displayName: '(UTC-03:00) Greenland', supportsDaylightSavingTime: true },
    { id: 'UTC-02', offset: -120, offsetHours: -2, displayName: '(UTC-02:00) Coordinated Universal Time-02', supportsDaylightSavingTime: false },
    { id: 'Mid-Atlantic Standard Time', offset: -120, offsetHours: -2, displayName: '(UTC-02:00) Mid-Atlantic - Old', supportsDaylightSavingTime: true },
    { id: 'Azores Standard Time', offset: -60, offsetHours: -1, displayName: '(UTC-01:00) Azores', supportsDaylightSavingTime: true },
    { id: 'Cape Verde Standard Time', offset: -60, offsetHours: -1, displayName: '(UTC-01:00) Cape Verde Is.', supportsDaylightSavingTime: false },
    { id: 'Morocco Standard Time', offset: 0, offsetHours: 0, displayName: '(UTC) Casablanca', supportsDaylightSavingTime: true },
    { id: 'UTC', offset: 0, offsetHours: 0, displayName: '(UTC) Coordinated Universal Time', supportsDaylightSavingTime: false },
    { id: 'GMT Standard Time', offset: 0, offsetHours: 0, displayName: '(UTC) Dublin, Edinburgh, Lisbon, London', supportsDaylightSavingTime: true },
    { id: 'Greenwich Standard Time', offset: 0, offsetHours: 0, displayName: '(UTC) Monrovia, Reykjavik', supportsDaylightSavingTime: false },
    { id: 'Central European Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb', supportsDaylightSavingTime: true },
    { id: 'Namibia Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) Windhoek', supportsDaylightSavingTime: true },
    { id: 'W. Central Africa Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) West Central Africa', supportsDaylightSavingTime: false },
    { id: 'W. Europe Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', supportsDaylightSavingTime: true },
    { id: 'Central Europe Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague', supportsDaylightSavingTime: true },
    { id: 'Romance Standard Time', offset: 60, offsetHours: 1, displayName: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris', supportsDaylightSavingTime: true },
    { id: 'FLE Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius', supportsDaylightSavingTime: true },
    { id: 'South Africa Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Harare, Pretoria', supportsDaylightSavingTime: false },
    { id: 'Turkey Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Istanbul', supportsDaylightSavingTime: true },
    { id: 'GTB Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Athens, Bucharest', supportsDaylightSavingTime: true },
    { id: 'Libya Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Tripoli', supportsDaylightSavingTime: true },
    { id: 'E. Europe Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) E. Europe', supportsDaylightSavingTime: true },
    { id: 'Jordan Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Amman', supportsDaylightSavingTime: true },
    { id: 'Middle East Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Beirut', supportsDaylightSavingTime: true },
    { id: 'Egypt Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Cairo', supportsDaylightSavingTime: true },
    { id: 'Syria Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Damascus', supportsDaylightSavingTime: true },
    { id: 'Israel Standard Time', offset: 120, offsetHours: 2, displayName: '(UTC+02:00) Jerusalem', supportsDaylightSavingTime: true },
    { id: 'Arab Standard Time', offset: 180, offsetHours: 3, displayName: '(UTC+03:00) Kuwait, Riyadh', supportsDaylightSavingTime: false },
    { id: 'E. Africa Standard Time', offset: 180, offsetHours: 3, displayName: '(UTC+03:00) Nairobi', supportsDaylightSavingTime: false },
    { id: 'Arabic Standard Time', offset: 180, offsetHours: 3, displayName: '(UTC+03:00) Baghdad', supportsDaylightSavingTime: true },
    { id: 'Kaliningrad Standard Time', offset: 180, offsetHours: 3, displayName: '(UTC+03:00) Kaliningrad, Minsk', supportsDaylightSavingTime: true },
    { id: 'Iran Standard Time', offset: 210, offsetHours: 3.5, displayName: '(UTC+03:30) Tehran', supportsDaylightSavingTime: true },
    { id: 'Mauritius Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Port Louis', supportsDaylightSavingTime: true },
    { id: 'Georgian Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Tbilisi', supportsDaylightSavingTime: false },
    { id: 'Caucasus Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Yerevan', supportsDaylightSavingTime: true },
    { id: 'Arabian Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Abu Dhabi, Muscat', supportsDaylightSavingTime: false },
    { id: 'Azerbaijan Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Baku', supportsDaylightSavingTime: true },
    { id: 'Russian Standard Time', offset: 240, offsetHours: 4, displayName: '(UTC+04:00) Moscow, St. Petersburg, Volgograd', supportsDaylightSavingTime: true },
    { id: 'Afghanistan Standard Time', offset: 270, offsetHours: 4.5, displayName: '(UTC+04:30) Kabul', supportsDaylightSavingTime: false },
    { id: 'Pakistan Standard Time', offset: 300, offsetHours: 5, displayName: '(UTC+05:00) Islamabad, Karachi', supportsDaylightSavingTime: true },
    { id: 'West Asia Standard Time', offset: 300, offsetHours: 5, displayName: '(UTC+05:00) Ashgabat, Tashkent', supportsDaylightSavingTime: false },
    { id: 'India Standard Time', offset: 330, offsetHours: 5.5, displayName: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', supportsDaylightSavingTime: false },
    { id: 'Sri Lanka Standard Time', offset: 330, offsetHours: 5.5, displayName: '(UTC+05:30) Sri Jayawardenepura', supportsDaylightSavingTime: false },
    { id: 'Nepal Standard Time', offset: 345, offsetHours: 5.75, displayName: '(UTC+05:45) Kathmandu', supportsDaylightSavingTime: false },
    { id: 'Central Asia Standard Time', offset: 360, offsetHours: 6, displayName: '(UTC+06:00) Astana', supportsDaylightSavingTime: false },
    { id: 'Bangladesh Standard Time', offset: 360, offsetHours: 6, displayName: '(UTC+06:00) Dhaka', supportsDaylightSavingTime: true },
    { id: 'Ekaterinburg Standard Time', offset: 360, offsetHours: 6, displayName: '(UTC+06:00) Ekaterinburg', supportsDaylightSavingTime: true },
    { id: 'Myanmar Standard Time', offset: 390, offsetHours: 6.5, displayName: '(UTC+06:30) Yangon (Rangoon)', supportsDaylightSavingTime: false },
    { id: 'SE Asia Standard Time', offset: 420, offsetHours: 7, displayName: '(UTC+07:00) Bangkok, Hanoi, Jakarta', supportsDaylightSavingTime: false },
    { id: 'N. Central Asia Standard Time', offset: 420, offsetHours: 7, displayName: '(UTC+07:00) Novosibirsk', supportsDaylightSavingTime: true },
    { id: 'Ulaanbaatar Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Ulaanbaatar', supportsDaylightSavingTime: false },
    { id: 'China Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi', supportsDaylightSavingTime: false },
    { id: 'Singapore Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Kuala Lumpur, Singapore', supportsDaylightSavingTime: false },
    { id: 'North Asia Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Krasnoyarsk', supportsDaylightSavingTime: true },
    { id: 'Taipei Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Taipei', supportsDaylightSavingTime: false },
    { id: 'W. Australia Standard Time', offset: 480, offsetHours: 8, displayName: '(UTC+08:00) Perth', supportsDaylightSavingTime: true },
    { id: 'Korea Standard Time', offset: 540, offsetHours: 9, displayName: '(UTC+09:00) Seoul', supportsDaylightSavingTime: false },
    { id: 'North Asia East Standard Time', offset: 540, offsetHours: 9, displayName: '(UTC+09:00) Irkutsk', supportsDaylightSavingTime: true },
    { id: 'Tokyo Standard Time', offset: 540, offsetHours: 9, displayName: '(UTC+09:00) Osaka, Sapporo, Tokyo', supportsDaylightSavingTime: false },
    { id: 'AUS Central Standard Time', offset: 570, offsetHours: 9.5, displayName: '(UTC+09:30) Darwin', supportsDaylightSavingTime: false },
    { id: 'Cen. Australia Standard Time', offset: 570, offsetHours: 9.5, displayName: '(UTC+09:30) Adelaide', supportsDaylightSavingTime: true },
    { id: 'West Pacific Standard Time', offset: 600, offsetHours: 10, displayName: '(UTC+10:00) Guam, Port Moresby', supportsDaylightSavingTime: false },
    { id: 'Tasmania Standard Time', offset: 600, offsetHours: 10, displayName: '(UTC+10:00) Hobart', supportsDaylightSavingTime: true },
    { id: 'E. Australia Standard Time', offset: 600, offsetHours: 10, displayName: '(UTC+10:00) Brisbane', supportsDaylightSavingTime: false },
    { id: 'AUS Eastern Standard Time', offset: 600, offsetHours: 10, displayName: '(UTC+10:00) Canberra, Melbourne, Sydney', supportsDaylightSavingTime: true },
    { id: 'Yakutsk Standard Time', offset: 600, offsetHours: 10, displayName: '(UTC+10:00) Yakutsk', supportsDaylightSavingTime: true },
    { id: 'Vladivostok Standard Time', offset: 660, offsetHours: 11, displayName: '(UTC+11:00) Vladivostok', supportsDaylightSavingTime: true },
    { id: 'Central Pacific Standard Time', offset: 660, offsetHours: 11, displayName: '(UTC+11:00) Solomon Is., New Caledonia', supportsDaylightSavingTime: false },
    { id: 'Magadan Standard Time', offset: 720, offsetHours: 12, displayName: '(UTC+12:00) Magadan', supportsDaylightSavingTime: true },
    { id: 'Kamchatka Standard Time', offset: 720, offsetHours: 12, displayName: '(UTC+12:00) Petropavlovsk-Kamchatsky - Old', supportsDaylightSavingTime: true },
    { id: 'Fiji Standard Time', offset: 720, offsetHours: 12, displayName: '(UTC+12:00) Fiji', supportsDaylightSavingTime: true },
    { id: 'New Zealand Standard Time', offset: 720, offsetHours: 12, displayName: '(UTC+12:00) Auckland, Wellington', supportsDaylightSavingTime: true },
    { id: 'UTC+12', offset: 720, offsetHours: 12, displayName: '(UTC+12:00) Coordinated Universal Time+12', supportsDaylightSavingTime: false },
    { id: 'Tonga Standard Time', offset: 780, offsetHours: 13, displayName: '(UTC+13:00) Nuku\'alofa', supportsDaylightSavingTime: false },
    { id: 'Samoa Standard Time', offset: 780, offsetHours: 13, displayName: '(UTC+13:00) Samoa', supportsDaylightSavingTime: true }
],
    __daysToMonth365 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
    __daysToMonth366 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366],
    __daysPer4Years = 365 * 4 + 1,
    __daysPer100Years = (365 * 4 + 1) * 25 - 1,
    __daysPer400Years = ((365 * 4 + 1) * 25 - 1) * 4 + 1,
    // Number of days from 1/1/0001 to 12/31/1600
    __daysTo1601 = (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 4,
    // Number of days from 1/1/0001 to 12/30/1899
    __daysTo1899 = (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 4 + ((365 * 4 + 1) * 25 - 1) * 3 - 367,
    // Number of days from 1/1/0001 to 12/31/9999
    __daysTo10000 = (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 25 - 366,
    __minTicks = 0,
    __maxTicks = ((((365 * 4 + 1) * 25 - 1) * 4 + 1) * 25 - 366) * (1000 * 10000 * 3600 * 24) - 1,
    __maxMillis = ((((365 * 4 + 1) * 25 - 1) * 4 + 1) * 25 - 366) * (1000 * 60 * 60 * 24);

Smart.Utilities.Assign('TimeSpan', class TimeSpan {
    constructor() {
        const that = this;

        that.ticksPerMillisecond = 10000;
        that.millisecondsPerTick = 1 / 10000;
        that.ticksPerSecond = 1000 * 10000;
        that.secondsPerTick = 1 / (1000 * 10000);
        that.ticksPerMinute = 1000 * 10000 * 60;
        that.minutesPerTick = 1 / (1000 * 10000 * 60);
        that.ticksPerHour = 1000 * 10000 * 3600;
        that.hoursPerTick = 1 / (1000 * 10000 * 3600);
        that.ticksPerDay = 1000 * 10000 * 3600 * 24;
        that.daysPerTick = 1 / (1000 * 10000 * 3600 * 24);
        that.millisPerSecond = 1000;
        that.millisPerMinute = 1000 * 60;
        that.millisPerHour = 1000 * 60 * 60;
        that.millisPerDay = 1000 * 60 * 60 * 24;
        that._ticks = 0;

        if (arguments.length === 1) {
            if (isNaN(arguments[0])) {
                throw new Error('Argument must be a number.');
            }

            that._ticks = arguments[0];
        }
        else if (arguments.length === 3) {
            that._ticks = that.timeToMS(arguments[0], arguments[1], arguments[2], 0);
        }
        else if (arguments.length === 4) {
            const days = arguments[0],
                hours = arguments[1],
                minutes = arguments[2],
                seconds = arguments[3],
                milliseconds = 0,
                totalMilliSeconds = (days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

            that._ticks = totalMilliSeconds * that.ticksPerMillisecond;
        }
        else if (arguments.length === 5) {
            const days = arguments[0],
                hours = arguments[1],
                minutes = arguments[2],
                seconds = arguments[3],
                milliseconds = arguments[4],
                totalMilliSeconds = (days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

            that._ticks = totalMilliSeconds * that.ticksPerMillisecond;
        }
    }

    ticks() {
        return this._ticks;
    }

    days() {
        const that = this;

        return parseInt(that._ticks / that.ticksPerDay);
    }

    timeToMS(hour, minute, second, milliseconds) {
        const totalSeconds = hour * 3600 + minute * 60 + second + milliseconds / 1000;

        return parseInt(totalSeconds * this.ticksPerSecond);
    }

    hours() {
        const that = this;

        return parseInt(that._ticks / that.ticksPerHour) % 24;
    }

    milliseconds() {
        const that = this;

        return parseInt(that._ticks / that.ticksPerMillisecond) % 1000;
    }

    minutes() {
        const that = this;

        return parseInt(that._ticks / that.ticksPerMinute) % 60;
    }

    seconds() {
        const that = this;

        return parseInt(that._ticks / that.ticksPerSecond) % 60;
    }

    totalDays() {
        const that = this;

        return parseInt(that._ticks * that.daysPerTick);
    }

    totalHours() {
        const that = this;

        return parseInt(that._ticks * that.hoursPerTick);
    }

    totalMilliseconds() {
        const that = this,
            temp = that._ticks * that.millisecondsPerTick;

        return parseInt(temp);
    }

    totalMinutes() {
        const that = this;

        return parseInt(that._ticks * that.minutesPerTick);
    }

    totalSeconds() {
        const that = this;

        return parseInt(that._ticks * that.secondsPerTick);
    }

    add(ts) {
        const result = this._ticks + ts._ticks,
            timeSpan = new Smart.Utilities.TimeSpan(result);

        return timeSpan;
    }

    subtract(ts) {
        const result = this._ticks - ts._ticks;

        return new Smart.Utilities.TimeSpan(result);
    }

    duration() {
        const that = this;

        if (that._ticks >= 0) {
            return new Smart.Utilities.TimeSpan(that._ticks);
        }
        else {
            return new Smart.Utilities.TimeSpan(-that._ticks);
        }
    }

    equals(ts) {
        return this._ticks === ts._ticks;
    }

    valueOf() {
        return this._ticks
    }

    compare(t1, t2) {
        if (t1._ticks > t2._ticks) {
            return 1;
        }

        if (t1._ticks < t2._ticks) {
            return -1;
        }

        return 0;
    }

    interval(value, scale) {
        const tmp = value * scale,
            millis = tmp + (value >= 0 ? 0.5 : -0.5);

        return new Smart.Utilities.TimeSpan(millis * this.ticksPerMillisecond);
    }

    fromDays(value) {
        const that = this;

        return that.interval(value, that.millisPerDay);
    }

    fromHours(value) {
        const that = this;

        return that.interval(value, that.millisPerHour);
    }

    fromMilliseconds(value) {
        return this.interval(value, 1);
    }

    fromMinutes(value) {
        const that = this;

        return that.interval(value, that.millisPerMinute);
    }

    fromSeconds(value) {
        const that = this;

        return that.interval(value, that.millisPerSecond);
    }

    fromTicks(value) {
        return new Smart.Utilities.TimeSpan(value);
    }

    toString() {
        return this.totalMilliseconds().toString();
    }

    negate() {
        return new Smart.Utilities.TimeSpan(-this._ticks);
    }
});

Smart.Utilities.Assign('DateTime', class DateTime {
    constructor() {
        function getUTCDate(ISOString) {
            const parseResult = that.regexISOString.exec(ISOString);

            UTCDate = new Smart.Utilities.DateTime(
                parseFloat(parseResult[1]), parseFloat(parseResult[2]), parseFloat(parseResult[3]),
                parseFloat(parseResult[4]), parseFloat(parseResult[5]), parseFloat(parseResult[6]),
                parseFloat(parseResult[7]), 0, 0, 0, 0, 0, 0, 0, 'UTC'
            );
        }

        const that = this;
        let UTCDate;

        that.ticksPerMillisecond = 10000;
        that.millisecondsPerTick = 1 / 10000;
        that.ticksPerSecond = 1000 * 10000;
        that.secondsPerTick = 1 / (1000 * 10000);
        that.ticksPerMinute = 1000 * 10000 * 60;
        that.minutesPerTick = 1 / (1000 * 10000 * 60);
        that.ticksPerHour = 1000 * 10000 * 3600;
        that.hoursPerTick = 1 / (1000 * 10000 * 3600);
        that.ticksPerDay = 1000 * 10000 * 3600 * 24;
        that.daysPerTick = 1 / (1000 * 10000 * 3600 * 24);
        that.millisPerSecond = 1000;
        that.millisPerMinute = 1000 * 60;
        that.millisPerHour = 1000 * 60 * 60;
        that.millisPerDay = 1000 * 60 * 60 * 24;
        that.daysPerYear = 365;
        that.daysPer4Years = __daysPer4Years;
        that.daysPer100Years = __daysPer100Years;
        that.daysPer400Years = __daysPer400Years;
        // Number of days from 1/1/0001 to 12/31/1600
        that.daysTo1601 = __daysTo1601;
        // Number of days from 1/1/0001 to 12/30/1899
        that.daysTo1899 = __daysTo1899;
        // Number of days from 1/1/0001 to 12/31/9999
        that.daysTo10000 = __daysTo10000;
        that.minTicks = 0;
        that.maxTicks = __maxTicks;
        that.maxMillis = __maxMillis;
        that.datePartYear = 0;
        that.datePartDayOfYear = 1;
        that.datePartMonth = 2;
        that.datePartDay = 3;
        that.daysToMonth365 = __daysToMonth365;
        that.daysToMonth366 = __daysToMonth366;
        that.minValue = new Date(0);
        that.maxValue = new Date(((((365 * 4 + 1) * 25 - 1) * 4 + 1) * 25 - 366) * (1000 * 10000 * 3600 * 24) - 1);
        that.ticksMask = 0x3FFFFFFFFFFFFFFF;
        that.flagsMask = 0xC000000000000000;
        that.localMask = 0x8000000000000000;
        that.ticksCeiling = 0x4000000000000000;
        that.kindUnspecified = 0x0000000000000000;
        that.kindUtc = 0x4000000000000000;
        that.kindLocal = 0x8000000000000000;
        that.kindLocalAmbiguousDst = 0xC000000000000000;
        that.kindShift = 62;
        that.regexTrim = /^\s+|\s+$/g;
        that.regexInfinity = /^[+-]?infinity$/i;
        that.regexHex = /^0x[a-f0-9]+$/i;
        that.regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
        that.regexISOString = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/;
        that.calendar = {
            // separator of parts of a date (e.g. '/' in 11/05/1955)
            '/': '/',
            // separator of parts of a time (e.g. ':' in 05:44 PM)
            ':': ':',
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
            firstDay: 0,
            days: {
                // full day names
                names: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                // abbreviated day names
                namesAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                // shortest day names
                namesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            },
            months: {
                // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
                names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
                // abbreviated month names
                namesAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']
            },
            // AM and PM designators in one of these forms:
            // The usual view, and the upper and lower case versions
            //      [standard,lowercase,uppercase]
            // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
            //      null
            AM: ['AM', 'am', 'AM'],
            PM: ['PM', 'pm', 'PM'],
            eras: [
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
                { 'name': 'A.D.', 'start': null, 'offset': 0 }
            ],
            twoDigitYearMax: 2029,
            patterns: {
                // short date pattern
                d: 'M/d/yyyy',
                // long date pattern
                D: 'dddd, MMMM dd, yyyy',
                // short time pattern
                t: 'h:mm tt',
                // long time pattern
                T: 'h:mm:ss tt',
                // long date, short time pattern
                f: 'dddd, MMMM dd, yyyy h:mm tt',
                // long date, long time pattern
                F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                // month/day pattern
                M: 'MMMM dd',
                // month/year pattern
                Y: 'yyyy MMMM',
                // S is a sortable format that does not vary by culture
                S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
                // formatting of dates in MySQL DataBases
                ISO: 'yyyy-MM-dd hh:mm:ss',
                ISO2: 'yyyy-MM-dd HH:mm:ss',
                d1: 'dd.MM.yyyy',
                d2: 'dd-MM-yyyy',
                zone1: 'yyyy-MM-ddTHH:mm:ss-HH:mm',
                zone2: 'yyyy-MM-ddTHH:mm:ss+HH:mm',
                custom: 'yyyy-MM-ddTHH:mm:ss.fff',
                custom2: 'yyyy-MM-dd HH:mm:ss.fff',
                // full precision (from year to yoctoseconds)
                FP: 'yyyy-MM-dd HH:mm:ss:fff:uu:nn:pp:ee:aa:xx:oo',
                // alternative full precision (from year to yoctoseconds, no delimiters)
                FPA: 'yyyy/MM/dd HH:mm:ss:fffuunnppeeaaxxoo',
                // alternative full precision (from year to yoctoseconds, no delimiters)
                FPA2: 'yyyy-MM-dd HH:mm:ss:fffuunnppeeaaxxoo',
                // full precision time (from hours to yoctoseconds)
                FT: 'HH:mm:ss:fff:uu:nn:pp:ee:aa:xx:oo',
                // processor precision (from year to picoseconds)
                PP: 'yyyy-MM-dd HH:mm:ss:fff:uu:nn:pp',
                // processor precision time (from hours to picoseconds)
                PT: 'HH:mm:ss:fff:uu:nn:pp'
            },
            percentsymbol: '%',
            currencysymbol: '$',
            currencysymbolposition: 'before',
            decimalseparator: '.',
            thousandsseparator: ','
        };
        that.dateData = 0;
        that.timeZone = null;
        that.timeZones = __timeZones;

        that._codeToUnit = {
            'u': '_microsecond',
            'uu': '_microsecond',
            'n': '_nanosecond',
            'nn': '_nanosecond',
            'p': '_picosecond',
            'pp': '_picosecond',
            'e': '_femtosecond',
            'ee': '_femtosecond',
            'a': '_attosecond',
            'aa': '_attosecond',
            'x': '_zeptosecond',
            'xx': '_zeptosecond',
            'o': '_yoctosecond',
            'oo': '_yoctosecond'
        };

        that._smallUnits = ['_microsecond', '_nanosecond', '_picosecond', '_femtosecond', '_attosecond', '_zeptosecond', '_yoctosecond'];

        that._microsecond = 0;
        that._nanosecond = 0;
        that._picosecond = 0;
        that._femtosecond = 0;
        that._attosecond = 0;
        that._zeptosecond = 0;
        that._yoctosecond = 0;

        if (arguments.length === 0) {
            const date = new Date();
            that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        }
        else if (arguments.length === 1) {
            if (arguments[0] === undefined)
                arguments[0] = 'todayDate';

            const isNumber = typeof arguments[0] === 'number' && isFinite(arguments[0]);

            if (!isNumber && typeof arguments[0] === 'string') {
                let date;

                if (arguments[0] === 'today') {
                    date = new Date();
                }
                else if (arguments[0] === 'todayDate') {
                    date = new Date();
                    date.setHours(0, 0, 0, 0);
                }
                else if (that.regexISOString.test(arguments[0])) {
                    getUTCDate(arguments[0]);
                }
                else {
                    date = that.tryparseDate(arguments[0]);
                }

                if (date) {
                    that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                }
            }
            else {
                if (typeof (arguments[0]) === 'number') {
                    that.dateData = arguments[0];
                }
                else {
                    if (arguments[0] instanceof Date) {
                        const date = arguments[0];
                        that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    }
                    else {
                        that.dateData = arguments[0];
                    }
                }
            }
        }
        else if (arguments.length === 2) {
            if (arguments[0] === undefined)
                arguments[0] = 'todayDate';

            const isNumber = typeof arguments[0] === 'number' && isFinite(arguments[0]);

            if (!isNumber && typeof arguments[0] === 'string') {
                let date;

                if (arguments[0] === 'today') {
                    date = new Date();
                }
                else if (arguments[0] === 'todayDate') {
                    date = new Date();
                    date.setHours(0, 0, 0, 0);
                }
                else if (that.regexISOString.test(arguments[0])) {
                    getUTCDate(arguments[0]);
                }
                else {
                    date = that.tryparseDate(arguments[0]);
                }

                if (date) {
                    that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                }
            }
            else {
                if (typeof (arguments[0]) === 'number') {
                    that.dateData = arguments[0];
                }
                else {
                    if (arguments[0] instanceof Date) {
                        const date = arguments[0];
                        that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    }
                    else {
                        that.dateData = arguments[0];
                    }
                }
            }

            that.validateTimeZone(arguments[1]);
        }
        else if (arguments.length > 2) {
            if (typeof arguments[0] === 'string') {
                const date = that.tryparseDate(arguments[0], arguments[2], arguments[1]);
                that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            }
            else {
                const year = arguments[0],
                    month = arguments[1] - 1,
                    day = arguments[2],
                    hour = arguments[3] || 0,
                    minute = arguments[4] || 0,
                    second = arguments[5] || 0,
                    millisecond = arguments[6] || 0,
                    microsecond = arguments[7] || 0,
                    nanosecond = arguments[8] || 0,
                    picosecond = arguments[9] || 0,
                    femtosecond = arguments[10] || 0,
                    attosecond = arguments[11] || 0,
                    zeptosecond = arguments[12] || 0,
                    yoctosecond = arguments[13] || 0,

                    date = new Date(year, month, day, hour, minute, second, millisecond);

                if (year < 1970) {
                    date.setFullYear(year);
                }

                that.dateData = that.dateToMS(date.getFullYear(), date.getMonth() + 1, date.getDate()) + that.timeToMS(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                that._microsecond = microsecond;
                that._nanosecond = nanosecond;
                that._picosecond = picosecond;
                that._femtosecond = femtosecond;
                that._attosecond = attosecond;
                that._zeptosecond = zeptosecond;
                that._yoctosecond = yoctosecond;

                if (arguments[14]) {
                    that.validateTimeZone(arguments[14]);
                }
            }
        }

        if (!that.timeZone) {
            that.validateTimeZone('Local');
        }

        if (UTCDate) {
            const convertedUTCDate = UTCDate.toTimeZone(that.timeZone);

            that.dateData = convertedUTCDate.dateData;
        }
    }

    static validateDate(value, referenceValue, formatString) {
        if (value instanceof Smart.Utilities.DateTime) {
            return value;
        }

        if (value instanceof Date) {
            return new Smart.Utilities.DateTime(value);
        }

        try {
            if (new RegExp(/^\d{1,2}\/\d{1,2}\/\d{4}(, \d{1,2}:\d{2}:\d{1,2} [A|P]M)?$/).test(value)) {
                const constructedDate = new Date(value);

                if (!isNaN(constructedDate.getTime())) {
                    return new Smart.Utilities.DateTime(constructedDate);
                }
            }

            if (typeof value === 'string') {
                return this.parseDateString(value, referenceValue, formatString);
            }

            if (typeof value === 'number') {
                return new Smart.Utilities.DateTime(new Date(value));
            }
        }
        catch (error) {
            //
        }

        return referenceValue;
    }

    static parseDateString(value, referenceValue, formatString) {
        const parseAttemptDate = new Date(value);

        if (!isNaN(parseAttemptDate.getTime())) {
            return new Smart.Utilities.DateTime(parseAttemptDate);
        }

        const indexOfDate = value.indexOf('Date('),
            indexOfDateTime = value.indexOf('DateTime('),
            indexOfBracket = value.lastIndexOf(')');
        let validValue = value;

        if ((indexOfDate !== -1 || indexOfDateTime !== -1) && indexOfBracket !== -1) {
            if (indexOfDate !== -1) {
                validValue = value.slice(indexOfDate + 5, indexOfBracket);
            }
            else {
                validValue = value.slice(indexOfDateTime + 9, indexOfBracket);
            }

            validValue = validValue.replace(/'/g, '').replace(/"/g, '').replace(/^\s+|\s+$|\s+(?=\s)/g, '');

            if (validValue.trim() === '') {
                return new Smart.Utilities.DateTime();
            }

            if (new RegExp(/(^(\d+)(\s*,\s*\d+)+(\s*,\s*[a-zA-Z ]+)?$)/g).test(validValue)) {
                validValue = validValue.split(',');

                validValue.map(function (argument, index) {
                    if (!isNaN(validValue[index])) {
                        validValue[index] = parseInt(argument);
                    }
                    else {
                        validValue[index] = argument.trim();
                    }
                });

                if (indexOfDate !== -1) {
                    validValue[1]++;
                }

                validValue.unshift(null);
                validValue = new (Function.prototype.bind.apply(Smart.Utilities.DateTime, validValue));

                return validValue;
            }
        }
        else {
            const parseAttemptDateTime = new Smart.Utilities.DateTime(),
                parseAttempt = parseAttemptDateTime.parseDate(value, formatString);

            if (parseAttempt) {
                validValue = new Smart.Utilities.DateTime(parseAttempt);
                parseAttemptDateTime.copySmallTimePartValues(validValue);
                return validValue;
            }
        }

        if (validValue.trim() === '') {
            return referenceValue;
        }

        if (!isNaN(validValue)) {
            validValue = new Date(parseInt(validValue, 10));
            return new Smart.Utilities.DateTime(validValue);
        }

        try {
            const splitValue = validValue.split(',');

            if (splitValue.length === 2) {
                splitValue[1] = splitValue[1].trim();

                splitValue.unshift(null);
                validValue = new (Function.prototype.bind.apply(Smart.Utilities.DateTime, splitValue));
            }
            else {
                validValue = new Smart.Utilities.DateTime(validValue);
            }
        }
        catch (error) {
            validValue = referenceValue;
        }

        return validValue;
    }

    static fromFullTimeStamp(timeStamp) {
        timeStamp = timeStamp.toString();

        const dateTime = new Smart.Utilities.DateTime(parseFloat(timeStamp.slice(0, timeStamp.length - 21)));
        let smallTimeParts = timeStamp.slice(timeStamp.length - 21),
            unitIndex = 0;

        while (smallTimeParts.length > 0) {
            dateTime[dateTime._smallUnits[unitIndex]] = parseInt(smallTimeParts.slice(0, 3), 10);

            smallTimeParts = smallTimeParts.slice(3);
            unitIndex++;
        }

        return dateTime;
    }

    /**
     * Returns full DateTime constructor parameters.
     */
    static getConstructorParameters(oldValue) {
        return [
            oldValue.year(), oldValue.month(), oldValue.day(),
            oldValue.hour(), oldValue.minute(), oldValue.second(), oldValue.millisecond(),
            oldValue._microsecond, oldValue._nanosecond, oldValue._picosecond,
            oldValue._femtosecond, oldValue._attosecond, oldValue._zeptosecond, oldValue._yoctosecond,
            oldValue.timeZone
        ];
    }

    /**
     * Detects whether the formatString contains only date or time information, or both.
     */
    static detectDisplayMode(value, formatString, formatStringRegExp) {
        if (value.calendar.patterns[formatString]) {
            if (['d', 'D', 'M', 'Y', 'd1', 'd2'].indexOf(formatString) !== -1) {
                return 'calendar';
            }

            if (['t', 'T', 'FT', 'PT'].indexOf(formatString) !== -1) {
                return 'timePicker';
            }

            return 'default';
        }

        const dateParts = ['d', 'M', 'y'],
            timeParts = ['h', 'H', 'm', 's', 't', 'f', 'u', 'n', 'p', 'e', 'a', 'x', 'o'],
            groups = formatStringRegExp.groups;
        let calendar = false,
            timePicker = false;

        for (let i = 0; i < groups.length; i++) {
            const char = groups[i].charAt(0);

            if (dateParts.indexOf(char) !== -1) {
                calendar = true;
            }
            else if (timeParts.indexOf(char) !== -1) {
                timePicker = true;
            }

            if (calendar && timePicker) {
                break;
            }
        }

        if (calendar === timePicker) {
            return 'default';
        }

        if (calendar) {
            return 'calendar';
        }

        return 'timePicker';
    }

    /**
     * Gets and stores month and day names based on locale.
     */
    static getLocalizedNames(locale) {
        const days = { names: [], namesAbbr: [], namesShort: [] },
            months = { names: [], namesAbbr: [] };

        if (this[locale]) {
            return this[locale];
        }

        for (let i = 23; i < 30; i++) {
            const date = new Date(2017, 6, i),
                name = date.toLocaleString(locale, { 'weekday': 'long' });

            days.names.push(name);
            days.namesAbbr.push(date.toLocaleString(locale, { 'weekday': 'short' }));
            days.namesShort.push(name.substring(0, 2));
        }

        for (let i = 0; i < 12; i++) {
            const date = new Date(2017, i, 1),
                name = date.toLocaleString(locale, { 'month': 'long' });

            months.names.push(name);
            months.namesAbbr.push(name.substring(0, 3));
        }

        months.names.push('');
        months.namesAbbr.push('');

        this[locale] = { days: days, months: months };

        return this[locale];
    }

    internalMS() {
        return this.dateData;
    }
    // Returns a given date part of this DateTithat. This method is used
    // to compute the year, day-of-year, month, or day part.
    getDatePart(part) {
        const that = this,
            ms = that.internalMS();
        // n = number of days since 1/1/0001
        let n = parseInt(ms / that.millisPerDay);
        // y400 = number of whole 400-year periods since 1/1/0001
        const y400 = parseInt(n / that.daysPer400Years);
        // n = day number within 400-year period
        n -= y400 * that.daysPer400Years;
        // y100 = number of whole 100-year periods within 400-year period
        let y100 = parseInt(n / that.daysPer100Years);
        // Last 100-year period has an extra day, so decrement result if 4
        if (y100 === 4) y100 = 3;
        // n = day number within 100-year period
        n -= y100 * that.daysPer100Years;
        // y4 = number of whole 4-year periods within 100-year period
        const y4 = parseInt(n / that.daysPer4Years);
        // n = day number within 4-year period
        n -= y4 * that.daysPer4Years;
        // y1 = number of whole years within 4-year period
        let y1 = parseInt(n / that.daysPerYear);
        // Last year has an extra day, so decrement result if 4
        if (y1 === 4) y1 = 3;
        // If year was requested, compute and return it
        if (part === that.datePartYear) {
            return parseInt(y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1);
        }
        // n = day number within year
        n -= y1 * that.daysPerYear;
        // If day-of-year was requested, return it
        if (part === that.datePartDayOfYear) return parseInt(n + 1);
        // Leap year calculation looks different from IsLeapYear since y1, y4,
        // and y100 are relative to year 1, not year 0
        const leapYear = y1 === 3 && (y4 !== 24 || y100 === 3),
            days = leapYear ? that.daysToMonth366 : that.daysToMonth365;
        // All months have less than 32 days, so n >> 5 is a good conservative
        // estimate for the month
        let m = n >> 5 + 1;
        // m = 1-based month number
        while (n >= days[m]) m++;
        // If month was requested, return it
        if (part === that.datePartMonth) return parseInt(m);
        // Return 1-based day-of-month
        return parseInt(n - days[m - 1] + 1);
    }

    dayOfWeek() {
        const that = this,
            ms = that.dateData,
            dayOfWeek = parseInt(ms / that.millisPerDay + 1) % 7;

        return dayOfWeek;
    }

    dayOfYear() {
        const that = this;

        return that.getDatePart(that.datePartDayOfYear);
    }

    weekOfYear(firstDay) {
        const that = this,
            dateObj = that.toDate(),
            dowOffset = firstDay || that.calendar.firstDay, //default dowOffset to zero
            newYear = new Date(dateObj.getFullYear(), 0, 1),
            daynum = Math.floor((dateObj.getTime() - newYear.getTime() - (dateObj.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
        let day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        let weeknum;
        //if the year starts before the middle of a week
        if (day < 4) {
            weeknum = Math.floor((daynum + day - 1) / 7) + 1;
            if (weeknum > 52) {
                const nYear = new Date(dateObj.getFullYear() + 1, 0, 1);
                let nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum + day - 1) / 7);
        }
        return weeknum;
    }

    subtract(date) {
        const that = this;

        return new Smart.Utilities.TimeSpan(that.dateData * that.ticksPerMillisecond - date.dateData * that.ticksPerMillisecond);
    }

    dateToMS(year, month, day) {
        const that = this;

        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
            year = parseInt(year);
            const days = that.isLeapYear(year) ? that.daysToMonth366 : that.daysToMonth365;
            if (day >= 1 && day <= days[month] - days[month - 1]) {
                const y = year - 1;
                const n = y * 365 + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + days[month - 1] + day - 1;
                return n * that.millisPerDay;
            }
        }
    }

    isLeapYear(year) {
        if (year < 1 || year > 9999) {
            throw new Error('Year out of Range');
        }
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    timeToMS(hour, minute, second, ms) {
        const that = this;

        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            const totalSeconds = parseInt(hour * 3600 + minute * 60 + second);
            if (ms > 0 && ms < 1000) {
                return (totalSeconds * that.millisPerSecond) + ms;
            }
            return totalSeconds * that.millisPerSecond;
        }
    }

    daysInMonth(year, month) {
        if (month < 1 || month > 12) {
            throw new Error('Month out of Range');
        }

        const that = this,
            days = that.isLeapYear(year) ? that.daysToMonth366 : that.daysToMonth365;

        return days[month] - days[month - 1];
    }

    arrayIndexOf(array, item) {
        return array.indexOf(item);
    }

    startsWith(value, pattern) {
        return value.indexOf(pattern) === 0;
    }

    endsWith(value, pattern) {
        return value.substr(value.length - pattern.length) === pattern;
    }

    trim(value) {
        return (value + '').replace(this.regexTrim, '');
    }

    expandFormat(calendar, format) {
        // expands unspecified or single character date formats into the full pattern.
        format = format || 'F';
        let pattern,
            patterns = calendar.patterns,
            len = format.length;

        if (patterns[format]) {
            return patterns[format];
        }

        if (len === 1) {
            pattern = patterns[format];
            if (!pattern) {
                throw 'Invalid date format string \'' + format + '\'.';
            }
            format = pattern;
        }
        else if (len === 2 && format.charAt(0) === '%') {
            // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
            format = format.charAt(1);
        }
        return format;
    }

    getEra(date, eras) {
        if (!eras) return 0;
        if (typeof date === 'string') {
            return 0;
        }

        let start, ticks = date.getTime();
        for (let i = 0, l = eras.length; i < l; i++) {
            start = eras[i].start;
            if (start === null || ticks >= start) {
                return i;
            }
        }
        return 0;
    }

    toUpper(value) {
        // 'he-IL' has non-breaking space in weekday names.
        return value.split('\u00A0').join(' ').toUpperCase();
    }

    toUpperArray(arr) {
        const results = [];
        for (let i = 0, l = arr.length; i < l; i++) {
            results[i] = this.toUpper(arr[i]);
        }
        return results;
    }

    getEraYear(date, cal, era, sortable) {
        let year = date.getFullYear();
        if (!sortable && cal.eras) {
            // convert normal gregorian year to era-shifted gregorian
            // year by subtracting the era offset
            year -= cal.eras[era].offset;
        }
        return year;
    }

    getDayIndex(cal, value, abbr) {
        const that = this,
            days = cal.days;
        let ret,
            upperDays = cal._upperDays;

        if (!upperDays) {
            cal._upperDays = upperDays = [
                that.toUpperArray(days.names),
                that.toUpperArray(days.namesAbbr),
                that.toUpperArray(days.namesShort)
            ];
        }
        value = value.toUpperCase();
        if (abbr) {
            ret = that.arrayIndexOf(upperDays[1], value);
            if (ret === -1) {
                ret = that.arrayIndexOf(upperDays[2], value);
            }
        }
        else {
            ret = that.arrayIndexOf(upperDays[0], value);
        }
        return ret;
    }

    getMonthIndex(cal, value, abbr) {
        const that = this;

        let months = cal.months,
            monthsGen = cal.monthsGenitive || cal.months,
            upperMonths = cal._upperMonths,
            upperMonthsGen = cal._upperMonthsGen;
        if (!upperMonths) {
            cal._upperMonths = upperMonths = [
                that.toUpperArray(months.names),
                that.toUpperArray(months.namesAbbr)
            ];
            cal._upperMonthsGen = upperMonthsGen = [
                that.toUpperArray(monthsGen.names),
                that.toUpperArray(monthsGen.namesAbbr)
            ];
        }
        value = that.toUpper(value);
        let i = that.arrayIndexOf(abbr ? upperMonths[1] : upperMonths[0], value);
        if (i < 0) {
            i = that.arrayIndexOf(abbr ? upperMonthsGen[1] : upperMonthsGen[0], value);
        }
        return i;
    }

    appendPreOrPostMatch(preMatch, strings) {
        // appends pre- and post- token match strings while removing escaped characters.
        // Returns a single quote count which is used to determine if the token occurs
        // in a string literal.
        let quoteCount = 0,
            escaped = false;
        for (let i = 0, il = preMatch.length; i < il; i++) {
            const c = preMatch.charAt(i);
            switch (c) {
                case '\'':
                    if (escaped) {
                        strings.push('\'');
                    }
                    else {
                        quoteCount++;
                    }
                    escaped = false;
                    break;
                case '\\':
                    if (escaped) {
                        strings.push('\\');
                    }
                    escaped = !escaped;
                    break;
                default:
                    strings.push(c);
                    escaped = false;
                    break;
            }
        }
        return quoteCount;
    }

    getTokenRegExp() {
        // regular expression for matching date and time tokens in format strings.
        return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyyy|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|uu|u|nn|n|pp|p|ee|e|aa|a|xx|x|oo|o|i{1,24}|zzz|zz|z|gg|g/g;
    }

    tryparseDate(value, calendar, format) {
        const that = this;

        if (calendar === undefined || calendar === null) {
            calendar = that.calendar;
        }

        if (format !== undefined) {
            if (Array.isArray(format)) {
                for (let i = 0; i < format.length; i++) {
                    const tryParse = that.parseDate(value, format[i], calendar);

                    if (tryParse) {
                        return tryParse;
                    }
                }
            }
            const tryParse = that.parseDate(value, format, calendar);
            if (tryParse)
                return tryParse;
        }

        if (value === '')
            return null;

        if (value !== null && value !== undefined && !value.substring) {
            value = value.toString();
        }

        if (value !== null && value !== undefined && value.substring(0, 6) === '/Date(') {
            const jsonDateRE = /^\/Date\((-?\d+)(\+|-)?(\d+)?\)\/$/;

            let date = new Date(+value.replace(/\/Date\((\d+)\)\//, '$1'));
            if (date === 'Invalid Date') {
                const m = value.match(/^\/Date\((\d+)([-+]\d\d)(\d\d)\)\/$/);

                date = null;

                if (m) {
                    date = new Date(1 * m[1] + 3600000 * m[2] + 60000 * m[3]);
                }
            }
            if (date === null || date === undefined || date === 'Invalid Date' || isNaN(date)) {
                const arr = jsonDateRE.exec(value);
                if (arr) {
                    // 0 - complete results; 1 - ticks; 2 - sign; 3 - minutes
                    const result = new Date(parseInt(arr[1]));
                    if (arr[2]) {
                        let mins = parseInt(arr[3]);
                        if (arr[2] === '-') {
                            mins = -mins;
                        }
                        const current = result.getUTCMinutes();
                        result.setUTCMinutes(current - mins);
                    }
                    if (!isNaN(result.valueOf())) {
                        return result;
                    }
                }
            }

            return date;
        }

        const defaultPatterns = {
            smartdate: 'yyyy-MM-dd HH:mm:ss',
            // short date pattern
            d: 'M/d/yyyy',
            // long date pattern
            D: 'dddd, MMMM dd, yyyy',
            // short time pattern
            t: 'h:mm tt',
            // long time pattern
            T: 'h:mm:ss tt',
            // long date, short time pattern
            f: 'dddd, MMMM dd, yyyy h:mm tt',
            // long date, long time pattern
            F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
            // month/day pattern
            M: 'MMMM dd',
            // month/year pattern
            Y: 'yyyy MMMM',
            // S is a sortable format that does not vary by culture
            S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
            // formatting of dates in MySQL DataBases
            ISO: 'yyyy-MM-dd hh:mm:ss',
            ISO2: 'yyyy-MM-dd HH:mm:ss',
            ISO8601: 'yyyy-MM-ddTHH:mm:ss.sssZ',
            d1: 'dd.MM.yyyy',
            d2: 'dd-MM-yyyy',
            d3: 'MM-dd-yyyy',
            d4: 'MM.dd.yyyy',
            zone1: 'yyyy-MM-ddTHH:mm:ss-HH:mm',
            zone2: 'yyyy-MM-ddTHH:mm:ss+HH:mm',
            custom: 'yyyy-MM-ddTHH:mm:ss.fff',
            custom2: 'yyyy-MM-dd HH:mm:ss.fff',
            iso: 'yyyy-MM-ddTHH:mm:ssZ',
            iso_date1: 'yyyy-MM-dd',
            iso_date2: 'yyyy-MM-dd',
            iso_date3: 'yyyy-ddd',
            iso_date4: 'yyyy-MM-dd HH:mm',
            iso_date5: 'yyyy-MM-dd HH:mm Z',
            iso_date6: 'yyyy-MMM-dd',
            iso_date7: 'yyyy-MM',
            iso_date8: 'yyyy-MMM',
            iso_date9: 'yyyy-MMMM',
            iso_date10: 'yyyy-MMMM-dd',
            iso_time1: 'HH:mm:ss.tttt',
            iso_time2: 'HH:mm:ss',
            iso_time3: 'HH:mm',
            iso_time4: 'HH',
            iso_time5: 'yyyyyy-MM-dd',
            iso_time6: 'yyyyyy-MM-dd'
        };

        for (let prop in defaultPatterns) {
            const date = that.parseDate(value, defaultPatterns[prop], calendar);

            if (date) {
                return date;
            }
        }

        const patterns = calendar.patterns;
        for (let prop in patterns) {
            const date = that.parseDate(value, patterns[prop], calendar);

            if (date) {
                if (prop === 'ISO') {
                    const tmpDate = that.parseDate(value, patterns['ISO2'], calendar);
                    if (tmpDate) return tmpDate;
                }
                return date;
            }
        }

        let dateParts;

        if (typeof value === 'string') {
            value = that.trim(value);
            const splitParts = [':', '/', '-', ' ', ','];
            const replaceAll = function (find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            }
            value = replaceAll(', ', ',', value);
            let timePart = '';
            let datePart = value;
            if (value.indexOf(':') >= 0) {
                timePart = value.substring(value.indexOf(':') - 2);
                timePart = that.trim(timePart);
                datePart = value.substring(0, value.indexOf(':') - 2);
            }
            else if (value.toUpperCase().indexOf('AM') >= 0) {
                timePart = value.substring(value.toUpperCase().indexOf('AM') - 2);
                timePart = that.trim(timePart);
                datePart = value.substring(0, value.toUpperCase().indexOf('AM') - 2);
            }
            else if (value.toUpperCase().indexOf('PM') >= 0) {
                timePart = value.substring(value.toUpperCase().indexOf('PM') - 2);
                timePart = that.trim(timePart);
                datePart = value.substring(0, value.toUpperCase().indexOf('PM') - 2);
            }
            let parseDate = new Date();
            let parsed = false;
            if (datePart) {
                for (let i = 0; i < splitParts.length; i++) {
                    if (datePart.indexOf(splitParts[i]) >= 0) {
                        dateParts = datePart.split(splitParts[i]);
                        break;
                    }
                }

                if (!dateParts) {
                    return null;
                }

                let days = new Array();
                let months = new Array();
                let years = new Array();
                let dayPart = null;
                let monthPart = null;
                for (let i = 0; i < dateParts.length; i++) {
                    const part = dateParts[i];
                    const isDay = that.parseDate(part, 'd', calendar) || that.parseDate(part, 'dd', calendar) || that.parseDate(part, 'ddd', calendar) || that.parseDate(part, 'dddd', calendar);
                    if (isDay) {
                        days.push(isDay.getDate());
                        if (part.length > 2) {
                            dayPart = i;
                            break;
                        }
                    }
                }
                for (let i = 0; i < dateParts.length; i++) {
                    const part = dateParts[i],
                        isMonth = that.parseDate(part, 'M', calendar) || that.parseDate(part, 'MM', calendar) || that.parseDate(part, 'MMM', calendar) || that.parseDate(part, 'MMMM', calendar);
                    if (isMonth) {
                        if (dayPart !== null && dayPart !== undefined && dayPart === i)
                            continue;

                        months.push(isMonth.getMonth());

                        if (part.length > 2) {
                            monthPart = i;
                            break;
                        }
                    }
                }
                for (let i = 0; i < dateParts.length; i++) {
                    const part = dateParts[i];
                    const isYear = that.parseDate(part, 'yyyy', calendar);
                    if (isYear) {
                        if (dayPart !== null && dayPart !== undefined && dayPart === i)
                            continue;

                        if (monthPart !== null && monthPart !== undefined && monthPart === i)
                            continue;

                        years.push(isYear.getFullYear());
                    }
                }
                const dates = new Array();
                for (let d = days.length - 1; d >= 0; d--) {
                    for (let m = 0; m < months.length; m++) {
                        for (let y = 0; y < years.length; y++) {
                            const result = new Date(years[y], months[m], days[d]);
                            if (years[y] < 1970)
                                result.setFullYear(years[y]);
                            if (!isNaN(result.getTime())) {
                                dates.push(result);
                            }
                        }
                    }
                }
                if (dates.length > 0) {
                    parseDate = dates[0];
                    parsed = true;
                }
            }
            if (timePart) {
                const timeParts = timePart.indexOf(':') >= 0 ? timePart.split(':') : timePart;
                const parsedTime = that.parseDate(timePart, 'h:mm tt', calendar) || that.parseDate(timePart, 'HH:mm:ss.fff', calendar) || that.parseDate(timePart, 'HH:mm:ss.ff', calendar) || that.parseDate(timePart, 'h:mm:ss tt', calendar) || that.parseDate(timePart, 'HH:mm:ss.tttt', calendar) || that.parseDate(timePart, 'HH:mm:ss', calendar) || that.parseDate(timePart, 'HH:mm', calendar) || that.parseDate(timePart, 'HH', calendar);

                let hour = 0, minute = 0, second = 0, milisecond = 0;
                if (parsedTime && !isNaN(parsedTime.getTime())) {
                    hour = parsedTime.getHours();
                    minute = parsedTime.getMinutes();
                    second = parsedTime.getSeconds();
                    milisecond = parsedTime.getMilliseconds();
                }
                else {
                    if (timeParts.length === 1) {
                        hour = parseInt(timeParts[0]);
                    }
                    if (timeParts.length === 2) {
                        hour = parseInt(timeParts[0]);
                        minute = parseInt(timeParts[1]);
                    }
                    if (timeParts.length === 3) {
                        hour = parseInt(timeParts[0]);
                        minute = parseInt(timeParts[1]);
                        if (timeParts[2].indexOf('.') >= 0) {
                            second = parseInt(timeParts[2].toString().split('.')[0]);
                            milisecond = parseInt(timeParts[2].toString().split('.')[1]);
                        }
                        else {
                            second = parseInt(timeParts[2]);
                        }
                    }
                    if (timeParts.length === 4) {
                        hour = parseInt(timeParts[0]);
                        minute = parseInt(timeParts[1]);
                        second = parseInt(timeParts[2]);
                        milisecond = parseInt(timeParts[3]);
                    }
                }
                if (parseDate && !isNaN(hour) && !isNaN(minute) && !isNaN(second) && !isNaN(milisecond)) {
                    parseDate.setHours(hour, minute, second, milisecond);
                    parsed = true;
                }
            }
            if (parsed) {
                return parseDate;
            }
        }
        if (value !== null && value !== undefined) {
            dateParts = [':', '/', '-'];
            let canParse = true;
            for (let part = 0; part < dateParts.length; part++) {
                if (value.indexOf(dateParts[part]) !== -1) {
                    canParse = false;
                }
            }

            if (canParse) {
                const number = new Number(value);
                if (!isNaN(number)) {
                    return new Date(number);
                }
            }
        }

        return null;
    }

    getParseRegExp(cal, format) {
        const that = this;

        // converts a format string into a regular expression with groups that
        // can be used to extract date fields from a date string.
        // check for a cached parse regex.
        let re = cal._parseRegExp;
        if (!re) {
            cal._parseRegExp = re = {};
        }
        else {
            const reFormat = re[format];
            if (reFormat) {
                return reFormat;
            }
        }

        // expand single digit formats, then escape regular expression characters.
        let expFormat = that.expandFormat(cal, format).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, '\\\\$1'),
            regexp = ['^'],
            groups = [],
            index = 0,
            quoteCount = 0,
            tokenRegExp = that.getTokenRegExp(),
            match;

        // iterate through each date token found.
        while ((match = tokenRegExp.exec(expFormat)) !== null) {
            const preMatch = expFormat.slice(index, match.index);
            index = tokenRegExp.lastIndex;

            // don't replace any matches that occur inside a string literal.
            quoteCount += that.appendPreOrPostMatch(preMatch, regexp);
            if (quoteCount % 2) {
                regexp.push(match[0]);
                continue;
            }

            // add a regex group for the token.
            let m = match[0],
                len = m.length,
                add;

            switch (m) {
                case 'dddd': case 'ddd':
                case 'MMMM': case 'MMM':
                case 'gg': case 'g':
                    add = '(\\D+)';
                    break;
                case 'tt': case 't':
                    add = '(\\D*)';
                    break;
                case 'yyyyy':
                    add = '(\\d{1,4})';
                    break;
                case 'yyyy':
                    add = '(\\d{' + len + '})';
                    break;
                case 'fff':
                case 'ff':
                case 'f':
                    add = '(\\d{1,' + len + '})';
                    break;
                case 'dd': case 'd':
                case 'MM': case 'M':
                case 'yy': case 'y':
                case 'HH': case 'H':
                case 'hh': case 'h':
                case 'mm': case 'm':
                case 'ss': case 's':
                    add = '(\\d\\d?)';
                    break;
                case 'uu':
                case 'nn':
                case 'pp':
                case 'ee':
                case 'aa':
                case 'xx':
                case 'oo':
                    add = '(\\d{1,3})';
                    break;
                case 'zzz':
                    add = '([+-]?\\d\\d?:\\d{2})';
                    break;
                case 'zz': case 'z':
                    add = '([+-]?\\d\\d?)';
                    break;
                case '/':
                    add = '/'; // To include slash in a capturing group → add = '(\\' + cal['/'] + ')';
                    break;
                default:
                    if ((/i{1,24}/).test(m)) {
                        add = '(\\d{' + m.length + '})';
                    }
                    else {
                        throw 'Invalid date format pattern \'' + m + '\'.';
                    }
            }
            if (add) {
                regexp.push(add);
            }

            if (m === '/') {
                continue;
            }

            groups.push(match[0]);
        }
        that.appendPreOrPostMatch(expFormat.slice(index), regexp);
        regexp.push('$');

        // allow whitespace to differ when matching formats.
        const regexpStr = regexp.join('').replace(/\s+/g, '\\s+'),
            parseRegExp = { 'regExp': regexpStr, 'groups': groups };

        // cache the regex for this format.
        return re[format] = parseRegExp;
    }

    outOfRange(value, low, high) {
        return value < low || value > high;
    }

    expandYear(cal, year) {
        const that = this;

        // expands 2-digit year into 4 digits.
        const now = new Date(),
            era = that.getEra(now);
        if (year < 100) {
            let twoDigitYearMax = cal.twoDigitYearMax;
            twoDigitYearMax = typeof twoDigitYearMax === 'string' ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
            const curr = that.getEraYear(now, cal, era);
            year += curr - (curr % 100);
            if (year > twoDigitYearMax) {
                year -= 100;
            }
        }
        return year;
    }

    padZeros(num, c) {
        let r, s = num + '',
            zeros = ['0', '00', '000'];
        if (c > 1 && s.length < c) {
            r = (zeros[c - 2] + s);
            return r.substr(r.length - c, c);
        }
        else {
            r = s;
        }
        return r;
    }

    parseDate(value, format, calendar) {
        const that = this;

        if (calendar === undefined || calendar === null) {
            calendar = that.calendar;
        }
        // try to parse the date string by matching against the format string
        // while using the specified culture for date field names.
        value = that.trim(value);
        const cal = calendar,
            // convert date formats into regular expressions with groupings.
            // use the regexp to determine the input format and extract the date fields.
            parseInfo = that.getParseRegExp(cal, format),
            match = new RegExp(parseInfo.regExp).exec(value);
        if (match === null) {
            return null;
        }
        // found a date format that matches the input.
        let groups = parseInfo.groups,
            era = null, year = null, month = null, date = null, weekDay = null,
            hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
            pmHour = false;
        // iterate the format groups to extract and set the date fields.
        for (let j = 0, jl = groups.length; j < jl; j++) {
            const matchGroup = match[j + 1];
            if (matchGroup) {
                const current = groups[j],
                    clength = current.length,
                    matchInt = parseInt(matchGroup, 10);

                switch (current) {
                    case 'dd': case 'd':
                        // Day of month.
                        date = matchInt;
                        // check that date is generally in valid range, also checking overflow below.
                        if (that.outOfRange(date, 1, 31)) return null;
                        break;
                    case 'MMM':
                    case 'MMMM':
                    case 'MMMMM':
                    case 'MMMMMM':
                    case 'MMMMMMM':
                    case 'MMMMMMMM':
                        month = that.getMonthIndex(cal, matchGroup, clength === 3);
                        if (that.outOfRange(month, 0, 11)) return null;
                        break;
                    case 'M': case 'MM':
                        // Month.
                        month = matchInt - 1;
                        if (that.outOfRange(month, 0, 11)) return null;
                        break;
                    case 'y': case 'yy':
                    case 'yyyy':
                        year = clength < 4 ? that.expandYear(cal, matchInt) : matchInt;
                        if (that.outOfRange(year, 0, 9999)) return null;
                        break;
                    case 'h': case 'hh':
                        // Hours (12-hour clock).
                        hour = matchInt;
                        if (hour === 12) hour = 0;
                        if (that.outOfRange(hour, 0, 11)) return null;
                        break;
                    case 'H': case 'HH':
                        // Hours (24-hour clock).
                        hour = matchInt;
                        if (that.outOfRange(hour, 0, 23)) return null;
                        break;
                    case 'm': case 'mm':
                        // Minutes.
                        min = matchInt;
                        if (that.outOfRange(min, 0, 59)) return null;
                        break;
                    case 's': case 'ss':
                        // Seconds.
                        sec = matchInt;
                        if (that.outOfRange(sec, 0, 59)) return null;
                        break;
                    case 'tt': case 't':
                        // AM/PM designator.
                        // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                        // the AM tokens. If not, fail the parse for this format.
                        pmHour = cal.PM && (matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2]);
                        if (!pmHour && (!cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]))) return null;
                        break;
                    case 'f': // Deciseconds.
                    case 'ff': // Centiseconds.
                    case 'fff': // Milliseconds.
                        msec = matchInt * Math.pow(10, 3 - clength);
                        if (that.outOfRange(msec, 0, 999)) return null;
                        break;
                    case 'uu':
                    case 'nn':
                    case 'pp':
                    case 'ee':
                    case 'aa':
                    case 'xx':
                    case 'oo':
                        if (that.outOfRange(matchInt, 0, 1000)) {
                            return null;
                        }

                        that[that._codeToUnit[current]] = matchInt;
                        break;
                    case 'ddd': // Day of week.
                    case 'dddd': // Day of week.
                        weekDay = that.getDayIndex(cal, matchGroup, clength === 3);
                        if (that.outOfRange(weekDay, 0, 6)) return null;
                        break;
                    case 'zzz': {
                        // Time zone offset in +/- hours:min.
                        const offsets = matchGroup.split(/:/);
                        if (offsets.length !== 2) return null;
                        hourOffset = parseInt(offsets[0], 10);
                        if (that.outOfRange(hourOffset, -12, 13)) return null;
                        const minOffset = parseInt(offsets[1], 10);
                        if (that.outOfRange(minOffset, 0, 59)) return null;
                        tzMinOffset = (hourOffset * 60) + (that.startsWith(matchGroup, '-') ? -minOffset : minOffset);
                        break;
                    }
                    case 'z': case 'zz':
                        // Time zone offset in +/- hours.
                        hourOffset = matchInt;
                        if (that.outOfRange(hourOffset, -12, 13)) return null;
                        tzMinOffset = hourOffset * 60;
                        break;
                    case 'g': case 'gg': {
                        let eraName = matchGroup;
                        if (!eraName || !cal.eras) return null;
                        eraName = this.trim(eraName.toLowerCase());
                        for (let i = 0, l = cal.eras.length; i < l; i++) {
                            if (eraName === cal.eras[i].nathat.toLowerCase()) {
                                era = i;
                                break;
                            }
                        }
                        // could not find an era with that name
                        if (era === null) return null;
                        break;
                    }
                    default: {
                        let precisionDigits = matchGroup;

                        if (precisionDigits.length % 3 === 1) {
                            precisionDigits += '00';
                        }
                        else if (precisionDigits.length % 3 === 2) {
                            precisionDigits += '0';
                        }

                        msec = parseInt(precisionDigits.slice(0, 3), 10);
                        precisionDigits = precisionDigits.slice(3);

                        let unitIndex = 0;

                        while (precisionDigits.length > 0) {
                            that[that._smallUnits[unitIndex]] = parseInt(precisionDigits.slice(0, 3), 10);

                            precisionDigits = precisionDigits.slice(3);
                            unitIndex++;
                        }
                    }
                }
            }
        }
        let result = new Date(), defaultYear, convert = cal.convert;
        defaultYear = result.getFullYear();
        if (year === null) {
            year = defaultYear;
        }
        else if (cal.eras) {
            // year must be shifted to normal gregorian year
            // but not if year was not specified, its already normal gregorian
            // per the main if clause above.
            year += cal.eras[(era || 0)].offset;
        }
        // set default day and month to 1 and January, so if unspecified, these are the defaults
        // instead of the current day/month.
        if (month === null) {
            month = 0;
        }
        if (date === null) {
            date = 1;
        }
        // now have year, month, and date, but in the culture's calendar.
        // convert to gregorian if necessary
        if (convert) {
            result = convert.toGregorian(year, month, date);
            // conversion failed, must be an invalid match
            if (result === null) return null;
        }
        else {
            // have to set year, month and date together to avoid overflow based on current date.
            result.setFullYear(year, month, date);
            // check to see if date overflowed for specified month (only checked 1-31 above).
            if (result.getDate() !== date) return null;
            // invalid day of week.
            if (weekDay !== null && result.getDay() !== weekDay) {
                return null;
            }
        }
        // if pm designator token was found make sure the hours fit the 24-hour clock.
        if (pmHour && hour < 12) {
            hour += 12;
        }
        result.setHours(hour, min, sec, msec);

        if (tzMinOffset !== null) {
            // adjust timezone to utc before applying local offset.
            const adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
            // Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
            // to ensure both these fields will not exceed this range.  adjustedMin will range
            // somewhere between -1440 and 1500, so we only need to split this into hours.
            result.setHours(result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60);
        }
        return result;
    }

    toString(format, calendar) {
        const that = this;

        if (format === undefined) {
            format = 'yyyy-MM-dd HH:mm:ss';
        }

        const formatStamp = that.dateData.toString() + that.getFractionsOfSecondStamp() + format + (that.timeZone || '');

        if (Smart.Utilities.DateTime.cache && Smart.Utilities.DateTime.cache[formatStamp]) {
            return Smart.Utilities.DateTime.cache[formatStamp];
        }
        const value = that.toDate();

        if (calendar === undefined || calendar === null) {
            calendar = that.calendar;
        }

        if (typeof value === 'string') {
            return value;
        }

        if (!format || !format.length || format === 'i') {
            let ret;
            ret = that.formatDate(value, calendar.patterns.F, calendar);
            return ret;
        }

        const eras = calendar.eras,
            sortable = format === 's';
        format = that.expandFormat(calendar, format);

        // Start with an empty string
        const ret = [];
        let hour,
            quoteCount = 0,
            tokenRegExp = that.getTokenRegExp(),
            converted;

        function getPart(date, part) {
            if (converted) {
                return converted[part];
            }
            if (date.getMonth !== undefined) {
                switch (part) {
                    case 0: return date.getFullYear();
                    case 1: return date.getMonth();
                    case 2: return date.getDate();
                }
            }
        }

        for (; ;) {
            // Save the current index
            const index = tokenRegExp.lastIndex,
                // Look for the next pattern
                ar = tokenRegExp.exec(format);

            // Append the text before the pattern (or the end of the string if not found)
            const preMatch = format.slice(index, ar ? ar.index : format.length);
            quoteCount += that.appendPreOrPostMatch(preMatch, ret);

            if (!ar) {
                break;
            }

            // do not replace any matches that occur inside a string literal.
            if (quoteCount % 2) {
                ret.push(ar[0]);
                continue;
            }

            const current = ar[0],
                clength = current.length;
            let part;

            if ((/i{1,24}/).test(current)) {
                ret.push(that.getFirstNDigitsOfPrecision(current.length));
                continue;
            }

            switch (current) {
                case 'ddd': //Day of the week, as a three-letter abbreviation
                case 'dddd': {
                    // Day of the week, using the full name
                    const names = (clength === 3) ? calendar.days.namesAbbr : calendar.days.names;
                    ret.push(names[value.getDay()]);
                    break;
                }
                case 'd': // Day of month, without leading zero for single-digit days
                case 'dd': // Day of month, with leading zero for single-digit days
                    ret.push(that.padZeros(getPart(value, 2), clength));
                    break;
                case 'MMM': // Month, as a three-letter abbreviation
                case 'MMMM': // Month, using the full name
                    part = getPart(value, 1);
                    ret.push(calendar.months[clength === 3 ? 'namesAbbr' : 'names'][part]);
                    break;
                case 'M': // Month, as digits, with no leading zero for single-digit months
                case 'MM': // Month, as digits, with leading zero for single-digit months
                    ret.push(that.padZeros(getPart(value, 1) + 1, clength));
                    break;
                case 'y': // Year, as two digits, but with no leading zero for years less than 10
                case 'yy': // Year, as two digits, with leading zero for years less than 10
                case 'yyyy': // Year represented by four full digits
                    part = that.getEraYear(value, calendar, that.getEra(value, eras), sortable);
                    if (clength < 4) {
                        part = part % 100;
                    }
                    ret.push(that.padZeros(part, clength));
                    break;
                case 'h': // Hours with no leading zero for single-digit hours, using 12-hour clock
                case 'hh': // Hours with leading zero for single-digit hours, using 12-hour clock
                    hour = value.getHours() % 12;
                    if (hour === 0) hour = 12;
                    ret.push(that.padZeros(hour, clength));
                    break;
                case 'H': // Hours with no leading zero for single-digit hours, using 24-hour clock
                case 'HH': // Hours with leading zero for single-digit hours, using 24-hour clock
                    ret.push(that.padZeros(value.getHours(), clength));
                    break;
                case 'm': // Minutes with no leading zero  for single-digit minutes
                case 'mm': // Minutes with leading zero  for single-digit minutes
                    ret.push(that.padZeros(value.getMinutes(), clength));
                    break;
                case 's': // Seconds with no leading zero for single-digit seconds
                case 'ss': // Seconds with leading zero for single-digit seconds
                    ret.push(that.padZeros(value.getSeconds(), clength));
                    break;
                case 't': // One character am/pm indicator ('a' or 'p')
                case 'tt': // Multicharacter am/pm indicator
                    part = value.getHours() < 12 ? (calendar.AM ? calendar.AM[0] : ' ') : (calendar.PM ? calendar.PM[0] : ' ');
                    ret.push(clength === 1 ? part.charAt(0) : part);
                    break;
                case 'f': // Deciseconds
                case 'ff': // Centiseconds
                case 'fff': // Milliseconds
                    ret.push(that.padZeros(value.getMilliseconds(), 3).substr(0, clength));
                    break;
                case 'u':
                case 'n':
                case 'p':
                case 'e':
                case 'a':
                case 'x':
                case 'o':
                    ret.push(that[that._codeToUnit[current]]);
                    break;
                case 'uu':
                case 'nn':
                case 'pp':
                case 'ee':
                case 'aa':
                case 'xx':
                case 'oo':
                    ret.push(that.padZeros(that[that._codeToUnit[current]], 3));
                    break;
                case 'z': // Time zone offset, no leading zero                
                case 'zz': // Time zone offset with leading zero
                    //hour = value.getTimezoneOffset() / 60;
                    //ret.push((hour <= 0 ? '+' : '-') + that.padZeros(Math.floor(Math.abs(hour)), clength));

                    ret.push((that.timeZoneOffsetHours >= 0 ? '+' : '-') +
                        that.padZeros(Math.floor(Math.abs(that.timeZoneOffsetHours)), clength));
                    break;
                case 'zzz':
                    //    // Time zone offset with leading zero
                    //    hour = value.getTimezoneOffset() / 60;
                    //    ret.push((hour <= 0 ? '+' : '-') + that.padZeros(Math.floor(Math.abs(hour)), 2) +
                    //    // Hard coded ':' separator, rather than using calendar.TimeSeparator
                    //    // Repeated here for consistency, plus ':' was already assumed in date parsing.
                    //':' + that.padZeros(Math.abs(value.getTimezoneOffset() % 60), 2));

                    ret.push((that.timeZoneOffsetHours >= 0 ? '+' : '-') +
                        that.padZeros(Math.floor(Math.abs(that.timeZoneOffsetHours)), 2) + ':' +
                        that.padZeros(Math.abs(that.timeZoneOffsetHours % 1) * 60, 2));
                    break;
                case 'g':
                case 'gg':
                    if (calendar.eras) {
                        ret.push(calendar.eras[that.getEra(value, eras)].name);
                    }
                    break;
                case '/':
                    ret.push(calendar['/']);
                    break;
                default:
                    throw 'Invalid date format pattern \'' + current + '\'.';
            }
        }

        const result = ret.join('');
        if (!Smart.Utilities.DateTime.cache) {
            Smart.Utilities.DateTime.cache = new Array();
        }
        Smart.Utilities.DateTime.cache[formatStamp] = result;
        return result;
    }

    /**
     * Returns a time stamp from the microseconds, nanoseconds, picoseconds, femtoseconds, attoseconds, zeptoseconds and yoctoseconds.
     */
    getFractionsOfSecondStamp() {
        const that = this;

        return that._microsecond.toString() + that._nanosecond + that._picosecond + that._femtosecond + that._attosecond + that._zeptosecond + that._yoctosecond;
    }

    getFirstNDigitsOfPrecision(precision, noMilliseconds) {
        const that = this,
            result = '' + (noMilliseconds !== true ? that.padZeros(that.millisecond(), 3) : '') +
                that.padZeros(that._microsecond, 3) +
                that.padZeros(that._nanosecond, 3) +
                that.padZeros(that._picosecond, 3) +
                that.padZeros(that._femtosecond, 3) +
                that.padZeros(that._attosecond, 3) +
                that.padZeros(that._zeptosecond, 3) +
                that.padZeros(that._yoctosecond, 3);

        return result.slice(0, precision);
    }

    copySmallTimePartValues(newDate) {
        const that = this;

        newDate._microsecond = that._microsecond;
        newDate._nanosecond = that._nanosecond;
        newDate._picosecond = that._picosecond;
        newDate._femtosecond = that._femtosecond;
        newDate._attosecond = that._attosecond;
        newDate._zeptosecond = that._zeptosecond;
        newDate._yoctosecond = that._yoctosecond;
    }

    add(value, scale, createNew) {
        const that = this;

        const ms = that.internalMS();
        if (scale === undefined) {
            if (createNew === false) {
                that.dateData = (ms + parseInt(value._ticks / that.ticksPerMillisecond));
                return that;
            }

            const newDate = new Smart.Utilities.DateTime((ms + parseInt(value._ticks / that.ticksPerMillisecond)));
            that.copyTimeZone(newDate);
            that.copySmallTimePartValues(newDate);
            return newDate;
        }
        const millis = (value * scale);
        if (millis <= -that.maxMillis || millis >= that.maxMillis)
            throw new Error('Out of Range');

        if (createNew === false) {
            that.dateData = (ms + millis);
            return that;
        }

        const newDate = new Smart.Utilities.DateTime(ms + millis);
        that.copyTimeZone(newDate);
        that.copySmallTimePartValues(newDate);
        return newDate;
    }

    addDays(value, createNew) {
        const that = this;

        return that.add(value, that.millisPerDay, createNew);
    }

    /**
     * Clones a DateTime object.
     */
    clone() {
        const that = this,
            date = new Smart.Utilities.DateTime(that.dateData);

        that.copyTimeZone(date);
        that.copySmallTimePartValues(date);

        return date;
    }

    clearTime() {
        const that = this,
            month = that.month(),
            year = that.year(),
            day = that.day(),
            newDate = new Smart.Utilities.DateTime(year, month, day, 0, 0, 0, 0);

        that.copyTimeZone(newDate);

        return newDate;
    }

    addHours(value, createNew) {
        const that = this;

        return that.add(value, that.millisPerHour, createNew);
    }

    addDeciseconds(value, createNew) {
        return this.add(value * 100, 1, createNew);
    }

    addCentiseconds(value, createNew) {
        return this.add(value * 10, 1, createNew);
    }

    addMilliseconds(value, createNew) {
        return this.add(value, 1, createNew);
    }

    addMinutes(value, createNew) {
        const that = this;

        return that.add(value, that.millisPerMinute, createNew);
    }

    addMonths(months, createNew) {
        const that = this;

        if (months < -120000 || months > 120000) throw new Error('Invalid Months Value');
        let y = parseInt(that.getDatePart(that.datePartYear)),
            m = parseInt(that.getDatePart(that.datePartMonth)),
            d = parseInt(that.getDatePart(that.datePartDay));

        if (months % 12 === 0) {
            y = y + months / 12;
        }
        else {
            const i = m - 1 + months;
            if (i >= 0) {
                m = i % 12 + 1;
                y = y + i / 12;
            }
            else {
                m = 12 + (i + 1) % 12;
                y = y + (i - 11) / 12;
            }
            y = parseInt(y);
        }
        if (y < 1 || y > 9999) {
            throw new Error('Year out of range');
        }
        const days = that.daysInMonth(y, m);
        if (d > days) d = days;

        if (createNew === false) {
            that.dateData = (that.dateToMS(y, m, d) + that.internalMS() % that.millisPerDay);
            return that;
        }

        const newDate = new Smart.Utilities.DateTime((that.dateToMS(y, m, d) + that.internalMS() % that.millisPerDay));
        that.copyTimeZone(newDate);
        that.copySmallTimePartValues(newDate);
        return newDate;
    }

    addSeconds(value, createNew) {
        const that = this;

        return that.add(value, that.millisPerSecond, createNew);
    }

    addYears(value, createNew) {
        return this.addMonths(value * 12, createNew);
    }

    /**
     * Adds or removes microseconds.
     */
    addMicroseconds(value, createNew) {
        if (value === 0) {
            return;
        }

        const that = this;
        let millisecondsToAdd, microseconds;

        if (value < 0 &&
            that.hour() === 0 &&
            that.minute() === 0 &&
            that.second() === 0 &&
            that.millisecond() === 0 &&
            that._microsecond === 0) {

            millisecondsToAdd = parseInt(value / 1000, 10) - 1;
            microseconds = 1000 + (value % 1000);
        }

        const totalMilliseconds = that.timeToMS(that.hour(), that.minute(), that.second(), that.millisecond()) * 1000 + that._microsecond,
            updatedTotalMilliseconds = totalMilliseconds + value;

        if (millisecondsToAdd === undefined) {
            millisecondsToAdd = parseInt(updatedTotalMilliseconds / 1000, 10) - parseInt(totalMilliseconds / 1000, 10);
        }

        if (microseconds === undefined) {
            microseconds = parseInt(updatedTotalMilliseconds % 1000, 10);
        }

        let newDateTimeObject;

        if (millisecondsToAdd !== 0) {
            newDateTimeObject = that.addMilliseconds(millisecondsToAdd, createNew);
        }

        if (createNew === false) {
            that._microsecond = microseconds;
        }
        else {
            if (!newDateTimeObject) {
                newDateTimeObject = that.clone();
            }

            newDateTimeObject._microsecond = microseconds;

            return newDateTimeObject;
        }
    }

    /**
     * Adds or removes parts of a second.
     */
    addFractionsOfSecond(value, createNew, unit, biggerUnit, biggerUnitMethod) {
        if (value === 0) {
            return;
        }

        const that = this,
            total = that[biggerUnit] * 1000 + that[unit],
            updatedTotal = value + total;
        let biggerUnitToAdd = parseInt(updatedTotal / 1000, 10) - parseInt(total / 1000, 10),
            units = parseInt(updatedTotal % 1000, 10),
            newDateTimeObject;

        if (value < 0 && updatedTotal < 0 && units < 0) {
            biggerUnitToAdd--;
            units = 1000 + units;
        }

        if (biggerUnitToAdd !== 0) {
            newDateTimeObject = that[biggerUnitMethod](biggerUnitToAdd, createNew);
        }

        if (createNew === false) {
            that[unit] = units;
        }
        else {
            if (!newDateTimeObject) {
                newDateTimeObject = that.clone();
            }

            newDateTimeObject[unit] = units;

            return newDateTimeObject;
        }
    }

    /**
     * Adds or removes nanoseconds.
     */
    addNanoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_nanosecond', '_microsecond', 'addMicroseconds');
    }

    /**
     * Adds or removes picoseconds.
     */
    addPicoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_picosecond', '_nanosecond', 'addNanoseconds');
    }

    /**
     * Adds or removes femtoseconds.
     */
    addFemtoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_femtosecond', '_picosecond', 'addPicoseconds');
    }

    /**
     * Adds or removes attoseconds.
     */
    addAttoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_attosecond', '_femtosecond', 'addFemtoseconds');
    }

    /**
     * Adds or removes zeptoseconds.
     */
    addZeptoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_zeptosecond', '_attosecond', 'addAttoseconds');
    }

    /**
     * Adds or removes yoctoseconds.
     */
    addYoctoseconds(value, createNew) {
        return this.addFractionsOfSecond(value, createNew, '_yoctosecond', '_zeptosecond', 'addZeptoseconds');
    }

    getTimeZoneOffset() {
        const today = new Date(),
            jan = new Date(today.getFullYear(), 0, 1),
            jul = new Date(today.getFullYear(), 6, 1),
            dst = today.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

        return {
            offset: -(today.getTimezoneOffset() / 60),
            dst: +dst
        };
    }

    isInDaylightSavingTime() {
        const today = new Date(),
            winter = new Date(today.getFullYear(), 0, 1),
            summer = new Date(today.getFullYear(), 6, 1);

        return this.date().getTimezoneOffset() < Math.max(winter.getTimezoneOffset(), summer.getTimezoneOffset());
    }

    supportsDaylightSavingTime() {
        const today = new Date(),
            winter = new Date(today.getFullYear(), 0, 1),
            summer = new Date(today.getFullYear(), 6, 1);
        return winter.getTimezoneOffset() !== summer.getTimezoneOffset();
    }

    date() {
        const that = this,
            month = that.month(),
            year = that.year(),
            day = that.day(),
            newDate = new Smart.Utilities.DateTime(year, month, day);

        that.copyTimeZone(newDate);
        return newDate;
    }

    isWeekend() {
        const that = this;

        return that.dayOfWeek() === 0 || that.dayOfWeek() === 6;
    }

    toDate(timeZone) {
        const that = this,
            month = that.month(),
            year = that.year(),
            day = that.day(),
            hour = that.hour(),
            minute = that.minute(),
            second = that.second(),
            millisecond = that.millisecond();
        let result = new Date(year, month - 1, day);

        if (year < 1970) {
            result.setFullYear(year);
        }
        result.setHours(hour, minute, second, millisecond);
        if (timeZone) {
            const matches = that.timeZones.filter(function (zone) {
                return zone.id === timeZone;
            });
            if (matches.length) {
                let tzMinOffset = matches[0].offset;
                const localTime = result.getTime();
                let localOffset = result.getTimezoneOffset() * 60 * 1000;
                if (that.timeZone) {
                    const timeZoneMatches = that.timeZones.filter(function (zone) {
                        return zone.id === that.timeZone;
                    });
                    if (timeZoneMatches.length) {
                        localOffset = -timeZoneMatches[0].offset * 60 * 1000;
                    }
                }
                // obtain UTC time in msec
                const utc = localTime + localOffset;

                // create new Date object for different city
                // using supplied offset
                result = new Date(utc + (60 * 1000 * tzMinOffset));
            }
        }
        return result;
    }

    toTimeZone(timeZone) {
        const that = this;
        let tz = timeZone;

        if (tz === null || tz === undefined) {
            tz = 'Local';
        }

        if (that.timeZone === tz) {
            return that.clone();
        }

        const matches = that.timeZones.filter(function (zone) {
            return zone.id === tz;
        });

        if (matches.length === 0) {
            return that.clone();
        }

        const date = this.toDate(tz),
            smartDate = new Smart.Utilities.DateTime(date);

        smartDate.timeZone = tz;
        smartDate.timeZoneOffset = matches[0].offset;
        smartDate.timeZoneOffsetHours = matches[0].offsetHours;

        that.copySmallTimePartValues(smartDate);

        return smartDate;
    }

    day() {
        const that = this;

        return that.getDatePart(that.datePartDay);
    }

    month() {
        const that = this;

        return that.getDatePart(that.datePartMonth);
    }

    year() {
        const that = this;

        return that.getDatePart(that.datePartYear);
    }

    millisecond() {
        return parseInt((this.internalMS()) % 1000);
    }

    hour() {
        const that = this;

        return parseInt(Math.floor(that.internalMS() / that.millisPerHour) % 24);
    }

    minute() {
        const that = this;

        return parseInt((that.internalMS() / that.millisPerMinute) % 60);
    }

    second() {
        const that = this;

        return parseInt((that.internalMS() / that.millisPerSecond) % 60);
    }

    microsecond() {
        return this._microsecond;
    }

    nanosecond() {
        return this._nanosecond;
    }

    picosecond() {
        return this._picosecond;
    }

    femtosecond() {
        return this._femtosecond;
    }

    attosecond() {
        return this._attosecond;
    }

    zeptosecond() {
        return this._zeptosecond;
    }

    yoctosecond() {
        return this._yoctosecond;
    }

    valueOf() {
        return this.dateData;
    }

    equals(date) {
        const that = this;

        return that.dateData === date.dateData && that._microsecond === date._microsecond && that._nanosecond === date._nanosecond && that._picosecond === date._picosecond &&
            that._femtosecond === date._femtosecond && that._attosecond === date._attosecond && that._zeptosecond === date._zeptosecond && that._yoctosecond === date._yoctosecond;
    }

    equalDateParts(date) {
        const that = this;

        if (that.year() === date.year() &&
            that.month() === date.month() &&
            that.day() === date.day()) {
            return true;
        }

        return false;
    }

    /**
     * Compares two dates.
     */
    compare(date) {
        const that = this;

        if (that.equals(date)) {
            return 0;
        }

        const timeParts = ['dateData', '_microsecond', '_nanosecond', '_picosecond', '_femtosecond', '_attosecond', '_zeptosecond', '_yoctosecond'];

        for (let i = 0; i < timeParts.length; i++) {
            const timePart = timeParts[i];

            if (that[timePart] > date[timePart]) {
                return 1;
            }
            else if (that[timePart] < date[timePart]) {
                return -1;
            }
        }

        return 0;
    }

    toDateString() {
        return this.toDate().toDateString();
    }

    toLocaleDateString() {
        const that = this;

        return that.toDate().toLocaleDateString(that.calendar.locale);
    }

    toLocaleString() {
        const that = this;

        return that.toDate().toLocaleString(that.calendar.locale);
    }

    toLocaleTimeString() {
        const that = this;

        return that.toDate().toLocaleTimeString(that.calendar.locale);
    }

    validateTimeZone(timeZone) {
        const that = this;

        if (typeof timeZone !== 'string') {
            return;
        }

        const matches = that.timeZones.filter(function (zone) {
            return zone.id === timeZone;
        });

        if (matches.length === 0) {
            return;
        }

        that.timeZone = timeZone;
        that.timeZoneOffset = matches[0].offset;
        that.timeZoneOffsetHours = matches[0].offsetHours;
    }

    copyTimeZone(newDateTime) {
        const that = this;

        newDateTime.timeZone = that.timeZone;
        newDateTime.timeZoneOffset = that.timeZoneOffset;
        newDateTime.timeZoneOffsetHours = that.timeZoneOffsetHours;
    }

    getTimeStamp() {
        const that = this,
            timeStamp = new Smart.Utilities.BigNumber(that.dateData.toString() + that.getFirstNDigitsOfPrecision(undefined, true));

        return timeStamp;
    }
});
