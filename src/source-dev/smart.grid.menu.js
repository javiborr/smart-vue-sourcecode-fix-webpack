
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart.Utilities.Assign('Grid.Menu', class Menu {
    _openColumnChooserMenu(column) {
        const that = this;

        if (!column) {
            column = that._commandColumn;
        }

        if (!column || (that.menu && that.menu.column === column && column.element.hasAttribute('aria-controls'))) {
            that.closeMenu();
            return;
        }

        if (!that.menu) {
            that.menu = document.createElement('div');
            that.menu.classList.add('smart-grid-column-menu');
            that.menu.setAttribute('theme', that.getAttribute('theme'));
            that.menu.id = that.id + '_' + that.tagName.toLowerCase() + '_menu_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        if (that.appearance.allowColumnMenuAnimation) {
            that.menu.classList.add('smart-animate');
        }
        else {
            that.menu.classList.remove('smart-animate');
        }

        that._createColumnChooserMenuItems(column);

        that.menu.style.height = that.columnMenu.height ? that.columnMenu.height + 'px' : 'auto';

        if (that.menu.column && that.menu.column !== column) {
            that.menu.column.setProperty('menu', null);
            that.menu.column = null;
        }

        document.body.appendChild(that.menu);

        column.setProperty('menu', that.menu);

        const columnRect = column.element.getBoundingClientRect();

        that.menu.column = column;

        let left = columnRect.right - column.element.actionButton.getBoundingClientRect().width + window.pageXOffset;
        let top = columnRect.bottom + window.pageYOffset;

        if (left + that.menu.offsetWidth > window.innerWidth) {
            left = columnRect.right + window.pageXOffset - that.menu.offsetWidth;

            if (left + that.menu.offsetWidth > window.innerWidth) {
                left = window.innerWidth - that.menu.offsetWidth;
            }
        }

        that.menu.style.left = left + 'px';
        that.menu.style.top = top + 'px';

        that.menu.classList.remove('smart-hidden');
        that.menu.classList.add('open');
    }

    _openMenu(column) {
        const that = this;

        if (!column || (that.menu && that.menu.column === column && column.element.hasAttribute('aria-controls')) || that.columnMenu.enabled === false) {
            that.closeMenu();
            return;
        }

        if (!that.menu) {
            that.menu = document.createElement('div');
            that.menu.classList.add('smart-grid-column-menu');
            that.menu.setAttribute('theme', that.getAttribute('theme'));
            that.menu.id = that.id + '_' + that.tagName.toLowerCase() + '_menu_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        if (that.appearance.allowColumnMenuAnimation) {
            that.menu.classList.add('smart-animate');
        }
        else {
            that.menu.classList.remove('smart-animate');
        }

        if (that.rightToLeft) {
            that.menu.setAttribute('right-to-left', '');
        }
        else {
            that.menu.removeAttribute('right-to-left');
        }

        that._createMenuItems(column);
        that._createFilterPanel(column);
        that._filterMenuItemsVisibility(column);

        that.menu.style.height = that.columnMenu.height ? that.columnMenu.height + 'px' : 'auto';

        if (that.menu.column && that.menu.column !== column) {
            that.menu.column.setProperty('menu', null);
            that.menu.column = null;
        }

        document.body.appendChild(that.menu);

        column.setProperty('menu', that.menu);

        const columnRect = column.element.getBoundingClientRect();

        that.menu.column = column;

        let left = columnRect.right - column.element.actionButton.getBoundingClientRect().width + window.pageXOffset;
        let top = columnRect.bottom + window.pageYOffset;

        if (that.rightToLeft) {
            left = columnRect.left + window.pageXOffset - that.menu.offsetWidth + column.element.actionButton.getBoundingClientRect().width;

            if (left < 0) {
                left = columnRect.left + window.pageXOffset;
            }
        }

        if (left + that.menu.offsetWidth > window.innerWidth) {
            left = columnRect.right + window.pageXOffset - that.menu.offsetWidth;

            if (left + that.menu.offsetWidth > window.innerWidth) {
                left = window.innerWidth - that.menu.offsetWidth;
            }
        }

        that.menu.style.left = left + 'px';
        that.menu.style.top = top + 'px';

        if (!that.hasColumnMenu(column)) {
            that.closeMenu();
        }
        else {
            that.menu.classList.remove('smart-hidden');
        }

        that.menu.classList.add('open');
    }

    _menuItemClick(event) {
        const that = this;
        const details = event.detail;
        const menuItem = details.value;

        if (menuItem && menuItem.properties) {
            const command = menuItem.properties.command;

            if (typeof command === 'function') {
                command.apply(that, [menuItem.column]);
            }
            else if (that[command]) {
                that[command].apply(that, [menuItem.column]);
            }

            if (menuItem.column.autoCloseMenu) {
                that.closeMenu();
            }
        }
    }

    removeGroupByCommand(column) {
        const that = this;

        that.removeGroup(column.dataField);
    }

    groupByCommand(column) {
        const that = this;

        if (!that.dataSource) {
            return;
        }

        that.addGroup(column.dataField);
    }

    sortAscCommand(column) {
        const that = this;

        that.sortBy(column.dataField, 'asc');
    }

    sortDescCommand(column) {
        const that = this;

        that.sortBy(column.dataField, 'desc');
    }

    removeSortCommand(column) {
        const that = this;

        that.sortBy(column.dataField, null);
    }

    /*
    { 'columnMenuCustomizeType': {command: 'customizeTypeCommand', enabled: true, visible: false, icon: 'smart-icon-customize', label: '{{messages}}'}},
{ 'columnMenuItemRename': { command: 'renameCommand', enabled: true, visible: false, icon: 'smart-icon-rename', label: '{{messages}}' } },
{ 'columnMenuItemEditDescription': { command: 'editDescriptionCommand', enabled: true, visible: false, icon: 'smart-icon-description', label: '{{messages}}' } },
{ 'columnMenuItemDuplicate': { command: 'duplicateCommand', visible: false, enabled: true, icon: 'smart-icon-duplicate', label: '{{messages}}' } },
{ 'columnMenuItemInsertLeft': { command: 'insertLeftCommand', visible: false, enabled: true, icon: 'smart-icon-insert-left', label: '{{messages}}' } },
{ 'columnMenuItemInsertRight': { command: 'insertRightCommand', visible: false, enabled: true, icon: 'smart-icon-insert-right', label: '{{messages}}' } },
{ 'columnMenuItemSortAsc': { command: 'sortAscCommand', visible: 'auto', enabled: true, icon: 'smart-icon-sort-a-z', label: '{{messages}}' } },
{ 'columnMenuItemSortDesc': { command: 'sortDescCommand', visible: 'auto', enabled: true, icon: 'smart-icon-sort-z-a', label: '{{messages}}' } },
{ 'columnMenuItemRemoveSort': { command: 'removeSortCommand', visible: 'auto', enabled: true, icon: 'smart-icon-cancel-circled', label: '{{messages}}' } },
{ 'columnMenuItemFilter': { command: 'addFilterCommand', visible: 'auto', enabled: true, icon: 'smart-icon-add-filter', label: '{{messages}}' } },
{ 'columnMenuItemRemoveFilter': { command: 'removeFilterCommand', enabled: true, visible: 'auto', icon: 'smart-icon-cancel-circled-outline', label: '{{messages}}' } },
{ 'columnMenuItemGroupBy': { command: 'groupByCommand', enabled: true, visible: 'auto', icon: 'smart-icon-group-by', label: '{{messages}}' } },
{ 'columnMenuItemHide': { command: 'hideColumnCommand', enabled: true, visible: false, icon: 'smart-icon-hide', label: '{{messages}}' } },
{ 'columnMenuItemDelete': { command: 'deleteColumnCommand', enabled: true, visible: false, icon: 'smart-icon-delete', label: '{{messages}}' } }
*/

    _removeMenu() {
        const that = this;
        const verticalMenu = that.menu.querySelector('smart-menu');

        if (verticalMenu) {
            that.menu.removeChild(verticalMenu);
        }
    }

    _createColumnChooserMenuItems(/*column*/) {
        const that = this;

        that._removeMenu();

        const verticalMenu = document.createElement('smart-menu');
        const menuContent = document.createDocumentFragment();

        verticalMenu.mode = 'vertical';
        verticalMenu.dropDownAppendTo = 'body';
        verticalMenu.checkboxes = true;
        verticalMenu.checkable = true;
        verticalMenu.classList.add('smart-grid-column-chooser-menu');
        verticalMenu.rightToLeft = that.rightToLeft;

        for (let i = 0; i < that.columns.length; i++) {
            const column = that.columns[i];
            const menuItem = document.createElement('smart-menu-item');
            const icon = column.showIcon ? column.icon : (column.visible ? 'smart-icon-eye' : 'smart-icon-eye-off');

            menuItem.checked = column.visible;

            if (!column.allowHide) {
                continue;
            }

            column.command = function (column) {
                column.visible = !column.visible;
            }

            menuItem.label = that.localize(column.label) || column.label || column.dataField;
            menuItem.value = { column: column, properties: column };

            if (icon) {
                menuItem.label = '<span class="smart-grid-icon ' + icon + '"></span>' + menuItem.label;
            }

            menuContent.appendChild(menuItem);
        }

        verticalMenu.appendChild(menuContent);
        that.menu.appendChild(verticalMenu);

        that.menu.itemCheckChange = that._menuItemClick.bind(that);

        that.menu.addEventListener('itemCheckChange', that.menu.itemCheckChange);
        that.menu.addEventListener('keydown', that._keyDownHandler.bind(that));
    }

    _createMenuItems(column) {
        const that = this;

        that._removeMenu();

        const verticalMenu = document.createElement('smart-menu');
        const menuContent = document.createDocumentFragment();
        const dataSource = column.menuItems || that.columnMenu.dataSource;

        verticalMenu.mode = 'vertical';
        verticalMenu.dropDownAppendTo = 'body';
        verticalMenu.rightToLeft = that.rightToLeft;

        for (let item in dataSource) {
            const properties = dataSource[item];
            const menuItem = document.createElement('smart-menu-item');
            let icon = properties.icon;

            menuItem.label = that.localize(item);
            menuItem.value = { column: column, properties: properties };

            const sortString = (asc) => {
                if (asc) {
                    if (column.dataType === 'string') {
                        return 'A → Z';
                    }
                    else if (column.dataType === 'number' || column.dataType === 'date' || column.dataType === 'time') {
                        return '1 → 9';
                    }
                    else if (column.dataType === 'bool' || column.dataType === 'boolean') {
                        return '0 → 1';
                    }
                }
                else {
                    if (column.dataType === 'string') {
                        return 'Z → A';
                    }
                    else if (column.dataType === 'number' || column.dataType === 'date' || column.dataType === 'time') {
                        return '9 → 1';
                    }
                    else if (column.dataType === 'bool' || column.dataType === 'boolean') {
                        return '1 → 0';
                    }
                }
            }

            if (item === 'columnMenuItemSortAsc') {
                menuItem.label = that.localize(item, { mode: sortString(true) });

                if (column.dataType !== 'string') {
                    if (properties.iconAlt) {
                        icon = properties.iconAlt;
                    }
                }
            }
            else if (item === 'columnMenuItemSortDesc') {
                menuItem.label = that.localize(item, { mode: sortString(false) });

                if (column.dataType !== 'string') {
                    if (properties.iconAlt) {
                        icon = properties.iconAlt;
                    }
                }
            }

            if (icon) {
                menuItem.label = '<span class="smart-grid-icon ' + icon + '"></span>' + menuItem.label;
            }

            menuContent.appendChild(menuItem);
        }

        verticalMenu.appendChild(menuContent);

        if (that._filterContainer) {
            that.menu.insertBefore(verticalMenu, that._filterContainer);
        }
        else {
            that.menu.appendChild(verticalMenu);
        }

        that.menu.itemClick = that._menuItemClick.bind(that);

        that.menu.addEventListener('itemClick', that.menu.itemClick);
        that.menu.addEventListener('keydown', that._keyDownHandler.bind(that));
    }

    _getFilterType(column) {
        const dataType = column.dataType.endsWith('?') ? column.dataType.substring(0, column.dataType.length - 1) : column.dataType;

        let filterType = 'string';

        switch (dataType) {
            case 'number':
            case 'int':
            case 'float':
            case 'int64':
                filterType = 'numeric';
                break;
            case 'bool':
            case 'boolean':
                filterType = 'bool';
                break;
            case 'date':
            case 'time':
            case 'datetime':
                filterType = 'date';
                break;
            case 'any':
                filterType = 'any';
                break;
        }

        return filterType;
    }

    _createFilterPanel(column) {
        const that = this;

        if (!Smart.FilterPanel) {
            return;
        }

        if (that.filtering.enabled && that.filtering.filterMenu.visible && column.allowFilter) {
            const filterType = that._getFilterType(column);

            if (that._filterPanel) {
                that._filterPanel.parentNode.removeChild(that._filterPanel);
            }

            that._filterPanel = that._filterPanels[filterType];
            that._filterPanel.dataField = column.dataField;
            that._filterPanel.rightToLeft = that.rightToLeft;

            if (!that._filterContainer) {
                const filterContainer = document.createElement('div');

                filterContainer.classList.add('smart-filter-container');
                that._filterContainer = filterContainer;

                requestAnimationFrame(function () {
                    that.menu.appendChild(filterContainer);
                });

                that._applyFilterHandler = function () {
                    that.addFilter(that._filterPanel.dataField, that._filterPanel.getFilter());

                    const column = that.columnByDataField[that._filterPanel.dataField];
                    column._filterState = that._filterPanel.getState();
                };

                that._clearFilterHandler = function () {
                    requestAnimationFrame(() => {
                        that.removeFilter(that._filterPanel.dataField);

                        const column = that.columnByDataField[that._filterPanel.dataField];
                        column._filterState = null;
                    });
                };
            }

            that._filterContainer.appendChild(that._filterPanel);

            that._filterPanel.classList.remove('smart-hidden');
            that._filterPanel.removeEventListener('filter', that._applyFilterHandler);
            that._filterPanel.removeEventListener('clear', that._clearFilterHandler);

            that._filterPanel.addEventListener('filter', that._applyFilterHandler);
            that._filterPanel.addEventListener('clear', that._clearFilterHandler);


            if (column.filterMenuMode === 'none' || !that.filtering.filterMenu.visible || !Smart.FilterPanel) {
                that._filterContainer.classList.add('smart-hidden');
            }
            else {
                that._filterContainer.classList.remove('smart-hidden');
            }

            that._filterPanel.reset();

            if (column._filterState) {
                that._filterPanel.loadState(column._filterState);
            }
            else if (column.filter) {
                const columnFilterGroup = column.filter;
                const filterType = that._getFilterType(column);
                let filters = columnFilterGroup.getFilters();

                while (filters.length > 0 && filters[0].type === 'FilterGroup') {
                    filters = filters[0].value;
                }

                const conditions = columnFilterGroup.getConditions(filterType);

                const firstFilterComparison = filters.length > 0 ? conditions.indexOf(filters[0].condition) : -1;
                const secondFilterComparison = filters.length > 1 ? conditions.indexOf(filters[1].condition) : -1;
                const firstFilterValue = filters.length > 0 ? filters[0].value : '';
                const secondFilterValue = filters.length > 1 ? filters[1].value : '';
                const logicalOperator = filters.length > 1 ? ['and', 'or'].indexOf(filters[1].logicalOperator) : 0;

                column._filterState = {
                    firstFilterComparison: firstFilterComparison,
                    firstFilterValue: firstFilterValue,
                    logicalOperator: logicalOperator,
                    secondFilterComparison: secondFilterComparison,
                    secondFilterValue: secondFilterValue
                };

                that._filterPanel.loadState(column._filterState);

            }
        }
        else if (that._filterPanel) {
            that._filterPanel.parentNode.removeChild(that._filterPanel);
            column._filterState = null;
        }
    }

    hasColumnMenu(column) {
        const that = this;

        if (that.columnMenu.enabled === false) {
            return false;
        }

        const dataSource = column.menuItems || that.columnMenu.dataSource;

        let hiddenMenuItemsCount = 0;
        let length = 0;

        for (let item in dataSource) {
            const properties = dataSource[item];

            length++;

            if (properties.visible === false) {
                hiddenMenuItemsCount++;
            }
            else if (properties.visible === 'auto') {
                if (item === 'columnMenuItemFilter' || item === 'columnMenuItemRemoveFilter') {
                    if (that.filtering.filterMenu.visible || that.filtering.filterBuilder.visible) {
                        hiddenMenuItemsCount++;
                    }
                }

                if (item === 'columnMenuItemGroupBy' || item === 'columnMenuItemRemoveGroupBy') {
                    if (!column.allowGroup || !that.grouping.enabled) {
                        hiddenMenuItemsCount++;
                    }
                }

                if (item === 'columnMenuItemFilter' && !column.allowFilter) {
                    hiddenMenuItemsCount++;
                }

                if (item === 'columnMenuItemRemoveFilter' && !column.allowFilter) {
                    hiddenMenuItemsCount++;
                }

                if (item === 'columnMenuItemGroupBy' && !column.allowGroup) {
                    hiddenMenuItemsCount++;
                }

                if (item === 'columnMenuItemSortAsc' ||
                    item === 'columnMenuItemSortDesc' ||
                    item === 'columnMenuItemRemoveSort') {

                    if (!column.allowSort || !that.sorting.enabled) {
                        hiddenMenuItemsCount++;
                    }
                }
            }
        }

        const hasFilter = that.filtering.enabled && that.filtering.filterMenu.visible && column.filterMenuMode !== 'none';

        if ((!hasFilter || !Smart.FilterPanel) && (!Smart.Menu || hiddenMenuItemsCount >= length)) {
            return false;
        }

        return true;
    }

    _filterMenuItemsVisibility(column) {
        const that = this;
        const menuItems = (that.menu.parentElement && (that.enableShadowDOM || that.isInShadowDOM) ? that.menu.firstElementChild.shadowRoot : that.menu)
            .querySelectorAll('smart-menu-item');
        const dataSource = column.menuItems || that.columnMenu.dataSource;
        let index = 0;
        for (let item in dataSource) {
            const menuItem = menuItems[index++];
            const properties = dataSource[item];

            menuItem.disabled = !properties.enabled;
            menuItem.classList.remove('smart-hidden');

            if (item === 'columnMenuItemRemoveSort') {
                if (column.sortOrder) {
                    menuItem.disabled = false;
                }
                else {
                    menuItem.disabled = true;
                }
            }

            if (item === 'columnMenuItemSortAsc' && column.sortOrder === 'asc') {
                menuItem.disabled = true;
            }
            else if (item === 'columnMenuItemSortDesc' && column.sortOrder === 'desc') {
                menuItem.disabled = true;
            }

            if (properties.visible === true) {
                menuItem.classList.remove('smart-hidden');
            }
            else if (properties.visible === false) {
                menuItem.classList.add('smart-hidden');
            }
            else if (properties.visible === 'auto') {
                if (item === 'columnMenuItemFilter' || item === 'columnMenuItemRemoveFilter') {
                    if (that.filtering.enabled === false) {
                        menuItem.classList.add('smart-hidden');
                    }
                    else {
                        if (that.filtering.filterMenu.visible || that.filtering.filterBuilder.visible) {
                            menuItem.classList.add('smart-hidden');
                        }
                        else if (that.filtering.filterBuilder.visible) {
                            menuItem.classList.remove('smart-hidden');
                        }
                    }
                }

                if (item === 'columnMenuItemGroupBy') {
                    if (that.grouping.enabled && column.allowGroup) {
                        menuItem.classList.remove('smart-hidden');
                    }
                    else {
                        menuItem.classList.add('smart-hidden');
                    }

                    const groupIndex = that.dataSource.groupBy.indexOf(column.dataField);

                    if (groupIndex >= 0) {
                        menuItem.disabled = true;
                    }
                    else {
                        menuItem.disabled = false;
                    }
                }

                if (item === 'columnMenuItemRemoveGroupBy') {
                    if (that.grouping.enabled && column.allowGroup) {
                        menuItem.classList.remove('smart-hidden');
                    }
                    else {
                        menuItem.classList.add('smart-hidden');
                    }

                    const groupIndex = that.dataSource.groupBy.indexOf(column.dataField);

                    if (groupIndex < 0) {
                        menuItem.disabled = true;
                    }
                    else {
                        menuItem.disabled = false;
                    }
                }

                if (item === 'columnMenuItemFilter' && !column.allowFilter) {
                    menuItem.classList.add('smart-hidden');
                }

                if (item === 'columnMenuItemRemoveFilter' && !column.allowFilter) {
                    menuItem.classList.add('smart-hidden');
                }

                if (item === 'columnMenuItemSortAsc' ||
                    item === 'columnMenuItemSortDesc' ||
                    item === 'columnMenuItemRemoveSort') {

                    if (column.allowSort && that.sorting.enabled) {
                        menuItem.classList.remove('smart-hidden');
                    }
                    else {
                        menuItem.classList.add('smart-hidden');
                    }
                }
            }
        }
    }

    /*
    Public API
    */

    openMenu(dataField) {
        const that = this;

        const column = that.columnByDataField[dataField];

        if (!column) {
            return;
        }

        that._openMenu(column);
    }

    hasMenu() {
        const that = this;

        if (that.menu && that.menu.column) {
            if (that.menu.parentNode) {
                return true;
            }
        }

        return false;
    }

    closeMenu() {
        const that = this;

        if (that.menu && that.menu.column) {
            if (that.menu.column) {
                that.menu.column.setProperty('menu', null);
                that.menu.column = null;
            }

            if (that.menu.parentNode) {
                that.menu.classList.remove('open');

                if (!that.appearance.allowColumnMenuAnimation) {
                    that.menu.parentNode.removeChild(that.menu);
                }
            }

            that.menu.removeEventListener('keydown', that._keyDownHandler.bind(that));
            that.menu.removeEventListener('itemClick', that.menu.itemClick);
            that.menu.removeEventListener('itemCheckChange', that.menu.itemCheckChange);

            that.focus();
        }
    }
});
