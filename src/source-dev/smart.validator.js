
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/*
 * Class validator
 * */
Smart.Utilities.Assign('Validator', class Validator {

    constructor(rules, validationSummarySelector = '') {
        const that = this;

        if (rules) {
            that.rules = rules;

            // Create validation summary holder
            that.validationSummarySelector = validationSummarySelector;
            if (that.validationSummarySelector) {
                for (let i = 0; i < that.rules.length; i++) {
                    const rule = that.rules[i];
                    const errorSummary = document.createElement('span');
                    errorSummary.setAttribute('input-selector', rule.input);
                    document.querySelector(that.validationSummarySelector).appendChild(errorSummary);
                }
            }

            that._configureInputs();
            that._addEventListeners();
        }
    }

        /**
         * Attach public method for adding event listeners
         * */
        attach() {
            const that = this;
            that._removeEventListeners();
            that._addEventListeners();
        }

        /**
         * Detach public method for removing event listeners
         * */
        detach() {
            const that = this;
            that.reset();
            that._removeEventListeners();
        }

        /**
         * Reset public method that clears the error messages
         * */
        reset() {
            const that = this;

            for (let i = 0; i < that.rules.length; i++) {
                let rule = that.rules[i],
                    inputElements = document.querySelectorAll(rule.input);

                for (let i = 0; i < inputElements.length; i++) {
                    that._resetAttributes(inputElements[i], rule);
                }

                rule.hint = '';
            }
        }

        /**
         * Remove success and error input attributes
         */
        _resetAttributes(inputElement, rule) {
            const that = this;

            if (inputElement.hasAttribute('smart-validation-success')) {
                that._removeErrorOrSuccessAttr(inputElement, 0);
            }

            if (inputElement.hasAttribute('smart-validation-error')) {
                that._removeErrorOrSuccessAttr(inputElement, 1);

                if (that.validationSummarySelector) {
                    document.querySelector('span[input-selector=\'' + rule.input + '\']').innerHTML = '';
                }
            }
        }

        /**
         * Validate public method, that validates all the rules
         */
        validate(result) {
            const that = this;

            let valid = true,
                temp,
                tempElement,
                invalid = [],
                ruleFuncsCount = 0

            for (let i = 0; i < that.rules.length; i += 1) {
                if (typeof that.rules[i].type === 'function') {
                    ruleFuncsCount++;
                }
            }

            for (let i = 0; i < that.rules.length; i += 1) {
                if (typeof that.rules[i].type === 'function') {
                    const validate = function (isValid, rule) {
                        temp = isValid;
                        if (false === temp) {
                            valid = false;
                            tempElement = document.querySelector(rule.input);
                            invalid.push(tempElement);
                        }
                        ruleFuncsCount--;
                        if (ruleFuncsCount === 0) {
                            if (typeof result === 'function') {
                                if (result) result(valid);
                            }
                        }
                    }
                    that._validateRule(that.rules[i], validate);
                }
                else {
                    temp = that._validateRule(that.rules[i]);
                }
                if (false === temp) {
                    valid = false;
                    tempElement = document.querySelector(that.rules[i].input);
                    invalid.push(tempElement);
                }
            }

            if (ruleFuncsCount === 0) {
                return valid;
            }
            else {
                return undefined;
            }
        }

        /**
         * Method that calculates the position of input errors
         */
        _calculateErrorMsgTooltipPosition(inputElement, errorMsgHolder) {
            const bodyRect = document.body.getBoundingClientRect(),
                elemRect = inputElement.getBoundingClientRect(),
                offsetTop = elemRect.top - bodyRect.top;

            errorMsgHolder.style.top = offsetTop + elemRect.height + 'px';
            errorMsgHolder.style.left = elemRect.left + 'px';
        }

        /**
         * Add error attribute on the selected input 
         */
        _addErrorAttr(inputElement, errorMsg) {
            const that = this;

            /**
            * Adding custom event listeners
            * */
            function _addCustomListenerTo(errorSelector, eventName, showErrorSelector) {
                let inputElem = inputElement;
                const smartInput = inputElement.querySelector('.smart-validation-error input.smart-input');
                if (smartInput) {
                    inputElem = smartInput;
                }

                let showSelectorFunction;

                if (showErrorSelector) {
                    showSelectorFunction = () => errorSelector.classList.remove('smart-hidden');
                }
                else {
                    showSelectorFunction = () => errorSelector.classList.add('smart-hidden');
                }

                inputElem.addEventListener(eventName, showSelectorFunction);
                inputElem[eventName + inputElem.id] = showSelectorFunction;
            }

            inputElement.setAttribute('smart-validation-error', errorMsg);
            inputElement.classList.add('smart-validation-error');

            //Check if input is html input element and dont have label already - add the label [Because: After is not allowed on input]
            if ((inputElement.tagName.toLowerCase() === 'input') && (inputElement.type !== 'button') && (inputElement.type !== 'radio')) {
                const inputNextSibling = inputElement.nextSibling;

                //Add error label
                if ((typeof inputNextSibling.tagName === 'undefined') || (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() !== 'label') && (inputNextSibling.className !== 'smart-error-label-like-after-element'))) {
                    let inputErrMsgLabel = document.createElement('label');
                    inputErrMsgLabel.setAttribute('class', 'smart-error-label-like-after-element');
                    inputElement.parentNode.insertBefore(inputErrMsgLabel, inputNextSibling);
                }
            }

            // Add hidden error msg 
            const errorMsgHolder = document.createElement('span');
            errorMsgHolder.classList.add('smart-error-holder');
            errorMsgHolder.classList.add('smart-hidden');
            errorMsgHolder.classList.add(inputElement.id);
            errorMsgHolder.innerHTML = errorMsg;
            const bodySelector = document.body;
            bodySelector.appendChild(errorMsgHolder);

            // Calculate position of errorMsg
            that._calculateErrorMsgTooltipPosition(inputElement, errorMsgHolder);

            // Add listener for errorMsgs position recalculation on orientation change
            window.addEventListener('orientationchange', function () {
                setTimeout(function () {
                    that._calculateErrorMsgTooltipPosition(inputElement, errorMsgHolder)
                }, 300);
            });

            // Add listener for errorMsgs position recalculation on resize event
            window.addEventListener('resize', function () {
                that._calculateErrorMsgTooltipPosition(inputElement, errorMsgHolder)
            });

            // Add listener to input to show the hidden error msg
            const smartInput = inputElement.querySelector('.smart-validation-error input.smart-input');
            if (smartInput) {
                // Add event listener for the error msg holder
                _addCustomListenerTo(errorMsgHolder, 'click', 1);
                if ((smartInput.type !== 'radio') && (smartInput.type !== 'checkbox')) {
                    _addCustomListenerTo(errorMsgHolder, 'focusin', 1);
                }
                _addCustomListenerTo(errorMsgHolder, 'focusout', 0);
            }
            else {
                _addCustomListenerTo(errorMsgHolder, 'click', 1);
                if ((inputElement.type !== 'radio') && (inputElement.type !== 'checkbox')) {
                    _addCustomListenerTo(errorMsgHolder, 'focusin', 1);
                }
                _addCustomListenerTo(errorMsgHolder, 'focusout', 0);
            }
        }

        /**
         * Add Success attribute on selected input 
         */
        _addSuccessAttr(inputElement) {
            inputElement.setAttribute('smart-validation-success', '');
            inputElement.classList.add('smart-validation-success');
            const inputNextSibling = inputElement.nextSibling;

            if (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() === 'label') && (inputNextSibling.className === 'smart-error-label-like-after-element')) {
                const inputErrMsgLabel = document.createElement('label');
                inputErrMsgLabel.setAttribute('class', 'smart-success-label-like-after-element');
                inputElement.parentNode.insertBefore(inputErrMsgLabel, inputNextSibling);
            }

            if (inputElement.tagName.toLowerCase() === 'input') {

                // Remove error label
                if (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() === 'label') && (inputNextSibling.className === 'smart-error-label-like-after-element')) {
                    inputNextSibling.remove();
                }

                // Add success label
                if ((typeof inputNextSibling.tagName === 'undefined') || (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() !== 'label') && (inputNextSibling.className !== 'smart-success-label-like-after-element'))) {
                    const inputErrMsgLabel = document.createElement('label');
                    inputErrMsgLabel.setAttribute('class', 'smart-success-label-like-after-element');
                    inputElement.parentNode.insertBefore(inputErrMsgLabel, inputNextSibling);
                }
            }
        }

        /**
        * Remove Success Or Error attribute from the selected input 
        */
        _removeErrorOrSuccessAttr(inputElement, isErrorAttr) {
            const inputNextSibling = inputElement.nextSibling;

            //_removeErrorAttr
            if (isErrorAttr === 1) {
                inputElement.removeAttribute('smart-validation-error');
                inputElement.classList.remove('smart-validation-error');

                //Remove error msg
                const spanErrorMsg = document.querySelector('span.smart-error-holder.' + inputElement.id);
                if (spanErrorMsg) {
                    spanErrorMsg.remove();
                }

                //Remove error label
                if (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() === 'label') && (inputNextSibling.className === 'smart-error-label-like-after-element')) {
                    inputNextSibling.remove();
                }
            }

            //_removeSuccessAttr
            if (isErrorAttr === 0) {
                inputElement.removeAttribute('smart-validation-success');
                inputElement.classList.remove('smart-validation-success');

                //Remove success label
                if (inputNextSibling.tagName && (inputNextSibling.tagName.toLowerCase() === 'label') && (inputNextSibling.className === 'smart-success-label-like-after-element')) {
                    inputNextSibling.remove();
                }
            }

        }

        /**
         * Validate rule method that validates each rule one by one
         */
        _validateRule(rule, validate) {
            const that = this,
                inputElements = document.querySelectorAll(rule.input + ':not(.smart-error-holder)');

            let hint,
                valid = true;

            if ((!inputElements) || (inputElements[0] === null)) {
                return;
            }

            let ruleResult = false;
            if (typeof rule.type === 'function') {
                ruleResult = rule.type.call(that, inputElements[0], rule);

                if (ruleResult === true && validate) {
                    validate(true, rule);
                }
            }

            if (typeof rule.type === 'function' && ruleResult === false) {
                if (typeof rule.hintRender === 'function' && !rule.hint && !that._higherPriorityActive(rule)) {
                    hint = rule.hintRender.apply(this, [rule.message, inputElements[0]]);
                    that._removeLowPriorityHints(rule);
                    rule.hint = hint;

                    for (let i = 0; i < inputElements.length; i++) {
                        that._removeErrorOrSuccessAttr(inputElements[i], 0)
                        that._addErrorAttr(inputElements[i], rule.message)
                    }

                    if (that.validationSummarySelector) {
                        document.querySelector('span[input-selector=\'' + rule.input + '\']').innerHTML = rule.message;
                    }
                }
                valid = false;
                if (validate) {
                    validate(false, rule);
                }
            }
            else {
                that._hideHintByRule(rule);
            }

            if ((inputElements[0]) && (!inputElements[0].hasAttribute('smart-validation-error'))) {
                if (inputElements.length > 1) {
                    for (let i = 0; i < inputElements.length; i++) {
                        that._removeErrorOrSuccessAttr(inputElements[i], 1)
                    }
                }
                else {
                    that._addSuccessAttr(inputElements[0])
                }
            }

            return valid;
        }

        /**
         * Function that hides hint depending of the rule
         */
        _hideHintByRule(rule) {
            const that = this,
                inputElements = document.querySelectorAll(rule.input);

            let hint;

            if (rule) {
                hint = rule.hint;
                if (hint) {

                    for (let i = 0; i < inputElements.length; i++) {
                        if (inputElements.length > 1) {
                            that._removeErrorOrSuccessAttr(inputElements[i], 1)
                        }
                        else {
                            that._removeErrorOrSuccessAttr(inputElements[i], 1);
                            that._addSuccessAttr(inputElements[i]);
                        }
                    }

                    if (that.validationSummarySelector) {
                        document.querySelector('span[input-selector=\'' + rule.input + '\']').innerHTML = '';
                    }

                    hint.remove();
                }

                rule.hint = null;
            }
        }

        /**
         * Remove current editing hint
         */
        _removeLowPriorityHints(rule) {
            const that = this;
            let reach = false,
                current;

            for (let i = 0; i < that.rules.length; i += 1) {
                current = that.rules[i];
                if (reach && current.input === rule.input) {
                    that._hideHintByRule(current);
                }
                if (current === rule) {
                    reach = true;
                }
            }
        }

        /**
         * Remove event listeners
         * */
        _removeEventListeners() {
            const that = this;

            let rule,
                inputElements,
                listeners;

            for (let i = 0; i < that.rules.length; i += 1) {
                rule = that.rules[i];
                listeners = rule.action.split(',');
                inputElements = document.querySelectorAll(rule.input);

                for (let j = 0; j < listeners.length; j += 1) {

                    for (let k = 0; k < inputElements.length; k++) {
                        let _eachInputElement = inputElements[k];
                        if (inputElements.length === 1) {
                            k = '';
                        }

                        // blur,focus bugfix
                        let isJQWidget = false;
                        if (that._isjQWidget(_eachInputElement)) {
                            isJQWidget = true;
                        }
                        if (isJQWidget && (listeners[j].trim() === 'blur' || listeners[j].trim() === 'focus')) {
                            if (_eachInputElement && _eachInputElement.nodeName.toLowerCase() !== 'input') {
                                _eachInputElement = _eachInputElement.querySelector('input');
                            }
                        }

                        _eachInputElement.removeEventListener(listeners[j].trim(), _eachInputElement[listeners[j].trim() + rule.input + rule.message.split(' ').join('_') + i + '' + k]);
                        delete _eachInputElement[listeners[j].trim() + rule.input + rule.message.split(' ').join('_') + i + '' + k];
                    }
                }
            }
        }

        /**
         * Adding event listeners 
         * */
        _addEventListeners() {
            const that = this;

            let inputElements;
            for (let ruleNum = 0; ruleNum < that.rules.length; ruleNum += 1) {
                let rule = that.rules[ruleNum];
                inputElements = document.querySelectorAll(rule.input);

                for (let radioCounter = 0; radioCounter < inputElements.length; radioCounter++) {
                    let _eachInputElement = inputElements[radioCounter];
                    if (inputElements.length === 1) {
                        radioCounter = '';
                    }

                    const listeners = rule.action.split(',');
                    let isJQWidget = false;
                    if (that._isjQWidget(_eachInputElement)) {
                        isJQWidget = true;
                    }

                    for (let m = 0; m < listeners.length; m += 1) {
                        const eventName = listeners[m].trim();

                        // blur,focus bugfix
                        if (isJQWidget && (eventName === 'blur' || eventName === 'focus')) {
                            if (_eachInputElement && _eachInputElement.nodeName.toLowerCase() !== 'input') {
                                _eachInputElement = _eachInputElement.querySelector('input');
                            }
                        }

                        const validationFunction = () => that._validateRule(rule);
                        if (_eachInputElement !== null) {
                            _eachInputElement.addEventListener(eventName, validationFunction);
                            _eachInputElement[eventName + rule.input + rule.message.split(' ').join('_') + ruleNum + '' + radioCounter] = validationFunction;
                        }
                    }

                }
            }
        }

        /**
         * Initialization input method
         * */
        _configureInputs() {
            const that = this;

            that.rules = that.rules || [];
            for (let i = 0; i < that.rules.length; i += 1) {
                that._handleInput(i);
            }
        }

        /**
         * handle each input method used in _configureInputs
         */
        _handleInput(ruleId) {
            const that = this;

            const rule = that.rules[ruleId];
            if (!rule['message']) {
                rule['message'] = 'Validation Failed!';
            }
            if (!rule['action']) {
                rule['action'] = 'blur';
            }
            if (!rule['hintRender']) {
                rule['hintRender'] = (() => document.createElement('div'));
            }
            if (!rule['type']) {
                rule['type'] = null;
            }
            else {
                that._handleRule(rule);
            }
        }


        _handleRule(rule) {
            const that = this;
            const validation = rule.type;

            let func,
                wrongParameter = false;

            func = that['_' + validation];
            if (func) {
                rule.type = function (inputElement) {
                    return func.apply(that, [inputElement].concat(rule));
                };
            }
            else {
                wrongParameter = true;
            }

            if (wrongParameter) {
                throw new Error('Wrong parameter: ' + rule.type);
            }
        }

        /**
         * required rule
         */
        _required(inputElement, rule) {
            const that = this;

            switch (that._getType(inputElement)) {
                case 'smart-input-inner': {
                    let inputInsideInputElement = inputElement.querySelector('input').value;
                    if (inputInsideInputElement.length > 0) {
                        return (inputInsideInputElement.trim()) !== '';
                    }
                    break;
                }
                case 'smart-drop-down-list': {
                    let dropdownInputValue = inputElement.querySelector('input[smart-id="hiddenInput"]').value;
                    return dropdownInputValue ? dropdownInputValue.trim() !== '' : false;
                }
                case 'textarea':
                case 'password':
                case 'smart-input':
                case 'smart-text-box-element':
                case 'text':
                    return inputElement.value ? inputElement.value.trim() !== '' : false;
                case 'radio':
                case 'smart-radio-button': {
                    const inputElementsRadios = document.querySelectorAll(rule.input);
                    let validMultipleRadio = false;

                    if ((inputElementsRadios === null) || (inputElementsRadios.length <= 0)) {
                        return;
                    }

                    for (let i = 0; i < inputElementsRadios.length; i++) {
                        if (inputElementsRadios[i].checked) {
                            validMultipleRadio = true;
                        }
                    }
                    return validMultipleRadio;
                }
                case 'smart-check-box':
                case 'checkbox':
                    return inputElement.checked;
            }
            return false;
        }

        /**
         * Additional rule - notNumber 
         */
        _notNumber(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const re = /\d/;
                return !re.test(text);
            });
        }

        /**
         * Additional rule - startWithLetter
         */
        _startWithLetter(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const re = /\d/;
                return !re.test(text.substring(0, 1));
            });
        }

        /**
         * numeric rule
         */
        _numeric(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const inputElementValue = new Number(text);

                return !isNaN(inputElementValue) && isFinite(inputElementValue);
            });
        }

        /**
         * Additional rule - phone
         */
        _phone(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const phone = /^\(\d{3}\)(\d){3}-(\d){4}$/;
                return phone.test(text);
            });
        }

        /**
         * stringLength rule
         */
        _stringLength(inputElement, rule) {
            const that = this;
            let checkMin = true,
                checkMax = true;

            if (rule.min) {
                checkMin = that._minLength(inputElement, rule.min);
            }

            if (rule.max) {
                checkMax = that._maxLength(inputElement, rule.max)
            }

            return checkMin && checkMax;
        }

        /**
         * used in _stringLength rule
         */
        _maxLength(inputElement, len) {
            const that = this;

            len = parseInt(len, 10);
            return that._validateText(inputElement, function (text) {
                return text.length <= len;
            });
        }

        /**
         * used in _stringLength rule
         */
        _minLength(inputElement, len) {
            const that = this;

            len = parseInt(len, 10);
            return that._validateText(inputElement, function (text) {
                if (text) {
                    return text.length >= len;
                }
            });
        }

        /**
         * pattern rule
         */
        _pattern(inputElement, rule) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                return rule.pattern.test(text);
            });
        }

        /**
         * compare rule
         */
        _compare(inputElement, rule) {
            const that = this;
            return that._validateText(inputElement, function (text) {

                switch (rule.comparisonType) {
                    case '!=':
                        // eslint-disable-next-line
                        return text != rule.comparisonTarget(inputElement, rule);
                    case '!==':
                        return text !== rule.comparisonTarget(inputElement, rule);
                    case '<':
                        return text < rule.comparisonTarget(inputElement, rule);
                    case '<=':
                        return text <= rule.comparisonTarget(inputElement, rule);
                    case '==':
                        // eslint-disable-next-line
                        return text == rule.comparisonTarget(inputElement, rule);
                    case '===':
                        return text === rule.comparisonTarget(inputElement, rule);
                    case '>':
                        return text > rule.comparisonTarget(inputElement, rule);
                    case '>=':
                        return text >= rule.comparisonTarget(inputElement, rule);
                    default:
                        // eslint-disable-next-line
                        return text == rule.comparisonTarget(inputElement, rule);
                }

            });
        }

        /**
         * custom rule
         */
        _custom(inputElement, rule) {
            return rule.validationCallback(inputElement, rule);
        }

        /**
         * range rule
         */
        _range(inputElement, rule) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                let checkMin = true,
                    checkMax = true;

                //Compare dates
                if (typeof rule.max.getMonth === 'function') {
                    text = new Date(text);
                }

                if (rule.min) {
                    checkMin = text >= rule.min;
                }

                if (rule.max) {
                    checkMax = text <= rule.max;
                }

                return checkMin && checkMax;

            });
        }

        /**
         * email rule
         */
        _email(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return email.test(text);
            });
        }

        /**
         * Additional rule - zipCode
         */
        _zipCode(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const zip = /^(^\d{5}$)|(^\d{5}-\d{4}$)|(\d{3}-\d{2}-\d{4})$/;
                return zip.test(text);
            });
        }

        /**
         * Additional rule - ssn
         */
        _ssn(inputElement) {
            const that = this;

            return that._validateText(inputElement, function (text) {
                if (text === '')
                    return true;

                const ssn = /\d{3}-\d{2}-\d{4}/;
                return ssn.test(text);
            });
        }

        /**
         * help function for the other rules
         */
        _validateText(inputElement, condition) {
            const that = this;
            let value;

            if (that._isTextInput(inputElement)) {
                if (that._isjQWidget(inputElement)) {
                    let inputInsideInputElement = inputElement.querySelector('input');
                    if (inputInsideInputElement) {
                        inputInsideInputElement = inputInsideInputElement.value;
                        if (inputInsideInputElement.length > 0) {
                            value = inputInsideInputElement;
                        }
                        else {
                            value = inputElement.value;
                        }
                    }
                }
                else {
                    value = inputElement.value;
                }
                return condition(value);
            }
            return false;
        }

        /*
         * Method that checkes the tagname of passed as argument element and returns true if it is smart element
         * */
        _isjQWidget(inputElement) {

            if (inputElement.tagName.toLowerCase().indexOf('smart') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-input') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-password-text-box') >= 0) { //old: smart-password-input
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-complex-input') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-formatted-input') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-masked-text-box') >= 0) { //old: smart-masked-input
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-date-time-picker') >= 0) { //old: smart-date-time-input
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-numeric-text-box') >= 0) { //old: smart-number-input
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-check-box') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smart-radio-button') >= 0) {
                return true;
            }
            if (inputElement.tagName.toLowerCase().indexOf('smartcheckbox') >= 0) {
                return true;
            }

            if (inputElement.tagName.toLowerCase().indexOf('angular') >= 0) {
                return true;
            }
            return false;
        }

        /**
         * Checkes if element is text input
         */
        _isTextInput(inputElement) {
            const that = this;

            if (!inputElement) {
                return;
            }

            const type = that._getType(inputElement);
            return type === 'text' || type === 'textarea' || type === 'password' || type === 'smart-input-inner' || type === 'smart-numeric-text-box'
                || inputElement.classList.contains('smart-input')  || inputElement instanceof Smart.TextBox  || inputElement.classList.contains('smart-masked-text-box') || inputElement.classList.contains('smart-text-box') || inputElement.classList.contains('smart-date-time-picker');
        }

        /**
         * Get the types of the input element
         */
        _getType(inputElement) {

            if (!inputElement)
                return;

            const tag = inputElement.tagName.toLowerCase();

            let tagChild = tag,
                inputChild = inputElement;

            const inputElementChildInput = inputElement.querySelector('.smart-input'),
                inputChildWithInputChild = inputChild.querySelector('.smart-input'),
                inputElementTextbox = inputElement.querySelector('.smart-text-box-element'),
                inputChildTextbox = inputChild.querySelector('.smart-text-box-element');

            if ((tag) && (tag !== 'input')) {
                inputChild = inputElement.querySelector('input');
                if (inputChild) {
                    tagChild = inputChild.tagName.toLowerCase();
                }
            }

            if ((tag === 'smart-password-text-box') || (tagChild === 'smart-password-text-box')) {
                return 'password';
            }

            if ((tag === 'smart-check-box') || (tagChild === 'smart-check-box')) {
                return 'smart-check-box';
            }

            if ((tag === 'smart-radio-button') || (tagChild === 'smart-radio-button')) {
                return 'smart-radio-button';
            }

            if ((tag === 'smart-drop-down-list') || (tagChild === 'smart-drop-down-list')) {
                return 'smart-drop-down-list';
            }

            if ((tag === 'smart-numeric-text-box') || (tagChild === 'smart-numeric-text-box')) {
                return 'smart-numeric-text-box';
            }

            if ((tag === 'textarea') || (tagChild === 'textarea')) {
                return 'textarea';
            }
            else if ((inputElementChildInput) || (inputChildWithInputChild)) {
                return 'smart-input';
            }
            else if (inputElementTextbox || inputChildTextbox) {
                return 'smart-text-box-element';
            }
            else if ((inputElementChildInput && (inputElementChildInput.value) && ((inputElementChildInput.value.length) > 0))
                || (inputChildWithInputChild && (inputChildWithInputChild.value) && ((inputChildWithInputChild.value.length) > 0))
            ) {
                return 'smart-input-inner';
            }
            else if ((tag === 'input') || (tagChild === 'input')) {

                const inputChildType = inputChild.type ? inputChild.type.toLowerCase() : undefined;
                if (inputChildType) {
                    return inputChildType;
                }

                const inputType = inputElement.type ? inputElement.type.toLowerCase() : undefined;
                if (inputType) {
                    return inputType;
                }

                return 'text';
            }

            return tag;
        }

        /**
         * Manage hint for current editing rule
         */
        _higherPriorityActive(rule) {
            const that = this;
            let reach = false,
                current;

            for (let i = that.rules.length - 1; i >= 0; i -= 1) {
                current = that.rules[i];
                if (reach && current.input === rule.input && current.hint) {
                    return true;
                }
                if (current === rule) {
                    reach = true;
                }
            }
            return false;
        }

    });
