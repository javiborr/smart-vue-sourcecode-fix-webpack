
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * TimePicker custom element.
 */
Smart('smart-time-picker', class TimePicker extends Smart.BaseElement {
    /**
     * TimePicker's properties.
     */
    static get properties() {
        return {
            'autoSwitchToMinutes': {
                value: false,
                type: 'boolean'
            },
            'footer': {
                value: false,
                type: 'boolean'
            },
            'footerTemplate': {
                value: null,
                type: 'any?'
            },
            'format': {
                value: '12-hour',
                allowedValues: ['12-hour', '24-hour'],
                type: 'string'
            },
            'minuteInterval': {
                value: 1,
                type: 'number'
            },
            'name': {
                value: '',
                type: 'string'
            },
            'selection': {
                value: 'hour',
                allowedValues: ['hour', 'minute'],
                type: 'string'
            },
            'value': {
                value: new Date(),
                type: 'any',
                reflectToAttribute: false
            },
            'view': {
                value: 'portrait',
                allowedValues: ['landscape', 'portrait'],
                type: 'string'
            }
        };
    }

    /**
     * TimePicker's event listeners.
     */
    static get listeners() {
        return {
            'keydown': '_keydownHandler',
            'resize': '_resizeHandler',
            'header.click': '_headerClickHandler',
            'picker.down': '_pickerDownHandler',
            'picker.move': '_pickerMoveHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler'
        };
    }

    /**
     * TimePicker's required files.
     */
    static get requires() {
        return {
            'Smart.Utilities.NumericProcessor': 'smart.numeric.js',
            'Smart.Utilities.BigNumber': 'smart.math.js',
            'Smart.Utilities.Draw': 'smart.draw.js'
        }
    }

    /**
     * CSS files needed for the element (ShadowDOM)
     */
    static get styleUrls() {
        return [
            'smart.timepicker.css'
        ]
    }

    /**
     * TimePicker's HTML template.
     */
    template() {
        const template =
            `<div id="container" role="presentation">
                <div id="header" class="smart-header smart-unselectable" role="heading" aria-level="1">
                    <div id="hourMinuteContainer" class="smart-hour-minute-container">
                        <div id="hourContainer" class="smart-hour-container" role="button"></div>
                        <div role="presentation">:</div>
                        <div id="minuteContainer" class="smart-minute-container" role="button"></div>
                    </div>
                    <div id="ampmContainer" class="smart-am-pm-container" role="presentation">
                        <div id="amContainer" class="smart-am-container" role="button">AM</div>
                        <div id="pmContainer" class="smart-pm-container" role="button">PM</div>
                    </div>
                </div>
                <div id="main" class="smart-main-container">
                    <div id="svgContainer" class="smart-svg-container">
                        <div id="picker" class="smart-svg-picker" role="slider"></div>
                    </div>
                    <div id="footer" class="smart-footer"></div>
                </div>
                <input id="hiddenInput" type="hidden" name="[[name]]">
            </div>`;

        return template;
    }

    /**
     * Called when the element is ready. Used for one-time configuration of the TimePicker.
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that._createElement();

        super.render();
    }

    /**
     * Sets the hours.
     *
     * @param {Number} hours The hours to set.
     */
    setHours(hours) {
        const that = this;

        if (hours === 24) {
            hours = 0;
        }
        else {
            hours = Math.max(0, Math.min(hours, 23));
        }

        if (hours < 12) {
            that._selectAmPm('am');
        }
        else {
            that._selectAmPm('pm');
        }

        if (that.format === '12-hour') {
            if (hours === 0) {
                hours = 12
            }
            else if (hours > 12) {
                hours -= 12;
            }
        }

        that._updateHours(hours, arguments[1]);

        if (that.selection === 'hour') {
            that._inInnerCircle = that.format === '24-hour' && (hours === 0 || hours > 12);

            that._drawArrow(true, hours, arguments[2]);

            if (!that.hasAnimation) {
                that._inInnerCircle = false;
            }
        }
    }

    /**
     * Sets the minutes.
     *
     * @param {Number} minutes The minutes to set.
     */
    setMinutes(minutes) {
        const that = this;

        if (minutes === 60) {
            minutes = 0;
        }
        else {
            minutes = Math.max(0, Math.min(minutes, 59));
        }

        that._updateMinutes(minutes);

        if (that.selection === 'minute') {
            that._drawArrow(true, minutes, arguments[1]);
        }
    }

    /**
     * Invoked when the value of a public property has been changed by the user.
     */
    propertyChangedHandler(key, oldValue, value) {
        super.propertyChangedHandler(key, oldValue, value);

        const that = this;

        switch (key) {
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'footer':
            case 'view':
                that._resizeHandler();
                break;
            case 'footerTemplate':
                that._validateFooterTemplate();
                break;
            case 'format': {
                let hours = that.value.getHours();

                if (value === '12-hour') {
                    that.$ampmContainer.removeClass('smart-hidden');

                    if (that.value.getHours() < 12) {
                        that._selectAmPm('am');
                    }
                    else {
                        that._selectAmPm('pm');
                    }

                    if (hours === 0) {
                        hours = 12;
                    }
                    else if (hours > 12) {
                        hours -= 12;
                    }
                }
                else {
                    that.$ampmContainer.addClass('smart-hidden');
                }

                that.$.hourContainer.innerHTML = hours;

                if (that.selection === 'hour') {
                    that.$.picker.setAttribute('aria-valuenow', hours);
                    that._draw.clear();
                    that._renderSVG();
                }

                break;
            }
            case 'minuteInterval': {
                const validValue = Math.max(1, Math.min(value, 60));

                if (validValue !== value) {
                    that.minuteInterval = validValue;
                }

                if (that.selection === 'minute') {
                    that.interval = validValue;
                }

                break;
            }
            case 'selection':
                if (value === 'hour') {
                    that._changeToHourSelection();
                }
                else {
                    that._changeToMinuteSelection();
                }

                break;
            case 'value': {
                that._oldValue = oldValue;
                that._validateValue();

                const equalHours = that.value.getHours() === oldValue.getHours(),
                    equalMinutes = that.value.getMinutes() === oldValue.getMinutes();

                if (!(equalHours && equalMinutes)) {
                    if (equalMinutes) {
                        that.setHours(that.value.getHours());
                    }
                    else {
                        if (!equalHours) {
                            that.setHours(that.value.getHours(), true);
                        }

                        that.setMinutes(that.value.getMinutes());
                    }
                }

                delete that._oldValue;
                break;
            }
        }
    }

    /**
     * Applies initial settings to the TimePicker element.
     */
    _applyInitialSettings() {
        const that = this,
            value = that.value;
        let hours, minutes;

        hours = value.getHours();
        minutes = value.getMinutes();

        if (that.format === '12-hour') {
            if (hours < 12) {
                that._ampm = 'am';
                that.$amContainer.addClass('smart-selected');

                if (hours === 0) {
                    hours = 12;
                }
            }
            else {
                that._ampm = 'pm';
                that.$pmContainer.addClass('smart-selected');

                if (hours > 12) {
                    hours -= 12;
                }
            }
        }
        else {
            that.$ampmContainer.addClass('smart-hidden');
        }

        minutes = minutes.toString();

        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }

        that.$.hourContainer.innerHTML = hours;
        that.$.minuteContainer.innerHTML = minutes;

        if (that.selection === 'hour') {
            that.$hourContainer.addClass('smart-selected');
            that.$.picker.setAttribute('aria-valuenow', hours);
        }
        else {
            that.$minuteContainer.addClass('smart-selected');
            that.$.picker.setAttribute('aria-valuenow', minutes);
        }
    }

    /**
     * Changes the TimePicker selection when the user interacts with it.
     */
    _changeSelection(event, noAnimation) {
        const that = this,
            x = event.pageX,
            y = event.pageY,
            center = that._getCenterCoordinates(),
            distanceFromCenter = Math.sqrt(Math.pow(center.x - x, 2) + Math.pow(center.y - y, 2));

        that._measurements.center = center;

        if (event.type === 'down') {
            if (distanceFromCenter > that._measurements.radius) {
                event.stopPropagation();
                return;
            }
            else {
                that._dragging = true;
            }
        }

        if (that.format === '24-hour' && that.selection === 'hour' && distanceFromCenter < that._measurements.radius - 50) {
            that._inInnerCircle = true;
        }
        else {
            that._inInnerCircle = false;
        }

        const angleRadians = Math.atan2(y - center.y, x - center.x);
        let angleDeg = -1 * angleRadians * 180 / Math.PI;

        if (angleDeg < 0) {
            angleDeg += 360;
        }

        that._angle = angleDeg;

        let newValue = that._numericProcessor.getValueByAngle(that._angle);

        if (that.selection === 'hour') {
            if (that.format === '24-hour') {
                if (that._inInnerCircle) {
                    if (newValue !== 0 && newValue !== 12) {
                        newValue += 12;
                    }
                    else {
                        newValue = 0;
                    }
                }
                else if (newValue === 0) {
                    newValue = 12;
                }
            }
            else {
                if (newValue === 0) {
                    newValue = 12;
                }
            }

            that._updateHours(newValue);
        }
        else {
            if (newValue === 60) {
                newValue = 0;
            }

            that._updateMinutes(newValue);
        }

        if (that._oldTimePart === undefined) {
            return;
        }

        cancelAnimationFrame(that._animationFrameId);
        delete that._animationFrameId;
        that._drawArrow(true, newValue, noAnimation);
    }

    /**
     * Changes to hour selection.
     */
    _changeToHourSelection() {
        const that = this,
            svgCanvas = that._centralCircle.parentElement || that._centralCircle.parentNode;
        let hours = that.value.getHours();

        cancelAnimationFrame(that._animationFrameId);
        delete that._animationFrameId;
        that.interval = 1;

        that.$hourContainer.addClass('smart-selected');
        that.$minuteContainer.removeClass('smart-selected');

        svgCanvas.removeChild(that._centralCircle);
        svgCanvas.removeChild(that._arrow);
        svgCanvas.removeChild(that._head);

        that._getMeasurements();
        that._numericProcessor.getAngleRangeCoefficient();
        that._draw.clear();

        svgCanvas.appendChild(that._centralCircle);
        svgCanvas.appendChild(that._arrow);
        svgCanvas.appendChild(that._head);

        that._renderHours();

        if (that.format === '24-hour' && (hours === 0 || hours > 12)) {
            that._inInnerCircle = true;
        }
        else if (that.format === '12-hour') {
            hours = hours % 12;

            if (hours === 0) {
                hours = 12;
            }
        }

        that._drawArrow(true, undefined, true);
        that._inInnerCircle = false;

        that.$.picker.firstElementChild.setAttribute('aria-hidden', true);
        that.$.picker.setAttribute('aria-valuenow', hours);
    }

    /**
     * Changes to minute selection.
     */
    _changeToMinuteSelection() {
        const that = this,
            svgCanvas = that._centralCircle.parentElement || that._centralCircle.parentNode;

        that._inInnerCircle = false;

        cancelAnimationFrame(that._animationFrameId);
        delete that._animationFrameId;
        that.interval = that.minuteInterval;

        that.$hourContainer.removeClass('smart-selected');
        that.$minuteContainer.addClass('smart-selected');

        svgCanvas.removeChild(that._centralCircle);
        svgCanvas.removeChild(that._arrow);
        svgCanvas.removeChild(that._head);

        that._getMeasurements();
        that._numericProcessor.getAngleRangeCoefficient();
        that._draw.clear();

        svgCanvas.appendChild(that._centralCircle);
        svgCanvas.appendChild(that._arrow);
        svgCanvas.appendChild(that._head);

        that._renderMinutes();

        that._drawArrow(true, undefined, true);

        that.$.picker.firstElementChild.setAttribute('aria-hidden', true);
        that.$.picker.setAttribute('aria-valuenow', that.value.getMinutes());
    }

    /**
     * Computes arrow body points.
     */
    _computeArrowBodyPoints(radius, angle, width, length) {
        const that = this,
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            endX1 = radius - width * cos + length * sin,
            endY1 = radius + width * sin + length * cos,
            endX2 = radius + width * cos + length * sin,
            endY2 = radius - width * sin + length * cos,
            startX1 = radius + width * cos,
            startY1 = radius - width * sin,
            startX2 = radius - width * cos,
            startY2 = radius + width * sin,

            points = 'M ' + startX1 + ',' + startY1 + ' L ' + startX2 + ',' + startY2 + ' L ' + endX1 + ',' + endY1 + ' ' + endX2 + ',' + endY2;

        that._headCenter = { x: (endX1 + endX2) / 2, y: (endY1 + endY2) / 2 };

        return points;
    }

    /**
     * Applies initial settings to the TimePicker element.
     */
    _createElement() {
        const that = this;

        that.setAttribute('role', 'dialog');

        that.coerce = true;
        that.min = 0;
        that._drawMin = '0';
        that.startAngle = -270;
        that.endAngle = 90;
        that._angleDifference = that.endAngle - that.startAngle;
        that.ticksVisibility = 'none';
        that._tickIntervalHandler = {};
        that._tickIntervalHandler.labelsSize = {};
        that._distance = { majorTickDistance: 0, minorTickDistance: 0, labelDistance: 10 };
        that._measurements = {};

        that._validateInitialPropertyValues();
        that._applyInitialSettings();

        that._numericProcessor = new Smart.Utilities.DecimalNumericProcessor(that);
        that._draw = new Smart.Utilities.Draw(that.$.picker);

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }

        that._setPickerSize();
        that._getMeasurements();
        that._numericProcessor.getAngleRangeCoefficient();
        that._renderSVG();
        that._setFocusable();

        that.$.hiddenInput.value = that.value;

        if (that.enableShadowDOM) {
            that.appendChild(that.$.hiddenInput);
        }
    }

    /**
     * Document move handler.
     */
    _documentMoveHandler(event) {
        const that = this;

        if (that._dragging) {
            that._changeSelection(event, true);
        }
    }

    /**
     * Document up handler.
     */
    _documentUpHandler() {
        const that = this;

        function animateToMinutes() {
            that.$picker.addClass('animate');

            setTimeout(function () {
                that.selection = 'minute';
                that._changeToMinuteSelection();
            }, 250);

            setTimeout(function () {
                that.$picker.removeClass('animate');
            }, 550);
        }

        function checkRunningAnimation() {
            if (that._animationFrameId) {
                requestAnimationFrame(checkRunningAnimation);
            }
            else {
                animateToMinutes();
            }
        }

        if (that._dragging) {
            that._inInnerCircle = false;
            that._dragging = false;

            if (that.autoSwitchToMinutes && that.selection === 'hour') {
                if (that.hasAnimation) {
                    checkRunningAnimation();
                }
                else {
                    that.selection = 'minute';
                    that._changeToMinuteSelection();
                }
            }
        }
    }

    /**
     * Draws/updates the arrow.
     */
    _drawArrow(update, value, noAnimation) {
        const that = this,
            hourSelection = that.selection === 'hour',
            twelveHourFormat = that.format === '12-hour';
        let current = that._oldTimePart;

        delete that._oldTimePart;

        if (value === undefined) {
            if (hourSelection) {
                value = that.value.getHours();

                if (twelveHourFormat && value > 12) {
                    value -= 12;
                }
            }
            else {
                value = that.value.getMinutes();
            }
        }

        if (current === undefined || noAnimation || !that.hasAnimation) {
            that._drawArrowSVG(update, value);
            return;
        }

        if (hourSelection && !twelveHourFormat) {
            that._animate24HourView(current, value);
            return;
        }

        let step, max;

        if (hourSelection) {
            step = 0.2;
            max = 12;
            value = value % max;
            current = current % max;
        }
        else {
            step = 1;
            max = 60;
        }

        let distanceCW = value - current,
            distanceCCW = current - value;

        if (distanceCW < 0) {
            distanceCW += max;
        }

        if (distanceCCW < 0) {
            distanceCCW += max;
        }

        if (distanceCCW < distanceCW) {
            step *= -1;
        }

        function animate() {
            current += step;
            current = parseFloat((current % max).toFixed(1));

            if (current < 0) {
                current += max;
            }

            that._drawArrowSVG(update, current);
            update = true;

            if (current !== value % max) {
                that._animationFrameId = requestAnimationFrame(animate);
            }
            else {
                delete that._animationFrameId;
            }
        }

        animate();
    }

    /**
     * Animates selection in 24-hour view.
     */
    _animate24HourView(current, value) {
        const that = this;
        let step = 0.2;

        that._inInnerCircle = false;

        const currentInnerCircle = current === 0 || current > 12,
            valueInnerCircle = value === 0 || value > 12;

        if (currentInnerCircle !== valueInnerCircle) {
            if (currentInnerCircle) {
                current = Math.abs(current - 12);
            }
            else {
                current = (current + 12) % 24;
            }

            that._inInnerCircle = valueInnerCircle;
            that._drawArrowSVG(true, current);

            if (current === value) {
                return;
            }
        }
        else {
            that._inInnerCircle = valueInnerCircle;
        }

        let start = current,
            end = value;

        if (that._inInnerCircle) {
            if (end === 0 && start < 18) {
                end = 12;
            }
            else if (start === 0 && end < 18) {
                start = 12;
            }
        }

        let distanceCW = end - start,
            distanceCCW = start - end;

        if (distanceCW < 0) {
            distanceCW += 12;
        }

        if (distanceCCW < 0) {
            distanceCCW += 12;
        }

        if (distanceCCW < distanceCW) {
            step *= -1;
        }

        function animate(inInnerCircle) {
            that._inInnerCircle = inInnerCircle;

            if (inInnerCircle) {
                current = parseFloat((current + step).toFixed(1));

                if (current < 0) {
                    current += 24;
                }
                else if (current < 1) {
                    current = current + 12;
                }

                if (current === 12 || current === 24) {
                    current = 0;
                }
            }
            else {
                current += step;

                if (current !== 12) {
                    current = parseFloat((current % 12).toFixed(1));
                }

                if (current <= 0) {
                    current += 12;
                }
            }

            that._drawArrowSVG(true, current);

            if (current !== value) {
                that._animationFrameId = requestAnimationFrame(function () {
                    animate(inInnerCircle);
                });
            }
            else {
                delete that._animationFrameId;
                that._inInnerCircle = false;
            }
        }

        animate(that._inInnerCircle);
    }

    /**
     * Draws/updates the arrow.
     */
    _drawArrowSVG(update, value) {
        const that = this,
            measurements = that._measurements,
            angle = that._numericProcessor.getAngleByValue(value);
        let arrowBodyPoints;

        if (!that._inInnerCircle) {
            arrowBodyPoints = that._computeArrowBodyPoints(measurements.radius, angle, 1, measurements.innerRadius - that._largestLabelSize / 2);
        }
        else {
            arrowBodyPoints = that._computeArrowBodyPoints(measurements.radius, angle, 1, measurements.innerRadius - that._largestLabelSize / 2 - 45);
        }

        if (update) {
            that._arrow.setAttribute('d', arrowBodyPoints);

            that._head.setAttribute('cx', that._headCenter.x);
            that._head.setAttribute('cy', that._headCenter.y);
            that._head.setAttribute('r', that._largestLabelSize);
            that._headRect = that._head.getBoundingClientRect();

            if (value % 1 === 0) {
                that._highlightLabel(value);
            }
        }
        else {
            that._arrow = that._draw.path(arrowBodyPoints, { 'class': 'smart-needle' });
            that._head = that._draw.circle(that._headCenter.x, that._headCenter.y, that._largestLabelSize, { 'class': 'smart-needle-central-circle' });
            that._headRect = that._head.getBoundingClientRect();
        }
    }

    /**
     * Draws a label.
     */
    _drawLabel(angle, value, distance) {
        const that = this,
            measurements = that._measurements,
            r = measurements.radius,
            stylingObj = {
                'class': 'smart-label smart-unselectable',
                'font-size': measurements.fontSize,
                'font-family': measurements.fontFamily,
                'font-weight': measurements.fontWeight,
                'font-style': measurements.fontStyle
            };

        if (that.selection === 'hour') {
            if (that._plotInnerCircle) {
                if (value > 0) {
                    value += 12;
                }
                else {
                    value = '00';
                }
            }
            else {
                if (value === 0) {
                    value = 12;
                }
            }
        }
        else {
            if (value.toString().length === 1) {
                value = '0' + value;
            }
        }

        const textSize = that._draw.measureText(value, 0, stylingObj),
            w = r - distance - that._largestLabelSize / 2,
            x = r + w * Math.sin(angle),
            y = r + w * Math.cos(angle),
            label = that._draw.text(value, Math.round(x) - textSize.width / 2, Math.round(y) - textSize.height / 2, textSize.width, textSize.height, 0, stylingObj);

        label.setAttribute('value', parseFloat(value));
    }

    /**
     * Gets the center coordinates.
     */
    _getCenterCoordinates() {
        const that = this,
            offset = that.$.picker.getBoundingClientRect(),
            radius = that._measurements.radius,
            scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft,
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        return { x: offset.left + scrollLeft + radius, y: offset.top + scrollTop + radius };
    }

    /**
     * Measures some elements of the TimePicker and stores the results.
     */
    _getMeasurements() {
        const that = this,
            measurements = that._measurements,
            measureLabel = document.createElement('div');
        let minLabel, maxLabel, minLabelWidth, maxLabelWidth, minLabelHeight, maxLabelHeight;

        measureLabel.className = 'smart-label';
        measureLabel.style.position = 'absolute';
        measureLabel.style.visibility = 'hidden';
        that.$.svgContainer.appendChild(measureLabel);

        if (that.selection === 'hour') {
            minLabel = '1';
            maxLabel = '23';

            that.max = 12;
            that._drawMax = '12';
            that._range = 12;
        }
        else {
            minLabel = '00';
            maxLabel = '55';

            that.max = 60;
            that._drawMax = '60';
            that._range = 60;
        }

        measureLabel.innerHTML = minLabel;
        minLabelWidth = measureLabel.offsetWidth;
        minLabelHeight = measureLabel.offsetHeight;
        measureLabel.innerHTML = maxLabel;
        maxLabelWidth = measureLabel.offsetWidth;
        maxLabelHeight = measureLabel.offsetHeight;

        that._largestLabelSize = Math.max(minLabelWidth, minLabelHeight, maxLabelWidth, maxLabelHeight);
        that._tickIntervalHandler.labelsSize.minLabelSize = minLabelHeight;
        that._tickIntervalHandler.labelsSize.maxLabelSize = maxLabelHeight;

        const measureElementStyle = window.getComputedStyle(measureLabel);

        measurements.fontSize = measureElementStyle.fontSize;
        measurements.fontFamily = measureElementStyle.fontFamily;
        measurements.fontWeight = measureElementStyle.fontWeight;
        measurements.fontStyle = measureElementStyle.fontStyle;
        that.$.svgContainer.removeChild(measureLabel);
    }

    /**
     * Header click handler.
     */
    _headerClickHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        switch (event.target) {
            case that.$.hourContainer:
                if (that.selection !== 'hour') {
                    that.selection = 'hour';
                    that._changeToHourSelection();
                }

                break;
            case that.$.minuteContainer:
                if (that.selection !== 'minute') {
                    that.selection = 'minute';
                    that._changeToMinuteSelection();
                }

                break;
            case that.$.amContainer:
                if (!that.$amContainer.hasClass('smart-selected')) {
                    that._selectAmPm('am');

                    const oldValue = new Date(that.value.getTime());

                    that.value.setHours(that.value.getHours() - 12);

                    // Update the hidden input 
                    that.$.hiddenInput.value = that.value;

                    that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
                }

                break;
            case that.$.pmContainer:
                if (!that.$pmContainer.hasClass('smart-selected')) {
                    that._selectAmPm('pm');

                    const oldValue = new Date(that.value.getTime());

                    that.value.setHours(that.value.getHours() + 12);

                    // Update the hidden input 
                    that.$.hiddenInput.value = that.value;

                    that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
                }

                break;
        }
    }

    /**
     * Highlights a label.
     */
    _highlightLabel(value) {
        const that = this;

        if (that._highlightedLabel) {
            if (parseFloat(that._highlightedLabel.getAttribute('value')) === value) {
                return;
            }

            that._highlightedLabel.classList.remove('smart-selected');
            that._highlightedLabel = undefined;
        }

        let roundedValue;

        if (that.selection === 'hour') {
            if (value === undefined) {
                value = that.value.getHours();
            }

            if (that.format === '12-hour') {
                if (value === 0) {
                    value = 12;
                }
                else if (value > 12) {
                    value -= 12;
                }
            }

            roundedValue = value;
        }
        else {
            if (value === undefined) {
                value = that.value.getMinutes();
            }

            roundedValue = Math.round(value / 5) * 5;

            if (roundedValue === 60) {
                roundedValue = 0;
            }
        }

        const labelAtValue = that.$.picker.querySelector('.smart-label[value="' + roundedValue + '"]');

        if (labelAtValue && (roundedValue === value || that._overlapsLabel(labelAtValue))) {
            that._highlightedLabel = labelAtValue;
            labelAtValue.classList.add('smart-selected');
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
     * keydown handler.
     */
    _keydownHandler(event) {
        const that = this;

        if (that._dragging) {
            return;
        }

        const activeElement = (that.shadowRoot || that.getRootNode()).activeElement,
            key = event.key;

        if (that.$.header.contains(activeElement) && (key === 'Enter' || key === ' ')) {
            event.preventDefault();
            that._headerClickHandler({ target: activeElement });
        }
        else if (activeElement === that.$.picker && !event.altKey) {
            let coefficient;

            if (key === 'ArrowRight' || key === 'ArrowUp') {
                coefficient = 1;
            }
            else if (key === 'ArrowLeft' || key === 'ArrowDown') {
                coefficient = -1;
            }

            if (coefficient) {
                event.preventDefault();

                if (that.selection === 'hour') {
                    let hours = that.value.getHours();

                    if (hours === 0 && coefficient === -1) {
                        hours = 23;
                    }
                    else if (hours === 23 && coefficient === 1) {
                        hours = 0;
                    }
                    else {
                        hours += coefficient;
                    }

                    if (that.format === '12-hour') {
                        if (hours >= 12 && that.$amContainer.hasClass('smart-selected')) {
                            hours -= 12;
                        }
                        else if (hours < 12 && that.$pmContainer.hasClass('smart-selected')) {
                            hours += 12;
                        }
                    }

                    that.setHours(hours, undefined, true);
                }
                else {
                    let minutes = that.value.getMinutes();

                    coefficient *= that.minuteInterval;

                    if (minutes + coefficient >= 60) {
                        minutes = 0;
                    }
                    else if (minutes < coefficient * -1) {
                        if (60 % coefficient === 0) {
                            minutes = 60 + coefficient;
                        }
                        else {
                            minutes = 60 - (60 % coefficient);
                        }
                    }
                    else {
                        minutes += coefficient;
                    }

                    that.setMinutes(minutes, true);
                }
            }
        }
    }

    /**
     * Returns if the arrow head overlaps a label.
     */
    _overlapsLabel(label) {
        const that = this,
            labelRect = label.getBoundingClientRect();
        let headRect = that._headRect;

        if (headRect.height === 0) {
            headRect = that._headRect = that._head.getBoundingClientRect();
        }

        return !(labelRect.right - 10 < headRect.left ||
            labelRect.left + 10 > headRect.right ||
            labelRect.bottom - 10 < headRect.top ||
            labelRect.top + 10 > headRect.bottom);
    }

    /**
     * Parses a date string.
     */
    _parseDateString(value, referenceValue) {
        const indexOfDate = value.indexOf('Date('),
            indexOfBracket = value.indexOf(')');
        let validValue = value;

        if (indexOfDate !== -1 && indexOfBracket !== -1) {
            validValue = value.slice(indexOfDate + 5, indexOfBracket);
            validValue = validValue.replace(/'/g, '').replace(/"/g, '').replace(/^\s+|\s+$|\s+(?=\s)/g, '');

            if (validValue.trim() === '') {
                return new Date();
            }

            if (new RegExp(/(^(\d+)(\s*,\s*\d+)+$)/g).test(validValue)) {
                validValue = validValue.replace(/\s/g, '');
                validValue = validValue.split(',');

                validValue.map(function (argument, index) {
                    validValue[index] = parseInt(argument);
                });

                validValue.unshift(null);
                validValue = new (Function.prototype.bind.apply(Date, validValue));

                return validValue;
            }
        }

        if (validValue.trim() === '') {
            return referenceValue;
        }

        if (!isNaN(validValue)) {
            return new Date(parseInt(validValue, 10));
        }

        try {
            validValue = new Date(validValue);
        }
        catch (error) {
            validValue = referenceValue;
        }

        if (isNaN(validValue.getTime())) {
            return referenceValue;
        }

        return validValue;
    }

    /**
     * SVG picker (mouse)down event handler.
     */
    _pickerDownHandler(event) {
        const that = this;

        if (that.disabled || that.readonly || !Smart.Utilities.Core.isMobile && event.which !== 1) {
            return;
        }

        that._changeSelection(event);
    }

    /**
     * SVG picker move event handler.
     */
    _pickerMoveHandler(event) {
        if (event.originalEvent.type === 'touchmove') {
            event.originalEvent.preventDefault();
        }
    }

    /**
     * Renders hours view.
     */
    _renderHours() {
        const that = this;

        that._highlightedLabel = undefined;

        that._majorTicksInterval = 1;

        that._numericProcessor.addGaugeTicksAndLabels();

        if (that.format === '24-hour') {
            that._plotInnerCircle = true;
            that._distance.labelDistance = 55;
            that._numericProcessor.addGaugeTicksAndLabels();
            that._plotInnerCircle = false;
            that._distance.labelDistance = 10;
            that.$.picker.setAttribute('aria-valuemin', 0);
            that.$.picker.setAttribute('aria-valuemax', 23);
        }
        else {
            that.$.picker.setAttribute('aria-valuemin', 1);
            that.$.picker.setAttribute('aria-valuemax', 12);
        }
    }

    /**
     * Renders minutes view.
     */
    _renderMinutes() {
        const that = this;

        that._highlightedLabel = undefined;

        that._majorTicksInterval = 5;

        that._numericProcessor.addGaugeTicksAndLabels();

        that.$.picker.setAttribute('aria-valuemin', 0);
        that.$.picker.setAttribute('aria-valuemax', 59);
    }

    /**
     * Renders all SVG elements.
     */
    _renderSVG() {
        const that = this;

        if (!that._isVisible() || that._renderingSuspended) {
            that._renderingSuspended = true;
            return;
        }

        that._centralCircle = that._draw.circle(that._measurements.radius, that._measurements.radius, 4, { 'class': 'smart-needle-central-circle' });

        if (that.selection === 'hour' && that.format === '24-hour' && (that.value.getHours() === 0 || that.value.getHours() > 12)) {
            that._inInnerCircle = true;
        }

        that._drawArrow(false);
        that._inInnerCircle = false;

        if (that.selection === 'hour') {
            that.interval = 1;
            that._renderHours();

            let hours = that.value.getHours();

            if (that.format === '12-hour' && hours > 12) {
                hours -= 12;
            }

            that._highlightLabel(hours);
        }
        else {
            that.interval = that.minuteInterval;
            that._renderMinutes();
            that._highlightLabel(that.value.getMinutes());
        }

        that.$.picker.firstElementChild.setAttribute('aria-hidden', true);
    }

    /**
     * Gauge resize handler.
     */
    _resizeHandler() {
        const that = this;
        let shown = false;

        if (!that.isRendered) {
            return;
        }

        if (!that._isVisible()) {
            that._renderingSuspended = true;
            return;
        }
        else {
            that._renderingSuspended = false;
            shown = true;

            that._getMeasurements();
            that._numericProcessor.getAngleRangeCoefficient();
        }

        that._setPickerSize();

        if (that._sizeChanged || shown) {
            that._draw.clear();
            that._renderSVG();
            that._sizeChanged = false;
        }
        else {
            that._headRect = that._head.getBoundingClientRect();
            that._highlightLabel();
        }
    }

    /**
     * Selects the appropriate AM/PM label.
     */
    _selectAmPm(which) {
        const that = this;

        if (which === 'am') {
            that._ampm = 'am';
            that.$pmContainer.removeClass('smart-selected');
            that.$amContainer.addClass('smart-selected');
        }
        else {
            that._ampm = 'pm';
            that.$amContainer.removeClass('smart-selected');
            that.$pmContainer.addClass('smart-selected');
        }
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this;

        if (that.disabled || that.unfocusable) {
            that.$.hourContainer.removeAttribute('tabindex');
            that.$.minuteContainer.removeAttribute('tabindex');
            that.$.amContainer.removeAttribute('tabindex');
            that.$.pmContainer.removeAttribute('tabindex');
            that.$.picker.removeAttribute('tabindex');
            return;
        }

        const index = that.tabIndex > 0 ? that.tabIndex : 0;

        that.$.hourContainer.tabIndex = index;
        that.$.minuteContainer.tabIndex = index;
        that.$.amContainer.tabIndex = index;
        that.$.pmContainer.tabIndex = index;
        that.$.picker.tabIndex = index;
    }

    /**
     * Sets the SVG picker's size.
     */
    _setPickerSize() {
        const that = this,
            parentWidth = that.$.svgContainer.offsetWidth,
            parentHeight = that.$.svgContainer.offsetHeight;
        let size = Math.min(parentWidth, parentHeight) * 0.9;

        if (that._pickerSize !== undefined && that._pickerSize !== size) {
            that._sizeChanged = true;
        }
        else {
            that._sizeChanged = false;
        }

        that._pickerSize = size;
        that._measurements.radius = size / 2;
        that._measurements.innerRadius = that._measurements.radius - 10;

        size += 'px';
        that.$.picker.style.width = size;
        that.$.picker.style.height = size;
    }

    /**
     * Updates the hours.
     */
    _updateHours(hours, suppressEvent) {
        const that = this;
        let actualHours = hours;

        if (that.format === '12-hour') {
            if (that._ampm === 'am') {
                if (actualHours === 12) {
                    actualHours = 0;
                }
            }
            else if (actualHours < 12) {
                actualHours += 12;
            }
        }
        else {
            actualHours = hours;
        }

        const oldValue = that._oldValue !== undefined ? that._oldValue : new Date(that.value.getTime()),
            oldHours = oldValue.getHours();

        if (actualHours === oldHours) {
            delete that._oldTimePart;
            return;
        }

        that._oldTimePart = oldHours;

        if (that._oldValue === undefined) {
            that.value.setHours(actualHours);
        }

        that.$.hourContainer.innerHTML = hours;

        if (suppressEvent !== true) {
            // Update the hidden input 
            that.$.hiddenInput.value = that.value;

            that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
        }

        if (that.selection === 'hour') {
            that.$.picker.setAttribute('aria-valuenow', hours);
        }
    }

    /**
     * Updates the minutes.
     */
    _updateMinutes(minutes) {
        const that = this,
            oldValue = that._oldValue !== undefined ? that._oldValue : new Date(that.value.getTime()),
            oldMinutes = oldValue.getMinutes();

        if (minutes === oldMinutes) {
            delete that._oldTimePart;
            return;
        }

        that._oldTimePart = oldMinutes;

        if (that._oldValue === undefined) {
            that.value.setMinutes(minutes);
        }

        if (that.selection === 'minute') {
            that.$.picker.setAttribute('aria-valuenow', minutes);
        }

        minutes = minutes.toString();

        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }

        that.$.minuteContainer.innerHTML = minutes;

        // Update the hidden input 
        that.$.hiddenInput.value = that.value;

        that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
    }

    /**
     * Validates the "footerTemplate" property.
     */
    _validateFooterTemplate() {
        const that = this,
            footerTemplate = that.footerTemplate;

        if (footerTemplate === null) {
            that.$.footer.innerHTML = '';
            return;
        }

        let potentialHTMLTemplate;

        if (footerTemplate instanceof HTMLTemplateElement) {
            potentialHTMLTemplate = footerTemplate;
        }
        else if (typeof footerTemplate === 'string') {
            potentialHTMLTemplate = document.getElementById(footerTemplate);

            if (!(potentialHTMLTemplate instanceof HTMLTemplateElement)) {
                potentialHTMLTemplate = undefined;
            }
        }

        if (potentialHTMLTemplate === undefined) {
            that.footerTemplate = null;
            that.$.footer.innerHTML = '';
            return;
        }

        const templateContent = document.importNode(potentialHTMLTemplate.content, true);

        if (that.enableShadowDOM) {
            that.$.footer.innerHTML = '<slot></slot>';
            that.appendChild(templateContent);
            return;
        }

        that.$.footer.appendChild(templateContent);
    }

    /**
     * Validates initial property values.
     */
    _validateInitialPropertyValues() {
        const that = this;

        that._validateFooterTemplate();

        that.minuteInterval = Math.max(1, Math.min(that.minuteInterval, 60));

        that._validateValue();
    }

    /**
     * Validates the "value" property.
     */
    _validateValue() {
        const that = this,
            value = that.value,
            referenceValue = that._oldValue !== undefined ? this._oldValue : new Date();

        if (value instanceof Date) {
            return;
        }
        else if (typeof value === 'string') {
            if (/^\d{1,2}:\d{1,2}$/.test(value)) {
                const timeParts = value.split(':');

                that.value = new Date(
                    referenceValue.getFullYear(),
                    referenceValue.getMonth(),
                    referenceValue.getDate(),
                    parseFloat(timeParts[0]),
                    parseFloat(timeParts[1]));
                return;
            }

            that.value = that._parseDateString(value, referenceValue);
        }
        else {
            that.value = referenceValue;
        }
    }
});
