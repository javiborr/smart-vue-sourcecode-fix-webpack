
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * GridPanel custom element.
 */
Smart('smart-grid-panel', class GridPanel extends Smart.BaseElement {
    // GridPanel's properties.
    static get properties() {
        return {
            'closeButtonPosition': {
                value: 'left',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'messages': {
                value: {
                    'en': {
                        'apply': 'Apply',
                        'booleanFirst': '☐',
                        'booleanLast': '☑',
                        'cancel': 'Cancel',
                        'dateFirst': '1',
                        'dateLast': '9',
                        'from': 'from',
                        'numberFirst': '1',
                        'numberLast': '9',
                        'stringFirst': 'A',
                        'stringLast': 'Z',
                        'thenBy': 'then by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * GridPanel's event listeners.
     */
    static get listeners() {
        return {
            'change': '_changeHandler',
            'click': '_clickHandler',
            'keydown': '_keydownHandler',
            'sortable.dragEnd': '_sortableDragEndHandler'
        };
    }

    /**
     * GridPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Input': 'smart.input.js',
            'Smart.Sortable': 'smart.sortable.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * GridPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <smart-sortable id="sortable" animation="[[animation]]" disabled="[[readonly]]" right-to-left="[[rightToLeft]]" 
                            drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]">
                    </smart-sortable>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <smart-input id="inputNotSorted" right-to-left="[[rightToLeft]]" animation="[[animation]]" readonly theme="[[theme]]"></smart-input>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        if (that.closeButtonPosition === 'right') {
            that.$.sortable.handlePosition = 'left';
        }

        that._localize();
        that._createSources();

        super.render();
    }

    /**
    * Updates the GridPanel when a property is  changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value.
    * @param {number/string} newValue The new entered value.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'animation':
            case 'theme': {
                const inputs = Array.from(that.$.sortable.getElementsByTagName('smart-input'));

                inputs.forEach(input => input[propertyName] = newValue);
                break;
            }
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'closeButtonPosition':
                if (that.closeButtonPosition === 'right') {
                    that.$.sortable.handlePosition = 'left';
                }
                else {
                    that.$.sortable.handlePosition = 'right';
                }

                break;
            case 'dataSource':
                that.$.sortable.$.container.innerHTML = '';
                that._createSources();
                break;
            case 'locale':
            case 'messages': {
                const items = that.$.sortable._items;

                that._localize();

                if (items.length) {
                    items[0].children[1].innerHTML = that.localize('firstBy');

                    items.forEach(function (item, index) {
                        if (index !== 0) {
                            item.children[1].innerHTML = that.localize('thenBy');
                        }

                        const itemInfo = that._HTMLToSourceMap.get(item),
                            ascDescTemplates = that._ascDescTemplates[itemInfo.dataType] || that._ascDescTemplates.string;

                        item.children[3].innerHTML = that.localize('from');
                        item.children[4].firstElementChild.innerHTML = ascDescTemplates[0];
                        item.children[4].children[1].innerHTML = ascDescTemplates[1];
                    });
                }

                break;
            }
            case 'maxLevel':
                if (newValue !== undefined && newValue !== null) {
                    while (that.$.sortable._items.length > 0 && that.$.sortable._items.length > newValue) {
                        that._interactionHandler(that.$.sortable._items[that.$.sortable._items.length - 1].firstElementChild);
                    }
                }

                that._disableItemAddition();
                break;
            case 'rightToLeft':
                that.$.inputNotSorted.rightToLeft = newValue;
                that.$.inputNotSorted.dropDownButtonPosition = newValue ? 'left' : 'right';
                that.$.sortable._items.forEach(item => {
                    const input = item.querySelector('smart-input');

                    input.rightToLeft = newValue;
                    input.dropDownButtonPosition = newValue ? 'left' : 'right';
                });
                break;
        }
    }

    /**
     * change handler.
     */
    _changeHandler(event) {
        const that = this,
            target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (that.$.inputNotSorted.contains(target)) {
            const value = that.$.inputNotSorted.value,
                newInfo = that._labelToSourceMap.get(value);

            that._createSortItem(newInfo, that.$.sortable._items.length);
            that.$.sortable.updateItems();
            that._visibleLabels.push(value);
            that._updateHiddenSource();
            that._disableItemAddition();
            that.$.inputNotSorted.value = '';
            return;
        }

        const input = target.closest('smart-input');

        if (!input) {
            return;
        }

        const sortItem = input.parentElement.parentElement,
            sortAsc = sortItem.children[4].firstElementChild,
            sortDesc = sortItem.children[4].children[1],
            value = input.value,
            oldValue = that._HTMLToSourceMap.get(sortItem).label,
            newInfo = that._labelToSourceMap.get(value),
            ascDescTemplates = that._ascDescTemplates[newInfo.dataType] || that._ascDescTemplates.string;

        that._HTMLToSourceMap.set(sortItem, newInfo);
        that._visibleLabels.splice(that._visibleLabels.indexOf(oldValue), 1, value);
        that._updateHiddenSource();

        sortAsc.innerHTML = ascDescTemplates[0];
        sortDesc.innerHTML = ascDescTemplates[1];

        if (!newInfo.sortDirection || newInfo.sortDirection.indexOf('asc') !== -1) {
            sortAsc.classList.add('selected');
            sortDesc.classList.remove('selected');
        }
        else {
            sortDesc.classList.add('selected');
            sortAsc.classList.remove('selected');
        }
    }

    /**
     * Updates the list of unsorted columns.
     */
    _updateHiddenSource() {
        const that = this;

        that._hiddenSource = that.dataSource.map(item => {
            return { label: item.label, value: item.dataField, icon: item.icon };
        }).filter(item => that._visibleLabels.indexOf(item.label) === -1);
        that.$.inputNotSorted.dataSource = that._hiddenSource;
        that.$.sortable._items.forEach(item => item.getElementsByTagName('smart-input')[0].dataSource = that._hiddenSource);
        that._disableItemAddition();
    }

    /**
     * click handler.
     */
    _clickHandler(event) {
        const that = this;

        that._interactionHandler(that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target, event);
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(target, event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return true;
        }

        const sortItem = target.closest('.smart-grid-panel-item');

        if (sortItem) {
            if (target === sortItem.firstElementChild) {
                // close button is clicked
                const itemInfo = that._HTMLToSourceMap.get(sortItem),
                    label = itemInfo.label;

                that.$.sortable.$.container.removeChild(sortItem);
                that.$.sortable.updateItems();

                that._visibleLabels.splice(that._visibleLabels.indexOf(label), 1);
                that._updateHiddenSource();
                that._disableItemAddition();

                if (that.$.sortable._items.length) {
                    that.$.sortable._items[0].children[1].innerHTML = that.localize('firstBy');
                }
            }
            else if (sortItem.children[4].contains(target)) {
                // sort direction buttons are clicked
                const sortAsc = sortItem.children[4].firstElementChild,
                    sortDesc = sortItem.children[4].children[1];

                if (event.type === 'click') {
                    if (!target.classList.contains('selected')) {
                        if (target === sortAsc) {
                            sortDesc.classList.remove('selected');
                            sortAsc.classList.add('selected');
                            that._HTMLToSourceMap.get(sortItem).sortDirection = 'ascending';
                        }
                        else if (target === sortDesc) {
                            sortAsc.classList.remove('selected');
                            sortDesc.classList.add('selected');
                            that._HTMLToSourceMap.get(sortItem).sortDirection = 'descending';
                        }
                    }
                }
                else {
                    sortAsc.classList.toggle('selected');
                    sortDesc.classList.toggle('selected');
                    that._HTMLToSourceMap.get(sortItem).sortDirection = sortAsc.classList.contains('selected') ? 'ascending' : 'descending';
                }
            }

            return true;
        }

        if (target === that.$.buttonsContainer.firstElementChild) {
            // "Cancel" button is clicked
            that.$.fireEvent('cancel');
            return true;
        }

        if (target === that.$.buttonsContainer.children[1]) {
            // "Apply" button is clicked
            const value = [],
                sortByInfo = { dataFields: [], dataTypes: [], orderBy: [] },
                detail = { value: value };

            that.$.sortable._items.forEach(item => {
                const itemInfo = that._HTMLToSourceMap.get(item);

                value.push({ dataField: itemInfo.dataField, sortDirection: itemInfo.sortDirection });
                sortByInfo.dataFields.push(itemInfo.dataField);
                sortByInfo.dataTypes.push(itemInfo.dataType);
                sortByInfo.orderBy.push(itemInfo.sortDirection);
            });

            if (that instanceof Smart.SortPanel) {
                detail.sortByInfo = sortByInfo;
            }

            that.$.fireEvent('apply', detail);
            return true;
        }
    }

    /**
     * keydown handler.
     */
    _keydownHandler(event) {
        const that = this,
            key = event.key;

        if (key === ' ' || key === 'Enter') {
            event.preventDefault();
            that._interactionHandler((that.shadowRoot || that.getRootNode()).activeElement, event);
        }
    }

    /**
     * sortable dragEnd handler.
     */
    _sortableDragEndHandler(event) {
        const that = this,
            oldIndex = event.detail.oldIndex,
            newIndex = event.detail.newIndex,
            maxIndex = Math.max(oldIndex, newIndex),
            items = that.$.sortable._items;

        if ((oldIndex && newIndex) === 0) {
            items[0].children[1].innerHTML = that.localize('firstBy');
            items[1].children[1].innerHTML = that.localize('thenBy');

            if (maxIndex > 1) {
                items[maxIndex].children[1].innerHTML = that.localize('thenBy');
            }
        }
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        const that = this;

        that.$.inputNotSorted.placeholder = that.localize('pickAnother');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');

        that._ascDescTemplates = {
            boolean: [that.localize('booleanFirst') + ' → ' + that.localize('booleanLast'), that.localize('booleanLast') + ' → ' + that.localize('booleanFirst')],
            date: [that.localize('dateFirst') + ' → ' + that.localize('dateLast'), that.localize('dateLast') + ' → ' + that.localize('dateFirst')],
            number: [that.localize('numberFirst') + ' → ' + that.localize('numberLast'), that.localize('numberLast') + ' → ' + that.localize('numberFirst')],
            string: [that.localize('stringFirst') + ' → ' + that.localize('stringLast'), that.localize('stringLast') + ' → ' + that.localize('stringFirst')]
        };
    }

    /**
     * Gets items collection.
     */
    _createSources() {
        const that = this,
            positioningIndex = (that instanceof Smart.SortPanel ? 'sort' : 'group') + 'Index',
            visible = [],
            visibleLabels = [];

        that._HTMLToSourceMap = new Map();
        that._labelToSourceMap = new Map();

        that.dataSource.forEach((item) => {
            that._labelToSourceMap.set(item.label, item);

            if (item[positioningIndex] !== -1 && item[positioningIndex] !== undefined) {
                visible.push(item);
            }
        });

        visible.sort((a, b) => a[positioningIndex] - b[positioningIndex]);

        if (that.maxLevel !== undefined && that.maxLevel !== null) {
            while (visible.length > 0 && visible.length > that.maxLevel) {
                visible.pop();
            }
        }

        that.$.inputNotSorted.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        visible.forEach(item => visibleLabels.push(item.label));
        that._visibleLabels = visibleLabels;
        that._updateHiddenSource();
        visible.forEach((item, index) => {
            that._createSortItem(item, index);
        });
        that.$.sortable.updateItems();
        that._disableItemAddition();
        that._setFocusable();
    }

    /**
     * Creates a sort item.
     */
    _createSortItem(item, index) {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            sortItem = document.createElement('div'),
            ascDescTemplates = that._ascDescTemplates[item.dataType] || that._ascDescTemplates.string;

        sortItem.className = 'smart-grid-panel-item';

        sortItem.innerHTML = `<div class="smart-grid-panel-item-close-button" tabindex="${tabindex}" role="button" aria-label="Close"></div>
<div class="smart-grid-panel-label-by smart-unselectable" role="presentation">${that.localize(index > 0 ? 'thenBy' : 'firstBy')}</div>
<div class="smart-grid-panel-field-container" role="presentation"><smart-input class="smart-grid-panel-field-selection" value="${item.label}" animation="${that.animation}" readonly theme="${that.theme}" aria-label="Field name"></smart-input></div>
<div class="smart-grid-panel-from smart-unselectable" role="presentation">${that.localize('from')}</div >
<div class="smart-grid-panel-direction smart-unselectable" tabindex="${tabindex}" role="presentation">
    <div class="smart-grid-panel-asc" role="button" aria-label="Ascending">${ascDescTemplates[0]}</div >
    <div class="smart-grid-panel-desc" role="button" aria-label="Descending">${ascDescTemplates[1]}</div>
</div>
`;
        const inputElement = sortItem.querySelector('smart-input');

        inputElement.dataSource = that._hiddenSource;
        inputElement.rightToLeft = that.rightToLeft;
        inputElement.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';

        that.$.sortable.$.container.appendChild(sortItem);

        inputElement.tabIndex = tabindex;

        if (!item.sortDirection || item.sortDirection.indexOf('asc') !== -1) {
            item.sortDirection = 'ascending';
            sortItem.children[4].firstElementChild.classList.add('selected');
        }
        else {
            sortItem.children[4].children[1].classList.add('selected');
        }

        that._HTMLToSourceMap.set(sortItem, item);
    }

    /**
     * Disables or enables item addition.
     */
    _disableItemAddition() {
        const that = this,
            maxLevel = that.maxLevel,
            disabled = that._hiddenSource.length === 0 ||
                maxLevel !== undefined && maxLevel !== null &&
                Math.max(0, maxLevel) === that.$.sortable._items.length;

        that.$.inputNotSorted.disabled = disabled;

        if (disabled) {
            that.$.inputNotSorted.removeAttribute('focus');
        }
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            closeButtons = Array.from(that.getElementsByClassName('smart-grid-panel-item-close-button')),
            directions = Array.from(that.getElementsByClassName('smart-grid-panel-direction')),
            inputs = Array.from(that.getElementsByTagName('input')),
            allFocusable = closeButtons.concat(directions).concat(inputs);

        that.$.buttonsContainer.firstElementChild.tabIndex = tabindex;
        that.$.buttonsContainer.children[1].tabIndex = tabindex;
        allFocusable.forEach(element => element.tabIndex = tabindex);
    }
});

/**
 * SortPanel custom element.
 */
Smart('smart-sort-panel', class SortPanel extends Smart.GridPanel {
    // SortPanel's properties.
    static get properties() {
        return {
            'messages': {
                value: {
                    'en': {
                        'firstBy': 'Sort by',
                        'noSorting': 'No sorting applied',
                        'pickAnother': 'Pick another field to sort by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
  * CSS files needed for the element (ShadowDOM)
  */
    static get styleUrls() {
        return [
            'smart.textbox.css'
        ]
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        super._localize();

        const that = this;

        that.$.sortable.$.container.setAttribute('no-sorting', that.localize('noSorting'));
    }
});

/**
 * GroupPanel custom element.
 */
Smart('smart-group-panel', class GroupPanel extends Smart.GridPanel {
    // GroupPanel's properties.
    static get properties() {
        return {
            'maxLevel': {
                value: 8,
                type: 'number?'
            },
            'messages': {
                value: {
                    'en': {
                        'collapseAll': 'Collapse all',
                        'expandAll': 'Expand all',
                        'firstBy': 'Group by',
                        'noGrouping': 'No grouping',
                        'pickAnother': 'Pick another field to group by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * GroupPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <smart-sortable right-to-left="[[rightToLeft]]" id="sortable" animation="[[animation]]" disabled="[[readonly]]" drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]"></smart-sortable>
                    <div id="expandCollapseContainer" class="smart-grid-panel-buttons-container smart-grid-panel-expand-collapse smart-unselectable" role="presentation">
                        <span class="smart-group-panel-collapse-button" role="button"></span>
                        <span class="smart-group-panel-expand-button" role="button"></span>
                    </div>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <smart-input right-to-left="[[rightToLeft]]" id="inputNotSorted" animation="[[animation]]" readonly theme="[[theme]]"></smart-input>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(target, event) {
        const that = this,
            result = super._interactionHandler(target, event);

        if (result) {
            return;
        }

        if (target === that.$.expandCollapseContainer.firstElementChild) {
            // "Collapse all" button is clicked
            that.$.fireEvent('collapseAll');
        }
        else if (target === that.$.expandCollapseContainer.children[1]) {
            // "Expand all" button is clicked
            that.$.fireEvent('expandAll');
        }
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        super._localize();

        const that = this;

        that.$.expandCollapseContainer.firstElementChild.innerHTML = that.localize('collapseAll');
        that.$.expandCollapseContainer.children[1].innerHTML = that.localize('expandAll');
        that.$.sortable.$.container.setAttribute('no-grouping', that.localize('noGrouping'));
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        super._setFocusable();

        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0;

        that.$.expandCollapseContainer.firstElementChild.tabIndex = tabindex;
        that.$.expandCollapseContainer.children[1].tabIndex = tabindex;
    }
});

/**
 * MultiColumnFilterPanel custom element.
 */
Smart('smart-multi-column-filter-panel', class MultiColumnFilterPanel extends Smart.BaseElement {
    // MultiColumnFilterPanel's properties.
    static get properties() {
        return {
            'closeButtonPosition': {
                value: 'left',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'editorPlaceholder': {
                value: 'Value',
                type: 'string'
            },
            'messages': {
                value: {
                    'en': {
                        'addFilter': '+ Add filter',
                        'and': 'And',
                        'apply': 'Apply',
                        'cancel': 'Cancel',
                        'CONTAINS': 'contains',
                        'CONTAINS_CASE_SENSITIVE': 'contains (case sensitive)',
                        'DOES_NOT_CONTAIN': 'does not contain',
                        'DOES_NOT_CONTAIN_CASE_SENSITIVE': 'does not contain (case sensitive)',
                        'EMPTY': 'empty',
                        'ENDS_WITH': 'ends with',
                        'ENDS_WITH_CASE_SENSITIVE': 'ends with (case sensitive)',
                        'EQUAL': 'equal',
                        'EQUAL_CASE_SENSITIVE': 'equal (case sensitive)',
                        'GREATER_THAN': 'greater than',
                        'GREATER_THAN_OR_EQUAL': 'greater than or equal',
                        'LESS_THAN': 'less than',
                        'LESS_THAN_OR_EQUAL': 'less than or equal',
                        'noFilters': 'No filters applied',
                        'NOT_EMPTY': 'not empty',
                        'NOT_EQUAL': 'not equal',
                        'NOT_NULL': 'not null',
                        'NULL': 'null',
                        'or': 'Or',
                        'STARTS_WITH': 'starts with',
                        'STARTS_WITH_CASE_SENSITIVE': 'starts with (case sensitive)',
                        'where': 'Where',
                    }
                },
                type: 'object',
                extend: true
            },
            'operator': {
                value: 'and',
                allowedValues: ['and', 'or'],
                type: 'string',
            },
            'value': {
                value: [],
                type: 'array'
            }
        };
    }

    /**
     * MultiColumnFilterPanel's event listeners.
     */
    static get listeners() {
        return {
            'change': '_changeHandler',
            'click': '_interactionHandler',
            'keydown': '_interactionHandler'
        };
    }

    /**
     * MultiColumnFilterPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Button': 'smart.button.js',
            'Smart.CheckBox': 'smart.checkbox.js',
            'Smart.DateTimePicker': 'smart.datetimepicker.js',
            'Smart.FilterGroup': 'smart.filter.js',
            'Smart.Input': 'smart.input.js',
            'Smart.NumericTextBox': 'smart.numerictextbox.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * MultiColumnFilterPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div id="itemsContainer" class="smart-filter-panel-items-container smart-unselectable"></div>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <div id="addFilterButton" class="smart-filter-panel-add-filter-button smart-unselectable" role="button"></div>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        that._setFocusable();
        that._localize();
        that._applyValue();
        super.render();
    }

    /**
     * Updates the MultiColumnFilterPanel when a property is  changed.
     * @param {string} propertyName The name of the property.
     * @param {number/string} oldValue The previously entered value.
     * @param {number/string} newValue The new entered value.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'animation':
            case 'theme':
            case 'rightToLeft':
                Array.from(that.$.itemsContainer.querySelectorAll('smart-date-time-picker, smart-numeric-text-box, smart-check-box, smart-input'))
                    .forEach(element => {
                        element[propertyName] = newValue;

                        if (element.tagName.toLowerCase() === 'smart-input' && propertyName === 'rightToLeft' && element.dropDownButtonPosition !== 'none') {
                            element.dropDownButtonPosition = newValue ? 'left' : 'right';
                        }
                    });
                break;
            case 'disabled':
            case 'unfocusable':
                that._setFocusable(true);
                break;
            case 'dataSource':
            case 'value':
                that._applyValue();
                break;
            case 'editorPlaceholder':
                Array.from(that.$.itemsContainer.getElementsByClassName('editor'))
                    .forEach(element => element.placeholder = newValue);
                break;
            case 'locale':
            case 'messages':
                that._localize(true);
                break;
            case 'operator':
                that._setOperator();
                break;
        }
    }

    /**
     * Sets operator.
     */
    _setOperator() {
        const that = this,
            label = that.localize(that.operator);

        for (let i = 2; i < that._items.length; i++) {
            that._items[i].children[1].innerHTML = label;
        }
    }

    /**
     * change handler.
     */
    _changeHandler(event) {
        const that = this,
            target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (target instanceof Smart.Input === false) {
            return;
        }

        const item = target.parentElement,
            itemElements = item.children;

        if (target === itemElements[1]) {
            // operator
            that.operator = target.$.input.dataValue;
            that._setOperator();
        }
        else if (target === itemElements[2]) {
            // data field
            const oldDataType = that.dataSource.find(col => col.dataField === event.detail.oldValue).dataType,
                newDataType = that.dataSource.find(col => col.dataField === event.detail.value).dataType;

            if (newDataType === oldDataType) {
                return;
            }

            const currentCondition = itemElements[3].value;
            let conditionsSource, newEditor;

            switch (newDataType) {
                case 'date':
                    conditionsSource = that._numberAndDateConditions;
                    newEditor = document.createElement('smart-date-time-picker');
                    newEditor.calendarButton = true;
                    newEditor.dropDownAppendTo = 'body';
                    newEditor.formatString = 'M/d/yy H:mm';
                    break;
                case 'number':
                    conditionsSource = that._numberAndDateConditions;
                    newEditor = document.createElement('smart-numeric-text-box');
                    break;
                case 'boolean':
                    conditionsSource = that._booleanConditions;
                    newEditor = document.createElement('smart-check-box');
                    break;
                default:
                    conditionsSource = that._stringConditions;
                    newEditor = document.createElement('smart-input');
                    break;
            }

            newEditor.rightToLeft = that.rightToLeft;
            newEditor.animation = that.animation;
            newEditor.theme = that.theme;
            newEditor.unfocusable = that.disabled || that.unfocusable;
            itemElements[4].remove();
            item.appendChild(newEditor);

            if (currentCondition !== '' &&
                !conditionsSource.find(condition => condition.label === currentCondition)) {
                itemElements[3].value = '';
            }

            itemElements[3].dataSource = conditionsSource;
            item.dataType = newDataType;
        }
        else if (target === itemElements[3]) {
            // condition
            const editor = itemElements[4],
                dataValue = target.$.input.dataValue;

            if (dataValue.indexOf('NULL') !== -1 || dataValue.indexOf('EMPTY') !== -1) {
                editor.value = '';
                editor.checked = false;
                editor.classList.add('smart-visibility-hidden');
            }
            else {
                editor.classList.remove('smart-visibility-hidden');
            }

            target.condition = dataValue;
        }
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        if (event.type === 'keydown') {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
            }
            else {
                return;
            }
        }

        const target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target,
            item = target.closest('.smart-grid-panel-item');

        if (item) {
            if (target === item.firstElementChild) {
                const itemIndex = that._items.indexOf(item);
                let operator;

                that._items.splice(itemIndex, 1);
                item.remove();

                if (that._items.length > 0 && itemIndex < 2) {
                    if (itemIndex === 0) {
                        that._items[0].children[1].remove();
                        operator = document.createElement('div');
                        operator.innerHTML = that.localize('where');
                        that._items[0].insertBefore(operator, that._items[0].children[1]);
                    }

                    if (that._items.length > 1) {
                        that._items[1].children[1].remove();
                        operator = document.createElement('smart-input');
                        operator.className = 'underlined';
                        operator.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
                        operator.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
                        operator.readonly = true;
                        operator.value = that.localize(that.operator);
                        operator.animation = that.animation;
                        operator.theme = that.theme;
                        operator.rightToLeft = that.rightToLeft;
                        operator.unfocusable = that.disabled || that.unfocusable;
                        that._items[1].insertBefore(operator, that._items[1].children[1]);
                    }
                }
            }

            return;
        }

        if (target === that.$.addFilterButton && that.dataSource.length > 0) {
            that.$.itemsContainer.appendChild(
                that._createItem(that.dataSource[0], '', '', that._items.length));
            return;
        }

        if (target === that.$.buttonsContainer.firstElementChild) {
            // "Cancel" button is clicked
            that.$.fireEvent('cancel');
            return;
        }

        if (target === that.$.buttonsContainer.children[1]) {
            // "Apply" button is clicked
            const allConditions = that._stringConditions.concat(that._numberAndDateConditions),
                operator = that.operator,
                validValue = [],
                filterGroups = {},
                result = [];

            that._items.forEach(item => {
                const column = that.dataSource.find(col => col.label === item.children[2].value),
                    filter = [];
                let condition = item.children[3].value;

                if (condition === '') {
                    return;
                }

                condition = allConditions.find(cond => cond.label === condition).value;
                filter.push(column.dataField, condition);

                if (condition.indexOf('NULL') === -1 && condition.indexOf('EMPTY') === -1) {
                    if (column.dataType === 'boolean') {
                        filter.push(item.children[4].checked);
                    }
                    else if (column.dataType === 'date') {
                        filter.push(item.children[4].value.toDate());
                    }
                    else {
                        filter.push(item.children[4].value);
                    }
                }

                let filterGroup = filterGroups[filter[0]];

                if (filterGroup === undefined) {
                    filterGroup = new Smart.Utilities.FilterGroup();
                    filterGroups[filter[0]] = filterGroup;
                }

                const filterObject = filterGroup.createFilter(column.dataType, filter[2], filter[1]);

                filterGroup.addFilter(operator, filterObject);
                validValue.push(filter);
            });

            for (let dataField in filterGroups) {
                result.push([dataField, filterGroups[dataField]]);
            }

            that.value = validValue;

            that.$.fireEvent('apply', { filters: result, operator: operator, value: validValue });
        }
    }

    /**
     * Applies filter value.
     */
    _applyValue() {
        const that = this,
            structure = document.createDocumentFragment();
        let index = 0;

        that._items = [];

        while (that.$.itemsContainer.firstElementChild) {
            that.$.itemsContainer.firstElementChild.remove();
        }

        if (that.dataSource.length === 0) {
            return;
        }

        that.value.forEach(filter => {
            if (!Array.isArray(filter)) {
                return;
            }

            const dataField = filter[0],
                column = that.dataSource.find(col => col.dataField === dataField);

            if (!column) {
                return;
            }

            const item = that._createItem(column, filter[1], filter[2], index);

            structure.appendChild(item);
            index++;
        });

        that.$.itemsContainer.appendChild(structure);
    }

    /**
     * Creates an item.
     */
    _createItem(column, condition, value, index) {
        const that = this,
            editorPlaceholder = that.editorPlaceholder,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            item = document.createElement('div'),
            structure = document.createDocumentFragment(),
            closeButton = document.createElement('div'),
            fieldInput = document.createElement('smart-input'),
            conditionInput = document.createElement('smart-input');
        let operator, editor;

        closeButton.className = 'smart-grid-panel-item-close-button';
        closeButton.tabIndex = tabindex;
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('aria-label', 'button');
        structure.appendChild(closeButton);

        if (index === 0) {
            operator = document.createElement('div');
            operator.innerHTML = that.localize('where');
            operator.setAttribute('role', 'presentation');
        }
        else if (index === 1) {
            operator = document.createElement('smart-input');
            operator.className = 'underlined';
            operator.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
            operator.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
            operator.readonly = true;
            operator.value = that.localize(that.operator);
            operator.animation = that.animation;
            operator.theme = that.theme;
            operator.rightToLeft = that.rightToLeft;
            operator.unfocusable = that.disabled || that.unfocusable;
            operator.setAttribute('aria-label', 'Operator');
        }
        else {
            operator = document.createElement('div');
            operator.innerHTML = that.localize(that.operator);
            operator.setAttribute('role', 'presentation');
        }

        structure.appendChild(operator);

        fieldInput.className = 'underlined';
        fieldInput.dataSource = that.dataSource.map(col => {
            return { value: col.dataField, label: col.label, icon: col.icon };
        });
        fieldInput.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        fieldInput.readonly = true;
        fieldInput.value = column.label;
        fieldInput.animation = that.animation;
        fieldInput.theme = that.theme;
        fieldInput.rightToLeft = that.rightToLeft;
        fieldInput.unfocusable = that.disabled || that.unfocusable;
        fieldInput.setAttribute('aria-label', 'Field');
        structure.appendChild(fieldInput);

        if (column.dataType === 'boolean') {
            conditionInput.dataSource = that._booleanConditions;
            editor = document.createElement('smart-check-box');
            editor.checked = typeof value === 'boolean' ? value : false;
        }
        else if (column.dataType === 'date') {
            conditionInput.dataSource = that._numberAndDateConditions;
            editor = document.createElement('smart-date-time-picker');
            editor.calendarButton = true;
            editor.dropDownAppendTo = 'body';
            editor.formatString = 'M/d/yy H:mm';
            editor.value = value;
            editor.placeholder = editorPlaceholder;
        }
        else if (column.dataType === 'number') {
            conditionInput.dataSource = that._numberAndDateConditions;
            editor = document.createElement('smart-numeric-text-box');
            editor.value = typeof value === 'number' || typeof value === 'string' ? value : 0;
            editor.placeholder = editorPlaceholder;
        }
        else {
            conditionInput.dataSource = that._stringConditions;
            editor = document.createElement('smart-input');
            editor.value = value !== undefined && value !== null ? value.toString() : '';
            editor.placeholder = editorPlaceholder;
        }

        conditionInput.className = 'underlined';
        conditionInput.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        conditionInput.readonly = true;
        conditionInput.animation = that.animation;
        conditionInput.theme = that.theme;
        conditionInput.rightToLeft = that.rightToLeft;
        conditionInput.unfocusable = that.disabled || that.unfocusable;
        conditionInput.setAttribute('aria-label', 'Condition');

        if (conditionInput.dataSource.find(defaultCondition => defaultCondition.value === condition)) {
            conditionInput.value = that.localize(condition);
            conditionInput.condition = condition;
        }
        else {
            editor.value = '';
            editor.checked = false;
        }

        if (condition !== undefined &&
            (condition.indexOf('NULL') !== -1 || condition.indexOf('EMPTY') !== -1)) {
            editor.value = '';
            editor.checked = false;
            editor.classList.add('smart-visibility-hidden');
        }

        editor.animation = that.animation;
        editor.className = 'editor';
        editor.rightToLeft = that.rightToLeft;
        editor.theme = that.theme;
        editor.unfocusable = that.disabled || that.unfocusable;
        structure.appendChild(conditionInput);
        structure.appendChild(editor);
        item.appendChild(structure);
        item.className = 'smart-grid-panel-item';
        that._items.push(item);
        item.dataType = column.dataType;

        return item;
    }

    /**
     * Localizes labels in template
     */
    _localize(propertyChangedHandler) {
        const that = this;

        that.$.addFilterButton.innerHTML = that.localize('addFilter');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');
        that.$.itemsContainer.setAttribute('no-filters', that.localize('noFilters'));

        that._stringConditions = [
            { value: 'EMPTY', label: that.localize('EMPTY') },
            { value: 'NOT_EMPTY', label: that.localize('NOT_EMPTY') },
            { value: 'CONTAINS', label: that.localize('CONTAINS') },
            { value: 'CONTAINS_CASE_SENSITIVE', label: that.localize('CONTAINS_CASE_SENSITIVE') },
            { value: 'DOES_NOT_CONTAIN', label: that.localize('DOES_NOT_CONTAIN') },
            { value: 'DOES_NOT_CONTAIN_CASE_SENSITIVE', label: that.localize('DOES_NOT_CONTAIN_CASE_SENSITIVE') },
            { value: 'STARTS_WITH', label: that.localize('STARTS_WITH') },
            { value: 'STARTS_WITH_CASE_SENSITIVE', label: that.localize('STARTS_WITH_CASE_SENSITIVE') },
            { value: 'ENDS_WITH', label: that.localize('ENDS_WITH') },
            { value: 'ENDS_WITH_CASE_SENSITIVE', label: that.localize('ENDS_WITH_CASE_SENSITIVE') },
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'EQUAL_CASE_SENSITIVE', label: that.localize('EQUAL_CASE_SENSITIVE') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];
        that._numberAndDateConditions = [
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'NOT_EQUAL', label: that.localize('NOT_EQUAL') },
            { value: 'LESS_THAN', label: that.localize('LESS_THAN') },
            { value: 'LESS_THAN_OR_EQUAL', label: that.localize('LESS_THAN_OR_EQUAL') },
            { value: 'GREATER_THAN', label: that.localize('GREATER_THAN') },
            { value: 'GREATER_THAN_OR_EQUAL', label: that.localize('GREATER_THAN_OR_EQUAL') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];
        that._booleanConditions = [
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'NOT_EQUAL', label: that.localize('NOT_EQUAL') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];

        if (!propertyChangedHandler) {
            return;
        }

        that._items.forEach((item, index) => {
            const operatorElement = item.children[1],
                conditionElement = item.children[3];

            if (index === 0) {
                operatorElement.innerHTML = that.localize('where');
            }
            else if (index === 1) {
                operatorElement.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
                operatorElement.value = that.localize(that.operator);
            }
            else {
                operatorElement.innerHTML = that.localize(that.operator);
            }

            if (item.dataType === 'string') {
                conditionElement.dataSource = that._stringConditions;
            }
            else if (item.dataType === 'boolean') {
                conditionElement.dataSource = that._booleanConditions;
            }
            else {
                conditionElement.dataSource = that._numberAndDateConditions;
            }

            conditionElement.value = conditionElement.condition ? that.localize(conditionElement.condition) : '';
        });
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable(propertyChangedHandler) {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0;

        that.$.addFilterButton.tabIndex = tabindex;
        that.$.buttonsContainer.firstElementChild.tabIndex = tabindex;
        that.$.buttonsContainer.children[1].tabIndex = tabindex;

        if (propertyChangedHandler) {
            const closeButtons = Array.from(that.$.itemsContainer.getElementsByClassName('smart-grid-panel-item-close-button')),
                customElements = Array.from(that.$.itemsContainer.querySelectorAll('smart-date-time-picker, smart-numeric-text-box, smart-check-box, smart-input'));

            closeButtons.forEach(closeButton => closeButton.tabIndex = tabindex);
            customElements.forEach(element => element.unfocusable = that.disabled || that.unfocusable);
        }
    }
});

/**
 * ColumnPanel custom element.
 */
Smart('smart-column-panel', class ColumnPanel extends Smart.BaseElement {
    // ColumnPanel's properties.
    static get properties() {
        return {
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'messages': {
                value: {
                    'en': {
                        'apply': 'Apply',
                        'cancel': 'Cancel',
                        'find': 'Find a field',
                        'noResults': 'No results'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * ColumnPanel's event listeners.
     */
    static get listeners() {
        return {
            'click': '_interactionHandler',
            'keydown': '_interactionHandler',
            'find.keyup': '_findKeyupHandler',
            'sortable.dragEnd': '_sortableDragEndHandler'
        };
    }

    /**
     * ColumnPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Sortable': 'smart.sortable.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * ColumnPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div class="smart-column-panel-find-container" role="search">
                        <input id="find" readonly="[[readonly]]" role="searchbox" aria-label="Find a field"></input>
                        <span id="clearButton" class="clear-button smart-hidden" role="button" aria-label="Clear"></span>
                    </div>
                    <smart-sortable id="sortable" right-to-left="[[rightToLeft]]" animation="[[animation]]" disabled="[[readonly]]" drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]"></smart-sortable>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        that._positionChanged = false;
        that._localize();
        that._createSortItems();
        super.render();
    }

    /**
     * Updates the ColumnPanel when a property is  changed.
     * @param {string} propertyName The name of the property.
     * @param {number/string} oldValue The previously entered value.
     * @param {number/string} newValue The new entered value.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'dataSource': {
                const container = that.$.sortable.$.container;

                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                that._createSortItems();
                that._positionChanged = false;
                that.$.find.value = '';
                break;
            }
            case 'locale':
            case 'messages':
                that._localize();
                break;
        }
    }

    /**
     * Creates sort items.
     */
    _createSortItems() {
        const that = this,
            fragment = document.createDocumentFragment();

        that._HTMLToSourceMap = new Map();
        that.dataSource.forEach(column => fragment.appendChild(that._createSortItem(column)));
        that.$.sortable.$.container.appendChild(fragment);
        that.$.sortable.updateItems();
        that._setFocusable();
    }

    /**
     * Creates a sort item.
     */
    _createSortItem(column) {
        const that = this,
            sortItem = document.createElement('div');

        that._HTMLToSourceMap.set(sortItem, column);

        sortItem.className = 'smart-grid-panel-item';
        sortItem.innerHTML = `<div class="toggle-visibility${column.visible !== false ? '' : ' hidden'}${column.disableToggle ? ' disable-toggle' : ''}" role="button" aria-label="Toggle visibility"></div>
<span class="smart-column-panel-label smart-unselectable${column.icon ? ' icon ' + column.icon : ''}">${column.label}</span>`;
        return sortItem;
    }

    /**
     * click/keydown handler.
     */
    _interactionHandler(event) {
        const that = this;

        if (that.disabled || that.readonly ||
            event.type === 'keydown' && [' ', 'Enter'].indexOf(event.key) === -1) {
            return;
        }

        const target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (target.classList.contains('toggle-visibility')) {
            target.classList.toggle('hidden');
        }
        else if (target.parentElement === that.$.buttonsContainer) {
            if (target === that.$.buttonsContainer.firstElementChild) {
                // "Cancel" button is clicked
                that.$.fireEvent('cancel');
                return;
            }

            if (target === that.$.buttonsContainer.children[1]) {
                // "Apply" button is clicked
                const value = [];

                that.$.sortable._items.forEach(item => {
                    const column = Object.assign({}, that._HTMLToSourceMap.get(item));

                    column.visible = !item.firstElementChild.classList.contains('hidden');
                    value.push(column);
                });

                that.$.fireEvent('apply', { value: value, positionChanged: that._positionChanged });
                that._positionChanged = false;
            }
        }
        else if (target.classList.contains('clear-button')) {
            that.$.find.value = '';
            that._findKeyupHandler();
        }
    }

    /**
     * "Find a field" input keyup handler.
     */
    _findKeyupHandler() {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        const input = that.$.find,
            value = input.value,
            items = that.$.sortable._items;

        if (value === '') {
            input.parentElement.classList.remove('no-results');
            that.$.clearButton.classList.add('smart-hidden');
            items.forEach(item => item.classList.remove('smart-hidden'));
            that.$.sortable.disabled = that.readonly;
            return;
        }

        let noResults = true;

        that.$.clearButton.classList.remove('smart-hidden');
        items.forEach(item => {
            const column = that._HTMLToSourceMap.get(item);

            if (column.label.toLowerCase().indexOf(value.toLowerCase()) === -1) {
                item.classList.add('smart-hidden');
            }
            else {
                item.classList.remove('smart-hidden');
                noResults = false;
            }
        });
        that.$.sortable.disabled = true;

        if (noResults) {
            input.parentElement.classList.add('no-results');
        }
        else {
            input.parentElement.classList.remove('no-results');
        }
    }

    /**
     * sortable dragEnd handler.
     */
    _sortableDragEndHandler() {
        this._positionChanged = true;
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        const that = this;

        that.$.find.placeholder = that.localize('find');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');
        that.$.container.firstElementChild.setAttribute('no-results', that.localize('noResults'));
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this,
            tabIndex = (that.disabled || that.unfocusable) ? -1 : 0,
            toggleIcons = Array.from(that.$.sortable.getElementsByClassName('toggle-visibility'));

        that.$.find.tabIndex = tabIndex;
        that.$.clearButton.tabIndex = tabIndex;
        that.$.buttonsContainer.firstElementChild.tabIndex = tabIndex;
        that.$.buttonsContainer.children[1].tabIndex = tabIndex;
        toggleIcons.forEach(icon => icon.tabIndex = icon.classList.contains('disable-toggle') ? -1 : tabIndex);
    }
});