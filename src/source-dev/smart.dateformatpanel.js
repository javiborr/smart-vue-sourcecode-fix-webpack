
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/*
 * Class DateFormatPanel
 * */
Smart.Utilities.Assign('DateFormatPanel', class DateFormatPanel {

    constructor(formatVariants, inputDateTimeFormats, customDateTimeSelector, locale = 'en', messages = '') {
        const that = this;

        if (formatVariants) {

            that.formatVariants = formatVariants;
            that.inputDateTimeFormats = inputDateTimeFormats;
            that.value = ''; // Return format
            that.customDateTimeContainer = document.querySelector(customDateTimeSelector); // All the content holder

            // Sets localization settings
            that._setLocalizationSettings(locale, messages);

            // Holdes all smart inputs
            that._initSmartInputHolder();

            // 'Add format' holder
            that._initAddMoreFormatsButton();

            // 'Clickable date time format' holder
            that._initDateTimeFormatHolder();
        }
    }

    /**
     * Set default localization settings
     */
    _setLocalizationSettings(locale, messages) {
        const that = this;

        that.locale = locale;
        that.messages = messages;

        // Sets default locale && messages
        that.defaultLocale = 'en';
        that.defaultMessages = {
            'en': {
                'apply': 'apply',
                'date': 'date',
                'time': 'time',
                'day': 'day',
                'month': 'month',
                'year': 'year',
                'hours': 'hours',
                'hour': 'hour',
                'minutes': 'minutes',
                'minute': 'minute',
                'seconds': 'seconds',
                'second': 'second',
                'milliseconds': 'milliseconds',
                'ampm': 'am/pm',
                'delete': 'delete'
            },
        };

        // If messages not passed - get default
        if (!that.messages) {
            that.messages = that.defaultMessages;
        }

        // If passed invalid language
        if (!that.messages[that.locale]) {
            if (that.messages[that.defaultLocale]) {
                that.locale = that.defaultLocale;
            }
            else {
                that.messages = that.defaultMessages;
                that.locale = that.defaultLocale;
            }
        }
    }

    /*
     * Creates the main holders
     */
    _initSmartInputHolder() {
        const that = this;

        that.smartInputButtonsElementsHolder = document.createElement('div');
        that.smartInputButtonsElementsHolder.classList.add('smart-input-buttons-elements-holder');

        that.borderHolder = document.createElement('div');
        that.borderHolder.classList.add('smart-input-and-add-formats-holder');

        // smartInputListHolder - Holdes all smart inputs
        that.smartInputHolder = document.createElement('div');
        that.smartInputHolder.classList.add('smart-input-list-holder');
        that.borderHolder.appendChild(that.smartInputHolder);
        that.smartInputButtonsElementsHolder.appendChild(that.borderHolder);
        that.customDateTimeContainer.prepend(that.smartInputButtonsElementsHolder);
    }

    /*
     * Creates 'Add format' and 'Apply' buttons
     */
    _initAddMoreFormatsButton() {
        const that = this;

        // smart-drop-down-button.add-format-holder
        that.addFormatHolder = document.createElement('smart-drop-down-button');
        that.addFormatHolder.setAttribute('drop-down-width', 'auto');
        that.addFormatHolder.placeholder = '';
        that.addFormatHolder.classList.add('add-format-holder');
        that.addFormatHolder.classList.add('smart-hidden');


        // div.all-format-holders
        let allFormatHolders = document.createElement('div');
        allFormatHolders.classList.add('all-format-holders');

        // div.format-holder
        let formatHolder = document.createElement('div');
        formatHolder.classList.add('format-holder');

        //span
        let formatHolderSpan = document.createElement('span');
        formatHolderSpan.innerHTML = that.messages[that.locale].date ? that.messages[that.locale].date.toUpperCase() : that.defaultMessages[that.defaultLocale].date.toUpperCase();

        formatHolderSpan.classList.add('bold');
        formatHolder.appendChild(formatHolderSpan);

        //smart-button 
        let addDayFormatBtn = document.createElement('smart-button');
        addDayFormatBtn.innerHTML = that.messages[that.locale].day ? that.messages[that.locale].day.charAt(0).toUpperCase() + that.messages[that.locale].day.slice(1) : that.defaultMessages[that.defaultLocale].day.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].day.slice(1);
        that.addDayFormatClassName = 'add-day-format';
        addDayFormatBtn.classList.add(that.addDayFormatClassName);
        addDayFormatBtn.classList.add('flat');
        addDayFormatBtn.classList.add('text-tramsform-none');
        const addDayFormatFunction = () => that.addNewFormat('dd');
        addDayFormatBtn.addEventListener('click', addDayFormatFunction);
        addDayFormatBtn[that.addDayFormatClassName] = addDayFormatFunction;
        formatHolder.appendChild(addDayFormatBtn);

        //smart-button 
        let addMonthFormatBtn = document.createElement('smart-button');
        addMonthFormatBtn.innerHTML = that.messages[that.locale].month ? that.messages[that.locale].month.charAt(0).toUpperCase() + that.messages[that.locale].month.slice(1) : that.defaultMessages[that.defaultLocale].month.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].month.slice(1);
        that.addMonthFormatClassName = 'add-month-format';
        addMonthFormatBtn.classList.add(that.addMonthFormatClassName);
        addMonthFormatBtn.classList.add('flat');
        addMonthFormatBtn.classList.add('text-tramsform-none');
        const addMonthFormatFunction = () => that.addNewFormat('MM');
        addMonthFormatBtn.addEventListener('click', addMonthFormatFunction);
        addMonthFormatBtn[that.addMonthFormatClassName] = addMonthFormatFunction;
        formatHolder.appendChild(addMonthFormatBtn);

        //smart-button 
        let addYearFormatBtn = document.createElement('smart-button');
        addYearFormatBtn.innerHTML = that.messages[that.locale].year ? that.messages[that.locale].year.charAt(0).toUpperCase() + that.messages[that.locale].year.slice(1) : that.defaultMessages[that.defaultLocale].year.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].year.slice(1);
        that.addYearFormatClassName = 'add-year-format';
        addYearFormatBtn.classList.add(that.addYearFormatClassName);
        addYearFormatBtn.classList.add('flat');
        addYearFormatBtn.classList.add('text-tramsform-none');
        const addYearFormatFunction = () => that.addNewFormat('yyyy');
        addYearFormatBtn.addEventListener('click', addYearFormatFunction);
        addYearFormatBtn[that.addYearFormatClassName] = addYearFormatFunction;
        formatHolder.appendChild(addYearFormatBtn);

        allFormatHolders.appendChild(formatHolder);


        // div.format-holder
        formatHolder = document.createElement('div');
        formatHolder.classList.add('format-holder');

        //span
        formatHolderSpan = document.createElement('span');
        formatHolderSpan.innerHTML = that.messages[that.locale].time ? that.messages[that.locale].time.toUpperCase() : that.defaultMessages[that.defaultLocale].time.toUpperCase();
        formatHolderSpan.classList.add('bold');
        formatHolder.appendChild(formatHolderSpan);

        //smart-button 
        let addHourFormatBtn = document.createElement('smart-button');
        addHourFormatBtn.innerHTML = that.messages[that.locale].hours ? that.messages[that.locale].hours.charAt(0).toUpperCase() + that.messages[that.locale].hours.slice(1) : that.defaultMessages[that.defaultLocale].hours.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].hours.slice(1);
        that.addHourFormatClassName = 'add-hour-format';
        addHourFormatBtn.classList.add(that.addHourFormatClassName);
        addHourFormatBtn.classList.add('flat');
        addHourFormatBtn.classList.add('text-tramsform-none');
        const addHourFormatFunction = () => that.addNewFormat('HH');
        addHourFormatBtn.addEventListener('click', addHourFormatFunction);
        addHourFormatBtn[that.addHourFormatClassName] = addHourFormatFunction
        formatHolder.appendChild(addHourFormatBtn);

        //smart-button 
        let addMinutesFormatBtn = document.createElement('smart-button');
        addMinutesFormatBtn.innerHTML = that.messages[that.locale].minutes ? that.messages[that.locale].minutes.charAt(0).toUpperCase() + that.messages[that.locale].minutes.slice(1) : that.defaultMessages[that.defaultLocale].minutes.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].minutes.slice(1);
        that.addMinutesFormatClassName = 'add-minute-format';
        addMinutesFormatBtn.classList.add(that.addMinutesFormatClassName);
        addMinutesFormatBtn.classList.add('flat');
        addMinutesFormatBtn.classList.add('text-tramsform-none');
        const addMinutesFormatFunction = () => that.addNewFormat('mm');
        addMinutesFormatBtn.addEventListener('click', addMinutesFormatFunction);
        addMinutesFormatBtn[that.addMinutesFormatClassName] = addMinutesFormatFunction;
        formatHolder.appendChild(addMinutesFormatBtn);

        //smart-button 
        let addSecondFormatBtn = document.createElement('smart-button');
        addSecondFormatBtn.innerHTML = that.messages[that.locale].seconds ? that.messages[that.locale].seconds.charAt(0).toUpperCase() + that.messages[that.locale].seconds.slice(1) : that.defaultMessages[that.defaultLocale].seconds.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].seconds.slice(1);
        that.addSecondFormatClassName = 'add-second-format';
        addSecondFormatBtn.classList.add(that.addSecondFormatClassName);
        addSecondFormatBtn.classList.add('flat');
        addSecondFormatBtn.classList.add('text-tramsform-none');
        const addSecondFormatFunction = () => that.addNewFormat('ss');
        addSecondFormatBtn.addEventListener('click', addSecondFormatFunction);
        addSecondFormatBtn[that.addSecondFormatClassName] = addSecondFormatFunction;
        formatHolder.appendChild(addSecondFormatBtn);

        //smart-button 
        let addMillisecondFormatBtn = document.createElement('smart-button');
        addMillisecondFormatBtn.innerHTML = that.messages[that.locale].milliseconds ? that.messages[that.locale].milliseconds.charAt(0).toUpperCase() + that.messages[that.locale].milliseconds.slice(1) : that.defaultMessages[that.defaultLocale].milliseconds.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].milliseconds.slice(1);
        that.addMillisecondFormatClassName = 'add-millisecond-format';
        addMillisecondFormatBtn.classList.add(that.addMillisecondFormatClassName);
        addMillisecondFormatBtn.classList.add('flat');
        addMillisecondFormatBtn.classList.add('text-tramsform-none');
        const addMillisecondFormatFunction = () => that.addNewFormat('fff');
        addMillisecondFormatBtn.addEventListener('click', addMillisecondFormatFunction);
        addMillisecondFormatBtn[that.addMillisecondFormatClassName] = addMillisecondFormatFunction;
        formatHolder.appendChild(addMillisecondFormatBtn);

        //smart-button 
        let addAmPmFormatBtn = document.createElement('smart-button');
        addAmPmFormatBtn.innerHTML = that.messages[that.locale].ampm ? that.messages[that.locale].ampm.toUpperCase() : that.defaultMessages[that.defaultLocale].ampm.toUpperCase();
        that.addAmPmFormatClassName = 'add-ampm-format';
        addAmPmFormatBtn.classList.add(that.addAmPmFormatClassName);
        addAmPmFormatBtn.classList.add('flat');
        addAmPmFormatBtn.classList.add('text-tramsform-none');
        const addAmPmFormatFunction = () => that.addNewFormat('tt');
        addAmPmFormatBtn.addEventListener('click', addAmPmFormatFunction);
        addAmPmFormatBtn[that.addAmPmFormatClassName] = addAmPmFormatFunction;
        formatHolder.appendChild(addAmPmFormatBtn);


        allFormatHolders.appendChild(formatHolder);


        that.addFormatHolder.appendChild(allFormatHolders);
        that.borderHolder.appendChild(that.addFormatHolder);
        that.smartInputButtonsElementsHolder.appendChild(that.borderHolder);

        // Apply button
        // smart-button.use-format-button
        let applyButton = document.createElement('smart-button');
        applyButton.classList.add('use-format-button');
        applyButton.disabled = true;
        applyButton.classList.add('success');
        applyButton.innerHTML = that.messages[that.locale].apply ? that.messages[that.locale].apply : that.defaultMessages[that.defaultLocale].apply;
        // Sets value on apply
        const getFormatFunction = () => that.value = that.getFormat();
        applyButton.addEventListener('click', getFormatFunction);
        applyButton['apply-button-event-listener'] = getFormatFunction;

        that.useThisFormatHolder = applyButton;
        that.smartInputButtonsElementsHolder.appendChild(that.useThisFormatHolder)
        that.customDateTimeContainer.appendChild(that.smartInputButtonsElementsHolder);
    }


    /*
     * Sets the custom datetime format as clickable li's with click event listeners
     * */
    _initDateTimeFormatHolder() {
        const that = this;

        let dateTimeFormatHolder = document.createElement('div');

        const currentDate = new Date();
        that.currentDate = currentDate;
        that.dateTime = new Smart.Utilities.DateTime(that.currentDate);

        // DateTime localization
        const localizedNames = Smart.Utilities.DateTime.getLocalizedNames(that.locale);
        that.dateTime.calendar.days = localizedNames.days;
        that.dateTime.calendar.months = localizedNames.months;
        that.dateTime.calendar.locale = that.locale;


        // ul.date-time-format-list
        let dateTimeFormatList = document.createElement('ul');
        dateTimeFormatList.classList.add('date-time-format-list');

        for (let i = 0; i < that.inputDateTimeFormats.length; i++) {
            // li.date-time-format
            let dateTimeFormatElement = document.createElement('li');
            dateTimeFormatElement.classList.add('date-time-format');

            let dateTimeFullFormat = that.inputDateTimeFormats[i];
            let currentDateInCurrentDateTimeFormat = that.dateTime.toString(dateTimeFullFormat);

            // Set current date as value
            dateTimeFormatElement.innerHTML = currentDateInCurrentDateTimeFormat;
            dateTimeFormatElement.dataset.fullFormat = dateTimeFullFormat;

            // Add click listener on each format
            const addFormatFunction = () => that.addNewFormat(dateTimeFormatElement);
            dateTimeFormatElement.addEventListener('click', addFormatFunction);
            dateTimeFormatElement['date-time-format-' + dateTimeFullFormat] = addFormatFunction;

            dateTimeFormatList.appendChild(dateTimeFormatElement);

            if (i === 0) {
                that.addNewFormat(dateTimeFormatElement);
            }
        }

        dateTimeFormatHolder.appendChild(dateTimeFormatList);
        that.customDateTimeContainer.appendChild(dateTimeFormatHolder);
    }


    /**
  * Detach public method for removing event listeners
  * */
    detach() {
        const that = this;
        that._removeEventListeners();
    }


    /**
 * Remove event listeners
 * */

    _removeEventListeners() {
        const that = this;

        // Detach date-time-format event listeners
        let dateFormatElements = that.customDateTimeContainer.querySelectorAll('li.date-time-format');
        for (let i = 0; i < dateFormatElements.length; i++) {
            let elem = dateFormatElements[i];
            elem.removeEventListener('click', elem['date-time-format-' + elem.dataset.fullFormat]);
            delete elem['date-time-format-' + elem.dataset.fullFormat];
        }

        // Detach apply buton
        that.useThisFormatHolder.removeEventListener('click', that.useThisFormatHolder['apply-button-event-listener'])
        delete that.useThisFormatHolder['apply-button-event-listener']


        // Remove Add buttons event listeners
        that._detachAddBtnEvent(that.addDayFormatClassName);
        that._detachAddBtnEvent(that.addMonthFormatClassName);
        that._detachAddBtnEvent(that.addYearFormatClassName);
        that._detachAddBtnEvent(that.addHourFormatClassName);
        that._detachAddBtnEvent(that.addMinutesFormatClassName);
        that._detachAddBtnEvent(that.addSecondFormatClassName);
        that._detachAddBtnEvent(that.addMillisecondFormatClassName);
        that._detachAddBtnEvent(that.addAmPmFormatClassName);


        //Remove change event on smart inputs
        let smartInputs = that.customDateTimeContainer.querySelectorAll('.smart-input-list-holder smart-input.format-smart-input-list');
        for (let i = 0; i < smartInputs.length; i++) {
            let elem = smartInputs[i];
            elem.removeEventListener('change', elem['smart-input-format' + i]);
            delete elem['smart-input-format' + i];
        }

    }

    _detachAddBtnEvent(addElementClassName) {
        const that = this;
        const addDayBtn = that.customDateTimeContainer.querySelector('.all-format-holders .' + addElementClassName);
        addDayBtn.removeEventListener('click', addDayBtn[addElementClassName]);
        delete addDayBtn[addElementClassName];
    }


    /*
     * Returns the custom format
     */
    getFormat() {
        const that = this;

        const smartInputListHolder = that.smartInputHolderChildNodes;

        let returnFormat = '';
        for (let i = 0; i < smartInputListHolder.length; i++) {
            if ((smartInputListHolder[i].dataset.format) && (smartInputListHolder[i].dataset.format.length !== 0)) {
                returnFormat += smartInputListHolder[i].dataset.format;
            }
            else if (smartInputListHolder[i].value) {
                //Add custom symbol
                returnFormat += smartInputListHolder[i].value;
            }
        }

        return returnFormat;
    }

    /**
     * Adds new format and sign smart inputs
     */
    addNewFormat(dateTimeFormatElement) {
        const that = this;

        let addingSingleFormatElement = false;
        that.dateTimeFullFormatFirstPart = '';

        let dateTimeWithSelectedFormat,
            dateTimeFullFormat;

        if (dateTimeFormatElement.dataset) {
            dateTimeFullFormat = dateTimeFormatElement.dataset.fullFormat;

            // Clear elements only if new date format choosed
            if (that.smartInputHolder) {
                that.smartInputHolder.innerHTML = ''; //remove child
            }
        }
        else {
            addingSingleFormatElement = true;
            dateTimeFullFormat = ' ( ' + dateTimeFormatElement + ' ) '; //brackets are needed
        }

        dateTimeWithSelectedFormat = new Smart.Utilities.DateTime(dateTimeFullFormat);

        // Enable 'use this format' button
        that.useThisFormatHolder.disabled = false;

        // Show border holder if it was hidden
        that.customDateTimeContainer.querySelector('.smart-input-and-add-formats-holder').classList.remove('smart-hidden');

        // Show format holder
        that._showElement(that.addFormatHolder);

        // All formats if object
        let formatsObject = dateTimeWithSelectedFormat.getParseRegExp(dateTimeWithSelectedFormat.calendar, dateTimeFullFormat);
        let formatsCount = Object.keys(formatsObject.groups).length;

        // For each format
        for (let i = 0; i < formatsCount; i++) {
            let currentDateFormat = formatsObject.groups[i];
            let nextDateFormat = formatsObject.groups[i + 1];

            let smartInputFormat = document.createElement('smart-input');
            smartInputFormat.dropDownWidth = 'auto';
            smartInputFormat.dropDownButtonPosition = 'right';
            smartInputFormat.readonly = true;
            smartInputFormat.dataset.format = currentDateFormat;

            const smartInputFormatFunction = () => that._handleSmartInputFormatChange(smartInputFormat)
            smartInputFormat.addEventListener('change', smartInputFormatFunction);
            smartInputFormat['smart-input-format' + i] = smartInputFormatFunction


            //const addDayFormatFunction = () => that.addNewFormat('dd');
            //addDayFormatBtn.addEventListener('click', addDayFormatFunction);
            //addDayFormatBtn[that.addDayFormatClassName] = addDayFormatFunction;

            smartInputFormat.classList.add('format-smart-input-list');

            if (addingSingleFormatElement) {
                that._addSignSmartInput(that.smartInputHolder, dateTimeFullFormat, currentDateFormat, nextDateFormat, addingSingleFormatElement);
            }

            // Set day
            if (that.formatVariants.day[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.day, currentDateFormat, smartInputFormat, that.messages[that.locale].day ? that.messages[that.locale].day.charAt(0).toUpperCase() + that.messages[that.locale].day.slice(1) : that.defaultMessages[that.defaultLocale].day.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].day.slice(1));
            }
            // Set month
            else if (that.formatVariants.month[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.month, currentDateFormat, smartInputFormat, that.messages[that.locale].month ? that.messages[that.locale].month.charAt(0).toUpperCase() + that.messages[that.locale].month.slice(1) : that.defaultMessages[that.defaultLocale].month.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].month.slice(1));
            }
            // Set year
            else if (that.formatVariants.year[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.year, currentDateFormat, smartInputFormat, that.messages[that.locale].year ? that.messages[that.locale].year.charAt(0).toUpperCase() + that.messages[that.locale].year.slice(1) : that.defaultMessages[that.defaultLocale].year.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].year.slice(1));
            }
            // Set hour
            else if (that.formatVariants.hour[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.hour, currentDateFormat, smartInputFormat, that.messages[that.locale].hour ? that.messages[that.locale].hour.charAt(0).toUpperCase() + that.messages[that.locale].hour.slice(1) : that.defaultMessages[that.defaultLocale].hour.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].hour.slice(1));
            }
            // Set minute
            else if (that.formatVariants.minute[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.minute, currentDateFormat, smartInputFormat, that.messages[that.locale].minute ? that.messages[that.locale].minute.charAt(0).toUpperCase() + that.messages[that.locale].minute.slice(1) : that.defaultMessages[that.defaultLocale].minute.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].minute.slice(1));
            }
            // Set second 
            else if (that.formatVariants.second[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.second, currentDateFormat, smartInputFormat, that.messages[that.locale].second ? that.messages[that.locale].second.charAt(0).toUpperCase() + that.messages[that.locale].second.slice(1) : that.defaultMessages[that.defaultLocale].second.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].second.slice(1));
            }
            // Set millisecond 
            else if (that.formatVariants.millisecond[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.millisecond, currentDateFormat, smartInputFormat, that.messages[that.locale].milliseconds ? that.messages[that.locale].milliseconds.charAt(0).toUpperCase() + that.messages[that.locale].milliseconds.slice(1) : that.defaultMessages[that.defaultLocale].milliseconds.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].milliseconds.slice(1));
            }
            // Set ampm
            else if (that.formatVariants.ampm[currentDateFormat]) {
                that._setSmartInputDataSource(that.formatVariants.ampm, currentDateFormat, smartInputFormat, that.messages[that.locale].ampm ? that.messages[that.locale].ampm.charAt(0).toUpperCase() + that.messages[that.locale].ampm.slice(1) : that.defaultMessages[that.defaultLocale].ampm.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].ampm.slice(1));
            }
            that.smartInputHolder.appendChild(smartInputFormat);

            smartInputFormat.$.scrollView.attached = function () {
                requestAnimationFrame(() => {
                    that.setActiveSmartInput(smartInputFormat);
                }
                );
            };

            // Add sign comboBox
            if ((i + 1) < formatsCount) {
                that._addSignSmartInput(that.smartInputHolder, dateTimeFullFormat, currentDateFormat, nextDateFormat, addingSingleFormatElement);
            }

        }

        // smartInputFormats child elements
        that.smartInputHolderChildNodes = that.smartInputHolder.childNodes; // Child elemt
    }


    /**
     * Ses the dataSource values to the smart input
     */
    _setSmartInputDataSource(eachFormatVariant, currentFormat, smartInputFormat, valueTitle) {
        const that = this;

        let smartInputDateTimeFormats = [],
            selctedInput, selctedInputWithDesc;
        for (let dateFormat in eachFormatVariant) {
            let dateDescription = eachFormatVariant[dateFormat];

            // Select selected value
            if (dateFormat === currentFormat) {
                selctedInputWithDesc = dateFormat + that.dateTime.toString('(' + dateFormat + ')') + ' - ' + dateDescription;
                selctedInput = valueTitle + ' ' + that.dateTime.toString('(' + dateFormat + ')');
            }

            smartInputDateTimeFormats.push(dateFormat + that.dateTime.toString('(' + dateFormat + ')') + ' - ' + dateDescription);
        }

        smartInputFormat.dataset.valueTitle = valueTitle;
        smartInputFormat.dataset.selectedValue = selctedInputWithDesc;
        smartInputDateTimeFormats.push(that.messages[that.locale].delete ? that.messages[that.locale].delete.charAt(0).toUpperCase() + that.messages[that.locale].delete.slice(1) : that.defaultMessages[that.defaultLocale].delete.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].delete.slice(1));
        smartInputFormat.dataSource = smartInputDateTimeFormats;
        smartInputFormat.value = selctedInput;

    }

    /**
     * SmartFormatInput Change event handler
     */
    _handleSmartInputFormatChange(smartInputFormat) {
        const that = this;
        // OnDelete - last button
        if (smartInputFormat.value === (that.messages[that.locale].delete ? that.messages[that.locale].delete.charAt(0).toUpperCase() + that.messages[that.locale].delete.slice(1) : that.defaultMessages[that.defaultLocale].delete.charAt(0).toUpperCase() + that.defaultMessages[that.defaultLocale].delete.slice(1))) {

            if (smartInputFormat.parentNode.childNodes.length === 1) {
                // Disable 'use this format' button
                that.useThisFormatHolder.disabled = true;
                that.customDateTimeContainer.querySelector('.smart-input-and-add-formats-holder').classList.add('smart-hidden');

                // Hide format holder
                that._hideElement(that.addFormatHolder);
            }

            if (smartInputFormat.nextElementSibling) {
                smartInputFormat.parentNode.removeChild(smartInputFormat.nextElementSibling); // Remove sign combo
            }
            else if (smartInputFormat.previousSibling) {
                smartInputFormat.parentNode.removeChild(smartInputFormat.previousSibling); // Remove sign combo
            }
            smartInputFormat.parentNode.removeChild(smartInputFormat); // remove smartInputFormat
        }
        else {
            smartInputFormat.dataset.selectedValue = smartInputFormat.value;
            smartInputFormat.dataset.format = smartInputFormat.value.split('(')[0];
            smartInputFormat.value = smartInputFormat.dataset.valueTitle + that.dateTime.toString('(' + smartInputFormat.dataset.format + ')');
        }
    }


    /**
     * Sets which date time format will be selected when click on the smart input
     */
    setActiveSmartInput(smartInputFormat) {
        let selectedLi = document.querySelector('li[value="' + smartInputFormat.dataset.selectedValue + '"]');

        let parentUl = selectedLi.parentNode;
        let allLiElements = parentUl.querySelectorAll('li');
        for (let i = 0; i < allLiElements.length; i++) {
            let currentLi = allLiElements[i];
            if (currentLi.classList.contains('active')) {
                currentLi.classList.remove('active');
            }
        }

        selectedLi.classList.add('active');
    }

    /**
     * Hides the element passed as parameter
     */
    _hideElement(elem) {
        if (elem) {
            elem.classList.add('smart-hidden');
        }
    }

    /**
     * Shoes the element passed as parameter
     */
    _showElement(elem) {
        if (elem) {
            elem.classList.remove('smart-hidden');
        }
    }


    /**
     * Adds smart input for the signs
     */
    _addSignSmartInput(smartInputListHolder, dateTimeFullFormat, currentDateFormat, nextDateFormat, addingSingleFormatElement) {
        const that = this;

        //Append ComboBox
        let comboBox = document.createElement('smart-input');
        comboBox.dropDownWidth = 'auto';
        comboBox.dropDownButtonPosition = 'right';
        comboBox.classList.add('sign-smart-input');
        let comboBoxOptions = ['-', '/', ','];

        if (!that.dateTimeFullFormatFirstPart) {
            that.dateTimeFullFormatFirstPart = dateTimeFullFormat;
        }

        let defaultComboValue = that.dateTimeFullFormatFirstPart.split(currentDateFormat)[1].split(nextDateFormat)[0];
        if (addingSingleFormatElement) {
            defaultComboValue = '-';
        }

        // Remove the format that is already used
        that.dateTimeFullFormatFirstPart = that.dateTimeFullFormatFirstPart.slice(that.dateTimeFullFormatFirstPart.indexOf(currentDateFormat) + currentDateFormat.length, that.dateTimeFullFormatFirstPart.length);

        // If sign not found && Not adding single element add the new one as last element
        let addCustomSign = true;
        for (let q = 0; q < comboBoxOptions.length; q++) {
            // Replace the value if it is with spaces
            if (defaultComboValue.trim() === comboBoxOptions[q]) {
                comboBoxOptions[q] = defaultComboValue;
            }
            if ((defaultComboValue === comboBoxOptions[q]) || (defaultComboValue.trim() === comboBoxOptions[q])) {
                addCustomSign = false;
            }
        }

        if (addCustomSign) {
            comboBoxOptions.push(defaultComboValue);
        }

        comboBox.dataSource = comboBoxOptions;
        comboBox.value = defaultComboValue;
        smartInputListHolder.appendChild(comboBox);
    }

});
