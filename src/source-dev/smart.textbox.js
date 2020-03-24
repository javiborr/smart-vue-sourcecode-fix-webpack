
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
* TextBox custom element.
*/
Smart('smart-text-box', class TextBox extends Smart.ComboBox {
    /** 
    * TextBox's properties 
    */
    static get properties() {
        return {
            'autoFocus': {
                value: false,
                type: 'boolean'
            },
            'autoComplete': {
                allowedValues: ['none', 'manual', 'auto', 'inline'],
                type: 'string',
                value: 'manual'
            },
            'displayMode': {
                value: 'default',
                allowedValues: ['default', 'escaped'],
                type: 'string'
            },
            'dropDownOpenMode': {
                allowedValues: ['none', 'default', 'auto'],
                value: 'default',
                type: 'string'
            },
            'enterKeyBehavior': {
                value: 'submit',
                allowedValues: ['submit', 'clearOnSubmit'],
                type: 'string'
            },
            'form': {
                value: '',
                type: 'string'
            },
            'hint': {
                value: null,
                reflectToAttribute: false,
                type: 'any'
            },
            'maxLength': {
                value: null,
                type: 'number?'
            },
            'minLength': {
                value: 2,
                type: 'number'
            },
            'messages': {
                extend: true,
                value: {
                    'en': {
                        'missingReference': '{{elementType}}: Missing reference to {{files}}.'
                    }
                },
                type: 'object'
            },
            'required': {
                value: false,
                type: 'boolean'
            },
            'requiredMessage': {
                value: '',
                type: 'string'
            },
            'selectAllOnFocus': {
                value: false,
                type: 'boolean'
            },
            'selectionMode': {
                value: 'zeroOrOne',
                allowedValues: ['none', 'oneOrManyExtended', 'zeroOrMany', 'oneOrMany', 'zeroOrOne', 'one', 'checkBox', 'radioButton'],
                type: 'string'
            },
            'type': {
                value: 'input',
                type: 'string',
                defaultReflectToAttribute: true,
                readonly: true
            },
            'value': {
                value: '',
                type: 'string'
            }
        }
    }

    /**
    * TextBox's event listeners.
    */
    static get listeners() {
        return {
            'document.up': '_documentUpHandler',
            'focus': '_focusHandler',
            'keydown': '_keyDownHandler',
            'mouseenter': '_mouseEventsHandler',
            'mouseleave': '_mouseEventsHandler',
            'input.blur': '_focusHandler',
            'input.change': '_textBoxChangeHandler',
            'input.focus': '_focusHandler',
            'input.keyup': '_textBoxKeyUpHandler',
            'input.paste': '_textBoxChangeHandler',
            'input.select': '_textBoxSelectHandler',
            'listBox.bindingComplete': '_bindingCompleteHandler'
        }
    }

    /**
    * TextBox's HTML template.
    */
    template() {
        return `<div id="container" role="presentation">
                    <span id="label" inner-h-t-m-l="[[label]]" class="smart-label"></span>
                    <div id="content" class="smart-content" role="presentation">
                        <input class="smart-input" type="text" id="input"
                            disabled="[[disabled]]"
                            maxlength="[[maxLength]]"
                            name="[[name]]"
                            placeholder="[[placeholder]]"
                            readonly="[[readonly]]"
                            role="textbox"
                            aria-label="[[placeholder]]"
                            autocomplete="[[inputPurpose]]">
                        <div id="autoCompleteString"></div>
                        <div id="dropDownContainer" class="smart-drop-down smart-drop-down-container smart-visibility-hidden" role="presentation">
                            <smart-list-box id="listBox"
                                data-source="[[dataSource]]"
                                unfocusable="true"
                                disabled="[[disabled]]"
                                display-loading-indicator="[[displayLoadingIndicator]]"
                                display-member="[[displayMember]]"
                                item-height="[[itemHeight]]"
                                item-template="[[itemTemplate]]"
                                item-measure-mode="[[itemMeasureMode]]"
                                filter-callback="[[filterCallback]]"
                                filter-mode="[[filterMode]]"
                                loading-indicator-placeholder="[[loadingIndicatorPlaceholder]]"
                                loading-indicator-position="[[loadingIndicatorPosition]]"
                                placeholder="[[dropDownPlaceholder]]"
                                readonly="[[readonly]]"
                                right-to-left="[[rightToLeft]]"
                                selection-mode="[[selectionMode]]"
                                value-member="[[valueMember]]">
                                <content></content>
                            </smart-list-box>
                        </div>
                    </div>
                    <span id="hint" class ="smart-hint"></span>
                </div>`;
    }

    /**
    * Updates the TextBox when a property is changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value. Max, min and value are of type Number. The rest are of type String.
    * @param {number/string} newValue The new entered value. Max, min and value are of type Number. The rest are of type String.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        const that = this;

        switch (propertyName) {
            case 'autoComplete':
                if (that.$.listBox._filteredItems && that.$.listBox._filteredItems.length !== that.$.listBox._items.length) {
                    super._autoComplete(true);
                }

                that._setAriaAutocomplete();
                break;

            case 'dataSource':
            case 'valueMember':
                //when selectedValues is 0 and displayMember is changed set actionButton text to default.
                that._clearSelection();

                //Check the new listBox size
                that._setDropDownSize();
                that._positionDetection.checkBrowserBounds('vertically');
                that._positionDetection.positionDropDown();
                that._positionDetection.checkBrowserBounds('horizontally');

                //Issue: When changing dataSource from property, the items are not added right away so size isnt calculated properly. Needs a new event or sth...
                //that._setDropDownSize();
                break;
            case 'displayMember':
            case 'inputMember':
                {
                    const listBox = that.$.listBox;

                    if (listBox.selectedIndexes.length) {
                        const label = listBox._items[listBox.selectedIndexes[0]][that.inputMember];

                        that.$.listBox.$.filterInput.value = label;

                        that.$.input.value = that.displayMode === 'escaped' ?
                            that._toEscapedDisplayMode(label) : that._toDefaultDisplayMode(label);
                        that.set('value', that._toDefaultDisplayMode(that.$.input.value));
                    }

                    break;
                }
            case 'displayMode':
                that.$.input.value = newValue === 'escaped' ? that._toEscapedDisplayMode(that.value) : that.value = that._toDefaultDisplayMode(that.$.input.value);
                break;
            case 'dropDownOpenMode':
                that._setFocusable();
                that.$dropDownContainer.addClass('smart-visibility-hidden');
                that.opened = false;
                break;
            case 'value':
                if (that.$.input !== document.activeElement || (that.$.input === document.activeElement && that.$.input.value === that._oldValue)) {
                    that.$.input.value = that.displayMode === 'escaped' ? that._toEscapedDisplayMode(that.value) : that.value;
                    that._oldValue = oldValue;
                }

                if (!that.value) {
                    that.clearSelection();
                }

                newValue.length > 0 ? that.$.addClass('has-value') : that.$.removeClass('has-value');
                break;
            case 'hint':
                if (newValue === null) {
                    that.$.hint.innerHTML = '';
                    that.$.removeClass('invalid');
                    return;
                }

                that._handleHintContainer();
                break;
            default:
                super.propertyChangedHandler(propertyName, oldValue, newValue);
                break;
        }
    }

    /**
    * Checks for missing modules.
    */
    static get requires() {
        return {
            'Smart.ComboBox': 'smart.combobox.js'
        }
    }

    /*
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.textbox.css'
        ]
    }

    /**
     * Opens the popup
     */
    open() {
        const that = this;

        if ((that.$.listBox.items.length === 0 && typeof that.dataSource !== 'function') || that.autoComplete === 'none') {
            return;
        }

        if (that.$.input.value.length === 0 && (that.$.listBox._filteredItems && that.$.listBox._filteredItems.length !== that.$.listBox._items.length)) {
            super._autoComplete(true);
            return;
        }

        super.open();
    }

    /**
     * Closes the popup
     */
    close() {
        const that = this;

        super.close();
        that.$.autoCompleteString.textContent = '';

        if (that.$.listBox._focusedItem) {
            that.$.listBox._focusedItem._focused = false;
        }

        if (that.autoComplete === 'none') {
            return;
        }

        if (that.$.input._filteredItems && that.$.input._filteredItems[0] && that.$.input._filteredItems[0] !== that.$.input.value) {
            super._autoComplete(true);
        }
    }

    /**
    * Creates a clone of the element.
    */
    cloneNode() {
        const that = this;

        let clone = HTMLElement.prototype.cloneNode.apply(that, Array.prototype.slice.call(arguments, 0, 1));

        if (that.$.listBox) {
            //Set only those properties that have reflectToAttribute set to false.
            clone.dataSource = that.dataSource;
        }

        return clone;
    }

    /**
     * Focus method
     */
    focus() {
        this.$.input.focus();
    }

    /**
    * Sets tab index 
    */
    _setFocusable() {
        const that = this;

        if (that.disabled || that.unfocusable) {
            that.$.input.tabIndex = -1;
            return;
        }

        that.$.input.removeAttribute('tabindex');
    }

    /**
    * Reset Method. Reset to the initialization value
    */
    reset() {
        const that = this;

        if (that.displayMode === 'escaped') {
            that.value = that._initializationValue;
            that.$.input.value = that._toEscapedDisplayMode(that._initializationValue);
        }
        else {
            that.$.input.value = that.value = that._initializationValue;
        }

        if (!that.value && that.$.listBox) {
            that.clearSelection();
        }
    }

    /**
   * BindingComplete event Handler. When the dataSource or size of listBox is changed.
   */
    _bindingCompleteHandler() {
        const that = this;

        if (!that.$.listBox) {
            return;
        }

        if (that.isRendered) {
            that._setDropDownSize();
            that._positionDetection.checkBrowserBounds();
        }
    }

    /**
 * TextBox create method.
 */
    _createElement() {
        const that = this;

        that._browserIsIEorEdge = Smart.Utilities.Core.Browser.IE || Smart.Utilities.Core.Browser.Edge;

        if (that.autoFocus) {
            that.$.input.focus();
        }

        if (that.value) {
            that.$.input.value = that.displayMode === 'escaped' ? that._toEscapedDisplayMode(that.value) : that.value;
        }

        that._setDropDownSize();
        that._handleSelectedText();
        that._setFocusable();
        that._initializationValue = that._oldValue = that.value;
        that.value.length > 0 ? that.$.addClass('has-value') : that.$.removeClass('has-value');
        that._handleHintContainer();

        that._setAriaRelations();
    }

    /**
    * Focus handler. Selects whole text in element's text area on selectAllOnFocus: true
    */
    _focusHandler(event) {
        const that = this;

        if (event.type === 'blur') {
            if (that._isDropDownClicked) {
                return;
            }

            that.removeAttribute('focus');
            that.$.autoCompleteString.textContent = '';
            that.value.length > 0 ? that.$.addClass('has-value') : that.$.removeClass('has-value');

            if ((that.autoComplete === 'auto' || that.autoComplete === 'inline') && that.$.input.value.length > 0 &&
                that.$.listBox._focusedItem && that.$.listBox._focusedItem._focused) {
                that.$.input.value = that.$.listBox._focusedItem[that.inputMember];
            }

            if (!that._preventDropDownClose) {
                that.close();
            }

            if (that._oldValue !== that.value) {
                that.$.fireEvent('change', { 'oldValue': that._oldValue, 'value': that.value });
            }
            return;
        }

        if (that.disabled) {
            return;
        }

        that.setAttribute('focus', '');
        that._oldValue = that.value;

        if (that.selectAllOnFocus) {
            that.$.input.select();
        }
    }

    /**
    * TextBox container mouse enter/leave events handler.
    */
    _handlePointerInEscapedSymbol(direction) {
        const that = this;

        if (that.displayMode !== 'escaped') {
            return;
        }

        let selectionStart = that.$.input.selectionStart,
            selectionEnd = that.$.input.selectionEnd,
            value = that.$.input.value;

        if (value[selectionStart - 1] !== '\\') {
            return;
        }

        if (!value[selectionStart].match(/n|r|s|t|f/g)) {
            return;
        }

        if (selectionStart === selectionEnd) {
            let pointerPositionModifier = direction === 'next' ? 1 : -1;
            that.$.input.selectionStart = selectionStart + pointerPositionModifier;
            that.$.input.selectionEnd = selectionStart + pointerPositionModifier;
            return;
        }
        else {
            that.$.input.selectionStart = selectionStart - 1;
        }

        if (value[selectionEnd - 1] !== '\\') {
            return;
        }

        if (!value[selectionEnd].match(/n|r|s|t|f/g)) {
            return;
        }

        that.$.input.selectionEnd = selectionEnd + 1;
    }

    /**
     * Handles Text selection
     */
    _handleSelectedText() {
        const that = this;

        if (that.selectionStart === null || that.selectionEnd === null || that.selectionStart === that.selectionEnd || that.selectAllOnFocus) {
            return;
        }

        that.selectionStart = that.selectionStart < 0 ? 0 : that.selectionStart;
        that.selectionEnd = that.selectionEnd > that.value.length ? that.value.length : that.selectionEnd;

        that.$.input.setSelectionRange(that.selectionStart, that.selectionEnd);
    }

    /**
     * Handles the Hint
     */
    _handleHintContainer() {
        const that = this;

        if (!that.hint) {
            return;
        }

        const container = that.$.hint;

        if (typeof that.hint === 'function') {
            const value = that.value,
                invalid = that.hint(value, container);

            invalid ? that.$.addClass('invalid') : that.$.removeClass('invalid');
        }
        else if (typeof that.hint === 'string') {
            container.innerHTML = that.hint;
            that.$.removeClass('invalid');
        }
    }

    /**
    * keyDown event handler.
    */
    _keyDownHandler(event) {
        const that = this;

        function replaceEscapedKeyWith(newValue) {
            let selectionStart = that.$.input.selectionStart,
                selectionEnd = that.$.input.selectionEnd,
                value = that.$.input.value;

            event.preventDefault();
            value = value.substring(0, selectionStart) + newValue + value.substring(selectionEnd, value.length);
            that.value = that._toDefaultDisplayMode(value);
            that.$.input.value = value;
            that.$.input.selectionStart = that.$.input.selectionEnd = selectionStart + 2;
        }

        that._showAutoCompleteHighlighter = false;

        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                if (event.altKey) {
                    event.preventDefault();
                    if (event.key === 'ArrowDown') {
                        that.open();
                    }
                    else {
                        that.close();
                    }

                    return;
                }

                if (that.opened) {
                    event.preventDefault();
                    that.$.listBox._handleKeyStrokes(event.key);

                    if (that.autoComplete !== 'inline') {
                        break;
                    }

                    that._showAutoCompleteHighlighter = true;
                    super._updateAutoCompleteHelper();
                }

                break;
            case 'PageUp':
            case 'PageDown':
                event.preventDefault();
                that.$.input.selectionStart = that.$.input.selectionEnd = event.key === 'PageUp' ? 0 : that.$.input.value.length;
                break;
            case 'Enter':
                if (that.opened && that.$.listBox._focusedItem && that.$.listBox._focusedItem._focused) {
                    that.$.listBox.$.filterInput.value = that.$.listBox._focusedItem[that.inputMember];
                    that.$.input.value = that.displayMode === 'escaped' ?
                        that._toEscapedDisplayMode(that.$.listBox._focusedItem[that.inputMember]) : that._toDefaultDisplayMode(that.$.listBox._focusedItem[that.inputMember]);
                    that.select(that.$.listBox._focusedItem);
                    that.close();
                }

                if (that.enterKeyBehavior !== 'default') {
                    const value = that.$.input.value;

                    if (that._oldValue !== value) {
                        event.preventDefault();
                        that.$.fireEvent('change', {
                            'oldValue': that._oldValue,
                            'value': value,
                            'type': 'submit'
                        });

                        if (that.enterKeyBehavior === 'clearOnSubmit') {
                            if (Smart.MaskedTextBox && (that instanceof Smart.MaskedTextBox)) {
                                that._cleanMask();
                                that._setMaskToInput();
                                that.$.input.selectionStart = that.$.input.selectionEnd = 0;
                            }
                            else {
                                that.$.input.value = '';
                            }
                        }

                        that._oldValue = that.value = that._toDefaultDisplayMode(that.$.input.value);
                    }

                    that._submitted = true;
                }
                break;
            case 'Escape':
                if (that.$.dropDownContainer) {
                    that.close();
                }

                that._closedFromKeyCombination = true;

                if (that.escKeyMode === 'none') {
                    return;
                }

                switch (that.escKeyMode) {
                    case 'none':
                        break;
                    case 'clearValue':
                        that.value = that.$.input.value = '';
                        break;
                    case 'previousValue':
                        that.$.input.value = that.displayMode === 'escaped' ? that._toEscapedDisplayMode(that._oldValue) : that._oldValue;
                        break;
                }

                break;
            case ' ':
                if (that.displayMode === 'escaped') {
                    replaceEscapedKeyWith('\\s');
                }

                break;
            case 'Backspace':
                if (that.displayMode === 'escaped' && that.$.input.selectionStart === that.$.input.selectionEnd) {
                    let carretPosition = that.$.input.selectionStart;

                    if (that.$.input.value[carretPosition - 2] === '\\' &&
                        (that.$.input.value[carretPosition - 1] === 's' || that.$.input.value[carretPosition - 1] === 'n')) {
                        that.$.input.value = that.$.input.value.substring(0, carretPosition - 2) +
                            that.$.input.value.substring(carretPosition - 2, that.$.input.value.length);
                        that.$.input.selectionStart = carretPosition - 2;
                    }
                }

                break;
        }
    }

    /**
     * Pre-defined ComboBox keyUpHandler
     */
    _keyUpHandler(event) {
        const that = this;

        if (that.disabled || event.key === 'Escape' || event.target === that.$.listBox.$.filterInput) {
            return;
        }

        if (event.target === that.$.input && that.selectionMode === 'oneOrManyExtended') {
            that.$.listBox._keysPressed[event.key] = false;
        }
    }

    /**
     * ListItem click event handler
     * @param {any} event
     */
    _listBoxItemClickHandler(event) {
        const that = this,
            eventDetails = event.detail;

        super._listBoxItemClickHandler(event);

        if (eventDetails.selected) {
            if (that.displayMode === 'escaped') {
                const originalValue = that.$.input.value;

                that.value = that._toDefaultDisplayMode(originalValue);
                that.$.input.value = originalValue;
            }
            else {
                that.value = that.$.input.value;
            }

            if (that._oldValue !== that.value) {
                that.$.fireEvent('change', { 'oldValue': that._oldValue, 'value': that.value });
                that.$.input.focus();
            }
        }
    }

    _submitKeyUpHandler() {
        const that = this;

        if (that._submitted) {
            if (that.enterKeyBehavior === 'clearOnSubmit') {
                that.$.input.selectionStart = that.$.input.selectionEnd = 0;
            }

            that._submitted = false;
        }
    }

    /**
    * TextBox keyUp event handler.
    */
    _textBoxKeyUpHandler(event) {
        const that = this;

        if (that.disabled || event.altKey || event.ctrlKey) {
            return;
        }

        if (that.displayMode === 'escaped') {
            const originalValue = that.$.input.value;

            that.value = that._toDefaultDisplayMode(that.$.input.value);
            that.$.input.value = originalValue;
        }
        else {
            that.value = that.$.input.value;
        }

        let selectedItem;

        if (that.$.listBox.selectedIndexes.length === 1) {
            selectedItem = that.$.listBox.getItem(that.$.listBox.selectedValues[0]);

            if (that.value !== selectedItem[that.inputMember]) {
                that.unselect(selectedItem);
            }
        }

        if (!that._showAutoCompleteHighlighter) {
            that.$.autoCompleteString.textContent = '';
        }

        if (event.key === 'Alt' || event.key === 'Control' || (!that.opened && event.key === 'Escape') || event.key === 'Enter') {
            that._closedFromKeyCombination = false;
            return;
        }

        if (event.key && event.key.indexOf('Arrow') > -1) {
            that._handlePointerInEscapedSymbol(event.key === 'ArrowRight' ? 'next' : undefined);
            return;
        }

        if (that.autoComplete !== 'none' && (that.$.input.value.length > 0 || that.dropDownOpenMode === 'auto')) {
            const autoComplete = super._autoComplete.bind(that);

            if (that._autoCompleteTimer) {
                clearTimeout(that._autoCompleteTimer);
            }

            if (that.$.listBox._items.length === 0 && typeof that.dataSource !== 'function') {
                that.close();
                return;
            }

            that._autoCompleteTimer = setTimeout(function () {
                autoComplete(true);
            }, that.autoCompleteDelay);
        }
        else {
            that.close();
        }

        if (event.key === 'Enter' && that.value !== that.value && that._browserIsIEorEdge) {
            that.value = that.$.input.value;
            that.$.fireEvent('change', { 'oldValue': that._oldValue, 'value': that.value });
        }
    }

    /**
   * ListBox drop down change event handler.
   */
    _listBoxChangeHandler(event) {
        const that = this;

        //Stop listBox's change event. TextBox will throw it's own 'change' event
        event.stopPropagation();

        if (event.detail.selected) {
            const label = that.$.listBox._items[event.detail.index][that.inputMember];

            that.$.listBox.$.filterInput.value = label;

            that.$.input.value = that.displayMode === 'escaped' ?
                that._toEscapedDisplayMode(label) : that._toDefaultDisplayMode(label);
            that.set('value', that._toDefaultDisplayMode(that.$.input.value));
        }

        if (that.autoComplete !== 'none' && typeof that.dataSource !== 'function') {
            that._autoComplete(true);
        }
    }

    /**
    * TextBox container mouse enter/leave events handler.
    */
    _mouseEventsHandler(event) {
        const that = this;

        event.type === 'mouseenter' ? that.setAttribute('hover', '') : that.removeAttribute('hover');
    }

    /**
    * TextBox change handler.
    */
    _textBoxChangeHandler(event) {
        const that = this;

        event.stopPropagation();

        if (that.displayMode === 'escaped') {
            const originalValue = that.$.input.value,
                selectionStart = that.$.input.selectionStart,
                selectionEnd = that.$.input.selectionEnd,
                clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData) || window.clipboardData;

            if (clipboardData) {
                let clipboardValue = clipboardData.getData('text'),
                    value = that.$.input.value;

                event.preventDefault();
                clipboardValue = that._toEscapedDisplayMode(clipboardValue);
                that.$.input.value = value.substring(0, selectionStart) + clipboardValue + value.substring(selectionEnd, value.length);
            }

            that.value = that._toDefaultDisplayMode(that.$.input.value);
            that.$.input.value = originalValue;
        }
        else {
            that.value = that.$.input.value;
        }

        that._handleHintContainer();
    }

    /**
    * TextBox test select handler.
    */
    _textBoxSelectHandler() {
        const that = this;

        if (that.disabled) {
            return;
        }

        that.selectionStart = that.$.input.selectionStart;
        that.selectionEnd = that.$.input.selectionEnd;
    }

    /**
    * Escapes special characters in the string.
    */
    _toEscapedDisplayMode(str) {
        const keyValuePairs = [
            { key: /\r\n|\n\r|\n|\r/g, value: '\\n' },
            { key: /\s/g, value: '\\s' },
            { key: /\n/g, value: '\\n' },
            { key: /\t/g, value: '\\t' },
            { key: /\f/g, value: '\\f' },
            { key: /\r/g, value: '\\r' }
            /*{ key: /\\/g, value: '\\\\' }*/
        ];

        for (let i = 0; i < keyValuePairs.length; i++) {
            str = str.replace(keyValuePairs[i].key, keyValuePairs[i].value)
        }

        return str;
    }

    /**
    * Reverts escaped characters.
    */
    _toDefaultDisplayMode(str) {
        if (!str) {
            str = '';
        }

        const keyValuePairs = [
            { key: /\\s/g, value: ' ' },
            { key: /\\n/g, value: '\n' },
            { key: /\\t/g, value: '\t' },
            { key: /\\f/g, value: '\f' },
            { key: /\\r/g, value: '\r' }
            /*{ key: /\\\\[^n{1}|^s{1}|^t{1}|^f{1}|^r{1}]/g, value: '\\' }*/
        ];

        for (let i = 0; i < keyValuePairs.length; i++) {
            str = str.replace(keyValuePairs[i].key, keyValuePairs[i].value)
        }

        return str;
    }

    /**
    * Document mouse down event handler.
    */
    _documentDownHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        let target = event.originalEvent.target;

        if (that.enableShadowDOM) {
            target = event.originalEvent.composedPath()[0];

            if (that._dropDownParent === null) {
                that._isDropDownClicked = target.closest('.smart-drop-down-container') === that.$.dropDownContainer;
            }
            else {
                let rootElement = target.getRootNode().host;

                if (rootElement && rootElement.closest('.smart-drop-down-container') === that.$.dropDownContainer) {
                    that._isDropDownClicked = true;
                }
            }
        }
        else {
            that._isDropDownClicked = target.closest('.smart-drop-down-container') === that.$.dropDownContainer;
        }

        const listItem = event.originalEvent.target.closest('smart-list-item');

        if (listItem || that._isDropDownClicked) {
            that._preventDropDownClose = true;
        }
    }

    /**
    * Predefines the method form the DropDownList Base Class
    **/
    _documentMoveHandler() {
    }

    /**
    * Document Up event handler.
    */
    _documentUpHandler(event) {
        const that = this;

        if (that.disabled) {
            return;
        }

        let target = that.enableShadowDOM ? event.originalEvent.composedPath()[0] : event.originalEvent.target;

        if (!target) {
            return;
        }

        if (that.displayMode === 'escaped' && target === that.$.input) {
            that._handlePointerInEscapedSymbol();
        }

        if (that._isDropDownClicked || that.readonly) {
            delete that._isDropDownClicked;
            return;
        }

        if (target === that.$.input && that.dropDownOpenMode === 'auto') {
            super._autoComplete(true);
            return;
        }

        while (target) {
            if (target instanceof Smart.ListItem && target.ownerListBox === that.$.listBox) {
                if (target.unselectable || target.disabled) {
                    return;
                }

                if (that.displayMode === 'escaped') {
                    that.value = target[that.inputMember];
                    that.$.input.value = that._toEscapedDisplayMode(target[that.inputMember]);
                }
                else {
                    that.$.input.value = that.value = target[that.inputMember];
                }

                that.$.fireEvent('change', {
                    'oldValue': that._oldValue,
                    'value': that.value,
                    'type': 'submit'
                });

                that._oldValue = that.value;
                (that.enterKeyBehavior === 'clearOnSubmit') && (that.$.input.value = that.value = '');

                super._autoComplete(true);
                that.close();
                target = 'item';
                that.$.input.focus();
                return;
            }
            else if (target === that.$.listBox) {
                target = 'listBox';
                return;
            }

            target = target.parentElement;
        }

        if (target !== 'listBox' && target !== 'item') {
            that.close();
            return;
        }
    }
});