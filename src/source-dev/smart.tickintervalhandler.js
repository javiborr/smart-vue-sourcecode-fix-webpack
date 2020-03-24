
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart.Utilities.Assign('TickIntervalHandler', class TickIntervalHandler {
    constructor(context, minLabel, maxLabel, labelClass, dimension, integer, logarithmic) {
        const that = this;

        that.context = context;
        that.minLabel = minLabel;
        that.maxLabel = maxLabel;
        that.labelClass = labelClass;
        that.dimension = dimension;
        that.logarithmic = logarithmic;

        if (!context.customInterval) {
            that.labelsSize = that.getMinAndMaxLabelSize();
        }
        else if (context.customTicks.length > 0) {
            that.labelsSize = that.getCustomTicksLabelSize();
        }
        else {
            that.labelsSize = { minLabelSize: 0, minLabelOtherSize: 0, maxLabelSize: 0, maxLabelOtherSize: 0 };
        }

        if (!integer) {
            that.getNiceInterval = that.getNiceIntervalFloatingPoint;
            that.getPossibleBiggerLabel = that.getPossibleBiggerLabelFloatingPoint;
        }
        else {
            that.getNiceInterval = that.getNiceIntervalInteger;
            that.getPossibleBiggerLabel = that.getPossibleBiggerLabelInteger;
        }
    }

    getInterval(type, min, max, track) {
        function getSectorArcLength() {
            let arcLength = 2 * Math.PI * radius * (Math.abs(context.startAngle - context.endAngle) / 360); // for angles in degrees
            //let arcLength = Math.abs(context.startAngle - context.endAngle) * radius; // for angles in radians
            return Math.round(arcLength);
        }

        const context = this.context,
            radius = context._measurements.innerRadius;
        let largestLabelSize, multiplier = 1;

        if (type === 'radial') {
            largestLabelSize = Math.max(this.labelsSize.minLabelSize, this.labelsSize.minLabelOtherSize, this.labelsSize.maxLabelSize, this.labelsSize.maxLabelOtherSize);
            multiplier = 1.35;
            //multiplier = 5.25 / Math.max(1, Math.log10(radius * 2)); // original formula: 5.25 / Math.Max(1.0, Math.Log10(panelLogicalSize.Height))
        }
        else {
            largestLabelSize = Math.max(this.labelsSize.minLabelSize, this.labelsSize.maxLabelSize);
            multiplier = 1.45;
        }

        largestLabelSize *= multiplier;
        let trackDimension;
        if (type === 'radial') {
            trackDimension = getSectorArcLength();
        }
        else {
            trackDimension = context[this.dimension] - this.labelsSize.minLabelSize / 2 - this.labelsSize.maxLabelSize / 2; // track[this.dimension];
        }

        trackDimension = Math.max(10, trackDimension);

        const divisionCountEstimate = Math.ceil(trackDimension / largestLabelSize),
            minorDivisionCountEstimate = type === 'radial' ? divisionCountEstimate * 4 : divisionCountEstimate * 3;
        let majorInterval = this.getNiceInterval(min, max, divisionCountEstimate, true),
            minorInterval = this.getNiceInterval(min, max, minorDivisionCountEstimate);

        context._cachedLabelsSize = this.labelsSize;

        if (divisionCountEstimate > 2 && !context.customInterval) {
            const possibleSecondLabel = this.getPossibleBiggerLabel(divisionCountEstimate, majorInterval);

            if (possibleSecondLabel.length > Math.max(this.minLabel.length, this.maxLabel.length)) {
                const oldMinLabel = this.minLabel;
                this.minLabel = possibleSecondLabel;
                this.labelsSize = this.getMinAndMaxLabelSize();
                context._cachedLabelsSize = this.labelsSize;
                const adjustedResult = this.getInterval(type, min, max, track);
                this.minLabel = oldMinLabel;
                this.labelsSize = this.getMinAndMaxLabelSize();
                return adjustedResult;
            }
        }

        return { major: majorInterval, minor: minorInterval };
    }

    getNiceIntervalFloatingPoint(min, max, divisionCountEstimate, majorInterval) {
        const rangeDelta = max - min,
            exponent = Math.floor(Math.log10(rangeDelta) - Math.log10(divisionCountEstimate));
        let nearestPowerOfTen = Math.pow(10, exponent),
               factor = divisionCountEstimate * nearestPowerOfTen;
        let niceFactor;
        if (rangeDelta < 2 * factor) {
            niceFactor = 1;
        }
        else if (rangeDelta < 3 * factor) {
            niceFactor = 2;
        }
        else if (rangeDelta < 7 * factor) {
            niceFactor = 5;
        }
        else {
            niceFactor = 10;
        }
        let niceInterval = niceFactor * nearestPowerOfTen;

        if (majorInterval && this.context._range / niceInterval > divisionCountEstimate) {
            switch (niceFactor) {
                case 5:
                    niceFactor = 10;
                    break;
                case 2:
                    niceFactor = 5;
                    break;
                case 1:
                    niceFactor = 2;
                    break;
            }
            niceInterval = niceFactor * nearestPowerOfTen;
        }
        this.nearestPowerOfTen = nearestPowerOfTen;

        if (this.logarithmic && majorInterval) {
            return Math.max(1, niceInterval);
        }
        return niceInterval;
    }

    getPossibleBiggerLabelFloatingPoint(divisionCountEstimate, majorInterval) {
        const context = this.context;
        let secondValue = parseFloat(context.min - context._numericProcessor.getPreciseModulo(parseFloat(context.min), majorInterval) + parseFloat(majorInterval)),
            currentDrawValue = secondValue,
            largestLabel, currentLabel;

        if (this.logarithmic) {
            secondValue = Math.pow(10, secondValue);
        }
        largestLabel = context._formatLabel(secondValue);

        for (let i = 1; i < divisionCountEstimate; i++) {
            currentDrawValue = currentDrawValue + majorInterval;

            if (currentDrawValue >= context._drawMax) {
                break;
            }

            if (!this.logarithmic) {
                currentLabel = currentDrawValue;
            }
            else {
                currentLabel = Math.pow(10, currentDrawValue);
            }
            currentLabel = context._formatLabel(currentLabel);
            if (currentLabel.length > largestLabel.length) {
                largestLabel = currentLabel;
            }
        }

        return largestLabel;
    }

    getNiceIntervalInteger(min, max, divisionCountEstimate, majorInterval) {
        const rangeDelta = new Smart.Utilities.BigNumber(max).subtract(new Smart.Utilities.BigNumber(min)),
            exponent = Math.floor(Math.log10(rangeDelta.toString()) - Math.log10(divisionCountEstimate)),
            nearestPowerOfTen = new Smart.Utilities.BigNumber(10).pow(new Smart.Utilities.BigNumber(exponent)),
            factor = new Smart.Utilities.BigNumber(divisionCountEstimate).multiply(nearestPowerOfTen);
        let niceFactor;
        if (rangeDelta.compare(new Smart.Utilities.BigNumber(2 * factor)) === -1) {
            niceFactor = 1;
        }
        else if (rangeDelta.compare(new Smart.Utilities.BigNumber(3 * factor)) === -1) {
            niceFactor = 2;
        }
        else if (rangeDelta.compare(new Smart.Utilities.BigNumber(7 * factor)) === -1) {
            niceFactor = 5;
        }
        else {
            niceFactor = 10;
        }
        let niceInterval = new Smart.Utilities.BigNumber(niceFactor).multiply(nearestPowerOfTen);

        if (majorInterval && new Smart.Utilities.BigNumber(this.context._range).divide(niceInterval).compare(divisionCountEstimate) === 1) {
            switch (niceFactor) {
                case 5:
                    niceFactor = 10;
                    break;
                case 2:
                    niceFactor = 5;
                    break;
                case 1:
                    niceFactor = 2;
                    break;
            }
            niceInterval = new Smart.Utilities.BigNumber(niceFactor).multiply(nearestPowerOfTen);
        }

        if (niceInterval.compare(1) === -1) {
            niceInterval = new Smart.Utilities.BigNumber(1);
        }

        this.nearestPowerOfTen = nearestPowerOfTen;

        return niceInterval;
    }

    getPossibleBiggerLabelInteger(divisionCountEstimate, majorInterval) {
        const context = this.context,
            bigTen = new Smart.Utilities.BigNumber(10);
        let secondValue = new Smart.Utilities.BigNumber(context.min).subtract(new Smart.Utilities.BigNumber(context.min).mod(majorInterval)).add(majorInterval),
            currentDrawValue = secondValue,
            largestLabel, currentLabel;

        if (this.logarithmic) {
            secondValue = bigTen.pow(secondValue);
        }
        largestLabel = context._formatLabel(secondValue);

        for (let i = 1; i < divisionCountEstimate; i++) {
            currentDrawValue = currentDrawValue.add(majorInterval);

            if (currentDrawValue.compare(context._drawMax) !== -1) {
                break;
            }

            if (!this.logarithmic) {
                currentLabel = currentDrawValue;
            }
            else {
                currentLabel = bigTen.pow(currentDrawValue);
            }
            currentLabel = context._formatLabel(currentLabel);
            if (currentLabel.length > largestLabel.length) {
                largestLabel = currentLabel;
            }
        }

        return largestLabel;
    }

    getMinAndMaxLabelSize() {
        const that = this,
            context = that.context,
            container = context.$.container,
            measureLabel = document.createElement('span');

        measureLabel.className = that.labelClass;
        measureLabel.style.position = 'absolute';
        measureLabel.style.visibility = 'hidden';

        container.appendChild(measureLabel);

        measureLabel.innerHTML = that.minLabel;
        const minLabelSize = measureLabel[that.dimension],
            minLabelOtherSize = measureLabel[context._settings.otherSize];

        measureLabel.innerHTML = that.maxLabel;
        const maxLabelSize = measureLabel[that.dimension],
            maxLabelOtherSize = measureLabel[context._settings.otherSize];

        container.removeChild(measureLabel);

        return { minLabelSize: minLabelSize, minLabelOtherSize: minLabelOtherSize, maxLabelSize: maxLabelSize, maxLabelOtherSize: maxLabelOtherSize };
    }

    getCustomTicksLabelSize() {
        const that = this,
            context = that.context,
            container = context.$.container,
            measureLabel = document.createElement('span'),
            customTicks = context.customTicks;

        measureLabel.className = that.labelClass;
        measureLabel.style.position = 'absolute';
        measureLabel.style.visibility = 'hidden';

        container.appendChild(measureLabel);

        measureLabel.innerHTML = context._formatLabel(customTicks[0]);

        let labelSize = measureLabel[that.dimension],
            labelOtherSize = measureLabel[context._settings.otherSize];

        for (let i = 1; i < context.customTicks.length; i++) {
            measureLabel.innerHTML = context._formatLabel(context.customTicks[i]);

            const currentSize = measureLabel[that.dimension],
                currentOtherSize = measureLabel[context._settings.otherSize];

            if (currentSize > labelSize) {
                labelSize = currentSize;
            }

            if (currentOtherSize > labelOtherSize) {
                labelOtherSize = currentOtherSize;
            }
        }

        container.removeChild(measureLabel);

        return { minLabelSize: labelSize, minLabelOtherSize: labelOtherSize, maxLabelSize: labelSize, maxLabelOtherSize: labelOtherSize };
    }
});