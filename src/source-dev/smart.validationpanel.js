
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/*
 * Class ValidationPanel
 * */
Smart.Utilities.Assign('ValidationPanel', class ValidationPanel {

    constructor(dataValidationModalSelector, locale = 'en', messages = '') {
        const that = this;
        
        // Sets localization settings
        that._setLocalizationSettings(locale, messages);
        
        that.dataValidationModal = document.querySelector(dataValidationModalSelector);
        that.criteriaType = {
            'Number': {
                'between': {
                    'numberOfInputs': 2,
                    'textBetweenInputs': that.messages[that.locale].andTextBetweenInput ? that.messages[that.locale].andTextBetweenInput : that.defaultMessages[that.defaultLocale].andTextBetweenInput,
                    'placeholderInput-1': '10',
                    'placeholderInput-2': '100',
                    'validationText': that.messages[that.locale].numberBetweenValidationText ? that.messages[that.locale].numberBetweenValidationText : that.defaultMessages[that.defaultLocale].numberBetweenValidationText,
                },
                'not_between': {
                    'numberOfInputs': 2,
                    'textBetweenInputs': that.messages[that.locale].andTextBetweenInput ? that.messages[that.locale].andTextBetweenInput : that.defaultMessages[that.defaultLocale].andTextBetweenInput,
                    'placeholderInput-1': '10',
                    'placeholderInput-2': '100',
                    'validationText': that.messages[that.locale].numberNotBetweenValidationText ? that.messages[that.locale].numberNotBetweenValidationText : that.defaultMessages[that.defaultLocale].numberNotBetweenValidationText,
                },
                'less_than': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberLessThanValidationText ? that.messages[that.locale].numberLessThanValidationText : that.defaultMessages[that.defaultLocale].numberLessThanValidationText,
                },
                'less_than_or_equal_to': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberLessThanOrEqualToValidationText ? that.messages[that.locale].numberLessThanOrEqualToValidationText : that.defaultMessages[that.defaultLocale].numberLessThanOrEqualToValidationText,
                },
                'greater_than': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberGreaterThanValidationText ? that.messages[that.locale].numberGreaterThanValidationText : that.defaultMessages[that.defaultLocale].numberGreaterThanValidationText,
                },
                'greater_than_or_equal_to': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberGreaterThanOrEqualToValidationText ? that.messages[that.locale].numberGreaterThanOrEqualToValidationText : that.defaultMessages[that.defaultLocale].numberGreaterThanOrEqualToValidationText,
                },
                'equal_to': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberEqualToValidationText ? that.messages[that.locale].numberEqualToValidationText : that.defaultMessages[that.defaultLocale].numberEqualToValidationText,
                },
                'not_equal_to': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '10',
                    'validationText': that.messages[that.locale].numberNotEqualToValidationText ? that.messages[that.locale].numberNotEqualToValidationText : that.defaultMessages[that.defaultLocale].numberNotEqualToValidationText,
                }
            },
            'Text': {
                'contains': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': 'Approved',
                    'validationText': that.messages[that.locale].textContainsValidationText ? that.messages[that.locale].textContainsValidationText : that.defaultMessages[that.defaultLocale].textContainsValidationText,
                },
                'does_not_contain': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': 'Approved',
                    'validationText': that.messages[that.locale].textNotContainsValidationText ? that.messages[that.locale].textNotContainsValidationText : that.defaultMessages[that.defaultLocale].textNotContainsValidationText,
                },
                'equals': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': 'Approved',
                    'validationText': that.messages[that.locale].textEqualsValidationText ? that.messages[that.locale].textEqualsValidationText : that.defaultMessages[that.defaultLocale].textEqualsValidationText,
                },
                'is_valid_email': {
                    'numberOfInputs': 0,
                    'validationText': that.messages[that.locale].textValidEmailValidationText ? that.messages[that.locale].textValidEmailValidationText : that.defaultMessages[that.defaultLocale].textValidEmailValidationText,
                },
                'is_valid_url': {
                    'numberOfInputs': 0,
                    'validationText': that.messages[that.locale].textValidUrlValidationText ? that.messages[that.locale].textValidUrlValidationText : that.defaultMessages[that.defaultLocale].textValidUrlValidationText,
                },
            },
            'Date': {
                'is_valid_date': {
                    'numberOfInputs': 0,
                    'validationText': that.messages[that.locale].dateValidDateValidationText ? that.messages[that.locale].dateValidDateValidationText : that.defaultMessages[that.defaultLocale].dateValidDateValidationText,
                },
                'equal_to': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '11/2017',
                    'validationText': that.messages[that.locale].dateEqualToValidationText ? that.messages[that.locale].dateEqualToValidationText : that.defaultMessages[that.defaultLocale].dateEqualToValidationText,
                },
                'before': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '11/2017',
                    'validationText': that.messages[that.locale].dateBeforeValidationText ? that.messages[that.locale].dateBeforeValidationText : that.defaultMessages[that.defaultLocale].dateBeforeValidationText,
                },
                'on_or_before': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '11/2017',
                    'validationText': that.messages[that.locale].dateOnOrBeforeValidationText ? that.messages[that.locale].dateOnOrBeforeValidationText : that.defaultMessages[that.defaultLocale].dateOnOrBeforeValidationText,
                },
                'after': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '11/2017',
                    'validationText': that.messages[that.locale].dateAfterValidationText ? that.messages[that.locale].dateAfterValidationText : that.defaultMessages[that.defaultLocale].dateAfterValidationText,
                },
                'on_or_after': {
                    'numberOfInputs': 1,
                    'placeholderInput-1': '11/2017',
                    'validationText': that.messages[that.locale].dateOnOrAfterValidationText ? that.messages[that.locale].dateOnOrAfterValidationText : that.defaultMessages[that.defaultLocale].dateOnOrAfterValidationText,
                },
                'between': {
                    'numberOfInputs': 2,
                    'textBetweenInputs': that.messages[that.locale].andTextBetweenInput ? that.messages[that.locale].andTextBetweenInput : that.defaultMessages[that.defaultLocale].andTextBetweenInput,
                    'placeholderInput-1': '11/2017',
                    'placeholderInput-2': '11/2018',
                    'validationText': that.messages[that.locale].dateBetweenValidationText ? that.messages[that.locale].dateBetweenValidationText : that.defaultMessages[that.defaultLocale].dateBetweenValidationText,
                },
                'not_between': {
                    'numberOfInputs': 2,
                    'textBetweenInputs': that.messages[that.locale].andTextBetweenInput ? that.messages[that.locale].andTextBetweenInput : that.defaultMessages[that.defaultLocale].andTextBetweenInput,
                    'placeholderInput-1': '11/2017',
                    'placeholderInput-2': '11/2018',
                    'validationText': that.messages[that.locale].dateNotBetweenValidationText ? that.messages[that.locale].dateNotBetweenValidationText : that.defaultMessages[that.defaultLocale].dateNotBetweenValidationText,
                }
            },
            'Boolean': {
                '': {
                    'numberOfInputs': 0,
                    'validationText': that.messages[that.locale].booleanValidationText ? that.messages[that.locale].booleanValidationText : that.defaultMessages[that.defaultLocale].booleanValidationText,
                }
            }
        };

        that._initContainers();
        that._initDataTypeCriterias();

    }

    /**
    * Detach public method for removing event listeners
    * */
    detach() {
        const that = this;
        that._removeEventListeners();
    }

    /**
     * Remove event listeners
     * */
    _removeEventListeners() {
        const that = this;

        // Detach reset form button
        that.removeValidationButton.removeEventListener('click', that.removeValidationButton['reset-validation-form']);
        delete that.removeValidationButton['reset-validation-form'];

        // Detach submit form button
        that.submitButton.removeEventListener('click', that.submitButton['submit-validation-form']);
        delete that.submitButton['submit-validation-form'];

        // Detach appearance checkbox
        that.appearanceCheckbox.removeEventListener('click', that.appearanceCheckbox['appearance-checkbox-change']);
        delete that.appearanceCheckbox['appearance-checkbox-change'];

        // Detach criteria type
        that.smartInputCriteriaType.removeEventListener('change', that.smartInputCriteriaType['criteria-type-change']);
        delete that.smartInputCriteriaType['criteria-type-change'];

        // Detach criteria
        //const criteriaClickFunction = () => that._initConditionCriterias();
        that.smartInputCriteria.removeEventListener('change', that.smartInputCriteria['criteria-change']);
        delete that.smartInputCriteria['criteria-change'];
    }


    /**
     * Set default localization settings
     */
    _setLocalizationSettings(locale, messages) {
        const that = this;

        that.locale = locale;
        that.messages = messages;

        // Sets default locale && messages
        that.defaultLocale = 'en';
        that.defaultMessages = {
            'en': {
                // Texts
                criteriaText: 'Criteria:',
                onInavlidData: 'On invalid data:',
                appearance: 'Appearance:',
                showWarning: 'Show warning',
                rejectInput: 'Reject input',
                showValidationHelpText: 'Show validation help text:',
                cancelButtonText: 'cancel',
                removeValidationButtonText: 'remove validation',
                saveButtonText: 'save',
                andTextBetweenInput: 'and',
                expectTrue: 'Expect true',
                expectFalse: 'Expect false',
                resetButtonText: 'Reset',

                //DataType Number
                NumberDataTypeText: 'Number',
                //DataType Number Conditions
                Number_between: 'between',
                Number_not_between: 'not between',
                Number_less_than: 'less than',
                Number_less_than_or_equal_to: 'less than or equal to',
                Number_greater_than: 'greater than',
                Number_greater_than_or_equal_to: 'greater than or equal to',
                Number_equal_to: 'equal to',
                Number_not_equal_to: 'not equal to',

                //DataType Text
                TextDataTypeText: 'Text',
                //DataType Text Conditions
                Text_contains: 'contains',
                Text_does_not_contain: 'does not contain',
                Text_equals: 'equals',
                Text_is_valid_email: 'is valid email',
                Text_is_valid_url: 'is valid url',

                //DataType Date
                DateDataTypeText: 'Date',
                //DataType Date Conditions
                Date_is_valid_date: 'is valid date',
                Date_equal_to: 'equal to',
                Date_before: 'before',
                Date_on_or_before: 'on or before',
                Date_after: 'after',
                Date_on_or_after: 'on or after',
                Date_between: 'between',
                Date_not_between: 'not between',

                //DataType Boolean
                BooleanDataTypeText: 'Boolean',

                //Number
                numberBetweenValidationText: 'Enter a number between',
                numberNotBetweenValidationText: 'Enter a number not between',
                numberLessThanValidationText: 'Enter a number less than',
                numberLessThanOrEqualToValidationText: 'Enter a number less than or equal to',
                numberGreaterThanValidationText: 'Enter a number greater than',
                numberGreaterThanOrEqualToValidationText: 'Enter a number greater than or equal to',
                numberEqualToValidationText: 'Enter a number equal to',
                numberNotEqualToValidationText: 'Enter a number not equal to',

                //Text
                textContainsValidationText: 'Enter text that contains',
                textNotContainsValidationText: 'Enter text that does not contain',
                textEqualsValidationText: 'Enter text that equals',
                textValidEmailValidationText: 'Enter a valid email',
                textValidUrlValidationText: 'Enter a valid url',

                //Date
                dateValidDateValidationText: 'Enter a valid date',
                dateEqualToValidationText: 'Enter a date equal to',
                dateBeforeValidationText: 'Enter a date before',
                dateOnOrBeforeValidationText: 'Enter a date on or before',
                dateAfterValidationText: 'Enter a date after',
                dateOnOrAfterValidationText: 'Enter a date on or after',
                dateBetweenValidationText: 'Enter a date between',
                dateNotBetweenValidationText: 'Enter a date not between',

                //Boolean
                booleanValidationText: 'Enter \'true\' or \'false\'',

            },
        };

        // If messages not passed - get default
        if (!that.messages) {
            that.messages = that.defaultMessages;
        }

        // If passed invalid language
        if (!that.messages[that.locale]) {
            if (that.messages[that.defaultLocale]) {
                that.locale = that.defaultLocale;
            }
            else {
                that.messages = that.defaultMessages;
                that.locale = that.defaultLocale;
            }
        }
    }

    /*
     * Returns the user generated json
     * */
    getDataValidationFormat() {
        const that = this;

        let onSubmitErrors = false;
        let selectedCriteria = that.smartInputCriteria.$.input.dataValue;
        if (!selectedCriteria) {
            selectedCriteria = that.smartInputCriteria.label;
        }

        let selectedType = '';
        if (that.smartInputCriteriaType) {
            selectedType = that.smartInputCriteriaType.$.input.dataValue;
            if (!selectedType) {
                selectedType = that.smartInputCriteriaType.label;
            }
        }

        // Get value
        let value = '';
        let textBoxValue = [];
        let textBoxes = that.inputsCriteriaContainer.querySelectorAll('smart-text-box');

        if (textBoxes) {
            for (let i = 0; i < textBoxes.length; i++) {
                textBoxValue[i] = textBoxes[i].value;
            }
        }

        if (textBoxValue[0]) {
            value = textBoxValue[0];
            if (textBoxValue[1]) {
                value = JSON.stringify({ 'from': textBoxValue[0], 'to': textBoxValue[1] });
            }
        }

        // Set red border If input is not filled OR if the dataType is number and the input hasn't numeric value
        if (that.firstTextBox) {
            that.firstTextBox.style.border = '';
            that.firstTextBox.querySelector('input.smart-input').style.border = '';
        
            if ((textBoxes.length >= 1) &&
                ((!textBoxValue[0]) || ((textBoxValue[0]) && (selectedCriteria === 'Number') && (parseFloat(textBoxValue[0]).toString() !== textBoxValue[0].toString())))
            ) {
                that.firstTextBox.style.border = '1px solid red';
                that.firstTextBox.querySelector('input.smart-input').style.border = 'none';
                onSubmitErrors = true;
            }
        }

        if (that.secondTextBox) {
            that.secondTextBox.style.border = '';
            that.secondTextBox.querySelector('input.smart-input').style.border = '';

            if ((textBoxes.length === 2) &&
                ((!textBoxValue[1]) || ((textBoxValue[1]) && (selectedCriteria === 'Number') && (parseFloat(textBoxValue[1]).toString() !== textBoxValue[1].toString())))
            ) {
                that.secondTextBox.style.border = '1px solid red';
                that.secondTextBox.querySelector('input.smart-input').style.border = 'none';
                onSubmitErrors = true;
            }
        }
        // Get value ^


        if (onSubmitErrors) {
            return '';
        }

        let showWarningRadio = that.onInvalidDataRadioOne.checked;
        let rejectInputRadio = that.onInvalidDataRadioTwo.checked;

        let validationHelpText = '';
        let showValidationHelpText = that.appearanceContainer.querySelector('.smart-checkbox-appearance').checked;
        if (showValidationHelpText) {
            validationHelpText = that.appearanceContainer.querySelector('.smart-appearance-text-box-value').value;
        }

        if (selectedCriteria === 'Boolean') {
            if (that.smartBooleanRadioYes.checked) {
                selectedType = true;
            }
            else if (that.smartBooleanRadioNo.checked) {
                selectedType = false;
            }
        }

        let result = {
            'dataType': selectedCriteria.toLowerCase(),
            'condition': selectedType,
            'value': value,
            'showWarning': showWarningRadio,
            'rejectInput': rejectInputRadio,
            'validationHelpText': validationHelpText
        }

        return JSON.stringify(result);

    }

    /**
     * Sets all the input fields to the default states
     * */
    resetDataValidationForm() {
        const that = this;

        // Reset criteria
        that.smartInputCriteria.value = that.smartInputCriterias[0].label;
        that.smartInputCriteria.label = that.smartInputCriterias[0].value;
        that.smartInputCriteria.$.input.dataValue = that.smartInputCriterias[0].value;
        let smartInputFormat = that.smartInputCriteria;

        // Remove previous choosed criteria
        smartInputFormat.$.scrollView.attached = function () {
            requestAnimationFrame(() => {
                smartInputFormat.$.scrollView.querySelector('ul li.active').classList.remove('active')
                smartInputFormat.$.scrollView.querySelector('ul li[value="' + that.smartInputCriteria.label + '"]').classList.add('active');
            });
        };

        // Reset onInvalidData
        that.onInvalidDataRadioOne.checked = true;
        that.onInvalidDataRadioTwo.checked = false;

        // Appearance checkbox
        that.appearanceCheckbox.checked = false;
        that.appearanceTextBox.classList.add('smart-hidden');
        that._resetHandler();

        that._initConditionCriterias();
    }

    /*
     * Reset the appearance textbox handler
     * */
    _resetHandler() {
        const that = this;
        if (that.resetButton) {
            that.resetButton.remove();
        }
        that.appearanceTextBox.value = that.appearanceTextBox.dataset.defaultValue;
        that.appearanceTextBox.addEventListener('keydown', () => that._showResetButton(), { 'once': true });
    }

    /**
     * Show appearance reset button
     * */
    _showResetButton() {
        const that = this;
        
        if (that.resetButton !== undefined) {
            that.resetButton.remove();
        }

        that.resetButton = document.createElement('div');
        that.resetButton.classList.add('reset-appearance');
        that.resetButton.innerHTML = that.messages[that.locale].resetButtonText ? that.messages[that.locale].resetButtonText : that.defaultMessages[that.defaultLocale].resetButtonText;
        that.resetButton.addEventListener('click', () => that._resetHandler(), { once: true });

        that.appearanceRightElementsResetContainer.appendChild(that.resetButton);
    }

    /*
     * Init all the containers
     * */
    _initContainers() {
        const that = this;

        that.dataValidationContainer = document.createElement('div');
        that.dataValidationContainer.classList.add('smart-data-validation-container');

        that.criteriaContainer = document.createElement('div');
        that.criteriaContainer.classList.add('smart-criteria-container');

        that.criteriaTypeContainer = document.createElement('div');
        that.criteriaTypeContainer.classList.add('smart-criteria-type-container');

        that.inputsCriteriaContainer = document.createElement('div');
        that.inputsCriteriaContainer.classList.add('smart-input-criteria-container');

        that.textBetweenInputsHolder = document.createElement('div');
        that.textBetweenInputsHolder.classList.add('smart-text-between-inputs-container');

        that.onInvalidDataContainer = document.createElement('div');
        that.onInvalidDataContainer.classList.add('smart-on-invalid-data-container');

        that.appearanceContainer = document.createElement('div');
        that.appearanceContainer.classList.add('smart-appearance');

        that.footerButtonsContainer = document.createElement('div');
        that.footerButtonsContainer.classList.add('smart-footer-buttons');

        that._generateStaticElements();
    }

    /**
     * Generate required static elements
     * */
    _generateStaticElements() {
        const that = this;

        // Footer buttons
        // Left Title
        let footerButtonsLeftTextContainer = document.createElement('div');
        footerButtonsLeftTextContainer.classList.add('left-title');
        that.footerButtonsContainer.appendChild(footerButtonsLeftTextContainer);

        // Right elements
        let footerButtonsRightElementsContainer = document.createElement('div');
        footerButtonsRightElementsContainer.classList.add('right-elements');
        
        //// Cancel button
        let cancelButton = document.createElement('smart-button');
        cancelButton.classList.add('smart-cancel-footer-button');
        cancelButton.innerHTML = that.messages[that.locale].cancelButtonText ? that.messages[that.locale].cancelButtonText : that.defaultMessages[that.defaultLocale].cancelButtonText;
        //Still not eventlistener
        footerButtonsRightElementsContainer.appendChild(cancelButton);
        that.footerButtonsContainer.appendChild(footerButtonsRightElementsContainer)

        //// Remove validation button
        that.removeValidationButton = document.createElement('smart-button');
        that.removeValidationButton.classList.add('smart-remove-validation-footer-button');
        that.removeValidationButton.innerHTML = that.messages[that.locale].removeValidationButtonText ? that.messages[that.locale].removeValidationButtonText : that.defaultMessages[that.defaultLocale].removeValidationButtonText;

        // Reset button click event listener
        const resetValidationFormFunction = () => that.resetDataValidationForm();
        that.removeValidationButton.addEventListener('click', resetValidationFormFunction);
        that.removeValidationButton['reset-validation-form'] = resetValidationFormFunction;
        
        footerButtonsRightElementsContainer.appendChild(that.removeValidationButton);
        that.footerButtonsContainer.appendChild(footerButtonsRightElementsContainer)

        //// Submit button
        that.submitButton = document.createElement('smart-button');
        that.submitButton.classList.add('smart-save-footer-button');
        that.submitButton.innerHTML = that.messages[that.locale].saveButtonText ? that.messages[that.locale].saveButtonText : that.defaultMessages[that.defaultLocale].saveButtonText;

        // Submit button click event listener
        const submitValidationFormFunction = () => that.getDataValidationFormat();
        that.submitButton.addEventListener('click', submitValidationFormFunction);
        that.submitButton['submit-validation-form'] = submitValidationFormFunction;

        footerButtonsRightElementsContainer.appendChild(that.submitButton);
        that.footerButtonsContainer.appendChild(footerButtonsRightElementsContainer)

        that.dataValidationModal.appendChild(that.footerButtonsContainer);

        // Appearance 
        // Left Title
        let appearanceLeftTitleTextContainer = document.createElement('div');
        appearanceLeftTitleTextContainer.classList.add('left-title');

        let appearanceText = document.createElement('div')
        appearanceText.classList.add('smart-appearance-text');
        appearanceText.innerHTML = that.messages[that.locale].appearance ? that.messages[that.locale].appearance : that.defaultMessages[that.defaultLocale].appearance;

        appearanceLeftTitleTextContainer.appendChild(appearanceText);

        // Right elements
        that.appearanceRightElementsTextContainer = document.createElement('div');
        that.appearanceRightElementsTextContainer.classList.add('right-elements');

        that.appearanceRightElementsResetContainer = document.createElement('div');
        that.appearanceRightElementsResetContainer.classList.add('right-elements-reset');

        that.appearanceCheckbox = document.createElement('smart-check-box');
        that.appearanceCheckbox.classList.add('smart-checkbox-appearance');
        that.appearanceCheckbox.innerHTML = that.messages[that.locale].showValidationHelpText ? that.messages[that.locale].showValidationHelpText : that.defaultMessages[that.defaultLocale].showValidationHelpText;;
        that.appearanceRightElementsTextContainer.appendChild(that.appearanceCheckbox);

        that.appearanceTextBox = document.createElement('smart-text-box');
        that.appearanceTextBox.classList.add('smart-appearance-text-box-value');
        that.appearanceTextBox.classList.add('smart-hidden');
        that.appearanceRightElementsResetContainer.appendChild(that.appearanceTextBox);

        // Appearance checkbox event listener
        const appearanceCheckboxChangeFunction = () => {
            that.appearanceTextBox.classList.toggle('smart-hidden');
            if (that.resetButton) {
                that.resetButton.classList.toggle('smart-hidden');
            }
        };
        that.appearanceCheckbox.addEventListener('click', appearanceCheckboxChangeFunction);
        that.appearanceCheckbox['appearance-checkbox-change'] = appearanceCheckboxChangeFunction;

        that.appearanceTextBox.addEventListener('keydown', () => that._showResetButton(), { 'once': true });

        that.appearanceContainer.appendChild(appearanceLeftTitleTextContainer);
        that.appearanceContainer.appendChild(that.appearanceRightElementsTextContainer);
        that.appearanceRightElementsTextContainer.appendChild(that.appearanceRightElementsResetContainer);
        that.dataValidationModal.appendChild(that.appearanceContainer);

        // On invelid data
        // Left Title
        let onInvalidDataSpanLeftTitleContainer = document.createElement('div');
        onInvalidDataSpanLeftTitleContainer.classList.add('left-title');

        let onInvalidDataSpan = document.createElement('div');
        onInvalidDataSpan.innerHTML = that.messages[that.locale].onInavlidData ? that.messages[that.locale].onInavlidData : that.defaultMessages[that.defaultLocale].onInavlidData;
        onInvalidDataSpanLeftTitleContainer.appendChild(onInvalidDataSpan);

        // Right elements
        let onInvalidDataRightElementsContainer = document.createElement('div');
        onInvalidDataRightElementsContainer.classList.add('right-elements');

        that.onInvalidDataRadioOne = document.createElement('smart-radio-button');
        that.onInvalidDataRadioOne.classList.add('smart-on-invalid-data-radio-button-show-warning');
        that.onInvalidDataRadioOne.checked = true;
        that.onInvalidDataRadioOne.innerHTML = that.messages[that.locale].showWarning ? that.messages[that.locale].showWarning : that.defaultMessages[that.defaultLocale].showWarning;
        
        onInvalidDataRightElementsContainer.appendChild(that.onInvalidDataRadioOne);

        that.onInvalidDataRadioTwo = document.createElement('smart-radio-button');
        that.onInvalidDataRadioTwo.classList.add('smart-on-invalid-data-radio-button-reject-input');
        that.onInvalidDataRadioTwo.innerHTML = that.messages[that.locale].rejectInput ? that.messages[that.locale].rejectInput : that.defaultMessages[that.defaultLocale].rejectInput;
        onInvalidDataRightElementsContainer.appendChild(that.onInvalidDataRadioTwo);

        that.onInvalidDataContainer.appendChild(onInvalidDataSpanLeftTitleContainer);
        that.onInvalidDataContainer.appendChild(onInvalidDataRightElementsContainer);
        that.dataValidationModal.appendChild(that.onInvalidDataContainer);
    }

    /**
     * Init all the condition values, based on choosed dataType and condition
     * */
    _initConditionValueCriterias() {
        const that = this;

        that.inputsCriteriaContainer.innerHTML = '';
        that.textBetweenInputsHolder.innerHTML = '';

        let criteria = that.smartInputCriteria.$.input.dataValue;
        if (!criteria) {
            criteria = that.smartInputCriteria.label;
        }

        let criteriaType = that.smartInputCriteriaType.$.input.dataValue;
        if (!criteriaType) {
            criteriaType = that.smartInputCriteriaType.label;
        }
        
        let criteriaTypeOption = Object.keys(that.criteriaType[criteria][criteriaType]);
        let firstPlaceholder, secondPlaceholder;

        for (let j = 0; j < criteriaTypeOption.length; j++) {
            let criteriaOptionName = criteriaTypeOption[j];
            let criteriaOptionValue = that.criteriaType[criteria][criteriaType][criteriaTypeOption[j]];

            if (criteriaOptionName === 'numberOfInputs') {
                for (let count = 0; count < criteriaOptionValue; count++) {
                    let smartTextBoxValue = document.createElement('smart-text-box');
                    smartTextBoxValue.classList.add('smart-text-box-value-' + (count + 1));

                    that.inputsCriteriaContainer.appendChild(smartTextBoxValue);
                }
            }
            else if (criteriaOptionName === 'textBetweenInputs') {
                let textBetweenInputsHolder = document.createElement('div');
                textBetweenInputsHolder.classList.add('smart-text-between-inputs');
                textBetweenInputsHolder.innerHTML = criteriaOptionValue;

                that.textBetweenInputsHolder = textBetweenInputsHolder;
            }
            else if (criteriaOptionName === 'validationText') {
                that.appearanceTextBox.value = criteriaOptionValue;
                that.appearanceTextBox.dataset.defaultValue = criteriaOptionValue;
            }
            else if (criteriaOptionName === 'placeholderInput-1') {
                firstPlaceholder = criteriaOptionValue;
            }
            else if (criteriaOptionName === 'placeholderInput-2') {
                secondPlaceholder = criteriaOptionValue;
            }
        }

        that.inputsCriteriaContainer.appendChild(that.textBetweenInputsHolder);
        that.inputCriteriaRightElements.appendChild(that.inputsCriteriaContainer);
        that.dataValidationContainer.appendChild(that.inputCriteriaRightElements);
        that.dataValidationModal.appendChild(that.dataValidationContainer);

        // Set placeholders
        that.firstTextBox = that.dataValidationModal.querySelector('.smart-text-box-value-1');
        if (that.firstTextBox) {
            that.firstTextBox.setAttribute('placeholder', firstPlaceholder);
        }
        that.secondTextBox = that.dataValidationModal.querySelector('.smart-text-box-value-2');
        if (that.secondTextBox) {
            that.secondTextBox.setAttribute('placeholder', secondPlaceholder);
        }

    }

    /**
     * Init the condition criterias, based on choosed dataType
     * */
    _initConditionCriterias() {
        const that = this;


        let criteriaValue = that.smartInputCriteria.$.input.dataValue;
        if (!criteriaValue) {
            criteriaValue = that.smartInputCriteria.label;
        }

        that.criteriaTypeContainer.innerHTML = '';
        that.inputsCriteriaContainer.innerHTML = '';
        that.textBetweenInputsHolder.innerHTML = '';

        that.smartInputCriteriaType = that.smartInputCriteriaType ? '' : '';

        if (criteriaValue === 'Boolean') {
            that.smartBooleanRadioYes = document.createElement('smart-radio-button');
            that.smartBooleanRadioYes.classList.add('smart-boolean-radio-yes');
            that.smartBooleanRadioYes.checked = true;
            that.smartBooleanRadioYes.innerHTML = that.messages[that.locale].expectTrue ? that.messages[that.locale].expectTrue : that.defaultMessages[that.defaultLocale].expectTrue;

            that.smartBooleanRadioNo = document.createElement('smart-radio-button');
            that.smartBooleanRadioNo.classList.add('smart-boolean-radio-no');
            that.smartBooleanRadioNo.innerHTML = that.messages[that.locale].expectFalse ? that.messages[that.locale].expectFalse : that.defaultMessages[that.defaultLocale].expectFalse;

            that.appearanceTextBox.value = that.criteriaType.Boolean[""].validationText;
            that.appearanceTextBox.dataset.defaultValue = that.criteriaType.Boolean[""].validationText;

            // Append elements
            that.criteriaTypeContainer.appendChild(that.smartBooleanRadioYes);
            that.criteriaTypeContainer.appendChild(that.smartBooleanRadioNo);
            that.inputCriteriaRightElements.appendChild(that.criteriaTypeContainer);
            that.dataValidationContainer.appendChild(that.inputCriteriaRightElements);
            that.dataValidationModal.appendChild(that.dataValidationContainer);

        }
        else {

            // Init criteria types
            that.smartInputCriteriaType = document.createElement('smart-input');
            that.smartInputCriteriaType.classList.add('smart-input-criteria-type');
            that.smartInputCriteriaType.dropDownButtonPosition = 'right';
            that.smartInputCriteriaType.readonly = true;
            let smartInputCriteriaTypes = [];

            // OnChange criteria type
            const criteriaTypeClickFunction = () => that._initConditionValueCriterias();
            that.smartInputCriteriaType.addEventListener('change', criteriaTypeClickFunction);
            that.smartInputCriteriaType['criteria-type-change'] = criteriaTypeClickFunction;

            for (let i = 0; i < Object.keys(that.criteriaType).length; i++) {
                if (Object.keys(that.criteriaType)[i] !== criteriaValue) {
                    continue;
                }
                let criteria = criteriaValue;
                let criteriaTypes = Object.keys(that.criteriaType[criteria]);

                for (let k = 0; k < criteriaTypes.length; k++) {
                    let criteriaType = criteriaTypes[k];
                    let criteriaLabel = criteriaType.replace(/ /g, '_');
                    let criteriaValue = that.messages[that.locale][criteria + '_' + criteriaLabel] ? that.messages[that.locale][criteria + '_' + criteriaLabel] : that.defaultMessages[that.defaultLocale][criteria + '_' + criteriaLabel];
                    smartInputCriteriaTypes.push({ value: criteriaType, label: criteriaValue});
                }
            }

            that.smartInputCriteriaType.dataSource = smartInputCriteriaTypes;
            that.smartInputCriteriaType.value = smartInputCriteriaTypes[0].label;
            that.smartInputCriteriaType.label = smartInputCriteriaTypes[0].value;

            // Append elements
            that.criteriaTypeContainer.appendChild(that.smartInputCriteriaType);
            that.inputCriteriaRightElements.appendChild(that.criteriaTypeContainer);
            that.dataValidationContainer.appendChild(that.inputCriteriaRightElements);
            that.dataValidationModal.appendChild(that.dataValidationContainer);

            // Init criteria type inputs
            that._initConditionValueCriterias();

        }

    }


    /*
     * Init the dataType criterias
     * */
    _initDataTypeCriterias() {
        const that = this;

        // Left title
        let inputCriteriaLeftTitle = document.createElement('div');
        inputCriteriaLeftTitle.classList.add('left-title');

        let inputCriteriaSpanLeftTitle = document.createElement('div');
        inputCriteriaSpanLeftTitle.classList.add('criteria-container');
        inputCriteriaSpanLeftTitle.innerHTML = that.messages[that.locale].criteriaText ? that.messages[that.locale].criteriaText : that.defaultMessages[that.defaultLocale].criteriaText;

        inputCriteriaLeftTitle.appendChild(inputCriteriaSpanLeftTitle);

        // Right elements
        that.inputCriteriaRightElements = document.createElement('div');
        that.inputCriteriaRightElements.classList.add('right-elements');

        // Init criteria
        that.smartInputCriteria = document.createElement('smart-input');
        that.smartInputCriteria.classList.add('smart-input-criteria');
        that.smartInputCriteria.dropDownButtonPosition = 'right';
        that.smartInputCriteria.readonly = true;
        that.smartInputCriterias = [];

        // OnChange criteria
        const criteriaClickFunction = () => that._initConditionCriterias();
        that.smartInputCriteria.addEventListener('change', criteriaClickFunction);
        that.smartInputCriteria['criteria-change'] = criteriaClickFunction;

        // Init criterias
        for (let i = 0; i < Object.keys(that.criteriaType).length; i++) {
            let criteria = Object.keys(that.criteriaType)[i];
            let criteriaLabel = that.messages[that.locale][criteria + 'DataTypeText'] ? that.messages[that.locale][criteria + 'DataTypeText'] : that.defaultMessages[that.defaultLocale][criteria + 'DataTypeText'];
            that.smartInputCriterias.push({ value: criteria, label: criteriaLabel });
        }

        that.smartInputCriteria.dataSource = that.smartInputCriterias;
        that.smartInputCriteria.value = that.smartInputCriterias[0].label;
        that.smartInputCriteria.label = that.smartInputCriterias[0].value;

        that.criteriaContainer.appendChild(that.smartInputCriteria);

        that.inputCriteriaRightElements.appendChild(that.criteriaContainer);
        that.dataValidationContainer.appendChild(inputCriteriaLeftTitle);
        that.dataValidationContainer.appendChild(that.inputCriteriaRightElements);

        that.dataValidationModal.appendChild(that.dataValidationContainer);
        that.dataValidationModal.style.display = 'flex';
        that.dataValidationModal.style.flexDirection = 'column-reverse';

        // Init condition criterias
        that._initConditionCriterias();

    }

});
