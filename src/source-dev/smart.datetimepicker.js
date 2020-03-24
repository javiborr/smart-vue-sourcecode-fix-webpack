
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * DateTimePicker custom element.
 */
Smart('smart-date-time-picker', class DateTimePicker extends Smart.BaseElement {
    /**
     * DateTimePicker's properties.
     */
    static get properties() {
        return {
            'animationSettings': {
                value: null,
                type: 'object'
            },
            'autoClose': {
                value: false,
                type: 'boolean'
            },
            'autoCloseDelay': {
                value: 0,
                type: 'number'
            },
            'calendarButton': {
                value: false,
                type: 'boolean'
            },
            'calendarButtonPosition': {
                value: 'right',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'calendarMode': {
                value: 'default',
                allowedValues: ['default', 'classic'],
                type: 'string'
            },
            'dayNameFormat': {
                value: 'firstTwoLetters',
                allowedValues: ['narrow', 'firstTwoLetters', 'long', 'short'],
                type: 'string'
            },
            'disableAutoNavigation': {
                value: false,
                type: 'boolean'
            },
            'displayKind': {
                value: 'unspecified',
                allowedValues: ['UTC', 'local', 'unspecified'],
                type: 'string'
            },
            'displayModeView': {
                value: 'table',
                allowedValues: ['table', 'list'],
                type: 'string'
            },
            'displayMode': {
                allowedValues: ['outlined', 'filled', 'underlined'],
                value: 'outlined',
                type: 'string'
            },
            'dropDownAppendTo': {
                value: null,
                type: 'any'
            },
            'dropDownDisplayMode': {
                value: 'default',
                allowedValues: ['default', 'classic', 'calendar', 'timePicker', 'auto'],
                type: 'string'
            },
            'dropDownOverlay': {
                value: false,
                type: 'boolean'
            },
            'dropDownPosition': {
                value: 'auto',
                allowedValues: ['auto', 'bottom', 'overlay-top', 'overlay-center', 'overlay-bottom', 'top', 'center-bottom', 'center-top'],
                type: 'string'
            },
            'editMode': {
                value: 'default',
                allowedValues: ['default', 'full', 'partial'],
                type: 'string'
            },
            'enableMouseWheelAction': {
                value: false,
                type: 'boolean'
            },
            'firstDayOfWeek': {
                value: 0,
                type: 'number'
            },
            'footerTemplate': {
                value: null,
                type: 'any'
            },
            'formatString': {
                value: 'dd-MMM-yy HH:mm:ss.fff',
                type: 'string'
            },
            'headerTemplate': {
                value: null,
                type: 'any'
            },
            'hideDayNames': {
                value: false,
                type: 'boolean'
            },
            'hideOtherMonthDays': {
                value: false,
                type: 'boolean'
            },
            'hideTooltipArrow': {
                value: false,
                type: 'boolean'
            },
            'hint': {
                value: '',
                type: 'string'
            },
            'importantDates': {
                value: [],
                type: 'array'
            },
            'importantDatesTemplate': {
                value: null,
                type: 'any'
            },
            'interval': {
                value: new Smart.Utilities.TimeSpan(0, 0, 1),
                type: 'any'
            },
            'label': {
                value: '',
                type: 'string'
            },
            'max': {
                value: new Smart.Utilities.DateTime(3001, 1, 1),
                type: 'any'
            },
            'messages': {
                value: {
                    'en': {
                        'now': 'Now',
                        'dateTabLabel': 'DATE',
                        'timeTabLabel': 'TIME'
                    }
                },
                type: 'object',
                extend: true
            },
            'min': {
                value: new Smart.Utilities.DateTime(1600, 1, 1),
                type: 'any'
            },
            'name': {
                value: '',
                type: 'string'
            },
            'nullable': {
                value: false,
                type: 'boolean'
            },
            'opened': {
                value: false,
                type: 'boolean'
            },
            'placeholder': {
                value: 'Enter date',
                type: 'string'
            },
            'restrictedDates': {
                value: [],
                type: 'array'
            },
            'spinButtons': {
                value: false,
                type: 'boolean'
            },
            'spinButtonsDelay': {
                value: 75,
                type: 'number'
            },
            'spinButtonsInitialDelay': {
                value: 0,
                type: 'number'
            },
            'spinButtonsPosition': {
                value: 'right',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'tooltip': {
                value: false,
                type: 'boolean'
            },
            'tooltipDelay': {
                value: 100,
                type: 'number'
            },
            'tooltipPosition': {
                value: 'top',
                allowedValues: ['bottom', 'top', 'left', 'right', 'absolute'],
                type: 'string'
            },
            'tooltipTemplate': {
                value: null,
                type: 'any'
            },
            'validation': {
                value: 'strict',
                allowedValues: ['strict', 'interaction'],
                type: 'string'
            },
            'value': {
                defaultReflectToAttribute: true,
                value: new Smart.Utilities.DateTime(),
                type: 'any'
            },
            'weekNumbers': {
                value: false,
                type: 'boolean'
            },
            'weeks': {
                value: 6,
                type: 'number'
            },
            'yearCutoff': {
                value: 1926,
                type: 'number'
            }
        };
    }

    /**
     * DateTimePicker's event listeners.
     */
    static get listeners() {
        return {
            'container.mouseout': '_mouseoutHandler',
            'container.mouseover': '_mouseoverHandler',
            'calendarButton.click': '_calendarButtonClickHandler',
            'calendarDropDown.change': '_calendarDropDownChangeHandler',
            'calendarDropDown.click': '_calendarDropDownClickHandler',
            'downButton.click': '_spinButtonsClickHandler',
            'input.blur': '_inputBlurHandler',
            'input.change': '_inputChangeHandler',
            'input.dragstart': '_inputDragstartHandler',
            'input.focus': '_inputFocusHandler',
            'input.keydown': '_inputKeydownHandler',
            'input.down': '_inputDownHandler',
            'input.paste': '_inputPasteHandler',
            'input.select': '_inputSelectHandler',
            'input.up': '_inputUpHandler',
            'input.wheel': '_inputWheelHandler',
            'dropDownContainer.keydown': '_dropDownKeydownHandler',
            'dropDownContainer.transitionend': '_dropDownTransitionendHandler',
            'dropDownHeader.click': '_dropDownHeaderClickHandler',
            'upButton.click': '_spinButtonsClickHandler',
            'document.up': '_documentUpHandler'
        };
    }

    /**
     * DateTimePicker's required files.
     */
    static get requires() {
        return {
            'Smart.Utilities.DateTime': 'smart.date.js',
            'Smart.Utilities.Draw': 'smart.draw.js',
            'Smart.Utilities.BigNumber': 'smart.math.js',
            'Smart.Utilities.NumericProcessor': 'smart.numeric.js',
            'Smart.RepeatButton': 'smart.button.js',
            'Smart.Calendar': 'smart.calendar.js',
            'Smart.TimePicker': 'smart.timepicker.js'
        }
    }

    /**
     * CSS files needed for the element (ShadowDOM)
     */
    static get styleUrls() {
        return [
            'smart.datetimepicker.css'
        ]
    }

    /**
     * DateTimePicker's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <span id="label" class="smart-label">[[label]]</span>
                    <div id="content" class="smart-content">
                        <input id="input" class="smart-input smart-date-time-input" type="text" readonly="[[readonly]]" disabled="[[disabled]]" placeholder="[[placeholder]]" name="[[name]]" aria-label="[[placeholder]]" />
                        <div id="spinButtonsContainer" class="smart-spin-buttons-container" role="presentation">
                            <smart-repeat-button initial-delay="[[spinButtonsInitialDelay]]" animation="[[animation]]" delay="[[spinButtonsDelay]]" readonly="[[readonly]]"  unfocusable id="upButton" right-to-left="[[rightToLeft]]" class="smart-spin-button" aria-label="Increment">
                                <div class="smart-arrow smart-arrow-up" aria-hidden="true"></div>
                            </smart-repeat-button>
                            <smart-repeat-button initial-delay="[[spinButtonsInitialDelay]]" animation="[[animation]]" delay="[[spinButtonsDelay]]" readonly="[[readonly]]" unfocusable id="downButton" right-to-left="[[rightToLeft]]" class="smart-spin-button" aria-label="Decrement">
                                <div class="smart-arrow smart-arrow-down" aria-hidden="true"></div>
                            </smart-repeat-button>
                        </div>
                        <div id="calendarButton" class="smart-drop-down-button smart-calendar-button" role="button" aria-haspopup="dialog" aria-label="Toggle popup"></div>
                        <div id="dropDownContainer" class="smart-drop-down smart-date-time-drop-down smart-drop-down-container smart-visibility-hidden" role="dialog">
                            <div id="dropDownHeader" class="smart-drop-down-header smart-hidden" role="heading" aria-level="1">
                                <div id="selectDate" class="smart-selected" role="button"></div>
                                <div id="selectTime" role="button"></div>
                            </div>
                            <div id="dropDownContent" class="smart-drop-down-content" role="presentation">
                                <smart-calendar id="calendarDropDown" class="smart-hidden"
                                              animation="[[animation]]"
                                              animation-settings="[[animationSettings]]"
                                              calendar-mode="[[calendarMode]]"
                                              day-name-format="[[dayNameFormat]]"
                                              disable-auto-navigation="[[disableAutoNavigation]]"
                                              display-mode-view="[[displayModeView]]"
                                              first-day-of-week="[[firstDayOfWeek]]"
                                              header-template="[[headerTemplate]]"
                                              hide-day-names="[[hideDayNames]]"
                                              hide-other-month-days="[[hideOtherMonthDays]]"
                                              hide-tooltip-arrow="[[hideTooltipArrow]]"
                                              important-dates="[[importantDates]]"
                                              important-dates-template="[[importantDatesTemplate]]"
                                              locale="[[locale]]"
                                              right-to-left="[[rightToLeft]]"
                                              selection-mode="one"
                                              spin-buttons-delay="[[spinButtonsDelay]]"
                                              spin-buttons-initial-delay="[[spinButtonsInitialDelay]]"
                                              theme="[[theme]]"
                                              tooltip="[[tooltip]]"
                                              tooltip-delay="[[tooltipDelay]]"
                                              tooltip-position="[[tooltipPosition]]"
                                              tooltip-template="[[tooltipTemplate]]"
                                              unfocusable="[[unfocusable]]"
                                              view-sections='["header", "footer"]'
                                              week-numbers="[[weekNumbers]]"
                                              weeks="[[weeks]]"></smart-calendar>
                            </div>
                        </div>
                    </div>
                    <span id="hint" class="smart-hint">[[hint]]</span>
                </div>`;
    }

    /**
     * Called when the element is attached to the DOM.
     */
    attached() {
        const that = this;

        super.attached();

        if (!that.isCompleted) {
            return;
        }

        if (that._defaultFooterTemplateApplied) {
            that._addCalendarFooterListeners();
        }

        if (that.$.timePickerDropDown) {
            that._addTimePickerListener();
        }

        if (that._positionDetection) {
            that._positionDetection.dropDownAttached();
        }
    }

    /**
     * Called when the element is detached from the DOM.
     */
    detached() {
        const that = this;

        super.detached();

        that.close();

        if (that._defaultFooterTemplateApplied) {
            const footer = that.$.calendarDropDown.$footer;

            footer.unlisten('change');
            footer.unlisten('click');
            footer.unlisten('wheel');
        }

        if (that.$.timePickerDropDown) {
            that.$.timePickerDropDown.$.unlisten('change');
        }

        if (that._positionDetection) {
            that._positionDetection.dropDownDetached();
        }
    }

    /**
     * Called when the element is ready. Used for one-time configuration of the DateTimePicker.
     */
    ready() {
        super.ready();

        const that = this;

        that._edgeMacFF = Smart.Utilities.Core.Browser.Edge ||
            Smart.Utilities.Core.Browser.Firefox && navigator.platform.toLowerCase().indexOf('mac') !== -1;
        that._iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

        if (that._edgeMacFF) {
            that.$dropDownContainer.addClass('not-in-view');
        }

        that._defaultFooterTemplate = document.createElement('template');

        that._defaultFooterTemplate.innerHTML =
            `<div class="smart-date-time-picker-footer">
                <div class="smart-footer-component smart-footer-component-hour" role="presentation">
                    <input type="text" class="smart-hour-element" aria-label="Hours" />
                    <span role="presentation">
                        <smart-repeat-button initial-delay="0" delay="75" aria-label="Increment hours">
                            <span class="smart-arrow smart-arrow-up" aria-hidden="true"></span>
                        </smart-repeat-button>
                        <smart-repeat-button  initial-delay="0" delay="75" aria-label="Decrement hours">
                            <span class="smart-arrow smart-arrow-down" aria-hidden="true"></span>
                        </smart-repeat-button>
                    </span>
                </div>
                <div class="smart-footer-component smart-footer-component-minute" role="presentation">
                    <input class="smart-minute-element" aria-label="Minutes" />
                    <span role="presentation">
                        <smart-repeat-button initial-delay="0" delay="75" aria-label="Increment minutes">
                            <span class="smart-arrow smart-arrow-up" aria-hidden="true"></span>
                        </smart-repeat-button>
                        <smart-repeat-button initial-delay="0" delay="75" aria-label="Decrement minutes">
                            <span class="smart-arrow smart-arrow-down" aria-hidden="true"></span>
                        </smart-repeat-button>
                    </span>
                </div>
                <div class="smart-footer-component smart-footer-component-ampm" role="presentation">
                    <input type="text" class="smart-am-pm-element" aria-label="AM/PM" />
                </div>
                <div class="smart-footer-component smart-footer-component-today" role="presentation">
                    <div tabindex="-1" class="smart-today-element" role="button" aria-label="Now"></div>
                </div>
            </div>`;

        that._codeToMethod = {
            'y': 'addYears', 'yy': 'addYears', 'yyyy': 'addYears', 'yyyyy': 'addYears',
            'M': 'addMonths', 'MM': 'addMonths', 'MMM': 'addMonths', 'MMMM': 'addMonths',
            'd': 'addDays', 'dd': 'addDays', 'ddd': 'addDays', 'dddd': 'addDays',
            'H': 'addHours', 'HH': 'addHours', 'h': 'addHours', 'hh': 'addHours',
            'm': 'addMinutes', 'mm': 'addMinutes',
            's': 'addSeconds', 'ss': 'addSeconds',
            'f': 'addDeciseconds',
            'ff': 'addCentiseconds',
            'fff': 'addMilliseconds',
            'u': 'addMicroseconds', 'uu': 'addMicroseconds',
            'n': 'addNanoseconds', 'nn': 'addNanoseconds',
            'p': 'addPicoseconds', 'pp': 'addPicoseconds',
            'e': 'addFemtoseconds', 'ee': 'addFemtoseconds',
            'a': 'addAttoseconds', 'aa': 'addAttoseconds',
            'x': 'addZeptoseconds', 'xx': 'addZeptoseconds',
            'o': 'addYoctoseconds', 'oo': 'addYoctoseconds'
        };

        that._codeToIndex = {
            'y': 0, 'yy': 0, 'yyyy': 0, 'yyyyy': 0, 'M': 1, 'MM': 1, 'MMM': 1, 'MMMM': 1, 'd': 2, 'dd': 2, 'ddd': 2, 'dddd': 2,
            'H': 3, 'HH': 3, 'h': 3, 'hh': 3, 'm': 4, 'mm': 4, 's': 5, 'ss': 5, 'f': 6, 'ff': 6, 'fff': 6,
            'u': 7, 'uu': 7, 'n': 8, 'nn': 8, 'p': 9, 'pp': 9, 'e': 10, 'ee': 10,
            'a': 11, 'aa': 11, 'x': 12, 'xx': 12, 'o': 13, 'oo': 13
        };

        that._getLocalizedNames();

        that.checkLicense();
    }

    render() {
        const that = this;

        if (that.rightToLeft) {
            that.calendarButtonPosition = that.calendarButtonPosition === 'right' ? 'left' : 'right';
        }

        that._positionDetection = new Smart.Utilities.PositionDetection(that, that.$.dropDownContainer, that.$.content, 'close');
        that._positionDetection.customPositionDropDown = that._positionExternalDropDown;
        that._positionDetection.getDropDownParent(true);
        that._positionDetection.setDropDownPosition();
        that.$.dropDownContainer.style.left = null;
        that._positionDetection.handleAutoPositioning();

        that._setIds();
        that._validateInitialPropertyValues();
        that._setFocusable();

        that.setAttribute('role', 'presentation');
        that.$.input.setAttribute('aria-describedby', that.$.hint.id);
        that.$.input.setAttribute('aria-labelledby', that.$.label.id);
        that.$.calendarButton.setAttribute('aria-owns', that.$.dropDownContainer.id);

        that.$.dropDownContainer.setAttribute('animation', that.animation);
        that.$.dropDownContainer.setAttribute('drop-down-display-mode', that.dropDownDisplayMode);

        super.render();
    }
    /**
     * Closes the calendar dropdown.
     */
    close() {
        const that = this;

        if (!that.opened) {
            return;
        }

        that._close();
    }

    /**
     * Focuses the input.
     */
    focus() {
        this.$.input.focus();
    }

    select() {
        this.$.input.select();
    }

    /**
     * Opens the calendar dropdown.
     */
    open() {
        const that = this;

        if (that.opened) {
            return;
        }

        that._open();
    }

    /**
     * Called when a property is changed.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'animation':
            case 'theme':
                if (that.$.timePickerDropDown) {
                    that.$.timePickerDropDown[propertyName] = newValue;
                }

                if (propertyName === 'animation') {
                    that.$.dropDownContainer.setAttribute('animation', that.animation);

                    if (that._defaultFooterTemplateApplied) {
                        Array.from(that.$.calendarDropDown.$.footer.getElementsByTagName('smart-repeat-button')).forEach(function (button) {
                            button.animation = newValue;
                        });
                    }
                }

                break;
            case 'calendarButton':
                that.$.dropDownContainer.style.transition = 'none';

                if (!newValue) {
                    that.close();
                }
                break;
            case 'calendarButtonPosition':
                that.$.dropDownContainer.style.transition = 'none';
                that.close();

                if (newValue === 'left') {
                    that.$.content.insertBefore(that.$.calendarButton, that.$.content.firstElementChild);
                }
                else if (that._dropDownParent === null) {
                    that.$.content.insertBefore(that.$.calendarButton, that.$.dropDownContainer);
                }
                else {
                    that.$.content.appendChild(that.$.calendarButton);
                }

                break;
            case 'disabled':
                if (newValue) {
                    that.close();
                    that.$.upButton.disabled = true;
                    that.$.downButton.disabled = true;
                }
                else {
                    that._disableSpinButtons();
                }

                that._setFocusable();
                that._positionDetection.handleAutoPositioning();
                break;
            case 'displayKind': {
                const oldOutputTimeZone = that._outputTimeZone;

                switch (newValue) {
                    case 'unspecified':
                        that._outputTimeZone = that._inputTimeZone;
                        break;
                    case 'UTC':
                        that._outputTimeZone = 'UTC';
                        break;
                    case 'local':
                        that._outputTimeZone = 'Local';
                        break;
                }

                if (that._outputTimeZone === oldOutputTimeZone) {
                    return;
                }

                if (that._value !== null) {
                    that.close();
                    that._toSync = true;

                    that._value = that._value.toTimeZone(that._outputTimeZone);
                    that._applyFormatString();
                }

                that.min = that.min.toTimeZone(that._outputTimeZone);
                that.max = that.max.toTimeZone(that._outputTimeZone);

                for (let i = 0; i < that.restrictedDates.length; i++) {
                    let currentRestrictedDate = that.restrictedDates[i];

                    currentRestrictedDate = currentRestrictedDate.toTimeZone(that._outputTimeZone);
                }

                break;
            }
            case 'dropDownAppendTo':
                that._positionDetection.dropDownAppendToChangedHandler();
                break;
            case 'dropDownDisplayMode':
                that._changeDropDownDisplayMode();
                break;
            case 'dropDownOverlay':
                if (!newValue) {
                    that._positionDetection.removeOverlay();
                }

                break;
            case 'dropDownPosition':
                that._positionDetection.dropDownPositionChangedHandler();
                break;
            case 'footerTemplate':
                if (newValue !== null) {
                    that._defaultFooterTemplateApplied = false;

                    const footer = that.$.calendarDropDown.$footer;

                    footer.unlisten('change');
                    footer.unlisten('click');
                    footer.unlisten('wheel');

                    that.$.calendarDropDown.footerTemplate = newValue;
                }
                else {
                    that._setDefaultFooterTemplate();

                    const value = that._value;

                    that._hourElement.value = value.toString('hh');
                    that._minuteElement.value = value.toString('mm');
                    that._ampmElement.value = value.toString('tt');
                }

                break;
            case 'formatString':
                if (newValue === '') {
                    that.formatString = 'dd-MMM-yy HH:mm:ss.fff';
                }

                that._getFormatStringRegExp();
                that._applyFormatString();

                if (that.dropDownDisplayMode === 'auto') {
                    that._changeDropDownDisplayMode();
                }

                break;
            case 'interval':
                that._validateInterval(oldValue);
                break;
            case 'locale':
            case 'messages':
                that.$.selectDate.innerHTML = that.localize('dateTabLabel');
                that.$.selectTime.innerHTML = that.localize('timeTabLabel');

                if (that._defaultFooterTemplateApplied) {
                    that._todayElement.title = that.localize('now');
                }

                if (propertyName === 'messages') {
                    return;
                }

                that._getLocalizedNames();
                that.min.calendar.days = that._localizedDays;
                that.min.calendar.months = that._localizedMonths;
                that.min.calendar.locale = that.locale;
                that.max.calendar.days = that._localizedDays;
                that.max.calendar.months = that._localizedMonths;
                that.max.calendar.locale = that.locale;

                if (that.value !== null) {
                    that._value.calendar.days = that._localizedDays;
                    that._value.calendar.months = that._localizedMonths;
                    that._value.calendar.locale = that.locale;
                    that.value.calendar.days = that._localizedDays;
                    that.value.calendar.months = that._localizedMonths;
                    that.value.calendar.locale = that.locale;
                }

                Smart.Utilities.DateTime.cache = [];
                that._applyFormatString();
                break;
            case 'max':
            case 'min':
                that._validateMinMax(propertyName, oldValue);

                if (that.validation === 'strict') {
                    that._validateValue();
                }
                else {
                    that._minMaxChanged = true;
                }

                break;
            case 'nullable':
                if (oldValue === true && that._value === null) {
                    that._validateValue(that._now(), null);
                }

                break;
            case 'opened':
                if (newValue) {
                    that._open();
                }
                else {
                    that._close();
                }

                break;
            case 'readonly':
            case 'unfocusable':
                if (newValue) {
                    that.close();
                }

                if (propertyName === 'unfocusable') {
                    that._setFocusable();
                }

                break;
            case 'restrictedDates':
                that._validateRestrictedDates();
                that._validateValue();
                break;
            case 'spinButtonsPosition':
                if (newValue === 'right') {
                    that.$.content.insertBefore(that.$.spinButtonsContainer, that.$.input.nextElementSibling);
                }
                else {
                    that.$.content.insertBefore(that.$.spinButtonsContainer, that.$.input);
                }
                break;
            case 'validation':
                if (newValue === 'strict') {
                    delete that._minMaxChanged;
                    that._validateValue();
                }

                break;
            case 'value': {
                let parsedValue;

                if (newValue !== null) {
                    parsedValue = Smart.Utilities.DateTime.validateDate(newValue, that._now(), that.formatString);
                    parsedValue = parsedValue.toTimeZone(that._outputTimeZone);
                }
                else {
                    parsedValue = null;
                }

                that._validateValue(parsedValue, that._value, undefined, true);
                break;
            }
        }
    }

    /**
     * Adds calendar footer listeners.
     */
    _addCalendarFooterListeners() {
        const that = this,
            footer = that.$.calendarDropDown.$footer;

        footer.listen('change', that._footerChangeHandler.bind(that));
        footer.listen('click', that._footerClickHandler.bind(that));
        footer.listen('wheel', that._footerWheelHandler.bind(that));
    }

    /**
     * Adds time picker change event listener.
     */
    _addTimePickerListener() {
        const that = this;

        that.$.timePickerDropDown.$.listen('change', function (event) {
            const oldContext = that.context,
                newTimePickerValue = event.detail.value,
                updatedValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(that._value !== null ? that._value : that._now());

            that.context = that;
            updatedValueConstructorParameters[3] = newTimePickerValue.getHours();
            updatedValueConstructorParameters[4] = newTimePickerValue.getMinutes();
            that._timePickerInitiatedChange = true;
            updatedValueConstructorParameters.unshift(null);
            that._validateValue(new (Function.prototype.bind.apply(Smart.Utilities.DateTime, updatedValueConstructorParameters)));
            that._timePickerInitiatedChange = false;
            that.context = oldContext;
        });
    }

    /**
     * Applies format string.
     */
    _applyFormatString() {
        const that = this;

        if (that.value !== null) {
            that.$.input.value = that._value.toString(that.formatString);
        }
    }

    _calendarButtonMouseEnterHandler() {
        const that = this;

        that.$.calendarButton.setAttribute('hover', '');
    }

    _calendarButtonMouseLeaveHandler() {
        const that = this;

        that.$.calendarButton.removeAttribute('hover');
    }

    /**
     * Calendar button click handler.
     */
    _calendarButtonClickHandler(event) {
        const that = this;

        that._highlightedTimePart = undefined;

        if (that.disabled || that.readonly) {
            return;
        }

        if (that.hasRippleAnimation) {
            Smart.Utilities.Animation.Ripple.animate(that.$.calendarButton, event.pageX, event.pageY);
        }

        if (that.opened) {
            that._close();
        }
        else {
            that._open();
        }
    }

    /**
     * Calendar dropdown change handler.
     */
    _calendarDropDownChangeHandler(event) {
        const that = this;

        event.stopPropagation();

        if (that._disregardCalendarChangeEvent) {
            that._disregardCalendarChangeEvent = false;
            return;
        }

        if (this.$.calendarDropDown.selectedDates.length > 0) {
            const newCalendarValue = event.detail.value[0],
                oldValue = that._value !== null ? that._value : that._now(),
                updatedValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(oldValue);

            updatedValueConstructorParameters[0] = newCalendarValue.getFullYear();
            updatedValueConstructorParameters[1] = newCalendarValue.getMonth() + 1;
            updatedValueConstructorParameters[2] = newCalendarValue.getDate();
            that._calendarInitiatedChange = true;

            updatedValueConstructorParameters.unshift(null);
            that._validateValue(new (Function.prototype.bind.apply(Smart.Utilities.DateTime, updatedValueConstructorParameters)));

            if (that._defaultFooterTemplateApplied) {
                const value = that._value;

                if (that._hourElement.value === '') {
                    that._hourElement.value = value.toString('hh');
                }

                if (that._ampmElement.value === '') {
                    that._ampmElement.value = value.toString('tt');
                }

                if (that._minuteElement.value === '') {
                    that._minuteElement.value = value.toString('mm');
                }
            }

            that._calendarInitiatedChange = false;
        }
        else {
            that._setNullValue();
        }
    }

    /**
     * Calendar dropdown click handler.
     */
    _calendarDropDownClickHandler(event) {
        const that = this;

        if (that.autoClose && event.target.closest('.smart-calendar-cell')) {
            clearTimeout(that._autoCloseTimeout);
            that._autoCloseTimeout = setTimeout(function () {
                that.close();
            }, that.autoCloseDelay);
        }
    }

    /**
     * Changes dropdown display mode.
     */
    _changeDropDownDisplayMode() {
        function toggleVisibility(dropDownHeader, calendarDropDown, timePickerDropDown, sync) {
            that.$dropDownHeader[dropDownHeader]('smart-hidden');
            that.$calendarDropDown[calendarDropDown]('smart-hidden');

            if (that._timePickerInitialized) {
                that.$.timePickerDropDown.$[timePickerDropDown]('smart-hidden');
            }

            if (sync) {
                if (that.opened) {
                    that.$.calendarDropDown._refreshTitle();
                }
                else {
                    that._toSync = true;
                }
            }
        }

        const that = this,
            oldDropDownDisplayMode = that._dropDownDisplayMode;

        that._detectDisplayMode();

        if (that._dropDownDisplayMode === oldDropDownDisplayMode) {
            return;
        }

        if (that._dropDownDisplayMode === 'default') {
            that.calendarMode = 'default';
            that.$.calendarDropDown.viewSections = ['title', 'header'];
            that.$selectDate.addClass('smart-selected');
            that.$selectTime.removeClass('smart-selected');
            toggleVisibility('removeClass', 'removeClass', 'addClass', true);
        }
        else if (that._dropDownDisplayMode === 'classic') {
            that.calendarMode = 'classic';
            that.$.calendarDropDown.viewSections = ['header', 'footer'];
            toggleVisibility('addClass', 'removeClass', 'addClass');
        }
        else if (that._dropDownDisplayMode === 'calendar') {
            that.calendarMode = 'default';
            that.$.calendarDropDown.viewSections = ['title', 'header'];
            toggleVisibility('addClass', 'removeClass', 'addClass', true);
        }
        else {
            that.calendarMode = 'default';
            toggleVisibility('addClass', 'addClass', 'removeClass');

            if (!that._timePickerInitialized) {
                that._initializeTimePicker();
            }
        }

        that.$.dropDownContainer.setAttribute('drop-down-display-mode', that.dropDownDisplayMode);
    }

    /**
     * Clones the value object.
     */
    _cloneValue() {
        const that = this;

        if (that._value !== null) {
            return that._value.clone();
        }
        else {
            return null;
        }
    }

    /**
     * Closes the calendar dropdown.
     */
    _close() {
        const that = this,
            closingEvent = that.$.fireEvent('closing');

        if (!closingEvent.defaultPrevented) {
            that.$.calendarDropDown.disabled = true;

            that.$calendarButton.removeClass('smart-calendar-button-pressed');
            that.$.calendarButton.removeAttribute('active');
            that.$dropDownContainer.addClass('smart-visibility-hidden');

            const hoveredCalendarCell = that.$.calendarDropDown.$.container.querySelector('.smart-calendar-cell[hover]');

            if (hoveredCalendarCell) {
                hoveredCalendarCell.removeAttribute('hover');
            }

            that.opened = false;
            that._positionDetection.removeOverlay(true);

            that.$.fireEvent('close');

            if (that._edgeMacFF && !that.hasAnimation) {
                that.$.dropDownContainer.style.top = null;
                that.$.dropDownContainer.style.left = null;
                that.$dropDownContainer.addClass('not-in-view');
            }
        }
        else {
            that.opened = true;
        }

        that.$.calendarButton.setAttribute('aria-expanded', that.opened);
    }

    /**
     * Detects dropdown display mode.
     */
    _detectDisplayMode() {
        const that = this;

        if (that.dropDownDisplayMode !== 'auto') {
            that._dropDownDisplayMode = that.dropDownDisplayMode;
        }
        else {
            that._dropDownDisplayMode = Smart.Utilities.DateTime.detectDisplayMode(that.value || that.min, that.formatString, that._formatStringRegExp);
        }

        if (that._dropDownDisplayMode === 'timePicker') {
            that.$calendarButton.addClass('time');

            if (that.placeholder === 'Enter date') {
                that.placeholder = 'Enter time';
            }
        }
        else {
            that.$calendarButton.removeClass('time');

            if (that.placeholder === 'Enter time') {
                that.placeholder = 'Enter date';
            }
        }

        if (that._dropDownDisplayMode === 'default') {
            that.$dropDownContent.removeClass('partial');
        }
        else {
            that.$dropDownContent.addClass('partial');
        }
    }

    /**
     * Disables or enables spin buttons.
     */
    _disableSpinButtons() {
        const that = this;

        if (that.disabled) {
            return;
        }

        const disabled = that._value === null;

        that.$.upButton.disabled = disabled;
        that.$.downButton.disabled = disabled;
    }

    /**
     * Document up handler.
     */
    _documentUpHandler(event) {
        const that = this,
            activeElement = (that.shadowRoot || that.getRootNode()).activeElement || document.activeElement,
            target = that.shadowRoot || that.isInShadowDOM ? event.originalEvent.composedPath()[0] : event.originalEvent.target;

        if (!Smart.Utilities.Core.isMobile &&
            activeElement === that.$.input &&
            that.editMode === 'partial' &&
            that._value !== null &&
            (target !== that.$.input || that.$.input.selectionStart === that.$.input.selectionEnd)) {
            that._highlightedTimePartEdit = false;
            that._validateValue(that.$.input.value, that._cloneValue(), false);
            that._highlightTimePartBasedOnCursor();
        }
        else {
            if (target !== that.$.calendarButton && (!that.$.dropDownContainer.contains(target) && !that.$.dropDownContainer.contains(that._getRootShadowHost(target)))) {
                that.close();

                if (activeElement !== that.$.input && !that.contains(target)) {
                    that._highlightedTimePart = undefined;
                }
            }
        }

        that._mouseFocus = false;
    }

    /**
     * Returns the root node of an element inside the shadowDOM of a child element
     * @param {any} target
     */
    _getRootShadowHost(target) {
        const that = this;

        if (!that.shadowRoot && !that.isInShadowDOM) {
            return;
        }

        let host = target.getRootNode().host,
            rootHost;

        while (host && host !== that && host !== document) {
            rootHost = host;
            host = host.getRootNode().host;
        }

        return rootHost;
    }

    /**
     * Dropdown header click handler
     */
    _dropDownHeaderClickHandler(event) {
        const that = this;

        if (event.target === that.$.selectDate) {
            if (that.$selectDate.hasClass('smart-selected')) {
                return;
            }

            that.$selectDate.addClass('smart-selected');
            that.$selectTime.removeClass('smart-selected');
            that.$.timePickerDropDown.$.addClass('smart-hidden');
            that.$calendarDropDown.removeClass('smart-hidden');
        }
        else {
            if (that.$selectTime.hasClass('smart-selected')) {
                return;
            }

            that.$selectDate.removeClass('smart-selected');
            that.$selectTime.addClass('smart-selected');
            that.$calendarDropDown.addClass('smart-hidden');

            if (that._timePickerInitialized) {
                that.$.timePickerDropDown.$.removeClass('smart-hidden');
            }
            else {
                that._initializeTimePicker();
            }
        }
    }

    /**
     * Dropdown keydown handler.
     */
    _dropDownKeydownHandler(event) {
        const that = this,
            key = event.key,
            activeElement = that.shadowRoot ? that.shadowRoot.activeElement : document.activeElement;

        if (that.$.dropDownHeader.contains(activeElement) && (key === 'Enter' || key === ' ')) {
            event.preventDefault();
            that._dropDownHeaderClickHandler({ target: activeElement });
        }
        else if (key === 'Escape' || event.altKey && key === 'ArrowUp') {
            event.preventDefault();
            that.close();
            that.$.input.focus();
        }
        else if ((key === 'Enter' || key === ' ') && activeElement.classList.contains('smart-footer-component-today')) {
            event.preventDefault();
            that._validateValue(that._now());
            that.close();
        }
        else if (key === 'Enter' &&
            (activeElement === that.$.calendarDropDown.$.body && that.$.calendarDropDown.querySelectorAll('.smart-calendar-cell[selected][focus]').length > 0 ||
                that._timePickerInitialized && activeElement === that.$.timePickerDropDown.$.picker)) {
            event.preventDefault();
            that.close();
        }
    }

    /**
     * Dropdown transitionend handler.
     */
    _dropDownTransitionendHandler() {
        const that = this;

        if (!that.hasAnimation) {
            return;
        }

        if (that.opened && that._toFocus) {
            that._toFocus.focus();
            delete that._toFocus;

            if (that._timePickerInitialized &&
                !that.$.timePickerDropDown.classList.contains('smart-hidden')) {
                requestAnimationFrame(() => that.$.timePickerDropDown._highlightLabel());
            }

            return;
        }

        if (that._edgeMacFF && !that.opened) {
            that.$.dropDownContainer.style.top = null;
            that.$.dropDownContainer.style.left = null;
            that.$dropDownContainer.addClass('not-in-view');
            return;
        }
    }

    /**
     * Footer change handler.
     */
    _footerChangeHandler(event) {
        const that = this,
            oldContext = that.context,
            target = event.target,
            dateTimePickerValue = that._value !== null ? that._value : that._now();
        let value = target.value,
            timePartCode;

        that.context = that;

        event.stopPropagation();

        if (target.classList.contains('smart-hour-element')) {
            value = parseInt(value, 10);

            if (isNaN(value) || value < 0 || value > 12) {
                target.value = dateTimePickerValue.toString('hh');
                return;
            }

            if (value > 0 && value < 12 && dateTimePickerValue.toString('tt') === 'PM') {
                value += 12;
            }

            timePartCode = 'hh';
        }
        else if (target.classList.contains('smart-minute-element')) {
            value = parseInt(value, 10);

            if (isNaN(value) || value < 0 || value > 59) {
                target.value = dateTimePickerValue.toString('mm');
                return;
            }

            timePartCode = 'mm';
        }
        else {
            if (that._value === null) {
                target.value = '';
                return;
            }

            const oldValue = dateTimePickerValue.toString('tt');

            value = value.toLowerCase();

            if ((oldValue === 'PM' && (value === 'a' || value === 'am')) ||
                (oldValue === 'AM' && (value === 'p' || value === 'pm'))) {
                that._incrementDecrement(undefined, 'tt');
                target.value = that._value.toString('tt');
            }
            else {
                target.value = oldValue;
            }

            return;
        }

        const newValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(dateTimePickerValue);

        newValueConstructorParameters[that._codeToIndex[timePartCode]] = value;
        newValueConstructorParameters.unshift(null);

        that._validateValue(new (Function.prototype.bind.apply(Smart.Utilities.DateTime, newValueConstructorParameters)));

        target.value = that._value.toString(timePartCode);

        that.context = oldContext;
    }

    /**
     * Footer click handler.
     */
    _footerClickHandler(event) {
        const that = this,
            oldContext = that.context,
            target = event.target;

        that.context = that;

        if (target.classList.contains('smart-today-element')) {
            // "Now" icon is clicked
            that._validateValue(that._now());

            if (that.autoClose) {
                clearTimeout(that._autoCloseTimeout);
                that._autoCloseTimeout = setTimeout(function () {
                    that.close();
                }, that.autoCloseDelay);
            }
        }
        else {
            const closestRepeatButton = target.closest('smart-repeat-button');

            if (closestRepeatButton !== null) {
                const decrement = closestRepeatButton === closestRepeatButton.parentElement.children[1],
                    timePartCode = closestRepeatButton.closest('.smart-footer-component').classList.contains('smart-footer-component-hour') ?
                        'hh' : 'mm';

                that._incrementDecrement(decrement, timePartCode);
            }
        }

        that.context = oldContext;
    }

    /**
     * Footer wheel handler.
     */
    _footerWheelHandler(event) {
        const that = this,
            activeElement = that.shadowRoot ? that.shadowRoot.activeElement : document.activeElement;

        if (that.enableMouseWheelAction && event.target instanceof HTMLInputElement && activeElement === event.target) {
            const oldContext = that.context,
                target = event.target;

            that.context = that;

            if (target.classList.contains('smart-hour-element')) {
                that._incrementDecrement(event.deltaY > 0, 'hh');
            }
            else if (target.classList.contains('smart-minute-element')) {
                that._incrementDecrement(event.deltaY > 0, 'mm');
            }
            else {
                that._incrementDecrement(undefined, 'tt');
            }

            that.context = oldContext;

            event.stopPropagation();
        }
    }

    /**
     * Gets and highlights a time part.
     */
    _getAndHighlightTimePart(matchIndex, regExpIndex, index) {
        const that = this;

        that._programmaticSelection = true;

        if (that.$.input.selectionStart !== matchIndex || that.$.input.selectionEnd !== regExpIndex) {
            that.$.input.setSelectionRange(matchIndex, regExpIndex);
        }
        else {
            setTimeout(function () {
                that.$.input.setSelectionRange(matchIndex, regExpIndex);
            }, 200);
        }

        that._highlightedTimePart = {
            code: that._formatStringRegExp.groups[index],
            index: index,
            from: matchIndex,
            to: regExpIndex
        };
    }

    /**
     * Gets format string regular expression.
     */
    _getFormatStringRegExp() {
        const that = this;

        that._formatStringRegExp = that.min.getParseRegExp(that.min.calendar, that.formatString.replace(/y+/g, 'yyyyy'));
        that._formatStringRegExp.regExp = new RegExp(that._formatStringRegExp.regExp);
    }

    /**
     * Gets and stores month and day names based on locale.
     */
    _getLocalizedNames() {
        const that = this,
            localizedNames = Smart.Utilities.DateTime.getLocalizedNames(that.locale);

        that._localizedDays = localizedNames.days;
        that._localizedMonths = localizedNames.months;

        that.$.selectDate.innerHTML = that.localize('dateTabLabel');
        that.$.selectTime.innerHTML = that.localize('timeTabLabel');
    }

    /**
     * Handles manual time part edit.
     */
    _handleManualTimePartEdit(newTimePartValue) {
        const that = this,
            newValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(that._value);

        newTimePartValue = newTimePartValue[that._highlightedTimePart.index + 1];

        if (!isNaN(newTimePartValue)) {
            if (that._highlightedTimePart.code === 'f') {
                newTimePartValue = parseInt(newTimePartValue, 10) * 100;
            }
            else if (that._highlightedTimePart.code === 'ff') {
                newTimePartValue = parseInt(newTimePartValue, 10) * 10;
            }
            else if (that._highlightedTimePart.code.indexOf('y') !== -1 && newTimePartValue.length < 3) {
                const yearCutoff = that.yearCutoff.toString(),
                    threshold = parseInt(yearCutoff.slice(2), 10);
                let decade = parseInt(yearCutoff.slice(0, 2), 10);

                newTimePartValue = parseInt(newTimePartValue, 10);

                if (newTimePartValue < threshold) {
                    decade++;
                }

                newTimePartValue = newTimePartValue.toString();
                newTimePartValue = decade + '' + '0'.repeat(2 - newTimePartValue.length) + newTimePartValue;
            }
            else if (that._highlightedTimePart.code.indexOf('h') !== -1) {
                const previousHours = that._value.hour();

                newTimePartValue = parseInt(newTimePartValue, 10);

                if (previousHours > 11 && newTimePartValue <= 11) {
                    newTimePartValue += 12;
                }
            }

            newValueConstructorParameters[that._codeToIndex[that._highlightedTimePart.code]] = parseInt(newTimePartValue, 10);
        }
        else if (that._codeToIndex[that._highlightedTimePart.code] === 1) {
            // month name has been entered
            let index = -1;

            if (newTimePartValue.length > 1) {
                that._localizedMonths.names.some(function (element, i) {
                    if (element.toLowerCase().indexOf(newTimePartValue.toLowerCase()) !== -1) {
                        index = i;
                        return true;
                    }
                });
            }

            if (index !== -1) {
                newValueConstructorParameters[1] = index + 1;
            }
            else {
                that._applyFormatString();
                return;
            }
        }

        try {
            newValueConstructorParameters.unshift(null);
            that._validateValue(new (Function.prototype.bind.apply(Smart.Utilities.DateTime, newValueConstructorParameters)));
        }
        catch (error) {
            that._applyFormatString();
        }
    }

    /**
     * Highlights a time part based on the cursor's position in the input.
     */
    _highlightTimePartBasedOnCursor(caretPosition) {
        const that = this,
            inputValue = that.$.input.value,
            matches = that._formatStringRegExp.regExp.exec(inputValue);

        function getCaretPosition() {
            if (caretPosition === undefined) {
                return that.$.input.selectionStart;
            }

            return caretPosition;
        }

        if (matches === null) {
            that._highlightedTimePart = undefined;
            return;
        }

        if (!that._iOS && caretPosition === undefined) {
            caretPosition = that.$.input.selectionStart;
        }

        let regExpIndex = matches.index,
            matchIndex;

        for (let i = 1; i < matches.length; i++) {
            const match = matches[i];

            matchIndex = inputValue.indexOf(match, regExpIndex);
            regExpIndex = matchIndex + match.length;

            if (i === 1 && getCaretPosition() < matchIndex) {
                that._getAndHighlightTimePart(matchIndex, regExpIndex, 0);
                break;
            }

            if (getCaretPosition() >= matchIndex && getCaretPosition() <= regExpIndex) {
                that._getAndHighlightTimePart(matchIndex, regExpIndex, i - 1);
                break;
            }

            const nextMatch = matches[i + 1];

            if (nextMatch) {
                const indexOfNextMatch = inputValue.indexOf(nextMatch, regExpIndex);

                if (getCaretPosition() > regExpIndex && getCaretPosition() < indexOfNextMatch) {
                    if (getCaretPosition() - regExpIndex <= indexOfNextMatch - getCaretPosition()) {
                        that._getAndHighlightTimePart(matchIndex, regExpIndex, i - 1);
                    }
                    else {
                        that._formatStringRegExp.groups[i];
                        that._programmaticSelection = true;
                        that.$.input.setSelectionRange(indexOfNextMatch, indexOfNextMatch + nextMatch.length);
                    }
                    break;
                }
            }
            else {
                that._programmaticSelection = true;
                that.$.input.setSelectionRange(matchIndex, regExpIndex);
                that._highlightedTimePart = {
                    code: that._formatStringRegExp.groups[i - 1],
                    index: i - 1,
                    from: matchIndex,
                    to: regExpIndex
                };
                break;
            }
        }
    }

    /**
     * Highlights a time part based on its index in the format string.
     */
    _highlightTimePartBasedOnIndex(index) {
        const that = this,
            inputValue = that.$.input.value,
            matches = that._formatStringRegExp.regExp.exec(inputValue);

        if (matches === null) {
            that._validateValue(undefined, that._cloneValue(), false);
            that._highlightTimePartBasedOnIndex(index);
            return;
        }

        let regExpIndex = matches.index,
            matchIndex;
        const activeElement = that.shadowRoot ? that.shadowRoot.activeElement : document.activeElement;

        if (index < 0 || index >= matches.length) {
            return;
        }

        if (that.$.input !== activeElement) {
            that.$.input.focus();
        }

        for (let i = 1; i < matches.length; i++) {
            const match = matches[i];

            matchIndex = inputValue.indexOf(match, regExpIndex);
            regExpIndex = matchIndex + match.length;

            if (index === i - 1) {
                that._getAndHighlightTimePart(matchIndex, regExpIndex, index);
                break;
            }
        }
    }

    /**
     * Increments or decrements the value.
     */
    _incrementDecrement(decrement, timePartCode) {
        const that = this,
            oldValue = that._cloneValue();

        if (that._minMaxChanged) {
            that._value = that._rangeValidation(that._value);
            delete that._minMaxChanged;
        }

        if (timePartCode === undefined && that._highlightedTimePart) {
            timePartCode = that._highlightedTimePart.code;
        }

        if (timePartCode !== undefined) {
            if (timePartCode === 'z' || timePartCode === 'zz' || timePartCode === 'zzz') {
                that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index);
                return;
            }

            if (timePartCode === 't' || timePartCode === 'tt') {
                that._value = that._value.addHours(that._value.hour() < 12 ? 12 : -12, true);
            }
            else {
                that._value = that._value[that._codeToMethod[timePartCode]](decrement ? -1 : 1, true);
            }

            that._validateValue(undefined, oldValue, false);

            if (that._highlightedTimePart) {
                that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index);
            }
        }
        else {
            that._value = that._value.add(decrement ? that.interval.negate() : that.interval, undefined, true);
            that._validateValue(undefined, oldValue, false);
        }

        if (oldValue.compare(that._value) !== 0) {
            that.$.fireEvent('change', { 'oldValue': oldValue.toTimeZone(that._inputTimeZone), 'value': that.value });
        }
    }

    /**
     * Initializes TimePicker instance.
     */
    _initializeTimePicker() {
        const that = this;

        const timePickerDropDown = document.createElement('smart-time-picker');

        timePickerDropDown.rightToLeft = that.rightToLeft;
        timePickerDropDown.animation = that.animation;
        timePickerDropDown.theme = that.theme;
        timePickerDropDown.value = that._value !== null ? that._value.toDate() : that._now();
        that.$.timePickerDropDown = timePickerDropDown;
        timePickerDropDown.$ = Smart.Utilities.Extend(timePickerDropDown);
        that.$.dropDownContent.appendChild(timePickerDropDown);
        that._timePickerInitialized = true;

        that._addTimePickerListener();
    }

    /**
     * Input blur handler.
     */
    _inputBlurHandler() {
        const that = this;

        that.removeAttribute('focus');
        that._fullEdit = false;
        that._highlightedTimePartEdit = false;
    }

    /**
     * Input change handler.
     */
    _inputChangeHandler(event) {
        const that = this;

        if (event) {
            event.stopPropagation();
        }

        if (that.$.input.value === '') {
            that._setNullValue();
            return;
        }

        if (that._fullEdit || that._value === null) {
            that._fullEdit = false;
            that._validateValue(that.$.input.value);
            that._highlightTimePartBasedOnCursor();
        }
        else if (that._highlightedTimePartEdit) {
            that._highlightedTimePartEdit = false;

            let newTimePartValue = that._formatStringRegExp.regExp.exec(that.$.input.value);

            if (newTimePartValue !== null) {
                that._handleManualTimePartEdit(newTimePartValue);
            }
            else {
                that._applyFormatString();
            }
        }
    }

    /**
     * Input dragstart handler.
     */
    _inputDragstartHandler(event) {
        event.preventDefault();
    }

    /**
     * Input focus handler.
     */
    _inputFocusHandler() {
        const that = this;

        that.setAttribute('focus', '');

        if (that.editMode !== 'full') {
            const timeout = Smart.Utilities.Core.isMobile ? 10 : 0;

            // Timeout is necessary due to an issue in Chrome (https://bugs.chromium.org/p/chromium/issues/detail?id=526516)
            setTimeout(function () {
                if (that._iOS) {
                    that._highlightTimePartBasedOnCursor();
                }
                else if (that._mouseFocus !== true) {
                    if (that._highlightedTimePart === undefined) {
                        that._highlightTimePartBasedOnCursor(that._iOS ? undefined : 0);
                    }
                    else {
                        that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index);
                    }
                }
            }, timeout);
        }
    }

    /**
     * Input keydown handler.
     */
    _inputKeydownHandler(event) {
        const that = this,
            editMode = that.editMode,
            key = event.key;

        if (key === 'Tab') {
            return;
        }

        if (event.altKey && key === 'ArrowDown') {
            event.preventDefault();
            that.open();
            return;
        }

        if (key === 'Escape' || event.altKey && key === 'ArrowUp') {
            event.preventDefault();
            that.close();
            return;
        }

        if (editMode === 'full') {
            that._fullEdit = true;
            return;
        }
        else if (editMode === 'partial') {
            if (key === 'Delete') {
                if (that._value !== null) {
                    that._setNullValue();
                    event.preventDefault();
                }

                return;
            }

            if (that._value === null) {
                that._validateValue(that._now(), null, false);
                that._highlightTimePartBasedOnIndex(0);
            }

            if (['/', '.', '-', ',', ' '].indexOf(key) !== -1) {
                that._inputChangeHandler();
                that._navigateToNextTimePart();
                event.preventDefault();
                return;
            }
            else if (key === 'Backspace') {
                that._resetTimePart();

                if (that._highlightedTimePart.index > 0) {
                    that._navigateToPreviousTimePart();
                }
                else {
                    that._highlightTimePartBasedOnIndex(0);
                }

                event.preventDefault();
                return;
            }
        }
        else if (that._fullEdit || that._highlightedTimePartEdit || that.readonly ||
            ['Alt', 'Control', 'Shift'].indexOf(key) !== -1 ||
            event.altKey || event.ctrlKey) {
            return;
        }

        if (['End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].indexOf(key) === -1) {
            if (that._highlightedTimePart) {
                if (editMode !== 'partial' &&
                    (that._highlightedTimePart.to - that._highlightedTimePart.from !==
                        that.$.input.selectionEnd - that.$.input.selectionStart)) {

                    that._fullEdit = true;
                    return;
                }

                const code = that._highlightedTimePart.code;

                if (code === 'ddd' || code === 'dddd' ||
                    code === 'z' || code === 'zz' || code === 'zzz' ||
                    code === 't' || code === 'tt') {
                    // weekday name, time zone offset and a.m./p.m. cannot be edited
                    event.preventDefault();
                    return;
                }
                else if (editMode === 'partial' &&
                    code !== 'MMM' && code !== 'MMMM' &&
                    new RegExp(/^\d+$/).test(key) === false) {
                    if (key.length < 2 || key.charAt(0) !== 'F') {
                        event.preventDefault();
                    }

                    return;
                }

                that._highlightedTimePartEdit = true;
            }

            return;
        }

        event.preventDefault();

        if (editMode === 'partial' && that._highlightedTimePartEdit) {
            that._inputChangeHandler();
        }

        if (that._value === null) {
            return;
        }

        switch (key) {
            case 'End':
                that._highlightTimePartBasedOnIndex(that._formatStringRegExp.groups.length - 1);
                break;
            case 'Home':
                that._highlightTimePartBasedOnIndex(0);
                break;
            case 'ArrowLeft':
                that._navigateToPreviousTimePart();
                break;
            case 'ArrowUp':
                that._incrementDecrement();
                break;
            case 'ArrowRight':
                that._navigateToNextTimePart();
                break;
            case 'ArrowDown':
                that._incrementDecrement(true);
                break;
        }
    }

    /**
     * Input mousedown handler.
     */
    _inputDownHandler() {
        const that = this;

        if (that._fullEdit || that._highlightedTimePartEdit || that.editMode === 'full' || Smart.Utilities.Core.isMobile) {
            return;
        }

        // Timeout is necessary due to an issue in Chrome (https://bugs.chromium.org/p/chromium/issues/detail?id=526516)
        setTimeout(function () {
            that._mouseFocus = true;
            that._highlightTimePartBasedOnCursor();
        }, 0);
    }

    /**
     * Input paste handler.
     */
    _inputPasteHandler(event) {
        const that = this;

        if (that.editMode === 'partial') {
            event.preventDefault();
        }
        else {
            this._fullEdit = true;
        }
    }

    /**
     * Input select handler.
     */
    _inputSelectHandler() {
        const that = this,
            activeElement = that.shadowRoot ? that.shadowRoot.activeElement : document.activeElement;

        if (that.editMode !== 'partial' || activeElement !== that.$.input) {
            return;
        }

        if (that._programmaticSelection === true) {
            that._programmaticSelection = false;
        }
        else {
            if (that._highlightedTimePart) {
                that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index);
            }
            else {
                that._highlightTimePartBasedOnIndex(0);
            }
        }
    }

    /**
     * Input up handler.
     */
    _inputUpHandler() {
        const that = this;

        if (Smart.Utilities.Core.isMobile) {
            if (that._iOS) {
                that._mouseFocus = true;
                setTimeout(function () {
                    if (document.activeElement === that.$.input) {
                        that._highlightTimePartBasedOnCursor();
                    }
                }, 50);
            }
            else {
                // Timeout is necessary due to an issue in Chrome (https://bugs.chromium.org/p/chromium/issues/detail?id=526516)
                setTimeout(function () {
                    that._mouseFocus = true;
                    that._highlightTimePartBasedOnCursor();
                }, 10);
            }
        }
    }

    /**
     * Input wheel handler.
     */
    _inputWheelHandler(event) {
        const that = this,
            activeElement = that.shadowRoot ? that.shadowRoot.activeElement : document.activeElement;

        if (activeElement === that.$.input && that.enableMouseWheelAction && !that.disabled && !that.readonly) {
            event.preventDefault();
            that._incrementDecrement(event.deltaY > 0);
        }
    }

    /**
     * Checks if a date is restricted.
     */
    _isRestricted(date) {
        const restrictedDates = this.restrictedDates;
        let isRestricted = false;

        for (let i = 0; i < restrictedDates.length; i++) {
            if (date.equalDateParts(restrictedDates[i])) {
                isRestricted = true;
                break;
            }
        }

        return isRestricted;
    }

    /**
     * Mouseout handler.
     */
    _mouseoutHandler(event) {
        const that = this,
            target = event.target;

        if (!that.disabled && (target === that.$.input || target === that.$.calendarButton)) {
            target.removeAttribute('hover');
            that.removeAttribute('hover');
        }
    }

    /**
     * Mouseover handler.
     */
    _mouseoverHandler(event) {
        const that = this,
            target = event.target;

        if (!that.disabled && (target === that.$.input || target === that.$.calendarButton)) {
            target.setAttribute('hover', '');
            that.setAttribute('hover', '');
        }
    }

    /**
     * Navigates to next time part (if any).
     */
    _navigateToNextTimePart() {
        const that = this;

        that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index + 1);
    }

    /**
     * Navigates to previous time part (if any).
     */
    _navigateToPreviousTimePart() {
        const that = this;

        that._highlightTimePartBasedOnIndex(that._highlightedTimePart.index - 1);
    }

    /**
     * Returns a new DateTime object with the current time.
     */
    _now() {
        const that = this,
            now = new Smart.Utilities.DateTime('today', 'Local');

        if (that._outputTimeZone !== 'Local') {
            return now.toTimeZone(that._outputTimeZone);
        }

        return now;
    }

    /**
     * Opens the calendar dropdown.
     */
    _open(initial) {
        const that = this;

        if (that.disabled || that.readonly) {
            that.opened = false;
            that.$.calendarButton.setAttribute('aria-expanded', false);
            return;
        }

        const openingEvent = that.$.fireEvent('opening');

        if (openingEvent.defaultPrevented) {
            that.opened = false;
            that.$.calendarButton.setAttribute('aria-expanded', false);
            return;
        }

        if (that._edgeMacFF) {
            that.$dropDownContainer.removeClass('not-in-view');
        }

        const dropDownContainer = that.$.dropDownContainer;

        dropDownContainer.style.marginLeft = null;

        if (!initial) {
            dropDownContainer.style.transition = '';
        }

        that.$.calendarDropDown.disabled = false;

        that.$calendarButton.addClass('smart-calendar-button-pressed');
        that.$.calendarButton.setAttribute('active', '');

        if (that._dropDownDisplayMode !== 'default' && that._dropDownDisplayMode !== 'timePicker' ||
            !that._timePickerInitialized || (that._timePickerInitialized && that.$.timePickerDropDown.$.hasClass('smart-hidden'))) {
            that.$calendarDropDown.removeClass('smart-hidden');
        }

        that.opened = true;
        that.$.calendarButton.setAttribute('aria-expanded', true);

        that._positionDetection.placeOverlay();
        that._positionDetection.checkBrowserBounds('vertically');
        that._positionDetection.positionDropDown();

        const windowWidth = window.devicePixelRatio === 1 ? document.documentElement.clientWidth : window.innerWidth,
            dropDownContainerBoundingRect = dropDownContainer.getBoundingClientRect();

        if (dropDownContainerBoundingRect.left < 0) {
            dropDownContainer.style.marginLeft = -1 * dropDownContainerBoundingRect.left + 'px';
        }
        else if (dropDownContainerBoundingRect.right > windowWidth) {
            dropDownContainer.style.marginLeft = windowWidth - dropDownContainerBoundingRect.right + 'px';
        }

        that.$dropDownContainer.removeClass('smart-visibility-hidden');

        that.$.fireEvent('open');

        if (that._toSync) {
            const value = that._value;

            if (value !== null) {
                that._disregardCalendarChangeEvent = true;
                that.$.calendarDropDown.selectedDates = [value.toDate()];

                if (that._defaultFooterTemplateApplied) {
                    that._hourElement.value = value.toString('hh');
                    that._minuteElement.value = value.toString('mm');
                    that._ampmElement.value = value.toString('tt');
                }

                if (that._timePickerInitialized) {
                    that.$.timePickerDropDown.value = value.toDate();
                }
            }
            else {
                const oldContext = that.$.calendarDropDown.context;

                that.$.calendarDropDown.context = that.$.calendarDropDown;
                that.$.calendarDropDown._clearSelection(true);
                that.$.calendarDropDown.context = oldContext;

                if (that._defaultFooterTemplateApplied) {
                    that._hourElement.value = '';
                    that._minuteElement.value = '';
                    that._ampmElement.value = '';
                }
            }

            that._toSync = false;
        }

        let toFocus;

        switch (that._dropDownDisplayMode) {
            case 'default':
                if (that.$selectDate.hasClass('smart-selected')) {
                    toFocus = that.$.calendarDropDown;
                }
                else {
                    toFocus = that.$.timePickerDropDown.$.picker;
                }

                break;
            case 'classic':
            case 'calendar':
                toFocus = that.$.calendarDropDown;
                break;
            case 'timePicker':
                toFocus = that.$.timePickerDropDown.$.picker;
                break;
        }

        if (that.hasAnimation) {
            that._toFocus = toFocus;
        }
        else {
            toFocus.focus();
        }
    }

    /**
     * Positions external dropdown.
     */
    _positionExternalDropDown(elementRect) {
        const that = this.context,
            buttonOnTheRight = !that.calendarButton || that.calendarButtonPosition === 'right',
            dropDownPosition = that._dropDownListPosition,
            dropDown = that.$.dropDownContainer;
        let left = buttonOnTheRight ? elementRect.right - dropDown.offsetWidth : elementRect.left,
            top;

        switch (dropDownPosition) {
            case 'bottom':
                top = elementRect.bottom;
                break;
            case 'overlay-top':
                top = elementRect.bottom - dropDown.offsetHeight;
                break;
            case 'overlay-center':
                top = elementRect.top + elementRect.height / 2 - dropDown.offsetHeight / 2;
                break;
            case 'overlay-bottom':
                top = elementRect.top;
                break;
            case 'top':
                top = elementRect.top - dropDown.offsetHeight;
                break;
            case 'center-bottom':
            case 'center-top':
                if (dropDownPosition === 'center-bottom') {
                    top = elementRect.bottom + 5;
                }
                else {
                    top = elementRect.top - 5 - dropDown.offsetHeight;
                }

                if (buttonOnTheRight) {
                    left = elementRect.right - dropDown.offsetWidth / 2 - that.$.calendarButton.offsetWidth / 2;
                }
                else {
                    left = elementRect.left - dropDown.offsetWidth / 2 + that.$.calendarButton.offsetWidth / 2;
                }

                break;
        }

        return { left: left, top: top };
    }

    /**
     * Returns a date in the range between "min" and "max"
     */
    _rangeValidation(initialDate) {
        const that = this;

        if (initialDate.compare(that.min) === -1) {
            return that.min.clone();
        }
        else if (initialDate.compare(that.max) === 1) {
            return that.max.clone();
        }
        else {
            return initialDate;
        }
    }

    /**
     * Resets a time part
     */
    _resetTimePart() {
        const that = this,
            code = that._highlightedTimePart.code,
            index = that._codeToIndex[code],
            newValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(that._value);
        let value;

        if (index > 2) {
            value = 0;
        }
        else if (index > 0) {
            value = 1;
        }
        else {
            value = that.min.year();
        }

        newValueConstructorParameters[index] = value;
        newValueConstructorParameters.unshift(null);

        that._validateValue(new (Function.prototype.bind.apply(Smart.Utilities.DateTime, newValueConstructorParameters)));
    }

    /**
     * Sets ids to elements from the template (whenever necessary).
     */
    _setIds() {
        const that = this;

        if (!that.$.label.id) {
            that.$.label.id = that.id + 'Label';
        }

        if (!that.$.input.id) {
            that.$.input.id = that.id + 'Input';
        }

        if (!that.$.calendarButton.id) {
            that.$.calendarButton.id = that.id + 'CalendarButton';
        }

        if (!that.$.dropDownContainer.id) {
            that.$.dropDownContainer.id = that.id + 'DropDownContainer';
        }

        if (!that.$.hint.id) {
            that.$.hint.id = that.id + 'Hint';
        }
    }

    /**
     * Sets default footer template
     */
    _setDefaultFooterTemplate(initialization) {
        const that = this;

        that.$.calendarDropDown.footerTemplate = that._defaultFooterTemplate;

        if (initialization) {
            that.$.calendarDropDown._handleLayoutTemplate(that.$.calendarDropDown.$.footer, that._defaultFooterTemplate);
        }

        that._hourElement = that.$.calendarDropDown.getElementsByClassName('smart-hour-element')[0];
        that._minuteElement = that.$.calendarDropDown.getElementsByClassName('smart-minute-element')[0];
        that._ampmElement = that.$.calendarDropDown.getElementsByClassName('smart-am-pm-element')[0];
        that._todayElement = that.$.calendarDropDown.getElementsByClassName('smart-today-element')[0];

        that._todayElement.title = that.localize('now');

        Array.from(that.$.calendarDropDown.$.footer.getElementsByTagName('smart-repeat-button')).forEach(function (button) {
            button.animation = that.animation;
        });

        that._addCalendarFooterListeners();

        that._defaultFooterTemplateApplied = true;
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this;

        if (that.disabled || that.unfocusable) {
            that.$.input.tabIndex = -1;
            that.$.selectDate.removeAttribute('tabindex');
            that.$.selectTime.removeAttribute('tabindex');

            if (that._defaultFooterTemplateApplied) {
                that._hourElement.tabIndex = -1;
                that._ampmElement.tabIndex = -1;
                that._minuteElement.tabIndex = -1;
            }

            return;
        }

        const index = that.tabIndex > 0 ? that.tabIndex : 0;

        that.$.input.removeAttribute('tabindex');
        that.$.selectDate.tabIndex = index;
        that.$.selectTime.tabIndex = index;

        if (that._defaultFooterTemplateApplied) {
            that._hourElement.removeAttribute('tabindex');
            that._ampmElement.removeAttribute('tabindex');
            that._minuteElement.removeAttribute('tabindex');
            that.$.calendarDropDown.getElementsByClassName('smart-footer-component-today')[0].tabIndex = index;
        }
    }

    /**
     * Sets the value to null and updates the input.
     */
    _setNullValue(oldValue) {
        const that = this;

        if (oldValue === undefined) {
            oldValue = that._cloneValue();
        }

        if (that.nullable) {
            that._value = null;
            that.value = null;
            that._highlightedTimePart = undefined;

            that.$.input.value = '';

            if (oldValue !== null) {
                if (that.opened) {
                    if (!that._calendarInitiatedChange) {
                        const oldContext = that.$.calendarDropDown.context;

                        that.$.calendarDropDown.context = that.$.calendarDropDown;
                        that.$.calendarDropDown._clearSelection(true);
                        that.$.calendarDropDown.context = oldContext;
                    }

                    if (that._defaultFooterTemplateApplied) {
                        that._hourElement.value = '';
                        that._ampmElement.value = '';
                        that._minuteElement.value = '';
                    }

                    that._toSync = false;
                }
                else {
                    that._toSync = true;
                }

                that.$.fireEvent('change', { 'oldValue': oldValue.toTimeZone(that._inputTimeZone), 'value': null });
            }

            that._disableSpinButtons();
        }
        else {
            that._validateValue(that._now(), oldValue);
        }
    }

    /**
     * Spin buttons click handler.
     */
    _spinButtonsClickHandler(event) {
        const that = this;

        if (that._value !== null && !that.disabled && !that.readonly) {
            that._incrementDecrement(that.$.downButton.contains(event.target));
        }
    }

    /**
     * Validates initial property values.
     */
    _validateInitialPropertyValues() {
        const that = this,
            calendar = that.$.calendarDropDown;

        if (that.calendarButtonPosition === 'left') {
            that.$.content.insertBefore(that.$.calendarButton, that.$.input);
        }

        if (that.spinButtonsPosition === 'left') {
            that.$.content.insertBefore(that.$.spinButtonsContainer, that.$.input);
        }

        if (that.disabled) {
            that.$.upButton.disabled = true;
            that.$.downButton.disabled = true;
        }

        if (that.opened) {
            if (!that.disabled && !that.readonly) {
                that.$.dropDownContainer.style.transition = 'none';
                that._open(true);
            }
            else {
                that.opened = false;
            }
        }

        that.$.calendarButton.setAttribute('aria-expanded', that.opened);

        if (that.footerTemplate === null) {
            that._setDefaultFooterTemplate(true);
        }
        else {
            calendar.footerTemplate = that.footerTemplate;
            calendar._handleLayoutTemplate(calendar.$.footer, that.footerTemplate);
        }

        if (that.formatString === '') {
            that.formatString = 'dd-MMM-yy HH:mm:ss.fff';
        }

        const displayKind = that.displayKind;

        if (displayKind === 'UTC') {
            that._outputTimeZone = 'UTC';
        }
        else if (displayKind === 'local') {
            that._outputTimeZone = 'Local';
        }

        let parsedValue;

        if (that.value !== null) {
            parsedValue = Smart.Utilities.DateTime.validateDate(that.value, new Smart.Utilities.DateTime(), that.formatString);
            that._inputTimeZone = parsedValue.timeZone;

            if (displayKind !== 'unspecified' && that._inputTimeZone !== that._outputTimeZone) {
                parsedValue = parsedValue.toTimeZone(that._outputTimeZone);
            }
            else if (displayKind === 'unspecified') {
                that._outputTimeZone = that._inputTimeZone;
            }
        }
        else {
            parsedValue = null;
            that._inputTimeZone = 'Local';
        }

        that._validateRestrictedDates();
        that._validateMinMax('both');
        that._validateValue(parsedValue, that._now(), false, true);
        that._validateInterval(new Smart.Utilities.TimeSpan(0, 0, 1));

        that._getFormatStringRegExp();

        if (that._defaultFooterTemplateApplied && that._hourElement.value === '' && that.value !== null) {
            const value = that.value;

            that._hourElement.value = value.toString('hh');
            that._ampmElement.value = value.toString('tt');
            that._minuteElement.value = value.toString('mm');
        }

        that._detectDisplayMode();

        const dropDownDisplayMode = that._dropDownDisplayMode;

        if (dropDownDisplayMode === 'default' || dropDownDisplayMode === 'calendar') {
            calendar.viewSections = ['title', 'header'];

            if (calendar.$title.hasClass('smart-hidden')) {
                calendar.propertyChangedHandler('viewSections', ['header', 'footer'], ['title', 'header']);
            }

            if (dropDownDisplayMode === 'default') {
                that.$dropDownHeader.removeClass('smart-hidden');
            }
        }
        else if (dropDownDisplayMode === 'timePicker') {
            that.$calendarDropDown.addClass('smart-hidden');
            that._initializeTimePicker();
        }
    }

    /**
     * Validates "interval"
     */
    _validateInterval(referenceValue) {
        const that = this,
            interval = that.interval;
        let validValue = interval;

        if (interval instanceof Smart.Utilities.TimeSpan) {
            validValue = interval;
        }
        else if (typeof interval === 'string') {
            const indexOfTimeSpan = interval.indexOf('TimeSpan('),
                indexOfBracket = interval.indexOf(')');

            if (indexOfTimeSpan !== -1 && indexOfBracket !== -1) {
                validValue = interval.slice(indexOfTimeSpan + 9, indexOfBracket);

                validValue = validValue.replace(/'/g, '').replace(/"/g, '').replace(/^\s+|\s+$|\s+(?=\s)/g, '');

                if (new RegExp(/(^(\d+)(,\s*\d+)*$)/g).test(validValue)) {
                    validValue = validValue.replace(/\s/g, '');
                    validValue = validValue.split(',');

                    validValue.map(function (argument, index) {
                        validValue[index] = parseInt(argument);
                    });

                    validValue.unshift(null);
                    validValue = new (Function.prototype.bind.apply(Smart.Utilities.TimeSpan, validValue));
                }
            }

            if (validValue instanceof Smart.Utilities.TimeSpan === false) {
                if (validValue.trim() === '') {
                    that.interval = referenceValue;
                    return;
                }

                if (!isNaN(validValue)) {
                    validValue = parseInt(validValue, 10) * 10000;
                }

                try {
                    validValue = new Smart.Utilities.TimeSpan(validValue);
                }
                catch (error) {
                    that.interval = referenceValue;
                    return;
                }
            }
        }
        else if (typeof interval === 'number') {
            validValue = new Smart.Utilities.TimeSpan(interval);
        }
        else {
            that.interval = referenceValue;
            return;
        }

        if (validValue._ticks === 0) {
            that.interval = referenceValue;
        }
        else {
            that.interval = validValue;
        }
    }

    /**
     * Validates "min" and "max"
     */
    _validateMinMax(which, referenceValue) {
        const that = this;
        let minChanged = false;

        if (which !== 'max') {
            that.min = Smart.Utilities.DateTime.validateDate(that.min, referenceValue || new Smart.Utilities.DateTime(1600, 1, 1), that.formatString);
            that.min = that.min.toTimeZone(that._outputTimeZone);
            minChanged = true;
        }

        if (which !== 'min') {
            that.max = Smart.Utilities.DateTime.validateDate(that.max, referenceValue || new Smart.Utilities.DateTime(3001, 1, 1), that.formatString);
            that.max = that.max.toTimeZone(that._outputTimeZone);

            that.max.calendar.days = that._localizedDays;
            that.max.calendar.months = that._localizedMonths;
            that.max.calendar.locale = that.locale;

            that.$.calendarDropDown.max = that.max.toDate();
        }

        if (that.min.compare(that.max) > 0) {
            that.min = that.max.clone();
            minChanged = true;
        }

        if (minChanged) {
            that.min.calendar.days = that._localizedDays;
            that.min.calendar.months = that._localizedMonths;
            that.min.calendar.locale = that.locale;

            that.$.calendarDropDown.min = that.min.toDate();
        }
    }

    /**
     * Validates "restrictedDates".
     */
    _validateRestrictedDates() {
        const that = this,
            dateTimeInputRestrictedDates = [],
            calendarRestrictedDates = [];

        for (let i = 0; i < that.restrictedDates.length; i++) {
            const currentRestrictedDate = that.restrictedDates[i];
            let validRestrictedDate = Smart.Utilities.DateTime.validateDate(currentRestrictedDate, 'invalid', that.formatString);

            if (validRestrictedDate !== 'invalid') {
                validRestrictedDate = validRestrictedDate.toTimeZone(that._outputTimeZone);
                dateTimeInputRestrictedDates.push(validRestrictedDate);
                calendarRestrictedDates.push(validRestrictedDate.toDate());
            }
        }

        that.restrictedDates = dateTimeInputRestrictedDates;
        that.$.calendarDropDown.restrictedDates = calendarRestrictedDates;
    }

    /**
     * Validates the value and updates the input.
     */
    _validateValue(value, referenceValue, fireEvent, programmatic) {
        const that = this,
            oldValue = referenceValue !== undefined ? referenceValue : that._cloneValue();

        if (value === null || value === '') {
            that._setNullValue(oldValue);
            return;
        }

        if (value !== undefined) {
            that._value = Smart.Utilities.DateTime.validateDate(value, oldValue, that.formatString);
        }

        if (that._value === null) {
            that._setNullValue(oldValue);
            return;
        }

        let valueNotRestricted = that._value;

        while (that._isRestricted(valueNotRestricted) === true) {
            valueNotRestricted.addDays(1, false);
        }

        const valueInRange = that._rangeValidation(valueNotRestricted);

        if (!programmatic || that.validation === 'strict') {
            that._value = valueInRange;
            delete that._minMaxChanged;
        }
        else if (valueNotRestricted.equals(valueInRange) === false) {
            that._minMaxChanged = true;
        }

        that.value = that._value.toTimeZone(that._inputTimeZone);

        const validValue = that._value;

        validValue.calendar.days = that._localizedDays;
        validValue.calendar.months = that._localizedMonths;
        validValue.calendar.locale = that.locale;

        that._applyFormatString();
        that._disableSpinButtons();

        if (((oldValue === null || validValue === null) && oldValue !== validValue) ||
            ((oldValue !== null && validValue !== null) && oldValue.compare(validValue) !== 0)) {
            if (fireEvent !== false) {
                that.$.fireEvent('change', { 'oldValue': oldValue !== null ? oldValue.toTimeZone(that._inputTimeZone) : null, 'value': that.value });
            }

            if (that._calendarInitiatedChange) {
                return;
            }

            if (that.opened) {
                if (oldValue === null ||
                    that.$.calendarDropDown.selectedDates.length === 0 ||
                    oldValue.year() !== validValue.year() ||
                    oldValue.month() !== validValue.month() ||
                    oldValue.day() !== validValue.day() ||
                    !that.$.calendarDropDown._isDateInView(validValue.toDate())) {
                    that._disregardCalendarChangeEvent = true;
                    that.$.calendarDropDown.selectedDates = [validValue.toDate()];
                }

                if (that._defaultFooterTemplateApplied) {
                    if (oldValue === null || oldValue.hour() !== validValue.hour()) {
                        that._hourElement.value = validValue.toString('hh');
                        that._ampmElement.value = validValue.toString('tt');
                    }

                    if (oldValue === null || oldValue.minute() !== validValue.minute()) {
                        that._minuteElement.value = validValue.toString('mm');
                    }
                }

                if (that._timePickerInitialized && !that._timePickerInitiatedChange) {
                    that.$.timePickerDropDown.value = validValue.toDate();
                }

                that._toSync = false;
            }
            else {
                that._toSync = true;
            }
        }
    }
});
