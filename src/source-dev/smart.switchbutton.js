
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
* Switch Button custom element.
*/
Smart('smart-switch-button', class SwitchButton extends Smart.ToggleButton {
    // Switch Button's properties.
    static get properties() {
        return {
            'inverted': {
                value: false,
                type: 'boolean'
            },
            'orientation': {
                value: 'horizontal',
                allowedValues: ['horizontal', 'vertical'],
                type: 'string'
            },
            'switchMode': {
                value: 'default',
                allowedValues: ['default', 'click', 'drag', 'none'],
                type: 'string'
            },
            'clickMode': {
                value: 'release',
                allowedValues: ['press', 'release', 'pressAndRelease'],
                type: 'string'
            }
        };
    }

    /**
     * Switch Button's event listeners.
     */
    static get listeners() {
        return {
            'container.down': '_mouseDownHandler',
            'document.move': '_drag',
            'container.move': '_moveHandler',
            'document.up': '_switchThumbDropHandler',
            'mouseenter': '_switchButtonOnMouseEnter',
            'mouseleave': '_switchButtonOnMouseLeave',
            'resize': '_resizeHandler',
            'container.resize': '_resizeHandler',
            'document.selectstart': '_selectStartHandler'
        };
    }

    /**
     * CSS files needed for the element (ShadowDOM)
     */
    static get styleUrls() {
        return [
            'smart.switchbutton.css'
        ]
    }

    /**
    * Called when a property is changed.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        const that = this;

        super.propertyChangedHandler(propertyName, oldValue, newValue);
        that._updateContentProperties();

        switch (propertyName) {
            case 'indeterminate':
                if (newValue) {
                    that._valueCache = that.checked;
                    that.checked = null;
                }
                else {
                    that.checked = that._valueCache;
                }

                that._setAriaState();
                break;
            case 'trueContent':
                that.trueContent = newValue;
                break;
            case 'falseContent':
                that.falseContent = newValue;
                break;
            case 'orientation':
                that._resizeHandler();
                break;
        }

        that._getContainersSizeAndBreakPoint();
        that._removeDragStyles();
        that._resizeHandler();
    }

    /** Switch Button's Html template. */
    template() {
        return `<div  id='container' class='smart-container' role="presentation">
                    <div id='innerContainer' class='smart-inner-container' role="presentation">
                        <span id='falseContentContainer' inner-h-t-m-l='[[falseContent]]' class='smart-false-content-container'></span>
                        <span id='switchThumb' class='smart-thumb' role="presentation"></span>
                        <span id='trueContentContainer' inner-h-t-m-l='[[trueContent]]' class='smart-true-content-container'></span>
                    </div>
                    <input id='hiddenInput' class='smart-hidden-input' type='hidden'>
                </div>`;
    }

    /** Called when the element is ready. Used for one-time configuration of the Switch Button. */
    ready() {
        const that = this;

        super.ready();

        that.setAttribute('role', 'switch');

        let animationType = that.animation;

        if (that.hasAnimation) {
            that.animation = 'none';
        }

        that._supportCSSVariables = Smart.Utilities.Core.CSSVariablesSupport() && Boolean(window.getComputedStyle(that.$.container).getPropertyValue('--smart-switch-button-default-width'));
        that._htmlBindOnInitialization();
        that._resizeHandler();
        that._initializePrivateVariables();
        that._getContainersSizeAndBreakPoint();

        if (that.indeterminate) {
            that._valueCache = that.checked;
            that.checked = null;
        }

        that._setAriaState();
        that._handleTemplate(true); //Set the True Content
        that._handleTemplate(false); //Set the False Content
        that._handleTemplate(); // Set the Indeterminate Content

        that._updateHidenInputNameAndValue();
        that._updateThumbPosition();

        that.animation = animationType;
    }

    /** Changes the check state and fires event on mouse up. */
    _mouseDownHandler(event) {
        const that = this;

        if (that.disabled || that.readonly || that.switchMode === 'none') {
            return;
        }

        if (event.originalEvent.target.closest('.smart-thumb') === that.$.switchThumb && (that.switchMode === 'default' || that.switchMode === 'drag')) {
            that._switchThumbDragStartHandler(event);
        }

        that._isSwitchClicked = that;

        that._updateContentProperties();

        if ((that.clickMode !== 'release') && (that.switchMode === 'click')) {
            that._updateStateOnClick();
            that.$.fireEvent('click');
            that.indeterminate = false;
            that._updateHidenInputNameAndValue();
        }
    }

    /** Changes the check state and updates CSS variables */
    _updateStateOnClick() {
        const that = this;

        that._changeCheckState();
        that.focus();
    }

    _drag(event) {
        const that = this;

        if (!that._mouseDown) {
            return;
        }

        if (Smart.Utilities.Core.isMobile) {
            event.originalEvent.preventDefault();
        }

        that._switchThumbDragHandler(event);
    }

    /** Changes the check state wneh widget's thumb is dragged. */
    _switchThumbDragStartHandler(event) {
        const that = this;

        if (that.disabled) {
            return;
        }

        if ((that.switchMode === 'click') && (that.clickMode !== 'release')) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (that._isInactiveOn('drag')) {
            return;
        }

        that._mouseDown = true;
        that._getContainersSizeAndBreakPoint();
        that._pointerPosition = (that.orientation === 'vertical' ? event.pageY : event.pageX);
        event.preventDefault();
    }

    _selectStartHandler(event) {
        const that = this;

        if (that._mouseDown) {
            event.preventDefault();
        }
    }

    /** Changes the check state wneh widget's thumb is dragged. */
    _switchThumbDragHandler(event) {
        const that = this;

        if (that._isInactiveOn('drag')) {
            return;
        }

        if (that._mouseDown === false) {
            that._removeDragStyles();
            return;
        }

        if (!that.hasAttribute('dragged')) {
            if (Math.abs((that.orientation === 'vertical' ? event.pageY : event.pageX) - that._pointerPosition) <= 1.5) {
                return;
            }

            that.setAttribute('dragged', '');
        }

        //delete that._isSwitchClicked;

        let innerContainer = that.$.innerContainer,
            offset = that.$.container.getBoundingClientRect(),
            scrollDistance = that.orientation === 'vertical' ? (document.body.scrollTop || document.documentElement.scrollTop) : (document.body.scrollLeft || document.documentElement.scrollLeft),
            containerOffset = that.orientation === 'vertical' ? offset.top + scrollDistance : offset.left + scrollDistance,
            diff = that.orientation === 'vertical' ? (that._pointerPosition - innerContainer.offsetTop) : (that._pointerPosition - innerContainer.offsetLeft),
            pointerInRange = (that._pointerPosition >= containerOffset && that._pointerPosition <= containerOffset + that._switchContainerSize);
        const maxLeft = -1 * (that.offsetWidth - that.$.switchThumb.offsetWidth),
            maxTop = -1 * (that.offsetHeight - that.$.switchThumb.offsetHeight);

        that._pointerPosition = that.orientation === 'vertical' ? event.pageY : event.pageX;
        if (pointerInRange) {
            let currentPosition = that._pointerPosition - diff;

            if (currentPosition < -that._switchTrackLength) currentPosition = -that._switchTrackLength;
            if (currentPosition > 0) currentPosition = 0;
            that.orientation === 'vertical' ? (that.$.innerContainer.style.top = Math.max(maxTop, currentPosition) + 'px') : (that.$.innerContainer.style.left = Math.max(maxLeft, currentPosition) + 'px');
        }
    }

    /** Document Up Event Handler */
    _switchThumbDropHandler() {
        const that = this;

        if (that.hasAttribute('dragged')) {
            that._endDrag();
        }
        else if (that._isSwitchClicked) {
            that._endClick();
        }

        that._mouseDown = false;
        delete that._isSwitchClicked;
    }

    /**
     * Ends the dragging operation
     */
    _endDrag() {
        const that = this,
            isInverted = that.inverted && !that.rightToLeft || !that.inverted && that.rightToLeft;

        that.indeterminate = false;
        that._updateHidenInputNameAndValue();

        if (that._isInactiveOn('drag') || !that._mouseDown) {
            return;
        }

        that.removeAttribute('dragged');

        delete that._pointerPosition;

        let switchOnPosition = (that.orientation === 'vertical' ? (that.$.innerContainer.offsetTop + that.$.switchThumb.offsetTop + that.$.switchThumb.clientHeight / 2) : (that.$.innerContainer.offsetLeft + that.$.switchThumb.offsetLeft + that.$.switchThumb.clientWidth / 2));

        const switchAfterBreakPoint = switchOnPosition > that._switchBreakPoint;

        if (that.checked !== null) {
            if (!isInverted === (switchAfterBreakPoint === that.checked)) {
                that._changeCheckState(!that.checked);
            }
        }
        else {
            switchAfterBreakPoint ? that._changeCheckState(isInverted) : that._changeCheckState(!isInverted);
        }

        that._removeDragStyles();
        that._updateThumbPosition();
    }

    /**
     * Ends the click operation
     */
    _endClick() {
        const that = this;

        //Click Handler
        that._resizeHandler();

        if (that.disabled || that.readonly) {
            return;
        }

        if (that._isInactiveOn('click')) {
            return;
        }

        if (that.clickMode !== 'release' && that.clickMode !== 'pressAndRelease') {
            //event.preventDefault();
            //event.stopPropagation();
        }
        else {
            that._updateStateOnClick();
        }

        that.indeterminate = false;
        that._updateHidenInputNameAndValue();
    }

    /**
    * Switch button onMouseEnter event handler.
    **/
    _switchButtonOnMouseEnter() {
        const that = this;

        if (that.disabled || that.readonly) {
            return;

        }

        that.$.addClass('hovered');
    }

    /**
    * Switch button onMouseLeave event handler.
    **/
    _switchButtonOnMouseLeave() {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        that.$.removeClass('hovered');
    }

    /** Checks is handler active in particular switch mode. */
    _isInactiveOn(switchMode) {
        const that = this,
            isInactive = ((that.disabled) || that.readonly || (that.switchMode !== switchMode));

        if (that.switchMode === 'default') {
            return false;
        }

        return isInactive;
    }

    /** Changes the check state wneh spacebar is pressed. */
    _keyUpHandler(event) {
        const that = this;

        if (that.disabled || that.readonly || (event.keyCode !== 32) || that.switchMode === 'none') {
            return;
        }

        that._getContainersSizeAndBreakPoint();
        that._changeCheckState();
    }

    /** Initializes private variables. */
    _initializePrivateVariables() {
        const that = this;

        that._switchContainerSize = that._switchTrackLength = that._switchBreakPoint = that._pointerPosition = 0;
        that._mouseDown = false;
    }

    /** Changes the check state. */
    _changeCheckState(optionalValue) {
        const that = this;
        let oldValue = that.checked;

        if ((oldValue === null) && (optionalValue !== undefined)) {
            that.$.fireEvent('change', { 'value': optionalValue, 'oldValue': null });
            that.checked = false;
            that._updateThumbPosition();
            return;
        }

        if (that.checked === null) {
            that.checked = true;
        }
        else {
            that.checked = !that.checked;
        }

        that._setAriaState();
        that._updateThumbPosition();

        that.$.fireEvent('change', { 'value': that.checked, 'oldValue': oldValue });
        that._updateHidenInputNameAndValue();
    }

    /**
    * Get the actual width of the Switch Button and Switch Button's breakpoint.
    */
    _getContainersSizeAndBreakPoint() {
        const that = this;

        that._switchContainerSize = (that.orientation === 'vertical' ? that.$.container.clientHeight : that.$.container.clientWidth);
        that._switchTrackLength = (that.orientation === 'vertical' ? (that._switchContainerSize - that.$.switchThumb.clientHeight) : (that._switchContainerSize - that.$.switchThumb.clientWidth));
        that._switchBreakPoint = that._switchContainerSize / 2;
    }

    /**
    * Remove styles, related to absolute positioning of the thumb when it's dragged
    */
    _removeDragStyles() {
        const that = this;
        that._supportCSSVariables ? that.$.innerContainer.removeAttribute('style') : that.$.innerContainer.style.left = '';
        that._supportCSSVariables ? that.$.innerContainer.removeAttribute('style') : that.$.innerContainer.style.top = '';
        that._mouseDown = false;
    }

    /**
    * Element mousemove event handler.
    */
    _moveHandler(event) {
        if (event.originalEvent.type === 'touchmove') {
            event.originalEvent.preventDefault();
        }
    }

    /** Resize handler **/
    _resizeHandler() {
        const that = this;

        if (!document.body.contains(that)) {
            return;
        }

        const computedStyles = window.getComputedStyle(that, null),
            borderTopWidth = parseInt(computedStyles.getPropertyValue('border-top-width')),
            borderRightWidth = parseInt(computedStyles.getPropertyValue('border-right-width')),
            borderBottomWidth = parseInt(computedStyles.getPropertyValue('border-bottom-width')),
            borderLeftWidth = parseInt(computedStyles.getPropertyValue('border-left-width')),
            newWidth = that.orientation === 'vertical' ? (that.offsetHeight - (borderTopWidth + borderBottomWidth)) : (that.offsetWidth - (borderLeftWidth + borderRightWidth));

        that._getContainersSizeAndBreakPoint();

        if (that._supportCSSVariables) {
            that.$.container.style.setProperty('--smart-switch-button-default-width', newWidth + 'px');
        }
        else {
            that._innerContainerSize = newWidth;
            that.$.innerContainer.style.height = that.$.innerContainer.style.width = '';
            that.$.trueContentContainer.style.height = that.$.trueContentContainer.style.width = '';
            that.$.falseContentContainer.style.height = that.$.falseContentContainer.style.width = '';

            if (that.orientation === 'horizontal') {
                that.$.innerContainer.style.setProperty('width', (2 * newWidth - that.$.switchThumb.clientWidth) + 'px');
                that.$.trueContentContainer.style.setProperty('width', that._switchTrackLength + 'px');
                that.$.falseContentContainer.style.setProperty('width', that._switchTrackLength + 'px');
            }
            else {
                that.$.innerContainer.style.setProperty('height', (2 * newWidth - that.$.switchThumb.clientHeight) + 'px');
                that.$.trueContentContainer.style.setProperty('height', that._switchTrackLength + 'px');
                that.$.falseContentContainer.style.setProperty('height', that._switchTrackLength + 'px');
            }

            that._updateThumbPosition();
        }
    }

    /**
     * Updates the thumb position when the browser doesn't support CSS variables
     */
    _updateThumbPosition() {
        const that = this,
            isInverted = that.inverted && !that.rightToLeft || !that.inverted && that.rightToLeft;

        if (that._supportCSSVariables || (isInverted ? that.checked === true : that.checked === false) || !that._innerContainerSize) {
            that.$.innerContainer.style.left = that.$.innerContainer.style.top = '';
            return;
        }

        if (isInverted ? that.checked === false : that.checked) {
            if (that.orientation === 'horizontal') {
                that.$.innerContainer.style.left = (-1 * (that._innerContainerSize - that.$.switchThumb.offsetWidth)) + 'px';
                that.$.innerContainer.style.top = '';
            }
            else {
                that.$.innerContainer.style.top = (-1 * (that._innerContainerSize - that.$.switchThumb.offsetHeight)) + 'px';
                that.$.innerContainer.style.left = '';
            }
        }

        if (that.checked === null) {
            if (that.orientation === 'horizontal') {
                that.$.innerContainer.style.left = (-1 * (that._innerContainerSize / 2 - that.$.switchThumb.offsetWidth / 2)) + 'px';
                that.$.innerContainer.style.top = '';
            }
            else {
                that.$.innerContainer.style.top = (-1 * (that._innerContainerSize / 2 - that.$.switchThumb.offsetHeight / 2)) + 'px';
                that.$.innerContainer.style.left = '';
            }
        }
    }

    /**
     * Sets WAI-ARIA state.
     */
    _setAriaState() {
        const that = this,
            checked = !!that.checked;

        that.setAttribute('aria-checked', checked);

        if (checked) {
            that.$.falseContentContainer.setAttribute('aria-hidden', true);
            that.$.trueContentContainer.removeAttribute('aria-hidden');
        }
        else {
            that.$.trueContentContainer.setAttribute('aria-hidden', true);
            that.$.falseContentContainer.removeAttribute('aria-hidden');
        }
    }
});
