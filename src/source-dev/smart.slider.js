
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * Slider custom element.
 */
Smart('smart-slider', class Slider extends Smart.Tank {
    /**
     * Slider's properties.
     */
    static get properties() {
        return {
            'enableMouseWheelAction': {
                value: false,
                type: 'boolean'
            },
            'orientation': {
                value: 'horizontal',
                allowedValues: ['horizontal', 'vertical'],
                type: 'string',
                defaultReflectToAttribute: true
            },
            'rangeSlider': {
                value: false,
                type: 'boolean'
            },
            'showButtons': {
                value: false,
                type: 'boolean'
            },
            'values': {
                value: ['0', '100'],
                type: 'array'
            }
        };
    }

    /**
     * Slider's event listeners.
     */
    static get listeners() {
        return {
            'track.down': '_trackDownHandler',
            'thumb.down': '_thumbDownHandler',
            'secondThumb.down': '_thumbDownHandler',
            'thumb.mouseleave': '_thumbMoveMouseleaveHandler',
            'secondThumb.mouseleave': '_thumbMoveMouseleaveHandler',
            'thumb.move': '_thumbMoveMouseleaveHandler',
            'secondThumb.move': '_thumbMoveMouseleaveHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler',
            'leftButton.click': '_spinButtonClickHandler',
            'rightButton.click': '_spinButtonClickHandler',
            'keydown': '_keydownHandlerSlider',
            'keyup': '_keyupHandlerSlider',
            'resize': '_resizeAndStyleChangedHandler',
            'styleChanged': '_resizeAndStyleChangedHandler',
            'document.selectstart': '_selectStartHandler',
            'wheel': '_wheelHandler'
        };
    }

    /**
     * Slider's required files.
     */
    static get requires() {
        return {
            'Smart.RepeatButton': 'smart.button.js'
        }
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.slider.css',
            'smart.button.css'
        ]
    }

    /**
     * Slider's HTML template.
     */
    template() {
        const template =
            `<div id="container" class="smart-container" role="presentation">
                <div id="scaleNear" class="smart-scale smart-scale-near" aria-hidden="true"></div>
                <div id="trackContainer" class="smart-track-container" role="presentation">
                    <smart-repeat-button id="leftButton" class="smart-spin-button" animation="[[animation]]" unfocusable>
                        <div id="leftArrow" class="smart-arrow" aria-hidden="true"></div>
                    </smart-repeat-button>
                    <div id="track" class="smart-track" role="presentation">
                        <div id="fill" class="smart-value" role="presentation"></div>
                        <div id="trackTicksContainer" class="smart-track-ticks-container smart-hidden" role="presentation"></div>
                        <div id="thumb" class="smart-thumb" role="slider">
                            <span id="thumbLabel" class="smart-thumb-label" role="presentation"></span>
                            <div id="tooltip" class="smart-tooltip" role="tooltip">
                                <div id="tooltipContent" class="smart-tooltip-content smart-unselectable" role="presentation"></div>
                            </div>
                        </div>
                        <div id="secondThumb" class="smart-thumb" role="slider">
                            <span id="secondThumbLabel" class="smart-thumb-label" role="presentation"></span>
                            <div id="secondTooltip" class="smart-tooltip" role="tooltip">
                                <div id="secondTooltipContent" class="smart-tooltip-content smart-unselectable" role="presentation"></div>
                            </div>
                        </div>
                    </div>
                    <smart-repeat-button id="rightButton" class="smart-spin-button" animation="[[animation]]" unfocusable>
                        <div id="rightArrow" class="smart-arrow" aria-hidden="true"></div>
                    </smart-repeat-button>
                </div>
                <div id="scaleFar" class="smart-scale smart-scale-far" aria-hidden="true"></div>
                <input id="hiddenInput" type="hidden" name="[[name]]">
            </div>`;

        return template;
    }

    _createElement() {
        const that = this,
            numericScale = that.mode === 'numeric';

        if (!that.$.tooltip.id) {
            that.$.tooltip.id = that.id + 'Tooltip';
            that.$.secondTooltip.id = that.id + 'SecondTooltip';
        }

        that.setAttribute('role', 'presentation');
        that.setAttribute('aria-describedby', that.$.tooltip.id + ' ' + that.$.secondTooltip.id);

        if (!that._renderingSuspended) {
            if (numericScale) {
                that._redefineProperty('values');
            }
            else if (!numericScale) {
                that._handleDateScale();
            }
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
        that._getMeasurements();
        that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);

        const valuesHandler = that._valuesHandler = that.rangeSlider ? new Smart.Utilities.SliderMultipleValueHandler(that) : new Smart.Utilities.SliderSingleValueHandler(that);

        if (numericScale) {
            that._getEventValue = function () {
                return that._valuesHandler.getValue();
            };
        }

        that._validateInitialPropertyValues();

        that._setTicksAndInterval();

        valuesHandler.validate(true); // initial value(s) validation
        valuesHandler.updateTooltipValue();

        window.requestAnimationFrame(function () {
            that.$thumb.addClass('enable-animation');
            that.$secondThumb.addClass('enable-animation');
            that.$fill.addClass('enable-animation');
        });

        that._setFocusable();
        that._makeThumbAccessible();

        that.$.hiddenInput.value = that._getEventValue();

        that.$.thumb.setAttribute('aria-orientation', that.orientation);
        that.$.secondThumb.setAttribute('aria-orientation', that.orientation);
        that._setAriaValue('valuenow');
    }

    /*
     * Public methods
     */

    /**
     * Sets or gets the value of the slider.
     *
     * @param {Number/String} value Optional value to be set to the slider. If this parameter is not set, the method gets the value.
     */
    val(value) {
        const that = this,
            valuesHandler = that._valuesHandler;

        if (value !== undefined) {
            if (that.mode === 'date') {
                if (!that.rangeSlider) {
                    value = Smart.Utilities.DateTime.validateDate(value);
                    value = value.getTimeStamp();
                }
                else {
                    value[0] = Smart.Utilities.DateTime.validateDate(value[0]);
                    value[1] = Smart.Utilities.DateTime.validateDate(value[1]);
                    value[0] = value[0].getTimeStamp();
                    value[1] = value[1].getTimeStamp();
                }
            }

            // use as value setter
            if (valuesHandler.areDifferent(value)) {
                valuesHandler.validate(false, value, true);
            }
        }
        else {
            // use as value getter
            return that._getEventValue();
        }
    }

    /**
     * Gets the optimal size of the slider.
     */
    getOptimalSize() {
        const that = this;

        if (that._renderingSuspended) {
            return { width: 0, height: 0 };
        }

        const sliderStyle = window.getComputedStyle(that),
            trackStyle = window.getComputedStyle(that.$.trackContainer);
        let optimalSize = 0,
            largestLabelSize, optimalOtherSize, labels, firstLabel, lastLabel, firstRect, lastRect, difference;

        if (that.labelsVisibility === 'all') {
            largestLabelSize = that._numericProcessor._longestLabelSize
        }
        else if (that.labelsVisibility === 'endPoints') {
            largestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
        }
        else {
            largestLabelSize = 0;
        }

        if (that.orientation === 'horizontal') {
            optimalSize += parseFloat(trackStyle.marginTop) + parseFloat(trackStyle.marginBottom) + that.$.track.offsetHeight;
            if (that.scalePosition === 'near' || that.scalePosition === 'both') {
                optimalSize += largestLabelSize;
                labels = that.$.scaleNear.getElementsByClassName('smart-label');
                firstLabel = labels[0];
                lastLabel = labels[labels.length - 1];
                optimalSize += parseFloat(window.getComputedStyle(firstLabel).bottom);
            }
            if (that.scalePosition === 'far' || that.scalePosition === 'both') {
                optimalSize += largestLabelSize;
                labels = that.$.scaleFar.getElementsByClassName('smart-label');
                firstLabel = labels[0];
                lastLabel = labels[labels.length - 1];
                optimalSize += parseFloat(window.getComputedStyle(firstLabel).top);
            }
            optimalSize += parseFloat(sliderStyle.paddingTop) + parseFloat(sliderStyle.paddingBottom);

            optimalOtherSize = that.offsetWidth;

            if (that.scalePosition !== 'none') {
                firstRect = firstLabel.getBoundingClientRect();
                lastRect = lastLabel.getBoundingClientRect();

                difference = firstRect.left + firstLabel.offsetWidth - lastRect.left;
                if (difference > 0) {
                    optimalOtherSize = firstLabel.offsetWidth + lastLabel.offsetWidth + Math.max(10, that.$.thumb.offsetWidth);
                }
            }

            return { width: optimalOtherSize, height: optimalSize };
        }
        else {
            optimalSize += parseFloat(trackStyle.marginLeft) + parseFloat(trackStyle.marginRight) + that.$.track.offsetWidth;
            if (that.scalePosition === 'near' || that.scalePosition === 'both') {
                optimalSize += largestLabelSize;
                labels = that.$.scaleNear.getElementsByClassName('smart-label');
                firstLabel = labels[0];
                lastLabel = labels[labels.length - 1];
                optimalSize += parseFloat(window.getComputedStyle(firstLabel).right);
            }
            if (that.scalePosition === 'far' || that.scalePosition === 'both') {
                optimalSize += largestLabelSize;
                labels = that.$.scaleFar.getElementsByClassName('smart-label');
                firstLabel = labels[0];
                lastLabel = labels[labels.length - 1];
                optimalSize += parseFloat(window.getComputedStyle(firstLabel).left);
            }
            optimalSize += parseFloat(sliderStyle.paddingLeft) + parseFloat(sliderStyle.paddingRight);

            optimalOtherSize = that.offsetHeight;

            if (that.scalePosition !== 'none') {
                firstRect = firstLabel.getBoundingClientRect();
                lastRect = lastLabel.getBoundingClientRect();

                difference = firstRect.top + firstLabel.offsetHeight - lastRect.top;
                if (difference > 0) {
                    optimalOtherSize = firstLabel.offsetHeight + lastLabel.offsetHeight + Math.max(10, that.$.thumb.offsetHeight);
                }
            }

            return { width: optimalSize, height: optimalOtherSize };
        }
    }

    /**
     * Invoked when the value of a public property has been changed by the user.
     */
    propertyChangedHandler(key, oldValue, value) {
        const that = this,
            sameHandlers = ['disabled', 'mode', 'readonly', 'showThumbLabel', 'tooltipPosition', 'unfocusable', 'validation'];

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        if (sameHandlers.indexOf(key) !== -1) {
            super.propertyChangedHandler(key, oldValue, value);
            return;
        }

        let valuesHandler = that._valuesHandler;

        function redraw() {
            that._setTicksAndInterval();
            valuesHandler.validate(false, valuesHandler.getValue(), true);
        }

        // eslint-disable-next-line
        if (key !== 'values' && value != oldValue || key === 'values' && (value[0] != oldValue[0] || value[1] !== oldValue[1])) {
            switch (key) {
                case 'coerce':
                    if (value) {
                        const valueBeforeCoercion = valuesHandler.getValue();
                        valuesHandler.validate(false, valueBeforeCoercion.slice(0), true);
                        that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                    }
                    else {
                        if (that._valueBeforeCoercion !== undefined) {
                            valuesHandler.validate(false, that._valueBeforeCoercion.slice(0), true); // restores the value from before coercion
                        }
                    }
                    break;
                case 'customInterval':
                case 'customTicks':
                    super.propertyChangedHandler(key, oldValue, value);

                    if (that.customInterval) {
                        valuesHandler.validate(false, valuesHandler.getValue(), true);
                    }

                    break;
                case 'dateLabelFormatString':
                    if (that.mode === 'date') {
                        redraw();
                    }

                    break;
                case 'decimalSeparator':
                case 'scientificNotation':
                    if (that.mode === 'date') {
                        return;
                    }

                    redraw();
                    break;
                case 'interval':
                    //Validates the Interval
                    that._numericProcessor.validateInterval(value);

                    valuesHandler.validate(false, valuesHandler.getValue(), true);
                    break;
                case 'inverted':
                case 'rightToLeft':
                    that._getLayoutType();
                    if (that._normalLayout) {
                        that.$.fill.style[that._settings.margin] = '0px';
                    }

                    redraw();
                    break;
                case 'labelFormatFunction':
                case 'showUnit':
                case 'unit':
                    redraw();
                    break;
                case 'labelsVisibility':
                case 'ticksVisibility':
                    return;
                case 'logarithmicScale':
                    if (that.mode === 'date') {
                        that.logarithmicScale = false;
                        return;
                    }

                    that._validateMinMax('both');
                    redraw();
                    break;
                case 'min':
                case 'max':
                    if (that.mode === 'date') {
                        delete that._dateInterval;

                        that[key] = Smart.Utilities.DateTime.validateDate(value).getTimeStamp();
                    }

                    that._validateMinMax(key, false, oldValue);
                    redraw();
                    break;
                case 'orientation':
                    // clears previously applied inline styles
                    that.$.container.removeAttribute('style');
                    that.$.trackContainer.removeAttribute('style');
                    that.$.fill.removeAttribute('style');
                    that.$.thumb.removeAttribute('style');
                    that.$.secondThumb.removeAttribute('style');

                    that._setSettingsObject();
                    that._getLayoutType();
                    that._getMeasurements();

                    redraw();

                    if (value === 'horizontal') {
                        that.$leftArrow.removeClass('smart-arrow-up');
                        that.$rightArrow.removeClass('smart-arrow-down');
                        that.$leftArrow.addClass('smart-arrow-left');
                        that.$rightArrow.addClass('smart-arrow-right');
                    }
                    else {
                        that.$leftArrow.removeClass('smart-arrow-left');
                        that.$rightArrow.removeClass('smart-arrow-right');
                        that.$leftArrow.addClass('smart-arrow-up');
                        that.$rightArrow.addClass('smart-arrow-down');
                    }

                    that.$.thumb.setAttribute('aria-orientation', value);
                    that.$.secondThumb.setAttribute('aria-orientation', value);
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

                    redraw();
                    break;
                case 'rangeSlider':
                    if (value) {
                        that.values = [that.min, that.value];
                        that._drawValues = [that._drawMin, that._drawValue];

                        if (that.mode === 'date') {
                            that._valueDate = [that._minDate.clone(), that._valueDate];
                        }

                        if (that._valueBeforeCoercion !== undefined) {
                            that._valueBeforeCoercion = [that.min, that._valueBeforeCoercion];
                        }
                        valuesHandler = that._valuesHandler = new Smart.Utilities.SliderMultipleValueHandler(that);
                    }
                    else {
                        that.value = that.values[1];
                        that._drawValue = that._drawValues[1];

                        if (that.mode === 'date') {
                            that._valueDate = that._valueDate[1];
                        }

                        if (that._valueBeforeCoercion !== undefined) {
                            that._valueBeforeCoercion = that._valueBeforeCoercion[1];
                        }
                        valuesHandler = that._valuesHandler = new Smart.Utilities.SliderSingleValueHandler(that);
                        that.$.fill.style.marginTop = 0;
                        that.$.fill.style.marginLeft = 0;
                    }
                    valuesHandler.validate(false, valuesHandler.getValue(), true);
                    break;
                case 'scalePosition':
                    that._setInitialComponentDisplay();
                    redraw();
                    break;
                case 'scaleType':
                    if (that.mode === 'date') {
                        that.scaleType = 'integer';
                        return;
                    }

                    that._numericProcessor = new Smart.Utilities.NumericProcessor(that, 'scaleType');

                    that._validateMinMax('both');

                    that._setTicksAndInterval();
                    valuesHandler.validate(true);
                    break;
                case 'showButtons':
                    if (value) {
                        that.$leftButton.removeClass('smart-hidden');
                        that.$rightButton.removeClass('smart-hidden');
                    }
                    else {
                        that.$leftButton.addClass('smart-hidden');
                        that.$rightButton.addClass('smart-hidden');
                    }
                    that._setTicksAndInterval();
                    valuesHandler.moveThumbBasedOnValue(valuesHandler.getDrawValue(), undefined, true);
                    break;
                case 'showTooltip':
                    super.propertyChangedHandler(key, oldValue, value);

                    if (!value) {
                        that.$tooltip.addClass('smart-hidden');
                        that.$secondTooltip.addClass('smart-hidden');
                    }

                    break;
                case 'theme':
                    super.propertyChangedHandler(key, oldValue, value);
                    redraw();
                    break;
                case 'ticksPosition':
                    if (value === 'scale') {
                        that.$trackTicksContainer.addClass('smart-hidden');
                        that.$.trackTicksContainer.innerHTML = '';
                    }
                    else {
                        that.$trackTicksContainer.removeClass('smart-hidden');
                    }

                    that._setTicksAndInterval();
                    break;
                case 'value':
                case 'values':
                    if (key === 'value' && that.rangeSlider ||
                        key === 'values' && !that.rangeSlider) {
                        return;
                    }

                    that[key] = oldValue;

                    if (that.mode === 'date') {
                        if (key === 'value') {
                            value = Smart.Utilities.DateTime.validateDate(value);
                            value = value.getTimeStamp();
                            that.value = value;

                            if (value.compare(oldValue) === 0) {
                                return;
                            }
                        }
                        else {
                            value[0] = Smart.Utilities.DateTime.validateDate(value[0]);
                            value[1] = Smart.Utilities.DateTime.validateDate(value[1]);
                            value[0] = value[0].getTimeStamp();
                            value[1] = value[1].getTimeStamp();
                            that.values = value;

                            if (value[0].compare(oldValue[0]) === 0 && value[1].compare(oldValue[1]) === 0) {
                                return;
                            }
                        }
                    }

                    valuesHandler.validate(false, value, true);
                    break;
                case 'wordLength':
                    if (that.mode === 'date') {
                        that.wordLength = 'uint64';
                        return;
                    }

                    that._wordLengthNumber = that._numericProcessor.getWordLength(value);
                    that._validateMinMax('both');
                    redraw();
                    break;
            }
        }
        else if (typeof value !== 'string' && typeof oldValue === 'string') {
            that[key] = oldValue;
        }
    }

    /**
     * Adds the class "smart-moved-thumb" to the moved thumb.
     */
    _addMovedThumbClass() {
        const that = this;

        if (!that.rangeSlider) {
            return;
        }

        that._movedThumb.$.addClass('smart-moved-thumb');

        if (that._movedThumb === that.$.thumb) {
            that.$secondThumb.removeClass('smart-moved-thumb');
        }
        else {
            that.$thumb.removeClass('smart-moved-thumb');
        }
    }

    /**
     * Sets the display of the scales.
     */
    _setInitialComponentDisplay() {
        super._setInitialComponentDisplay();

        const that = this;

        that.$secondTooltip.addClass('smart-hidden');

        if (!that.showButtons) {
            that.$leftButton.addClass('smart-hidden');
            that.$rightButton.addClass('smart-hidden');
        }
    }

    /**
     * Measures some elements of the slider and stores the results.
     */
    _getMeasurements() {
        const that = this,
            measurements = that._measurements,
            track = that.$.track,
            thumb = that.$.thumb;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        if (that.orientation === 'horizontal') {
            measurements.trackWidth = track.offsetHeight;
            measurements.thumbSize = thumb.offsetWidth;
            measurements.borderWidth = parseFloat(window.getComputedStyle(that.$.track).borderLeftWidth);
        }
        else {
            measurements.trackWidth = track.offsetWidth;
            measurements.thumbSize = thumb.offsetHeight;
            measurements.borderWidth = parseFloat(window.getComputedStyle(that.$.track).borderTopWidth);
        }
        measurements.halfThumbSize = measurements.thumbSize / 2;

    }

    /**
     * Applies necessary paddings to the track container.
     */
    _layout() {
        const that = this,
            measurements = that._measurements,
            containerStyle = that.$.container.style,
            thumbPadding = measurements.halfThumbSize,
            labelsSize = that._tickIntervalHandler.labelsSize;
        let minLabelPadding, maxLabelPadding, paddingStart, paddingEnd;

        if (that.scalePosition !== 'none') {
            minLabelPadding = labelsSize.minLabelSize / 2;
            maxLabelPadding = labelsSize.maxLabelSize / 2;
        }
        else {
            minLabelPadding = 0;
            maxLabelPadding = 0;
        }

        if (!that.showButtons) {
            paddingStart = Math.max(thumbPadding, minLabelPadding) + 'px';
            paddingEnd = Math.max(thumbPadding, maxLabelPadding) + 'px';
        }
        else {
            const spinButtonSize = that.$.leftButton[that._settings.size],
                buttonSize = spinButtonSize + thumbPadding;
            paddingStart = Math.max(minLabelPadding - buttonSize, 0) + 'px';
            paddingEnd = Math.max(maxLabelPadding - buttonSize, 0) + 'px';
        }

        if (that.orientation === 'horizontal') {
            if ((!that.inverted && !that.rightToLeft) || (that.rightToLeft && that.inverted)) {
                containerStyle.paddingLeft = paddingStart;
                containerStyle.paddingRight = paddingEnd;
            }
            else {
                containerStyle.paddingLeft = paddingEnd;
                containerStyle.paddingRight = paddingStart;
            }

            measurements.trackLength = that.$.track.clientWidth;

            that.$leftArrow.addClass('smart-arrow-left');
            that.$rightArrow.addClass('smart-arrow-right');
        }
        else {
            if (!that.inverted) {
                containerStyle.paddingBottom = paddingStart;
                containerStyle.paddingTop = paddingEnd;
            }
            else {
                containerStyle.paddingBottom = paddingEnd;
                containerStyle.paddingTop = paddingStart;
            }

            measurements.trackLength = that.$.track.clientHeight;

            that.$leftArrow.addClass('smart-arrow-up');
            that.$rightArrow.addClass('smart-arrow-down');
        }
    }

    /**
     * Track click event handler.
     */
    _trackDownHandler(event) {
        const that = this,
            mechanicalAction = that.mechanicalAction;

        if (that.disabled || that.readonly || !that.rangeSlider && event.target === that.$.thumb) {
            return;
        }

        if (that._stopTrackDownHandler) {
            that._stopTrackDownHandler = false;
            return;
        }

        if (mechanicalAction !== 'switchWhileDragging') {
            that._valueAtDragStart = that._valuesHandler.getValue();
        }

        that._getTrackStartAndEnd();
        that._valuesHandler.setActiveThumbOnTrackClick(event);

        that._moveThumbBasedOnCoordinates(event, true, mechanicalAction !== 'switchWhenReleased');

        that._thumbDragged = true;
        that.setAttribute('dragged', '');

        if (that.showTooltip) {
            that._movedTooltip.removeClass('smart-hidden');
        }
    }

    _trackMoveHandler() { }

    /**
     * Thumb mousedown event handler.
     */
    _thumbDownHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }
        that._getTrackStartAndEnd();

        if (event[that._settings.page] < that._trackStart || event[that._settings.page] > that._trackEnd) {
            that._stopTrackDownHandler = true;
        }

        if (that.mechanicalAction !== 'switchWhileDragging') {
            that._valueAtDragStart = that._valuesHandler.getValue();
        }

        window.getSelection().removeAllRanges();

        that._thumbDragged = true;
        that.setAttribute('dragged', '');
        that.$track.addClass('smart-dragged');
        that._movedThumb = event.target;
        that._addMovedThumbClass();
        that._movedTooltip = that.$tooltip;

        if (that.rangeSlider) {
            if (that._movedThumb === that.$.thumb) {
                that._staticThumb = that.$.secondThumb;
                that.$secondTooltip.addClass('smart-hidden');
            }
            else {
                that._staticThumb = that.$.thumb;
                that._movedTooltip = that.$secondTooltip;
                that.$tooltip.addClass('smart-hidden');
            }
        }

        if (that.showTooltip) {
            that._movedTooltip.removeClass('smart-hidden');
        }

        event.stopPropagation();
    }

    /**
     * Thumb move and mouseleave event handler.
     */
    _thumbMoveMouseleaveHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        const target = event.target;

        if (event.type === 'move') {
            const targetRect = target.getBoundingClientRect(),
                windowScrollX = window.scrollX || window.pageXOffset,
                windowScrollY = window.scrollY || window.pageYOffset,
                centerX = (targetRect.left + targetRect.right) / 2 + windowScrollX,
                centerY = (targetRect.top + targetRect.bottom) / 2 + windowScrollY,
                rSquared = Math.pow(targetRect.width / 2, 2);

            if ((Math.pow(event.pageX - centerX, 2) + Math.pow(event.pageY - centerY, 2)) > rSquared) {
                return;
            }

            target.setAttribute('hover', '');
        }
        else {
            target.removeAttribute('hover');
        }
    }

    /**
     * Document mousemove event handler.
     */
    _documentMoveHandler(event) {
        const that = this;
        if (that._thumbDragged) {
            that.$thumb.removeClass('enable-animation');
            that.$secondThumb.removeClass('enable-animation');
            that.$fill.removeClass('enable-animation');

            that._moveThumbBasedOnCoordinates(event, true, that.mechanicalAction !== 'switchWhenReleased');
        }
    }

    /**
     * Document mouseup event handler.
     */
    _documentUpHandler(event, canceled) {
        const that = this;

        if (!that._thumbDragged) {
            return;
        }

        that.$thumb.addClass('enable-animation');
        that.$secondThumb.addClass('enable-animation');
        that.$fill.addClass('enable-animation');

        if (!canceled) {
            if (that.mechanicalAction === 'switchUntilReleased') {
                that._valuesHandler.validate(false, that._valueAtDragStart);
            }
            else if (that.mechanicalAction === 'switchWhenReleased') {
                that._moveThumbBasedOnCoordinates(event, true, true);
            }
        }

        if (that.showTooltip) {
            that._movedTooltip.addClass('smart-hidden');
        }

        that._thumbDragged = false;
        that.removeAttribute('dragged');
        that._makeThumbAccessible();
        that._movedThumb = undefined;
        that.$track.removeClass('smart-dragged');
    }

    /**
     * Spin button click event handler.
     */
    _spinButtonClickHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        let operation;

        if (that.$.leftButton.contains(event.target) === that._normalLayout) {
            operation = 'subtract';
        }
        else {
            operation = 'add';
        }

        that._valuesHandler.incrementOrDecrement(operation);
    }

    /**
     * Slider keydown event handler.
     */
    _keydownHandlerSlider(event) {
        const that = this,
            key = event.key;

        if (key === 'Escape' && that._thumbDragged && that.mechanicalAction === 'switchWhenReleased') {
            that._documentUpHandler(undefined, true);
            that._valuesHandler.validate(false, that._valueAtDragStart);
            return;
        }

        if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].indexOf(key) !== -1 && !that.coerce) {
            that.$thumb.removeClass('enable-animation');
            that.$secondThumb.removeClass('enable-animation');
            that.$fill.removeClass('enable-animation');
            that._restoreAnimationClass = true;
        }

        this._valuesHandler.keydownHandler(event);
    }

    /**
    * Slider keyup event handler.
    */
    _keyupHandlerSlider() {
        const that = this;

        if (that._restoreAnimationClass) {
            that.$thumb.addClass('enable-animation');
            that.$secondThumb.addClass('enable-animation');
            that.$fill.addClass('enable-animation');
        }
    }

    /**
     * Slider resize and styleChanged event handler.
     */
    _resizeAndStyleChangedHandler(event) {
        const that = this,
            valuesHandler = that._valuesHandler;

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

        that._getMeasurements();
        that._setTicksAndInterval();
        valuesHandler.validate(false, valuesHandler.getValue(), true);

        if (event.type === 'styleChanged') {
            const changedStyleProperties = event.detail.styleProperties;

            if (changedStyleProperties['font-size'] || changedStyleProperties['font-family'] || changedStyleProperties['font-style'] || changedStyleProperties['font-weight']) {
                const optimum = that.getOptimalSize();
                that.style.width = optimum.width + 'px';
                that.style.height = optimum.height + 'px';
            }
        }
    }

    /**
     * Moves the slider's thumb and updates the filled part of the track based on the position of the mouse.
     */
    _moveThumbBasedOnCoordinates(event, checkBoundaries, changeValue) {
        const that = this,
            numericProcessor = that._numericProcessor,
            trackStart = that._trackStart,
            margin = that._settings.margin;
        let coordinate = event[that._settings.page];

        if (checkBoundaries) {
            coordinate = that._valuesHandler.restrictThumbCoordinates(coordinate, trackStart, that._trackEnd);
        }

        let newValue = numericProcessor.pxToValue(coordinate);

        if (that.rangeSlider && that._movedThumb === that.$.thumb && numericProcessor.compare(newValue, that.values[1], true) === 1) {
            newValue = numericProcessor.createDescriptor(that.values[1]);
        }

        let actualNewValue = newValue;

        if (!that.logarithmicScale) {
            newValue = numericProcessor.getCoercedValue(newValue);
            actualNewValue = newValue;
        }
        else {
            newValue = numericProcessor.getCoercedValue(Math.log10(newValue));
            actualNewValue = parseFloat(Math.pow(10, newValue).toFixed(11));
        }
        coordinate = numericProcessor.valueToPx(newValue) + trackStart;

        const size = coordinate - trackStart;

        that._movedThumb.style[margin] = size - that._measurements.halfThumbSize + 'px';

        that._valuesHandler.updateFillSizeAndPosition(size, margin, actualNewValue, true, changeValue);

        if (Smart.Utilities.Core.isMobile && event.originalEvent) {
            event.originalEvent.stopPropagation();
            event.originalEvent.preventDefault();
        }
    }

    /**
     * Moves the slider's thumb and updates the filled part of the track based on a passed value.
     */
    _moveThumbBasedOnValue(thumb, value, triggerEvent, firstPass) {
        const that = this,
            px = that._numericProcessor.valueToPx(value),
            margin = that._settings.margin;

        thumb.style[margin] = (px - that._measurements.halfThumbSize) + 'px';

        const actualValue = that._getSingleActualValue(value);

        if (!firstPass) {
            that._valuesHandler.updateFillSizeAndPosition(px, margin, actualValue, triggerEvent, triggerEvent);
        }
        else if (that.rangeSlider) {
            that._firstPassSize = px;
        }
    }

    /**
     * Calls the appropriate validation function.
     */
    _validate(initialValidation, programmaticValue, coerced, programmaticValueIsSet) {
        this._valuesHandler.validate(initialValidation, programmaticValue, programmaticValueIsSet);
    }

    /**
     * Calls the appropriate update function.
     */
    _updateValue(value) {
        const valuesHandler = this._valuesHandler;
        valuesHandler.updateValue(valuesHandler.getActualValue(value));
    }

    /**
     * Makes the first thumb accessible.
     */
    _makeThumbAccessible() {
        const that = this;
        if (that.rangeSlider) {
            if (that.$.thumb[that._settings.offset] === that.$.secondThumb[that._settings.offset] && that._numericProcessor.compare(that.values[1], that.max) === false) {
                that.$thumb.addClass('accessible');
            }
            else {
                that.$thumb.removeClass('accessible');
            }
        }
    }

    /**
     * Returns a single, actual value.
     */
    _getSingleActualValue(value) {
        if (this.logarithmicScale) {
            return parseFloat(Math.pow(10, value).toFixed(11));
        }

        return value.toString();
    }

    /**
     * Coerces the value when changes to custom interval-related settings are made.
     */
    _coerceCustomInterval() {
        const that = this;

        if (that.coerce) {
            const valueBeforeCoercion = that._valueBeforeCoercion;

            that._valuesHandler.validate(false, that._valuesHandler.getValue());
            that._valueBeforeCoercion = valueBeforeCoercion;
        }
    }

    /**
     * wheel event handler
     */
    _wheelHandler(event) {
        const that = this;

        if (document.activeElement !== that || !that.enableMouseWheelAction) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (event.wheelDelta > 0) {
            that._keydownHandlerSlider({ key: 'ArrowRight', which: 39, preventDefault: function () { } });
        }
        else {
            that._keydownHandlerSlider({ key: 'ArrowLeft', which: 37, preventDefault: function () { } });
        }
    }

    /**
     * Handles date scale.
     */
    _handleDateScale() {
        const that = this,
            dateTime = Smart.Utilities.DateTime;

        super._handleDateScale();

        Object.defineProperty(that, 'values', {
            get: function () {
                if (that.context === that) {
                    return that.properties.values.value;
                }
                else {
                    return that._valueDate;
                }
            },
            set(value) {
                function replacer(key, value) {
                    if (value instanceof Smart.Utilities.BigNumber) {
                        return value.toString();
                    }

                    return value;
                }

                const oldValue = that.properties.values.value,
                    stringifiedOldValue = JSON.stringify(oldValue, replacer),
                    stringifiedValue = JSON.stringify(value, replacer);

                if (stringifiedOldValue === stringifiedValue) {
                    return;
                }

                that.properties.values.value = value;

                if (that.isReady && (!that.ownerElement || (that.ownerElement && that.ownerElement.isReady)) && that.context !== that) {
                    const context = that.context;

                    that.context = that;
                    that.propertyChangedHandler('values', oldValue, value);
                    that.context = context;
                }
            }
        });

        if (that.rangeSlider) {
            that._valueDate = [dateTime.validateDate(that.values[0]), dateTime.validateDate(that.values[1])];
            that.values = [that._valueDate[0].getTimeStamp(), that._valueDate[1].getTimeStamp()];
        }

        that._properties.values.serialize = '_serializeValue';
    }

    /**
     * Sets new Ticks and Interval 
     */
    _setTicksAndInterval() {
        const that = this;

        if (that._skipTrackReset) {
            delete that._skipTrackReset;
        }
        else {
            that.$.track.style[that._settings.dimension] = null;
        }

        super._setTicksAndInterval();

        if (that.$.track[that._settings.size] < 10) {
            that._skipTrackReset = true;
            that.$.track.style[that._settings.dimension] = that.getOptimalSize()[that._settings.dimension] + 'px';
            that._getMeasurements();
            that._setTicksAndInterval();
            that._valuesHandler.validate(false, that._valuesHandler.getValue());
        }
    }

    /**
     * Sets the internal property "_normalLayout" based on the properties "orientation" and "inverted" and applies WAI-ARIA descriptions to the buttons.
     */
    _getLayoutType() {
        const that = this;

        super._getLayoutType();

        if (that._normalLayout) {
            that.$.leftButton.setAttribute('aria-label', 'Decrement');
            that.$.rightButton.setAttribute('aria-label', 'Increment');
        }
        else {
            that.$.leftButton.setAttribute('aria-label', 'Increment');
            that.$.rightButton.setAttribute('aria-label', 'Decrement');
        }
    }

    /**
     * Sets the aria-valuemax, aria-valuemin, aria-valuenow, and aria-valuetext properties.
     */
    _setAriaValue(property) {
        this._valuesHandler.setAriaValue(property);
    }
});

/**
 * A class for instantiating a tooltip handler object (standard case).
 */
Smart.Utilities.Assign('SliderSingleValueHandler', class SliderSingleValueHandler {
    constructor(context) {
        this.context = context;

        if (context.mode === 'date') {
            context._getEventValue = function (aria, value) {
                let result;

                if (value !== undefined) {
                    result = Smart.Utilities.DateTime.fromFullTimeStamp(value);
                }
                else {
                    result = context._valueDate.clone();
                }

                if (aria) {
                    context.$.thumb.setAttribute('aria-valuetext', result.toString('f'));
                    return context.value.toString();
                }

                return result;
            }
        }
    }

    applyFunctionToValue(fn, argument) {
        const that = this,
            context = that.context;

        if (argument === undefined) {
            argument = context.value;
        }

        const result = fn.apply(context, [argument]);

        return result;
    }

    areDifferent(other) {
        return this.context.value !== other;
    }

    incrementOrDecrement(operation) {
        const context = this.context,
            newValue = context._keyIncrementDecrement(operation);
        this.validate(false, newValue);
    }

    setActiveThumbOnTrackClick() {
        const context = this.context;
        context._movedThumb = context.$.thumb;
        context._addMovedThumbClass();
        context._movedTooltip = context.$tooltip;
    }

    getActualValue(value) {
        return this.context._getSingleActualValue(value);
    }

    getCoercedLogarithmicValue(value) {
        const context = this.context;
        if (context.logarithmicScale) {
            const newDrawValue = context._numericProcessor.getCoercedValue(Math.log10(value));
            return this.getActualValue(newDrawValue);
        }
        return value;
    }

    getDrawValue() {
        return this.context._drawValue;
    }

    getValue() {
        return this.context.value;
    }

    keydownHandler(event) {
        this.context._keydownHandler(event);
    }

    moveThumbBasedOnValue(value, triggerEvent, noUpdate) {
        const context = this.context;

        if (value === undefined) {
            value = context.value;
        }

        context._moveThumbBasedOnValue(context.$.thumb, value, triggerEvent);

        if (noUpdate !== true) {
            context._drawValue = value;
            const actualValue = this.getActualValue(value);
            let updatedValue;

            if (context._valueNoRangeValidation !== undefined) {
                updatedValue = context._valueNoRangeValidation.toString();
            }
            else {
                updatedValue = actualValue.toString();
            }

            if (context.mode === 'date') {
                context._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(updatedValue);
            }

            context.value = updatedValue;

            delete context._valueBeforeCoercion;
            this.updateTooltipValue(actualValue);
        }
    }

    restrictThumbCoordinates(coordinate, trackStart, trackEnd) {
        coordinate = Math.max(coordinate, trackStart);
        coordinate = Math.min(coordinate, trackEnd);
        return coordinate;
    }

    updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
        const context = this.context,
            fillStyle = context.$.fill.style,
            dimension = context._settings.dimension;

        if (context._normalLayout) {
            fillStyle[dimension] = size + 'px';
        }
        else {
            fillStyle[dimension] = (context._measurements.trackLength - size) + 'px';
            fillStyle[margin] = size + 'px';
        }

        if (updateTooltip) {
            const oldValue = context.value,
                eventOldValue = context._getEventValue(false, oldValue),
                numericProcessor = context._numericProcessor;
            if (numericProcessor.compare(numericProcessor.createDescriptor(newValue), numericProcessor.createDescriptor(oldValue))) {
                this.updateTooltipValue(newValue);

                if (changeValue) {
                    let updatedValue;

                    context._drawValue = context.logarithmicScale ? Math.log10(newValue) : newValue;

                    if (context._valueNoRangeValidation !== undefined) {
                        updatedValue = context._valueNoRangeValidation.toString();
                    }
                    else {
                        updatedValue = newValue.toString();
                    }

                    if (context.mode === 'date') {
                        context._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(updatedValue);
                    }

                    context.value = updatedValue;

                    delete context._valueBeforeCoercion;

                    if (context._programmaticValueIsSet !== true) {
                        const eventValue = context._getEventValue();

                        //Update hidden input
                        context.$.hiddenInput.value = eventValue;
                        context.$.fireEvent('change', { 'value': eventValue, 'oldValue': eventOldValue });
                        this.setAriaValue('valuenow');
                    }
                }
            }
        }
    }

    updateTooltipValue(newValue) {
        const context = this.context;

        if (newValue === undefined) {
            newValue = context.value;
        }

        const newFormattedValue = context._formatLabel(newValue);

        if (context.$.tooltipContent.innerHTML !== newFormattedValue) {
            context.$.tooltipContent.innerHTML = newFormattedValue;
            context.$.thumbLabel.innerHTML = newFormattedValue;
        }
    }

    updateValue(value) {
        const context = this.context,
            renderedValue = context._numericProcessor.createDescriptor(value, true, false);

        context._drawValue = context.logarithmicScale ? Math.log10(renderedValue) : renderedValue;
        this.moveThumbBasedOnValue(context._drawValue, true);
    }

    validate(initialValidation, programmaticValue, programmaticValueIsSet) {
        const context = this.context,
            numericProcessor = context._numericProcessor;
        let value;

        context._programmaticValueIsSet = programmaticValueIsSet && context.validation === 'interaction';

        if (initialValidation) {
            value = context.value;
        }
        else {
            value = programmaticValue;
        }

        let validNumber;

        if (context.coerce) {
            value = context._numericProcessor.createDescriptor(value, true, true, true);
        }

        if (context.logarithmicScale) {
            value = this.getCoercedLogarithmicValue(value);
        }
        else {
            value = numericProcessor.getCoercedValue(value);
        }

        if (context.validation === 'strict') {
            context._valueNoRangeValidation = numericProcessor.createDescriptor(value, true, true, true);
            validNumber = context._valueNoRangeValidation;
        }
        else {
            context._valueNoRangeValidation = numericProcessor.createDescriptor(value, true, true, false);
            validNumber = numericProcessor.validate(context._valueNoRangeValidation, context._minObject, context._maxObject);
        }

        if (initialValidation) {
            context._drawValue = context.logarithmicScale ? Math.log10(validNumber) : validNumber;
            value = context._valueNoRangeValidation.toString();

            if (context.mode === 'date') {
                context._valueDate = Smart.Utilities.DateTime.fromFullTimeStamp(value);
            }

            context.value = value;

            this.moveThumbBasedOnValue(context._drawValue, undefined, true);
        }
        else {
            this.updateValue(validNumber);
        }

        delete context._valueNoRangeValidation;
        context._programmaticValueIsSet = false;
    }

    /**
     * Sets the aria-valuemax, aria-valuemin, aria-valuenow, and aria-valuetext properties.
     */
    setAriaValue(property) {
        const context = this.context,
            thumb = context.$.thumb;

        if (property === 'valuenow') {
            thumb.setAttribute('aria-valuenow', context._getEventValue(true));
        }
        else {
            thumb.setAttribute('aria-valuemin', context.min.toString());
            thumb.setAttribute('aria-valuemax', context.max.toString());
        }
    }
});

/**
 * A class for instantiating a tooltip handler object (range slider case).
 */
Smart.Utilities.Assign('SliderMultipleValueHandler', class SliderMultipleValueHandler {
    constructor(context) {
        this.context = context;

        if (context.mode === 'date') {
            context._getEventValue = function (aria, value, index) {
                const result = [context._valueDate[0].clone(), context._valueDate[1].clone()];

                if (value !== undefined) {
                    result[index] = Smart.Utilities.DateTime.fromFullTimeStamp(value);
                }

                if (aria) {
                    context.$.thumb.setAttribute('aria-valuetext', result[0].toString('f'));
                    context.$.secondThumb.setAttribute('aria-valuetext', result[1].toString('f'));

                    return context.values.slice(0);
                }

                return result;
            }
        }
    }

    applyFunctionToValue(fn, argument) {
        const that = this,
            context = that.context,
            result = [];

        if (argument === undefined) {
            argument = context.values;
        }

        result[0] = fn.apply(context, [argument[0]]);
        result[1] = fn.apply(context, [argument[1]]);

        return result;
    }

    areDifferent(other) {
        const values = this.context.values;
        return (values[0] !== other[0] || values[1] !== other[1]);
    }

    incrementOrDecrement(operation) {
        const context = this.context,
            changedValues = context.values.slice(0);
        let changedIndex;

        if (operation === 'add') {
            changedIndex = 1;
        }
        else {
            changedIndex = 0;
        }

        changedValues[changedIndex] = this.keyIncrementDecrement(operation, changedIndex);

        this.validate(false, changedValues);
    }

    keydownHandler(event) {
        const context = this.context;

        if (context.disabled || context.readonly) {
            return;
        }

        const keyCode = !event.charCode ? event.which : event.charCode,
            handledKeyCodes = [35, 36, 37, 38, 39, 40];

        if (handledKeyCodes.indexOf(keyCode) !== -1) {
            event.preventDefault();

            const updatedValues = context.values.slice(0);
            let newValue;

            switch (keyCode) {
                case 40:    //down arrow
                case 37:    //left arrow
                    newValue = this.keyIncrementDecrement('subtract', 0);
                    updatedValues[0] = newValue;
                    context._movedThumb = context.$.thumb;
                    break;
                case 38:    //top arrow
                case 39:    //right arrow
                    newValue = this.keyIncrementDecrement('add', 1);
                    updatedValues[1] = newValue;
                    context._movedThumb = context.$.secondThumb;
                    break;
                case 36:    //home
                    context._drawValues[0] = context._drawMin;
                    updatedValues[0] = context.min;
                    context._movedThumb = context.$.thumb;
                    break;
                case 35:    //end
                    context._drawValues[1] = context._drawMax;
                    updatedValues[1] = context.max;
                    context._movedThumb = context.$.secondThumb;
                    break;
            }
            this.validate(false, updatedValues);
            return false;
        }
    }

    keyIncrementDecrement(action, changedIndex) {
        const context = this.context;
        let preValue, newValue;

        if (context.customInterval && context.coerce) {
            preValue = this.getValue()[changedIndex];
            return context._keyIncrementDecrement(action, preValue.toString());
        }

        if (context.mode === 'date') {
            preValue = context._valueDate[changedIndex];
            newValue = preValue[context._dateIncrementMethod]((action === 'add' ? 1 : -1) * parseFloat(context.interval), true);
            newValue = newValue.getTimeStamp();

            if (newValue.compare(context._drawMin) === -1) {
                return new Smart.Utilities.BigNumber(context._drawMin);
            }

            if (newValue.compare(context._drawMax) === 1) {
                return new Smart.Utilities.BigNumber(context._drawMax);
            }

            return newValue;
        }

        const drawValue = context._drawValues[changedIndex];

        preValue = context._numericProcessor.createDescriptor(drawValue);

        newValue = context._numericProcessor.incrementDecrement(preValue, action, context._validInterval);
        if (context.logarithmicScale) {
            context._drawValues[changedIndex] = newValue;
            newValue = parseFloat(Math.pow(10, Math.round(newValue)).toFixed(11));
        }
        return newValue;
    }

    setActiveThumbOnTrackClick(event) {
        const context = this.context,
            commonTerm = context._trackStart + context._measurements.halfThumbSize,
            offset = context._settings.offset,
            thumb = context.$.thumb,
            secondThumb = context.$.secondThumb,
            thumbOffset = thumb[offset],
            secondThumbOffset = secondThumb[offset],
            clickedCoordinate = event[context._settings.page];

        let middleBetweenThumbs = context._normalLayout ? commonTerm + thumbOffset + (secondThumbOffset - thumbOffset) / 2 : commonTerm + secondThumbOffset + (thumbOffset - secondThumbOffset) / 2;

        if (context._normalLayout && clickedCoordinate <= middleBetweenThumbs || !context._normalLayout && clickedCoordinate > middleBetweenThumbs) {
            context._movedThumb = thumb;
            context._staticThumb = secondThumb;
            context._movedTooltip = context.$tooltip;
            context.$secondTooltip.addClass('smart-hidden');
        }
        else {
            context._movedThumb = secondThumb;
            context._staticThumb = thumb;
            context._movedTooltip = context.$secondTooltip;
            context.$tooltip.addClass('smart-hidden');
        }

        context._addMovedThumbClass();
    }

    getActualValue(values) {
        if (this.context.logarithmicScale) {
            return [parseFloat(Math.pow(10, values[0].toString()).toFixed(11)), parseFloat(Math.pow(10, values[1].toString()).toFixed(11))];
        }
        return [values[0].toString(), values[1].toString()];
    }

    getCoercedLogarithmicValue(values) {
        const context = this.context;
        if (context.logarithmicScale) {
            const newDrawValues = [];
            newDrawValues[0] = context._numericProcessor.getCoercedValue(Math.log10(values[0]));
            newDrawValues[1] = context._numericProcessor.getCoercedValue(Math.log10(values[1]));
            return this.getActualValue(newDrawValues);
        }
        return values;
    }

    getDrawValue() {
        return this.context._drawValues;
    }

    getValue() {
        return this.context.values.slice(0);
    }

    moveThumbBasedOnValue(value, changedIndex, noUpdate) {
        const context = this.context,
            both = changedIndex === undefined;

        if (value === undefined) {
            value = context.values;
        }

        context._numericProcessor.restrictValue(value);

        if (both || changedIndex === 1) {
            context._movedThumb = context.$.secondThumb;
            context._moveThumbBasedOnValue(context.$.secondThumb, value[1], true, both);
        }
        if (both || changedIndex === 0) {
            context._movedThumb = context.$.thumb;
            context._moveThumbBasedOnValue(context.$.thumb, value[0], true);
        }

        delete context._firstPassSize;

        if (noUpdate !== true) {
            context._drawValues = value;
            const actualValues = this.getActualValue(value);
            let updatedValues;

            if (context._valuesNoRangeValidation) {
                updatedValues = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];
            }
            else {
                updatedValues = actualValues;
            }

            if (context.mode === 'date') {
                context._valueDate = [
                    Smart.Utilities.DateTime.fromFullTimeStamp(actualValues[0]),
                    Smart.Utilities.DateTime.fromFullTimeStamp(actualValues[1])
                ];
            }

            context.values = updatedValues;

            delete context._valueBeforeCoercion;
            this.updateTooltipValue();
        }
    }

    restrictThumbCoordinates(coordinate, trackStart, trackEnd) {
        const context = this.context,
            staticThumbOffset = trackStart + context._staticThumb[context._settings.offset] + context._measurements.halfThumbSize;

        if (context._movedThumb === context.$.thumb && context._normalLayout || context._movedThumb === context.$.secondThumb && !context._normalLayout) {
            coordinate = Math.max(coordinate, trackStart);
            coordinate = Math.min(coordinate, trackEnd, staticThumbOffset);
        }
        else {
            coordinate = Math.max(coordinate, trackStart, staticThumbOffset);
            coordinate = Math.min(coordinate, trackEnd);
        }

        return coordinate;
    }

    updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
        const context = this.context,
            fillStyle = context.$.fill.style,
            dimension = context._settings.dimension,
            offset = context._settings.offset,
            halfThumbSize = context._measurements.halfThumbSize;
        let thumbOffset, secondThumbOffset;

        if (context._movedThumb === context.$.thumb) {
            thumbOffset = size - halfThumbSize;
            secondThumbOffset = context._firstPassSize !== undefined ? (context._firstPassSize - halfThumbSize) : context.$.secondThumb[offset];
        }
        else {
            thumbOffset = context._firstPassSize !== undefined ? (context._firstPassSize - halfThumbSize) : context.$.thumb[offset];
            secondThumbOffset = size - halfThumbSize;
        }

        if (context._normalLayout) {
            fillStyle[dimension] = Math.max(0, (secondThumbOffset - thumbOffset)) + 'px';
            fillStyle[margin] = (thumbOffset + halfThumbSize) + 'px';
        }
        else {
            fillStyle[dimension] = Math.max(0, (thumbOffset - secondThumbOffset)) + 'px';
            fillStyle[margin] = (secondThumbOffset + halfThumbSize) + 'px';
        }

        if (updateTooltip) {
            const numericProcessor = context._numericProcessor,
                index = context._movedThumb === context.$.thumb ? 0 : 1,
                oldValue = context.values[index],
                oldValues = context._getEventValue(false, oldValue, index);
            if (numericProcessor.compare(numericProcessor.createDescriptor(newValue), numericProcessor.createDescriptor(oldValue))) {
                const updatedValues = context.values.slice(0);
                updatedValues[index] = newValue.toString();
                this.updateTooltipValue(newValue, index);

                if (changeValue) {
                    let finalUpdatedValues;

                    this.updateDrawValues(updatedValues);

                    if (context._valuesNoRangeValidation) {
                        finalUpdatedValues = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];
                    }
                    else {
                        finalUpdatedValues = updatedValues;
                    }

                    if (context.mode === 'date') {
                        context._valueDate = [
                            Smart.Utilities.DateTime.fromFullTimeStamp(updatedValues[0]),
                            Smart.Utilities.DateTime.fromFullTimeStamp(updatedValues[1])
                        ];
                    }

                    context.values = finalUpdatedValues;

                    delete context._valueBeforeCoercion;
                    if (context._programmaticValueIsSet !== true) {
                        const newValues = context._getEventValue();

                        //Update hidden input
                        context.$.hiddenInput.value = newValues;

                        context.$.fireEvent('change', { 'value': newValues, 'oldValue': oldValues });
                        this.setAriaValue('valuenow');
                    }
                }
            }
        }
    }

    updateDrawValues(values) {
        const context = this.context;

        if (context.logarithmicScale) {
            context._drawValues[0] = Math.log10(values[0]);
            context._drawValues[1] = Math.log10(values[1]);
        }
        else {
            context._drawValues = values.slice(0);
        }
    }

    updateTooltipValue(newValue, index) {
        const context = this.context;
        if (newValue === undefined) {
            const values = context.values,
                formattedFirstValue = context._formatLabel(values[0]),
                formattedSecondValue = context._formatLabel(values[1]);

            if (context.$.tooltipContent.innerHTML !== formattedFirstValue) {
                context.$.tooltipContent.innerHTML = formattedFirstValue;
                context.$.thumbLabel.innerHTML = formattedFirstValue;
            }

            if (context.$.secondTooltipContent.innerHTML !== formattedSecondValue) {
                context.$.secondTooltipContent.innerHTML = formattedSecondValue;
            }
        }
        else {
            const formattedNewValue = context._formatLabel(newValue);

            if (index === 0 && context.$.tooltipContent.innerHTML !== formattedNewValue || index === undefined) {
                context.$.tooltipContent.innerHTML = formattedNewValue;
                context.$.thumbLabel.innerHTML = formattedNewValue;
            }

            if (index === 1 && context.$.secondTooltipContent.innerHTML !== formattedNewValue || index === undefined) {
                context.$.secondTooltipContent.innerHTML = formattedNewValue;
                context.$.secondThumbLabel.innerHTML = formattedNewValue;
            }
        }
    }

    updateValue(values) {
        const context = this.context,
            renderedValues = [];
        let changedIndex;

        renderedValues[0] = context._numericProcessor.createDescriptor(values[0], true, false);
        renderedValues[1] = context._numericProcessor.createDescriptor(values[1], true, false);

        this.updateDrawValues(renderedValues);

        if (context._movedThumb === context.$.secondThumb) {
            changedIndex = 1;
        }

        this.moveThumbBasedOnValue(context._drawValues.slice(0), changedIndex);
    }

    validate(initialValidation, programmaticValue, programmaticValueIsSet) {
        const context = this.context,
            numericProcessor = context._numericProcessor;
        let validNumbers = [],
            values;

        context._programmaticValueIsSet = programmaticValueIsSet && context.validation === 'interaction';

        if (initialValidation) {
            values = context.values.slice(0);
        }
        else {
            values = programmaticValue;
        }

        if (context.coerce) {
            values[0] = numericProcessor.createDescriptor(values[0], true, true, true);
            values[1] = numericProcessor.createDescriptor(values[1], true, true, true);
        }

        if (context.logarithmicScale) {
            values = this.getCoercedLogarithmicValue(values);
        }
        else {
            values[0] = numericProcessor.getCoercedValue(values[0]);
            values[1] = numericProcessor.getCoercedValue(values[1]);
        }

        context._valuesNoRangeValidation = [];
        context._valuesNoRangeValidation[0] = numericProcessor.createDescriptor(values[0], true, true, false);
        context._valuesNoRangeValidation[1] = numericProcessor.createDescriptor(values[1], true, true, false);

        context._numericProcessor.restrictValue(context._valuesNoRangeValidation);

        validNumbers[0] = numericProcessor.validate(context._valuesNoRangeValidation[0], context._minObject, context._maxObject);
        validNumbers[1] = numericProcessor.validate(context._valuesNoRangeValidation[1], context._minObject, context._maxObject);

        if (initialValidation) {
            context._drawValues = [];
            this.updateDrawValues(validNumbers);

            values = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];

            if (context.mode === 'date') {
                context._valueDate = [
                    Smart.Utilities.DateTime.fromFullTimeStamp(validNumbers[0]),
                    Smart.Utilities.DateTime.fromFullTimeStamp(validNumbers[1])
                ];
            }

            context.values = values;

            this.moveThumbBasedOnValue(context._drawValues, undefined, true);
        }
        else {
            this.updateValue(validNumbers);
        }

        delete context._valuesNoRangeValidation;
        context._programmaticValueIsSet = false;
    }

    /**
     * Sets the aria-valuemax, aria-valuemin, aria-valuenow, and aria-valuetext properties.
     */
    setAriaValue(property) {
        const context = this.context,
            thumb = context.$.thumb,
            secondThumb = context.$.secondThumb;

        if (property === 'valuenow') {
            const values = context._getEventValue(true),
                firstValue = values[0].toString(),
                secondValue = values[1].toString();

            thumb.setAttribute('aria-valuenow', firstValue);
            thumb.setAttribute('aria-valuemax', secondValue);
            secondThumb.setAttribute('aria-valuenow', secondValue);
            secondThumb.setAttribute('aria-valuemin', firstValue);
        }
        else {
            thumb.setAttribute('aria-valuemin', context.min.toString());
            secondThumb.setAttribute('aria-valuemax', context.max.toString());
        }
    }
});
