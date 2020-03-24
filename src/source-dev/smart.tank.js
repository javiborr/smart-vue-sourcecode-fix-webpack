
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * Tank custom element.
 */
Smart('smart-tank', class Tank extends Smart.BaseElement {
    /**
     * Tank's properties.
     */
    static get properties() {
        return {
            'coerce': {
                value: false,
                type: 'boolean'
            },
            'customInterval': {
                value: false,
                type: 'boolean'
            },
            'customTicks': {
                reflectToAttribute: false,
                value: ['0', '50', '100'],
                type: 'array'
            },
            'dateLabelFormatString': {
                value: 'd',
                type: 'string'
            },
            'decimalSeparator': {
                value: '.',
                type: 'string'
            },
            'interval': {
                value: '1',
                type: 'any'
            },
            'inverted': {
                value: false,
                type: 'boolean'
            },
            'labelFormatFunction': {
                value: null,
                type: 'function?'
            },
            'labelsVisibility': {
                value: 'all',
                allowedValues: ['all', 'endPoints', 'none'],
                type: 'string'
            },
            'logarithmicScale': {
                value: false,
                type: 'boolean'
            },
            'max': {
                value: '100',
                type: 'any'
            },
            'mechanicalAction': {
                value: 'switchWhileDragging',
                allowedValues: ['switchUntilReleased', 'switchWhenReleased', 'switchWhileDragging'],
                type: 'string'
            },
            'messages': {
                value: {
                    'en': {
                        'missingReference': '{{elementType}}: Missing reference to {{files}}.',
                        'significantPrecisionDigits': '{{elementType}}: the properties significantDigits and precisionDigits cannot be set at the same time.',
                        'invalidMinOrMax': '{{elementType}}: Invalid {{property}} value. Max cannot be lower than Min.',
                        'noInteger': '{{elementType}}: precisionDigits could be set only on "floatingPoint" scaleType.'
                    }
                },
                type: 'object',
                extend: true
            },
            'min': {
                value: '0',
                type: 'any'
            },
            'mode': {
                value: 'numeric',
                allowedValues: ['numeric', 'date'],
                type: 'string'
            },
            'name': {
                value: '',
                type: 'string'
            },
            'orientation': {
                value: 'vertical',
                allowedValues: ['horizontal', 'vertical'],
                type: 'string'
            },
            'precisionDigits': {
                value: null,
                type: 'number?'
            },
            'scalePosition': {
                value: 'near',
                allowedValues: ['near', 'far', 'both', 'none'],
                type: 'string'
            },
            'scaleType': {
                value: 'floatingPoint',
                allowedValues: ['floatingPoint', 'integer'],
                type: 'string'
            },
            'scientificNotation': {
                value: false,
                type: 'boolean'
            },
            'showThumbLabel': {
                value: false,
                type: 'boolean'
            },
            'showTooltip': {
                value: false,
                type: 'boolean'
            },
            'showUnit': {
                value: false,
                type: 'boolean'
            },
            'significantDigits': {
                value: null,
                type: 'number?'
            },
            'thumbLabelPosition': {
                value: 'near',
                allowedValues: ['near', 'far'],
                type: 'string'
            },
            'ticksPosition': {
                value: 'scale',
                allowedValues: ['scale', 'track'],
                type: 'string'
            },
            'ticksVisibility': {
                value: 'minor',
                allowedValues: ['major', 'minor', 'none'],
                type: 'string'
            },
            'tooltipPosition': {
                value: 'near',
                allowedValues: ['near', 'far'],
                type: 'string'
            },
            'unit': {
                value: 'kg',
                type: 'string'
            },
            'validation': {
                value: 'strict',
                allowedValues: ['strict', 'interaction'],
                type: 'string'
            },
            'value': {
                value: '0',
                type: 'any'
            },
            'wordLength': {
                value: 'int32',
                allowedValues: ['int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64'],
                type: 'string'
            }
        };
    }

    /**
     * Tank's event listeners.
     */
    static get listeners() {
        return {
            'track.down': '_trackDownHandler',
            'track.move': '_trackMoveHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler',
            'keydown': '_keydownHandler',
            'resize': '_resizeHandler',
            'styleChanged': '_styleChangedHandler',
            'document.selectstart': '_selectStartHandler',
            'track.mouseenter': '_trackOnMouseEnterHandler',
            'track.mouseleave': '_trackOnMouseLeaveHandler'
        };
    }

    static get requires() {
        return {
            'Smart.Utilities.BigNumber': 'smart.math.js',
            'Smart.Utilities.NumericProcessor': 'smart.numeric.js',
            'Smart.Utilities.TickIntervalHandler': 'smart.tickintervalhandler.js'
        }
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.tank.css'
        ]
    }

    /**
     * Tank's HTML template.
     */
    template() {
        return `<div id="container" class="smart-container" role="presentation">
                    <div id="scaleNear" class="smart-scale smart-scale-near" role="presentation" aria-hidden="true"></div>
                    <div id="track" class="smart-track" role="presentation">
                        <div id="fill" class="smart-value" role="presentation">
                            <div id="bubbleContainer" class="smart-bubble-container" role="presentation"></div>
                            <div id="tooltip" class="smart-tooltip" role="tooltip"><div id="tooltipContent" class="smart-tooltip-content smart-unselectable" role="presentation"></div></div>
                            <div id="thumb" class="smart-thumb">
                                <div class="smart-thumb-label-container">
                                    <span id="thumbLabel" class="smart-thumb-label"></span>
                                </div>
                            </div>
                        </div>
                        <div id="trackTicksContainer" class="smart-track-ticks-container smart-hidden" role="presentation"></div>
                    </div>
                    <div id="scaleFar" class="smart-scale smart-scale-far" role="presentation" aria-hidden="true"></div>
                    <input id="hiddenInput" type="hidden" name="[[name]]">
                </div>`;
    }

    /**
     * Invoked when an instance of custom element is attached to the DOM for the first time.
     */
    ready() {
        super.ready();

        const that = this;

        that._redefineProperty('customTicks');
        that.checkLicense();

    }

    render() {
        const that = this;

        that.setAttribute('role', 'slider');

        this._createElement();

        if (that.enableShadowDOM && that.$.hiddenInput) {
            that.appendChild(that.$.hiddenInput);
        }

        super.render();
    }

    _createElement() {
        const that = this;

        if (!that.$.tooltip.id) {
            that.$.tooltip.id = that.id + 'Tooltip';
        }

        that.setAttribute('aria-describedby', that.$.tooltip.id);

        //Escape the initial transiton
        that.$.fill.style.transition = 'none';

        if (that.mode === 'numeric') {
            that._getEventValue = function () {
                return that.value;
            };
        }
        else {
            that._handleDateScale();
        }

        that._setSettingsObject();
        that._setDrawVariables();
        that._getLayoutType();

        //Creating instances of NumericProcessor and NumberRenderer
        that._numericProcessor = new Smart.Utilities.NumericProcessor(that, 'scaleType');
        that._numberRenderer = new Smart.Utilities.NumberRenderer();

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }

        that._renderingSuspended = false;

        that._setInitialComponentDisplay();
        that._measurements = {};
        that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);
        that._validateInitialPropertyValues();
        that._setTicksAndInterval();

        // Initial adjustments
        that._validate(true);

        that._updateTooltipValue(that._drawValue);
        that._setFocusable();
        that._setTrackSize();

        //Add bubbles effect
        that._setBubbles();

        //Restore CSS transition
        that.$.fill.style.transition = '';

        that.$.hiddenInput.value = that._getEventValue();

        that.setAttribute('aria-orientation', that.orientation);
        that._setAriaValue('valuenow');
    }

    /*
     * Public methods
     */

    /**
     * Sets or gets the value of the tank.
     *
     * @param {Number/String} value Optional value to be set to the tank. If this parameter is not set, the method gets the value.
     */
    val(value) {
        const that = this;

        if (value !== undefined) {
            if (that.mode === 'date') {
                let newValue = Smart.Utilities.DateTime.validateDate(value);

                newValue = newValue.getTimeStamp();

                if (newValue.compare(that.value) !== 0) {
                    that._validate(false, newValue, undefined, true);
                    return;
                }

                return that._valueDate;
            }

            if (that.value.toString().toUpperCase() !== value.toString().toUpperCase()) {

                // use as value setter
                value = value.toString().replace(/\s/g, '');
                if (that._numericProcessor.regexScientificNotation.test(value)) {
                    value = that._numericProcessor.scientificToDecimal(value);
                }

                const valueToValidate = that._discardDecimalSeparator(value.toString());

                that._validate(false, valueToValidate, undefined, true);
                delete that._valueBeforeCoercion;
            }
            else {
                return that.value = typeof (value) === 'string' ? value : value.toString();
            }
        }
        else {
            // use as value getter
            return that._getEventValue();
        }
    }

    /**
    * Adds bubbles in the fill area.
    */
    _setBubbles() {
        const that = this;

        if (!that.hasAnimation) {
            //Removes the bubble elements

            //const bubbles = that.getElementsByClassName('bubble');

            //if (bubbles.length > 0) {
            //    for (let b = bubbles.length; b > -1; b--) {
            //        b[0].parentElement.removeChild(b[0]);
            //    }
            //}

            return;
        }

        let fragment = document.createDocumentFragment(),
            bubble;

        for (let b = 0; b < 5; b++) {
            bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.classList.add('bubble' + (b + 1));
            fragment.appendChild(bubble);
        }

        that.$.bubbleContainer.appendChild(fragment);
    }

    _setTrackSize() {
        const that = this;

        //Calculte initial track size
        if (that.orientation === 'vertical') {
            that._trackSize = that.$.track.offsetWidth;
        }
        else {
            that._trackSize = that.$.track.offsetHeight;
        }
    }

    /**
     * Gets the optimal size of the tank.
     */
    getOptimalSize() {
        const that = this;

        if (that._renderingSuspended) {
            return { width: 0, height: 0 };
        }

        let propertiesObj, largestLabelSize, sizeObject;

        switch (that.labelsVisibility) {
            case 'all':
                largestLabelSize = that._numericProcessor._longestLabelSize
                break;
            case 'endPoints':
                largestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
                break;
            case 'none':
                largestLabelSize = 0;
                break;
        }

        switch (that.orientation) {
            case 'horizontal':
                propertiesObj = {
                    marginA: 'marginBottom',
                    marginB: 'marginTop',
                    nearScaleDistance: 'bottom',
                    farScaleDistance: 'top',
                    paddingA: 'paddingBottom',
                    paddingB: 'paddingTop',
                    offset: 'offsetWidth',
                    distance: 'left'
                };

                if (that._orientationChanged) {
                    propertiesObj.offset = 'offsetHeight';
                    that._trackChanged = true;
                }

                sizeObject = that._getSize(largestLabelSize, propertiesObj);
                return { width: sizeObject.optimalOtherSize, height: sizeObject.optimalSize };
            case 'vertical':
                propertiesObj = {
                    marginA: 'marginLeft',
                    marginB: 'marginRight',
                    nearScaleDistance: 'right',
                    farScaleDistance: 'left',
                    paddingA: 'paddingLeft',
                    paddingB: 'paddingRight',
                    offset: 'offsetHeight',
                    distance: 'top'
                };

                if (that._orientationChanged) {
                    propertiesObj.offset = 'offsetWidth';
                    that._trackChanged = true;
                }

                sizeObject = that._getSize(largestLabelSize, propertiesObj);
                return { width: sizeObject.optimalSize, height: sizeObject.optimalOtherSize };
        }
    }



    /**
     * Invoked when the value of a public property has been changed by the user.
     */
    propertyChangedHandler(key, oldValue, value) {
        super.propertyChangedHandler(key, oldValue, value);

        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        // eslint-disable-next-line
        if (value == oldValue) {
            that[key] = oldValue;
            return;
        }

        switch (key) {
            case 'labelsVisibility':
            case 'ticksVisibility':
                that._updateScaleWidth(that._numericProcessor._longestLabelSize);
                return;
            case 'coerce':
                if (value) {
                    const valueBeforeCoercion = that.value,
                        coercedValue = value = that.logarithmicScale ? Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(valueBeforeCoercion))) : that._numericProcessor.getCoercedValue(valueBeforeCoercion);

                    that._validate(false, coercedValue, true, true);
                    that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                }
                else {
                    if (that._valueBeforeCoercion !== undefined) {
                        that._validate(false, that._valueBeforeCoercion, false, true);
                    }
                }
                return;
            case 'interval': {
                //Validates the Interval
                that._numericProcessor.validateInterval(value);

                const newValue = value = that.logarithmicScale ? Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(that.value))) : that._numericProcessor.getCoercedValue(that.value);
                that._validate(false, newValue, that.coerce, true);
                break;
            }
            case 'min':
            case 'max': {
                if (that.mode === 'date') {
                    delete that._dateInterval;

                    that[key] = Smart.Utilities.DateTime.validateDate(value).getTimeStamp();
                }

                that._validateMinMax(key, false, oldValue);

                const validValue = that._numericProcessor.createDescriptor(that._discardDecimalSeparator(that.value, that.decimalSeparator), undefined, true, that.validation === 'strict');

                that._setTicksAndInterval();
                that._numericProcessor.updateValue(validValue);

                let optimalSize = that.getOptimalSize(),
                    actualSize = that.getBoundingClientRect(),
                    trackSize = that.$.track.getBoundingClientRect();

                if (optimalSize.width > actualSize.width && trackSize.width < 20) {
                    that.style.width = optimalSize.width + 'px';
                    that.style.height = optimalSize.height + 'px';
                }
                break;
            }
            case 'inverted':
            case 'rightToLeft': {
                that._getLayoutType();
                if (that._normalLayout) {
                    that.$.fill.style[that._settings.margin] = '0px';
                }

                let invertedNumberToValidate = that._numericProcessor.createDescriptor(that.value),
                    validInvertedValue = that._numericProcessor.validate(invertedNumberToValidate, that._minObject, that._maxObject);

                that._setTicksAndInterval();
                that._numericProcessor.updateValue(validInvertedValue);
                break;
            }
            case 'orientation': {
                const fillStyle = that.$.fill.style,
                    containerStyle = that.$.container.style;

                //resizeChange handler flag
                if (that._orientationChanged !== true) {
                    that._orientationChanged = true;
                }
                that._tankSizeBeforeOrientation = { width: that.offsetWidth, height: that.offsetHeight };
                that._setSettingsObject();
                that._getLayoutType();

                if (that.rightToLeft) {
                    fillStyle.marginLeft = '0';
                }

                if (that.inverted) {
                    fillStyle.marginTop = '0';
                    fillStyle.marginLeft = '0';
                }

                switch (that.orientation) {
                    case 'vertical':
                        if (!that.inverted) {
                            fillStyle.marginTop = 'auto';
                            fillStyle.marginLeft = '0';
                        }

                        fillStyle.width = '100%';
                        containerStyle.paddingLeft = '0';
                        containerStyle.paddingRight = '0';
                        break;
                    case 'horizontal':
                        if (!that.inverted || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
                            fillStyle.marginTop = '0';
                            fillStyle.marginLeft = 'auto'
                        }

                        fillStyle.height = '100%';
                        containerStyle.paddingTop = '0';
                        containerStyle.paddingBottom = '0';
                        break;
                }

                that._validateMinMax('both');

                const orientationNumberToValidate = that._numericProcessor.createDescriptor(that.value),
                    validOrientationValue = that._numericProcessor.validate(orientationNumberToValidate, that._minObject, that._maxObject);

                that._setTicksAndInterval();
                that._setTicksAndInterval();//
                that._numericProcessor.updateValue(validOrientationValue);

                that._trackChanged = true;

                that.setAttribute('aria-orientation', value);
                break;
            }
            case 'significantDigits':
            case 'precisionDigits': {
                if (that.mode === 'date') {
                    return;
                }

                if (key === 'precisionDigits' && that.scaleType === 'integer') {
                    that.error(that.localize('noInteger', { elementType: that.nodeName.toLowerCase(), property: key }));
                }

                if (key === 'significantDigits' && that.precisionDigits !== null) {
                    that.precisionDigits = null;
                }
                else if (key === 'precisionDigits' && that.significantDigits !== null) {
                    that.significantDigits = null;
                }

                // Validates significantDigits
                that._validateInitialPropertyValues();

                // Redraw the labels
                that._setTicksAndInterval();

                if (that.orientation === 'horizontal' && (that.inverted || that.rightToLeft)) {
                    const px = that._numericProcessor.valueToPx(that._numericProcessor.getCoercedValue(that._drawValue));

                    that.updateFillSizeAndPosition(px, that._settings.margin, value, false);
                }
                break;
            }
            case 'decimalSeparator': {
                if (that.scaleType === 'integer' || that.mode === 'date') {
                    return;
                }

                const numericValue = that._discardDecimalSeparator(that.value, oldValue),
                    valueWithNewSeparator = that._applyDecimalSeparator(numericValue);

                that.value = numericValue;
                delete that._valueBeforeCoercion;

                // Redraw the labels
                that._numericProcessor.addTicksAndLabels();
                that._updateTooltipValue(valueWithNewSeparator);
                break;
            }
            case 'value': {
                that.value = oldValue;

                if (value === null) {
                    return;
                }

                if (that.mode === 'date') {
                    let newValue = Smart.Utilities.DateTime.validateDate(value);

                    newValue = newValue.getTimeStamp();

                    if (newValue.compare(oldValue) !== 0) {
                        that._validate(false, newValue, undefined, true);
                    }

                    return;
                }

                if (value.toString().toUpperCase() !== oldValue.toString().toUpperCase()) {
                    let valueToValidate = value !== undefined ? value.toString().replace(/\s/g, '') : oldValue.toString().replace(/\s/g, '');

                    if (that._numericProcessor.regexScientificNotation.test(valueToValidate)) {
                        valueToValidate = that._numericProcessor.scientificToDecimal(valueToValidate);
                    }

                    that._validate(false, valueToValidate, undefined, true);
                    delete that._valueBeforeCoercion;
                }
                else {
                    that.value = typeof (value) === 'string' ? value : value.toString();
                }

                break;
            }
            case 'scaleType':
                if (that.mode === 'date') {
                    that.scaleType = 'integer';
                    return;
                }

                that._changeScaleType(oldValue, value);
                break;
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'showUnit':
            case 'unit': {
                that._setTicksAndInterval();
                that._moveThumbBasedOnValue(that._drawValue);
                break;
            }
            case 'tooltipPosition':
                break;
            case 'wordLength': {
                if (that.mode === 'date') {
                    that.wordLength = 'uint64';
                    return;
                }

                that._wordLengthNumber = that._numericProcessor.getWordLength(value);
                that._validateMinMax('both');

                const numberToValidate = that._numericProcessor.createDescriptor(that.value),
                    validValue = that._numericProcessor.validate(numberToValidate, that._minObject, that._maxObject);

                that._setTicksAndInterval();
                that._numericProcessor.updateValue(validValue);
                break;
            }
            case 'scalePosition': {
                that._setInitialComponentDisplay();
                that._setTicksAndInterval();
                that._moveThumbBasedOnValue(that._drawValue);
                break;
            }
            case 'labelFormatFunction':
            case 'scientificNotation': {
                if (that.mode === 'date' && key === 'scientificNotation') {
                    return;
                }

                const numericValue = that._discardDecimalSeparator(that.value, that.decimalSeparator);

                // Recalculate label position and redraw the labels
                that._setTicksAndInterval();

                //Update toolTip\'s value
                that._updateTooltipValue(numericValue);
                break;
            }
            case 'logarithmicScale':
                if (that.mode === 'date') {
                    that.logarithmicScale = false;
                    return;
                }

                that._validateMinMax('both');
                that._setTicksAndInterval();
                that._validate(false, that.value, undefined, true);
                break;
            case 'ticksPosition':
                if (value === 'scale') {
                    that.$trackTicksContainer.addClass('smart-hidden');
                    that.$.trackTicksContainer.innerHTML = '';
                }
                else {
                    that.$trackTicksContainer.removeClass('smart-hidden');
                }
                that._numericProcessor.addTicksAndLabels();
                break;
            case 'customInterval':
                if (value) {
                    if (that._customTicks) {
                        that.customTicks = that._customTicks;
                    }

                    that._numericProcessor.validateCustomTicks();
                }
                else if (that.mode === 'date') {
                    that._customTicks = that.customTicks;
                }

                that._setTicksAndInterval();
                that._coerceCustomInterval();
                break;
            case 'customTicks':
                if (that.mode === 'date' && !that.customInterval) {
                    that._customTicks = value;
                    that.customTicks = oldValue;
                    return;
                }

                that._numericProcessor.validateCustomTicks();

                if (that.customInterval) {
                    that._setTicksAndInterval();
                    that._coerceCustomInterval();
                }

                break;
            case 'dateLabelFormatString':
                if (that.mode === 'date') {
                    that._setTicksAndInterval();
                }

                break;
            case 'mode':
                that.mode = oldValue;
                break;
            case 'showThumbLabel':
                if (value && that.showTooltip) {
                    that.showTooltip = false;
                }

                break;
            case 'showTooltip':
                if (value && that.showThumbLabel) {
                    that.showThumbLabel = false;
                }

                break;
            case 'validation':
                if (value === 'strict') {
                    that._validate(false, that.value);
                }

                break;
        }
    }

    /**
     * Sets the "_settings" object.
     */
    _setSettingsObject() {
        const that = this;

        if (that.orientation === 'horizontal') {
            that._settings = {
                clientSize: 'clientWidth',
                dimension: 'width',
                leftOrTop: 'left',
                margin: 'marginLeft',
                offset: 'offsetLeft',
                otherSize: 'offsetHeight',
                size: 'offsetWidth',
                page: 'pageX'
            };
        }
        else {
            that._settings = {
                clientSize: 'clientHeight',
                dimension: 'height',
                leftOrTop: 'top',
                margin: 'marginTop',
                offset: 'offsetTop',
                otherSize: 'offsetWidth',
                size: 'offsetHeight',
                page: 'pageY'
            };
        }
    }

    /**
     * Sets the display of the scales.
     */
    _setInitialComponentDisplay() {
        const that = this;

        switch (that.scalePosition) {
            case 'near':
                that.$scaleNear.removeClass('smart-hidden');
                that.$scaleFar.addClass('smart-hidden');
                break;
            case 'far':
                that.$scaleNear.addClass('smart-hidden');
                that.$scaleFar.removeClass('smart-hidden');
                break;
            case 'both':
                that.$scaleFar.removeClass('smart-hidden');
                that.$scaleNear.removeClass('smart-hidden');
                break;
            case 'none':
                that.$scaleFar.addClass('smart-hidden');
                that.$scaleNear.addClass('smart-hidden');
                break;
        }
        that.$tooltip.addClass('smart-hidden');

        if (that.ticksPosition === 'track') {
            that.$trackTicksContainer.removeClass('smart-hidden');
        }
    }

    /**
    * Style changed event handler.
    **/
    _styleChangedHandler() {
        const that = this;

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }
        else if (that._renderingSuspended) {
            that._createElement();
            return;
        }

        if (that._renderingSuspended) {
            return;
        }

        that._setTicksAndInterval();
        that._moveThumbBasedOnValue(that._drawValue);
    }

    /**
     * Validates initial property values.
     */
    _validateInitialPropertyValues() {
        const that = this,
            value = typeof (that.value) === String ? that.value.replace(/\s/g, '') : that.value.toString().replace(/\s/g, '');

        if (that.mode === 'numeric' && that._numericProcessor.regexScientificNotation.test(value)) {
            that.value = that._numericProcessor.scientificToDecimal(value);
            delete that._valueBeforeCoercion;
        }

        //Validates significantDigits
        that.significantDigits = (that.significantDigits !== null) ? Math.min(Math.max(that.significantDigits, 1), 21) : null;

        if (that.significantDigits === null && that.precisionDigits === null) {
            that.significantDigits = 8;
        }
        else if (that.significantDigits !== null && that.precisionDigits !== null) {
            that.error(that.localize('significantPrecisionDigits', { elementType: that.nodeName.toLowerCase() }));
        }

        //minMax validation
        that._validateMinMax('both', true);

        if (that.showTooltip && that.showThumbLabel) {
            that.showTooltip = false;
        }
    }

    /**
      * Validates the properties "min" and "max".
      */
    _validateMinMax(validatedProperty, initialValidation, oldValue) {
        const that = this;

        let validateMin = validatedProperty === 'min' || validatedProperty === 'both',
            validateMax = validatedProperty === 'max' || validatedProperty === 'both';

        if (typeof (initialValidation) === undefined) {
            initialValidation = false;
        }

        if (validatedProperty === 'both') {
            validator('min', oldValue);
            validator('max', oldValue);
        }
        else {
            validator(validatedProperty, oldValue);
        }

        function validator(param, oldValue) {
            that._numericProcessor.validateMinMax(param === 'min' || initialValidation, param === 'max' || initialValidation);
            const value = that['_' + param + 'Object'];
            let validateCondition = param === 'min' ? that._numericProcessor.compare(that.max, value, true) <= 0 :
                that._numericProcessor.compare(that.min, value, true) > 0;

            if (validateCondition) {
                if (oldValue) {
                    that._numberRenderer = new Smart.Utilities.NumberRenderer(oldValue);
                    param === 'min' ? validateMin = false : validateMax = false;
                    that[param] = oldValue;
                    that['_' + param + 'Object'] = oldValue;
                }
                else {
                    that.error(that.localize('invalidMinOrMax', { elementType: that.nodeName.toLowerCase(), property: param }));
                }
            }
            else {
                that._numberRenderer = new Smart.Utilities.NumberRenderer(value);
                that[param] = that['_' + param + 'Object'];
            }
        }

        if (that.logarithmicScale) {
            that._validateOnLogarithmicScale(validateMin, validateMax, oldValue);
        }
        else {
            that._drawMin = that.min;
            that._drawMax = that.max;
        }

        that.min = that.min.toString();
        that.max = that.max.toString();

        that._minObject = that._numericProcessor.createDescriptor(that.min);
        that._maxObject = that._numericProcessor.createDescriptor(that.max);

        if (that.mode === 'date') {
            that._minDate = Smart.Utilities.DateTime.fromFullTimeStamp(that.min);
            that._maxDate = Smart.Utilities.DateTime.fromFullTimeStamp(that.max);
        }

        //Validates the Interval
        that._numericProcessor.validateInterval(that.interval);

        if (that.customInterval) {
            that._numericProcessor.validateCustomTicks();
        }

        that._setAriaValue('valueminmax');
    }

    /**
     * Calculates the tank's major and minor ticks interval.
     */
    _calculateTickInterval() {
        const that = this;
        let intervals = that._tickIntervalHandler.getInterval('linear', that._drawMin, that._drawMax, that.$.track, that.logarithmicScale);

        if (intervals.major !== that._majorTicksInterval) {
            that._intervalHasChanged = true;
            that._majorTicksInterval = intervals.major;
        }
        else {
            that._intervalHasChanged = true;
        }

        that._minorTicksInterval = intervals.minor;

        if (that.mode === 'date') {
            that._calculateDateInterval(intervals.major);
        }
    }

    /**
     * Calculates the tank's ticks when the scale is date.
     */
    _calculateDateInterval(majorTicksInterval) {
        const that = this,
            timeParts = {
                month: '2628000000000000000000000000000',
                day: '86400000000000000000000000000',
                hour: '3600000000000000000000000000',
                minute: '60000000000000000000000000',
                second: '1000000000000000000000000'
            };
        let part = 'year',
            bigNumberTimePart = new Smart.Utilities.BigNumber('31536000000000000000000000000000'),
            difference = bigNumberTimePart.subtract(majorTicksInterval).abs(),
            range = new Smart.Utilities.BigNumber(that.min).subtract(that.max).abs(),
            projectedNumberOfTicks = range.divide(majorTicksInterval).toString();

        if (projectedNumberOfTicks < 2) {
            majorTicksInterval = range.divide(3);
        }

        for (let timePart in timeParts) {
            if (timeParts.hasOwnProperty(timePart)) {
                const currentBigNumberTimePart = new Smart.Utilities.BigNumber(timeParts[timePart]),
                    currentDifference = currentBigNumberTimePart.subtract(majorTicksInterval).abs();

                if (currentDifference.compare(difference) === -1) {
                    part = timePart;
                    bigNumberTimePart = currentBigNumberTimePart;
                    difference = currentDifference;
                }
                else {
                    break;
                }
            }
        }

        if (part === 'second') {
            that._numberRenderer.numericValue = parseFloat(majorTicksInterval);

            if (that._numberRenderer.numericValue < 1000) {
                that._dateIncrementMethod = 'addYoctoseconds';
                that._dateIntervalNumber = 1;
                return;
            }

            let scientificPrefix = that._numberRenderer.toScientific(10);

            scientificPrefix = scientificPrefix.charAt(scientificPrefix.length - 1);

            that._dateIncrementMethod = that._unitToMethod[scientificPrefix];
            that._dateIntervalNumber = Math.pow(10, that._numericProcessor.prefixesToPowers[scientificPrefix]);
            return;
        }

        that._dateInterval = true;

        const calculatedInterval = !that.customInterval;
        let customTicks, numberOfTimeParts, toAdd;

        if (calculatedInterval) {
            customTicks = [new Smart.Utilities.BigNumber(that.min)];
            numberOfTimeParts = range.divide(bigNumberTimePart).toString();
            toAdd = Math.max(1, Math.floor(numberOfTimeParts / projectedNumberOfTicks));
        }

        switch (part) {
            case 'year':
                if (calculatedInterval) {
                    for (let i = that._minDate.year() + toAdd; i < that._maxDate.year(); i += toAdd) {
                        customTicks.push(new Smart.Utilities.BigNumber(new Smart.Utilities.DateTime(i, 1, 1).getTimeStamp()));
                    }
                }

                that._dateIncrementMethod = 'addYears';
                break;
            case 'month':
                if (calculatedInterval) {
                    for (let i = new Smart.Utilities.DateTime(that._minDate.year(), that._minDate.month() + toAdd, 1);
                        i.compare(that._maxDate) === -1; i.addMonths(toAdd, false)) {
                        customTicks.push(new Smart.Utilities.BigNumber(i.getTimeStamp()));
                    }
                }

                that._dateIncrementMethod = 'addMonths';
                break;
            case 'day':
                if (calculatedInterval) {
                    for (let i = new Smart.Utilities.DateTime(that._minDate.year(), that._minDate.month(), that._minDate.day() + toAdd);
                        i.compare(that._maxDate) === -1; i.addDays(toAdd, false)) {
                        customTicks.push(new Smart.Utilities.BigNumber(i.getTimeStamp()));
                    }
                }

                that._dateIncrementMethod = 'addDays';
                that._dateIntervalNumber = 86400000000000000000000000000;
                break;
            case 'hour':
                if (calculatedInterval) {
                    for (let i = new Smart.Utilities.DateTime(that._minDate.year(), that._minDate.month(), that._minDate.day(), that._minDate.hour() + toAdd);
                        i.compare(that._maxDate) === -1; i.addHours(toAdd, false)) {
                        customTicks.push(new Smart.Utilities.BigNumber(i.getTimeStamp()));
                    }
                }

                that._dateIncrementMethod = 'addHours';
                that._dateIntervalNumber = 3600000000000000000000000000;
                break;
            case 'minute':
                if (calculatedInterval) {
                    for (let i = new Smart.Utilities.DateTime(that._minDate.year(), that._minDate.month(), that._minDate.day(), that._minDate.hour(), that._minDate.minute() + toAdd);
                        i.compare(that._maxDate) === -1; i.addMinutes(toAdd, false)) {
                        customTicks.push(new Smart.Utilities.BigNumber(i.getTimeStamp()));
                    }
                }

                that._dateIncrementMethod = 'addMinutes';
                that._dateIntervalNumber = 60000000000000000000000000;
                break;
        }

        if (calculatedInterval) {
            if (customTicks[customTicks.length - 1].compare(that.max) === -1) {
                customTicks.push(new Smart.Utilities.BigNumber(that.max));
            }

            that.customTicks = customTicks;
        }
    }

    /**
     * Formats the value.
     */
    _formatNumber(value) {
        const that = this;

        if (that.mode === 'date') {
            const date = Smart.Utilities.DateTime.fromFullTimeStamp(value);

            return date.toString(that.dateLabelFormatString);
        }

        const numberRenderer = that._numberRenderer;
        let renderedNumber = parseFloat(value);

        numberRenderer.numericValue = value;

        if (that.scientificNotation) {
            renderedNumber = that._numberRenderer.toScientific(that.significantDigits, that.precisionDigits);
        }
        else {
            switch (that.scaleType) {
                case 'floatingPoint':
                    renderedNumber = that._applyDecimalSeparator(numberRenderer.toDigits(that.significantDigits, that.precisionDigits));
                    break;
                case 'integer':
                    renderedNumber = numberRenderer.isENotation(renderedNumber) ? Math.round(numberRenderer.largeExponentialToDecimal(renderedNumber)) : Math.round(renderedNumber);
                    renderedNumber = numberRenderer.toDigits(that.significantDigits, 0);
                    break;
            }
        }
        return renderedNumber;
    }

    /**
    * Applies formatting to tank labels.
    */
    _formatLabel(labelValue, unselectableUnit) {
        const that = this;
        let renderedLabel;

        if (that.labelFormatFunction) {
            if (that.mode === 'date') {
                labelValue = Smart.Utilities.DateTime.fromFullTimeStamp(labelValue);
            }

            renderedLabel = that.labelFormatFunction(labelValue);

            if (renderedLabel !== undefined && renderedLabel !== '') {
                return renderedLabel;
            }
        }

        renderedLabel = that._formatNumber(labelValue);
        that._numberRenderer = new Smart.Utilities.NumberRenderer(renderedLabel);
        if (that.showUnit) {
            if (unselectableUnit !== false) {
                renderedLabel += ' <span class="smart-unselectable">' + that.unit + '</span>';
            }
            else {
                renderedLabel += ' ' + that.unit;
            }
        }
        return renderedLabel;
    }

    /**
     * Applies necessary paddings to the track container.
     */
    _layout() {
        const that = this,
            containerStyle = that.$.container.style,
            paddingStart = that._tickIntervalHandler.labelsSize.minLabelSize / 2 + 'px',
            paddingEnd = that._tickIntervalHandler.labelsSize.maxLabelSize / 2 + 'px';

        switch (that.orientation) {
            case 'horizontal':
                if (that.scalePosition === 'none') {
                    containerStyle.paddingLeft = '';
                    containerStyle.paddingRight = '';
                    break;
                }
                if ((!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
                    containerStyle.paddingLeft = paddingStart;
                    containerStyle.paddingRight = paddingEnd;
                }
                else {
                    containerStyle.paddingLeft = paddingEnd;
                    containerStyle.paddingRight = paddingStart;
                }
                break;
            case 'vertical':
                if (that.scalePosition === 'none') {
                    containerStyle.paddingTop = '';
                    containerStyle.paddingBottom = '';
                    break;
                }
                if (!that.inverted) {
                    containerStyle.paddingBottom = paddingStart;
                    containerStyle.paddingTop = paddingEnd;
                }
                else {
                    containerStyle.paddingBottom = paddingEnd;
                    containerStyle.paddingTop = paddingStart;
                }
                break;
        }
        that._measurements.trackLength = that.$.track[this._settings.clientSize];
    }

    /**
     * Track click event handler.
     */
    _trackDownHandler(event) {
        const that = this;

        if (that.disabled || that.readonly || (!Smart.Utilities.Core.isMobile && event.button !== 0)) {
            return;
        }

        if (that.mechanicalAction === 'switchUntilReleased') {
            that._cachedValue = {};
            that._cachedValue._number = that._number;
            that._cachedValue._drawValue = that._drawValue;
            that._cachedValue.value = that.value;

            if (that._valueDate) {
                that._cachedValue._valueDate = that._valueDate;
            }
        }

        that._getTrackStartAndEnd();
        that._moveThumbBasedOnCoordinates(event, true, that.mechanicalAction !== 'switchWhenReleased');
        that._thumbDragged = true;
        that.$track.addClass('smart-dragged');

        if (that.showTooltip) {
            that.$tooltip.removeClass('smart-hidden');
        }
    }

    /**
     * Track mousemove event handler.
     */
    _trackMoveHandler(event) {
        if (event.originalEvent.type === 'touchmove') {
            event.originalEvent.preventDefault();
        }
    }

    /**
     * Document mousemove event handler.
     */
    _documentMoveHandler(event) {
        const that = this;

        if (that._thumbDragged) {
            event.originalEvent.preventDefault();
            that._moveThumbBasedOnCoordinates(event, true, that.mechanicalAction !== 'switchWhenReleased');
            that.$fill.addClass('disable-animation');
        }
    }

    /**
     * Document mouseup event handler.
     */
    _documentUpHandler(event) {
        const that = this;

        if (!that._thumbDragged) {
            return;
        }

        if (that.mechanicalAction === 'switchWhenReleased') {
            that._moveThumbBasedOnCoordinates(event, true, true);
        }
        else if (that.mechanicalAction === 'switchUntilReleased') {
            if (that._numericProcessor.compare(that._number, that._cachedValue._number)) {
                const oldValue = that._getEventValue();

                that._number = that._cachedValue._number;
                that._drawValue = that._cachedValue._drawValue;

                if (that._cachedValue._valueDate) {
                    that._valueDate = that._cachedValue._valueDate;
                }

                that.value = that._cachedValue.value;

                that._moveThumbBasedOnValue(that._drawValue);

                const value = that._getEventValue();

                that.$.fireEvent('change', { 'value': value, 'oldValue': oldValue });
                that.$.hiddenInput.value = value;
                that._setAriaValue('valuenow');
            }
        }

        if (that.showTooltip) {
            that.$tooltip.addClass('smart-hidden');
        }

        that._thumbDragged = false;
        that.$track.removeClass('smart-dragged');
        that.$fill.removeClass('disable-animation');
    }

    /**
     * Document select start handler.
     */
    _selectStartHandler(event) {
        const that = this;

        if (that._thumbDragged) {
            event.preventDefault();
        }
    }

    /**
     * Tank resize event handler.
     */
    _resizeHandler() {
        const that = this;

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }
        else if (that._renderingSuspended) {
            that._createElement();
            return;
        }

        if (that._renderingSuspended) {
            return;
        }

        if (that._orientationChanged !== true) {
            that._setTicksAndInterval();
            that._moveThumbBasedOnValue(that._drawValue);
        }

        //Needed for getOptimalSize method
        if (that._trackChanged) {
            that._measurements.trackLength = that.$.track[this._settings.clientSize];
            that._setTicksAndInterval();
            that._moveThumbBasedOnValue(that._drawValue);
        }

        that._setTrackSize();
        delete that._orientationChanged;
        delete that._trackChanged;
    }

    /**
     * Moves the tank's thumb and updates the filled part of the track based on the position of the mouse.
     */
    _moveThumbBasedOnCoordinates(event, checkBoundaries, changeValue) {
        const that = this;
        let coordinate = checkBoundaries ? Math.min(Math.max(event[that._settings.page], that._trackStart), that._trackEnd) : event[that._settings.page],
            value = that._numericProcessor.pxToValue(coordinate);

        if (that.logarithmicScale) {
            that._drawValue = Math.log10(value);
            value = that._numericProcessor.getCoercedValue(that._drawValue);
        }
        else {
            that._drawValue = value;
            value = that._numericProcessor.getCoercedValue(value);
        }

        // Validating the coordinate
        coordinate = Math.min(Math.max(that._numericProcessor.valueToPx(value) + that._trackStart, that._trackStart), that._trackEnd);

        const size = coordinate - that._trackStart;

        that.updateFillSizeAndPosition(size, that._settings.margin, value, true, changeValue);

        if (event.originalEvent) {
            event.originalEvent.stopPropagation();
        }
    }

    /**
     * Moves the tank's thumb and updates the filled part of the track based on a passed value.
     */
    _moveThumbBasedOnValue(value) {
        const that = this,
            px = that._numericProcessor.valueToPx(that._numericProcessor.getCoercedValue(value));

        that.updateFillSizeAndPosition(px, that._settings.margin, value, true);
    }

    /**
    * Applies the filling, updates the tooltip and the value
    */
    updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
        const that = this,
            fillStyle = that.$.fill.style;

        if (that._normalLayout) {
            fillStyle[that._settings.dimension] = size + 'px';
        }
        else {
            fillStyle[that._settings.dimension] = Math.min(that._measurements.trackLength, Math.max(0, (that._measurements.trackLength - size))) + 'px';
            fillStyle[margin] = size + 'px';
        }

        if (updateTooltip) {
            const oldValue = that.value;

            delete that._valueBeforeCoercion;
            that._numericProcessor.updateToolTipAndValue(newValue, oldValue, changeValue);
        }
    }

    /**
    * Sets tooltip's value.
    */
    _updateTooltipValue(value) {
        const that = this;

        if (value === undefined) {
            value = that.value;
        }

        if (that.logarithmicScale) {
            value = Math.pow(10, value.toString());
        }

        value = that._formatLabel(value);
        that.$.tooltipContent.innerHTML = value;
        that.$.thumbLabel.innerHTML = value;
    }

    /**
    * Returns the optimal size, based on tank settings.
    **/
    _getSize(largestLabelSize, properties) {
        const that = this,
            tankStyle = window.getComputedStyle(that),
            trackStyle = window.getComputedStyle(that.$.track),
            trackSize = that._trackSize + parseFloat(trackStyle[properties.marginA]) + parseFloat(trackStyle[properties.marginB]);
        let firstLabel, lastLabel, optimalSize, optimalOtherSize;

        function calcScaleSize(selector, distance) {
            const labels = selector.getElementsByClassName('smart-label');

            firstLabel = labels[0];
            lastLabel = labels[labels.length - 1];

            const firstLabelStyle = window.getComputedStyle(labels[0])[distance];

            optimalSize += parseFloat(firstLabelStyle);
        }

        optimalSize = trackSize;
        switch (that.scalePosition) {
            case 'none':
                optimalSize += parseFloat(tankStyle[properties.paddingA]) + parseFloat(tankStyle[properties.paddingB]);
                if (typeof (that._tankSizeBeforeOrientation) !== 'undefined') {
                    optimalOtherSize = that.orientation === 'horizontal' ? that._tankSizeBeforeOrientation.height : that._tankSizeBeforeOrientation.width;
                }
                else {
                    optimalOtherSize = that.orientation === 'horizontal' ? parseFloat(trackStyle.width) : parseFloat(trackStyle.height);
                }
                if (that._trackChanged !== true) {
                    that._trackChanged = true;
                }

                return { optimalSize: optimalSize, optimalOtherSize: optimalOtherSize };
            case 'near':
                optimalSize += largestLabelSize;
                calcScaleSize(that.$.scaleNear, properties.nearScaleDistance);
                break;
            case 'far':
                optimalSize += largestLabelSize;
                calcScaleSize(that.$.scaleFar, properties.farScaleDistance);
                break;
            case 'both':
                optimalSize += 2 * largestLabelSize;
                calcScaleSize(that.$.scaleNear, properties.nearScaleDistance);
                calcScaleSize(that.$.scaleFar, properties.farScaleDistance);
                break
        }

        let firstRect, lastRect, difference;

        optimalSize += parseFloat(tankStyle[properties.paddingA]) + parseFloat(tankStyle[properties.paddingB]);
        firstRect = firstLabel.getBoundingClientRect();
        lastRect = lastLabel.getBoundingClientRect();

        optimalOtherSize = that[properties.offset];

        difference = firstRect[properties.distance] + firstLabel[properties.offset] - lastRect[properties.distance];
        if (difference > 0) {
            optimalOtherSize = firstLabel[properties.offset] + lastLabel[properties.offset];
        }

        return { optimalSize: optimalSize, optimalOtherSize: optimalOtherSize };
    }

    /**
     * Calculates the tank's current value range.
     */
    _getRange() {
        const that = this;

        if (that.logarithmicScale) {
            that._range = that._drawMax - that._drawMin;
            return;
        }

        if (that.scaleType === 'floatingPoint') {
            that._range = (that._drawMax - that._drawMin).toString();
        }
        else {
            that._range = new Smart.Utilities.BigNumber(that._drawMax).subtract(that._drawMin).toString();
        }
    }

    /**
     * Gets the coordinates of the track and the value per pixel ratio.
     */
    _getTrackStartAndEnd() {
        const that = this;
        let trackStart,
            offset = that.$.track.getBoundingClientRect();

        if (that.orientation === 'horizontal') {
            const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            trackStart = offset.left + scrollLeft;
        }
        else {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            trackStart = offset.top + scrollTop;
        }

        const trackEnd = trackStart + that._measurements.trackLength,
            pxRange = trackEnd - trackStart;

        that._trackStart = trackStart;
        that._trackEnd = trackEnd;
        that._valuePerPx = that._numericProcessor.getValuePerPx(that._range, pxRange);
    }

    /**
    * Update scale's width.
    */
    _updateScaleWidth(longestLabelSize) {
        const that = this;
        let scaleCoeficient = that.ticksPosition === 'track' ? 4 : 12;

        switch (that.labelsVisibility) {
            case 'all':
                longestLabelSize = that._numericProcessor._longestLabelSize
                break;
            case 'endPoints':
                longestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
                break;
            case 'none':
                longestLabelSize = 0;
                break;
        }

        let scaleSize = scaleCoeficient + longestLabelSize,
            trackComputedStyle = window.getComputedStyle(that.$.track),
            variablesUsed = Boolean(trackComputedStyle.getPropertyValue('--smart-tank-scale-size'));

        if (variablesUsed) {
            that.$.container.style.setProperty('--smart-tank-scale-size', scaleSize + 'px');
        }
        else {
            const computedStyles = window.getComputedStyle(that),
                scaleNearStyle = that.$.scaleNear.style,
                scaleFarStyle = that.$.scaleFar.style,
                trackStyle = that.$.track.style,
                trackMinWidth = parseFloat(trackComputedStyle.getPropertyValue('min-width'));
            let dimension,
                dimension2,
                dimensionValue,
                margins,
                outlineWidth = parseFloat(trackComputedStyle.getPropertyValue('outline-width')) || 0,
                outlineOffset = parseFloat(trackComputedStyle.getPropertyValue('outline-offset')) || 0,
                outline = outlineWidth + outlineOffset,
                paddings;

            switch (that.orientation) {
                case 'horizontal':
                    dimension = 'height';
                    dimension2 = 'width';
                    dimensionValue = that.offsetHeight;
                    paddings = parseFloat(computedStyles.getPropertyValue('padding-top')) + parseFloat(computedStyles.getPropertyValue('padding-bottom'));
                    margins = parseFloat(trackComputedStyle.getPropertyValue('margin-top')) + parseFloat(trackComputedStyle.getPropertyValue('margin-bottom'));
                    break;
                case 'vertical':
                    dimension = 'width';
                    dimension2 = 'height';
                    dimensionValue = that.offsetWidth;
                    paddings = parseFloat(computedStyles.getPropertyValue('padding-left')) + parseFloat(computedStyles.getPropertyValue('padding-right'));
                    margins = parseFloat(trackComputedStyle.getPropertyValue('margin-left')) + parseFloat(trackComputedStyle.getPropertyValue('margin-right'));
                    break;
            }
            switch (that.scalePosition) {
                case 'near':
                    scaleNearStyle.setProperty(dimension, scaleSize + 'px');
                    trackStyle.setProperty(dimension, Math.max(isNaN ? 0 : trackMinWidth, dimensionValue - paddings - scaleSize - 4 - margins - outline) + 'px');
                    break;
                case 'far':
                    scaleFarStyle.setProperty(dimension, scaleSize + 'px');
                    trackStyle.setProperty(dimension, Math.max(isNaN ? 0 : trackMinWidth, dimensionValue - paddings - scaleSize - 4 - margins - outline) + 'px');
                    break;
                case 'both':
                    scaleNearStyle.setProperty(dimension, scaleSize + 'px');
                    scaleFarStyle.setProperty(dimension, scaleSize + 'px');
                    trackStyle.setProperty(dimension, Math.max(isNaN ? 0 : trackMinWidth, dimensionValue - paddings - 2 * scaleSize - 4 - margins - outline) + 'px');
                    break;
                case 'none':
                    trackStyle.setProperty(dimension, '');
                    break;
            }

            trackStyle.setProperty(dimension2, '100%');
            scaleNearStyle.setProperty(dimension2, '100%');
            scaleFarStyle.setProperty(dimension2, '100%');
        }
    }

    /**
     * Appends ticks and labels to the scales.
     */
    _appendTicksAndLabelsToScales(ticks, labels) {
        const that = this;

        function applyTicksAndLabels(scaleElement) {
            scaleElement.innerHTML = labels;

            if (that.ticksPosition === 'scale')
                scaleElement.innerHTML += ticks;
        }

        switch (that.scalePosition) {
            case 'near':
                applyTicksAndLabels(that.$.scaleNear);
                break;
            case 'far':
                applyTicksAndLabels(that.$.scaleFar);
                break;
            case 'both':
                applyTicksAndLabels(that.$.scaleNear);
                applyTicksAndLabels(that.$.scaleFar);
                break;
        }

        if (that.ticksPosition === 'track') {
            that.$.trackTicksContainer.innerHTML = ticks;
        }
    }

    /**
     * Replaces a custom decimal separator with the default one.
     */
    _discardDecimalSeparator(value, separator) {
        const that = this;

        if (separator === undefined) {
            separator = that.decimalSeparator;
        }

        if (separator !== '.') {
            let decimalSeparatorRegExp = new RegExp(separator, 'g');
            return typeof value === 'string' ? value.replace(decimalSeparatorRegExp, '.') : value.toString().replace(decimalSeparatorRegExp, '.');
        }
        else {
            return value;
        }
    }

    /**
    * Applies a custom decimal separator.
    */
    _applyDecimalSeparator(value) {
        const that = this;

        if (typeof value !== 'string') {
            value = value.toString();
        }

        if (that.decimalSeparator !== '.') {
            value = value.replace(/\./g, that.decimalSeparator);
        }

        return value;
    }

    /**
     * Validates the value of the Tank.
     */
    _validate(initialValidation, programmaticValue, coerced, programmaticValueIsSet) {
        const that = this;
        let value;

        that._programmaticValueIsSet = programmaticValueIsSet && that.validation === 'interaction';

        if (initialValidation) {
            value = that.value;
        }
        else {
            value = programmaticValue;
        }

        let actualValue, validNumber;

        if (coerced !== true && that.coerce) {
            actualValue = that._numericProcessor.createDescriptor(value, true, true, true);
            actualValue = that.logarithmicScale ? Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(actualValue))) : that._numericProcessor.getCoercedValue(actualValue);
            validNumber = actualValue;
        }
        else if (that.validation === 'strict' || !initialValidation && !that._programmaticValueIsSet) {
            actualValue = that._numericProcessor.createDescriptor(value, true, true, true);
            validNumber = actualValue;
        }
        else {
            actualValue = that._numericProcessor.createDescriptor(value, true, true, false);
            validNumber = that._numericProcessor.validate(actualValue, that._minObject, that._maxObject);
        }

        if (that._numericProcessor.regexScientificNotation.test(validNumber)) {
            validNumber = that._numericProcessor.scientificToDecimal(validNumber);
        }

        validNumber = that._discardDecimalSeparator(validNumber, that.decimalSeparator);

        if (initialValidation) {
            that._number = validNumber;
            that._drawValue = that.logarithmicScale ? Math.log10(validNumber) : validNumber;

            if (that.mode === 'numeric') {
                that.value = actualValue.toString();
            }
            else {
                that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(actualValue);
                that.value = actualValue;
            }

            delete that._valueBeforeCoercion;
            that._moveThumbBasedOnValue(that._drawValue);
        }
        else {
            that._numericProcessor.updateValue(actualValue);
        }

        that._programmaticValueIsSet = false;
    }

    /**
     * Changes the input format.
     */
    _changeScaleType() {
        const that = this;

        that._numericProcessor = new Smart.Utilities.NumericProcessor(that, 'scaleType');

        that._validateMinMax('both');

        that._setTicksAndInterval();
        that._scaleTypeChangedFlag = true;
        that._validate(true, that._number.toString());
        that._scaleTypeChangedFlag = false;
    }

    /**
    * Sets new Ticks and Interval 
    */
    _setTicksAndInterval() {
        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        //Set the New Format here
        let minLabel = that._formatLabel(that.min),
            maxLabel = that._formatLabel(that.max);

        //gets the range with the new min/max
        that._getRange();

        //creates a new tickIntervalHandler instance
        that._tickIntervalHandler = new Smart.Utilities.TickIntervalHandler(that, minLabel, maxLabel, 'smart-label', that._settings.size, that.scaleType === 'integer', that.logarithmicScale);

        //re-arranges the layout
        that._layout();

        if (!that.customInterval) {
            // calculates the tickInterval
            that._calculateTickInterval();

            if (that._dateInterval) {
                that._intervalHasChanged = true;
                that._numericProcessor.addCustomTicks();
            }
            else {
                // Add the ticks and labels
                that._numericProcessor.addTicksAndLabels();
            }
        }
        else {
            if (that.mode === 'date') {
                that._calculateTickInterval()
            }

            // custom ticks
            that._intervalHasChanged = true;
            that._numericProcessor.addCustomTicks();
        }
    }

    /**
    * Sets tab index 
    */
    _setFocusable() {
        const that = this;

        if (that.disabled || that.unfocusable) {
            that.removeAttribute('tabindex');
            return;
        }

        that.tabIndex = that.tabIndex > 0 ? that.tabIndex : 0;
    }

    /**
     * Increments or decrements a value when a key is pressed.
     */
    _keyIncrementDecrement(action, preValue) {
        const that = this,
            actionCoefficient = action === 'add' ? 1 : -1,
            calculatePreValue = preValue === undefined;

        if (calculatePreValue) {
            preValue = that.logarithmicScale ? new Smart.Utilities.BigNumber(that._drawValue) : that._drawValue;
        }

        if (that.customInterval && that.coerce) {
            if (calculatePreValue) {
                if (that.logarithmicScale) {
                    preValue = that.value;
                }

                if (that.mode === 'numeric') {
                    preValue = preValue.toString();
                }
            }

            let possibleValues, index;

            if (that.mode === 'numeric') {
                possibleValues = that.customTicks.indexOf(that.min) !== -1 ? that.customTicks.slice(0) : [that.min].concat(that.customTicks);
                index = possibleValues.indexOf(preValue);
            }
            else {
                possibleValues = that.customTicks.findIndex(function (element) {
                    return element.compare(that._drawMin) === 0;
                }) !== -1 ?
                    that.customTicks.slice(0) : [that._drawMin].concat(that.customTicks);

                index = possibleValues.findIndex(function (element) {
                    return element.compare(preValue) === 0;
                });
            }

            const adjacent = possibleValues[index + 1 * actionCoefficient];

            if (adjacent !== undefined) {
                return adjacent;
            }
            else if (preValue === that.max && action === 'subtract') {
                return possibleValues[possibleValues.length - 2];
            }

            return preValue;
        }

        if (that.mode === 'numeric') {
            let newValue = that._numericProcessor.incrementDecrement(preValue, action, that._validInterval);
            if (that.logarithmicScale) {
                that._drawValue = newValue;
                newValue = Math.pow(10, Math.round(newValue));
            }
            return newValue;
        }

        if (that.validation === 'interaction' &&
            (that._valueDate.compare(that._minDate) === -1 ||
                that._valueDate.compare(that._maxDate) === 1)) {
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(that._drawValue);
        }

        that._valueDate[that._dateIncrementMethod](actionCoefficient * parseFloat(that.interval), false);
        that._drawValue = new Smart.Utilities.BigNumber(that._valueDate.getTimeStamp());

        if (that._drawValue.compare(that._drawMin) === -1) {
            that._drawValue = new Smart.Utilities.BigNumber(that._drawMin);
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(that._drawValue);
        }

        if (that._drawValue.compare(that._drawMax) === 1) {
            that._drawValue = new Smart.Utilities.BigNumber(that._drawMax);
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(that._drawValue);
        }

        return that._drawValue;
    }

    /**
    * Tank keydown event handler. Changes the value when user press an arrow, home or end key.
    */
    _keydownHandler(event) {
        const that = this;

        if ((that.disabled) || (that.readonly)) {
            return;
        }

        const keyCode = !event.charCode ? event.which : event.charCode,
            handledKeyCodes = [35, 36, 37, 38, 39, 40];

        if (handledKeyCodes.indexOf(keyCode) === -1) {
            return;
        }

        const isIncrementKey = [35, 38, 39].indexOf(keyCode) > -1,
            isDecrementKey = [36, 37, 40].indexOf(keyCode) > -1;

        event.preventDefault();

        if (that.scaleType === 'floatingPoint') {
            if ((parseFloat(that.value) <= parseFloat(that.min)) && isDecrementKey || (parseFloat(that.value) >= parseFloat(that.max)) && isIncrementKey) {
                return;
            }
        }
        else {
            let testValue = new Smart.Utilities.BigNumber(that._drawValue);

            if ((testValue.compare(that._drawMin) !== 1) && isDecrementKey || (testValue.compare(that._drawMax) !== -1) && isIncrementKey) {
                return;
            }
        }

        let newValue;

        switch (keyCode) {
            case 40:    //down arrow
            case 37:    //left arrow
                newValue = that._keyIncrementDecrement('subtract');
                break;
            case 38:    //top arrow
            case 39:    //right arrow
                newValue = that._keyIncrementDecrement('add');
                break;
            case 36:    //home
                that._drawValue = that._drawMin;
                newValue = that.min;
                break;
            case 35:    //end
                that._drawValue = that._drawMax;
                newValue = that.max;
                break;
        }

        that._validate(false, newValue, keyCode);

        return false;
    }

    /**
    * Sets internal variables, used about scale drawing and preserving the value from initial validation
    **/
    _setDrawVariables() {
        const that = this;

        if (that.logarithmicScale) {
            that._drawValue = Math.log10(that.value);
            that._drawMin = Math.log10(that.min);
            that._drawMax = Math.log10(that.max);
        }
        else {
            that._drawValue = that.value;
            that._drawMin = that.min;
            that._drawMax = that.max;
        }
    }

    /**
    * validates values when is used logarithmic scale
    **/
    _validateOnLogarithmicScale(validateMin, validateMax) {
        const that = this;

        function findNearestPowerOfTen(value) {
            return Math.pow(10, Math.round(Math.log10(value) - Math.log10(5.5) + 0.5));
        }

        if (validateMin) {
            if (that.min <= 0) {
                that.min = 1;
                that._drawMin = 0;
            }
            else if (Math.log10(that.min) % 1 !== 0) {
                let nearestPowerOfTen = findNearestPowerOfTen(parseFloat(that.min));
                if (nearestPowerOfTen > that.min) {
                    nearestPowerOfTen /= 10;
                }
                that._drawMin = Math.log10(that.min);
            }
            else {
                that._drawMin = Math.log10(that.min);
            }
        }

        if (validateMax) {
            if (that.max <= 0) {
                that.max = 1;
                that._drawMax = 0;
            }
            else if (Math.log10(that.max) % 1 !== 0) {
                let nearestPowerOfTen = findNearestPowerOfTen(parseFloat(that.max));
                if (nearestPowerOfTen < that.max) {
                    nearestPowerOfTen *= 10;
                }
                that._drawMax = Math.log10(that.max);
            }
            else {
                that._drawMax = Math.log10(that.max);
            }
        }

        if (that.scaleType === 'integer') {
            if (that._drawMin < 0) {
                that._drawMin = 0;
                that.min = 1;
            }

            if (that._drawMax < 0) {
                that._drawMax = 1;
                that.max = 10;
            }
        }

        if (that._drawMax === that._drawMin) {
            that._drawMax = that._drawMin + 1;
        }
    }

    /**
     * Sets the internal property "_normalLayout" based on the properties "orientation" and "inverted".
     */
    _getLayoutType() {
        const that = this,
            orientation = that.orientation,
            inverted = that.inverted,
            rightToLeft = that.rightToLeft;

        that._normalLayout = orientation === 'horizontal' && ((!inverted && !rightToLeft) || (rightToLeft && inverted)) ||
            orientation === 'vertical' && inverted;
    }

    /**
     * Applies a CSS class to change fill's pointer. Used instead of :hover CSS selector.
    **/
    _trackOnMouseEnterHandler() {
        const that = this;

        if (!that.readonly && !that.disabled) {
            that.$track.addClass('track-hovered');
            that.$.track.setAttribute('hover', '');
        }
    }

    /**
     * Removes the CSS class used to change fill's pointer.
    **/
    _trackOnMouseLeaveHandler() {
        const that = this;

        if (!that.readonly && !that.disabled) {
            that.$track.removeClass('track-hovered');
            that.$.track.removeAttribute('hover');
        }
    }

    /**
     * Checks if the element is visible.
     */
    _isVisible() {
        const that = this;

        return !!(that.offsetWidth || that.offsetHeight || that.getClientRects().length);
    }

    /**
     * Coerces the value when changes to custom interval-related settings are made.
     */
    _coerceCustomInterval() {
        const that = this;

        if (!that.coerce) {
            return;
        }

        const valueBeforeCoercion = that._valueBeforeCoercion,
            newCoercedValue = that.logarithmicScale ? Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(that.value))) : that._numericProcessor.getCoercedValue(that.value);

        that._validate(false, newCoercedValue, true, true);
        that._valueBeforeCoercion = valueBeforeCoercion;
    }

    /**
     * Handles date scale.
     */
    _handleDateScale() {
        const that = this,
            dateTime = Smart.Utilities.DateTime;

        if (!dateTime) {
            that.error(that.localize('missingReference', { elementType: that.nodeName.toLowerCase(), files: 'smart.date.js' }));
        }

        that._customTicks = that.customTicks;

        that._unitToMethod = {
            'Y': 'addSeconds', 'Z': 'addMilliseconds', 'E': 'addMicroseconds', 'P': 'addNanoseconds', 'T': 'addPicoseconds', 'G': 'addFemtoseconds', 'M': 'addAttoseconds', 'k': 'addZeptoseconds'
        };

        that._minDate = dateTime.validateDate(that.min);
        that.min = that._minDate.getTimeStamp();
        that._maxDate = dateTime.validateDate(that.max);
        that.max = that._maxDate.getTimeStamp();

        if (!that.rangeSlider) {
            that._valueDate = dateTime.validateDate(that.value);
            that.value = that._valueDate.getTimeStamp();
        }

        that._properties.min.serialize = '_serializeMin';
        that._properties.max.serialize = '_serializeMax';
        that._properties.value.serialize = '_serializeValue';

        that.scaleType = 'integer';
        that.logarithmicScale = false;
        that.wordLength = 'uint64';

        const propertiesToRedefine = ['min', 'max', 'value'];

        for (let i = 0; i < propertiesToRedefine.length; i++) {
            const propertyName = propertiesToRedefine[i];

            Object.defineProperty(that, propertyName, {
                get: function () {
                    if (that.context === that) {
                        return that.properties[propertyName].value;
                    }
                    else {
                        return that['_' + propertyName + 'Date'];
                    }
                },
                set(value) {
                    that.updateProperty(that, that._properties[propertyName], value);
                }
            });
        }

        that._getEventValue = function (aria) {
            if (aria) {
                that.setAttribute('aria-valuetext', that._valueDate.toString('f'));
                return that.value.toString();
            }

            return that._valueDate.clone();
        };
    }

    /**
     * Serializes "min".
     */
    _serializeMin() {
        return this._minDate.toString();
    }

    /**
     * Serializes "max".
     */
    _serializeMax() {
        return this._maxDate.toString();
    }

    /**
     * Serializes "value".
     */
    _serializeValue() {
        return this._valueDate.toString();
    }

    /**
     * Redefines property getter and setter.
     */
    _redefineProperty(propertyName) {
        const that = this;

        Object.defineProperty(that, propertyName, {
            get: function () {
                return that.properties[propertyName].value;
            },
            set(value) {
                function replacer(key, value) {
                    if (value instanceof Smart.Utilities.BigNumber) {
                        return value.toString();
                    }

                    return value;
                }

                const oldValue = that.properties[propertyName].value,
                    stringifiedOldValue = JSON.stringify(oldValue, replacer),
                    stringifiedValue = JSON.stringify(value, replacer);

                if (stringifiedOldValue === stringifiedValue) {
                    return;
                }

                that.properties[propertyName].value = value;

                if (that.isReady && (!that.ownerElement || (that.ownerElement && that.ownerElement.isReady)) && that.context !== that) {
                    const context = that.context;

                    that.context = that;
                    that.propertyChangedHandler(propertyName, oldValue, value);
                    that.context = context;
                }
            }
        });
    }

    /**
     * Sets the aria-valuemax, aria-valuemin, aria-valuenow, and aria-valuetext properties.
     */
    _setAriaValue(property) {
        const that = this;

        if (property === 'valuenow') {
            that.setAttribute('aria-valuenow', that._getEventValue(true));
        }
        else {
            that.setAttribute('aria-valuemin', that.min.toString());
            that.setAttribute('aria-valuemax', that.max.toString());
        }
    }
});
