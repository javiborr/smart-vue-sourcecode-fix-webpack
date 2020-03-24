
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart('smart-base-progress-bar', class BaseProgressBar extends Smart.BaseElement {

    /** Progressbar's properties */
    static get properties() {
        return {
            'indeterminate': {
                value: false,
                type: 'boolean'
            },
            'inverted': {
                value: false,
                type: 'boolean'
            },
            'formatFunction': {
                value: null,
                type: 'function'
            },
            'max': {
                value: 100,
                type: 'number'
            },
            'min': {
                value: 0,
                type: 'number'
            },
            'showProgressValue': {
                value: false,
                type: 'boolean'
            },
            'value': {
                value: 0,
                type: 'number?'
            }
        }
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.progressbar.css'
        ]
    }

    render() {
        const that = this;

        if (!that.$.label.id) {
            that.$.label.id = that.id + 'Label';
        }

        that.setAttribute('role', 'progressbar');
        that.setAttribute('aria-labelledby', that.$.label.id);
        that.setAttribute('aria-valuemin', that.min);
        that.setAttribute('aria-valuemax', that.max);

        if (that.value !== null && !that.indeterminate) {
            that.$.value.style.transition = 'none';
        }

        that._updateProgress();

        requestAnimationFrame(() => that.$.value.style.transition = '');

        super.render();
    }

    /**
   * Updates the progressbar when a property is changed.
   * @param {string} propertyName The name of the property.
   * @param {number/string} oldValue The previously entered value. Max, min and value are of type Number. The rest are of type String.
   * @param {number/string} newValue The new entered value. Max, min and value are of type Number. The rest are of type String.
   */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        that._updateProgress();
        if (propertyName === 'value') {
            that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue, changeType: 'api' });
        }
        else if (propertyName === 'min' || propertyName === 'max') {
            that.setAttribute('aria-value' + propertyName, newValue);
        }
    }

    _updateProgress() {
        const that = this,
            value = that.value;

        if (value === null || that.indeterminate) {
            that.removeAttribute('aria-valuenow');
        }
        else {
            that.setAttribute('aria-valuenow', value);
        }
    }

    get _percentageValue() {
        const that = this;

        const max = Math.max(that.min, that.max);
        const min = Math.min(that.min, that.max);

        const validValue = (Math.min(max, Math.max(min, that.value)));
        const percentageValue = (validValue - min) / (max - min);

        return percentageValue;
    }
});

Smart('smart-circular-progress-bar', class CircularProgressBar extends Smart.BaseProgressBar {
    /** progressbar's HTML template */
    template() {
        return `<div id="container" role="presentation">
                    <svg width="100%" height="100%" viewPort="0 0 100 100" viewBox="0 0 100 100" role="presentation" aria-hidden="true">
                        <circle id="value" class="smart-value-path" r="50" cx="50" cy="50" transform="rotate(270 50 50)"></circle>
                        <circle id="value" class="smart-value" r="50" cx="50" cy="50" transform="rotate(270 50 50)"></circle>
                    </svg>
                    <div class="smart-label-container" role="presentation">
                        <content></content>
                        <span id="label" class="smart-label"></span>
                    </div>
                </div>`;
    }

    /**
    * Circular Progress bar's event listeners.
    */
    static get listeners() {
        return {
            'resize': '_resizeHandler'
        };
    }

    render() {
        const that = this;

        that.$.container.style.width = that.$.container.style.height = Math.min(that.offsetWidth, that.offsetHeight) + 'px';

        if (that.$.hasClass('echo-animation')) {
            that.value = that.max;
            that._updateProgress();
        }

        super.render();
    }

    /**
    * Circular Progress Bar's resize handler. Ensures the Progress Bars always has the same proportions.
    **/
    _resizeHandler() {
        const that = this;

        that.$.container.style.width = that.$.container.style.height = Math.min(that.offsetWidth, that.offsetHeight) + 'px';
    }

    /** Updates the progress element. */
    _updateProgress() {
        super._updateProgress();

        const that = this,
            radius = that.indeterminate ? Math.PI * 100 : Math.PI * 100 - that._percentageValue * Math.PI * 100,
            isIE = /*@cc_on!@*/false || !!document.documentMode,
            isEdge = !isIE && !!window.StyleMedia;

        if (that.showProgressValue) {
            const percentage = parseInt(that._percentageValue * 100);

            that.$.label.innerHTML = that.formatFunction ? that.formatFunction(percentage) : percentage + '%';
        }
        else {
            that.$.label.innerHTML = '';
        }

        //Check if the browser is Edge to make the animation
        if (isIE || isEdge) {
            if (that.value === null || that.indeterminate) {
                that.$.value.style.strokeDashoffset = '';
                that.$.value.setAttribute('class', 'smart-value smart-value-animation-ms');
                return;
            }
            else {
                that.$.value.setAttribute('class', 'smart-value');
                that.$.value.style.strokeDashoffset = (that.inverted && !that.rightToLeft) || (!that.inverted && that.rightToLeft) ? -radius : radius;
                return;
            }
        }

        that.$.value.style.strokeDashoffset = (that.inverted && !that.rightToLeft) || (!that.inverted && that.rightToLeft) ? -radius : radius;

        if (that.value === null || that.indeterminate) {
            that.$value.addClass('smart-value-animation');
            return;
        }

        that.$value.removeClass('smart-value-animation');
    }
});


Smart('smart-progress-bar', class ProgressBar extends Smart.BaseProgressBar {

    /** Progressbar's properties */
    static get properties() {
        return {
            'orientation': {
                value: 'horizontal',
                allowedValues: ['horizontal', 'vertical'],
                type: 'string'
            }
        };
    }

    /** progressbar's HTML template. */
    template() {
        return `<div role="presentation">
                    <div id="value" class="smart-value"></div>
                    <div id="label" class="smart-label"></div>
                </div>`;
    }

    /** Updates the progress elements. */
    _updateProgress() {
        super._updateProgress();

        const that = this;

        //Label for Percentages
        if (that.showProgressValue) {
            const percentage = parseInt(that._percentageValue * 100);

            that.$.label.innerHTML = that.formatFunction ? that.formatFunction(percentage) : percentage + '%';
        }
        else {
            that.$.label.innerHTML = '';
        }

        if (that.value === null || that.indeterminate) {
            that.$value.addClass('smart-value-animation');
        }
        else {
            that.$value.removeClass('smart-value-animation');
        }

        that.$.value.style.transform = that.orientation === 'horizontal' ? 'scaleX(' + that._percentageValue + ')' : 'scaleY(' + that._percentageValue + ')';
    }
});
