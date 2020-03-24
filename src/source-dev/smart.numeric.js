
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * A class for instantiating a number processor object.
 */
Smart.Utilities.Assign('NumericProcessor', class NumericProcessor {
    constructor(context, numericFormatProperty) {
        switch (context[numericFormatProperty]) {
            case 'integer':
                return new Smart.Utilities.IntegerNumericProcessor(context, numericFormatProperty);
            case 'floatingPoint':
                return new Smart.Utilities.DecimalNumericProcessor(context, numericFormatProperty);
            case 'complex':
                return new Smart.Utilities.ComplexNumericProcessor(context, numericFormatProperty);
        }
    }
});

/**
 * A base class for processesing numbers.
 */
Smart.Utilities.Assign('BaseNumericProcessor', class BaseNumericProcessor {
    constructor(context, numericFormatProperty) {
        const that = this;

        that.context = context;
        that._longestLabelSize = 0;
        that.numericFormatProperty = numericFormatProperty;
        that.regexScientificNotation = new RegExp(/^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)(Y|Z|E|P|T|G|M|k|m|u|n|p|f|a|z|y){1}$/); // regular expressions for scientific notation
        that.regexNoLeadingZero = new RegExp(/^(-)?[.]\d+$/);
        that.regexLeadingZero = new RegExp(/^[+\-]?(0+)[1-9]+|^[+\-]?(0{2,})[.]|^(0{2,})$/);
        that.prefixesToPowers = { 'Y': 24, 'Z': 21, 'E': 18, 'P': 15, 'T': 12, 'G': 9, 'M': 6, 'k': 3, 'm': -3, 'u': -6, 'n': -9, 'p': -12, 'f': -15, 'a': -18, 'z': -21, 'y': -24 };

        if (window.NIComplex) {
            that.complexConstructor = window.NIComplex;
        }
        else {
            that.complexConstructor = Smart.Utilities.Complex;
        }
    }

    prepareForValidation(initialValidation, programmaticValue, value) {
        const that = this.context,
            initialOrProgrammatic = initialValidation || programmaticValue !== undefined;

        value = value.toString();
        value = value.replace(/\s/g, '');
        value = that._discardDecimalSeparator(value);

        if (this.regexLeadingZero.test(value)) {
            const testResult = this.regexLeadingZero.exec(value);

            if (testResult[1]) {
                value = value.replace(testResult[1], '');
            }
            else if (testResult[2]) {
                value = value.replace(testResult[2], '0');
            }
            else {
                value = value.replace(testResult[3], '0');
            }
        }

        if (this.regexNoLeadingZero.test(value)) {
            if (value.charAt(0) === '-') {
                value = '-0' + value.slice(1);
            }
            else {
                value = '0' + value;
            }
        }
        else if ((that[this.numericFormatProperty] === 'integer' && (that._radixNumber === 10 || initialOrProgrammatic) || that[this.numericFormatProperty] === 'floatingPoint') && this.regexScientificNotation.test(value)) { // scientific notation test
            value = this.scientificToDecimal(value);
        }

        let complexNumberIsEntered = false,
            enteredComplexNumber;

        if (that[this.numericFormatProperty] === 'complex' && that._regexSpecial.nonNumericValue.test(value) === false) {
            try {
                if (that._regexSpecial.exaValue.test(value)) {
                    // handles ambiguous "exa" case
                    const indexOfExa = value.indexOf('E'),
                        realPart = parseFloat(value.slice(0, indexOfExa)) * Math.pow(10, 18),
                        imaginaryPart = parseFloat(value.slice(indexOfExa + 1, -1));

                    enteredComplexNumber = new this.complexConstructor(realPart, imaginaryPart);
                }
                else {
                    enteredComplexNumber = new this.complexConstructor(value);
                }
                complexNumberIsEntered = true;
            }
            catch (error) {
                complexNumberIsEntered = false;
            }
        }

        // if the entered value is not a number
        if (complexNumberIsEntered === false &&
            (!initialOrProgrammatic && that._regex[that._radixNumber].test(value) === false ||
                initialOrProgrammatic && that._regex[10].test(value) === false)) {
            that._handleNonNumericValue(initialValidation, programmaticValue, value);
            return;
        }

        return { value: value, enteredComplexNumber: enteredComplexNumber };
    }

    /**
     * Checks if a number is in exponential notation.
     */
    isENotation(value) {
        const eNotationRegex = new RegExp(/e/i);

        return eNotationRegex.test(value.toString());
    }

    /**
     * Converts a number in scientific notation to a plain number.
     */
    scientificToDecimal(scientificValue) {
        const parts = this.regexScientificNotation.exec(scientificValue),
            numericPart = parts[1],
            prefix = parts[2],
            number = parseFloat(numericPart) * (Math.pow(10, this.prefixesToPowers[prefix]));

        return number;
    }

    /**
     * Creates a label dummy element.
     */
    _createMeasureLabel() {
        const context = this.context,
            measureLabel = document.createElement('div');

        measureLabel.className = 'smart-label';
        measureLabel.style.position = 'absolute';
        measureLabel.style.visibility = 'hidden';
        if (context.scalePosition !== 'far') {
            context._measureLabelScale = context.$.scaleNear;
        }
        else {
            context._measureLabelScale = context.$.scaleFar;
        }
        context._measureLabelScale.appendChild(measureLabel);

        return measureLabel;
    }

    /**
     * Adds a major tick and its respective label.
     */
    _addMajorTickAndLabel(htmlValue, labelSize, plot, value, middle) {
        const that = this.context,
            leftOrTop = that._settings.leftOrTop,
            offset = this.valueToPx(value);

        let currentTick = '',
            currentLabel = '';

        if (parseInt(offset) > parseInt(that._measurements.trackLength)) {
            return { tick: currentTick, label: currentLabel };
        }

        if (that.logarithmicScale) {
            htmlValue = that._formatLabel(Math.pow(10, value));
        }

        if (that.nodeName.toLowerCase() === 'smart-tank' || that._intervalHasChanged) {
            let tickIntervalLabelSize = that._tickIntervalHandler.labelsSize;

            if (middle) {
                that._labelDummy.innerHTML = htmlValue;

                let tickPosition = this.valueToPx(value),
                    maxPosition = this.valueToPx(that._drawMax),
                    minPosition = this.valueToPx(that._drawMin),
                    labelSize = that._labelDummy[that._settings.size],
                    labelOtherSize = that.orientation === 'vertical' ? that._labelDummy.offsetWidth : that._labelDummy.offsetHeight,
                    distanceToMin = (labelSize + tickIntervalLabelSize.minLabelSize) / 2,
                    distanceToMax = (labelSize + tickIntervalLabelSize.maxLabelSize) / 2;

                that._normalLayout ?
                    plot = (tickPosition + distanceToMax < maxPosition) && (tickPosition - distanceToMin > minPosition) :
                    plot = (tickPosition - distanceToMax > maxPosition) && (tickPosition + distanceToMin < minPosition);

                if (labelOtherSize > this._longestLabelSize) {
                    this._longestLabelSize = labelOtherSize;
                }

            }
            else {
                this._longestLabelSize = Math.max(tickIntervalLabelSize.minLabelOtherSize, tickIntervalLabelSize.maxLabelOtherSize, this._longestLabelSize);
            }
        }

        that._tickValues.push(value);

        currentTick = '<div style="' + leftOrTop + ': ' + offset + 'px;" class="smart-tick"></div>';

        if (plot !== false) {
            if (labelSize === undefined) {
                that._labelDummy.innerHTML = htmlValue;
                labelSize = that._labelDummy[that._settings.size];
            }
            const labelOffset = offset - labelSize / 2;

            currentLabel += '<div class="smart-label' + (middle ? ' smart-label-middle' : '') + '" style="' + leftOrTop + ': ' + labelOffset + 'px;">' + htmlValue + '</div>';
        }

        return { tick: currentTick, label: currentLabel };
    }

    /**
     * Gets the internal numeric word length based on the "wordLength" property.
     */
    getWordLength(wordLength) {
        this.context._unsigned = wordLength.charAt(0) === 'u';

        switch (wordLength) {
            case 'int8':
            case 'uint8':
                return 8;
            case 'int16':
            case 'uint16':
                return 16;
            case 'int32':
            case 'uint32':
                return 32;
            case 'int64':
            case 'uint64':
                return 64;
        }
    }

    /**
     * Returns the angle equivalent of a value.
     */
    getAngleByValue(value, calculateDrawValue, returnDegrees) {
        const that = this.context;

        if (calculateDrawValue !== false && that.logarithmicScale) {
            value = Math.log10(value);
        }

        const angleOffset = (value - that._drawMin) * that._angleRangeCoefficient;
        let degrees;

        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            degrees = that.endAngle - angleOffset;
        }
        else {
            degrees = that.startAngle + angleOffset;
        }

        if (returnDegrees) {
            return degrees;
        }
        return degrees * Math.PI / 180 + Math.PI / 2;
    }

    /**
     * Returns the value equivalent of an angle.
     */
    getValueByAngle(angle, integer) {
        const that = this.context;
        let minuendAngle, subtrahendAngle, value;

        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            minuendAngle = that.endAngle;
            subtrahendAngle = angle;
        }
        else {
            minuendAngle = angle;
            subtrahendAngle = that._normalizedStartAngle;
        }

        while (minuendAngle < subtrahendAngle) minuendAngle += 360;

        value = ((minuendAngle - subtrahendAngle) / that._angleDifference) * that._range + parseFloat(that._drawMin);

        if (that.logarithmicScale) {
            if (that.customInterval) {
                return parseFloat(Math.pow(10, this.getCoercedValue(value, true)).toFixed(12));
            }

            value = Math.pow(10, value);
        }

        if (integer && !that.coerce) {
            return Math.round(value);
        }

        value = this.createDescriptor(value, undefined, true, true);

        return this.getCoercedValue(value, false);
    }

    /**
     * Updates the values of the Gauge and its digital display and fires the "change" event.
     */
    updateGaugeValue(newValue) {
        const that = this.context,
            oldValue = that.value;

        that.value = newValue;
        that._drawValue = that.logarithmicScale ? Math.log10(newValue).toString() : newValue;
        that._number = this.createDescriptor(that.value);
        that.$.digitalDisplay.value = newValue;
        that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue });
        that._setAriaValue('valuenow');

        delete that._valueBeforeCoercion;
    }

    /**
     * Validates the start or end value of a Gauge color range.
     */
    validateColorRange(value) {
        const that = this.context;

        return Math.min(Math.max(value, that.min), that.max);
    }

    /**
     * Returns a value based on the passed "draw" value.
     */
    getActualValue(value) {
        if (!this.context.logarithmicScale) {
            return value;
        }
        else {
            return Math.pow(10, value);
        }
    }

    /**
     * Draws minor ticks on a Gauge logarithmic scale.
     */
    drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor) {
        const that = this.context;
        let firstWholePower;

        if (majorStep instanceof Smart.Utilities.BigNumber) {
            majorStep = parseFloat(majorStep.toString());
        }

        for (let i in majorTickValues) {
            firstWholePower = i;
            if (i >= 0 && i % 1 === 0) {
                break;
            }
        }

        // positive powers
        for (let i = parseFloat(firstWholePower); i < that._drawMax; i += majorStep) {
            for (let j = 2; j <= 9; j++) {
                const value = j * Math.pow(10, i + majorStep - 1);

                if (value < that.max) {
                    drawMinor(value);
                }
            }
        }

        // negative powers
        for (let i = parseFloat(firstWholePower); i > that._drawMin; i -= majorStep) {
            for (let j = 2; j <= 9; j++) {
                const value = j * Math.pow(10, i - 1);

                if (value > that.min) {
                    drawMinor(value);
                }
            }
        }
    }

    /**
     * Returns the difference between two angles.
     */
    _getAngleDifference(angle1, angle2) {
        const phi = Math.abs(angle2 - angle1) % 360,
            distance = phi > 180 ? 360 - phi : phi;

        return distance;
    }

    /**
     * Plots custom ticks.
     */
    addCustomTicks() {
        const numericProcessor = this,
            that = numericProcessor.context,
            normalScale = !that.logarithmicScale;
        let ticks = '',
            labels = '';

        function createTickAndLabel(i) {
            const currentLabel = that.customTicks[i],
                value = normalScale ? numericProcessor.createDescriptor(currentLabel) : Math.log10(currentLabel),
                middle = i > 0 && i < that.customTicks.length - 1,
                currentTickAndLabel = numericProcessor._addMajorTickAndLabel(that._formatLabel(currentLabel), undefined, true, value, middle);

            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
        }

        numericProcessor._longestLabelSize = 0;
        that._tickValues = [];
        that._labelDummy = numericProcessor._createMeasureLabel();

        if (!that._normalLayout) {
            for (let i = that.customTicks.length - 1; i >= 0; i--) {
                createTickAndLabel(i);
            }
        }
        else {
            for (let i = 0; i < that.customTicks.length; i++) {
                createTickAndLabel(i);
            }
        }

        if (that.nodeName.toLowerCase() === 'smart-tank') {
            that._updateScaleWidth(numericProcessor._longestLabelSize);
        }

        that._appendTicksAndLabelsToScales(ticks, labels);
    }

    /**
     * Plots the Gauge's custom ticks.
     */
    addGaugeCustomTicks() {
        const numericProcessor = this,
            that = numericProcessor.context,
            distance = that._distance,
            majorTickWidth = that._measurements.radius - distance.majorTickDistance;
        let drawTick, drawLabel;

        if (that.ticksVisibility !== 'none' && that._plotTicks !== false) {
            drawTick = function (angle) {
                that._drawTick(angle, majorTickWidth, 'major');
            };
        }
        else {
            drawTick = function () { };
        }

        if (that.labelsVisibility !== 'none' && that._plotLabels !== false) {
            drawLabel = function (angle, currentLabel, middle) {
                that._drawLabel(angle, currentLabel, distance.labelDistance, middle);
            };
        }
        else {
            drawLabel = function () { };
        }

        function createTickAndLabel(i) {
            const currentLabel = that.customTicks[i],
                value = numericProcessor.createDescriptor(currentLabel),
                angle = numericProcessor.getAngleByValue(value, true),
                middle = i > 0 && i < that.customTicks.length - 1;

            drawTick(angle);
            drawLabel(angle, currentLabel, middle);
        }

        for (let i = that.customTicks.length - 1; i >= 0; i--) {
            createTickAndLabel(i);
        }
    }
});

/**
 * A class for processesing integer numbers.
 */
Smart.Utilities.Assign('IntegerNumericProcessor', class IntegerNumericProcessor extends Smart.Utilities.BaseNumericProcessor {
    constructor(context, numericFormatProperty) {
        super(context, numericFormatProperty);

        const that = this;

        that.context = context;
        that.defaultMins = { int8: '-128', uint8: '0', int16: '-32768', uint16: '0', int32: '-2147483648', uint32: '0', int64: '-9223372036854775808', uint64: '0' };
        that.defaultMaxs = { int8: '127', uint8: '255', int16: '32767', uint16: '65535', int32: '2147483647', uint32: '4294967295', int64: '9223372036854775807', uint64: '18446744073709551615' };
    }

    createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax, discardRadix) {
        const that = this.context;
        let returnValue;

        if (initialValue.constructor !== Smart.Utilities.BigNumber) {
            let radix = !discardRadix && that._radixNumber ? that._radixNumber : 10;

            if (radix === 10 && supportsENotation && initialValue.constructor !== Smart.Utilities.BigNumber && this.isENotation(initialValue)) {
                if (Smart.Utilities.BigNumber.bigIntSupport) {
                    initialValue = new Smart.Utilities.BigNumber(Math.round(initialValue));
                }
                else {
                    initialValue = new Smart.Utilities.NumberRenderer(initialValue).largeExponentialToDecimal();
                }
            }
            if (that._toBigNumberDecimal) {
                returnValue = that._toBigNumberDecimal(initialValue.toString(radix, that._wordLengthNumber), radix);
            }
            else {
                returnValue = new Smart.Utilities.BigNumber(initialValue);
            }
        }
        else {
            returnValue = new Smart.Utilities.BigNumber(initialValue);
        }
        if (validateConstruction) {
            // if the entered number is negative and the "wordLength" is "uint", the number is set to 0
            if (that._unsigned && returnValue.compare(0) === -1) {
                returnValue = returnValue.set(0);
            }
            if (validateMinMax) {
                // if the entered number is outside the range defined by "min" and "max", the number is changed to the value of "min" or "max"
                returnValue = this.validate(returnValue, that._minObject, that._maxObject);
            }
            returnValue = this.round(returnValue);
        }
        return returnValue;
    }

    /**
    * Returns a rounded BigNumber object
    */
    round(value) {
        const context = this.context;

        // eslint-disable-next-line
        if (value instanceof window.Smart.Utilities.BigNumber && typeof value._d === 'bigint') {
            return value;
        }
        else if (value instanceof window.Smart.Utilities.BigNumber === false ||
            !context._wordLengthNumber || context._wordLengthNumber < 64) {
            return new Smart.Utilities.BigNumber(Math.round(value.toString()));
        }

        const fraction = value.mod(1);

        if (!(fraction._d.length === 1 && fraction._d[0] === 0)) {
            // if the entered number is with a decimal value, it is rounded up or down to its nearest integer equivalent

            value = value.intPart();
            if (!value._s) {
                // round positive number
                if (fraction._d[1] > 4) {
                    value = value.add(1);
                }
            }
            else {
                // round negative number
                if (fraction._d[1] > 5 ||
                    fraction._d[1] === 5 && fraction._d[2]) {
                    value = value.add(-1);
                }
            }
        }
        return value;
    }

    /**
     * Validates value.
     */
    validate(initialValue, min, max) {
        let returnValue;

        if (initialValue.compare(min) === -1) {
            returnValue = min;
        }
        else if (initialValue.compare(max) === 1) {
            returnValue = max
        }
        else {
            returnValue = initialValue;
        }
        return returnValue;
    }

    /**
     * Validates min/max.
     */
    validateMinMax(validateMin, validateMax) {
        const that = this.context;

        let defaultMin = this.defaultMins[that.wordLength],
            defaultBigMin = new Smart.Utilities.BigNumber(defaultMin),
            defaultMax = this.defaultMaxs[that.wordLength],
            defaultBigMax = new Smart.Utilities.BigNumber(defaultMax),
            numericScale = that.mode !== 'date';

        if (that._numberRenderer === undefined) {
            that._numberRenderer = new Smart.Utilities.NumberRenderer();
        }

        if (validateMin && numericScale) {
            if (that.min !== null) {
                that.min = that.min.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.min)) {
                    that.min = this.scientificToDecimal(that.min);
                }
            }
            let currentBigMin = this.round(new Smart.Utilities.BigNumber(that.min));

            if (that.min !== null && (!that._minIsNull || !that._initialized) && currentBigMin.compare(defaultBigMin) >= 0) {
                that._minObject = currentBigMin;
            }
            else {
                that._minIsNull = true;
                that.min = defaultMin;
                that._minObject = defaultBigMin;
            }
        }

        if (validateMax && numericScale) {
            if (that.max !== null) {
                that.max = that.max.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.max)) {
                    that.max = this.scientificToDecimal(that.max);
                }
            }
            let currentBigMax = this.round(new Smart.Utilities.BigNumber(that.max));

            if (that.max !== null && (!that._maxIsNull || !that._initialized) && currentBigMax.compare(defaultBigMax) <= 0) {
                that._maxObject = currentBigMax;
            }
            else {
                that._maxIsNull = true;
                that.max = defaultMax;
                that._maxObject = defaultBigMax;
            }
        }

        if (!numericScale) {
            that._minObject = new Smart.Utilities.BigNumber(that.min);
            that._maxObject = new Smart.Utilities.BigNumber(that.max);
        }

        if (!this.compare(that._minObject, that._maxObject)) {
            //Set default values
            that._minObject = defaultBigMin;
            that._maxObject = defaultBigMax;
            that._drawMin = that.logarithmicScale ? 0 : defaultMin;
            that._drawMax = that.logarithmicScale ? 10 : defaultMax;
            that.min = defaultMin;
            that.max = defaultMax;
        }

        if (!numericScale) {
            that._minDate = Smart.Utilities.DateTime.fromFullTimeStamp(that.min);
            that._maxDate = Smart.Utilities.DateTime.fromFullTimeStamp(that.max);
        }
    }

    /**
     * Converts value to pixels.
     */
    valueToPx(value) {
        const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        const that = this.context,
            lengthRangeRatio = new Smart.Utilities.BigNumber(that._measurements.trackLength).divide(new Smart.Utilities.BigNumber(that._range));

        let result;

        if (that._normalLayout) {
            const drawMin = that._drawMin instanceof Smart.Utilities.BigNumber ? that._drawMin : new Smart.Utilities.BigNumber(that._drawMin);

            value = new Smart.Utilities.BigNumber(value);
            result = parseFloat((lengthRangeRatio.multiply(value.subtract(drawMin))).toString());
        }
        else {
            const drawMax = that._drawMax instanceof Smart.Utilities.BigNumber ? that._drawMax : new Smart.Utilities.BigNumber(that._drawMax);

            result = parseFloat(this.round(((drawMax.subtract(value)).multiply(lengthRangeRatio))).toString());
        }

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
        return result;
    }

    /**
    * Returns the value equivalent of a pixel offset.
    */
    pxToValue(px) {
        const that = this.context,
            ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;
        let result;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        if (that._normalLayout) {
            result = that._valuePerPx.multiply(px - that._trackStart);
        }
        else {
            result = that._valuePerPx.multiply(that._trackEnd - px);
        }

        result = this.round(result).toString();

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;

        if (that.logarithmicScale) {
            let power = parseFloat(result) + parseFloat(that._drawMin);

            //that._drawValue = power;
            return new Smart.Utilities.BigNumber(Math.round(Math.pow(10, power)));
        }

        let returnedValue = this.createDescriptor(that._minObject.add(result), false, true, true);
        //that._drawValue = returnedValue;

        return returnedValue;
    }

    /**
     * BigNumber compare method.
     */
    compare(initialValue, otherValue, thorough) {
        if ((initialValue === null || otherValue === null) && initialValue !== otherValue) {
            return true;
        }

        if (initialValue.constructor !== Smart.Utilities.BigNumber) {
            initialValue = new Smart.Utilities.BigNumber(initialValue);
        }

        const result = initialValue.compare(otherValue);

        if (thorough !== true) {
            return result !== 0;
        }

        return result;
    }

    /**
     * Increments/Decrements value. Keyboard navigation operations.
     */
    incrementDecrement(initialValue, operation, stepObject) {
        const that = this.context;

        let returnValue;

        if (initialValue.constructor !== Smart.Utilities.BigNumber) {
            initialValue = new Smart.Utilities.BigNumber(initialValue);
        }

        if (operation === 'add') {
            returnValue = initialValue.add(stepObject);
            if (that._drawMax !== undefined) {
                return returnValue.compare(that._drawMax) > 0 ? new Smart.Utilities.BigNumber(that._drawMax) : returnValue;
            }
        }
        else {
            returnValue = initialValue.subtract(stepObject);
            if (that._drawMin !== undefined) {
                return returnValue.compare(that._drawMin) < 0 ? new Smart.Utilities.BigNumber(that._drawMin) : returnValue;
            }
        }
        return returnValue;
    }

    /**
     * Renders the value. Scientific notation renderer.
     */
    render(initialValue, ignoreRadixNumber) {
        const context = this.context;

        if (!context.scientificNotation && ignoreRadixNumber === true) {
            return new Smart.Utilities.NumberRenderer(new Smart.Utilities.BigNumber(initialValue)).bigNumberToExponent(context.significantDigits);
        }

        // scientific notation
        let returnValue = initialValue;

        if (context.scientificNotation && ignoreRadixNumber === true) {
            returnValue = new Smart.Utilities.NumberRenderer(returnValue).toScientific(context.significantDigits, context.precisionDigits);
        }
        else if (typeof initialValue !== 'string') {
            returnValue = initialValue.toString(context._radixNumber, context._wordLengthNumber, context.leadingZeros);
        }

        return returnValue;
    }

    /**
     * Adds tank\'s ticks and labels.
     */
    addTicksAndLabels() {
        const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        const that = this.context,
            trackLength = that._measurements.trackLength,
            normalLayout = that._normalLayout,
            ticksFrequency = that._majorTicksInterval,
            tickscount = this.round(new Smart.Utilities.BigNumber(that._range).divide(ticksFrequency)),
            ticksDistance = trackLength / tickscount,
            min = new Smart.Utilities.BigNumber(that._drawMin),
            max = new Smart.Utilities.BigNumber(that._drawMax);


        let first, second, distanceModifier, last, firstLabelValue, firstLabelSize, lastLabelValue, lastLabelSize, currentTickAndLabel, ticks = '', labels = '';

        that._tickValues = [];
        this._longestLabelSize = 0;

        if (normalLayout) {
            first = min;
            second = ticksFrequency.add(first.subtract(first.mod(ticksFrequency)));
            distanceModifier = second.subtract(first);
            firstLabelValue = that._formatLabel(min);
            firstLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
            last = max;
            lastLabelValue = that._formatLabel(max);
            lastLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
        }
        else {
            first = max;
            second = first.subtract(first.mod(ticksFrequency));
            distanceModifier = first.subtract(second);
            firstLabelValue = that._formatLabel(max);
            firstLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
            last = min;
            lastLabelValue = that._formatLabel(min);
            lastLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
        }

        that._labelDummy = this._createMeasureLabel();

        currentTickAndLabel = this._addMajorTickAndLabel(firstLabelValue, firstLabelSize, true, first); // first tick and label
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;

        // special case for second tick and label
        const distanceFromFirstToSecond = distanceModifier.divide(ticksFrequency).multiply(ticksDistance);

        if (second.compare(that.max) !== 0 && distanceFromFirstToSecond.compare(trackLength) < 0) {
            // second item rendering
            const secondItemHtmlValue = that._formatLabel(second.toString()),
                plotSecond = distanceFromFirstToSecond.compare(firstLabelSize) > 0;

            currentTickAndLabel = this._addMajorTickAndLabel(secondItemHtmlValue, undefined, plotSecond, second, true);
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
        }
        currentTickAndLabel = this.addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency);
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;
        currentTickAndLabel = this._addMajorTickAndLabel(lastLabelValue, lastLabelSize, true, last); // last tick and label
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;

        if (that.mode !== 'date') {
            ticks += this.addMinorTicks(normalLayout);
        }

        that._measureLabelScale.removeChild(that._labelDummy);
        delete that._labelDummy;
        delete that._measureLabelScale;

        if (that.nodeName.toLowerCase() === 'smart-tank') {
            that._updateScaleWidth(this._longestLabelSize);
        }

        that._appendTicksAndLabelsToScales(ticks, labels);
        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
    }

    /**
    * Adds the middle major ticks and their respective labels.
    */
    addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency) {
        const that = this.context;

        let majorTicks = '', majorLabels = '', valuePlusExponent;

        for (let i = 1; i < tickscount; i++) {
            let number = distanceFromFirstToSecond.add(i * ticksDistance), value;

            if (normalLayout) {
                value = ticksFrequency.multiply(i).add(distanceModifier.add(new Smart.Utilities.BigNumber(that._drawMin)));
            }
            else {
                value = new Smart.Utilities.BigNumber(that._drawMax).subtract(distanceModifier).subtract(ticksFrequency.multiply(i));

                // if the value of the penultimate is 0 we add the exponent to accurately calculate its size
                if (i === tickscount - 1 && value.compare(0) === 0) {
                    that._numberRenderer.numericValue = that._tickIntervalHandler.nearestPowerOfTen;
                    valuePlusExponent = that._numberRenderer.bigNumberToExponent(1);
                }
            }
            if (value.compare(that._drawMax) !== 0) {
                let htmlValue = that._formatLabel(value.toString()),
                    plot = true;

                that._labelDummy.innerHTML = valuePlusExponent ? valuePlusExponent : htmlValue;
                let dimensionValue = that._labelDummy[that._settings.size];

                if (number.add(dimensionValue).compare(tickscount * ticksDistance) >= 0) {      // + 5 is an experimental value
                    plot = false; // does not plot the second to last label if it intersects with the last one
                }

                const currentTickAndLabel = this._addMajorTickAndLabel(htmlValue, undefined, plot, value, true);

                majorTicks += currentTickAndLabel.tick;
                majorLabels += currentTickAndLabel.label;
            }
        }
        return { tick: majorTicks, label: majorLabels };
    }

    /**
     * Adds minor ticks.
     */
    addMinorTicks(normalLayout) {
        function addMinorTick(i) {
            if (tickValues.indexOf(i) === -1 && i % minorTicksInterval === 0) {
                minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(i) + 'px;" class="smart-tick smart-tick-minor"></div>';
            }
        }

        const that = this.context,
            tickValues = that._tickValues,
            nearestPowerOfTen = that._tickIntervalHandler.nearestPowerOfTen,
            minorTicksInterval = that._minorTicksInterval,
            leftOrTop = that._settings.leftOrTop;

        let firstTickValue, secondTickValue, lastTickValue, minorTicks = '';

        if (normalLayout) {
            firstTickValue = tickValues[0];
            secondTickValue = tickValues[1];
            lastTickValue = tickValues[tickValues.length - 1]
        }
        else {
            firstTickValue = tickValues[tickValues.length - 1];
            secondTickValue = tickValues[tickValues.length - 2];
            lastTickValue = tickValues[0]
        }


        if (that.logarithmicScale) {
            addMinorTickOnLogarithmicScale();
        }
        else {
            // minor ticks from the beginning to the second major tick
            for (let i = secondTickValue; firstTickValue.compare(i) < 0; i = i.subtract(nearestPowerOfTen)) {
                addMinorTick(i);
            }

            // minor ticks from the second major tick to the end
            for (let i = secondTickValue.add(nearestPowerOfTen); lastTickValue.compare(i) > 0; i = i.add(nearestPowerOfTen)) {
                addMinorTick(i);
            }
        }

        function addMinorTickOnLogarithmicScale() {
            let trackLength = that._measurements.trackLength,
                partialTrackLength = trackLength / tickValues.length,
                modifierCoef = 0.1;

            if (partialTrackLength < 20) {
                modifierCoef = 1;
            }
            else if ((partialTrackLength >= 20) && (partialTrackLength < 40)) {
                modifierCoef = (secondTickValue - firstTickValue) > 1 ? 1 : 0.5;
            }
            else if ((partialTrackLength >= 40) && (partialTrackLength < 80)) {
                modifierCoef = 0.2;
            }

            let nearestPowerOf10BelowMax = Math.floor(that._drawMax),
                distanceToNearestPowerOf10 = that._drawMax - nearestPowerOf10BelowMax,
                ticksOnPowerOf10 = (that._drawMax - that._drawMin) > tickValues.length;

            for (let j = that._drawMax; j > 0; j = j - 1) {
                let range = distanceToNearestPowerOf10 > 0 ? Math.pow(10, j - distanceToNearestPowerOf10 + 1) : Math.pow(10, j),
                    modifier = range * modifierCoef;

                for (let i = range; i > 0; i = (i - modifier)) {
                    if ((i < that.max) && (i > that.min)) {
                        let value = new Smart.Utilities.BigNumber(Math.log10(i));

                        if (((value % 1 === 0) && ticksOnPowerOf10) || !ticksOnPowerOf10) {
                            minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(value) + 'px;" class="smart-tick smart-tick-minor"></div>';
                        }
                    }
                }
            }

        }

        return minorTicks;
    }

    /**
     * Validates custom ticks.
     */
    validateCustomTicks() {
        const that = this.context,
            numericScale = that.mode !== 'date';
        let validCustomTicks = [];

        for (let i = 0; i < that.customTicks.length; i++) {
            let currentTick = that.customTicks[i];

            if (numericScale) {
                currentTick = this.createDescriptor(currentTick, false, true);
            }
            else if (currentTick._d === undefined) {
                currentTick = Smart.Utilities.DateTime.validateDate(currentTick).getTimeStamp();
            }

            if (currentTick.compare(that._minObject) >= 0 && currentTick.compare(that._maxObject) <= 0) {
                validCustomTicks.push(currentTick);
            }
        }

        validCustomTicks.sort(function (a, b) {
            return a.compare(b);
        });

        if (numericScale) {
            for (let i = 0; i < validCustomTicks.length; i++) {
                validCustomTicks[i] = validCustomTicks[i].toString();
            }

            validCustomTicks = validCustomTicks.filter(function (element, index, array) {
                return !index || element !== array[index - 1];
            });
        }

        that.customTicks = validCustomTicks.slice(0);
    }

    /**
     * Plots the Gauge's ticks and labels.
     */
    addGaugeTicksAndLabels() {
        const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        const that = this.context,
            numericProcessor = this,
            maxLabelHeight = Math.max(that._tickIntervalHandler.labelsSize.minLabelSize, that._tickIntervalHandler.labelsSize.maxLabelSize),
            majorStep = that._majorTicksInterval,
            minorStep = that._minorTicksInterval,
            majorTickValues = {},
            distance = that._distance,
            radius = that._measurements.radius,
            majorTickWidth = radius - distance.majorTickDistance,
            minorTickWidth = radius - distance.minorTickDistance,
            bigDrawMin = new Smart.Utilities.BigNumber(that._drawMin),
            bigDrawMax = new Smart.Utilities.BigNumber(that._drawMax);
        let drawMajor, drawMinor, addLabel, currentAngle, angleAtMin, angleAtMax;

        if (that.ticksVisibility !== 'none' && that._plotTicks !== false) {
            drawMajor = function (angle) {
                that._drawTick(angle, majorTickWidth, 'major');
            };

            drawMinor = function (value) {
                that._drawTick(numericProcessor.getAngleByValue(value, true), minorTickWidth, 'minor');
            };
        }
        else {
            drawMajor = function () { };
            drawMinor = function () { };
        }

        if (that.labelsVisibility !== 'none' && that._plotLabels !== false) {
            addLabel = function (angle, currentLabel, middle) {
                that._drawLabel(angle, currentLabel, distance.labelDistance, middle);
            };
        }
        else {
            addLabel = function () { };
        }

        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            angleAtMin = that.endAngle;
            angleAtMax = that.startAngle;
        }
        else {
            angleAtMin = that.startAngle;
            angleAtMax = that.endAngle;
        }

        // first major tick and label
        currentAngle = numericProcessor.getAngleByValue(bigDrawMin, false);
        drawMajor(currentAngle);
        majorTickValues[that._drawMin.toString()] = true;
        addLabel(currentAngle, that.min, false);

        let second = bigDrawMin.subtract(bigDrawMin.mod(majorStep)),
            firstMinTick;

        if (bigDrawMin.compare(0) !== -1) {
            second = second.add(majorStep);
        }

        // determines the value at the first minor tick
        for (let i = new Smart.Utilities.BigNumber(second); i.compare(bigDrawMin) !== -1; i = i.subtract(minorStep)) {
            firstMinTick = i;
        }

        // second major tick and label
        currentAngle = numericProcessor.getAngleByValue(second, false);
        drawMajor(currentAngle);
        majorTickValues[second.toString()] = true;
        if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMin, numericProcessor.getAngleByValue(second, false, true)) / 360) > maxLabelHeight) {
            addLabel(currentAngle, this.getActualValue(second), second.compare(bigDrawMax) === -1);
        }

        let i;
        // middle major ticks and labels
        for (i = second.add(majorStep); i.compare(bigDrawMax.subtract(majorStep)) === -1; i = i.add(majorStep)) {
            currentAngle = numericProcessor.getAngleByValue(i, false);
            drawMajor(currentAngle);
            majorTickValues[i.toString()] = true;
            addLabel(currentAngle, this.getActualValue(i), true);
        }

        if (majorTickValues[i.toString()] === undefined && i.compare(bigDrawMax) !== 1) {
            // second-to-last major tick and label
            currentAngle = numericProcessor.getAngleByValue(i, false);
            drawMajor(currentAngle);
            majorTickValues[i.toString()] = true;
            if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMax, numericProcessor.getAngleByValue(i, false, true)) / 360) >= maxLabelHeight) {
                addLabel(currentAngle, this.getActualValue(i), true);
            }

            if (that._normalizedStartAngle !== that.endAngle) {
                // last major tick and label
                currentAngle = numericProcessor.getAngleByValue(bigDrawMax, false);
                drawMajor(currentAngle);
                if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMax, angleAtMin) / 360) >= maxLabelHeight) {
                    addLabel(currentAngle, that.max, false);
                }
            }
        }

        if (that.mode === 'date') {
            Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
            return;
        }

        // minor ticks
        if (!that.logarithmicScale) {
            for (let j = firstMinTick; j.compare(bigDrawMax) === -1; j = j.add(minorStep)) {
                if (majorTickValues[j.toString()]) {
                    continue; // does not plot minor ticks over major ones
                }
                drawMinor(j);
            }
        }
        else {
            this.drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor);
        }

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
    }

    /**
     * Sets toolTip's value and updates the value of the element.
     */
    updateToolTipAndValue(value, oldValue, changeValue) {
        const that = this.context,
            logarithmicScale = that.logarithmicScale;

        that._updateTooltipValue(value.toString());
        if (logarithmicScale) {
            value = parseFloat(Math.pow(10, parseFloat(value)).toFixed(11));
        }

        value = value instanceof Smart.Utilities.BigNumber ? value : new Smart.Utilities.BigNumber(value);

        const stringifiedValue = value.toString();

        that._number = value;
        that._drawValue = logarithmicScale ? Math.log10(stringifiedValue) : value;

        // eslint-disable-next-line
        if (value.compare(oldValue) !== 0 && changeValue) {
            if (that.mode === 'numeric') {
                that.value = stringifiedValue;
                value = stringifiedValue;
            }
            else {
                oldValue = that._valueDate;
                that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(stringifiedValue);
                that.value = value;
                value = that._valueDate;
            }

            if (!that._programmaticValueIsSet) {
                that.$.fireEvent('change', { 'value': value, 'oldValue': oldValue });
            }

            if (that.$.hiddenInput) {
                that.$.hiddenInput.value = value;
            }

            that._setAriaValue('valuenow');
        }
    }

    /**
     * Validates the interval property.
     */
    validateInterval(interval) {
        const that = this.context,
            range = that._maxObject.subtract(that._minObject);

        that._validInterval = new Smart.Utilities.BigNumber(interval);
        that._validInterval = this.round(that._validInterval);

        if (that._validInterval.compare(0) <= 0) {
            that._validInterval = new Smart.Utilities.BigNumber(1);
        }

        if (that._validInterval.compare(range) === 1) {
            that._validInterval = range;
        }

        that.interval = that._validInterval.toString();
    }

    /**
     * Returns a coerced value based on the interval.
     */
    getCoercedValue(value, useDrawVariables, logarithmicGauge) {
        const that = this.context;

        if (!that.coerce) {
            return value;
        }

        const normalScale = !that.logarithmicScale;

        value = value instanceof Smart.Utilities.BigNumber ? value : new Smart.Utilities.BigNumber(value);

        let minValue, maxValue;

        if (that.customInterval) {
            const customTicks = that.customTicks;

            if (customTicks.length === 0) {
                return value;
            }

            let difference, closestValue;

            if (normalScale || logarithmicGauge) {
                minValue = that._minObject;
                difference = minValue.subtract(value).abs();
                closestValue = minValue;

                for (let i = 0; i < customTicks.length; i++) {
                    const currentTickObject = this.createDescriptor(customTicks[i]),
                        currentDifference = currentTickObject.subtract(value).abs();

                    if (currentDifference.compare(difference) === -1) {
                        difference = currentDifference;
                        closestValue = currentTickObject;
                    }
                }
            }
            else {
                minValue = that._drawMin;
                difference = Math.abs(minValue - parseFloat(value.toString()));
                closestValue = minValue;

                for (let i = 0; i < customTicks.length; i++) {
                    const currentTickObject = Math.log10(customTicks[i]),
                        currentDifference = Math.abs(currentTickObject - value);

                    if (currentDifference < difference) {
                        difference = currentDifference;
                        closestValue = currentTickObject;
                    }
                }

                closestValue = new Smart.Utilities.BigNumber(closestValue);
            }

            return closestValue;
        }

        let interval = that._validInterval;

        if (that.mode === 'date') {
            if (that._dateIncrementMethod === 'addYears') {
                return this.coerceYear(value);
            }
            else if (that._dateIncrementMethod === 'addMonths') {
                return this.coerceMonth(value);
            }
            else {
                interval = new Smart.Utilities.BigNumber(that._dateIntervalNumber).multiply(interval);
            }
        }

        if (useDrawVariables !== false) {
            minValue = new Smart.Utilities.BigNumber(that._drawMin);
            maxValue = new Smart.Utilities.BigNumber(that._drawMax);
        }
        else {
            minValue = new Smart.Utilities.BigNumber(that.min);
            maxValue = new Smart.Utilities.BigNumber(that.max);
        }

        let noMin = value.subtract(minValue),
            remainder = noMin.mod(interval);

        if (remainder.compare(0) === 0) {
            return value;
        }

        let lowerValue = noMin.subtract(remainder),
            greaterValue = lowerValue.add(interval);

        if ((noMin.subtract(lowerValue)).abs().compare((noMin.subtract(greaterValue)).abs()) < 0) {
            return lowerValue.add(minValue);
        }
        else {
            const biggerValue = greaterValue.add(minValue);

            return biggerValue.compare(maxValue) <= 0 ? biggerValue : lowerValue.add(minValue);
        }
    }

    coerceMonth(value) {
        const that = this.context,
            interval = parseFloat(that._validInterval),
            date = Smart.Utilities.DateTime.fromFullTimeStamp(value),
            year = date.year(),
            month = date.month(),
            day = date.day(),
            minYear = that._minDate.year(),
            minMonth = that._minDate.month(),
            totalMonths = (that._maxDate.year() - minYear - 1) * 12 + 12 - minMonth + that._maxDate.month();
        let currentMonths = (year - 1 - minYear) * 12 + (12 - minMonth) + (month);

        if (interval === 1) {
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1) {
                if (day > 16 || day === 16 && date.hour() > 11) {
                    currentMonths++;
                }
            }
            else if (month === 2) {
                if (date.isLeapYear(year)) {
                    if (day > 15 || day === 15 && date.hour() > 11) {
                        currentMonths++;
                    }
                }
                else if (day > 14) {
                    currentMonths++;
                }
            }
            else if (day > 15) {
                currentMonths++;
            }
        }

        currentMonths = this.getCoercedTimePart(0, totalMonths, currentMonths, interval);

        let result = that._minDate.addMonths(currentMonths, true);

        if (result.compare(that._maxDate) === 1) {
            result = that._minDate.addMonths(currentMonths - interval, true);
        }

        that._drawValue = new Smart.Utilities.BigNumber(result.getTimeStamp());
        return that._drawValue;
    }

    coerceYear(value) {
        const that = this.context,
            interval = parseFloat(that._validInterval),
            date = Smart.Utilities.DateTime.fromFullTimeStamp(value),
            maxYear = that._maxDate.year(),
            updatedValueConstructorParameters = Smart.Utilities.DateTime.getConstructorParameters(that._minDate);
        let year = date.year();

        if (date.month() > 6) {
            year++;
        }

        let coercedTimePart = this.getCoercedTimePart(that._minDate.year(), maxYear, year, interval);

        if (coercedTimePart > maxYear) {
            coercedTimePart -= interval;
        }

        updatedValueConstructorParameters[0] = coercedTimePart;
        updatedValueConstructorParameters.unshift(null);

        const valueDate = new (Function.prototype.bind.apply(Smart.Utilities.DateTime, updatedValueConstructorParameters));

        that._drawValue = new Smart.Utilities.BigNumber(valueDate.getTimeStamp());
        return that._drawValue;
    }

    getCoercedTimePart(min, max, value, interval) {
        let noMin = value - min,
            remainder = noMin % interval;

        if (remainder === 0) {
            return value;
        }

        let lowerValue = parseFloat((noMin - remainder).toFixed(12)),
            greaterValue = lowerValue + interval;

        if (max - min <= interval) {
            return value >= min + (max - min) / 2 ? max : min;
        }

        if (Math.abs(noMin - lowerValue) < Math.abs(noMin - greaterValue)) {
            return lowerValue + min;
        }
        else {
            const biggerValue = greaterValue + min;

            return biggerValue > max ? lowerValue + min : biggerValue;
        }
    }

    /**
     * Updates the value of the Tank and the "value" property and triggers the respective events.
     */
    updateValue(value) {
        const that = this.context;

        value = value instanceof Smart.Utilities.BigNumber ? value : new Smart.Utilities.BigNumber(value);

        const renderedValue = this.validate(value, that._minObject, that._maxObject);
        let oldValue = that.value,
            valueDetail, difference;

        that._number = renderedValue;
        that._drawValue = that.logarithmicScale ? Math.log10(renderedValue) : renderedValue;

        if (that.mode === 'numeric') {
            valueDetail = value.toString();
            that.value = valueDetail;
            difference = this.compare(value, oldValue);
        }
        else {
            oldValue = Smart.Utilities.DateTime.fromFullTimeStamp(oldValue);
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(value);
            that.value = value;
            value = that._valueDate;
            valueDetail = value;
            difference = value.compare(oldValue) !== 0;
        }

        if (!that._programmaticValueIsSet && (difference || that._scaleTypeChangedFlag)) {
            that.$.fireEvent('change', { 'value': valueDetail, 'oldValue': oldValue });
        }

        if (that.$.hiddenInput) {
            that.$.hiddenInput.value = value;
        }

        that._setAriaValue('valuenow');
        that._moveThumbBasedOnValue(that._drawValue);
    }

    /**
     * Returns value per pixel.
     */
    getValuePerPx(range, pxRange) {
        const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        const result = new Smart.Utilities.BigNumber(range).divide(pxRange);

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
        return result;
    }

    /**
     * Restricts the thumbs to not pass each other.
     */
    restrictValue(values) {
        if (values[1].constructor === Smart.Utilities.BigNumber) {
            if (values[1].compare(values[0]) === -1) {
                values[1].set(values[0]);
            }
        }
        else {
            if (values[1] < values[0]) {
                values[1] = values[0];
            }
        }
    }

    /**
     * Returns the angle equivalent of a value.
     */
    getAngleByValue(value, calculateDrawValue, returnDegrees) {
        const that = this.context,
            ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        if (that._wordLengthNumber < 64) {
            Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
            return super.getAngleByValue(parseFloat(value.toString()), calculateDrawValue, returnDegrees);
        }

        if (value instanceof Smart.Utilities.BigNumber === false) {
            value = new Smart.Utilities.BigNumber(value);
        }

        if (calculateDrawValue !== false && that.logarithmicScale) {
            value = new Smart.Utilities.BigNumber(Math.log10(value.toString()));
        }

        const angleOffset = value.subtract(that._drawMin).multiply(that._angleRangeCoefficient);
        let degrees;


        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            degrees = angleOffset.multiply(-1).add(that.endAngle);
        }
        else {
            degrees = angleOffset.add(that.startAngle);
        }

        degrees = parseFloat(degrees.toString());
        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;

        if (returnDegrees) {
            return degrees;
        }

        return degrees * Math.PI / 180 + Math.PI / 2;
    }

    /**
     * Returns the value equivalent of an angle.
     */
    getValueByAngle(angle) {
        const that = this.context;

        if (that._wordLengthNumber < 64) {
            return super.getValueByAngle(angle, true);
        }

        const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;
        let minuendAngle, subtrahendAngle, value;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            minuendAngle = that.endAngle;
            subtrahendAngle = angle;
        }
        else {
            minuendAngle = angle;
            subtrahendAngle = that._normalizedStartAngle;
        }

        while (minuendAngle < subtrahendAngle) minuendAngle += 360;

        value = new Smart.Utilities.BigNumber((minuendAngle - subtrahendAngle) / that._angleDifference).multiply(that._range).add(that._drawMin);

        if (that.logarithmicScale) {
            value = new Smart.Utilities.BigNumber(Math.pow(10, value.toString()));
        }

        let result;

        if (that.coerce) {
            result = this.getCoercedValue(value, false);
        }
        else {
            result = this.round(value);
        }

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
        return new Smart.Utilities.BigNumber(result);
    }

    /**
     * Updates the values of the Gauge and its digital display and fires the "change" event.
     */
    updateGaugeValue(newValue) {
        if (newValue instanceof Smart.Utilities.BigNumber === false) {
            return super.updateGaugeValue(newValue);
        }

        const that = this.context,
            oldValue = that._getEventValue();

        if (that.mode === 'numeric') {
            that.value = newValue.toString();
            that.$.digitalDisplay.value = that.value;
        }
        else {
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(newValue);
            that.value = newValue;
        }

        that._drawValue = that.logarithmicScale ? Math.log10(that.value).toString() : that.value;
        that._number = newValue;

        that.$.fireEvent('change', { 'value': that._getEventValue(), 'oldValue': oldValue });
        that._setAriaValue('valuenow');
    }

    /**
     * Validates the start or end value of a Gauge color range.
     */
    validateColorRange(value) {
        const that = this.context;

        if (that._wordLengthNumber < 64) {
            return super.validateColorRange(value);
        }

        if (that.mode === 'numeric') {
            value = new Smart.Utilities.BigNumber(value);
        }
        else {
            value = Smart.Utilities.DateTime.validateDate(value);
            value = value.getTimeStamp();
        }

        const bigMin = new Smart.Utilities.BigNumber(that.min),
            bigMax = new Smart.Utilities.BigNumber(that.max);

        if (value.compare(bigMin) === -1) {
            value = bigMin;
        }

        if (value.compare(bigMax) === 1) {
            value = bigMax;
        }

        return value;
    }

    /**
     * Locks the Gauge's interaction with the mouse.
     */
    lockRotation(directionCondition, newValue) {
        const that = this.context;

        if (newValue instanceof Smart.Utilities.BigNumber === false) {
            newValue = new Smart.Utilities.BigNumber(newValue);
        }

        if (directionCondition && newValue.compare(that._number) === -1) {
            that._lockCW = true;
            if (newValue.compare(that._maxObject) === -1) {
                return new Smart.Utilities.BigNumber(that._maxObject);
            }
        }
        else if (!directionCondition && newValue.compare(that._number) === 1) {
            that._lockCCW = true;
            if (newValue.compare(that._minObject) === 1) {
                return new Smart.Utilities.BigNumber(that._minObject);
            }
        }
    }

    /**
     * Gets the angle-range coefficient.
     */
    getAngleRangeCoefficient() {
        const that = this.context,
            ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;
        that._angleRangeCoefficient = new Smart.Utilities.BigNumber(that._angleDifference).divide(that._range);
        Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
    }
});

/**
 * A class for processesing floating point numbers.
 */
Smart.Utilities.Assign('DecimalNumericProcessor', class DecimalNumericProcessor extends Smart.Utilities.BaseNumericProcessor {
    constructor(context, numericFormatProperty) {
        super(context, numericFormatProperty);
        this.context = context;
    }

    /**
     * Returns the precise modulo of the mod operation.
     */
    getPreciseModulo(dividend, divisor, moduloCoefficient) {
        const sign = dividend >= 0 ? 1 : -1;

        dividend = Math.abs(dividend);
        divisor = Math.abs(divisor);

        if (typeof moduloCoefficient === 'undefined') {
            const dividendExponential = dividend.toExponential(),
                divisorExponential = divisor.toExponential(),
                dividendExponent = parseInt(dividendExponential.slice(dividendExponential.indexOf('e') + 1), 10),
                divisorExponent = parseInt(divisorExponential.slice(divisorExponential.indexOf('e') + 1), 10),
                dividendRoundCoefficient = dividendExponent < 0 ? Math.abs(dividendExponent) : 0,
                divisorRoundCoefficient = divisorExponent < 0 ? Math.abs(divisorExponent) : 0,
                roundCoefficient = Math.max(dividendRoundCoefficient, divisorRoundCoefficient);

            this.roundCoefficient = roundCoefficient;

            if (dividend < divisor) {
                return sign * dividend;
            }
            if (dividend === divisor) {
                return 0;
            }
            if ((dividend < -1 || dividend > 1) && (divisor < -1 || divisor > 1 || divisor === 1)) {
                if (dividend % 1 === 0 && divisor % 1 === 0) {
                    return sign * (dividend % divisor);
                }
                else {
                    const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

                    Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;

                    const result = sign * parseFloat(new Smart.Utilities.BigNumber(dividend).mod(divisor).toString());

                    Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
                    return result;
                }
            }

            const moduloCoefficient = Math.pow(10, roundCoefficient);

            return sign * (((dividend * moduloCoefficient) % (divisor * moduloCoefficient)) / moduloCoefficient);
        }
        return sign * (Math.round(dividend * moduloCoefficient) % Math.round(divisor * moduloCoefficient));
    }

    /**
     * Creates a descriptor.
     */
    createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax) {
        let returnValue = parseFloat(initialValue);

        if (validateMinMax) {
            returnValue = this.validate(returnValue, this.context._minObject, this.context._maxObject);
        }
        return returnValue;
    }

    /**
     * Returns a rounded number
     */
    round(value) {
        return Math.round(value);
    }

    /**
     * Validates the value.
     */
    validate(initialValue, min, max) {
        let returnValue;

        if (initialValue < min) {
            returnValue = min;
        }
        else if (initialValue > max) {
            returnValue = max;
        }
        else {
            returnValue = initialValue;
        }
        return returnValue;
    }

    /**
     * Validates min/max.
     */
    validateMinMax(validateMin, validateMax) {
        const that = this.context,
            checkSpecialRegexMin = typeof (that._regexSpecial) !== 'undefined' ? that._regexSpecial.inf.test(that.min) : false,
            checkSpecialRegexMax = typeof (that._regexSpecial) !== 'undefined' ? that._regexSpecial.inf.test(that.max) : false;

        if (validateMin) {
            if (that.min === null || checkSpecialRegexMin) {
                that.min = -Infinity;
                that._minObject = -Infinity;
            }
            else {
                that.min = that.min.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.min)) {
                    that.min = this.scientificToDecimal(that.min);
                }

                that._minObject = that._discardDecimalSeparator(that.min);
            }
        }
        if (validateMax) {
            if (that.max === null || checkSpecialRegexMax) {
                that.max = Infinity;
                that._maxObject = Infinity;
            }
            else {
                that.max = that.max.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.max)) {
                    that.max = this.scientificToDecimal(that.max);
                }

                that._maxObject = that._discardDecimalSeparator(that.max);
            }
        }

        if (!this.compare(that._minObject, that._maxObject)) {

            //Set default values
            that._maxObject = parseFloat(that._maxObject) + 1;
            that.max = that._maxObject;
        }
    }

    /**
     * Returns the pixel equivalent of a value.
     */
    valueToPx(value) {
        const that = this.context,
            lengthRangeRatio = that._measurements.trackLength / that._range;

        let result;

        if (that._normalLayout) {
            result = lengthRangeRatio * (value - that._drawMin);
        }
        else {
            result = lengthRangeRatio * (that._drawMax - value);
        }

        return Math.round(result);
    }

    /**
     * Returns the value equivalent of a pixel offset.
     */
    pxToValue(px) {
        const that = this.context;

        let result;

        if (that._normalLayout) {
            result = (px - that._trackStart) * that._valuePerPx;
        }
        else {
            result = (that._trackEnd - px) * that._valuePerPx;
        }

        if (that.logarithmicScale) {
            const power = result + parseFloat(that._drawMin);

            return Math.pow(10, power);
        }

        return this.validate(result + that._minObject, that._minObject, that._maxObject);
    }

    /**
     * Decimal compare method.
     */
    compare(initialValue, otherValue, thorough) {
        initialValue = parseFloat(initialValue);
        otherValue = parseFloat(otherValue);

        if (thorough !== true) {
            return initialValue !== otherValue;
        }

        if (initialValue < otherValue) {
            return -1;
        }

        if (initialValue > otherValue) {
            return 1;
        }

        return 0;
    }

    /**
     * Increments/Decrements value. Keyboard navigation operations.
     */
    incrementDecrement(initialValue, operation, stepObject) {
        const that = this.context;

        let returnValue;

        if (operation === 'add') {
            returnValue = parseFloat(initialValue) + parseFloat(stepObject);
            if (that._drawMax !== undefined) {
                return returnValue > parseFloat(that._drawMax) ? that._drawMax : returnValue;
            }
        }
        else {
            returnValue = parseFloat(initialValue) - parseFloat(stepObject);
            if (that._drawMin !== undefined) {
                return returnValue < parseFloat(that._drawMin) ? that._drawMin : returnValue;
            }
        }
        return returnValue;
    }

    /**
     * Renders the value.
     */
    render(initialValue) {
        const that = this.context,
            checkSpecialRegex = typeof (that._regexSpecial) !== 'undefined' ? that._regexSpecial.nonNumericValue.test(initialValue) : false;

        if (checkSpecialRegex) {
            return initialValue;
        }
        else {
            const numberRenderer = new Smart.Utilities.NumberRenderer(initialValue);

            if (that.scientificNotation) {
                return numberRenderer.toScientific(that.significantDigits, that.precisionDigits);
            }
            else {
                return numberRenderer.toDigits(that.significantDigits, that.precisionDigits);
            }
        }
    }

    /**
     * Adds tank's ticks and labels.
     */
    addTicksAndLabels() {
        const that = this.context,
            trackLength = that._measurements.trackLength,
            normalLayout = that._normalLayout,
            ticksFrequency = that._majorTicksInterval,
            tickscount = Math.round(that._range / parseFloat((ticksFrequency.toString()))),
            ticksDistance = trackLength / tickscount,
            min = parseFloat(that._drawMin),
            max = parseFloat(that._drawMax);

        let first, second, distanceModifier, last, firstLabelValue, firstLabelSize, lastLabelValue, lastLabelSize, currentTickAndLabel, ticks = '', labels = '';

        that._tickValues = [];
        this._longestLabelSize = 0;

        if (normalLayout) {
            first = min;

            //handling specific case
            if (that.logarithmicScale && min < 0 && min !== -1) {
                second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency));
            }
            else {
                second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency) + parseFloat(ticksFrequency));
            }

            distanceModifier = second - first;
            firstLabelValue = that._formatLabel(min);
            firstLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
            last = max;
            lastLabelValue = that._formatLabel(max);
            lastLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
        }
        else {
            first = max;
            second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency));
            distanceModifier = first - second;
            firstLabelValue = that._formatLabel(max);
            firstLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
            last = min;
            lastLabelValue = that._formatLabel(min);
            lastLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
        }

        that._labelDummy = this._createMeasureLabel();

        currentTickAndLabel = this._addMajorTickAndLabel(firstLabelValue, firstLabelSize, true, first); // first tick and label
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;

        // special case for second tick and label
        const distanceFromFirstToSecond = distanceModifier / ticksFrequency * ticksDistance;

        if (second.toString() !== that._drawMax.toString() && distanceFromFirstToSecond < trackLength) {
            // second item rendering
            const secondItemHtmlValue = that._formatLabel(second.toString()),
                plotSecond = firstLabelSize < distanceFromFirstToSecond;

            currentTickAndLabel = this._addMajorTickAndLabel(secondItemHtmlValue, undefined, plotSecond, second, true);
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
        }

        currentTickAndLabel = this.addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency);
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;
        currentTickAndLabel = this._addMajorTickAndLabel(lastLabelValue, lastLabelSize, true, last); // last tick and label
        ticks += currentTickAndLabel.tick;
        labels += currentTickAndLabel.label;
        ticks += this.addMinorTicks(normalLayout);

        that._measureLabelScale.removeChild(that._labelDummy);
        delete that._labelDummy;
        delete that._measureLabelScale;

        if (that.nodeName.toLowerCase() === 'smart-tank') {
            that._updateScaleWidth(this._longestLabelSize);
        }

        that._appendTicksAndLabelsToScales(ticks, labels);
    }

    /**
   * Adds the middle major ticks and their respective labels.
   */
    addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency) {
        const that = this.context;

        let majorTicks = '', majorLabels = '';

        for (let i = 1; i < tickscount; i++) {
            let number = i * ticksDistance + distanceFromFirstToSecond,
                value;

            if (normalLayout) {
                value = parseFloat(that._drawMin) + ticksFrequency * i + distanceModifier;
            }
            else {
                value = parseFloat(that._drawMax) - ticksFrequency * i - distanceModifier;
            }
            if (value.toString() !== that._drawMax.toString()) {
                let htmlValue = that._formatLabel(value.toString()),
                    plot = true;

                that._labelDummy.innerHTML = htmlValue;
                let dimensionValue = that._labelDummy[that._settings.size];

                if (number + dimensionValue >= tickscount * ticksDistance) { // + 32 is an Experimental value
                    plot = false;
                }
                const currentTickAndLabel = this._addMajorTickAndLabel(htmlValue, undefined, plot, value, true);

                majorTicks += currentTickAndLabel.tick;
                majorLabels += currentTickAndLabel.label;
            }
        }
        return { tick: majorTicks, label: majorLabels };
    }

    /**
     * Adds minor ticks.
     */
    addMinorTicks(normalLayout) {
        function getPreciseFraction(i) {
            return parseFloat((i).toFixed(roundCoefficient));
        }

        function addMinorTick(i) {
            if (tickValues.indexOf(i) === -1 && that._numericProcessor.getPreciseModulo(i, minorTicksInterval, moduloCoefficient) === 0) {
                minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(i) + 'px;" class="smart-tick smart-tick-minor"></div>';
            }
        }
        const that = this.context,
            tickValues = that._tickValues,
            nearestPowerOfTen = that._tickIntervalHandler.nearestPowerOfTen,
            minorTicksInterval = that._minorTicksInterval,
            roundCoefficient = Math.log10(nearestPowerOfTen) < 0 ? Math.round(Math.abs(Math.log10(nearestPowerOfTen))) : 0,
            moduloCoefficient = Math.pow(10, roundCoefficient),
            leftOrTop = that._settings.leftOrTop;

        let firstTickValue, secondTickValue, lastTickValue, minorTicks = '';

        if (normalLayout) {
            firstTickValue = tickValues[0];
            secondTickValue = tickValues[1];
            lastTickValue = tickValues[tickValues.length - 1]
        }
        else {
            firstTickValue = tickValues[tickValues.length - 1];
            secondTickValue = tickValues[tickValues.length - 2];
            lastTickValue = tickValues[0]
        }

        if (that.logarithmicScale) {
            addMinorTickOnLogarithmicScale();
        }
        else {
            // minor ticks from the beginning to the second major tick
            for (let i = secondTickValue; i > firstTickValue; i = getPreciseFraction(i - nearestPowerOfTen)) {
                addMinorTick(i);
            }

            // minor ticks from the second major tick to the end
            for (let i = getPreciseFraction(secondTickValue + nearestPowerOfTen); i < lastTickValue; i = getPreciseFraction(i + nearestPowerOfTen)) {
                addMinorTick(i);
            }
        }

        function addMinorTickOnLogarithmicScale() {
            let trackLength = that._measurements.trackLength,
                partialTrackLength = trackLength / tickValues.length,
                modifierCoef = 0.1;

            if (partialTrackLength < 20) {
                modifierCoef = 1;
            }
            else if ((partialTrackLength >= 20) && (partialTrackLength < 40)) {
                modifierCoef = (secondTickValue - firstTickValue) > 1 ? 1 : 0.5;
            }
            else if ((partialTrackLength >= 40) && (partialTrackLength < 80)) {
                modifierCoef = 0.2;
            }

            let nearestPowerOf10BelowMax = Math.floor(that._drawMax),
                distanceToNearestPowerOf10 = that._drawMax - nearestPowerOf10BelowMax,
                ticksOnPowerOf10 = (that._drawMax - that._drawMin) > tickValues.length;

            for (let j = that._drawMax; j > that._drawMin - 1; j = j - 1) {
                let range = distanceToNearestPowerOf10 > 0 ? Math.pow(10, j - distanceToNearestPowerOf10 + 1) : Math.pow(10, j),
                    modifier = range * modifierCoef;

                for (let i = range; i > 0; i = (i - modifier)) {
                    if ((i < that.max) && (i > that.min)) {
                        let value = new Smart.Utilities.BigNumber(Math.log10(i));

                        if (((value % 1 === 0) && ticksOnPowerOf10) || !ticksOnPowerOf10) {
                            minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(value) + 'px;" class="smart-tick smart-tick-minor"></div>';
                        }
                    }
                }
            }
        }
        return minorTicks;
    }

    /**
     * Validates custom ticks.
     */
    validateCustomTicks() {
        const that = this.context;
        let validCustomTicks = [];

        for (let i = 0; i < that.customTicks.length; i++) {
            const currentTick = that.customTicks[i],
                currentTickObject = this.createDescriptor(currentTick);

            if (currentTickObject >= that._minObject && currentTickObject <= that._maxObject) {
                validCustomTicks.push(currentTickObject.toString());
            }
        }

        validCustomTicks.sort(function (a, b) {
            return a - b;
        });

        validCustomTicks = validCustomTicks.filter(function (element, index, array) {
            return !index || element !== array[index - 1];
        });

        that.customTicks = validCustomTicks.slice(0);
    }

    /**
     * Plots the Gauge's ticks and labels.
     */
    addGaugeTicksAndLabels() {
        const that = this.context,
            numericProcessor = this,
            maxLabelHeight = Math.max(that._tickIntervalHandler.labelsSize.minLabelSize, that._tickIntervalHandler.labelsSize.maxLabelSize),
            majorStep = that._majorTicksInterval,
            minorStep = that._minorTicksInterval,
            majorTickValues = {},
            distance = that._distance,
            radius = that._measurements.radius,
            majorTickWidth = radius - distance.majorTickDistance,
            minorTickWidth = radius - distance.minorTickDistance;
        let drawMajor, drawMinor, addLabel, currentAngle, angleAtMin, angleAtMax;

        if (that.ticksVisibility !== 'none' && that._plotTicks !== false) {
            drawMajor = function (angle) {
                that._drawTick(angle, majorTickWidth, 'major');
            };

            drawMinor = function (value) {
                that._drawTick(numericProcessor.getAngleByValue(value, true), minorTickWidth, 'minor');
            };
        }
        else {
            drawMajor = function () { };
            drawMinor = function () { };
        }

        if (that.labelsVisibility !== 'none' && that._plotLabels !== false) {
            addLabel = function (angle, currentLabel, middle) {
                that._drawLabel(angle, currentLabel, distance.labelDistance, middle);
            };
        }
        else {
            addLabel = function () { };
        }

        if (that.inverted === undefined || (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            angleAtMin = that.endAngle;
            angleAtMax = that.startAngle;
        }
        else {
            angleAtMin = that.startAngle;
            angleAtMax = that.endAngle;
        }

        // first major tick and label
        currentAngle = numericProcessor.getAngleByValue(that._drawMin, false);
        drawMajor(currentAngle);
        majorTickValues[that._drawMin] = true;
        addLabel(currentAngle, that.min, false);

        let second = that._drawMin - numericProcessor.getPreciseModulo(that._drawMin, majorStep),
            firstMinTick;

        if (that._drawMin >= 0) {
            second += majorStep;
        }

        // determines the value at the first minor tick
        for (let i = second; i >= that._drawMin; i = i - minorStep) {
            firstMinTick = i;
        }

        // second major tick and label
        currentAngle = numericProcessor.getAngleByValue(second, false);
        drawMajor(currentAngle);
        majorTickValues[second] = true;
        if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMin, numericProcessor.getAngleByValue(second, false, true)) / 360) > maxLabelHeight) {
            addLabel(currentAngle, this.getActualValue(second), second < that._drawMax);
        }

        let i;
        // middle major ticks and labels
        for (i = second + majorStep; i < that._drawMax - majorStep; i += majorStep) {
            currentAngle = numericProcessor.getAngleByValue(i, false);
            drawMajor(currentAngle);
            majorTickValues[i] = true;
            addLabel(currentAngle, this.getActualValue(i), true);
        }

        if (majorTickValues[i] === undefined && i <= that._drawMax) {
            // second-to-last major tick and label
            currentAngle = numericProcessor.getAngleByValue(i, false);
            drawMajor(currentAngle);
            majorTickValues[i] = true;
            if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMax, numericProcessor.getAngleByValue(i, false, true)) / 360) >= maxLabelHeight) {
                addLabel(currentAngle, this.getActualValue(i), true);
            }

            if (that._normalizedStartAngle !== that.endAngle) {
                // last major tick and label
                currentAngle = numericProcessor.getAngleByValue(that._drawMax, false);
                drawMajor(currentAngle);
                majorTickValues[that._drawMax] = true;
                if (2 * Math.PI * that._measurements.innerRadius * (this._getAngleDifference(angleAtMax, angleAtMin) / 360) >= maxLabelHeight) {
                    addLabel(currentAngle, that.max, false);
                }
            }
        }

        // minor ticks
        if (!that.logarithmicScale) {
            for (let j = firstMinTick; j < that._drawMax; j += minorStep) {
                if (majorTickValues[j]) {
                    continue; // does not plot minor ticks over major ones
                }
                drawMinor(j);
            }
        }
        else {
            this.drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor);
        }
    }

    /**
     * Sets toolTip's value and updates the value of the element.
     */
    updateToolTipAndValue(value, oldValue, changeValue) {
        const that = this.context,
            logarithmicScale = that.logarithmicScale;

        that._updateTooltipValue(value);
        if (logarithmicScale) {
            value = parseFloat(Math.pow(10, parseFloat(value)).toFixed(11));
        }

        const stringifiedValue = value.toString();

        that._number = value;
        that._drawValue = logarithmicScale ? Math.log10(stringifiedValue) : value;

        // eslint-disable-next-line
        if (stringifiedValue !== oldValue && changeValue) {
            that.value = that._discardDecimalSeparator(stringifiedValue);

            if (!that._programmaticValueIsSet) {
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            }

            if (that.$.hiddenInput) {
                that.$.hiddenInput.value = that.value;
            }

            that._setAriaValue('valuenow');
        }
    }

    /**
     * Validates the interval property.
     */
    validateInterval(interval) {
        const that = this.context,
            range = that._maxObject - that._minObject;

        if (interval <= 0) {
            interval = 1;
        }

        that._validInterval = Math.min(parseFloat(interval), range);

        that.interval = that._validInterval;
    }

    /**
     * Returns a coerced value based on the interval.
     */
    getCoercedValue(value, useDrawVariables, logarithmicGauge) {
        const that = this.context;

        if (!that.coerce) {
            return value;
        }

        let normalScale = !that.logarithmicScale,
            minValue, maxValue;

        if (that.customInterval) {
            const customTicks = that.customTicks;

            if (customTicks.length === 0) {
                return value;
            }

            normalScale = normalScale || logarithmicGauge;

            if (useDrawVariables !== false) {
                minValue = parseFloat(that._drawMin);
            }
            else {
                minValue = that._minObject;
            }

            let difference = Math.abs(minValue - value),
                closestValue = minValue;

            for (let i = 0; i < customTicks.length; i++) {
                const currentTickObject = this.createDescriptor(customTicks[i]),
                    currentTickValue = normalScale ? currentTickObject : Math.log10(currentTickObject),
                    currentDifference = Math.abs(currentTickValue - value);

                if (currentDifference < difference) {
                    difference = currentDifference;
                    closestValue = currentTickValue;
                }
            }

            return closestValue;
        }

        if (useDrawVariables !== false) {
            minValue = parseFloat(that._drawMin);
            maxValue = parseFloat(that._drawMax);
        }
        else {
            minValue = parseFloat(that.min);
            maxValue = parseFloat(that.max);
        }

        let noMin = value - minValue,
            remainder = this.getPreciseModulo(noMin, parseFloat(that.interval)),
            coef = this.roundCoefficient;

        if (remainder === 0) {
            return value;
        }

        if (this.roundCoefficient === 0) {
            coef = 12;
        }

        let lowerValue = parseFloat((noMin - remainder).toFixed(coef)),
            greaterValue = lowerValue + parseFloat(that.interval);

        if (((that.max - that.min) <= parseFloat(that.interval)) && normalScale) {
            let min = minValue,
                max = maxValue;

            return value >= min + (max - min) / 2 ? max : min;
        }

        if (Math.abs(noMin - lowerValue) < Math.abs(noMin - greaterValue)) {
            return lowerValue + minValue;
        }
        else {
            const biggerValue = greaterValue + minValue;

            return biggerValue > maxValue ? lowerValue + minValue : biggerValue;
        }
    }

    /**
       * Updates the value of the Tank and the "value" property and triggers the respective events.
       */
    updateValue(value) {
        const that = this.context,
            renderedValue = this.validate(value, that._minObject, that._maxObject),
            oldActualValue = that.value;

        if (value.toString() !== oldActualValue.toString() || that._scaleTypeChangedFlag) {
            that.value = value.toString();
            that._number = renderedValue;

            if (!that._programmaticValueIsSet) {
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldActualValue });
            }
        }
        else {
            that.value = typeof (value) === 'string' ? value : value.toString();
        }

        that._drawValue = that.logarithmicScale ? Math.log10(renderedValue).toString() : renderedValue.toString();
        that._moveThumbBasedOnValue(that._drawValue);

        if (that.$.hiddenInput) {
            that.$.hiddenInput.value = that.value;
        }

        that._setAriaValue('valuenow');
    }

    /**
     * Returns value per pixel.
     */
    getValuePerPx(range, pxRange) {
        return parseFloat(range) / pxRange;
    }

    /**
     * Restricts the thumbs to not pass each other.
     */
    restrictValue(values) {
        if (values[1] < values[0]) {
            values[1] = values[0];
        }
    }

    /**
     * Locks the Gauge's interaction with the mouse.
     */
    lockRotation(directionCondition, newValue) {
        const that = this.context;

        if (directionCondition && newValue < that._number) {
            that._lockCW = true;
            if (newValue < that._maxObject) {
                return that._maxObject;
            }
        }
        else if (!directionCondition && newValue > that._number) {
            that._lockCCW = true;
            if (newValue > that._minObject) {
                return that._minObject;
            }
        }
    }

    /**
     * Gets the angle-range coefficient.
     */
    getAngleRangeCoefficient() {
        const that = this.context;

        that._angleRangeCoefficient = that._angleDifference / that._range;
    }
});

/**
 * A class for processesing complex numbers.
 */
Smart.Utilities.Assign('ComplexNumericProcessor', class ComplexNumericProcessor extends Smart.Utilities.BaseNumericProcessor {
    constructor(context, numericFormatProperty) {
        super(context, numericFormatProperty);
        this.context = context;
    }

    /**
     * Creates a Complex number descriptor.
     */
    createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax, discardRadix, presetComplexNumber) {
        let returnValue;

        if (presetComplexNumber) {
            returnValue = presetComplexNumber;
        }
        else {
            if (initialValue.constructor === this.complexConstructor) {
                returnValue = new this.complexConstructor(initialValue.realPart, initialValue.imaginaryPart);
            }
            else {
                returnValue = new this.complexConstructor(initialValue);
            }
        }
        if (validateMinMax) {
            returnValue = this.validate(returnValue, this.context._minObject, this.context._maxObject);
        }
        return returnValue;
    }

    /**
     * Validates value.
     */
    validate(initialValue, min, max) {
        let returnValue = initialValue;

        if (min !== -Infinity) {
            if (this.compareComplexNumbers(initialValue, min) === -1) {
                returnValue = new this.complexConstructor(min.realPart, min.imaginaryPart);
            }
        }
        else if (max !== Infinity) {
            if (this.compareComplexNumbers(initialValue, max) === 1) {
                returnValue = new this.complexConstructor(max.realPart, max.imaginaryPart);
            }
        }
        return returnValue;
    }

    /**
     * Complex number compare method.
     */
    compare(initialValue, otherValue, thorough) {
        if (thorough !== true) {
            return this.compareComplexNumbers(initialValue, otherValue) !== 0;
        }

        return this.compareComplexNumbers(initialValue, otherValue);
    }

    /**
     * Validates min/max.
     */
    validateMinMax(validateMin, validateMax) {
        const that = this.context;

        if (validateMin) {
            if (that.min === null || that._regexSpecial.inf.test(that.min)) {
                that.min = -Infinity;
                that._minObject = -Infinity;
            }
            else {
                that._minObject = new this.complexConstructor(that.min);
            }
        }

        if (validateMax) {
            if (that.max === null || that._regexSpecial.inf.test(that.max)) {
                that.max = Infinity;
                that._maxObject = Infinity;
            }
            else {
                that._maxObject = new this.complexConstructor(that.max);
            }
        }
    }

    /**
     * Increments/Decrements value. Keyboard navigation operations.
     */
    incrementDecrement(initialValue, operation) {
        let returnValue = new this.complexConstructor(initialValue.realPart, initialValue.imaginaryPart),
            spinButtonsStepObject = this.context._spinButtonsStepObject;

        if (operation === 'add') {
            returnValue.realPart += spinButtonsStepObject.realPart;
            returnValue.imaginaryPart += spinButtonsStepObject.imaginaryPart;
        }
        else {
            returnValue.realPart -= spinButtonsStepObject.realPart;
            returnValue.imaginaryPart -= spinButtonsStepObject.imaginaryPart;
        }
        return returnValue;
    }

    /**
     * Renders the value. Complex number renderer.
     */
    render(initialValue) {
        let returnValue = initialValue;

        if (this.context._regexSpecial.nonNumericValue.test(initialValue) === false) {
            let realPart = returnValue.realPart,
                imaginaryPart = returnValue.imaginaryPart,
                sign,
                significantDigits = this.context.significantDigits,
                precisionDigits = this.context.precisionDigits;

            if (imaginaryPart >= 0) {
                sign = '+';
            }
            else {
                sign = '-';
                imaginaryPart = Math.abs(imaginaryPart);
            }

            const realPartRenderer = new Smart.Utilities.NumberRenderer(realPart),
                imaginaryPartRenderer = new Smart.Utilities.NumberRenderer(imaginaryPart);

            if (this.context.scientificNotation) {
                realPart = realPartRenderer.toScientific(significantDigits, precisionDigits);
                imaginaryPart = imaginaryPartRenderer.toScientific(significantDigits, precisionDigits);
            }
            else {
                realPart = realPartRenderer.toDigits(significantDigits, precisionDigits);
                imaginaryPart = imaginaryPartRenderer.toDigits(significantDigits, precisionDigits);
            }

            returnValue = `${realPart} ${sign} ${imaginaryPart}i`;
        }
        return returnValue;
    }

    /**
     * Complex number compare method.
     */
    compareComplexNumbers(left, right) {
        if ((left instanceof this.complexConstructor === false) || (right instanceof this.complexConstructor === false)) {
            // if at least one of the numbers is not an Smart.Utilities.Complex object, the numbers are different
            return -1;
        }

        const leftReal = left.realPart,
            rightReal = right.realPart;

        if (leftReal < rightReal) {
            return -1;
        }
        else if (leftReal > rightReal) {
            return 1;
        }
        else {
            const leftImaginary = left.imaginaryPart,
                rightImaginary = right.imaginaryPart;

            if (leftImaginary < rightImaginary) {
                return -1;
            }
            else if (leftImaginary > rightImaginary) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
});

Smart.Utilities.Assign('NumberRenderer', class NumberRenderer {
    constructor(numericValue) {
        const that = this;

        that.numericValue = numericValue;

        that.powersToPrefixes = { '24': 'Y', '21': 'Z', '18': 'E', '15': 'P', '12': 'T', '9': 'G', '6': 'M', '3': 'k', '0': '', '-3': 'm', '-6': 'u', '-9': 'n', '-12': 'p', '-15': 'f', '-18': 'a', '-21': 'z', '-24': 'y' };

        // dummy localization object
        that.localizationObject = {
            currencysymbol: '$',
            currencysymbolposition: 'before',
            decimalseparator: '.',
            thousandsseparator: ',',
            defaultPrecision: 2
        }
    }

    isENotation(value) {
        return new RegExp(/e/i).test(value);
    }

    /**
     * Converts a large exponential value to its decimal representation (used when "inputFormat" is 'integer').
     */
    largeExponentialToDecimal(exponential) {
        let validateExponent;

        if (exponential === undefined) {
            exponential = this.numericValue;
            validateExponent = true;
        }

        let stringExponential = exponential.toString().toLowerCase(),
            indexOfE = stringExponential.indexOf('e'),
            mantissa = new Smart.Utilities.BigNumber(stringExponential.slice(0, indexOfE)),
            sign = stringExponential.slice(indexOfE + 1, indexOfE + 2);

        if (sign !== '+' && sign !== '-') {
            stringExponential = stringExponential.slice(0, indexOfE) + 'e+' + stringExponential.slice(indexOfE + 1);
            sign = '+';
        }

        let exponent = stringExponential.slice(indexOfE + 2),
            bigTen = new Smart.Utilities.BigNumber(10),
            multyplyBy = bigTen.pow(sign + (validateExponent ? Math.min(20, exponent) : exponent)),
            result = mantissa.multiply(multyplyBy);

        return result.toString();
    }

    /**
     * Converts a BigNumber integer value to an exponential value
     */
    bigNumberToExponent(significantDigits, forceExponentialResult) {
        let value = this.numericValue;

        if (value.constructor !== Smart.Utilities.BigNumber) {
            value = new Smart.Utilities.BigNumber(value);
        }

        const numberLength = value._f;
        let numericString = value.toString();

        if (numberLength <= 10) {
            // 32-bit or lower
            if (forceExponentialResult) {
                return parseFloat(numericString).toExponential(significantDigits !== null ? significantDigits - 1 : undefined);
            }
            else {
                return new Smart.Utilities.NumberRenderer(parseFloat(numericString)).toDigits(significantDigits);
            }
        }
        else {
            // 64-bit
            if (significantDigits >= numberLength && !forceExponentialResult) {
                return numericString;
            }
            else {
                let sign;
                if (value._s === false) {
                    sign = '';
                }
                else {
                    sign = '-';
                    numericString = numericString.slice(1);
                }

                const nextDigit = parseFloat(numericString.slice(significantDigits, significantDigits + 1));

                if (nextDigit >= 5) {
                    numericString = new Smart.Utilities.BigNumber(numericString.slice(0, significantDigits)).add(1).toString();
                }

                let digitsAfterDecimalSeparator = numericString.slice(1, significantDigits);

                if (forceExponentialResult) {
                    significantDigits--;

                    if (digitsAfterDecimalSeparator.length > 0 && significantDigits > digitsAfterDecimalSeparator.length) {
                        digitsAfterDecimalSeparator = digitsAfterDecimalSeparator + ('0').repeat(significantDigits - digitsAfterDecimalSeparator.length);
                    }
                    else if (digitsAfterDecimalSeparator.length === 0) {
                        digitsAfterDecimalSeparator = ('0').repeat(significantDigits);
                    }
                }
                else {
                    while (digitsAfterDecimalSeparator.length > 0 && digitsAfterDecimalSeparator.charAt(digitsAfterDecimalSeparator.length - 1) === '0') {
                        digitsAfterDecimalSeparator = digitsAfterDecimalSeparator.slice(0, digitsAfterDecimalSeparator.length - 1);
                    }
                }

                const decimalSeparator = digitsAfterDecimalSeparator.length > 0 ? '.' : '',
                    power = numberLength - 1;

                return sign + numericString.slice(0, 1) + decimalSeparator + digitsAfterDecimalSeparator + 'E+' + power;
            }
        }
    }

    /**
     * Converts a plain number to scientific notation.
     */
    toScientific() {
        const that = this;

        let exponentialValue;

        if (that.numericValue._d) {
            exponentialValue = that.bigNumberToExponent(arguments[0] !== null ? arguments[0] : arguments[1] + 1, true).toLowerCase();
        }
        else {
            exponentialValue = Number(that.numericValue.toString()).toExponential();
        }

        if (isNaN(exponentialValue)) {
            return exponentialValue;
        }

        const indexOfE = exponentialValue.indexOf('e'),
            power = exponentialValue.slice(indexOfE + 1);
        let coefficient = parseFloat(exponentialValue.slice(0, indexOfE));

        const remainderPower = parseInt(power, 10) % 3;

        if (remainderPower > 0) {
            for (let i = 0; i < remainderPower; i++) {
                coefficient = coefficient * 10;
            }
        }
        else if (remainderPower < 0) {
            const ignored = Smart.Utilities.BigNumber.ignoreBigIntNativeSupport;

            Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = true;
            coefficient = parseFloat(new Smart.Utilities.BigNumber(coefficient).multiply(Math.pow(10, remainderPower)).toString());
            Smart.Utilities.BigNumber.ignoreBigIntNativeSupport = ignored;
        }

        if (power > 0) {
            const removeSign = coefficient >= 0 ? 0 : 1,
                floatFix = exponentialValue.slice(removeSign, indexOfE).length - remainderPower - 2;
            if (floatFix >= 0) {
                coefficient = coefficient.toFixed(floatFix);
            }
        }

        const coefficientRenderer = new Smart.Utilities.NumberRenderer(coefficient);

        coefficient = coefficientRenderer.toDigits(arguments[0], arguments[1]);

        const finalPower = (parseInt(power, 10) - remainderPower),
            scientificValue = coefficient + that.powersToPrefixes[finalPower.toString()];

        return scientificValue;
    }

    /**
     * Converts a BigNumber to scientific notation.
     */
    bigNumberToScientific() {
        const that = this,
            power = that.numericValue._f - 1,
            remainderPower = parseInt(power, 10) % 3,
            finalPower = parseInt(power, 10) - remainderPower;
        let stringRepresentation = that.numericValue.toString(),
            sign, scientificValue;

        if (stringRepresentation.charAt(0) === '-') {
            sign = '-';
            stringRepresentation = stringRepresentation.slice(1);
        }
        else {
            sign = '';
        }

        if (arguments[0] !== null) {
            scientificValue = stringRepresentation.slice(0, arguments[0]);

            if (parseFloat(stringRepresentation.slice(arguments[0], arguments[0] + 1)) >= 5) {
                scientificValue = new Smart.Utilities.BigNumber(scientificValue).add(1).toString();
            }

            while (scientificValue.length > 1 + remainderPower && scientificValue.charAt(scientificValue.length - 1) === '0') {
                scientificValue = scientificValue.slice(0, scientificValue.length - 1);
            }
        }
        else if (arguments[1] !== null) {
            scientificValue = stringRepresentation.slice(0, arguments[1] + 1);

            if (parseFloat(stringRepresentation.slice(arguments[1] + 1, arguments[1] + 2)) >= 5) {
                scientificValue = new Smart.Utilities.BigNumber(scientificValue).add(1).toString();
            }

            if (arguments[1] + remainderPower > scientificValue.length - 1) {
                scientificValue = scientificValue + ('0').repeat(arguments[1] + remainderPower - scientificValue.length + 1);
            }
        }

        if (scientificValue.length > 1 + remainderPower) {
            scientificValue = scientificValue.slice(0, 1 + remainderPower) + '.' + scientificValue.slice(1 + remainderPower);
        }

        return sign + scientificValue + that.powersToPrefixes[finalPower.toString()];
    }

    /**
     * Applies the significant digits or precision digits settings to the number.
     */
    toDigits(significantDigits, precisionDigits) {
        const that = this;
        let renderedValue;

        if (significantDigits !== null) {
            renderedValue = that.applySignificantDigits(significantDigits);
        }
        else if (precisionDigits !== null) {
            renderedValue = that.applyPrecisionDigits(precisionDigits);
        }
        else {
            renderedValue = that.applySignificantDigits(8);
        }
        return renderedValue;
    }

    /**
     * Returns the number with a specified number of significant digits.
     */
    applySignificantDigits(significantDigits) {
        const that = this;

        significantDigits = Math.max(1, Math.min(significantDigits, 21));

        // removes insignificant trailing zeroes
        function removeTrailingZeroes(value) {
            while (value.charAt(value.length - 1) === '0') {
                value = value.slice(0, -1);
            }
            if (value.charAt(value.length - 1) === '.') {
                value = value.slice(0, -1);
            }
            return value;
        }

        let renderedValue = parseFloat(that.numericValue).toPrecision(significantDigits).toUpperCase();

        if (renderedValue.indexOf('.') !== -1) {
            if (that.isENotation(renderedValue)) {
                const indexOfDecimalSeparator = renderedValue.indexOf('.'),
                    indexOfE = renderedValue.indexOf('E')

                let digitsAfterDecimalSeparator = renderedValue.slice(indexOfDecimalSeparator, indexOfE);
                digitsAfterDecimalSeparator = removeTrailingZeroes(digitsAfterDecimalSeparator);
                renderedValue = renderedValue.slice(0, indexOfDecimalSeparator) + digitsAfterDecimalSeparator + renderedValue.slice(indexOfE);
            }
            else {
                renderedValue = removeTrailingZeroes(renderedValue);
            }
        }

        return renderedValue;
    }

    /**
     * Returns the number with a specified number of precision digits.
     */
    applyPrecisionDigits(precisionDigits) {
        const that = this;

        precisionDigits = Math.max(0, Math.min(precisionDigits, 20));

        let renderedValue = parseFloat(that.numericValue).toFixed(precisionDigits);

        if (that.isENotation(renderedValue)) {
            renderedValue = that.largeExponentialToDecimal(renderedValue) + '.' + '0'.repeat(precisionDigits);
        }

        return renderedValue;
    }

    /**
     * Returns the logarithm of a value (for use in logarithmic scales).
     */
    getLogarithm(base) {
        const value = this.numericValue;
        let result;

        if (base === undefined) {
            base = 10;
        }

        if (base === 10) {
            try {
                result = Math.log10(value);
            }
            catch (error) {
                result = Math.log(value) / Math.log(10);
            }
        }
        else {
            result = Math.log(value) / Math.log(base);
        }

        return result;
    }

    /**
     * Applies separators.
     */
    applySeparators(number, noThousandsSeparator) {
        const that = this;

        number = number.toString();

        const dotIndex = number.indexOf('.');

        if (dotIndex !== -1) {
            const integerPart = number.slice(0, dotIndex),
                fractionalPart = number.slice(dotIndex + 1);

            return that.applyThousandsSeparator(integerPart, noThousandsSeparator) + that.localizationObject.decimalseparator + fractionalPart;
        }
        else {
            return that.applyThousandsSeparator(number, noThousandsSeparator);
        }
    }

    /**
     * Applies thousands separator.
     */
    applyThousandsSeparator(number, noThousandsSeparator) {
        if (noThousandsSeparator) {
            return number;
        }

        let sign = '';

        number = number.toString();

        if (number.charAt(0) === '-') {
            sign = '-';
            number = number.slice(1);
        }

        let digits = number.split('').reverse();

        for (let i = 2; i < digits.length - 1; i += 3) {
            digits[i] = this.localizationObject.thousandsseparator + digits[i];
        }

        digits.reverse();
        digits = digits.join('');

        return sign + digits;
    }

    /**
     * Returns a formatted representation of a number.
     */
    formatNumber(number, formatSpecifier, wordLength) {
        const that = this;

        if (arguments[3] === undefined) {
            delete that._ignoreMinus;
        }

        delete that._wordLengthNumber;

        if (!/^([a-zA-Z]\d*)$/g.test(formatSpecifier)) {
            try {
                const result = that.applyCustomFormat(number, formatSpecifier);

                return result;
            }
            catch (error) {
                return number.toString();
            }
        }

        const format = formatSpecifier.slice(0, 1);
        let precision = formatSpecifier.slice(1);

        if (precision !== '') {
            if (isNaN(parseFloat(precision)) || parseFloat(precision) < 0 || parseFloat(precision) > 99) {
                precision = '';
            }
            else if (parseFloat(precision) % 1 !== 0) {
                precision = Math.round(precision);
            }
        }

        if (number._d) {
            that.inputFormat = 'integer';
        }
        else if (number.imaginaryPart) {
            return that.formatComplexNumber(number, formatSpecifier, format, precision);
        }
        else {
            that.inputFormat = 'floatingPoint';
        }

        let numericProcessor = new Smart.Utilities.NumericProcessor(that, 'inputFormat'),
            numericObject = numericProcessor.createDescriptor(number),
            result;

        that._wordLengthNumber = numericProcessor.getWordLength(wordLength ? wordLength : 'int32');

        if (that.inputFormat === 'integer') {
            numericObject = numericProcessor.round(numericObject);
        }

        that.numericValue = numericObject;

        switch (format) {
            case 'C':
            case 'c':
                // Currency
                if (precision === '') {
                    precision = that.localizationObject.defaultPrecision;
                }

                precision = parseFloat(precision);

                if (that.inputFormat === 'floatingPoint') {
                    result = that.applyPrecisionDigits(precision);
                }
                else {
                    result = numericObject.toString() + (precision > 0 ? '.' + ('0').repeat(precision) : '');
                }

                result = that.applySeparators(result);

                if (that.localizationObject.currencysymbolposition === 'before') {
                    if (result.charAt(0) === '-') {
                        return '-' + that.localizationObject.currencysymbol + result.slice(1);
                    }

                    return that.localizationObject.currencysymbol + result;
                }

                return result + ' ' + that.localizationObject.currencysymbol;
            case 'D':
            case 'd': {
                // Decimal; integer-only
                result = numericObject;

                if (that.inputFormat === 'floatingPoint') {
                    result = Math.round(numericObject);
                }

                result = result.toString();

                if (precision === '') {
                    return result;
                }

                let sign = '';

                if (result.charAt(0) === '-') {
                    sign = '-';
                    result = result.slice(1);
                }

                const difference = precision - result.length;

                if (difference > 0) {
                    result = ('0').repeat(difference) + result;
                }

                return sign + result;
            }
            case 'E':
            case 'e':
            case 'U':
            case 'u': {
                // Exponential (scientific)
                if (precision === '') {
                    precision = 6;
                }

                if (that.inputFormat === 'floatingPoint') {
                    result = numericObject.toExponential(precision);
                }
                else {
                    result = that.bigNumberToExponent(parseFloat(precision) + 1, true).toLowerCase();
                }

                const indexOfE = result.indexOf('e'),
                    numbersInExponent = result.slice(indexOfE + 2).length;

                if (numbersInExponent < 3) {
                    result = result.slice(0, indexOfE + 2) + ('0').repeat(3 - numbersInExponent) + result.slice(indexOfE + 2);
                }

                if (format.toLowerCase() === 'u') {
                    return that.exponentialToSuperscript(that.applySeparators(result, true));
                }

                if (format === 'E') {
                    result = result.toUpperCase();
                }

                return that.applySeparators(result, true);
            }
            case 'F':
            case 'f':
            case 'N':
            case 'n':
                // Fixed-point and Number
                if (precision === '') {
                    precision = that.localizationObject.defaultPrecision;
                }

                precision = parseFloat(precision);

                if (that.inputFormat === 'floatingPoint') {
                    result = that.applyPrecisionDigits(precision);
                }
                else {
                    result = numericObject.toString() + (precision > 0 ? '.' + ('0').repeat(precision) : '');
                }

                return that.applySeparators(result, format.toLowerCase() === 'f');
            case 'G':
            case 'g': {
                // General
                if (precision === '' || precision === '0') {
                    if (that.inputFormat === 'floatingPoint') {
                        precision = 15;
                    }
                    else {
                        switch (wordLength) {
                            case 'int8':
                            case 'uint8':
                                precision = 3;
                                break;
                            case 'int16':
                            case 'uint16':
                                precision = 5;
                                break;
                            case 'int64':
                                precision = 19;
                                break;
                            case 'uint64':
                                precision = 20;
                                break;
                            default:
                                precision = 10;
                        }
                    }
                }

                precision = parseFloat(precision);

                let scientificRepresentation = that.formatNumber(number, 'E' + precision, wordLength),
                    eIndex = scientificRepresentation.indexOf('E');
                const exponent = parseInt(scientificRepresentation.slice(eIndex + 1), 10);

                if (exponent > -5 && exponent < precision) {
                    if (that.inputFormat === 'floatingPoint') {
                        return that.applySeparators(that.applySignificantDigits(precision), true);
                    }
                    else {
                        return numericObject.toString();
                    }
                }

                // removes leading zero in exponent
                if (exponent > -100 && exponent < 100) {
                    scientificRepresentation = scientificRepresentation.slice(0, eIndex + 2) + scientificRepresentation.slice(eIndex + 3);
                }

                // removes trailing zeros
                if (scientificRepresentation.indexOf(that.localizationObject.decimalseparator) !== -1) {
                    while (scientificRepresentation.charAt(eIndex - 1) === '0') {
                        scientificRepresentation = scientificRepresentation.slice(0, eIndex - 1) + scientificRepresentation.slice(eIndex);
                        eIndex = scientificRepresentation.indexOf('E');
                    }

                    if (scientificRepresentation.charAt(eIndex - 1) === that.localizationObject.decimalseparator) {
                        scientificRepresentation = scientificRepresentation.slice(0, eIndex - 1) + scientificRepresentation.slice(eIndex);
                    }
                }

                if (format === 'g') {
                    scientificRepresentation = scientificRepresentation.toLowerCase();
                }

                return scientificRepresentation;
            }
            case 'P':
            case 'p':
                // Percent
                if (precision === '') {
                    precision = that.localizationObject.defaultPrecision;
                }

                precision = parseFloat(precision);

                if (that.inputFormat === 'floatingPoint') {
                    that.numericValue = numericObject * 100;
                    result = that.applyPrecisionDigits(precision);
                }
                else {
                    result = (numericObject.multiply(100)).toString() + (precision > 0 ? '.' + ('0').repeat(precision) : '');
                }

                return that.applySeparators(result) + ' %';
            case 'B':
            case 'b':
            case 'O':
            case 'o':
            case 'X':
            case 'x': {
                // Binary, Octal, and Hexadecimal; integer-only
                if (that.inputFormat !== 'integer') {
                    that.inputFormat = 'integer';
                    numericProcessor = new Smart.Utilities.NumericProcessor(that, 'inputFormat');
                    numericObject = numericProcessor.round(numericProcessor.createDescriptor(number));
                }

                let radix;

                switch (format) {
                    case 'B':
                    case 'b':
                        radix = 2;
                        break;
                    case 'O':
                    case 'o':
                        radix = 8;
                        break;
                    default:
                        radix = 16;
                }

                result = numericObject.toString(radix, that._wordLengthNumber);

                if (precision !== '') {
                    const leadingZeros = parseFloat(precision) - result.length;

                    if (leadingZeros > 0) {
                        result = ('0').repeat(leadingZeros) + result;
                    }
                }

                if (format === 'x') {
                    result = result.toLowerCase();
                }

                return result;
            }
            case 'S':
            case 's':
                if (precision === '') {
                    precision = that.localizationObject.defaultPrecision;
                }

                precision = parseFloat(precision);

                return that.toScientific(null, precision).replace('.', that.localizationObject.decimalseparator);
            default:
                return number.toString();
        }
    }

    /**
     * Returns a formatted representation of a complex number.
     */
    formatComplexNumber(number, formatSpecifier, format) {
        const that = this;

        switch (format) {
            case 'E':
            case 'e':
            case 'U':
            case 'u':
            case 'F':
            case 'f':
            case 'G':
            case 'g':
            case 'N':
            case 'n':
            case 'S':
            case 's':
                if (number.imaginaryPart >= 0) {
                    return that.formatNumber(number.realPart, formatSpecifier) + ' + ' + that.formatNumber(number.imaginaryPart, formatSpecifier) + 'i';
                }
                else {
                    return that.formatNumber(number.realPart, formatSpecifier) + ' - ' + that.formatNumber(Math.abs(number.imaginaryPart), formatSpecifier) + 'i';
                }
            default:
                return number.toString();
        }
    }

    /**
     * Returns a formatted representation of a number.
     */
    toString(number, formatSpecifier, wordLength) {
        if (formatSpecifier) {
            return this.formatNumber(number, formatSpecifier, wordLength);
        }
        else {
            return number.toString();
        }
    }

    /**
     * Applies a custom number format.
     */
    applyCustomFormat(number, formatSpecifier) {
        const that = this;

        //formatSpecifier = formatSpecifier.replace(/_.|\[\w*\]|.\*|\*./g, '');
        formatSpecifier = formatSpecifier.replace(/_.|\[\w*\]|\*/g, '');
        formatSpecifier = formatSpecifier.replace(/\?/g, '#');

        const sections = formatSpecifier.split(';');

        if (typeof number === 'string' && isNaN(number)) {
            return sections[sections.length - 1].replace(/"/g, '').replace(/@/g, number.toString());
        }

        if (number._d) {
            that.inputFormat = 'integer';
        }
        else if (number.imaginaryPart) {
            return number.toString();
        }
        else {
            number = parseFloat(number);
            that.inputFormat = 'floatingPoint';
        }

        let numericProcessor = new Smart.Utilities.NumericProcessor(that, 'inputFormat'),
            numericObject = numericProcessor.createDescriptor(number);

        if (that.inputFormat === 'integer') {
            numericObject = numericProcessor.round(numericObject);
        }

        that.numericProcessor = numericProcessor;

        const currentSection = that.getRelevantFormatSection(sections, numericObject);

        if (currentSection === undefined) {
            return number.toString();
        }

        if (currentSection.indexOf('@') !== -1) {
            return sections[sections.length - 1].replace(/"/g, '').replace(/@/g, number.toString());
        }

        const percentage = currentSection.replace(/".*"/g, '').indexOf('%') !== -1,
            textParts = that.getTextParts(currentSection);

        if (textParts.main.toLowerCase().indexOf('e') !== -1) {
            return that.applyCustomExponentialFormat(numericObject, textParts, numericProcessor);
        }

        if (textParts.main.indexOf('/') !== -1) {
            return that.applyCustomFractionalFormat(numericObject, textParts, numericProcessor);
        }

        if (percentage) {
            if (that.inputFormat === 'integer') {
                numericObject = numericObject.multiply(100);
            }
            else {
                numericObject = numericObject * 100;
            }
        }

        if (textParts.main === '') {
            if (!percentage) {
                return textParts.suffix;
            }

            let stringifiedNumber = numericObject.toString();

            if (that._ignoreMinus && stringifiedNumber.charAt(0) === '-') {
                stringifiedNumber = stringifiedNumber.slice(1);
            }

            return stringifiedNumber + textParts.suffix;
        }

        let numberFormat = textParts.main.replace(/[^0#,. \/]/g, ''),
            indexOfPoint = numberFormat.indexOf('.');

        if (indexOfPoint !== -1) {
            numberFormat = numberFormat.substring(0, indexOfPoint + 1) + numberFormat.substring(indexOfPoint + 1).replace(/\./g, '');

            // removes unnecessary trailing zero
            if (numberFormat.charAt(numberFormat.length - 1) === '.') {
                numberFormat = numberFormat.slice(0, numberFormat.length - 1);
            }

            if (indexOfPoint === 0) {
                numberFormat = '#' + numberFormat;
            }
        }

        // scales the number down by 1000 for every trailing comma
        while (numberFormat.charAt(numberFormat.length - 1) === ',') {
            numberFormat = numberFormat.slice(0, numberFormat.length - 1);

            if (that.inputFormat === 'floatingPoint') {
                numericObject /= 1000;
            }
            else {
                numericObject = numericObject.multiply(0.001);
            }
        }

        if (that.inputFormat === 'integer') {
            numericObject = numericProcessor.round(numericObject);
        }

        const thousandsSeparator = numberFormat.indexOf(',') !== -1;

        numberFormat = numberFormat.replace(/,/g, '');

        const numberFormatParts = numberFormat.split('.'),
            wholePartFormat = numberFormatParts[0];
        let decimalPartFormat = numberFormatParts[1],
            result = '';

        if (numberFormatParts.length === 1) {
            if (that.inputFormat === 'floatingPoint') {
                numericObject = numericProcessor.round(numericObject);
            }

            result = numericObject.toString();

            return that.setTextParts(that.formatWholeNumber(result, wholePartFormat, thousandsSeparator), textParts);
        }

        result = numericObject.toString();

        let numberParts = result.split('.'),
            formattedWholeNumber = that.formatWholeNumber(numberParts[0], wholePartFormat, thousandsSeparator),
            decimalNumber = numberParts[1] || '';

        if (decimalPartFormat.length <= decimalNumber.length) {
            result = parseFloat(numericObject.toFixed(decimalPartFormat.length)).toString();
            numberParts = result.split('.');
            formattedWholeNumber = that.formatWholeNumber(numberParts[0], wholePartFormat, thousandsSeparator);
            decimalNumber = numberParts[1] || '';

            if (decimalNumber) {
                return that.setTextParts(formattedWholeNumber + that.localizationObject.decimalseparator + decimalNumber.slice(0, decimalPartFormat.length), textParts);
            }
        }

        decimalPartFormat = decimalPartFormat.slice(decimalNumber.length - decimalPartFormat.length);

        let lastZeroIndex = decimalPartFormat.lastIndexOf('0');

        if (lastZeroIndex === -1) {
            if (decimalNumber === '') {
                return that.setTextParts(formattedWholeNumber, textParts);
            }

            return that.setTextParts(formattedWholeNumber + that.localizationObject.decimalseparator + decimalNumber, textParts);
        }
        else {
            return that.setTextParts(formattedWholeNumber + that.localizationObject.decimalseparator + decimalNumber + '0'.repeat(lastZeroIndex + 1), textParts);
        }
    }

    /**
     * Returns relevant section of custom format specifier.
     */
    getRelevantFormatSection(sections, number) {
        const that = this,
            compareResult = that.numericProcessor.compare(number, 0, true);

        if (compareResult === 1) {
            return sections[0];
        }

        let negativeNumberGroup, zeroGroup;

        if (sections.length >= 3) {
            that._ignoreMinus = true;
            negativeNumberGroup = 1;
            zeroGroup = 2;
        }
        else if (sections.length === 2) {
            that._ignoreMinus = true;
            zeroGroup = 0;
            negativeNumberGroup = 1;
        }
        else if (sections.length === 1) {
            zeroGroup = 0;
            negativeNumberGroup = 0;
        }

        if (compareResult === 0) {
            return sections[zeroGroup];
        }

        if (compareResult === -1) {
            return sections[negativeNumberGroup];
        }
    }

    /**
     * Gets text parts of custom number format.
     */
    getTextParts(currentSection) {
        const withoutQuotedText = currentSection.replace(/"[^"]*"/g, ''),
            quotedSections = currentSection.match(/"[^"]*"/g),
            firstMainIndex = withoutQuotedText.search(/0|#|\./g),
            lastMainIndex = Math.max(withoutQuotedText.lastIndexOf('0'), withoutQuotedText.lastIndexOf('#'), withoutQuotedText.lastIndexOf('.'), withoutQuotedText.lastIndexOf(',')),
            main = withoutQuotedText.slice(firstMainIndex, lastMainIndex + 1);

        if (main === '') {
            return { prefix: '', main: '', suffix: currentSection.replace(/"/g, '') };
        }

        let firstIndex = currentSection.indexOf(main),
            lastIndex = firstIndex + main.length;

        if (quotedSections) {
            for (let i = 0; i < quotedSections.length; i++) {
                const sectionIndex = currentSection.indexOf(quotedSections[i]);

                if (firstIndex >= sectionIndex && lastIndex <= sectionIndex + quotedSections[i].length) {
                    firstIndex = currentSection.indexOf(main, sectionIndex + quotedSections[i].length);
                    lastIndex = firstIndex + main.length;
                }
            }
        }

        const prefix = currentSection.slice(0, firstIndex).replace(/"/g, ''),
            suffix = currentSection.slice(lastIndex).replace(/"/g, '');

        return { prefix: prefix, main: main, suffix: suffix };
    }

    /**
     * Applies custom exponential format.
     */
    applyCustomExponentialFormat(number, textParts, numericProcessor) {
        const that = this;
        let format = textParts.main,
            result;
        const thousandsSeparator = format.indexOf(',') !== -1;

        // format validation - start
        format = format.replace(/[^0#.eE+-]/g, '');

        const indexOfE = format.toLowerCase().indexOf('e');

        format = format.substring(0, indexOfE + 1) + format.substring(indexOfE + 1).replace(/[eE\.]/g, '');

        const eLetter = format.charAt(indexOfE),
            indexOfPoint = format.indexOf('.');

        if (indexOfPoint !== -1) {
            format = format.substring(0, indexOfPoint + 1) + format.substring(indexOfPoint + 1).replace(/\./g, '');
        }

        if (format.charAt(format.length - 1) === '.') {
            format = format.slice(0, format.length - 1);
        }
        // format validation - end

        const parts = format.split(eLetter);
        let firstPart = parts[0];
        const significantParts = firstPart.split('.'),
            significantPart1 = significantParts[0],
            significantPart2 = significantParts[1],
            secondPart = parts[1];
        let numberWholePart = number.toString().split('.')[0].replace(/-/, ''),
            exponentModifier = 0;

        if (numberWholePart === '0' && numericProcessor.compare(number, 0)) {
            let difference = significantPart1.length - 1;

            while (parseInt(number) === 0) {
                exponentModifier++;
                number *= 10;
            }

            numberWholePart = number.toString().split('.')[0].replace(/-/, '');
            exponentModifier += difference;
            number *= Math.pow(10, difference);
        }

        if (thousandsSeparator) {
            firstPart = firstPart.slice(0, 1) + ',' + firstPart.slice(1);
        }

        if (numberWholePart.length <= significantPart1.length) {
            result = that.formatNumber(number, firstPart, undefined, true) + eLetter + that.formatExponent(0 - exponentModifier, secondPart);
        }
        else {
            const exponent = numberWholePart.length - significantPart1.length;
            let visibleNumber = that.inputFormat === 'floatingPoint' ? number / (Math.pow(10, exponent)) : number.divide(Math.pow(10, exponent));

            if (!significantPart2) {
                let roundedVisibleNumber = that.applyThousandsSeparator(numericProcessor.round(visibleNumber).toString(), !thousandsSeparator);

                result = roundedVisibleNumber + eLetter + that.formatExponent(exponent - exponentModifier, secondPart);
            }

            let decimalPartofVisibleNumber = visibleNumber.toString().split('.')[1] || '';

            if (decimalPartofVisibleNumber.length === significantPart2.length) {
                result = that.applySeparators(visibleNumber, !thousandsSeparator) + eLetter + that.formatExponent(exponent - exponentModifier, secondPart);
            }
            else if (decimalPartofVisibleNumber.length < significantPart2.length) {
                result = that.formatNumber(visibleNumber, firstPart, undefined, true) + eLetter + that.formatExponent(exponent - exponentModifier, secondPart);
            }
            else {
                visibleNumber = that.inputFormat === 'floatingPoint' ? visibleNumber.toFixed(significantPart2.length) :
                    visibleNumber = numericProcessor.round(number.divide(Math.pow(10, exponent - significantPart2.length))).divide(Math.pow(10, significantPart2.length));
                result = that.formatNumber(parseFloat(visibleNumber), firstPart, undefined, true) + eLetter + that.formatExponent(exponent - exponentModifier, secondPart);
            }
        }

        return that.setTextParts(result, textParts);
    }

    /**
     * Formats exponent.
     */
    formatExponent(exponent, format) {
        let sign;

        if (['+', '-'].indexOf(format.charAt(0)) !== -1) {
            sign = format.charAt(0);

            if (exponent > 0 && sign === '-' ||
                exponent < 0 && sign === '+') {
                sign = undefined;
            }
        }

        if (exponent < 0) {
            exponent = Math.abs(exponent);
            sign = '-';
        }

        format = format.replace(/[+-]/g, '');
        exponent = this.formatNumber(exponent, format, undefined, true);
        return (sign ? sign : '') + exponent;
    }

    /**
     * Formats a whole number.
     */
    formatWholeNumber(wholeNumber, format, thousandsSeparator) {
        const that = this;
        let sign = '';

        if (wholeNumber.charAt(0) === '-') {
            if (!that._ignoreMinus) {
                sign = '-';
            }

            wholeNumber = wholeNumber.slice(1);
        }

        if (wholeNumber === '0') {
            if (format === '#'.repeat(format.length)) {
                return sign;
            }

            wholeNumber = '';
        }

        if (format.length <= wholeNumber.length) {
            return sign + that.applyThousandsSeparator(wholeNumber, !thousandsSeparator);
        }

        format = format.slice(0, format.length - wholeNumber.length);

        for (let i = format.length - 1; i >= 0; i--) {
            if (format.charAt(i) === '0') {
                wholeNumber = '0' + '' + wholeNumber;
            }
        }

        return sign + that.applyThousandsSeparator(wholeNumber, !thousandsSeparator);
    }

    /**
     * Sets prefix and suffix around formatted number.
     */
    setTextParts(result, textParts) {
        return textParts.prefix + result + textParts.suffix;
    }

    /**
     * Applies custom format with fraction.
     */
    applyCustomFractionalFormat(numericObject, textParts, numericProcessor) {
        const that = this,
            regex = /^([0#,]+[ ]+)?([0#,]+\/[0#,]+)$/;
        let format = textParts.main.trim(),
            result;

        if (!regex.test(format)) {
            return numericObject.toString();
        }

        const formatParts = regex.exec(format);

        formatParts[2] = formatParts[2].replace(/,/g, '');

        if (that.inputFormat === 'integer') {
            const fractionFormatParts = formatParts[2].split('/');

            if (formatParts[1] === undefined) {
                result = that.formatNumber(numericObject, fractionFormatParts[0], undefined, true) + '/' + that.formatNumber(1, fractionFormatParts[1], undefined, true);
            }
            else {
                result = that.formatNumber(numericObject, formatParts[1].trim(), undefined, true);

                if (formatParts[2].indexOf('0') !== -1) {
                    result += ' ' + that.formatNumber(0, fractionFormatParts[0], undefined, true) + '/' + that.formatNumber(1, fractionFormatParts[1], undefined, true);
                }
            }

            return that.setTextParts(result, textParts);
        }

        if (formatParts[1] === undefined) {
            result = (numericObject < 0 ? '-' : '') + that.formatAsFraction(Math.abs(numericObject), formatParts[2]);
        }
        else {
            const wholePartFormat = formatParts[1].trim(),
                decimalPartFormat = formatParts[2];

            result = that.formatNumber(parseInt(numericObject, 10), wholePartFormat, undefined, true) + ' ' +
                that.formatAsFraction(numericProcessor.getPreciseModulo(Math.abs(numericObject), 1), decimalPartFormat);
        }

        return that.setTextParts(result.trim(), textParts);
    }

    /**
     * Formats a decimal number as a fraction.
     */
    formatAsFraction(number, format) {
        const that = this,
            formatParts = format.split('/');

        if (number === 0) {
            if (format.indexOf('0') === -1) {
                return '';
            }

            return that.formatNumber(0, formatParts[0], undefined, true) + '/' + that.formatNumber(1, formatParts[1], undefined, true);
        }

        if (number % 1 === 0) {
            return that.formatNumber(number, formatParts[0], undefined, true) + '/' + that.formatNumber(1, formatParts[1], undefined, true);
        }

        const approximations = [];

        that.approximateFractions(number, approximations);

        const length = formatParts[1].length >= 2 ? 2 : 1;
        let bestApproximationDifference = [], bestApproximationIndex = [];

        approximations.forEach(function (approximation, index) {
            const length = approximation.denominator.toString().length,
                currentDifference = Math.abs(number - approximation.numerator / approximation.denominator);

            if (bestApproximationDifference[length] === undefined) {
                bestApproximationIndex[length] = index;
                bestApproximationDifference[length] = currentDifference;
                return;
            }

            if (currentDifference < bestApproximationDifference[length]) {
                bestApproximationIndex[length] = index;
                bestApproximationDifference[length] = currentDifference;
            }
        });

        let bestApproximation = bestApproximationIndex[length] ? approximations[bestApproximationIndex[length]] : approximations[bestApproximationIndex[1]];

        return that.formatNumber(bestApproximation.numerator, formatParts[0], undefined, true) + '/' + that.formatNumber(bestApproximation.denominator, formatParts[1], undefined, true);
    }

    /**
     * Approximates fractions.
     */
    approximateFractions(d, approximations) {
        const numerators = [0, 1];
        const denominators = [1, 0];

        const maxNumerator = this.getMaxNumerator(d);
        let d2 = d;
        let calcD, prevCalcD = NaN;
        for (let i = 2; i < 1000; i++) {
            const L2 = Math.floor(d2);
            numerators[i] = L2 * numerators[i - 1] + numerators[i - 2];
            if (Math.abs(numerators[i]) > maxNumerator) return;

            denominators[i] = L2 * denominators[i - 1] + denominators[i - 2];

            calcD = numerators[i] / denominators[i];
            if (calcD === prevCalcD) return;

            approximations.push({ numerator: numerators[i], denominator: denominators[i] });

            if (calcD === d) return;

            prevCalcD = calcD;

            d2 = 1 / (d2 - L2);
        }
    }

    /**
     * Gets maximal numerator.
     */
    getMaxNumerator(f) {
        let f2 = null;
        let ixe = f.toString().indexOf('E');
        if (ixe === -1) ixe = f.toString().indexOf('e');
        if (ixe === -1) f2 = f.toString();
        else f2 = f.toString().substring(0, ixe);

        let digits = null;
        const ix = f2.toString().indexOf('.');
        if (ix === -1) digits = f2;
        else if (ix === 0) digits = f2.substring(1, f2.length);
        else if (ix < f2.length) digits = f2.substring(0, ix) + f2.substring(ix + 1, f2.length);

        let L = digits;

        const numDigits = L.toString().length;
        const L2 = f;
        let numIntDigits = L2.toString().length;
        if (L2 === 0) numIntDigits = 0;
        const numDigitsPastDecimal = numDigits - numIntDigits;

        for (let i = numDigitsPastDecimal; i > 0 && L % 2 === 0; i--) L /= 2;
        for (let i = numDigitsPastDecimal; i > 0 && L % 5 === 0; i--) L /= 5;

        return L;
    }

    /**
     * Represents an exponential value with superscripts.
     */
    exponentialToSuperscript(exponentialValue) {
        const indexOfE = exponentialValue.indexOf('e'),
            power = exponentialValue.slice(indexOfE + 1).replace(/0{1,2}/, '');
        let scientificValue = exponentialValue.slice(0, indexOfE + 1);

        scientificValue = scientificValue.replace('e', '×10');
        scientificValue += this.toSuperscript(power);
        scientificValue = scientificValue.replace('+', '');

        return scientificValue;
    }

    /**
     * Converts a number to superscript.
     */
    toSuperscript(value, supToNormal) {
        const chars = '-0123456789',
            sup = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
        let result = '';

        for (let i = 0; i < value.length; i++) {
            if (supToNormal === true) {
                const m = sup.indexOf(value.charAt(i));

                result += (m !== -1 ? chars[m] : value[i]);
            }
            else {
                const n = chars.indexOf(value.charAt(i));

                result += (n !== -1 ? sup[n] : value[i]);
            }
        }

        return result;
    }
});
