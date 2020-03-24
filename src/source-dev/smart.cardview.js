
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * CardView custom element.
 */
Smart('smart-card-view', class CardView extends Smart.BaseElement {
    // CardView's properties.
    static get properties() {
        return {
            'addNewButton': {
                value: false,
                type: 'boolean'
            },
            'allowDrag': {
                value: false,
                type: 'boolean'
            },
            'cardHeight': {
                value: null,
                type: 'number?'
            },
            'cellOrientation': {
                value: 'vertical',
                allowedValues: ['horizontal', 'vertical'],
                type: 'string'
            },
            'collapsible': {
                value: false,
                type: 'boolean'
            },
            'columns': {
                value: [],
                type: 'object',
                reflectToAttribute: false
            },
            'coverField': {
                value: null,
                type: 'string?'
            },
            'coverMode': {
                value: 'crop',
                allowedValues: ['fit', 'crop'],
                type: 'string'
            },
            'dataSource': {
                value: null,
                type: 'object?',
                reflectToAttribute: false
            },
            'editable': {
                value: false,
                type: 'boolean'
            },
            'headerPosition': {
                value: 'none',
                allowedValues: ['none', 'top', 'bottom'],
                type: 'string'
            },
            'messages': {
                value: {
                    'en': {
                        'addFilter': '+ Add filter',
                        'addImage': 'Add',
                        'and': 'And',
                        'apply': 'Apply',
                        'booleanFirst': '☐',
                        'booleanLast': '☑',
                        'cancel': 'Cancel',
                        'CONTAINS': 'contains',
                        'CONTAINS_CASE_SENSITIVE': 'contains (case sensitive)',
                        'coverField': 'Cover field',
                        'crop': 'Crop',
                        'customizeCards': 'Customize cards',
                        'dateFirst': '1',
                        'dateLast': '9',
                        'dateTabLabel': 'DATE',
                        'DOES_NOT_CONTAIN': 'does not contain',
                        'DOES_NOT_CONTAIN_CASE_SENSITIVE': 'does not contain (case sensitive)',
                        'draggedRecord': 'Record {{id}}',
                        'EMPTY': 'empty',
                        'ENDS_WITH': 'ends with',
                        'ENDS_WITH_CASE_SENSITIVE': 'ends with (case sensitive)',
                        'EQUAL': 'equal',
                        'EQUAL_CASE_SENSITIVE': 'equal (case sensitive)',
                        'filter': 'Filter',
                        'filteredByMultiple': '{{n}} filters',
                        'filteredByOne': '1 filter',
                        'filterValuePlaceholder': 'Value',
                        'find': 'Find a field',
                        'findInView': 'Find in view',
                        'firstBy': 'Sort by',
                        'fit': 'Fit',
                        'found': '{{nth}} of {{n}}',
                        'from': 'from',
                        'GREATER_THAN': 'greater than',
                        'GREATER_THAN_OR_EQUAL': 'greater than or equal',
                        'imageUrl': 'New image URL:',
                        'incorrectStructure': '"dataSource" must be an instance of Smart.DataAdapter or an array of objects with key-value pairs.',
                        'LESS_THAN': 'less than',
                        'LESS_THAN_OR_EQUAL': 'less than or equal',
                        'nextRecord': 'Next record',
                        'noCoverField': 'No cover field',
                        'noData': 'No data to display',
                        'noFilters': 'No filters applied',
                        'noMatches': 'No matched records',
                        'noSorting': 'No sorting applied',
                        'noResults': 'No results',
                        'NOT_EMPTY': 'not empty',
                        'NOT_EQUAL': 'not equal',
                        'NOT_NULL': 'not null',
                        'now': 'Now',
                        'NULL': 'null',
                        'numberFirst': '1',
                        'numberLast': '9',
                        'ok': 'OK',
                        'or': 'Or',
                        'pickAnother': 'Pick another field to sort by',
                        'previousRecord': 'Previous record',
                        'removeImage': 'Remove',
                        'sort': 'Sort',
                        'sortedByMultiple': 'Sorted by {{n}} fields',
                        'sortedByOne': 'Sorted by 1 field',
                        'STARTS_WITH': 'starts with',
                        'STARTS_WITH_CASE_SENSITIVE': 'starts with (case sensitive)',
                        'stringFirst': 'A',
                        'stringLast': 'Z',
                        'thenBy': 'then by',
                        'timeTabLabel': 'TIME',
                        'toggleVisibility': 'Toggle field visibility',
                        'where': 'Where'
                    }
                }
            },
            'onRecordInserted': {
                value: null,
                type: 'function?',
                reflectToAttribute: false
            },
            'onRecordRemoved': {
                value: null,
                type: 'function?',
                reflectToAttribute: false
            },
            'scrolling': {
                value: 'physical',
                allowedValues: ['physical', 'virtual', 'infinite', 'deferred'],
                type: 'string'
            },
            'titleField': {
                value: null,
                type: 'string?'
            }
        };
    }

    /**
     * CardView's event listeners.
     */
    static get listeners() {
        return {
            'click': '_clickHandler',
            'move': '_moveHandler',
            'resize': '_resizeHandler',
            'addNewButton.click': '_addNewButtonClickHandler',
            'cardContainer.down': '_cardContainerDownHandler',
            'header.apply': '_applyHandler',
            'header.cancel': 'closePanel',
            'headerDropDown.transitionend': '_headerDropDownTransitionendHandler',
            'searchInput.keyup': '_searchInputKeyupHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler'
        };
    }

    /**
     * CardView's required files.
     */
    static get requires() {
        return {
            'Smart.Button': 'smart.button.js',
            'Smart.Card': 'smart.card.js',
            'Smart.Carousel': 'smart.carousel.js',
            'Smart.CheckBox': 'smart.checkbox.js',
            'Smart.ColumnPanel': 'smart.gridpanel.js',
            'Smart.DataAdapter': 'smart.data.js',
            'Smart.DateTimePicker': 'smart.datetimepicker.js',
            'Smart.Input': 'smart.input.js',
            'Smart.NumericTextBox': 'smart.numerictextbox.js',
            'Smart.ScrollBar': 'smart.scrollbar.js',
            'Smart.SwitchButton': 'smart.switchbutton.js',
            'Smart.Window': 'smart.window.js',
            'Smart.Utilities.DateTime': 'smart.date.js'
        };
    }

    get hasStyleObserver() {
        return false;
    }

    get editInfo() {
        return this._editInfo;
    }

    /**
     * ShadowDOM style references
     */
    static get styleUrls() {
        return [
            'smart.cardview.css'
        ]
    }

    /**
     * CardView's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div id="header" class="smart-card-view-header smart-hidden" role="toolbar">
                        <div id="customizeCardsButton" class="smart-card-view-header-button smart-card-view-customize-button smart-unselectable" role="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Customize cards"><div role="presentation"></div></div>
                        <div id="filterButton" class="smart-card-view-header-button smart-card-view-filter-button smart-unselectable" role="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Filter"><div role="presentation"></div></div>
                        <div id="sortButton" class="smart-card-view-header-button smart-card-view-sort-button smart-unselectable" role="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Sort"><div role="presentation"></div></div>
                        <div id="searchButton" class="smart-card-view-header-button smart-card-view-search-button smart-unselectable" role="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Search"></div>
                        <div id="headerDropDown" class="smart-card-view-header-drop-down smart-visibility-hidden" role="dialog">
                            <div id="customize" class="smart-hidden" role="presentation"></div>
                            <div id="filter" class="smart-hidden" role="presentation"></div>
                            <div id="sort" class="smart-hidden" role="presentation"></div>
                            <div id="search" class="smart-card-view-search-box smart-hidden" role="presentation">
                                <input type="text" id="searchInput" spellcheck="false" aria-label="Search" />
                                <div id="searchLabel" class="smart-card-view-search-label smart-unselectable"></div>
                                <div id="searchPrev" class="smart-card-view-search-prev" role="button" aria-label="Previous"></div>
                                <div id="searchNext" class="smart-card-view-search-next" role="button" aria-label="Next"></div>
                                <div id="searchClose" class="smart-card-view-search-close" role="button" aria-label="Close search box"></div>
                            </div>
                        </div>
                    </div>
                    <smart-scroll-viewer id="scrollViewer" animation="[[animation]]" horizontal-scroll-bar-visibility="hidden" right-to-left="[[rightToLeft]]">
                        <div id="cardContainer" class="smart-card-container" role="list"></div>
                    </smart-scroll-viewer>
                    <div id="loadingIndicatorContainer" class="smart-loader-container smart-hidden" aria-label="Loading">
                        <span id="loadingIndicator" class="smart-loader" role="presentation"></span>
                    </div>
                    <div id="addNewButton" class="smart-add-new-button" role="button" aria-label="Add new card"></div>
                </div>`;
    }

    /**
     * Called when the element is attached to the DOM.
     */
    attached() {
        const that = this;

        super.attached();

        if (that.isCompleted && that._editInfo) {
            that._addWindowHandlers();
            document.body.appendChild(that._editInfo.window);
        }
    }

    /**
     * Called when the element is detached from the DOM.
     */
    detached() {
        const that = this;

        super.detached();

        if (!that._editInfo) {
            return;
        }

        const window = that._editInfo.window;

        window.removeEventListener('open', that._windowEventHandler);
        window.removeEventListener('closing', that._windowEventHandler);
        window.removeEventListener('close', that._windowEventHandler);
        window.removeEventListener('click', that._windowClickHandler);
        window.removeEventListener('prev', that._prevNextHandler);
        window.removeEventListener('next', that._prevNextHandler);
        window.remove();
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this,
            dataSource = that.dataSource,
            scrolling = that.scrolling,
            computedStyle = getComputedStyle(that);

        if (!that.$.headerDropDown.id) {
            that.$.headerDropDown.id = that.id + 'HeaderDropDown';
        }

        that.setAttribute('role', 'group');

        if (Smart.Utilities.NumberRenderer) {
            that._numericFormatter = new Smart.Utilities.NumberRenderer();
        }

        if (that.shadowRoot) {
            that.importStyle(Smart.Utilities.Core.getScriptLocation() + Smart.StyleBaseUrl.replace('/scoped/', '/smart.scrollviewer.css'));
            that.importStyle(Smart.Utilities.Core.getScriptLocation() + Smart.StyleBaseUrl.replace('/scoped/', '/smart.carousel.css'));
            that.importStyle(Smart.Utilities.Core.getScriptLocation() + Smart.StyleBaseUrl.replace('/scoped/', '/smart.button.css'));
            that.importStyle(Smart.Utilities.Core.getScriptLocation() + Smart.StyleBaseUrl.replace('/scoped/', '/smart.sortable.css'));
        }

        that._gap = parseFloat(computedStyle.getPropertyValue('--smart-card-view-gap'));
        that._verticalOffset = parseFloat(computedStyle.getPropertyValue('--smart-card-view-vertical-offset'));
        that._cards = [];
        that._collapsed = {};
        that._collapsedRows = {};
        that._numberOfCollapsedRows = 0;
        that._cardScrolling = {};
        that._cardSelectedCover = {};
        that._cardHeight = that.cardHeight;
        that._autoCardHeight = that._cardHeight === null;
        that._cachedWidth = that.offsetWidth;
        that._cachedHeight = that.offsetHeight;
        that._appliedFiltering = { filters: [], operator: 'and' };
        that._appliedSorting = { dataFields: [], dataTypes: [], orderBy: [] };
        that._start = { view: 0, data: 0 };
        that._autoScrollCoefficient = Smart.Utilities.Core.Browser.Firefox ? 8 : Smart.Utilities.Core.Browser.Edge ? 16 : 4;
        that._isMobile = Smart.Utilities.Core.isMobile;

        that._normalizeDataSource();
        that._getVisibleRecords();
        that._normalizeColumns();
        that._handleHeaderPosition();
        that._localizeHeader();
        that._getInnerElementMessages();

        if (scrolling === 'deferred') {
            that.$.scrollViewer.$.verticalScrollBar.mechanicalAction = 'switchWhenReleased';
        }
        else if ((scrolling === 'virtual' || scrolling === 'infinite') &&
            dataSource && dataSource.onVirtualDataSourceRequested === undefined) {
            that.scrolling = 'physical';
        }

        that._createTemplate();

        if (scrolling === 'infinite') {
            that._requestInitialCards();
        }
        else {
            that._createCards();
        }

        that.$.scrollViewer._verticalScrollbarHandler = that._onVerticalChange.bind(that);
        that.$.scrollViewer.hasStyleObserver = false;
        that.$.scrollViewer.$.verticalScrollBar.hasStyleObserver = false;
        that.$.scrollViewer.$.horizontalScrollBar.hasStyleObserver = false;

        super.render();
    }

    /**
     * Adds filtering.
     *
     * @param {Array} filters Filter information.
     * @param {String} operator Optional Logical operator between the filters of different fields.
     */
    addFilter(filters, operator = 'and') {
        const that = this;

        if (!Array.isArray(filters) || filters.length > 0 && !Array.isArray(filters[0])) {
            return;
        }

        let newFiltering;

        that.closePanel();

        if (arguments[2]) {
            newFiltering = { filters: arguments[2], operator: operator };
        }
        else {
            newFiltering = { filters: [], operator: operator };

            filters.forEach(filterGroup => {
                filterGroup[1].filters.forEach(filterObject => {
                    newFiltering.filters.push([filterGroup[0], filterObject.condition, filterObject.value]);
                });
            });
        }

        if (JSON.stringify(newFiltering) === JSON.stringify(that._appliedFiltering)) {
            return;
        }

        const numberOfFilters = newFiltering.filters.length;

        that._appliedFiltering = newFiltering;

        try {
            that.dataSource._filter(filters, operator);
        }
        catch (error) {
            return;
        }

        that._getVisibleRecords();
        that._fullRefresh();

        that.$.fireEvent('filter');

        if (numberOfFilters === 0) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
            that.$.filterButton.classList.remove('filtered');
            return;
        }

        if (numberOfFilters === 1) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByOne');
        }
        else {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByMultiple', { n: numberOfFilters });
        }

        that.$.filterButton.classList.add('filtered');
    }

    /**
     * Adds a new record.
     *
     * @param {Number/String} recordId Optional The id of the record to add.
     * @param {Object} data Optional The data of the record to add.
     * @param {String} position Optional The position to add the record to. Possible values: 'first' and 'last'.
     */
    addRecord(recordId, data = {}, position = 'last') {
        const that = this,
            dataSource = that.dataSource,
            scrolling = that.scrolling;

        function refresh() {
            if (position !== 'first') {
                position = 'last';
                dataSource.insert(dataSource.length, data);

                if (dataSource !== that._visibleSource) {
                    that._visibleSource.push(dataSource[dataSource.length - 1]);
                }
            }
            else {
                dataSource.insert(0, data);

                if (dataSource !== that._visibleSource) {
                    that._visibleSource.unshift(dataSource[0]);
                }
            }

            that._closeSearchPanel();
            that._fullRefresh();
        }

        if (typeof data !== 'object') {
            return;
        }

        if (that.dataSource.dataFields.length === 0) {
            const newDataSource = [data];

            that.dataSource = newDataSource;
            that.propertyChangedHandler('dataSource', null, newDataSource);
            return;
        }

        const idMember = dataSource.id;

        if (idMember) {
            if (recordId !== null && recordId !== undefined && recordId !== '') {
                data[idMember] = recordId;
            }
            else if (data[idMember] === undefined) {
                if (dataSource[0] && !dataSource[0].isEmpty && typeof dataSource[0].$.id === 'number') {
                    data[idMember] = Math.floor(Math.random() * (1000000 - dataSource.length)) + dataSource.length;
                }
                else {
                    data[idMember] = Math.random().toString(36).substring(7);
                }
            }
        }

        if (scrolling === 'physical' || scrolling === 'deferred') {
            refresh();
            return;
        }

        // 'virtual'/'infinite' scroll modes
        function commit(result) {
            if (result) {
                refresh();
            }
        }

        if (that.onRecordInserted) {
            that.onRecordInserted(idMember ? data[idMember] : recordId, data, position, commit);
        }
    }

    /**
     * Adds sorting.
     *
     * @param {Array/String} dataFields The data field(s) to sort by.
     * @param {Array/String} orderBy The sort direction(s) to sort the data field(s) by.
     */
    addSort(dataFields, orderBy) {
        const that = this,
            dataSource = that.dataSource,
            oldSorting = JSON.stringify(that._appliedSorting);
        let sortByInfo;

        function validate(dataField, index) {
            const column = that.columns.find(col => col.dataField === dataField);

            if (column) {
                let columnOrderBy = Array.isArray(orderBy) ? orderBy[index] : typeof orderBy === 'string' ? orderBy : 'ascending';

                sortByInfo.dataFields.push(dataField);
                sortByInfo.dataTypes.push(dataSource.dataFields.find(sourceField => sourceField.name === dataField).dataType);
                columnOrderBy = columnOrderBy.indexOf('desc') !== -1 ? 'descending' : 'ascending';
                sortByInfo.orderBy.push(columnOrderBy);
            }
        }

        if (arguments.length === 0 || !dataSource || dataSource.length === 0) {
            return;
        }

        that.closePanel();

        if (arguments.length === 1 && typeof dataFields === 'object') {
            sortByInfo = dataFields;
        }
        else {
            sortByInfo = { dataFields: [], dataTypes: [], orderBy: [] };

            if (Array.isArray(dataFields)) {
                dataFields.forEach(validate);
            }
            else if (typeof dataFields === 'string') {
                validate(dataFields, 0);
            }
            else {
                return;
            }
        }

        that.closePanel();
        that._appliedSorting = sortByInfo;

        if (oldSorting !== JSON.stringify(that._appliedSorting)) {
            const sortedFields = that._appliedSorting.dataFields.length;

            dataSource.sortBy(sortByInfo.dataFields, sortByInfo.dataTypes, sortByInfo.orderBy);
            that._getVisibleRecords();
            that._refreshCardContent();

            that.$.fireEvent('sort');

            if (sortedFields === 0) {
                that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
                that.$.sortButton.classList.remove('sorted');
                return;
            }

            if (sortedFields === 1) {
                that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByOne');
            }
            else {
                that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByMultiple', { n: sortedFields });
            }

            that.$.sortButton.classList.add('sorted');
        }
    }

    /**
     * Begins an edit operation.
     *
     * @param {Number/String} recordId The id of the record to edit.
     */
    beginEdit(recordId) {
        const that = this;

        if (!that.editable) {
            return;
        }

        const record = that._visibleSource.find(record => record.$.id === recordId);

        if (!record) {
            return;
        }

        const card = that.ensureVisible(recordId);

        if (that.scrolling !== 'virtual') {
            that._openEditDialog(card.dataId);
        }
        else {
            that._beginEditOnLoad = recordId;
        }
    }

    /**
     * Ends the current edit operation and discards changes.
     */
    cancelEdit() {
        const that = this,
            editInfo = that._editInfo;

        if (!editInfo || !editInfo.window.opened) {
            return;
        }

        editInfo.window.close();
    }

    /**
     * Closes any open header panel (drop down).
     */
    closePanel() {
        const that = this,
            headerDropDown = that.$.headerDropDown;

        headerDropDown.classList.add('smart-visibility-hidden');
        that._closeSearchPanel();

        if (headerDropDown.controlledBy) {
            headerDropDown.controlledBy.removeAttribute('aria-controls');
            headerDropDown.controlledBy.setAttribute('aria-expanded', false);
            delete headerDropDown.controlledBy;
        }
    }

    /**
     * Ends the current edit operation and saves changes.
     */
    endEdit() {
        const that = this,
            editInfo = that._editInfo;

        if (!editInfo || !editInfo.window.opened) {
            return;
        }

        editInfo.ok = true;
        editInfo.window.close();
    }

    /**
     * Makes sure a record is visible by scrolling to it.
     *
     * @param {Number/String} recordId The id of the record to scroll to.
     */
    ensureVisible(recordId) {
        const that = this,
            dataSource = that._visibleSource,
            record = dataSource.find(record => record.$.id === recordId);

        if (!record) {
            return;
        }

        const index = dataSource.indexOf(record),
            cardsPerRow = that._cardsPerRow,
            fullCardHeight = that._cardHeight + that._gap,
            verticalScrollBar = that.$.scrollViewer.$.verticalScrollBar,
            rowOfIndex = Math.floor(index / cardsPerRow),
            rowStart = Math.max(0, rowOfIndex * cardsPerRow);
        let scrollValue = 0,
            cardsWithDataId, cardMatch;

        if (that._numberOfCollapsedRows > 0) {
            const numberOfAllRows = Math.floor((dataSource.length - 1) / cardsPerRow) + 1;

            for (let i = 0; i < numberOfAllRows; i++) {
                const currentRowIndex = i;

                if (currentRowIndex === rowOfIndex) {
                    break;
                }

                if (that._collapsedRows[currentRowIndex]) {
                    scrollValue += fullCardHeight - that._cardContentHeight;
                }
                else {
                    scrollValue += fullCardHeight;
                }
            }
        }
        else {
            scrollValue = Math.floor(rowStart / cardsPerRow) * fullCardHeight;
        }

        scrollValue = Math.min(scrollValue, verticalScrollBar.max);

        if (Math.abs(verticalScrollBar.value - scrollValue) <
            that.$.scrollViewer.$.scrollViewerContainer.offsetHeight / 50) {
            cardsWithDataId = that._cards.filter(card => card.dataId === index && !card.classList.contains('smart-hidden'));
            cardMatch = cardsWithDataId[cardsWithDataId.length - 1];

            return cardMatch;
        }

        verticalScrollBar.value = scrollValue;
        that._onVerticalChange({ detail: { value: scrollValue } });

        cardsWithDataId = that._cards.filter(card => card.dataId === index && !card.classList.contains('smart-hidden'));
        cardMatch = cardsWithDataId[cardsWithDataId.length - 1];

        return cardMatch;
    }

    /**
     * Hides a column.
     * @param {String} dataField The data field of the column.
     */
    hideColumn(dataField) {
        this._toggleColumn(dataField, false);
    }

    /**
     * Opens the "Customize cards" header panel (drop down).
     */
    openCustomizePanel() {
        const that = this,
            dataSource = that.dataSource;

        if (!dataSource || dataSource.length === 0) {
            return;
        }

        const customizePart = that.$.customize,
            columnPanelDataSource = that.columns.map(col => {
                const newColumn = Object.assign({}, col);

                if ([that.coverField, that.titleField].indexOf(newColumn.dataField) !== -1) {
                    newColumn.disableToggle = true;
                }
                else {
                    newColumn.disableToggle = false;
                }

                return newColumn;
            }),
            inputSource = [that.localize('noCoverField')].concat(that.columns.filter(col => col.image));
        let switchButton, input, columnPanel;

        if (that._editInfo) {
            that._editInfo.window.close();
        }

        that.$.headerDropDown.classList.add('customize-panel');
        that.$.headerDropDown.classList.remove('filter-panel', 'sort-panel', 'search-panel');
        customizePart.classList.remove('smart-hidden');
        that.$.filter.classList.add('smart-hidden');
        that.$.sort.classList.add('smart-hidden');
        that.$.search.classList.add('smart-hidden');
        that._closeSearchPanel();

        if (!that._customizePartCreated) {
            const fragment = document.createDocumentFragment(),
                container = document.createElement('div'),
                innerContainer = document.createElement('div'),
                label = document.createElement('div');

            switchButton = document.createElement('smart-switch-button');
            input = document.createElement('smart-input');
            columnPanel = document.createElement('smart-column-panel');

            label.id = that.id + 'CoverFieldLabel';
            label.innerHTML = that.localize('coverField');

            switchButton.rightToLeft = that.rightToLeft;
            switchButton.setAttribute('crop', that.localize('crop'));
            switchButton.setAttribute('fit', that.localize('fit'));
            switchButton.setAttribute('aria-labelledby', label.id);
            switchButton.inverted = true;
            switchButton.animation = that.animation;
            switchButton.theme = that.theme;

            input.dataSource = inputSource;
            input.dropDownButtonPosition = 'right';
            input.rightToLeft = that.rightToLeft;
            input.readonly = true;
            input.animation = that.animation;
            input.theme = that.theme;

            columnPanel.rightToLeft = that.rightToLeft;
            columnPanel.animation = that.animation;
            columnPanel.dataSource = columnPanelDataSource;
            columnPanel.locale = that.locale;
            columnPanel.messages = that._innerElementMessages.columnPanel;
            columnPanel.theme = that.theme;

            innerContainer.appendChild(label);
            innerContainer.appendChild(switchButton);
            container.classList.add('smart-card-view-customize-top');
            container.appendChild(innerContainer);
            container.appendChild(input);
            fragment.appendChild(container);
            fragment.appendChild(columnPanel);
            that.$.customize.appendChild(fragment);
            that._customizePartCreated = true;
        }
        else {
            switchButton = customizePart.getElementsByTagName('smart-switch-button')[0];
            switchButton.rightToLeft = that.rightToLeft;
            input = customizePart.getElementsByTagName('smart-input')[0];
            input.dataSource = inputSource;
            input.rightToLeft = that.rightToLeft;
            delete input.$.input.dataValue;
            columnPanel = customizePart.children[1];
            columnPanel.set('dataSource', columnPanelDataSource);
            columnPanel.propertyChangedHandler('dataSource', undefined, columnPanelDataSource);
            columnPanel.rightToLeft = that.rightToLeft;
        }

        switchButton.checked = that.coverMode === 'fit';
        input.value = that.coverField ? that.columns.find(col => col.dataField === that.coverField).label : that.localize('noCoverField');
        that._changedVisibility = new Map();
        that._openHeaderDropDown(that.$.customizeCardsButton);
    }

    /**
     * Opens the "Filter" header panel (drop down).
     */
    openFilterPanel() {
        const that = this,
            dataSource = that.dataSource;

        if (!dataSource || dataSource.length === 0) {
            return;
        }

        const filterPanelDataSource = that.columns.map(col => {
            const field = Object.assign({}, col);

            field.dataType = dataSource.dataFields.find(dataField => dataField.name === field.dataField).dataType;
            return field;
        });
        let filterPanel;

        if (that._editInfo) {
            that._editInfo.window.close();
        }

        that.$.headerDropDown.classList.add('filter-panel');
        that.$.headerDropDown.classList.remove('customize-panel', 'sort-panel', 'search-panel');
        that.$.filter.classList.remove('smart-hidden');
        that.$.customize.classList.add('smart-hidden');
        that.$.sort.classList.add('smart-hidden');
        that.$.search.classList.add('smart-hidden');
        that._closeSearchPanel();

        if (!that._filterPartCreated) {
            filterPanel = document.createElement('smart-multi-column-filter-panel');
            filterPanel.rightToLeft = that.rightToLeft;
            filterPanel.animation = that.animation;
            filterPanel.dataSource = filterPanelDataSource;
            filterPanel.locale = that.locale;
            filterPanel.messages = that._innerElementMessages.multiColumnFilterPanel;
            filterPanel.operator = that._appliedFiltering.operator;
            filterPanel.editorPlaceholder = that.localize('filterValuePlaceholder');
            filterPanel.theme = that.theme;
            filterPanel.value = that._appliedFiltering.filters;
            that.$.filter.appendChild(filterPanel);
            that._filterPartCreated = true;
        }
        else {
            filterPanel = that.$.filter.firstElementChild;
            filterPanel.set('operator', that._appliedFiltering.operator);
            filterPanel.set('value', that._appliedFiltering.filters);
            filterPanel._applyValue();
            filterPanel.rightToLeft = that.rightToLeft;
        }

        that._openHeaderDropDown(that.$.filterButton);
    }

    /**
     * Opens the "Sort" header panel (drop down).
     */
    openSortPanel() {
        const that = this,
            dataSource = that.dataSource;

        if (!dataSource || dataSource.length === 0) {
            return;
        }

        const sortPanelDataSource = that.columns.map(col => {
            const newColumn = Object.assign({}, col),
                preSortedIndex = that._appliedSorting.dataFields.indexOf(newColumn.dataField);

            newColumn.dataType = dataSource.dataFields.find(dataField => dataField.name === newColumn.dataField).dataType;
            newColumn.sortIndex = preSortedIndex;

            if (preSortedIndex !== -1) {
                newColumn.sortDirection = that._appliedSorting.orderBy[preSortedIndex];
            }

            return newColumn;
        });
        let sortPanel;

        if (that._editInfo) {
            that._editInfo.window.close();
        }

        that.$.headerDropDown.classList.add('sort-panel');
        that.$.headerDropDown.classList.remove('customize-panel', 'filter-panel', 'search-panel');
        that.$.sort.classList.remove('smart-hidden');
        that.$.customize.classList.add('smart-hidden');
        that.$.filter.classList.add('smart-hidden');
        that.$.search.classList.add('smart-hidden');
        that._closeSearchPanel();

        if (!that._sortPartCreated) {
            sortPanel = document.createElement('smart-sort-panel');
            sortPanel.rightToLeft = that.rightToLeft;
            sortPanel.animation = that.animation;
            sortPanel.dataSource = sortPanelDataSource;
            sortPanel.locale = that.locale;
            sortPanel.messages = that._innerElementMessages.sortPanel;
            sortPanel.theme = that.theme;
            that.$.sort.appendChild(sortPanel);
            that._sortPartCreated = true;
        }
        else {
            sortPanel = that.$.sort.firstElementChild;
            sortPanel.rightToLeft = that.rightToLeft;
            sortPanel.set('dataSource', sortPanelDataSource);
            sortPanel.propertyChangedHandler('dataSource', undefined, sortPanelDataSource);
        }

        that._openHeaderDropDown(that.$.sortButton);
    }

    /**
     * Removes filtering.
     */
    removeFilter() {
        this.addFilter([]);
    }

    /**
     * Removes a record.
     * 
     * @param {Number/String} recordId The id of the record to remove.
     */
    removeRecord(recordId) {
        const that = this,
            scrolling = that.scrolling;

        function refresh() {
            const dataSource = that.dataSource,
                record = dataSource.find(record => record.$.id === recordId);

            if (!record) {
                return;
            }

            const indexInSource = dataSource.indexOf(record),
                indexInVisibleSource = that._visibleSource.indexOf(record);

            dataSource.remove(indexInSource);

            if (dataSource !== that._visibleSource) {
                if (indexInVisibleSource === -1) {
                    return;
                }

                that._visibleSource.splice(indexInVisibleSource, 1);
            }

            that._closeSearchPanel();
            that._fullRefresh();
        }

        if (scrolling === 'physical' || scrolling === 'deferred') {
            refresh();
            return;
        }

        // 'virtual'/'infinite' scroll modes
        function commit(result) {
            if (result) {
                refresh();
            }
        }

        if (that.onRecordRemoved) {
            that.onRecordRemoved(recordId, commit);
        }
    }

    /**
     * Removes sorting.
     */
    removeSort() {
        this.addSort({ dataFields: [], dataTypes: [], orderBy: [] });
    }

    /**
     * Shows a column.
     *
     * @param {String} dataField The data field of the column.
     */
    showColumn(dataField) {
        this._toggleColumn(dataField, true);
    }

    /**
    * Updates the CardView when a property is  changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value.
    * @param {number/string} newValue The new entered value.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'allowDrag':
            case 'coverMode':
            case 'onRecordInserted':
            case 'onRecordRemoved':
                break;
            case 'addNewButton':
                if (newValue && that.dataSource.dataFields.length === 0) {
                    that.addNewButton = false;
                }

                break;
            case 'animation':
            case 'theme':
                that._cards.forEach(card => {
                    const carousel = card.getElementsByTagName('smart-carousel');

                    if (carousel) {
                        carousel[propertyName] = newValue;
                    }
                });

                if (that._editInfo) {
                    that._editInfo.window[propertyName] = newValue;

                    for (let dataField in that._editInfo.editors) {
                        that._editInfo.editors[dataField].element[propertyName] = newValue;
                    }
                }

                if (that._customizePartCreated) {
                    that.$.customize.firstElementChild.firstElementChild.children[1][propertyName] = newValue;
                    that.$.customize.firstElementChild.children[1][propertyName] = newValue;
                    that.$.customize.children[1][propertyName] = newValue;
                }

                if (that._filterPartCreated) {
                    that.$.filter.firstElementChild[propertyName] = newValue;
                }

                if (that._sortPartCreated) {
                    that.$.sort.firstElementChild[propertyName] = newValue;
                }

                break;
            case 'disabled':
                that.closePanel();

                if (that._editInfo) {
                    that._editInfo.window.disabled = newValue;
                }

                break;
            case 'cardHeight':
                that._updateCardHeight(newValue);
                break;
            case 'cellOrientation':
            case 'collapsible':
                if (!that.dataSource || that.dataSource.length === 0) {
                    return;
                }

                that._fullRefresh();
                break;
            case 'columns':
                that._updateColumns();
                break;
            case 'coverField':
            case 'titleField': {
                if (newValue !== null) {
                    const validColumn = that.columns.find(column => column.dataField === newValue);

                    if (!validColumn || propertyName === 'coverField' && !validColumn.image) {
                        that[propertyName] = oldValue;
                        return;
                    }
                }

                that._createTemplate();

                if (!that.dataSource || that.dataSource.length === 0) {
                    return;
                }

                that._fullRefresh();
                break;
            }
            case 'dataSource':
                that._close();
                that._normalizeDataSource();
                that._getVisibleRecords();
                that._clearFilterAndSortUI();
                that._normalizeColumns();
                that._createTemplate();
                that._fullRefresh(false);
                break;
            case 'editable':
                if (!newValue && that._editInfo) {
                    that._editInfo.window.close();
                }

                break;
            case 'headerPosition':
                that._handleHeaderPosition();

                if ((newValue === 'none' || oldValue === 'none') &&
                    that.dataSource && that.dataSource.length > 0) {
                    that._partialRefresh();
                }

                break;
            case 'locale':
            case 'messages':
                that.closePanel();
                that._localizeHeader();
                that._getInnerElementMessages();

                if (that._editInfo) {
                    const window = that._editInfo.window;

                    window.$.buttonsContainer.firstElementChild.title = that.localize('previousRecord');
                    window.$.buttonsContainer.children[1].title = that.localize('nextRecord');
                    window.$.footer.firstElementChild.innerHTML = that.localize('ok');
                    window.$.footer.children[1].innerHTML = that.localize('cancel');

                    Array.from(window.getElementsByClassName('toggle-visibility')).forEach(element => element.title = that.localize('toggleVisibility'));
                    Array.from(window.querySelectorAll('.smart-card-view-editor.image')).forEach(element => {
                        Array.from(element.firstElementChild.children).forEach(thumbnail => thumbnail.title = that.localize('removeImage'));
                        element.children[1].innerHTML = that.localize('imageUrl');
                        element.children[2].children[1].title = that.localize('addImage');
                    });

                    Array.from(window.getElementsByTagName('smart-date-time-picker')).forEach(element => {
                        element.messages = that._innerElementMessages.dateTimePicker;
                        element.locale = that.locale;
                    });
                }

                if (that._customizePartCreated) {
                    const switchButton = that.$.customize.getElementsByTagName('smart-switch-button')[0];

                    that.$.customize.firstElementChild.firstElementChild.firstElementChild.innerHTML = that.localize('coverField');
                    that.$.customize.children[1].messages = that._innerElementMessages.columnPanel;
                    that.$.customize.children[1].locale = that.locale;
                    switchButton.setAttribute('crop', that.localize('crop'));
                    switchButton.setAttribute('fit', that.localize('fit'));
                }

                if (that._filterPartCreated) {
                    that.$.filter.firstElementChild.messages = that._innerElementMessages.multiColumnFilterPanel;
                    that.$.filter.firstElementChild.locale = that.locale;
                    that.$.filter.firstElementChild.editorPlaceholder = that.localize('filterValuePlaceholder');
                }

                if (that._sortPartCreated) {
                    that.$.sort.firstElementChild.messages = that._innerElementMessages.sortPanel;
                    that.$.sort.firstElementChild.locale = that.locale;
                }

                break;
            case 'rightToLeft':
                if (that._editInfo && !that._editInfo.updateWindowContent) {
                    that._editInfo.window.rightToLeft = newValue;
                    that.columns.forEach(function (column) {
                        const editorInfo = that._editInfo.editors[column.dataField],
                            element = editorInfo.element;

                        if (editorInfo.type === 'date') {
                            element.calendarButtonPosition = newValue ? 'left' : 'right';
                        }
                        else if (editorInfo.type === 'number') {
                            if (newValue) {
                                element.spinButtonsPosition = 'left';
                                element.radixDisplayPosition = 'right';
                            }
                            else {
                                element.spinButtonsPosition = 'right';
                                element.radixDisplayPosition = 'left';
                            }
                        }
                        else if (editorInfo.type === 'string' && element instanceof HTMLTextAreaElement) {
                            that.rightToLeft ? element.setAttribute('right-to-left', '') : element.removeAttribute('right-to-left');
                        }

                        element.rightToLeft = that.rightToLeft;
                    });
                }

                that.closePanel();
                break
            case 'scrolling': {
                const virtualModes = ['virtual', 'infinite'];

                if (virtualModes.indexOf(newValue) !== -1 || virtualModes.indexOf(oldValue) !== -1) {
                    // cannot switch from/to 'virtual' or 'infinite' "scrolling", because "dataSource" has been set up for a particular mode
                    that.scrolling = oldValue;
                    return;
                }

                that.$.scrollViewer.$.verticalScrollBar.mechanicalAction =
                    newValue === 'deferred' ? 'switchWhenReleased' : 'switchWhileDragging';
                break;
            }
        }
    }

    /**
     * Updates the columns property.
     */
    _updateColumns() {
        const that = this;

        that._normalizeColumns();
        that._createTemplate();
        that._fullRefresh();
    }

    /**
     * "Add new" button (+) click handler.
     */
    _addNewButtonClickHandler() {
        this._openEditDialog();
    }

    /**
     * click handler.
     */
    _clickHandler(event) {
        const that = this,
            target = that.isInShadowDOM || that.shadowRoot ? event.composedPath()[0] : event.target;

        if (that.$.header.contains(target)) {
            that._headerClickHandler(event);
            return;
        }

        const card = target.closest('smart-card');

        if (!card || target.classList.contains('smart-indicator') ||
            that._dragDetails && that._dragDetails.feedbackShown) {
            return;
        }

        if (that._dragDetails) {
            delete that._dragDetails;
            that.$.scrollViewer._scrollView.disableSwipeScroll = false;
        }

        if (!target.classList.contains('smart-arrow-up')) {
            if (that.editable && !that._clickToDrag) {
                that._openEditDialog(card.dataId);
            }

            return;
        }

        const dataContainer = card.getElementsByClassName('smart-card-view-content')[0],
            recordId = that._visibleSource[card.dataId].$.id;

        dataContainer.removeEventListener('transitionend', that._transitionendHandlerExpand);
        dataContainer.removeEventListener('transitionend', that._transitionendHandlerCollapse);

        if (that._collapsed[recordId]) {
            delete that._collapsed[recordId];
            that._getNumberOfCollapsedRows();

            if (that.hasAnimation) {
                that._expandDataContainer(dataContainer);
            }
            else {
                card.classList.remove('collapsed');
                target.classList.remove('collapsed');
                dataContainer.classList.remove('smart-visibility-hidden');
                that._partialRefresh();
            }

            window.getSelection().removeAllRanges();
        }
        else {
            that._collapsed[recordId] = true;
            that._getNumberOfCollapsedRows();
            card.classList.add('collapsed');
            target.classList.add('collapsed');

            if (that.hasAnimation) {
                that._collapseDataContainer(dataContainer);
            }
            else {
                dataContainer.classList.add('smart-visibility-hidden');
                that._partialRefresh();
            }
        }
    }

    /**
     * Edit dialog click handler.
     */
    _windowClickHandler(event) {
        const window = this,
            that = window.ownerElement,
            target = event.target.shadowRoot ? event.composedPath()[0] : event.target;

        if (target.closest('.ok')) {
            that._editInfo.ok = true;
            window.close();
        }
        else if (target.closest('.cancel')) {
            window.close();
        }
        else if (target.closest('.add')) {
            const container = target.closest('.container'),
                input = container.firstElementChild;

            if (input.value.trim() !== '') {
                const newImage = document.createElement('div');

                newImage.className = 'thumbnail';
                newImage.style.backgroundImage = `url("${input.value}")`;
                newImage.title = that.localize('removeImage');
                container.parentElement.firstElementChild.appendChild(newImage);
                input.value = '';
            }
        }
        else if (target.classList.contains('thumbnail')) {
            target.parentElement.removeChild(target);
        }
        else if (target.classList.contains('toggle-visibility')) {
            const column = that.columns.find(col => target.parentElement.getAttribute('data-field') === col.dataField);

            target.classList.toggle('hidden');
            that._changedVisibility.set(column, !target.classList.contains('hidden'));
        }
    }

    /**
     * Expands a card's data container.
     */
    _expandDataContainer(dataContainer) {
        const that = this,
            oldHeight = dataContainer.style.height,
            containerHeight = (that._cardContentHeight - that._verticalOffset) + 'px';

        dataContainer.style.height = containerHeight;
        dataContainer.classList.remove('smart-visibility-hidden');
        dataContainer.previousElementSibling.children[1].classList.remove('collapsed');

        if (oldHeight === containerHeight ||
            !parseFloat(oldHeight) && !parseFloat(containerHeight)) {
            that._transitionendHandlerExpand(that, dataContainer);
            return;
        }

        dataContainer.addEventListener('transitionend', that._transitionendHandlerExpand);
    }

    /**
     * Expand animation transitionend handler.
     */
    _transitionendHandlerExpand() {
        let cardView, container;

        if (arguments.length === 1) {
            container = this;
            cardView = cardView = container.closest('smart-card-view') || (container.getRootNode() && container.getRootNode().host ?
                container.getRootNode().host.closest('smart-card-view') : undefined);
        }
        else {
            cardView = arguments[0];
            container = arguments[1];
        }

        container.removeEventListener('transitionend', cardView._transitionendHandlerExpand);
        container.style.height = null;
        container.parentElement.parentElement.parentElement.classList.remove('collapsed');
        cardView._partialRefresh();
    }

    /**
     * Collapses a card's data container.
     */
    _collapseDataContainer(dataContainer) {
        const that = this,
            containerHeight = (that._cardContentHeight - that._verticalOffset) + 'px';

        dataContainer.style.transition = 'none';

        requestAnimationFrame(function () {
            dataContainer.style.height = containerHeight;
            dataContainer.style.transition = null;

            requestAnimationFrame(function () {
                dataContainer.style.height = '0px';
                dataContainer.classList.add('smart-visibility-hidden');

                if (containerHeight === '0px') {
                    that._transitionendHandlerCollapse(that, dataContainer);
                }
            });
        });

        dataContainer.addEventListener('transitionend', that._transitionendHandlerCollapse);
    }

    /**
     * Collapse animation transitionend handler.
     */
    _transitionendHandlerCollapse() {
        let cardView, container;

        if (arguments.length === 1) {
            container = this;
            cardView = container.closest('smart-card-view') || (container.getRootNode() && container.getRootNode().host ?
                container.getRootNode().host.closest('smart-card-view') : undefined);
        }
        else {
            cardView = arguments[0];
            container = arguments[1];
        }

        container.removeEventListener('transitionend', cardView._transitionendHandlerCollapse);
        container.style.height = null;
        cardView._partialRefresh();
    }

    /**
     * Gets the number of collapsed rows.
     */
    _getNumberOfCollapsedRows() {
        const that = this,
            dataSource = that._visibleSource,
            cardsPerRow = that._cardsPerRow,
            processedRows = [],
            collapsedRows = {};
        let number = 0;

        for (let recordId in that._collapsed) {
            const recordIndex = dataSource.findIndex ? dataSource.findIndex(record => record.$.id.toString() === recordId) :
                dataSource.boundSource.findIndex(record => record.$.id.toString() === recordId),
                row = Math.floor(recordIndex / cardsPerRow);

            if (processedRows.indexOf(row) !== -1) {
                continue;
            }

            const firstIndex = Math.max(0, row * cardsPerRow);
            let rowCollapsed = true;

            processedRows.push(row);

            for (let i = 0; i < cardsPerRow; i++) {
                const currentRecord = dataSource[i + firstIndex];

                if (!currentRecord) {
                    break;
                }

                if (!that._collapsed[currentRecord.$.id]) {
                    rowCollapsed = false;
                    break;
                }
            }

            if (rowCollapsed) {
                collapsedRows[row] = true;
                number++;
            }
        }

        that._collapsedRows = collapsedRows;
        that._numberOfCollapsedRows = number;
    }

    /**
     * Opens edit dialog.
     */
    _openEditDialog(dataId) {
        const that = this,
            dataSource = that._visibleSource,
            record = dataSource[dataId],
            openingEvent = that.$.fireEvent('opening', { record: record });

        if (openingEvent.defaultPrevented) {
            return;
        }

        that.setAttribute('modal', '');

        that.closePanel();
        that._changedVisibility = new Map();

        if (that._editInfo && !that._editInfo.updateWindowContent) {
            that._updateEditedView(dataId, true);
            return;
        }

        const structureFragment = document.createDocumentFragment(),
            editors = {};

        that.columns.forEach(function (column) {
            const dataField = column.dataField,
                value = record ? record[dataField] : '',
                label = document.createElement('div');
            let editor;

            label.className = `smart-card-view-label${column.icon ? ' icon ' + column.icon : ''}`;
            label.setAttribute('data-field', dataField);
            label.innerHTML = `${column.label}<span class="toggle-visibility${column.visible === false ? ' hidden' : ''}${
                (dataField === that.coverField || dataField === that.titleField) ? ' smart-hidden' : ''}" title="${that.localize('toggleVisibility')}" role="button" aria-label="Toggle field visibility"></span>`;
            structureFragment.appendChild(label);

            if (column.image) {
                editor = document.createElement('div');
                editor.className = 'smart-card-view-editor image';
                editor.setAttribute('aria-label', column.label);
                editor.innerHTML = `<div>${that._updateImgThumbNails(value)}</div>
<div class="label">${that.localize('imageUrl')}</div>
<div class="container" role="presentation">
    <smart-input aria-label="New image URL"></smart-input>
    <smart-button class="add" title=${that.localize('addImage')} aria-label="Add image">+</smart-button>
</div>`;
                structureFragment.appendChild(editor);
                editors[dataField] = { element: editor, type: 'image' };
                return;
            }

            const type = that.dataSource.dataFields.find(dataField => dataField.name === column.dataField).dataType;

            if (type === 'date') {
                editor = document.createElement('smart-date-time-picker');
                editor.calendarButton = true;
                editor.calendarButtonPosition = that.rightToLeft ? 'left' : 'right';
                editor.dropDownAppendTo = 'body';
                editor.dropDownDisplayMode = 'auto';
                editor.dropDownPosition = 'bottom';
                editor.locale = that.locale;
                editor.messages = that._innerElementMessages.dateTimePicker;
                editor.nullable = true;
                editor.value = value || null;

                if (column.formatSettings && column.formatSettings.formatString) {
                    editor.formatString = column.formatSettings.formatString;
                }
            }
            else if (type === 'number') {
                editor = document.createElement('smart-numeric-text-box');
                editor.inputFormat = 'floatingPoint';
                editor.spinButtons = true;
                editor.nullable = true;

                if (that.rightToLeft) {
                    editor.spinButtonsPosition = 'left';
                    editor.radixDisplayPosition = 'right';
                }

                editor.value = value !== undefined && value !== null ? value : null;

                if (column.formatSettings && column.formatSettings.formatString) {
                    editor.outputFormatString = column.formatSettings.formatString;
                }
            }
            else if (type === 'boolean') {
                editor = document.createElement('smart-check-box');
                editor.checked = value || false;
            }
            else {
                if (typeof value === 'string' && value.length > 50) {
                    editor = document.createElement('textarea');

                    if (that.rightToLeft) {
                        editor.setAttribute('right-to-left', '');
                    }
                }
                else {
                    editor = document.createElement('smart-input');
                }

                editor.value = value !== undefined && value !== null ? value.toString() : '';
            }

            editor.className = 'smart-card-view-editor';
            editor.setAttribute('aria-label', column.label);
            editor.animation = that.animation;
            editor.theme = that.theme;
            editor.rightToLeft = that.rightToLeft;
            structureFragment.appendChild(editor);

            editors[dataField] = { element: editor, type: type };
        });

        if (that._editInfo && that._editInfo.updateWindowContent) {
            that._editInfo.window.clear();
            that._editInfo.window.appendChild(structureFragment);

            that._openWindow();
            that._editInfo.dataId = dataId;
            that._editInfo.editors = editors;
            delete that._editInfo.updateWindowContent;
            return;
        }

        const window = document.createElement('smart-window'),
            footerTemplate = document.createElement('template');

        footerTemplate.innerHTML = `<smart-button class="ok primary">${that.localize('ok')}</smart-button>
                                    <smart-button class="cancel">${that.localize('cancel')}</smart-button>`;

        window.classList.add('smart-card-view-window', 'smart-visibility-hidden');
        window.footerTemplate = footerTemplate;
        window.headerButtons = ['close', 'next', 'prev'];
        window.label = record ? record[that.titleField] : '';
        window.animation = that.animation;
        window.rightToLeft = that.rightToLeft;
        window.theme = that.theme;
        window.ownerElement = that;
        window.appendChild(structureFragment);
        document.body.appendChild(window);

        that._editInfo = { dataId: dataId, editors: editors, window: window };
        that._addWindowHandlers();

        window.whenRendered(() => {
            that.setAttribute('aria-owns', window.id);
            window.$.buttonsContainer.firstElementChild.title = that.localize('previousRecord');
            window.$.buttonsContainer.children[1].title = that.localize('nextRecord');
            that._openWindow();
        });
    }

    /**
     * Opens the instance of smartWindow.
     */
    _openWindow() {
        const smartWindow = this._editInfo.window,
            clientWidth = document.documentElement.clientWidth,
            clientHeight = document.documentElement.clientHeight,
            pageXOffset = window.pageXOffset,
            pageYOffset = window.pageYOffset;

        smartWindow.style.top = ((clientHeight - smartWindow.offsetHeight) / 2 + pageYOffset) + 'px';
        smartWindow.style.left = ((clientWidth - smartWindow.offsetWidth) / 2 + pageXOffset) + 'px';
        smartWindow.open();
    }

    /**
     * Adds window handlers.
     */
    _addWindowHandlers() {
        const that = this,
            window = that._editInfo.window;

        window.addEventListener('open', that._windowEventHandler);
        window.addEventListener('closing', that._windowEventHandler);
        window.addEventListener('close', that._windowEventHandler);
        window.addEventListener('click', that._windowClickHandler);
        window.addEventListener('prev', that._prevNextHandler);
        window.addEventListener('next', that._prevNextHandler);
    }

    /**
     * Edit dialog event handler.
     */
    _windowEventHandler(event) {
        const that = this.ownerElement,
            type = event.type,
            oldContext = that.context;

        if (event.target !== this) {
            // event is triggered from an editor
            return;
        }

        that.context = that;

        if (type === 'open') {
            that.$.fireEvent('open');
        }
        else if (type === 'closing') {
            const customEvent = that.$.fireEvent('closing');

            if (customEvent.defaultPrevented) {
                event.preventDefault();
            }
        }
        else if (type === 'close') {
            that.$.fireEvent('close');
            that._windowCloseHandler(event);
        }

        that.context = oldContext;
    }

    /**
     * Updates edited view.
     */
    _updateEditedView(dataId, toOpen) {
        const that = this,
            record = that._visibleSource[dataId];

        if (record && record.isEmpty) {
            return;
        }

        that._editInfo.dataId = dataId;

        that.columns.forEach(function (column) {
            const dataField = column.dataField,
                value = record ? record[dataField] : '',
                editorInfo = that._editInfo.editors[dataField];

            if (editorInfo.type === 'image') {
                editorInfo.element.firstElementChild.innerHTML = that._updateImgThumbNails(value);
            }
            else if (editorInfo.type === 'boolean') {
                editorInfo.element.checked = value || false;
            }
            else if (editorInfo.type === 'date') {
                editorInfo.element.value = value || null;
            }
            else if (editorInfo.type === 'number') {
                editorInfo.element.value = value !== undefined && value !== null ? value : null;
            }
            else {
                if (editorInfo.element instanceof HTMLTextAreaElement) {
                    that.rightToLeft ? editorInfo.element.setAttribute('right-to-left', '') : editorInfo.element.removeAttribute('right-to-left');
                }

                editorInfo.element.value = value !== undefined && value !== null ? value.toString() : '';
            }

            editorInfo.element.rightToLeft = that.rightToLeft;
        });

        that._editInfo.window.label = record ? record[that.titleField] : '';

        if (toOpen) {
            that._openWindow();
        }
    }

    /**
     * Updates image thumbnails in editor.
     */
    _updateImgThumbNails(value) {
        if (value.trim() === '') {
            return '';
        }

        const urlList = value.split(',').map(url => url.trim());
        let htmlResult = '';

        urlList.forEach(url => htmlResult += `<div class="thumbnail" style="background-image: url('${url}');" title="${this.localize('removeImage')}" role="img"></div>`);
        return htmlResult;
    }

    /**
     * move event handler.
     */
    _moveHandler(event) {
        if (event.originalEvent.type === 'touchmove') {
            event.originalEvent.preventDefault();
        }
    }

    /**
     * "prev"/"next" button click handler.
     */
    _prevNextHandler(event) {
        const that = this.ownerElement,
            oldContext = that.context,
            dataId = that._editInfo.dataId,
            nextDataId = event.type === 'prev' ? dataId - 1 : dataId + 1;

        if (that._visibleSource[nextDataId] && !that._visibleSource[nextDataId].isEmpty) {
            that.context = that;
            that._saveChanges();
            that._updateEditedView(nextDataId);
            that.context = oldContext;
        }
    }

    /**
     * Saves changes.
     */
    _saveChanges() {
        const that = this,
            dataId = that._editInfo.dataId;
        let record, card;

        if (dataId !== undefined) {
            // saving changes to existing record
            const cardsWithDataId = that._cards.filter(card => card.dataId === dataId);

            record = that._visibleSource[dataId];
            card = cardsWithDataId[cardsWithDataId.length - 1];
        }
        else {
            // adding a new record
            record = {};
        }

        that.columns.forEach(function (column) {
            const dataField = column.dataField,
                editorInfo = that._editInfo.editors[dataField],
                element = editorInfo.element;

            if (editorInfo.type === 'image') {
                const newUrls = [];

                Array.from(editorInfo.element.getElementsByClassName('thumbnail')).forEach(thumbnail => {
                    newUrls.push(thumbnail.style.backgroundImage.replace(/url\(["'](.+)["']\)/g, '$1'));
                });

                record[dataField] = newUrls.join(',');

                if (card && dataField === that.coverField) {
                    card.firstElementChild.firstElementChild.dataSource = newUrls;
                    return;
                }
            }
            else if (editorInfo.type === 'boolean') {
                record[dataField] = element.checked;
            }
            else if (editorInfo.type === 'date') {
                record[dataField] = element.value ? element.value.toDate() : null;
            }
            else {
                record[dataField] = element.value;
            }

            if (card) {
                if (dataField === that.titleField) {
                    card.getElementsByClassName('smart-card-view-title')[0].firstElementChild.innerHTML = that._formatValue(record[dataField], record, column);
                }
                else if (column.visible) {
                    const field = card.querySelector(`[data-field="${dataField}"] > .smart-card-view-value`);

                    if (field) {
                        field.innerHTML = that._formatValue(record[dataField], record, column);
                    }
                }
            }
        });

        if (dataId === undefined) {
            that.addRecord(null, record);
        }
    }

    /**
     * Closes header panel (drop down) and edit dialog.
     */
    _close() {
        const that = this;

        that.closePanel();

        if (that._editInfo) {
            that._editInfo.window.close();
        }
    }

    /**
     * resize handler.
     */
    _resizeHandler() {
        const that = this;

        if (that._suppressResizeHandler || that.hasAttribute('empty') || that.hasAttribute('no-matches')) {
            return;
        }

        clearTimeout(that._resizeTimeout);
        that.$.loadingIndicatorContainer.classList.remove('smart-hidden');

        that._resizeTimeout = setTimeout(function () {
            that.$.loadingIndicatorContainer.classList.add('smart-hidden');
            if (that._cards.length === that._visibleSource.length) {
                // no virtual items

                // horizontal resize
                if (that.offsetWidth !== that._cachedWidth) {
                    const oldCardsPerRow = that._cardsPerRow;

                    that._getCardsPerRow();

                    if (oldCardsPerRow !== that._cardsPerRow) {
                        that._getNumberOfCollapsedRows();
                    }

                    that._cachedWidth = that.offsetWidth;
                }
                else {
                    that._cachedHeight = that.offsetHeight;
                }

                if (that._cards.length > 0) {
                    if (that._autoCardHeight) {
                        that._updateCardHeight(null);
                    }

                    that.$.scrollViewer.refresh();
                }

                return;
            }

            // vertical resize
            if (that.offsetHeight !== that._cachedHeight) {
                that._cachedHeight = that.offsetHeight;

                if (Math.abs(that._refreshedAtDimensions.height - that._cachedHeight) >= 20) {
                    that._dataSourceProcessed = true;
                    that._partialRefresh();
                    delete that._dataSourceProcessed;
                }
                else {
                    that.$.scrollViewer.$.verticalScrollBar.max = Math.max(0, that._scrollHeight - that.$.scrollViewer.$.scrollViewerContainer.offsetHeight - that._numberOfCollapsedRows * that._cardContentHeight);
                }
            }

            // horizontal resize
            if (that.offsetWidth !== that._cachedWidth) {
                const oldCardsPerRow = that._cardsPerRow;

                that._cachedWidth = that.offsetWidth;
                that._getCardsPerRow();

                if (oldCardsPerRow !== that._cardsPerRow) {
                    that._dataSourceProcessed = true;
                    that._partialRefresh();
                    delete that._dataSourceProcessed;
                }
            }
        }, 75);
    }

    /**
     * Edit window close handler.
     */
    _windowCloseHandler() {
        const that = this;

        that.removeAttribute('modal');

        if (that._editInfo.ok) {
            // OK
            that._updateColumnsVisibility(function () {
                that._saveChanges();
            });
            delete that._editInfo.ok;
            return;
        }

        // Cancel
        that._changedVisibility.forEach(function (visible, column) {
            if (column.visible !== visible) {
                that._editInfo.window.querySelector(`[data-field="${column.dataField}"]`).
                    firstElementChild.classList.toggle('hidden');
            }
        });
    }

    /**
     * Updates the visibility of columns.
     */
    _updateColumnsVisibility(callback, skipValidation) {
        const that = this;
        let updateHeight = false;

        that._changedVisibility.forEach(function (visible, column) {
            if (skipValidation !== true && column.visible === visible) {
                return;
            }

            const dataField = column.dataField;

            column.visible = visible;

            if (visible) {
                that._cardContent = that._cardContent.replace(`class="smart-card-view-cell smart-hidden" data-field="${dataField}"`,
                    `class="smart-card-view-cell" data-field="${dataField}"`);

                if (!callback && that._editInfo) {
                    that._editInfo.window.querySelector(`[data-field="${dataField}"]`).firstElementChild.classList.remove('hidden');
                }
            }
            else {
                that._cardContent = that._cardContent.replace(`class="smart-card-view-cell" data-field="${dataField}"`,
                    `class="smart-card-view-cell smart-hidden" data-field="${dataField}"`);

                if (!callback && that._editInfo) {
                    that._editInfo.window.querySelector(`[data-field="${dataField}"]`).firstElementChild.classList.add('hidden');
                }
            }

            that._cards.forEach(card => {
                const cell = card.querySelector(`[data-field="${dataField}"]`);

                cell.classList.toggle('smart-hidden');

                if (visible) {
                    const record = that._visibleSource[card.dataId];

                    cell.children[1].innerHTML = that._formatValue(record[dataField], record, column);
                }
            });
            updateHeight = true;
        });

        if (callback) {
            callback();
        }

        if (that._autoCardHeight && updateHeight) {
            that._updateCardHeight(null);
        }
    }

    /**
     * Header panels apply handler.
     */
    _applyHandler(event) {
        const that = this,
            target = event.target,
            detail = event.detail,
            customize = that.$.customize,
            columns = that.columns;

        if (customize.contains(target)) {
            const switchButton = customize.getElementsByTagName('smart-switch-button')[0],
                input = customize.getElementsByTagName('smart-input')[0],
                newCoverMode = switchButton.checked ? 'fit' : 'crop';
            let newCoverField = columns.find(col => col.label === input.value) || null,
                differentCoverField = false;

            if (newCoverMode !== that.coverMode) {
                that.coverMode = newCoverMode;
            }

            if (newCoverField) {
                newCoverField = newCoverField.dataField;
            }

            if (newCoverField !== that.coverField) {
                that.coverField = newCoverField;
                differentCoverField = true;
            }

            if (differentCoverField || detail.positionChanged) {
                if (detail.positionChanged) {
                    that.columns = detail.value;
                }

                that._createTemplate();
                that._fullRefresh();

                if (detail.positionChanged && that._editInfo) {
                    that._editInfo.updateWindowContent = true;
                }
            }
            else {
                detail.value.forEach(col => {
                    const cardViewColumn = columns.find(column => column.dataField === col.dataField);

                    if (cardViewColumn.visible !== col.visible) {
                        that._changedVisibility.set(cardViewColumn, col.visible);
                    }
                });
                that._updateColumnsVisibility();
            }
        }
        else if (that.$.filter.contains(target)) {
            that.addFilter(detail.filters, detail.operator, detail.value);
        }
        else if (that.$.sort.contains(target)) {
            that.addSort(detail.sortByInfo);
        }

        that.closePanel();
    }

    /**
     * Makes a full refresh of the view.
     */
    _fullRefresh(preserveScrolling = true) {
        const that = this,
            cardContainer = that.$.cardContainer;
        let fraction;

        if (preserveScrolling) {
            fraction = that._getFractionOfMax();
        }

        that._suppressResizeHandler = true;

        while (cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.firstChild);
        }

        that._cards = [];
        that._createCards();

        if (that._visibleSource.length === 0) {
            that.$.scrollViewer.refresh();
        }

        that._setFractionOfMax(fraction);
    }

    /**
     * Normalizes the representation of the data source.
     */
    _normalizeDataSource() {
        const that = this;
        let dataSource = that.dataSource;

        function getDataFieldsFromColumns() {
            if (that.columns.length === 0) {
                that.addNewButton = false;
                return [];
            }

            const dataFields = [];

            that.columns.forEach(column => {
                try {
                    dataFields.push({ name: column.dataField || column.label || column, dataType: 'string' });
                }
                catch (error) {
                    return;
                }
            });

            return dataFields;
        }

        if (dataSource instanceof Smart.DataAdapter) {
            if (dataSource.dataFields.length === 0) {
                dataSource.dataFields = getDataFieldsFromColumns();
            }

            return;
        }

        if (!dataSource) {
            dataSource = [];
        }
        else if (!Array.isArray(dataSource)) {
            if (typeof dataSource === 'object' && Object.keys(dataSource).length > 0) {
                dataSource = [dataSource];
            }
            else {
                that.error(that.localize('incorrectStructure'));
                return;
            }
        }

        let dataFields = [];

        if (dataSource.length === 0) {
            dataFields = getDataFieldsFromColumns();
        }
        else {
            let i = 0,
                record = dataSource[i],
                keys = Object.keys(record);

            while (record && keys.length === 0) {
                i++;
                record = dataSource[i];
                keys = Object.keys(record);
            }

            if (keys.length === 0) {
                dataFields = getDataFieldsFromColumns();
            }
            else {
                keys.forEach(key => {
                    const value = record[key];
                    let type;

                    if (value.constructor === Date) {
                        type = 'date';
                    }
                    else if (typeof value === 'boolean') {
                        type = 'boolean';
                    }
                    else if (!isNaN(value) && value !== null && value !== '') {
                        type = 'number';
                    }
                    else {
                        type = 'string';
                    }

                    dataFields.push(`${key}: ${type}`);
                });
            }
        }

        that.dataSource = new Smart.DataAdapter({ dataSource: dataSource, dataFields: dataFields });
    }

    /**
     * Normalizes the representation of the columns.
     */
    _normalizeColumns() {
        const that = this,
            columns = that.columns,
            dataFields = that.dataSource.dataFields,
            validColumns = [];

        if (!Array.isArray(columns) && !(columns instanceof Smart.ObservableArray)) {
            return;
        }

        columns.forEach(column => {
            let columnDataField, formatFunction, formatSettings, icon, image, label, template, visible;

            if (typeof column === 'object') {
                columnDataField = column.dataField;
                formatFunction = column.formatFunction;
                formatSettings = column.formatSettings;
                icon = column.icon;
                image = column.image || false;
                label = column.label || columnDataField;
                template = column.template;
                visible = columnDataField !== that.titleField && columnDataField !== that.coverField ?
                    (column.visible !== undefined ? column.visible : true) : true;
            }
            else if (typeof column === 'string') {
                columnDataField = column;
                image = false;
                label = columnDataField;
                visible = true;
            }

            if (dataFields.find(dataField => dataField.name === columnDataField)) {
                validColumns.push({ dataField: columnDataField, formatFunction: formatFunction, formatSettings: formatSettings, icon: icon, image: image, label: label, template: template, visible: visible });
            }
        });

        if (validColumns.length === 0) {
            dataFields.forEach(dataField => {
                validColumns.push({ dataField: dataField.name, image: false, label: dataField.name, visible: true });
            });
        }

        if (!validColumns.find(col => col.dataField === that.titleField)) {
            that.titleField = null;
        }

        if (!validColumns.find(col => col.dataField === that.coverField && col.image)) {
            that.coverField = null;
        }

        that.columns = new Smart.ObservableArray(validColumns);
        that.columns.canNotify = true;
        that.columns.notify(function (changeArgs) {
            if (that.context !== that && changeArgs.newValue !== changeArgs.oldValue) {
                that._close();

                if (changeArgs.action === 'update') {
                    const column = changeArgs.target;

                    switch (changeArgs.propertyName) {
                        case 'dataField':
                            that._updateColumns();
                            break;
                        case 'formatFunction':
                        case 'formatSettings':
                        case 'template':
                            that._createTemplate();
                            that._fullRefresh();
                            break;
                        case 'icon':
                        case 'label':
                            if (column.dataField !== that.coverField && column.dataField !== that.titleField) {
                                that._createTemplate();
                                that._fullRefresh();
                            }

                            break;
                        case 'image':
                            if (!changeArgs.newValue &&
                                that.coverField === column.dataField) {
                                that.coverField = null;
                                that.propertyChangedHandler('coverField', column.dataField, null);
                            }
                            else {
                                that._createTemplate();
                                that._fullRefresh();
                            }
                            break;
                        case 'visible': {
                            const updatedColumnDataField = column.dataField;

                            if (!changeArgs.newValue &&
                                (updatedColumnDataField === that.coverField ||
                                    updatedColumnDataField === that.titleField)) {
                                column.visible = true;
                                return;
                            }

                            that._toggleColumn(updatedColumnDataField, changeArgs.newValue, true);
                            break;
                        }
                    }
                }
                else {
                    that._updateColumns();
                }

                if (that._editInfo) {
                    that._editInfo.updateWindowContent = true;
                }
            }
        });

        if (that._editInfo) {
            that._editInfo.updateWindowContent = true;
        }
    }

    /**
     * Handles header position.
     */
    _handleHeaderPosition() {
        const that = this,
            headerPosition = that.headerPosition,
            header = that.$.header;

        if (headerPosition === 'none') {
            that.$header.addClass('smart-hidden');
            return;
        }

        that.$header.removeClass('smart-hidden');

        if (headerPosition === 'top' && header.nextElementSibling !== that.$.scrollViewer) {
            that.$.container.insertBefore(header, that.$.scrollViewer);
        }
        else if (headerPosition === 'bottom' && header.previousElementSibling !== that.$.scrollViewer) {
            that.$.container.insertBefore(header, that.$.loadingIndicatorContainer);
        }
    }

    /**
     * Localizes labels in the header.
     */
    _localizeHeader() {
        const that = this;

        that.$.customizeCardsButton.firstElementChild.innerHTML = that.localize('customizeCards');

        if (that._appliedFiltering.filters.length === 0) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
        }
        else if (that._appliedFiltering.filters.length === 1) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByOne');
        }
        else {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByMultiple', { n: that._appliedFiltering.filters.length });
        }

        if (that._appliedSorting.dataFields.length === 0) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
        }
        else if (that._appliedSorting.dataFields.length === 1) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByOne');
        }
        else {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByMultiple', { n: that._appliedSorting.dataFields.length });
        }

        that.$.searchInput.placeholder = that.localize('findInView');

        that.$.cardContainer.setAttribute('no-data', that.localize('noData'));
        that.$.cardContainer.setAttribute('no-matches', that.localize('noMatches'));
    }

    /**
     * Gets messages used for localization of inner custom elements.
     */
    _getInnerElementMessages() {
        const that = this,
            locale = that.locale,
            innerElementMessages = {};

        innerElementMessages.columnPanel = {};
        innerElementMessages.multiColumnFilterPanel = {};
        innerElementMessages.sortPanel = {};
        innerElementMessages.dateTimePicker = {};

        innerElementMessages.columnPanel[locale] = {
            'apply': that.localize('apply'),
            'cancel': that.localize('cancel'),
            'find': that.localize('find'),
            'noResults': that.localize('noResults')
        };

        innerElementMessages.multiColumnFilterPanel[locale] = {
            'addFilter': that.localize('addFilter'),
            'and': that.localize('and'),
            'apply': that.localize('apply'),
            'cancel': that.localize('cancel'),
            'CONTAINS': that.localize('CONTAINS'),
            'CONTAINS_CASE_SENSITIVE': that.localize('CONTAINS_CASE_SENSITIVE'),
            'DOES_NOT_CONTAIN': that.localize('DOES_NOT_CONTAIN'),
            'DOES_NOT_CONTAIN_CASE_SENSITIVE': that.localize('DOES_NOT_CONTAIN_CASE_SENSITIVE'),
            'EMPTY': that.localize('EMPTY'),
            'ENDS_WITH': that.localize('ENDS_WITH'),
            'ENDS_WITH_CASE_SENSITIVE': that.localize('ENDS_WITH_CASE_SENSITIVE'),
            'EQUAL': that.localize('EQUAL'),
            'EQUAL_CASE_SENSITIVE': that.localize('EQUAL_CASE_SENSITIVE'),
            'GREATER_THAN': that.localize('GREATER_THAN'),
            'GREATER_THAN_OR_EQUAL': that.localize('GREATER_THAN_OR_EQUAL'),
            'LESS_THAN': that.localize('LESS_THAN'),
            'LESS_THAN_OR_EQUAL': that.localize('LESS_THAN_OR_EQUAL'),
            'noFilters': that.localize('noFilters'),
            'NOT_EMPTY': that.localize('NOT_EMPTY'),
            'NOT_EQUAL': that.localize('NOT_EQUAL'),
            'NOT_NULL': that.localize('NOT_NULL'),
            'NULL': that.localize('NULL'),
            'or': that.localize('or'),
            'STARTS_WITH': that.localize('STARTS_WITH'),
            'STARTS_WITH_CASE_SENSITIVE': that.localize('STARTS_WITH_CASE_SENSITIVE'),
            'where': that.localize('where')
        };

        innerElementMessages.sortPanel[locale] = {
            'apply': that.localize('apply'),
            'booleanFirst': that.localize('booleanFirst'),
            'booleanLast': that.localize('booleanLast'),
            'cancel': that.localize('cancel'),
            'dateFirst': that.localize('dateFirst'),
            'dateLast': that.localize('dateLast'),
            'firstBy': that.localize('firstBy'),
            'from': that.localize('from'),
            'numberFirst': that.localize('numberFirst'),
            'numberLast': that.localize('numberLast'),
            'noSorting': that.localize('noSorting'),
            'pickAnother': that.localize('pickAnother'),
            'stringFirst': that.localize('stringFirst'),
            'stringLast': that.localize('stringLast'),
            'thenBy': that.localize('thenBy')
        };

        innerElementMessages.dateTimePicker[locale] = {
            'now': that.localize('now'),
            'dateTabLabel': that.localize('dateTabLabel'),
            'timeTabLabel': that.localize('timeTabLabel')
        };

        that._innerElementMessages = innerElementMessages;
    }

    /**
     * Header click handler.
     */
    _headerClickHandler(event) {
        const that = this,
            headerDropDown = that.$.headerDropDown,
            target = that.isInShadowDOM || that.shadowRoot ? event.composedPath()[0] : event.target;

        function toggle(button, part, openMethod) {
            if (headerDropDown.classList.contains('smart-visibility-hidden') ||
                part.classList.contains('smart-hidden')) {
                if (headerDropDown.controlledBy) {
                    headerDropDown.controlledBy.removeAttribute('aria-controls');
                    headerDropDown.controlledBy.setAttribute('aria-expanded', false);
                }

                headerDropDown.controlledBy = button;
                button.setAttribute('aria-controls', headerDropDown.id);
                button.setAttribute('aria-expanded', true);
                that[openMethod]();
            }
            else {
                that.closePanel();
            }
        }

        if (that.$.customizeCardsButton.contains(target)) {
            toggle(that.$.customizeCardsButton, that.$.customize, 'openCustomizePanel');
        }
        else if (that.$.filterButton.contains(target)) {
            toggle(that.$.filterButton, that.$.filter, 'openFilterPanel');
        }
        else if (that.$.sortButton.contains(target)) {
            toggle(that.$.sortButton, that.$.sort, 'openSortPanel');
        }
        else if (target === that.$.searchButton) {
            toggle(target, that.$.search, '_openSearchPanel');
        }
        else if (target === that.$.searchClose) {
            that.closePanel();
        }
        else if (target === that.$.searchPrev || target === that.$.searchNext) {
            const searchInfo = that._searchInfo,
                foundIdsArray = searchInfo.foundIdsArray,
                next = target === that.$.searchNext,
                numberOfFoundItems = foundIdsArray.length;
            let indexToHighlight;

            if (searchInfo.highlighted === undefined) {
                indexToHighlight = next ? 0 : numberOfFoundItems - 1;
            }
            else if (foundIdsArray.length === 1) {
                return;
            }
            else {
                const previousHighlightedIndex = foundIdsArray.indexOf(searchInfo.highlighted),
                    highlightedCards = Array.from(that.$.cardContainer.getElementsByClassName('highlighted'));

                highlightedCards.forEach(highlightedCard => highlightedCard.classList.remove('highlighted'));

                indexToHighlight = next ? (previousHighlightedIndex + 1) % numberOfFoundItems :
                    previousHighlightedIndex - 1 >= 0 ? previousHighlightedIndex - 1 : numberOfFoundItems - 1;
            }

            searchInfo.highlighted = foundIdsArray[indexToHighlight];

            const card = that.ensureVisible(searchInfo.highlighted);

            card.classList.add('highlighted');

            that.$.searchLabel.innerHTML = that.localize('found', { nth: indexToHighlight + 1, n: foundIdsArray.length });
        }
    }

    /**
     * Opens search panel.
     */
    _openSearchPanel() {
        const that = this;
        let source;

        that.$.headerDropDown.classList.add('search-panel');
        that.$.headerDropDown.classList.remove('customize-panel', 'filter-panel', 'sort-panel');
        that.$.search.classList.remove('smart-hidden');
        that.$.customize.classList.add('smart-hidden');
        that.$.filter.classList.add('smart-hidden');
        that.$.sort.classList.add('smart-hidden');
        that._openHeaderDropDown(that.$.searchButton);

        if (Array.isArray(that._visibleSource)) {
            source = new Smart.DataAdapter({ dataSource: that._visibleSource, dataFields: that.dataSource.dataFields, id: '_id' });
        }
        else {
            const sortByInfo = that._appliedSorting;

            source = new Smart.DataAdapter({
                dataSource: that._visibleSource._dataSource,
                dataFields: that.dataSource.dataFields,
                id: that._visibleSource.id || undefined
            });

            if (sortByInfo.dataFields.length > 0) {
                source.sortBy(sortByInfo.dataFields, sortByInfo.dataTypes, sortByInfo.orderBy);
            }
        }

        that._searchInfo = {
            source: source,
            stringDataFields: that.dataSource.dataFields.filter(dataField => {
                return dataField.dataType === 'string' &&
                    that.columns.find(column => column.dataField === dataField.name && !column.image);
            }).map(dataField => dataField.name)
        }

        if (that.$.searchInput.value !== '') {
            that._search(that.$.searchInput.value, false);
        }
    }

    /**
     * Opens header drop down.
     */
    _openHeaderDropDown(target) {
        const that = this,
            dropDown = that.$.headerDropDown;

        if (that.headerPosition === 'top') {
            dropDown.style.bottom = null;
            dropDown.style.top = '100%';
        }
        else {
            dropDown.style.top = null;
            dropDown.style.bottom = '100%';
        }

        if (target !== that.$.searchButton) {
            dropDown.style.left = target.offsetLeft - (that.rightToLeft ? dropDown.offsetWidth - target.offsetWidth : 0) + 'px';
        }
        else {
            dropDown.style.left = (that.rightToLeft ? target.offsetLeft : target.offsetLeft + target.offsetWidth - dropDown.offsetWidth) + 'px';
        }

        dropDown.classList.remove('smart-visibility-hidden');
    }

    /**
     * Creates card template.
     */
    _createTemplate() {
        const that = this,
            titleField = that.titleField;
        let content = '';

        if (titleField) {
            content += `<div class="smart-card-view-title" data-field="${titleField}" role="heading" aria-level="1"><div>{{${titleField}}}</div><div class="smart-arrow-up" role="button" aria-label="Toggle card"></div></div>`;
        }
        else {
            content += '<div class="smart-card-view-title empty" role="heading" aria-level="1"><div>&nbsp;</div><div class="smart-arrow-up" role="button" aria-label="Toggle card"></div></div>';
        }

        content += '<div class="smart-card-view-content" role="grid">';

        that.columns.forEach(column => {
            const columnField = column.dataField;

            if (column.visible !== false) {
                column.visible = true;
            }

            if (columnField === titleField || columnField === that.coverField) {
                return;
            }

            content += `<div class="smart-card-view-cell${column.visible ? '' : ' smart-hidden'}" data-field="${columnField}" role="row"><div class="smart-card-view-label${column.icon ? ' icon ' + column.icon : ''}" role="rowheader">${column.label}</div>
<div class="smart-card-view-value" role="gridcell">{{${columnField}}}</div></div>`;
        });

        content += '</div>';
        that._cardContent = content;
    }

    /**
     * Requests initial cards when "scrolling" is 'infinite'.
     */
    _requestInitialCards() {
        const that = this;

        that.setAttribute('loading', '');
        that.$.loadingIndicatorContainer.classList.remove('smart-hidden');

        that.dataSource.onVirtualDataSourceRequested(function () {
            that._createCards();
            that.removeAttribute('loading');
            that.$.loadingIndicatorContainer.classList.add('smart-hidden');
        }, { first: Infinity, last: Infinity, sorting: [], filtering: [], grouping: [], action: '' });
    }

    /**
     * Creates cards and fills them with data.
     */
    _createCards() {
        const that = this,
            dataSource = that._visibleSource;

        if (!dataSource || dataSource.length === 0) {
            return;
        }

        const scrolling = that.scrolling,
            virtual = scrolling === 'virtual',
            viewHeight = that.$.scrollViewer.$.scrollViewerContainer.offsetHeight;
        let dataSourceLength = dataSource.length,
            numberOfRealRows = 1,
            currentRowOffsetTop = 0,
            maxHeight = 0,
            cardsPerRow;

        that._ignoreVerticalChange = true;
        that.removeAttribute('empty');

        if (virtual) {
            that.setAttribute('loading', '');
        }

        for (let i = 0; i < dataSourceLength; i++) {
            const card = that._createCard(dataSource[i], i);

            that._cards.push(card);
            that.$.cardContainer.appendChild(card);

            that.$.scrollViewer.refresh();

            if (that._autoCardHeight) {
                maxHeight = Math.max(card.offsetHeight, maxHeight);
            }

            if (card.offsetTop > currentRowOffsetTop) {
                numberOfRealRows++;
                currentRowOffsetTop = card.offsetTop;

                if (!cardsPerRow) {
                    that._getCardsPerRow();
                    cardsPerRow = that._cardsPerRow;
                }
            }

            if (numberOfRealRows >= 3 &&
                that._cards.length % cardsPerRow === 0 &&
                that.$.cardContainer.offsetHeight > viewHeight + 2 * (that.cardHeight || maxHeight) &&
                that._cards.length + 5 < dataSourceLength) {
                break;
            }
        }

        cardsPerRow = cardsPerRow || that._cards.length;

        if (scrolling === 'infinite') {
            while (that._cards.length % cardsPerRow !== 0) {
                that._createEmptyCard();
            }
        }

        if (that._autoCardHeight) {
            that._cardHeight = maxHeight;
            that._cards.forEach(card => card.style.height = maxHeight + 'px');
        }

        that._cardContentHeight = that._cards[0].getElementsByClassName('smart-card-view-content')[0].offsetHeight + that._verticalOffset;
        that._cards.forEach(card => that._toggleCard(card, card.firstElementChild.lastElementChild, that._visibleSource[card.dataId].$.id));

        const numberOfVirtualRows = Math.ceil(dataSourceLength / cardsPerRow),
            scrollHeight = (that._cardHeight + that._gap) * numberOfVirtualRows - that._gap;

        that.$.scrollViewer.$.scrollViewerContentContainer.style.top = 0;
        that.$.scrollViewer.$.verticalScrollBar.max = Math.max(0, scrollHeight - viewHeight - that._numberOfCollapsedRows * that._cardContentHeight);

        that._cardsPerRow = cardsPerRow;
        that._scrollHeight = scrollHeight;
        that._refreshedAtDimensions = { width: that._cachedWidth, height: that._cachedHeight };
        that._getNumberOfCollapsedRows();

        delete that._ignoreVerticalChange;
        delete that._suppressResizeHandler;

        if (virtual) {
            that.$.loadingIndicatorContainer.classList.remove('smart-hidden');
            that.dataSource.onVirtualDataSourceRequested(
                that._virtualDataSourceRequestedCallback.bind(that, 0, 0, true),
                { first: 0, last: that._cards.length, sorting: [], filtering: [], grouping: [], action: '' });
        }
    }

    /**
     * "onVirtualDataSourceRequested" callback function.
     */
    _virtualDataSourceRequestedCallback(startOfView, startOfData, initialization) {
        const that = this;

        that._ignoreVerticalChange = true;
        that.$.loadingIndicatorContainer.classList.add('smart-hidden');

        that._updateVisibleCards(startOfView, startOfData, initialization);

        that.removeAttribute('loading');
        delete that._ignoreVerticalChange;

        if (that._beginEditOnLoad) {
            const cardsWithDataId = that._cards.filter(card => card.dataId === that._beginEditOnLoad),
                cardMatch = cardsWithDataId[cardsWithDataId.length - 1];

            if (cardMatch) {
                that._openEditDialog(cardMatch.dataId);
            }

            delete that._beginEditOnLoad;
        }
    }

    /**
     * Creates a card.
     */
    _createCard(record = {}, dataId) {
        const that = this,
            coverField = that.coverField,
            visibleSource = that._visibleSource,
            card = document.createElement('smart-card'),
            cardDataContainer = document.createElement('div');

        requestAnimationFrame(() => card.hasStyleObserver = false);
        card.setAttribute('aria-setsize', visibleSource.length);
        card.setAttribute('aria-posinset', dataId + 1);
        card.dataId = dataId;

        card.whenRendered(function () {
            card.setAttribute('role', 'listitem');
            card.firstElementChild.onscroll = function () {
                const id = visibleSource[this.parentElement.dataId].$.id;

                that._cardScrolling[id] = this.scrollTop;
            }
        });

        if (!that._autoCardHeight) {
            card.style.height = that._cardHeight + 'px';
        }

        cardDataContainer.className = 'smart-card-data-container';
        cardDataContainer.setAttribute('role', 'presentation');
        that._applyTemplate(record, card, cardDataContainer, true);

        if (coverField) {
            const carousel = document.createElement('smart-carousel');
            let carouselSource = record[coverField];

            if (that.shadowRoot) {
                carousel._isInShadowDOM = true;
            }

            carouselSource = typeof carouselSource === 'string' ? carouselSource.split(',').map(url => url.trim()) : [];
            carousel.dataSource = carouselSource;
            carousel.hideArrows = true;
            carousel.unfocusable = true;
            carousel.animation = that.animation;
            carousel.theme = that.theme;
            carousel.rightToLeft = that.rightToLeft;
            carousel.onIndexChange = function (index) {
                that._cardSelectedCover[visibleSource[card.dataId].$.id] = index;
            };
            carousel.whenReady(function () {
                carousel.hasStyleObserver = false;
                carousel.$.arrowLeft.hasStyleObserver = false;
                carousel.$.arrowRight.hasStyleObserver = false;
            });

            card.appendChild(carousel);
        }

        card.appendChild(cardDataContainer);

        return card;
    }

    /**
     * Toggles a card.
     */
    _toggleCard(card, dataContainer, recordId) {
        const that = this;

        card.setAttribute('updating', '');

        if (that._collapsed[recordId]) {
            card.classList.add('collapsed');
            dataContainer.firstElementChild.children[1].classList.add('collapsed');
            dataContainer.children[1].classList.add('smart-visibility-hidden');
        }
        else {
            card.classList.remove('collapsed');
            dataContainer.firstElementChild.children[1].classList.remove('collapsed');
            dataContainer.children[1].classList.remove('smart-visibility-hidden');
        }

        setTimeout(function () {
            card.removeAttribute('updating');
        }, 100);
    }

    /**
     * Creates an empty card.
     */
    _createEmptyCard(hidden = true) {
        const that = this,
            card = that._createCard({});

        if (hidden) {
            card.classList.add('smart-hidden');
        }

        card.style.height = that._cardHeight + 'px';
        that._cards.push(card);
        that.$.cardContainer.appendChild(card);
    }

    /**
     * Applies card template.
     */
    _applyTemplate(record, card, container, create) {
        const that = this,
            columns = that.columns,
            titleField = that.titleField;

        if (create) {
            let content = that._cardContent;

            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];

                if (!column.visible) {
                    continue;
                }

                const dataField = column.dataField,
                    regex = new RegExp(`{{${dataField}}}`, 'g'),
                    data = that._formatValue(record[dataField], record, column);

                content = content.replace(regex, data);
            }

            container.innerHTML = content.replace(/{{\w+}}/g, '');

            if (titleField) {
                const titleId = that.id + 'Title' + (record ? record.$.id : 'Empty' + Math.floor(Math.random() * 1000));

                container.firstElementChild.firstElementChild.id = titleId;
                card.setAttribute('aria-labelledby', titleId);
            }

            return;
        }

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            if (!column.visible) {
                continue;
            }

            const dataField = column.dataField,
                element = container.querySelector(`[data-field="${dataField}"]`);

            if (element) {
                const data = that._formatValue(record[dataField], record, column);

                if (dataField === titleField) {
                    element.firstElementChild.innerHTML = data;
                }
                else {
                    element.children[1].innerHTML = data;
                }
            }
        }
    }

    /**
     * Formats a value based on formatFunction, formatString or template.
     */
    _formatValue(value, record, column) {
        const that = this;

        if (Object.keys(record).length === 0) {
            return '';
        }

        const settings = { column: column, record: record, template: column.template, value: value };

        if (column.formatFunction) {
            column.formatFunction(settings);
        }

        value = settings.value;

        if (settings.template) {
            return that._applyCellTemplate(settings.template, value, record, column);
        }
        else if (column.formatSettings) {
            let result = '';

            if (column.formatSettings.prefix) {
                result += column.formatSettings.prefix;
            }

            if (column.formatSettings.formatString && value !== undefined && value !== null) {
                if (value.constructor === Date) {
                    value = new Smart.Utilities.DateTime(value).toString(column.formatSettings.formatString);
                }
                else if (value instanceof Smart.Utilities.DateTime) {
                    value = value.toString(column.formatSettings.formatString);
                }
                else if (!isNaN(value) && that._numericFormatter) {
                    value = that._numericFormatter.formatNumber(value, column.formatSettings.formatString);
                }
            }

            result += value;

            if (column.formatSettings.sufix) {
                result += column.formatSettings.sufix;
            }

            return result;
        }

        return value;
    }

    /**
     * Applies cell template.
     */
    _applyCellTemplate(template, value = '', record, column) {
        let result = '';

        if (typeof template === 'function') {
            const settings = { column: column, record: record, template: null, value: value };

            template(settings);

            value = settings.value;

            if (settings.template === null) {
                return value;
            }

            template = settings.template;
        }

        if (template.startsWith('#')) {
            const templateElement = document.querySelector(template);

            if (templateElement && templateElement instanceof HTMLTemplateElement) {
                const templateContent = templateElement.content.cloneNode(true),
                    tempElement = document.createElement('div');

                tempElement.appendChild(templateContent);

                value = value.toString();
                value = value.replace(/'/ig, '\\\'');
                value = value.replace(/"/ig, '\\"');

                result = tempElement.innerHTML.replace(/{{value}}/ig, value).replace(/{{id}}/ig, record.$.id);

                if (result.indexOf('{{value=') >= 0) {
                    if (!value) {
                        result = result.replace(/{{value=/ig, '');
                        result = result.replace(/}}/ig, '');
                    }
                    else {
                        result = result.substring(0, result.indexOf('{{value=')) + value + result.substring(result.indexOf('}'));
                        result = result.replace(/}/ig, '');
                        result = result.replace(/{/ig, '');
                    }
                }

                return result;
            }
        }

        result = template.replace(/{{value}}/ig, value).replace(/{{id}}/ig, record.$.id);
        return result;
    }

    /**
     * Gets the current number of cards per row.
     */
    _getCardsPerRow() {
        const that = this,
            cards = that._cards;

        if (cards.length === 0) {
            that._cardsPerRow = 0;
            return;
        }

        let previousTop = cards[0].offsetTop,
            number = 1;

        for (let i = 1; i < cards.length; i++) {
            if (cards[i].offsetTop > previousTop) {
                break;
            }

            number++;
        }

        that._cardsPerRow = number;
    }

    /**
     * Vertical scrolling handler.
     */
    _onVerticalChange(event) {
        const that = this;

        if (that._ignoreVerticalChange) {
            return;
        }

        const dataSource = that._visibleSource,
            scrolling = that.scrolling,
            fullCardHeight = that._cardHeight + that._gap,
            cardsPerRow = that._cardsPerRow;
        let value = event.detail.value;

        if (that._cards.length === dataSource.length) {
            // no virtual items
            const start = Math.floor(value / fullCardHeight) * cardsPerRow;

            that._start = { view: start, data: start };

            if (that._dataSourceProcessed) {
                that._refreshCardContent();
            }

            that.$.scrollViewer.$.scrollViewerContentContainer.style.top = -value + 'px';

            if (scrolling === 'infinite' &&
                that.$.scrollViewer.$.verticalScrollBar.value === that.$.scrollViewer.$.verticalScrollBar.max) {
                that._onScrollBottomReached(start, start);
            }

            return;
        }

        let startOfView, startOfData;

        clearTimeout(that._scrollingTimeout);

        if (that._numberOfCollapsedRows > 0) {
            const numberOfAllRows = Math.floor((dataSource.length - 1) / cardsPerRow) + 1;
            let height = 0,
                difference;

            startOfView = cardsPerRow;

            for (let i = 0; i < numberOfAllRows; i++) {
                const currentRowIndex = i,
                    previousHeight = height;

                if (that._collapsedRows[currentRowIndex]) {
                    height += fullCardHeight - that._cardContentHeight;
                }
                else {
                    height += fullCardHeight;
                }

                if (startOfData === undefined && value <= height) {
                    startOfData = currentRowIndex * cardsPerRow;
                    difference = value - previousHeight;
                    break;
                }
            }

            value = difference + fullCardHeight;
        }
        else {
            value = value % (2 * fullCardHeight) + fullCardHeight;

            if (value < fullCardHeight) {
                value += fullCardHeight;
            }

            while (value + that.$.scrollViewer.$.scrollViewerContainer.offsetHeight > that.$.cardContainer.offsetHeight) {
                value -= fullCardHeight;
            }

            startOfView = Math.floor(value / fullCardHeight) * cardsPerRow;
            startOfData = Math.floor(event.detail.value / fullCardHeight) * cardsPerRow;

            if (startOfView < 0) {
                startOfData -= startOfView;
                startOfView = 0;
            }
        }

        const endOfData = Math.min(startOfData + that._cards.length - startOfView - 1, dataSource.length - 1);

        if (scrolling === 'virtual' && (dataSource[startOfData].isEmpty || dataSource[endOfData].isEmpty)) {
            const size = endOfData - startOfData;
            let first, last;

            for (let i = startOfData; i <= endOfData; i++) {
                if (dataSource[i].isEmpty) {
                    first = i;
                    last = first;
                    break;
                }
            }

            while (dataSource[last + 1] && dataSource[last + 1].isEmpty && last - first < size) {
                last++;
            }

            that.setAttribute('loading', '');
            that.$.loadingIndicatorContainer.classList.remove('smart-hidden');
            that.$.scrollViewer.$.scrollViewerContentContainer.style.top = -value + 'px';
            that._scrollingTimeout = setTimeout(function () {
                that.dataSource.onVirtualDataSourceRequested(
                    that._virtualDataSourceRequestedCallback.bind(that, startOfView, startOfData),
                    { first: first, last: last, sorting: [], filtering: [], grouping: [], action: '' });
            }, 300);
            return;
        }

        that.$.scrollViewer.$.scrollViewerContentContainer.style.top = -value + 'px';
        that._updateVisibleCards(startOfView, startOfData);

        if (scrolling === 'virtual') {
            that.removeAttribute('loading');
            that.$.loadingIndicatorContainer.classList.add('smart-hidden');
        }
        else if (scrolling === 'infinite' &&
            that.$.scrollViewer.$.verticalScrollBar.value === that.$.scrollViewer.$.verticalScrollBar.max) {
            that._onScrollBottomReached(startOfView, startOfData);
        }
    }

    /**
     * Scroll bottom reached handler when "scrolling" is 'infinite'.
     */
    _onScrollBottomReached(startOfView, startOfData) {
        const that = this;

        that.$.loadingIndicatorContainer.classList.remove('smart-hidden');

        that.dataSource.onVirtualDataSourceRequested(function () {
            that._updateVisibleCards(startOfView, startOfData);

            const numberOfVirtualRows = Math.ceil(that._visibleSource.length / that._cardsPerRow),
                scrollHeight = (that._cardHeight + that._gap) * numberOfVirtualRows - that._gap,
                viewHeight = that.$.scrollViewer.$.scrollViewerContainer.offsetHeight;

            that.$.scrollViewer.$.verticalScrollBar.max = Math.max(0, scrollHeight - viewHeight - that._numberOfCollapsedRows * that._cardContentHeight);
            that._scrollHeight = scrollHeight;
            that.$.loadingIndicatorContainer.classList.add('smart-hidden');
        }, { first: Infinity, last: Infinity, sorting: [], filtering: [], grouping: [], action: '' });
    }

    /**
     * Updates visible cards.
     */
    _updateVisibleCards(startOfView, startOfData, initialization) {
        const that = this,
            startCoefficient = startOfData - startOfView,
            visibleSourceLength = that._visibleSource.length;

        for (let i = 0; i < startOfView; i++) {
            const card = that._cards[i];

            card.setAttribute('aria-hidden', true);

            if (card.classList.contains('collapsed')) {
                that._toggleCard(card, card.firstElementChild.lastElementChild);
            }
        }

        for (let i = startOfView; i < that._cards.length; i++) {
            const card = that._cards[i],
                newDataId = startCoefficient + i;

            card.removeAttribute('aria-hidden');

            if (newDataId < that._visibleSource.length) {
                card.classList.remove('smart-hidden');
                card.setAttribute('aria-setsize', visibleSourceLength);
                card.setAttribute('aria-posinset', newDataId + 1);

                if (card.dataId !== newDataId || initialization || that._dataSourceProcessed) {
                    that._updateVirtualCard(card, newDataId);
                }
            }
            else {
                card.classList.add('smart-hidden');
            }
        }

        that._start = { view: startOfView, data: startOfData };
    }

    /**
     * Toggles the visibility of a column.
     */
    _toggleColumn(dataField, visible, skipValidation) {
        const that = this,
            dataSource = that._visibleSource;

        if (!dataField || typeof dataField !== 'string' ||
            dataField === that.coverField || dataField === that.titleField ||
            !dataSource || dataSource.length === 0) {
            return;
        }

        const column = that.columns.find(col => col.dataField === dataField);

        if (!column) {
            return;
        }

        that._close();
        that._changedVisibility = new Map();
        that._changedVisibility.set(column, visible);
        that._updateColumnsVisibility(undefined, skipValidation);
    }

    /**
     * Updates virtual card with new data.
     */
    _updateVirtualCard(card, newDataId) {
        const that = this,
            record = that._visibleSource[newDataId],
            recordId = record.$.id,
            dataContainer = card.firstElementChild.lastElementChild,
            coverField = that.coverField;

        card.dataId = newDataId;
        that._applyTemplate(record, card, dataContainer);

        card.firstElementChild.scrollTop = that._cardScrolling[recordId] || 0;

        if (that._dragDetails) {
            if (card.dataId === that._dragDetails.index) {
                card.classList.add('dragged');
            }
            else {
                card.classList.remove('dragged');
            }
        }

        if (that._searchInfo) {
            if (that._searchInfo.foundIdsObject[recordId]) {
                card.classList.add('found');

                if (that._searchInfo.highlighted === recordId) {
                    card.classList.add('highlighted');
                }
                else {
                    card.classList.remove('highlighted');
                }
            }
            else {
                card.classList.remove('found', 'highlighted');
            }
        }

        that._toggleCard(card, dataContainer, recordId);

        if (coverField) {
            const carousel = card.firstElementChild.firstElementChild;
            let carouselSource = record[coverField];

            carouselSource = typeof carouselSource === 'string' ? carouselSource.split(',').map(url => url.trim()) : [];
            carousel.set('dataSource', carouselSource);

            if (carouselSource.length > 0) {
                const selectedIndex = that._cardSelectedCover[recordId] || 0;

                carousel._generateIndicators();
                carousel._indicators[selectedIndex].classList.add('smart-active');
                carousel._generateItems();
                carousel._items[selectedIndex].classList.add('smart-active');
                carousel._currentIndex = selectedIndex;
            }
        }
    }

    /**
     * Updates virtual card with new data.
     */
    _updateCardHeight(newHeight) {
        const that = this,
            cards = that._cards;

        if (newHeight === null) {
            // apply "auto" height
            let maxHeight = 0,
                restoreCollapsedState = [];

            that._autoCardHeight = true;

            if (that._cards.length === 0) {
                return;
            }

            cards.forEach(card => {
                card.style.height = null;

                if (card.classList.contains('collapsed')) {
                    card.setAttribute('updating', '');
                    card.classList.remove('collapsed');
                    card.getElementsByClassName('smart-card-view-content')[0].classList.remove('smart-visibility-hidden');
                    restoreCollapsedState.push(card);
                }
            });
            cards.forEach(card => maxHeight = Math.max(card.offsetHeight, maxHeight));
            cards.forEach(card => card.style.height = maxHeight + 'px');
            that._cardContentHeight = that._cards[0].getElementsByClassName('smart-card-view-content')[0].offsetHeight + that._verticalOffset;

            if (restoreCollapsedState.length > 0) {
                restoreCollapsedState.forEach(card => {
                    card.classList.add('collapsed');
                    card.getElementsByClassName('smart-card-view-content')[0].classList.add('smart-visibility-hidden');
                });

                setTimeout(function () {
                    restoreCollapsedState.forEach(card => card.removeAttribute('updating'));
                }, 100);
            }

            if (that._cardHeight === maxHeight) {
                return;
            }

            that._cardHeight = maxHeight;
        }
        else {
            const firstCard = that._cards[0];
            let restoreCollapsedState;

            that._autoCardHeight = false;

            if (that._cardHeight === newHeight) {
                return;
            }

            that._cardHeight = newHeight;

            if (!firstCard) {
                return;
            }

            cards.forEach(card => card.style.height = newHeight + 'px');

            if (firstCard.classList.contains('collapsed')) {
                firstCard.setAttribute('updating', '');
                firstCard.classList.remove('collapsed');
                firstCard.getElementsByClassName('smart-card-view-content')[0].classList.remove('smart-visibility-hidden');
                restoreCollapsedState = true;
            }

            that._cardContentHeight = that._cards[0].getElementsByClassName('smart-card-view-content')[0].offsetHeight + that._verticalOffset;

            if (restoreCollapsedState) {
                firstCard.classList.add('collapsed');
                firstCard.getElementsByClassName('smart-card-view-content')[0].classList.add('smart-visibility-hidden');

                setTimeout(function () {
                    firstCard.removeAttribute('updating');
                }, 100);
            }
        }

        that._partialRefresh();
    }

    /**
     * Refreshes the view and adds or removes cards if necessary.
     */
    _partialRefresh() {
        const that = this;

        that._refreshedAtDimensions = { width: that._cachedWidth, height: that._cachedHeight };

        if (that._cards.length === that._visibleSource.length) {
            if (that._dataSourceProcessed) {
                that._refreshCardContent();
            }

            that.$.scrollViewer.refresh();
            return;
        }

        that._getCardsPerRow();

        const viewHeight = that.$.scrollViewer.$.scrollViewerContainer.offsetHeight,
            fullCardHeight = that._cardHeight + that._gap,
            numberOfCollapsedCards = Object.keys(that._collapsed).length;
        let cardsPerRow = that._cardsPerRow;

        function regulateNumberOfCards() {
            let targetCardNum = ((viewHeight + 2 * fullCardHeight) / fullCardHeight) * cardsPerRow;

            targetCardNum = targetCardNum - (targetCardNum % cardsPerRow) + cardsPerRow;

            while (numberOfCollapsedCards > 0 && targetCardNum * (fullCardHeight - that._cardContentHeight) < viewHeight + 2 * fullCardHeight) {
                targetCardNum++;
            }

            targetCardNum = Math.min(targetCardNum, that._visibleSource.length);

            while (that._cards.length < targetCardNum) {
                that._createEmptyCard(false);
            }

            while (that._cards.length > targetCardNum) {
                that._cards[that._cards.length - 1].remove();
                that._cards.pop();
            }

            while (that.scrolling === 'infinite' && that._cards.length % cardsPerRow !== 0) {
                that._createEmptyCard();
            }
        }

        regulateNumberOfCards();
        that._getCardsPerRow();

        if (cardsPerRow !== that._cardsPerRow) {
            cardsPerRow = that._cardsPerRow;
            regulateNumberOfCards();
        }

        that._getNumberOfCollapsedRows();

        const fractionOfMax = that._getFractionOfMax(),
            numberOfVirtualRows = Math.ceil(that._visibleSource.length / that._cardsPerRow),
            scrollHeight = fullCardHeight * numberOfVirtualRows - that._gap,
            newMax = Math.max(0, scrollHeight - viewHeight - that._numberOfCollapsedRows * that._cardContentHeight);

        that.$.scrollViewer.$.verticalScrollBar.max = newMax;
        that._scrollHeight = scrollHeight;

        if (newMax === 0) {
            that.$.scrollViewer.refresh();
        }

        that._setFractionOfMax(fractionOfMax);
    }

    /**
     * Gets what part of max has been scrolled.
     */
    _getFractionOfMax() {
        const verticalScrollBar = this.$.scrollViewer.$.verticalScrollBar,
            max = verticalScrollBar.max;

        if (max === 0) {
            return 0;
        }

        return verticalScrollBar.value / verticalScrollBar.max;
    }

    /**
     * Scrolls to a fraction of max.
     */
    _setFractionOfMax(fractionOfMax) {
        const that = this,
            verticalScrollBar = this.$.scrollViewer.$.verticalScrollBar,
            newValue = verticalScrollBar.max * fractionOfMax;

        verticalScrollBar.value = newValue;
        that._onVerticalChange({ detail: { value: newValue } });
    }

    /**
     * Refreshes currently visible cards. Should be called when only the values in cards have to be changed.
     */
    _refreshCardContent() {
        const that = this;

        that._updateVisibleCards(that._start.view, that._start.data, true);
    }

    /**
     * Gets visible records.
     */
    _getVisibleRecords() {
        const that = this,
            dataSource = that.dataSource;

        if (that._appliedFiltering.filters.length === 0) {
            that._visibleSource = dataSource;
        }
        else {
            that._visibleSource = [];

            for (let i = 0; i < dataSource.length; i++) {
                const record = that.dataSource[i];

                if (record.$.filtered !== false) {
                    that._visibleSource.push(record);
                    that._visibleSource[that._visibleSource.length - 1]._id = record.$.id;
                }
            }
        }

        if (!dataSource || dataSource.length === 0) {
            that.setAttribute('empty', '');
            that.removeAttribute('no-matches');
        }
        else {
            that.removeAttribute('empty');

            if (that._visibleSource.length === 0) {
                that.setAttribute('no-matches', '');
            }
            else {
                that.removeAttribute('no-matches');
            }
        }
    }

    /**
     * Clears filter and sort classes and flags.
     */
    _clearFilterAndSortUI() {
        const that = this;

        that._appliedFiltering = { filters: [], operator: 'and' };
        that._appliedSorting = { dataFields: [], dataTypes: [], orderBy: [] };

        that.$.filterButton.classList.remove('filtered');
        that.$.sortButton.classList.remove('sorted');
        that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
        that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
    }

    /**
     * Searches by a query.
     */
    _search(query, highlight = true) {
        const that = this;

        that._searchInfo.query = query;
        that._cards.forEach(card => card.classList.remove('found', 'highlighted'));

        if (query === '') {
            that.$.search.classList.remove('matches', 'no-matches');
            delete that._searchInfo.foundIdsArray;
            delete that._searchInfo.foundIdsObject;
            delete that._searchInfo.highlighted;
            return;
        }

        const source = that._searchInfo.source,
            filters = [],
            foundIdsArray = [],
            foundIdsObject = {};

        that._searchInfo.stringDataFields.forEach(dataField => {
            const filterGroup = new Smart.Utilities.FilterGroup(),
                filterObject = filterGroup.createFilter('string', query, 'CONTAINS');

            filterGroup.addFilter('or', filterObject);
            filters.push([dataField, filterGroup]);
        });

        source._filter(filters, 'or');

        for (let i = 0; i < source.length; i++) {
            const record = source[i];

            if (record.$.filtered !== false) {
                foundIdsArray.push(record.$.id);
                foundIdsObject[record.$.id] = true;
            }
        }

        let highlighted = foundIdsArray[0];

        that._searchInfo.foundIdsArray = foundIdsArray;
        that._searchInfo.foundIdsObject = foundIdsObject;

        if (foundIdsArray.length > 0) {
            if (highlight) {
                that._searchInfo.highlighted = highlighted;
                that.ensureVisible(highlighted);
            }

            that._cards.forEach(card => {
                const id = that._visibleSource[card.dataId].$.id;

                if (foundIdsObject[id]) {
                    if (highlight && highlighted === id) {
                        card.classList.add('highlighted');
                    }

                    card.classList.add('found');
                }
            });

            that.$.search.classList.remove('no-matches');
            that.$.search.classList.add('matches');
            that.$.searchLabel.innerHTML = that.localize('found', { nth: highlight ? 1 : 0, n: foundIdsArray.length });
            return;
        }

        that.$.search.classList.remove('matches');
        that.$.search.classList.add('no-matches');
        that.$.searchLabel.innerHTML = that.localize('found', { nth: 0, n: 0 });
    }

    /**
     * Closes search panel.
     */
    _closeSearchPanel() {
        const that = this;

        if (that._searchInfo) {
            that._cards.forEach(card => card.classList.remove('found', 'highlighted'));
            delete that._searchInfo;
        }
    }

    /**
     * Search input keyup handler.
     */
    _searchInputKeyupHandler() {
        const that = this;

        clearTimeout(that._searchInputTimeout);

        that._searchInputTimeout = setTimeout(function () {
            if (that.$.searchInput.value !== that._searchInfo.query) {
                that._search(that.$.searchInput.value);
            }
        }, 500);
    }

    /**
     * Header drop down transitionend handler.
     */
    _headerDropDownTransitionendHandler(event) {
        const that = this;

        if (event.propertyName === 'visibility' &&
            that.$.headerDropDown.classList.contains('search-panel') &&
            !that.$.headerDropDown.classList.contains('smart-visibility-hidden')) {
            that.$.searchInput.focus();
        }
    }

    /**
     * Card container down handler.
     */
    _cardContainerDownHandler(event) {
        const that = this;

        delete that._clickToDrag;

        if (!that.allowDrag || !that._isMobile && event.button !== 0) {
            return;
        }

        const target = event.originalEvent.target;

        if (target.closest('.smart-indicator') ||
            target.closest('.smart-arrow-up')) {
            if (that._isMobile) {
                that.$.scrollViewer._scrollView.disableSwipeScroll = true;
            }

            return;
        }

        const card = event.originalEvent.target.closest('smart-card');

        if (!card) {
            return;
        }

        that._dragDetails = {
            card: card,
            coords: {
                x: event.pageX, y: event.pageY
            },
            index: card.dataId,
            originalEvent: event,
            record: that._visibleSource[card.dataId],
            startTime: new Date()
        };

        that.$.scrollViewer._scrollView.disableSwipeScroll = true;
        window.getSelection().removeAllRanges();
    }

    /**
     * document move handler.
     */
    _documentMoveHandler(event) {
        const that = this,
            dragDetails = that._dragDetails;
        if (!dragDetails) {
            return;
        }

        if (!dragDetails.feedbackShown) {
            const now = new Date(),
                timePassed = now.getTime() - dragDetails.startTime.getTime() > 500,
                moved = Math.abs(dragDetails.coords.x - event.pageX) > 5 ||
                    Math.abs(dragDetails.coords.y - event.pageY) > 5;

            if (moved && (!that._isMobile || that._isMobile && timePassed)) {
                const startedDragging = that._startDragging(event);

                if (!startedDragging) {
                    return;
                }
            }
            else {
                if (that._isMobile && moved && !timePassed) {
                    delete that._dragDetails;
                    that.$.scrollViewer._scrollView.disableSwipeScroll = false;
                }

                return;
            }
        }

        const draggedCard = dragDetails.card,
            record = dragDetails.record,
            y = event.clientY,
            x = event.clientX;
        let target = event.originalEvent.target;

        that.$.fireEvent('dragging', { card: draggedCard, originalEvent: event, record: record });

        dragDetails.feedback.style.left = (event.pageX + 10) + 'px';
        dragDetails.feedback.style.top = (event.pageY + 10) + 'px';

        if (that._isMobile) {
            const realTarget = document.elementFromPoint(x, y);

            if (realTarget) {
                target = realTarget;
            }
        }

        clearInterval(that._dragInterval);
        that._dragInterval = setInterval(function () {
            const rect = that.$.scrollViewer.getBoundingClientRect();

            if (that.$.scrollViewer.scrollHeight > 0 &&
                rect.left <= x && rect.left + rect.width >= x) {
                if (y >= rect.top && y <= rect.top + 36) {
                    that.$.scrollViewer.scrollTop -= that._autoScrollCoefficient;
                }
                else if (y >= rect.top + rect.height - 36 && y <= rect.top + rect.height) {
                    that.$.scrollViewer.scrollTop += that._autoScrollCoefficient;
                }
                else {
                    clearInterval(that._dragInterval);
                }
            }
            else {
                clearInterval(that._dragInterval);
            }
        }, 2);

        let closestCard = target.closest('smart-card'),
            side;

        if (dragDetails.hoveredCard) {
            dragDetails.hoveredCard.classList.remove('drop-target', 'left', 'right');
            delete dragDetails.hoveredCard;
        }

        if (closestCard && closestCard.dataId === dragDetails.index) {
            return;
        }

        if (closestCard) {
            const rect = closestCard.getBoundingClientRect(),
                leftDistance = Math.abs(x - rect.left),
                rightDistance = Math.abs(x - rect.right);

            side = leftDistance < rightDistance ? 'left' : 'right';
        }
        else if (target === that.$.addNewButton) {
            return;
        }
        else {
            let closest, closestDistance;

            that._cards.forEach(card => {
                const rect = card.getBoundingClientRect(),
                    topDistance = Math.abs(y - rect.top),
                    bottomDisatnce = Math.abs(y - rect.bottom),
                    bestVerticalDistance = Math.min(topDistance, bottomDisatnce),
                    leftDistance = Math.abs(x - rect.left),
                    rightDistance = Math.abs(x - rect.right),
                    bestHorizontalDistance = Math.min(leftDistance, rightDistance),
                    overallDistance = Math.sqrt(Math.pow(bestHorizontalDistance, 2) + Math.pow(bestVerticalDistance, 2));

                if (closestDistance === undefined || overallDistance < closestDistance) {
                    closest = card;
                    closestDistance = overallDistance;
                    side = leftDistance < rightDistance ? 'left' : 'right';
                }
            });

            closestCard = closest;

            if (closestCard.dataId === dragDetails.index) {
                return;
            }
        }

        if (closestCard) {
            closestCard.classList.add(side, 'drop-target');
            dragDetails.hoveredCard = closestCard;
            dragDetails.side = side;
        }
    }

    /**
     * Starts dragging operation.
     */
    _startDragging(event) {
        const that = this,
            dragDetails = that._dragDetails,
            draggedCard = dragDetails.card,
            record = dragDetails.record;
        const dragStartEvent = that.$.fireEvent('dragStart', { card: draggedCard, originalEvent: event, record: record });

        if (dragStartEvent.defaultPrevented) {
            delete that._dragDetails;
            that.$.scrollViewer._scrollView.disableSwipeScroll = false;
            return false;
        }

        dragDetails.feedback = that._addDragFeedback(record);
        dragDetails.feedbackShown = true;

        that.setAttribute('dragging', '');
        draggedCard.classList.add('dragged');
        that.closePanel();
        that._clickToDrag = true;
        return true;
    }

    /**
     * Adds drag feedback.
     */
    _addDragFeedback(record) {
        const that = this,
            feedback = document.createElement('div');
        let innerHTML = '';

        feedback.className = 'smart-card-view-drag-feedback';

        if (that.coverField) {
            innerHTML += `<div class="drag-feedback-thumbnail" style="background-image: url('${record[that.coverField].split(',')[0].trim()}');"></div>`;
        }

        if (that.titleField) {
            innerHTML += `<div class="drag-feedback-label">${record[that.titleField]}</div>`;
        }
        else if (!that.coverField) {
            innerHTML += `<div class="drag-feedback-label">${that.localize('draggedRecord', { id: record.$.id })}</div>`;
        }

        feedback.innerHTML = innerHTML;

        if (that.rightToLeft) {
            feedback.setAttribute('right-to-left', '');
        }

        document.body.appendChild(feedback);
        return feedback;
    }

    /**
     * document up handler.
     */
    _documentUpHandler(event) {
        const that = this,
            dragDetails = that._dragDetails;

        that.$.scrollViewer._scrollView.disableSwipeScroll = false;

        if (!dragDetails) {
            let target = event.originalEvent.target;
            const header = that.$.header;

            if (that.shadowRoot && target === that) {
                target = event.originalEvent.composedPath()[0];
            }

            if (that.headerPosition !== 'none' && !that.$.headerDropDown.classList.contains('smart-visibility-hidden') &&
                !that.$.headerDropDown.classList.contains('search-panel') && (target === header || !header.contains(target))) {
                const closestInputPopup = target.closest('smart-scroll-viewer'),
                    closestDateTimePickerPopup = target.closest('.smart-drop-down');

                if ((!closestInputPopup || !header.contains(closestInputPopup.ownerElement)) &&
                    (!closestDateTimePickerPopup || closestDateTimePickerPopup.ownerElement && !header.contains(closestDateTimePickerPopup.ownerElement))) {
                    that.closePanel();
                }
            }

            return;
        }

        const draggedCard = dragDetails.card,
            draggedRecord = dragDetails.record,
            hoveredCard = dragDetails.hoveredCard;

        delete that._dragDetails;

        if (!that.hasAttribute('dragging')) {
            return;
        }

        const withDraggedClass = that.$.cardContainer.getElementsByClassName('dragged');

        Array.from(withDraggedClass).forEach(card => card.classList.remove('dragged'));

        that.removeAttribute('dragging');
        dragDetails.feedback.remove();
        clearInterval(that._dragInterval);
        window.getSelection().removeAllRanges();

        if (!hoveredCard) {
            that.$.fireEvent('dragEnd', { card: draggedCard, originalEvent: event, record: draggedRecord });
            return;
        }

        const hoveredRecord = that._visibleSource[hoveredCard.dataId],
            dragEndEvent = that.$.fireEvent('dragEnd', {
                card: draggedCard,
                originalEvent: event,
                record: draggedRecord,
                targetCard: hoveredCard,
                targetRecord: hoveredRecord,
                targetSide: dragDetails.side
            });

        hoveredCard.classList.remove('drop-target', 'left', 'right');

        if (dragEndEvent.defaultPrevented) {
            return;
        }

        const dataSource = that.dataSource;
        let fromIndexInSource, toIndexInSource;

        for (let i = 0; i < dataSource.length; i++) {
            const currentRecord = dataSource[i];

            if (currentRecord.isEmpty) {
                continue;
            }

            if (currentRecord === draggedRecord) {
                fromIndexInSource = i;
            }
            else if (currentRecord === hoveredRecord) {
                toIndexInSource = i;
            }

            if (fromIndexInSource !== undefined && toIndexInSource !== undefined) {
                break;
            }
        }

        if (!that.rightToLeft && dragDetails.side === 'right' || that.rightToLeft && dragDetails.side === 'left') {
            toIndexInSource++;
        }

        dataSource.move(fromIndexInSource, toIndexInSource);
        that._getVisibleRecords();

        that._dataSourceProcessed = true;
        that._partialRefresh();
        delete that._dataSourceProcessed;
    }
});
