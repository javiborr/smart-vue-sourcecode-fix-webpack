
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * Gauge custom element.
 */
Smart('smart-gauge', class Gauge extends Smart.Tank {
    /**
     * Gauge's properties.
     */
    static get properties() {
        return {
            'analogDisplayType': {
                value: 'needle',
                allowedValues: ['needle', 'fill', 'line'],
                type: 'string'
            },
            'animationDuration': {
                value: 300,
                type: 'number'
            },
            'digitalDisplay': {
                value: false,
                type: 'boolean'
            },
            'digitalDisplayPosition': {
                value: 'bottom',
                allowedValues: ['top', 'bottom', 'right', 'left', 'center'],
                type: 'string'
            },
            'drawNeedle': {
                value: null,
                type: 'function?'
            },
            'endAngle': {
                value: 210,
                type: 'number'
            },
            'needlePosition': {
                value: 'center',
                allowedValues: ['center', 'edge'],
                type: 'string'
            },
            'ranges': {
                value: [],
                type: 'array'
            },
            'scalePosition': {
                value: 'inside',
                allowedValues: ['outside', 'inside', 'none'],
                type: 'string'
            },
            'showRanges': {
                value: false,
                type: 'boolean'
            },
            'sizeMode': {
                value: 'circle',
                allowedValues: ['circle', 'auto', 'none'],
                type: 'string'
            },
            'startAngle': {
                value: -30,
                type: 'number'
            }
        };
    }

    /**
     * Gauge's event listeners.
     */
    static get listeners() {
        return {
            'down': '_downHandler',
            'resize': '_resizeHandler',
            'styleChanged': '_styleChangedHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler',
            'document.selectstart': '_selectStartHandler',
            'keydown': '_keydownHandler',
            'move': '_trackMoveHandler'
        };
    }

    /**
     * Gauge's required files.
     */
    static get requires() {
        return {
            'Smart.Utilities.Draw': 'smart.draw.js',
            'Smart.NumericTextBox': 'smart.numerictextbox.js'
        }
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.numerictextbox.css',
            'smart.gauge.css'
        ]
    }

    /**
     * Gauge's HTML template.
     */
    template() {
        const template =
            `<div id="container" role="presentation">
                <div id="svgContainer" class="smart-svg-container" role="presentation" aria-hidden="true"></div>
                <div class="smart-digital-display-container" role="presentation">
                    <smart-numeric-text-box id="digitalDisplay"
                                            class="smart-digital-display"
                                            decimal-separator="[[decimalSeparator]]"
                                            max="[[max]]"
                                            min="[[min]]"
                                            name="[[name]]"
                                            placeholder="Digital display"
                                            readonly
                                            right-to-left="[[rightToLeft]]"
                                            input-format="[[scaleType]]"
                                            scientific-notation="[[scientificNotation]]"
                                            show-unit="[[showUnit]]"
                                            unit="[[unit]]"
                                            unfocusable
                                            validation="interaction"
                                            word-length="[[wordLength]]"
                                            role="tooltip">
                    </smart-numeric-text-box>
                </div>
            </div>`;

        return template;
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

        if (that._trackListener) {
            that._trackListener = new Smart.Utilities.InputEvents(that._track);
            that._trackListener.down(function (event) {
                that._SVGElementDownHandler(event);
            });
        }

        if (that._fillListener) {
            that._fillListener = new Smart.Utilities.InputEvents(that._fill);
            that._fillListener.down(function (event) {
                that._SVGElementDownHandler(event);
            });
        }

        if (that._lineListener) {
            that._lineListener = new Smart.Utilities.InputEvents(that._line);
            that._lineListener.down(function (event) {
                that._SVGElementDownHandler(event);
            });
        }
    }

    /**
     * Called when the element is detached from the DOM.
     */
    detached() {
        const that = this;

        super.detached();

        that._unlisten();
    }

    /**
     * Invoked when an instance of custom element is attached to the DOM for the first time.
     */
    ready() {
        super.ready();
    }

    /**
     * Gets the optimal size of the Gauge.
     */
    getOptimalSize() {
        const that = this;

        if (that._renderingSuspended) {
            return { width: 0, height: 0 };
        }

        if (that.sizeMode !== 'auto') {
            return { width: that.offsetWidth, height: that._updateSize(true) };
        }
        else {
            return { width: that.offsetWidth, height: that.offsetHeight };
        }
    }

    /**
     * Sets or gets the value of the Gauge.
     *
     * @param {Number/String} value Optional value to be set to the Gauge. If this parameter is not set, the method gets the value.
     */
    val(value) {
        const that = this;

        if (value !== undefined) {
            // use as value setter
            if (that.mode === 'date') {
                value = Smart.Utilities.DateTime.validateDate(value);
                value = value.getTimeStamp();
            }

            // eslint-disable-next-line
            if (that._numericProcessor.compare(value, that.value)) {
                const oldValue = that.value;

                that._validateValue(value, that.value);

                if (!that._isVisible() || that._renderingSuspended) {
                    that._renderingSuspended = true;
                    return;
                }

                that._animate(oldValue);
            }
        }
        else {
            // use as value getter
            return that._getEventValue();
        }
    }

    /**
     * Applies initial settings to the Gauge element.
     */
    _createElement() {
        const that = this;

        if (!that.$.digitalDisplay.id) {
            that.$.digitalDisplay.id = that.id + 'DigitalDisplay';
        }

        that.setAttribute('aria-describedby', that.$.digitalDisplay.id);

        if (that.mode === 'numeric') {
            that._getEventValue = function () {
                return that.value;
            };
        }
        else {
            that._handleDateScale();
            that.digitalDisplay = false;
        }

        //Creating instances of NumericProcessor, NumberRenderer and Draw
        that._numericProcessor = new Smart.Utilities.NumericProcessor(that, 'scaleType');
        that._numberRenderer = new Smart.Utilities.NumberRenderer();
        that._draw = new Smart.Utilities.Draw(that.$.svgContainer);

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }

        that._renderingSuspended = false;

        that._setSettingsObject();


        that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);

        that._measurements = {};
        that._validateInitialPropertyValues();
        that._getMeasurements();

        that._setDrawVariables();
        that._getRange();
        that._numericProcessor.getAngleRangeCoefficient();

        if (that.mode === 'numeric' || !that.coerce) {
            that._validateValue();
        }
        else {
            that._coerceInitialDateValue = true;
        }

        that._initTickIntervalHandler();

        that._renderAnalogItems();
        delete that._preventResizeHandler;

        that._setFocusable();

        that._setUpdatePointerMethod();
    }

    /**
     * Invoked when the value of a public property has been changed by the user.
     */
    propertyChangedHandler(key, oldValue, value) {
        function validateMinMax(validateMin, validateMax, oldMin, oldMax) {
            const toValidate = validateMin && validateMax ? 'both' : key;

            that._validateMinMax(toValidate, false, oldValue);

            if (key !== 'logarithmicScale' && key !== 'scaleType' && (key !== 'wordLength' && that[key] === oldValue || key === 'wordLength' && that.min === oldMin && that.max === oldMax)) {
                return;
            }

            that._setDrawVariables();
            that._getRange();
            that._numericProcessor.getAngleRangeCoefficient();
            that._initTickIntervalHandler();
            that._renderAnalogItems();

            that._validateValue(that.value, that.value);
            that._updatePointer();
        }

        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        switch (key) {
            case 'analogDisplayType':
                delete that._customSVGElements;

                that._getMeasurements();

                if (value === 'needle' && that.digitalDisplayPosition === 'center') {
                    that.digitalDisplayPosition = 'bottom';
                }
                else if (oldValue === 'needle' && that.digitalDisplayPosition === 'bottom') {
                    that.digitalDisplayPosition = 'center';
                }

                that._renderAnalogItems();
                that._setUpdatePointerMethod();
                break;
            case 'coerce':
                if (value) {
                    const valueBeforeCoercion = that.value;
                    that._validateValue(valueBeforeCoercion);
                    that._updatePointer();
                    that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                }
                else {
                    if (that._valueBeforeCoercion !== undefined) {
                        that._validateValue(that._valueBeforeCoercion); // restores the value from before coercion
                        that._updatePointer();
                    }
                }
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

                that._initTickIntervalHandler();
                that._renderAnalogItems();
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
                    that._initTickIntervalHandler();
                    that._renderAnalogItems();
                    that._coerceCustomInterval();
                }

                break;
            case 'dateLabelFormatString':
            case 'showUnit':
            case 'unit': that._initTickIntervalHandler();
                that._renderAnalogItems();
                break;
            case 'decimalSeparator':
            case 'scientificNotation':
                if (that.mode === 'date') {
                    return;
                }

                that._initTickIntervalHandler();
                that._renderAnalogItems();
                break;
            case 'digitalDisplay':
            case 'digitalDisplayPosition':
                if (that.mode === 'date') {
                    if (key === 'digitalDisplay') {
                        that.digitalDisplay = false;
                    }

                    return;
                }

                that._updateSize();
                break;
            case 'mechanicalAction':
            case 'messages':
                break;
            case 'disabled':
            case 'readonly':
            case 'unfocusable':
                super.propertyChangedHandler(key, oldValue, value);
                break;
            case 'drawNeedle':
                if (that.analogDisplayType !== 'needle') {
                    return;
                }

                if (oldValue === null) {
                    that._draw.removeElement(that._needle);
                }

                if (value !== null) {
                    that._updatePointer();
                }
                else {
                    that._renderAnalogItems();
                    delete that._customSVGElements;
                }

                break;
            case 'endAngle':
            case 'startAngle':
                that._validateAngles();
                that._numericProcessor.getAngleRangeCoefficient();
                that._renderAnalogItems();
                break;
            case 'interval':
                that._numericProcessor.validateInterval(that.interval);
                that._validateValue();
                that._updatePointer();
                break;
            case 'inverted':
            case 'labelFormatFunction':
            case 'rightToLeft':
            case 'showRanges':
                that._renderAnalogItems();
                break;
            case 'labelsVisibility':
                if (oldValue === 'all' && value === 'endPoints' || oldValue === 'endPoints' && value === 'all') {
                    return;
                }
                that._getMeasurements();
                that._renderAnalogItems();
                break;
            case 'logarithmicScale':
                if (that.mode === 'date') {
                    that.logarithmicScale = false;
                    return;
                }

                that._initTickIntervalHandler();
                validateMinMax(true, true);
                break;
            case 'max':
            case 'min':
                if (that.mode === 'date') {
                    delete that._dateInterval;

                    that[key] = Smart.Utilities.DateTime.validateDate(value).getTimeStamp();
                }

                validateMinMax(key === 'min', key === 'max');
                break;
            case 'mode':
                that.mode = oldValue;
                break;
            case 'needlePosition':
                if (that.analogDisplayType === 'needle') {
                    that._updatePointer();
                }
                break;
            case 'precisionDigits':
            case 'significantDigits':
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

                if (value !== null) {
                    that.$.digitalDisplay.precisionDigits = that.precisionDigits;
                    that.$.digitalDisplay.significantDigits = that.significantDigits;
                }
                that._initTickIntervalHandler();
                that._renderAnalogItems();
                break;
            case 'ranges':
                if (!that.showRanges) {
                    return;
                }

                that._renderAnalogItems();
                break;
            case 'scaleType':
                if (that.mode === 'date') {
                    that.scaleType = 'integer';
                    return;
                }

                that._numericProcessor = new Smart.Utilities.NumericProcessor(that, 'scaleType');

                validateMinMax(true, true);
                break;
            case 'scalePosition':
            case 'ticksPosition':
                that._getMeasurements();
                that._renderAnalogItems();
                break;
            case 'sizeMode':
                if (value === 'none') {
                    return;
                }

                that._preventResizeHandler = true;

                if (value === 'circle') {
                    that.$.container.removeAttribute('style');
                    that.style.height = that.offsetWidth + 'px';
                    that._measurements.cachedHeight = that.offsetHeight;
                }
                else if (value === 'auto') {
                    that.$.container.style.height = that.offsetWidth + 'px';
                    that._updateSize();
                }

                break;
            case 'theme':
                super.propertyChangedHandler(key, oldValue, value);
                that._getMeasurements();
                that._renderAnalogItems();
                break;
            case 'ticksVisibility':
                if (oldValue === 'minor' && value === 'major' || oldValue === 'major' && value === 'minor') {
                    return;
                }
                that._getMeasurements();
                that._renderAnalogItems();
                break;
            case 'validation':
                if (value === 'strict') {
                    that._validateValue(that.value, that.value);
                }

                break;
            case 'value': {
                if (that.mode === 'date') {
                    value = Smart.Utilities.DateTime.validateDate(value);
                    value = value.getTimeStamp();
                }

                that._validateValue(value, oldValue);

                const stringValue = value.toString();

                if (that.value.toString() === stringValue) {
                    that._drawValue = that.logarithmicScale ? Math.log10(stringValue).toString() : stringValue;
                }

                that._animate(oldValue);
                break;
            }
            case 'wordLength':
                if (that.mode === 'date') {
                    that.wordLength = 'uint64';
                    return;
                }

                that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);
                if (that.scaleType === 'integer') {
                    validateMinMax(true, true, that.min, that.max);
                }
                break;
            default:
                super.propertyChangedHandler(key, oldValue, value);
        }
    }

    /**
     * Draws the Gauge's analog display.
     */
    _addAnalogDisplay() {
        const that = this,
            measurements = that._measurements,
            radius = measurements.radius,
            draw = that._draw;

        if (that.analogDisplayType === 'needle') {
            // needle
            that._drawNeedle(false);
            // central circle
            const centralCircleRadius = (measurements.needleWidth + 5) / 2;

            that._centralCircle = draw.circle(radius, radius, centralCircleRadius, { 'class': 'smart-needle-central-circle' });
            that._minCoordinates.push(radius - centralCircleRadius);
            that._maxCoordinates.push(radius + centralCircleRadius);
        }
        else {
            const distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;
            // track
            that._track = draw.pieslice(radius, radius, distance - measurements.trackWidth, distance, that.startAngle, that.endAngle, 0, { 'class': 'smart-track' });
            that._trackListener = new Smart.Utilities.InputEvents(that._track);
            that._trackListener.down(function (event) {
                that._SVGElementDownHandler(event);
            });
        }
    }

    /**
     * Calculates the tick drawing distance.
     */
    _calculateTickAndLabelDistance() {
        const that = this,
            measurements = that._measurements;

        if (that.scalePosition === 'none') {
            that._plotLabels = false;
            that._plotTicks = false;

            measurements.innerRadius = measurements.radius;

            return { majorTickDistance: 0, minorTickDistance: 0, labelDistance: 0, needleDistance: 0, trackDistance: 0 };
        }

        const labelsSize = that._tickIntervalHandler.labelsSize,
            labelSizeCoefficient = that._largestLabelSize || Math.max(labelsSize.minLabelSize, labelsSize.minLabelOtherSize, labelsSize.maxLabelSize, labelsSize.maxLabelOtherSize);
        let majorTickDistance = 1,
            minorTickDistance,
            labelDistance,
            needleDistance,
            trackDistance = 0;

        that._largestLabelSize = labelSizeCoefficient;

        if (that.scalePosition === 'outside') {
            majorTickDistance = labelSizeCoefficient;
            minorTickDistance = majorTickDistance + measurements.majorTickSize - measurements.minorTickSize;
            labelDistance = 0;
        }

        if (that.analogDisplayType === 'needle') {
            if (that.scalePosition === 'outside') {
                needleDistance = majorTickDistance + measurements.majorTickSize;
            }
            else {
                needleDistance = majorTickDistance + measurements.majorTickSize + labelSizeCoefficient;
            }

            if (that.ticksVisibility === 'none') {
                labelDistance = 0;
                needleDistance -= measurements.majorTickSize;
            }
            if (that.labelsVisibility === 'none') {
                needleDistance -= labelSizeCoefficient;
                if (that.scalePosition === 'outside') {
                    majorTickDistance -= labelSizeCoefficient;
                    minorTickDistance -= labelSizeCoefficient;
                }
            }
        }
        else {
            if (that.labelsVisibility === 'none' && that.ticksVisibility === 'none') {
                trackDistance = 0;
            }
            else {
                if (that.scalePosition === 'outside') {
                    if (that.ticksPosition === 'scale') {
                        if (that.labelsVisibility === 'none') {
                            majorTickDistance = 1;
                            minorTickDistance = 1 + measurements.majorTickSize - measurements.minorTickSize;
                        }
                        if (that.ticksVisibility !== 'none') {
                            trackDistance = majorTickDistance + measurements.majorTickSize + 2;
                        }
                        else {
                            trackDistance = labelSizeCoefficient;
                        }
                    }
                    else {
                        if (that.labelsVisibility !== 'none') {
                            minorTickDistance = minorTickDistance - (measurements.trackWidth + measurements.trackBorderWidth) / 4;
                            trackDistance = majorTickDistance - 1;
                        }
                        else {
                            majorTickDistance = 1;
                            minorTickDistance = (measurements.trackWidth + measurements.trackBorderWidth) / 4 + 1;
                            trackDistance = 0;
                        }
                    }
                }
                else {
                    if (that.ticksPosition === 'scale') {
                        majorTickDistance = measurements.trackWidth + 1.5 * measurements.trackBorderWidth + 2;
                        if (that.ticksVisibility === 'none') {
                            labelDistance = majorTickDistance;
                        }
                    }
                    else {
                        minorTickDistance = (measurements.trackWidth + measurements.trackBorderWidth) / 4 + 1;
                    }
                }
            }
        }

        if (minorTickDistance === undefined) {
            minorTickDistance = majorTickDistance;
        }

        if (labelDistance === undefined) {
            labelDistance = majorTickDistance + measurements.majorTickSize;
        }

        measurements.innerRadius = measurements.radius - labelDistance;

        delete that._plotLabels;
        delete that._plotTicks;
        delete that._equalToHalfRadius;
        if (that.scalePosition === 'inside') {
            if (measurements.innerRadius < labelSizeCoefficient) {
                that._plotLabels = false;

                if (that.ticksPosition === 'scale') {
                    if (that.analogDisplayType !== 'needle' && measurements.innerRadius < measurements.majorTickSize) {
                        that._plotTicks = false;
                    }
                }
                else {
                    that._equalToHalfRadius = true;
                    measurements.innerRadius = measurements.radius / 2;
                }
            }
        }
        else if (measurements.radius - trackDistance - measurements.trackBorderWidth < measurements.trackWidth) {
            measurements.trackWidth = measurements.radius - trackDistance - measurements.trackBorderWidth;
            measurements.lineSize = measurements.trackWidth + measurements.trackBorderWidth;
            if (that.ticksPosition === 'track') {
                measurements.majorTickSize = measurements.lineSize;
                measurements.minorTickSize = measurements.majorTickSize / 2;
                minorTickDistance = majorTickDistance + (measurements.majorTickSize - measurements.minorTickSize) / 2;
            }
        }

        return { majorTickDistance: majorTickDistance, minorTickDistance: minorTickDistance, labelDistance: labelDistance, needleDistance: needleDistance, trackDistance: trackDistance };
    }

    /**
     * Calculates the tank's major and minor ticks intervals.
     */
    _calculateTickInterval() {
        const that = this,
            intervals = that._tickIntervalHandler.getInterval('radial', that._drawMin, that._drawMax, that.$.container, that.logarithmicScale);

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
     * Computes the points of a needle (needlePosition: 'center').
     */
    _computeNeedlePointsCenter(pointerWidth, angle) {
        const that = this,
            measurements = that._measurements,
            innerRadius = measurements.innerRadius,
            radius = measurements.radius,
            sin = Math.sin(angle),
            cos = Math.cos(angle);
        let pointerLength;

        if (that.scalePosition === 'inside') {
            pointerLength = (innerRadius - that._largestLabelSize) * 0.9;
        }
        else {
            pointerLength = (innerRadius - that._distance.needleDistance) * 0.9;
        }

        const x = radius + pointerLength * sin,
            y = radius + pointerLength * cos,
            startX1 = radius + pointerWidth * cos,
            startY1 = radius - pointerWidth * sin,
            startX2 = radius - pointerWidth * cos,
            startY2 = radius + pointerWidth * sin,

            points = 'M ' + startX1 + ',' + startY1 + ' L ' + startX2 + ',' + startY2 + ' L ' + x + ',' + y + ' Z';

        return points;
    }

    /**
     * Computes the points of a needle (needlePosition: 'edge').
     */
    _computeNeedlePointsEdge(pointerWidth, angle, pointerLength) {
        const that = this,
            radius = that._measurements.radius,
            distance = radius - that._distance.needleDistance,
            distanceMinusPointerLength = distance - pointerLength,
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            hPointX = radius + distanceMinusPointerLength * sin,
            hPointY = radius + distanceMinusPointerLength * cos,
            startPointX1 = hPointX + pointerWidth * cos,
            startPointY1 = hPointY - pointerWidth * sin,
            startPointX2 = hPointX - pointerWidth * cos,
            startPointY2 = hPointY + pointerWidth * sin,
            endPointX = radius + distance * sin,
            endPointY = radius + distance * cos,

            points = 'M ' + startPointX1 + ',' + startPointY1 + ' L ' + startPointX2 + ',' + startPointY2 + ' L ' + endPointX + ',' + endPointY + ' Z';

        return points;
    }

    /**
     * Document (mouse)move event handler.
     */
    _documentMoveHandler(event) {
        if (!this._dragging) {
            return;
        }

        const that = this,
            angle = that._getAngleByCoordinate(event.pageX, event.pageY),
            quadrant = that._getQuadrant(angle),
            rotationDirection = that._getRotationDirection();

        if (that._normalizedStartAngle === that.endAngle) {
            let normalizedReferentAngle;

            if ((!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
                if (that._lockCW && rotationDirection === 'ccw') {
                    normalizedReferentAngle = that.endAngle;
                    that._unlockRotation('_lockCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle > normalizedReferentAngle, secondCondition: angle < normalizedReferentAngle });
                }
                else if (that._lockCCW && rotationDirection === 'cw') {
                    normalizedReferentAngle = that._normalizedStartAngle;
                    that._unlockRotation('_lockCCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle < normalizedReferentAngle, secondCondition: angle > normalizedReferentAngle });
                }
            }
            else {
                if (that._lockCW && rotationDirection === 'cw') {
                    normalizedReferentAngle = that._normalizedStartAngle;
                    that._unlockRotation('_lockCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle < normalizedReferentAngle, secondCondition: angle > normalizedReferentAngle });
                }
                else if (that._lockCCW && rotationDirection === 'ccw') {
                    normalizedReferentAngle = that.endAngle;
                    that._unlockRotation('_lockCCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle > normalizedReferentAngle, secondCondition: angle < normalizedReferentAngle });
                }
            }
        }
        else {
            if (that._lockCW && rotationDirection === 'ccw' && !that._outsideRange && that._numericProcessor._getAngleDifference(angle, that._normalizedStartAngle) < 10) {
                that._lockCW = false;
            }
            else if (that._lockCCW && rotationDirection === 'cw' && !that._outsideRange && that._numericProcessor._getAngleDifference(angle, that.endAngle) < 10) {
                that._lockCCW = false;
            }
        }

        that._angle = angle;
        that._quadrant = quadrant;

        if (event.originalEvent) {
            event.originalEvent.stopPropagation();
            event.originalEvent.preventDefault();
        }

        if (that._lockCW || that._lockCCW) {
            return;
        }

        let newValue = that._numericProcessor.getValueByAngle(angle);

        if (that._normalizedStartAngle === that.endAngle) {
            const lockedValue = that._numericProcessor.lockRotation(rotationDirection === 'cw' && (!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted) ||
                rotationDirection === 'ccw' && (that.inverted || (that.rightToLeft && !that.inverted)), newValue);

            if (lockedValue !== undefined) {
                newValue = lockedValue;
            }
        }
        else {
            if (rotationDirection === 'ccw' && that._outsideEnd) {
                that._lockCCW = true;
            }
            else if (rotationDirection === 'cw' && that._outsideStart) {
                that._lockCW = true;
            }
        }

        if (newValue !== undefined && that._numericProcessor.compare(newValue, that.value)) {
            cancelAnimationFrame(that._animationFrameId);
            that._updatePointer(newValue);

            if (that.mechanicalAction !== 'switchWhenReleased') {
                that._numericProcessor.updateGaugeValue(newValue);
            }
            else {
                that._valueAtMoveEnd = newValue;
            }
        }
    }

    /**
     * Gauge (mouse)up event handler.
     */
    _documentUpHandler() {
        const that = this;

        if (that._dragging) {
            that._lockCW = false;
            that._lockCCW = false;

            that._dragging = false;
            that.removeAttribute('dragged');

            if (that.mechanicalAction !== 'switchWhileDragging') {
                const newValue = that.mechanicalAction === 'switchUntilReleased' ? that._valueAtDragStart : that._valueAtMoveEnd;

                if (that._numericProcessor.compare(newValue, that.value)) {
                    if (that.mechanicalAction === 'switchUntilReleased') {
                        that._animate(that.value, newValue);
                    }

                    that._numericProcessor.updateGaugeValue(newValue);
                }
            }
        }
    }

    /**
     * Gauge (mouse)down event handler.
     */
    _downHandler(event, targetIsTrack) {
        const that = this,
            target = that.enableShadowDOM || that.isInShadowDOM ? event.originalEvent.composedPath()[0] : event.originalEvent.target;

        if (that.analogDisplayType !== 'needle' && !targetIsTrack || that.disabled || that.readonly ||
            that.$.digitalDisplay.contains(target) ||
            (!Smart.Utilities.Core.isMobile && (('buttons' in event && event.buttons !== 1) || event.which !== 1))) {
            event.stopPropagation();
            return;
        }

        const x = event.pageX,
            y = event.pageY;

        that._measurements.center = that._getCenterCoordinates();

        if (that.analogDisplayType === 'needle') {
            const distanceFromCenter = Math.sqrt(Math.pow(that._measurements.center.x - x, 2) + Math.pow(that._measurements.center.y - y, 2));
            if (distanceFromCenter > that._measurements.radius) {
                event.stopPropagation();
                return;
            }
        }

        if (that.mechanicalAction === 'switchUntilReleased') {
            that._valueAtDragStart = that.value;
        }

        that._angle = that._getAngleByCoordinate(x, y);
        that._quadrant = that._getQuadrant(that._angle);

        const newValue = that._numericProcessor.getValueByAngle(that._angle);

        if (newValue !== undefined && that._numericProcessor.compare(newValue, that.value)) {
            that._animate(that.value, newValue);

            if (that.mechanicalAction !== 'switchWhenReleased') {
                that._numericProcessor.updateGaugeValue(newValue);
            }
            else {
                that._valueAtMoveEnd = newValue;
            }
        }

        that._dragging = true;
        that.setAttribute('dragged', '');
    }

    /**
     * Animates pointer.
     */
    _animate(oldValue, newValue) {
        const that = this,
            logarithmicScale = that.logarithmicScale,
            totalIterations = Math.max(1, Math.round(that.animationDuration / 15));

        cancelAnimationFrame(that._animationFrameId);

        if (!that.hasAnimation || totalIterations === 1) {
            that._updatePointer(newValue);
            return;
        }

        const numericProcessor = that._numericProcessor;
        let i = 1,
            nextValue, getNextValue, oldDrawValue, newDrawValue;


        if (newValue === undefined) {
            newValue = that.value;
        }

        oldValue = parseFloat(numericProcessor.validate(numericProcessor.createDescriptor(oldValue), that._minObject, that._maxObject));
        newValue = parseFloat(numericProcessor.validate(numericProcessor.createDescriptor(newValue), that._minObject, that._maxObject));

        if (logarithmicScale) {
            oldDrawValue = Math.log10(oldValue);
            newDrawValue = Math.log10(newValue);
        }
        else {
            oldDrawValue = oldValue;
            newDrawValue = newValue;
        }

        const total = Math.abs(newDrawValue - oldDrawValue);

        if (newValue > oldValue) {
            getNextValue = function () {
                return Math.min(Smart.Utilities.Animation.Easings.easeInOutSine(i, oldDrawValue, total, totalIterations), newDrawValue);
            }
        }
        else {
            getNextValue = function () {
                return Math.max(2 * oldDrawValue - Smart.Utilities.Animation.Easings.easeInOutSine(i, oldDrawValue, total, totalIterations), newDrawValue);
            }
        }

        function getNextDrawValue() {
            nextValue = getNextValue();

            if (logarithmicScale) {
                nextValue = Math.pow(10, nextValue);
            }
        }

        function animate() {
            i++;

            if (i === totalIterations) {
                nextValue = newValue;
                that._updatePointer(nextValue);
                return;
            }

            that._updatePointer(nextValue);
            getNextDrawValue();
            that._animationFrameId = requestAnimationFrame(animate);
        }

        getNextDrawValue();
        that._animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Draws/updates the fill or line.
     */
    _drawFill(update, value) {
        const that = this;

        if (that.analogDisplayType === 'needle') {
            return;
        }

        if (value === undefined) {
            value = that._number;
        }

        const measurements = that._measurements,
            radius = measurements.radius,
            distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;

        if (that.analogDisplayType === 'fill') {
            const angle = that._numericProcessor.getAngleByValue(value, true, true);
            let startAngle, endAngle;

            if ((!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
                startAngle = angle;
                endAngle = that.endAngle;
            }
            else {
                startAngle = that.startAngle;
                endAngle = angle;
            }

            if (update) {
                that._fill.setAttribute('d', that._draw.pieSlicePath(radius, radius, distance - measurements.trackWidth, distance, startAngle, endAngle, 0));
            }
            else {
                that._fill = that._draw.pieslice(radius, radius, distance - measurements.trackWidth, distance, startAngle, endAngle, 0, { 'class': 'smart-value' });
                that._fillListener = new Smart.Utilities.InputEvents(that._fill);
                that._fillListener.down(function (event) {
                    that._SVGElementDownHandler(event);
                });
            }
        }
        else {
            const width = distance + measurements.trackBorderWidth / 2,
                innerWidth = width - measurements.lineSize,
                angle = that._numericProcessor.getAngleByValue(value),
                angleSin = Math.sin(angle),
                angleCos = Math.cos(angle),
                x1 = radius + width * angleSin,
                y1 = radius + width * angleCos,
                x2 = radius + innerWidth * angleSin,
                y2 = radius + innerWidth * angleCos;

            if (update) {
                that._line.setAttribute('x1', x1);
                that._line.setAttribute('y1', y1);
                that._line.setAttribute('x2', x2);
                that._line.setAttribute('y2', y2);
            }
            else {
                that._line = that._draw.line(x1, y1, x2, y2, { 'class': 'smart-line' });
                that._lineListener = new Smart.Utilities.InputEvents(that._line);
                that._lineListener.down(function (event) {
                    that._SVGElementDownHandler(event);
                });
            }
        }
    }

    /**
     * Draws a label.
     */
    _drawLabel(angle, value, distance, middle) {
        const that = this,
            measurements = that._measurements,
            r = measurements.radius,
            stylingObj = {
                'class': 'smart-label' + (middle !== false ? ' smart-label-middle' : ''),
                'font-size': measurements.fontSize,
                'font-family': measurements.fontFamily,
                'font-weight': measurements.fontWeight,
                'font-style': measurements.fontStyle
            };

        value = that._formatLabel(value.toString(), false);

        const textSize = that._draw.measureText(value, 0, stylingObj),
            w = r - distance - that._largestLabelSize / 2,
            x = Math.round(r + w * Math.sin(angle)) - textSize.width / 2,
            y = Math.round(r + w * Math.cos(angle)) - textSize.height / 2,

            label = that._draw.text(value, x, y, textSize.width, textSize.height, 0, stylingObj);

        that._minCoordinates.push(y);
        that._maxCoordinates.push(y + label.getBBox().height);
    }

    /**
     * Draws/updates the needle.
     */
    _drawNeedle(update, value) {
        const that = this,
            measurements = that._measurements;

        if (value === undefined) {
            value = that._number;
        }

        const angle = that._numericProcessor.getAngleByValue(value);

        if (!that.drawNeedle) {
            let points;

            if (that.needlePosition === 'center') {
                points = that._computeNeedlePointsCenter(measurements.needleWidth / 2, angle);
            }
            else {
                points = that._computeNeedlePointsEdge(measurements.needleWidth / 2, angle, measurements.needleLength);
            }

            if (update) {
                that._needle.setAttribute('d', points);
            }
            else {
                that._needle = that._draw.path(points, { 'class': 'smart-needle' });
            }
        }
        else {
            that._customSVGElements = that.drawNeedle(that, that._draw, measurements.radius, angle, that._distance.needleDistance);
            if (that._customSVGElements) {
                const parent = that._customSVGElements[0].parentElement || that._customSVGElements[0].parentNode;
                for (let i = 0; i < that._customSVGElements.length; i++) {
                    parent.insertBefore(that._customSVGElements[i], that._centralCircle);
                }
            }
        }
    }

    /**
     * Draws ranges.
     */
    _drawRanges() {
        const that = this,
            numericProcessor = that._numericProcessor,
            ranges = that.ranges;

        if (!that.showRanges || ranges.length === 0) {
            return;
        }

        const measurements = that._measurements,
            radius = measurements.radius;
        let distance, rangeSize, startValue, endValue;

        if (that.analogDisplayType === 'needle') {
            rangeSize = measurements.rangeSize;
            if (that.scalePosition === 'inside') {
                distance = radius - 1;
            }
            else {
                distance = radius - that._distance.needleDistance - 2;
                if (that.labelsVisibility === 'none' && that.ticksVisibility === 'none') {
                    distance += 1;
                }
            }
        }
        else {
            distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;
            rangeSize = measurements.trackWidth;
        }

        if ((!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
            startValue = 'startValue';
            endValue = 'endValue';
        }
        else {
            startValue = 'endValue';
            endValue = 'startValue';
        }

        for (let i = 0; i < ranges.length; i += 1) {
            let currentRange = ranges[i],
                validStartValue = numericProcessor.validateColorRange(currentRange[startValue]),
                validEndValue = numericProcessor.validateColorRange(currentRange[endValue]);

            const range = that._draw.pieslice(radius, radius, distance - rangeSize, distance, numericProcessor.getAngleByValue(validEndValue, true, true), numericProcessor.getAngleByValue(validStartValue, true, true), 0, { 'class': 'smart-range ' + currentRange.className });

            that._ranges.push(range);
        }
    }

    /**
     * Draws a tick.
     */
    _drawTick(angle, width, type) {
        const that = this,
            measurements = that._measurements,
            r = measurements.radius;

        let className = 'smart-tick',
            size;

        if (type === 'major') {
            size = measurements.majorTickSize;
        }
        else {
            size = measurements.minorTickSize;
            className += ' smart-tick-minor';
        }

        const innerWidth = width - size,
            x1 = r + width * Math.sin(angle),
            y1 = r + width * Math.cos(angle),
            x2 = r + innerWidth * Math.sin(angle),
            y2 = r + innerWidth * Math.cos(angle);
        that._draw.line(x1, y1, x2, y2, { 'class': className });

        that._minCoordinates.push(Math.min(y1, y2));
        that._maxCoordinates.push(Math.max(y1, y2));
    }

    /**
     * Returns the angle equivalent of coordinates.
     */
    _getAngleByCoordinate(x, y) {
        function isInRange(from, to, angle) {
            while (to < from) to += 360;

            while (angle < from) angle += 360;

            return angle >= from && angle <= to;
        }

        const that = this,
            center = that._measurements.center,
            angleRadians = Math.atan2(y - center.y, x - center.x);
        let angleDeg = -1 * angleRadians * 180 / Math.PI;

        if (angleDeg < 0) {
            angleDeg += 360;
        }

        that._actualAngle = angleDeg;

        if (that._normalizedStartAngle !== that.endAngle && !isInRange(that._normalizedStartAngle, that.endAngle, angleDeg)) {
            // coordinates are outside the range
            if (that._numericProcessor._getAngleDifference(angleDeg, that._normalizedStartAngle) <=
                that._numericProcessor._getAngleDifference(angleDeg, that.endAngle)) {
                angleDeg = that._normalizedStartAngle;
                that._outsideStart = true;
                that._outsideEnd = false;
            }
            else {
                angleDeg = that.endAngle;
                that._outsideEnd = true;
                that._outsideStart = false;
            }

            that._outsideRange = true;
        }
        else {
            that._outsideRange = false;
            that._outsideStart = false;
            that._outsideEnd = false;
        }

        return angleDeg;
    }

    /**
     * Returns the coordinates of the Gauge's center.
     */
    _getCenterCoordinates() {
        const that = this,
            offset = that.$.container.getBoundingClientRect(),
            radius = that._measurements.radius,
            scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft,
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        return { x: offset.left + scrollLeft + radius, y: offset.top + scrollTop + radius };
    }

    /**
     * Gets inline "fill"/"stroke" set to _track, _fill or _line.
     */
    _getInlineColors() {
        const that = this;
        let trackColor = '',
            fillColor = '',
            lineColor = '';

        if (that._track) {
            trackColor = that._track.style.fill;
        }

        if (that._fill) {
            fillColor = that._fill.style.fill;
        }

        if (that._line) {
            lineColor = that._line.style.stroke;
        }

        return [trackColor, fillColor, lineColor];
    }

    /**
     * Measures some elements of the Gauge and stores the results.
     */
    _getMeasurements() {
        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        const measurements = that._measurements;

        measurements.cachedWidth = that.offsetWidth;
        measurements.cachedHeight = that.offsetHeight;

        measurements.radius = measurements.cachedWidth / 2;

        const measureElement = document.createElement('div');

        if (that.shadowRoot) {
            that.shadowRoot.appendChild(measureElement);
        }
        else {
            that.appendChild(measureElement);
        }

        // ticks
        measureElement.className = 'smart-tick';
        measurements.majorTickSize = measureElement.offsetWidth;
        measureElement.className += ' smart-tick-minor';
        measurements.minorTickSize = measureElement.offsetWidth;

        // labels
        measureElement.className = 'smart-label';
        const measureElementStyle = window.getComputedStyle(measureElement);
        measurements.fontSize = measureElementStyle.fontSize;
        measurements.fontFamily = measureElementStyle.fontFamily;
        measurements.fontWeight = measureElementStyle.fontWeight;
        measurements.fontStyle = measureElementStyle.fontStyle;

        measurements.trackWidth = 0;
        measurements.trackBorderWidth = 0;

        if (that.analogDisplayType === 'needle') {
            // needle
            measureElement.className = 'smart-needle';
            measurements.needleWidth = measureElement.offsetWidth;
            measurements.needleLength = measureElement.offsetHeight;

            // ranges
            measureElement.className = 'smart-range';
            measurements.rangeSize = measureElement.offsetWidth;
        }
        else { // 'fill' and 'line' case
            // track
            measureElement.className = 'smart-track';
            measurements.trackBorderWidth = parseFloat(measureElementStyle.strokeWidth);
            measurements.trackWidth = Math.min(measureElement.offsetWidth, measurements.radius - measurements.trackBorderWidth)
            measurements.lineSize = measurements.trackWidth + measurements.trackBorderWidth;

            if (that.ticksPosition === 'track') {
                measurements.majorTickSize = measurements.lineSize;
                measurements.minorTickSize = measurements.majorTickSize / 2;
            }
        }

        if (that.shadowRoot) {
            that.shadowRoot.removeChild(measureElement);
        }
        else {
            that.removeChild(measureElement);
        }
    }

    /**
     * Returns the quadrant of an angle.
     */
    _getQuadrant(angle) {
        if (angle > 270) {
            return 4;
        }
        else if (angle > 180) {
            return 3;
        }
        else if (angle > 90) {
            return 2;
        }
        else {
            return 1;
        }
    }

    /**
     * Returns the rotation direction.
     */
    _getRotationDirection() {
        const that = this,
            quadrant = that._getQuadrant(that._actualAngle);

        if ((that._actualAngle < that._angle && (quadrant !== 1 || that._quadrant !== 4)) || (that._actualAngle > that._angle && quadrant === 4 && that._quadrant === 1)) {
            return 'cw';
        }
        else {
            return 'ccw';
        }
    }

    /**
     * Creates a new TickIntervalHandler instance.
     */
    _initTickIntervalHandler() {
        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        const minLabel = that._formatLabel(that.min, false),
            maxLabel = that._formatLabel(that.max, false);

        that._tickIntervalHandler = new Smart.Utilities.TickIntervalHandler(that, minLabel, maxLabel, 'smart-label', that._settings.size, that.scaleType === 'integer', that.logarithmicScale);
    }

    /**
     * Gauge keydown event handler.
     */
    _keydownHandler(event) {
        const that = this,
            oldValue = that._getEventValue(),
            stringValue = that._number.toString();

        if (that.mode === 'numeric') {
            if (that.value.toString() !== stringValue) {
                that.value = stringValue;
                that.$.digitalDisplay.value = stringValue;
            }

            super._keydownHandler(event);

            if (that.value.toString() !== oldValue) {
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            }
        }
        else {
            if (that.value.toString() !== stringValue) {
                that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(stringValue);
                that.value = that._number;
            }

            super._keydownHandler(event);

            if (that._valueDate.compare(oldValue) !== 0) {
                that.$.fireEvent('change', { 'value': that._getEventValue(), 'oldValue': oldValue });
            }
        }

        that._setAriaValue('valuenow');
    }

    /**
     * Normalizes the value of an angle.
     */
    _normalizeAngle(angle) {
        angle = angle % 360;

        if (angle < 0) {
            angle += 360;
        }

        return angle;
    }

    /**
     * Renders the analog display, ticks and labels in the correct order
     */
    _renderAnalogItems(distanceCalculation) {
        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        const colors = that._getInlineColors();

        that._unlisten();
        that._draw.clear();
        delete that._needle;
        delete that._centralCircle;
        delete that._track;
        delete that._trackListener;
        delete that._fill;
        delete that._fillListener;
        delete that._line;
        delete that._lineListener;
        that._ranges = [];
        that._minCoordinates = [];
        that._maxCoordinates = [];

        if (distanceCalculation !== false) {
            delete that._largestLabelSize;
            that._distance = that._calculateTickAndLabelDistance();
        }

        if (that._plotTicks !== false || that._plotLabels !== false) {
            that._calculateTickInterval();

            const cachedLabelsSize = that._cachedLabelsSize,
                alternativeLargestLabelSize = Math.max(cachedLabelsSize.minLabelSize, cachedLabelsSize.minLabelOtherSize, cachedLabelsSize.maxLabelSize, cachedLabelsSize.maxLabelOtherSize);
            if (distanceCalculation !== false && that._largestLabelSize !== alternativeLargestLabelSize) {
                that._largestLabelSize = alternativeLargestLabelSize;

                that._distance = that._calculateTickAndLabelDistance();
                that._calculateTickInterval();
            }
        }

        if (that._coerceInitialDateValue) {
            that._validateValue();
            delete that._coerceInitialDateValue;
        }

        that._drawRanges();
        that._addAnalogDisplay();

        if (that.ticksVisibility !== 'none' && that._plotTicks !== false || that.labelsVisibility !== 'none' && that._plotLabels !== false) {
            if (!(that.customInterval || that._dateInterval)) {
                that._numericProcessor.addGaugeTicksAndLabels();
            }
            else {
                that._numericProcessor.addGaugeCustomTicks();
            }
        }

        that._drawFill(false);

        that._updateSize();

        that._restoreInlineColors(colors[0], colors[1], colors[2]);
    }

    /**
     * Gauge resize event handler. Ensures the Gauge's bounding box always has the correct proportions.
     */
    _resizeHandler() {
        const that = this;

        if (that._preventResizeHandler) {
            delete that._preventResizeHandler;
            return;
        }

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }
        else if (that._renderingSuspended) {
            that._createElement();
            return;
        }

        const measurements = that._measurements;

        if (that._renderingSuspended || measurements.cachedWidth === that.offsetWidth && measurements.cachedHeight === that.offsetHeight) {
            return;
        }

        if (that.sizeMode === 'circle') {
            if (that.offsetWidth !== that.offsetHeight) {
                if (measurements.cachedWidth !== that.offsetWidth) {
                    that.style.height = that.offsetWidth + 'px';
                    that._preventResizeHandler = true;
                }
                else if (measurements.cachedHeight !== that.offsetHeight) {
                    that.style.width = that.offsetHeight + 'px';
                    that._preventResizeHandler = true;
                }
            }
        }
        else if (that.sizeMode === 'auto') {
            if (measurements.cachedHeight !== that.offsetHeight && measurements.cachedWidth === that.offsetWidth) {
                that.style.height = measurements.cachedHeight + 'px';
                that._preventResizeHandler = true;
                return;
            }

            that.$.container.style.height = that.offsetWidth + 'px';
        }

        measurements.cachedWidth = that.offsetWidth;
        measurements.cachedHeight = that.offsetHeight;
        measurements.radius = measurements.cachedWidth / 2;

        if (!that._equalToHalfRadius) {
            measurements.innerRadius = measurements.radius - that._distance.labelDistance;
        }
        else {
            measurements.innerRadius = measurements.radius / 2;
        }

        that._renderAnalogItems(false);
    }

    /**
     * Restores inline "fill"/"stroke" previously set to _track, _fill or _line.
     */
    _restoreInlineColors(trackColor, fillColor, lineColor) {
        const that = this;

        if (that._track && trackColor !== '') {
            that._track.style.fill = trackColor;
        }

        if (that._fill && fillColor !== '') {
            that._fill.style.fill = fillColor;
        }

        if (that._line && lineColor !== '') {
            that._line.style.stroke = lineColor;
        }
    }

    /**
     * Document select start handler.
     */
    _selectStartHandler(event) {
        if (this._dragging) {
            event.preventDefault();
        }
    }

    /**
     * Specifies the behaviour of the method "_updatePointer".
     */
    _setUpdatePointerMethod() {
        const that = this;

        if (that.analogDisplayType === 'needle') {
            that._updatePointer = function (value) {
                if (that._customSVGElements) {
                    for (let i = 0; i < that._customSVGElements.length; i++) {
                        that._draw.removeElement(that._customSVGElements[i]);
                    }
                }

                that._drawNeedle(true, value);
            }
        }
        else {
            that._updatePointer = function (value) {
                that._drawFill(true, value);
            }
        }
    }

    /**
     * styleChanged event handler.
     */
    _styleChangedHandler(event) {
        const that = this;

        if (event.detail.styleProperties && event.detail.styleProperties['min-height']) {
            return;
        }

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }
        else if (that._renderingSuspended) {
            that._createElement();
            return;
        }

        that._getMeasurements();
        that._initTickIntervalHandler();
        that._renderAnalogItems();
    }

    /**
     * (Mouse)down event handler for the track, fill and line SVG elements.
     */
    _SVGElementDownHandler(event) {
        const that = this,
            oldContext = that.context;

        that.context = that;
        that._downHandler(event, true);
        that.context = oldContext;
    }

    /**
     * Unlocks rotation of the analog display.
     */
    _unlockRotation(lockName, angle, quadrant, referentAngle, conditions) {
        const that = this,
            firstCondition = conditions.firstCondition,
            secondCondition = conditions.secondCondition,
            angleQuadrant = that._getQuadrant(referentAngle);

        if (((firstCondition && (quadrant !== 4 || angleQuadrant !== 1)) ||
            (secondCondition && (quadrant === 4 && angleQuadrant === 1))) &&
            that._numericProcessor._getAngleDifference(angle, referentAngle) < 10) {
            that[lockName] = false;
        }
    }

    /**
     * Updates the size of the Gauge when "sizeMode" is 'auto'.
     */
    _updateSize(getter) {
        const that = this;

        if (that.sizeMode !== 'auto' && getter === undefined) {
            return;
        }

        const minCoordinates = that._minCoordinates,
            maxCoordinates = that._maxCoordinates;
        let top = minCoordinates[0],
            bottom = maxCoordinates[0];

        for (let i = 1; i < minCoordinates.length; i++) {
            top = Math.min(top, minCoordinates[i]);
        }

        for (let i = 1; i < maxCoordinates.length; i++) {
            bottom = Math.max(bottom, maxCoordinates[i]);
        }

        const gaugeClientRect = that.getBoundingClientRect();

        if (that.digitalDisplay) {
            const digitalDisplayClientRect = that.$.digitalDisplay.getBoundingClientRect();

            top = Math.min(top, digitalDisplayClientRect.top - gaugeClientRect.top);
            bottom = Math.max(bottom, digitalDisplayClientRect.bottom - gaugeClientRect.top);
        }

        if (that.analogDisplayType !== 'needle') {
            const trackBBox = that._track.getBBox();

            top = Math.min(top, trackBBox.y);
            bottom = Math.max(bottom, trackBBox.y + trackBBox.height);
        }

        for (let i = 0; i < that._ranges.length; i++) {
            const rangeBBox = that._ranges[i].getBBox();

            top = Math.min(top, rangeBBox.y - gaugeClientRect.top);
            bottom = Math.max(bottom, rangeBBox.y + rangeBBox.height - gaugeClientRect.top);
        }

        top -= 2;

        const newHeight = bottom - top;

        if (getter === undefined) {
            that._preventResizeHandler = true;

            that.style.height = newHeight + 'px';
            that.$.container.style.marginTop = -1 * top + 'px';

            that._measurements.cachedHeight = newHeight;
        }
        else {
            return Math.round(newHeight);
        }
    }

    /**
     * Updates the values of the Gauge and its digital display and fires the "change" event.
     */
    _updateValue(newValue) {
        this._numericProcessor.updateGaugeValue(newValue);
    }

    /**
     * Validates the value and updates the pointer.
     */
    _validate(initialValidation, programmaticValue, keyCode) {
        const that = this,
            oldValue = that.value;

        that._validateValue(programmaticValue);

        if (keyCode && (keyCode === 35 || keyCode === 36)) {
            that._animate(oldValue);
        }
        else {
            that._updatePointer();
        }
    }

    /**
     * Validates the startAngle and endAngle properties.
     */
    _validateAngles() {
        const that = this;

        that._normalizedStartAngle = that._normalizeAngle(that.startAngle);
        that.endAngle = that._normalizeAngle(that.endAngle);

        if (that._normalizedStartAngle < that.endAngle) {
            that.startAngle = that._normalizedStartAngle;
        }
        else {
            that.startAngle = that._normalizedStartAngle - 360;
        }

        that._angleDifference = that.endAngle - that.startAngle;
    }

    /**
     * Validates initial property values.
     */
    _validateInitialPropertyValues() {
        super._validateInitialPropertyValues();

        const that = this;

        if (that.sizeMode === 'circle') {
            if (that.offsetWidth < that.offsetHeight) {
                that.style.height = that.offsetWidth + 'px';
            }
            else if (that.offsetWidth > that.offsetHeight) {
                that.style.width = that.offsetHeight + 'px';
            }
        }
        else if (that.sizeMode === 'auto') {
            if (that.offsetHeight !== that.offsetWidth) {
                that.style.height = that.offsetWidth + 'px';
            }

            that.$.container.style.height = that.offsetWidth + 'px';
        }

        that._validateAngles();

        if (that.significantDigits !== null) {
            that.$.digitalDisplay.significantDigits = that.significantDigits;
        }
        else if (that.precisionDigits !== null) {
            that.$.digitalDisplay.precisionDigits = that.precisionDigits;
        }
    }

    /**
     * Validates the Gauge's value.
     */
    _validateValue(value, oldValue) {
        const that = this,
            numericProcessor = that._numericProcessor,
            logarithmicGauge = that.logarithmicScale,
            strictValidation = that.validation === 'strict';
        let fireEvent = strictValidation && oldValue !== undefined;

        if (value === undefined) {
            fireEvent = false;
            value = that.value;
        }
        else {
            value = value.toString();
        }

        if (numericProcessor.regexScientificNotation.test(value)) {
            value = numericProcessor.scientificToDecimal(value);
        }

        if (isNaN(value)) {
            value = oldValue || 0;
        }

        let valueNoRangeValidation, stringValueNoRangeValidation, stringValue;

        if (that.coerce) {
            valueNoRangeValidation = numericProcessor.getCoercedValue(numericProcessor.createDescriptor(value, true, true, true), false, logarithmicGauge);
            that._number = valueNoRangeValidation;
            stringValueNoRangeValidation = valueNoRangeValidation.toString();
            stringValue = stringValueNoRangeValidation;
        }
        else if (strictValidation) {
            valueNoRangeValidation = numericProcessor.getCoercedValue(numericProcessor.createDescriptor(value, true, true, true), false, logarithmicGauge);
            that._number = valueNoRangeValidation;
            stringValueNoRangeValidation = valueNoRangeValidation.toString();
            stringValue = stringValueNoRangeValidation;
        }
        else {
            fireEvent = false;
            valueNoRangeValidation = numericProcessor.getCoercedValue(numericProcessor.createDescriptor(value, true, true, false), false, logarithmicGauge);
            that._number = numericProcessor.validate(valueNoRangeValidation, numericProcessor.createDescriptor(that._minObject), numericProcessor.createDescriptor(that._maxObject));
            stringValueNoRangeValidation = valueNoRangeValidation.toString();
            stringValue = that._number.toString();
        }

        let oldValueDetail, valueDetail;

        if (that.mode === 'numeric') {
            oldValueDetail = oldValue;
            valueDetail = stringValueNoRangeValidation;
            that.value = stringValueNoRangeValidation; // the "value" property continues to return the value set by the user
            that.$.digitalDisplay.value = stringValueNoRangeValidation;
        }
        else {
            oldValueDetail = that._valueDate;
            that._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(stringValueNoRangeValidation);
            valueDetail = that._valueDate;
            that.value = valueNoRangeValidation;
        }

        that._drawValue = logarithmicGauge ? Math.log10(stringValue).toString() : stringValue;

        if (fireEvent && (numericProcessor.compare(that._number, oldValue))) {
            that.$.fireEvent('change', { 'value': valueDetail, 'oldValue': oldValueDetail });
        }

        that._setAriaValue('valuenow');

        delete that._valueBeforeCoercion;
    }

    /**
     * Removes custom event listeners.
     */
    _unlisten() {
        const that = this;

        if (that._trackListener) {
            that._trackListener.unlisten();
        }

        if (that._fillListener) {
            that._fillListener.unlisten();
        }

        if (that._lineListener) {
            that._lineListener.unlisten();
        }
    }
});
