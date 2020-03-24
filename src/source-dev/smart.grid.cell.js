
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart.Utilities.Assign('Grid.Cell', class Cell {
    constructor(row, column) {
        const that = this;

        that.row = row;
        that.column = column;
        that.grid = row.grid;
        that.rowSpan = 1;
        that.colSpan = 1;
        that.value = undefined;
        that.fontSize = null;
        that.fontWeight = null;
        that.fontFamily = null;
        that.fontStyle = null;
        that.color = null;
        that.background = null;
        that.borderColor = null;
        that.tooltip = null;
        that.align = null;
        that.verticalAlign = null;
        that.readonly = false;
        that.oldValue = undefined;
        that._updating = false;
        that.styleChanged = true;
        that.editor = null;
        that.template = null;
        that.isEditing = false;
        that.canNotify = true;
        that.selected = false;
        that.focused = false;

        const proxy = new Proxy(that, {
            deleteProperty: function (target, property) {
                delete target[property];
                return true;
            },
    get: function (target, property) {
        if (property === 'value') {
            const cellValue = !that.column.displayField ? that.row.data[that.column.dataField] : that.row.data[that.column.displayField];

            return cellValue;
        }
        else if (property === 'editor' ||
            property === 'template') {
            return target[property] || that.column[property];
        }
        else if (property === 'focused') {
            if (that.grid.selection.allowCellSelection && that.grid._selection.focusedCell && that.grid._selection.focusedCell.row.id === that.row.id && that.grid._selection.focusedCell.column.dataField === that.column.dataField) {
                return true;
            }

            if (that.grid.selection.allowRowSelection && that.grid._selection.focusedCell && that.grid._selection.focusedCell.row.id === that.row.id && that.grid._selection.focusedCell.column.dataField === that.column.dataField) {
                return true;
            }
            const parent = that.parent();

            if (parent && that.grid.selection.allowCellSelection && that.grid._selection.focusedCell && that.grid._selection.focusedCell.row.id === parent.row.id && that.grid._selection.focusedCell.column.dataField === parent.column.dataField) {
                return true;
            }

            return false;
        }
        if (property === 'selected') {
            if (that.row.getProperty('selected') === true) {
                return true;
            }

            if (that.column.getProperty('selected') === true) {
                return true;
            }

            return that.grid._selection.cells['row' + that.row.id] ? that.grid._selection.cells['row' + that.row.id][that.column.dataField] : false;
        }

        else if (property === 'modifiedValue') {
            const tempValue = that.grid._cellsUpdatedValues[that.row.id + '_' + that.column.dataField];

            if (tempValue !== undefined) {
                return tempValue;
            }

            return target['value'];
        }

        return target[property];
    },
    set: function (target, propertyName, value) {
        const oldValue = this.get(target, propertyName);

        if (oldValue === value) {
            return true;
        }

        target[propertyName] = value;

        if (propertyName === 'element' || propertyName === 'isEditing' || propertyName === 'oldValue' || propertyName === '_updating' || propertyName === 'notifyFn' || propertyName.startsWith('_') || propertyName === 'canNotify') {
            return true;
        }

        if (propertyName === 'focused') {
            that.grid._selection.focusedCell = that;
        }

        if (propertyName === 'colSpan' || propertyName === 'rowSpan') {
            if (value >= 0 && that.grid._cellsMerge.indexOf(that) === -1) {
                that.grid._cellsMerge.push(that);
            }
        }

        if (propertyName === 'row' || propertyName === 'column' || propertyName === 'grid' ||
            propertyName === 'styleChanged') {
            return true;
        }

        if (propertyName === 'background' ||
            propertyName === 'fontSize' ||
            propertyName === 'fontWeight' ||
            propertyName === 'fontFamily' ||
            propertyName === 'color' ||
            propertyName === 'borderColor' ||
            propertyName === 'fontStyle'
        ) {
            that._styleChanged = true;
        }

        if (propertyName === 'value') {
            if (that.oldValue === undefined) {
                that.oldValue = oldValue;
            }

            const updateCellValue = () => {
                that.grid.dataSource.boundSource.canNotify = false;

                if (value !== null && value.label && value.value) {
                    that.row.data[that.column.displayField] = value.label;
                    that.row.data[that.column.dataField] = value.value;
                }
                else {
                    if (that.column.valueField) {
                        that.row.data[that.column.valueField] = value;
                    }

                    that.row.data[that.column.dataField] = value;
                }

                const dataItem = that.grid.dataSource.dataItemById[that.row.id];

                if (dataItem) {
                    const index = dataItem.$.index;

                    if (value !== that.grid.dataSource[index][that.column.dataField]) {
                        that.grid.dataSource[index][that.column.dataField] = value;
                    }
                }

                that.grid.dataSource.boundSource.canNotify = true;
            }

            updateCellValue();
        }

        if (propertyName === 'selected') {
            if (that.grid._selection.cells['row' + that.row.id]) {
                delete that.grid._selection.cells['row' + that.row.id][that.column.dataField];

                if (Object.getOwnPropertyNames(that.grid._selection.cells['row' + that.row.id]).length === 1) {
                    delete that.grid._selection.cells['row' + that.row.id];
                }
            }

            if (that.grid._selection.cells['column' + that.column.dataField]) {
                delete that.grid._selection.cells['column' + that.column.dataField][that.row.id];

                if (Object.getOwnPropertyNames(that.grid._selection.cells['column' + that.column.dataField]).length === 1) {
                    delete that.grid._selection.cells['column' + that.column.dataField];
                }
            }

            if (value) {
                if (!that.grid._selection.cells['row' + that.row.id]) {
                    that.grid._selection.cells['row' + that.row.id] = [];
                }

                if (!that.grid._selection.cells['column' + that.column.dataField]) {
                    that.grid._selection.cells['column' + that.column.dataField] = [];
                }

                that.grid._selection.cells['row' + that.row.id][that.column.dataField] = true;
                that.grid._selection.cells['column' + that.column.dataField][that.row.id] = true;
            }
        }

        if (that._updating || !that.canNotify) {
            return true;
        }

        if (!that.row.canNotify) {
            return true;
        }

        that.grid._recycle();

        if (that.propertyChanged) {
            that.propertyChanged(name.substring(1), oldValue/*, newValue*/);
        }


        return true;
    }
        });

        return proxy;
    }

    setStyle(element) {
        const that = this;

        if (that._styleChanged) {
            element.style.background = that.background;
            element.style.borderColor = that.borderColor;
            element.style.color = that.color;
            element.style.fontSize = that.fontSize;
            element.style.fontFamily = that.fontFamily;
            element.style.fontWeight = that.fontWeight;
            element.style.fontStyle = that.fontStyle;
            element.style.paddingBottom = '';

            that._styleChanged = false;
        }
    }

    getFormattedValue(value, format) {
        const that = this;

        if (value === undefined || value === null || value === '') {
            return value;
        }

        if (that.column.dataType === 'date' || that.column.dataType === 'datetime' || that.column.dataType === 'time') {
            return that.formatDate(value, format);
        }

        if (that.column.dataType === 'int' ||
            that.column.dataType === 'int64' ||
            that.column.dataType === 'float' ||
            that.column.dataType === 'number') {
            return that.formatNumber(value, format);
        }

        return value;
    }

    /**
   * Formats a date.
   */
    formatDate(value, format) {
        if (!Smart.Utilities.DateTime) {
            return value;
        }

        const that = this;
        const grid = that.grid;

        if (that.column.formatSettings.Intl && that.column.formatSettings.Intl.DateTimeFormat) {
            const formattedValue = new Intl.DateTimeFormat(this.grid.locale, that.column.formatSettings.Intl.DateTimeFormat).format(value);

            return formattedValue;
        }

        if (!format && that.column.formatSettings.dateFormat) {
            format = that.column.formatSettings.dateFormat;
        }

        try {
            const date = new Smart.Utilities.DateTime(value);

            date.calendar.locale = grid.locale;

            if (grid.messages[grid.locale] && grid.messages[grid.locale].calendar) {
                if (grid.messages[grid.locale].calendar.months) {
                    date.calendar.months = grid.messages[grid.locale].calendar.months;
                }

                if (grid.messages[grid.locale].calendar.days) {
                    date.calendar.days = grid.messages[grid.locale].calendar.days;
                }

                if (grid.messages[grid.locale].calendar.firstDay !== undefined) {
                    date.calendar.firstDay = grid.messages[grid.locale].calendar.firstDay;
                }

                if (grid.messages[grid.locale].calendar.eras !== undefined) {
                    date.calendar.eras = grid.messages[grid.locale].calendar.eras;
                }

                if (grid.messages[grid.locale].calendar.AM !== undefined) {
                    date.calendar.AM = grid.messages[grid.locale].calendar.AM;
                }

                if (grid.messages[grid.locale].calendar.PM !== undefined) {
                    date.calendar.PM = grid.messages[grid.locale].calendar.PM;
                }

                if (grid.messages[grid.locale].calendar['/'] !== undefined) {
                    date.calendar['/'] = grid.messages[grid.locale].calendar['/'];
                }

                if (grid.messages[grid.locale].calendar[':'] !== undefined) {
                    date.calendar[':'] = grid.messages[grid.locale].calendar[':'];
                }
            }

            return date.toString(format);
        }
        catch (e) {
            return value;
        }
    }

    /**
     * Formats a number.
     */
    formatNumber(value, format) {
        if (!Smart.Utilities.NumberRenderer) {
            return value;
        }

        const that = this;
        const grid = that.grid;

        if (that.column.formatSettings.Intl && that.column.formatSettings.Intl.NumberFormat) {
            const formattedValue = new Intl.NumberFormat(this.grid.locale, that.column.formatSettings.Intl.NumberFormat).format(value);

            return formattedValue;
        }

        const renderer = new Smart.Utilities.NumberRenderer();

        if (renderer.localizationObject) {
            const formatSettings = that.column.formatSettings;
            const calendar = grid.messages[grid.locale] ? grid.messages[grid.locale].calendar : {};

            if (formatSettings.decimalPlaces) {
                renderer.localizationObject.decimalPlaces = formatSettings.decimalPlaces;
            }

            if (formatSettings.decimalSeparator || calendar.decimalSeparator) {
                renderer.localizationObject.decimalSeparator = formatSettings.decimalSeparator || calendar.decimalSeparator;
            }

            if (formatSettings.thousandsSeparator || calendar.thousandsSeparator) {
                renderer.localizationObject.thousandsSeparator = formatSettings.thousandsSeparator || calendar.thousandsSeparator;
            }

            renderer.localizationObject.currencysymbol = calendar.currencySymbol;
            renderer.localizationObject.currencysymbolposition = calendar.currencySymbolPosition;

            if (formatSettings.prefix) {
                renderer.localizationObject.currencysymbol = formatSettings.prefix;
            }

            if (formatSettings.sufix) {
                renderer.localizationObject.currencysymbol = formatSettings.sufix;
                renderer.localizationObject.currencysymbolposition = 'after';
            }
        }

        const output = renderer.formatNumber(value, format);

        if (output === undefined) {
            return value;
        }

        if (value < 0 && that.column.formatSettings.negativeWithBrackets) {
            return '(' + output + ')';
        }

        return output;
    }


    refresh() {
        const that = this;

        if (that.element) {
            const htmlCellContent = that.element.firstChild;

            that.setStyle(htmlCellContent);
        }
    }

    setProperties(properties) {
        const that = this;

        that._updating = true;

        for (let propertyName in properties) {
            that[propertyName] = properties[propertyName];
        }

        that._updating = false;

        that.grid._recycle();
    }

    createElement() {
        const that = this;
        const element = document.createElement('smart-grid-cell');

        element.setAttribute('role', 'gridcell');
        that.element = element;
        element._initialize(that);

        return element;
    }

    render() {
        const that = this;

        if (!that.element) {
            return;
        }

        that.element._render();
    }

    parent(getSiblingsData) {
        const that = this;
        const row = that.row;
        const dataField = that.column.dataField;
        const grid = that.grid;

        if (!grid._cellsMerge.length) {
            return null;
        }

        if (that.__parentCells) {
            if (that.__parentCells['row' + row.id + '_column_' + dataField] !== undefined) {
                return that.__parentCells['row' + row.id + '_column_' + dataField];
            }
        }

        let visibleRows = grid.getVisibleRows();

        if (grid.paging.enabled && grid.selection.selectAllMode === 'page') {
            visibleRows = visibleRows.slice(grid.paging.pageIndex * grid.paging.pageSize, (grid.paging.pageIndex + 1) * grid.paging.pageSize);
        }

        if (!that.__parentCells) {
            that.__parentCells = [];
        }

        for (let i = 0; i < grid._cellsMerge.length; i++) {
            const cell = grid._cellsMerge[i];

            let rows = [];
            let columns = [];

            rows.push(cell.row);

            if (cell.rowSpan > 1) {
                const startRowIndex = visibleRows.indexOf(cell.row);

                if (startRowIndex >= 0) {
                    for (let r = startRowIndex; r < startRowIndex + cell.rowSpan; r++) {
                        if (visibleRows[r] && rows.indexOf(visibleRows[r]) === -1) {
                            rows.push(visibleRows[r]);
                        }
                    }
                }
            }

            columns.push(cell.column.dataField);

            if (cell.colSpan > 1) {
                const startColumnIndex = grid.columns.indexOf(grid.columnByDataField[cell.column.dataField]);

                for (let r = startColumnIndex; r < startColumnIndex + cell.colSpan; r++) {
                    if (grid.columns[r] && columns.indexOf(grid.columns[r].dataField) === -1) {
                        columns.push(grid.columns[r].dataField);
                    }
                }
            }

            if (rows.indexOf(row) >= 0 && columns.indexOf(dataField) >= 0) {
                if (getSiblingsData) {
                    const parentCell = {
                        cell: cell.row.getCell(cell.column.dataField), rows: rows, columns: columns, row: cell.row, column: cell.column, endRow: rows[rows.length - 1], endColumn: grid.columnByDataField[columns[columns.length - 1]]
                    };

                    that.__parentCells['row' + row.id + '_column_' + dataField] = parentCell;

                    return parentCell;
                }

                const parentCell = cell.row.getCell(cell.column.dataField);

                that.__parentCells['row' + row.id + '_column_' + dataField] = parentCell;

                return parentCell;
            }
        }

        that.__parentCells['row' + row.id + '_column_' + dataField] = null;

        return null;
    }
});


Smart('smart-grid-cell', class Cell extends Smart.BaseElement {
    static get properties() {
        return {
        }
    }

    get hasStyleObserver() {
        return false;
    }

    get enableShadowDOM() {
        return false;
    }

    addThemeClass() {

    }

    addDefaultClass() {

    }

    get isUtilityElement() {
        return true;
    }

    _refresh() {
        const that = this;

        that.innerHTML = '';
        that._initialize(that.cell);
    }

    _initialize(cell) {
        const that = this;
        const content = document.createElement('div');
        const column = cell.column;
        const row = cell.row;
        const grid = cell.grid;

        that.cell = cell;
        that.appendChild(content);

        let shouldAddToggleButton = false;

        if (column && column._treeColumn && grid.dataSource.boundHierarchy) {
            shouldAddToggleButton = true;

            if (!grid.grouping.enabled && grid.dataSource.groupBy && grid.dataSource.groupBy.length > 0) {
                shouldAddToggleButton = false;
            }
        }

        if (shouldAddToggleButton) {
            const indent = document.createElement('div');
            const button = document.createElement('button');
            const label = document.createElement('div');
            const container = document.createElement('div');
            const checkbox = document.createElement('div');
            const checkboxInput = document.createElement('span');

            if (row.expanded) {
                button.setAttribute('toggled', '');
            }
            else {
                button.removeAttribute('toggled', '');
            }

            that.toggleButton = button;
            that.checkbox = checkbox;
            content.appendChild(indent);
            content.appendChild(container);

            container.setAttribute('content', '');
            indent.setAttribute('indent', '');
            label.setAttribute('label', '');
            button.setAttribute('toggle-button', '');
            checkbox.setAttribute('checkbox', '');
            checkbox.setAttribute('role', 'checkbox');

            that.setAttribute('has-toggle-button', '');
            container.appendChild(button);
            container.appendChild(checkbox);
            checkboxInput.classList.add('smart-input');

            checkbox.appendChild(checkboxInput);
            if (grid.checkBoxes.visible) {
                checkboxInput.classList.remove('smart-hidden');
            }
            else {
                checkboxInput.classList.add('smart-hidden');
            }

            container.appendChild(label);
            that.content = label;
            that.isRendered = true;
            return;
        }
        else {
            const label = document.createElement('div');

            content.appendChild(label);
        }

        that.content = content;
        that.isRendered = true;
    }

    _renderCommands() {
        const that = this;

        const grid = that.cell.grid;

        if (grid.__cellsCommandTemplate) {
            that.firstChild.innerHTML = grid.__cellsCommandTemplate;

            grid._updateCommandColumnCommandsVisibility(that.firstChild, that.cell.row);
            return;
        }

        const commandHTML = grid._getCommandColumnCommandsTemplate();

        that.firstChild.innerHTML = commandHTML;
        grid._updateCommandColumnCommandsVisibility(that.firstChild, that.cell.row);
        grid.__cellsCommandTemplate = commandHTML;
    }

    _renderGroupCell() {
        const that = this;
        const grid = that.cell.grid;
        const column = that.cell.column;
        const row = that.cell.row;
        //const data = row.data;

        [...that.attributes].forEach(attr => that.removeAttribute(attr.name));

        if (that.style.width !== column.computedWidth + 'px') {
            that.style.width = column.computedWidth + 'px';
        }

        if (!grid.rightToLeft) {
            if (that.style.left !== column.left + 'px') {
                that.style.left = column.left + 'px';
            }
        }
        else {
            if (that.style.right !== column.left + 'px') {
                that.style.right = column.left + 'px';
            }
        }

        if (that.classList.contains('smart-hidden')) {
            that.classList.remove('smart-hidden');
        }

        if (column.autoGenerated) {
            that.style.width = '0px';
        }

        let cellValue = row.label;

        if (row.label !== undefined) {
            let summary = '';

            if (grid.grouping.summaryRow.visible) {
                const getAllSubRows = function (dataField, rows, subRows) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];

                        if (row[dataField] !== undefined) {
                            subRows.push(row);
                        }

                        if (row.summaryRow) {
                            continue;
                        }

                        if (row['children']) {
                            getAllSubRows(dataField, row['children'], subRows);
                        }
                        else if (row.data && row.data['children']) {
                            getAllSubRows(dataField, row['children'], subRows);
                        }
                    }

                    return subRows;
                }

                const subRows = getAllSubRows(column.dataField, row.summaryRow ? row.parent.data['children'] : row.data['children'], []);
                const summaryObject = {
                };
                const summaryFunctions = column._treeColumn ? (column.summary.length > 0 ? column.summary : ['count']) : column.summary;

                summaryObject[column.dataField] = summaryFunctions;

                const summaryResult = summaryFunctions.length > 0 ? grid.dataSource.summarize([summaryObject], subRows) : null;

                if (summaryResult) {
                    for (let i = 0; i < summaryFunctions.length; i++) {
                        const summaryFunction = summaryFunctions[i];

                        summary += '<span summary>' + grid.localize(summaryFunction, { value: summaryResult[column.dataField][summaryFunction] }); + '</span>';
                    }
                }
            }

            if (column._treeColumn) {
                if (!row.summaryRow) {
                    cellValue = '<div header><span group>' + grid.columnByDataField[row.groupDataField].label + '</span><span value>' + row.label + '</span></div>';
                }
                else {
                    cellValue = '<div header><span group></span><span value></span></div>';
                }

                if (summary) {
                    cellValue += '<div summary>';
                    cellValue += summary;
                    cellValue += '</div>';
                }

                that.setAttribute('has-toggle-button', '');
            }
            else {
                that.removeAttribute('has-toggle-button', '');


                cellValue = '<div content><div label><div header><span group></span><span value></span></div>';

                if (summary) {
                    cellValue += '<div summary>';
                    cellValue += summary;
                    cellValue += '</div>';
                }

                cellValue += '</div></div>';
            }
        }

        const htmlCellContent = that.firstChild;

        if (grid.dataSource.boundHierarchy && column._treeColumn) {
            const indent = htmlCellContent.children[0];
            const toggleButton = htmlCellContent.children[1].children[0];
            const checkbox = htmlCellContent.children[1].children[1].firstChild;
            const content = htmlCellContent.children[1].children[2];

            indent.setAttribute('indent', '');

            if (row.checked) {
                checkbox.setAttribute('checked', '');
            }
            else if (row.checked === false) {
                checkbox.removeAttribute('checked');
            }
            else if (row.checked === null) {
                checkbox.setAttribute('checked', 'indeterminate');
            }

            if (!row.leaf) {
                toggleButton.classList.remove('smart-visibility-hidden');
                if (row.expanded) {
                    toggleButton.setAttribute('toggled', '');
                }
                else {
                    toggleButton.removeAttribute('toggled', '');
                }
            }
            else {
                toggleButton.classList.add('smart-visibility-hidden');
            }

            let indentDiv = '';

            if (!column._treeColumn) {
                that.toggleButton.classList.add('smart-hidden');
            }
            else {
                that.toggleButton.classList.remove('smart-hidden');
            }

            if (column._treeColumn) {
                if (grid.grouping.enabled && grid.dataSource.groupBy.length > 0) {
                    let level = row.level;

                    if (undefined === row.label) {
                        level--;
                    }

                    indentDiv += '<div style="width: ' + (1 + level) * grid.grouping.groupIndent + 'px;"></div>';
                }
                else {
                    for (let i = 0; i < row.level; i++) {
                        indentDiv += '<div class=\'smart-indent\'></div>';
                    }
                }
            }

            if (undefined === row.label) {
                toggleButton.classList.add('smart-hidden');
            }
            else {
                toggleButton.classList.remove('smart-hidden');
                toggleButton.style.marginLeft = '';

                if (column._treeColumn && grid.grouping.enabled && grid.grouping.toggleButtonIndent > 0) {
                    toggleButton.style.marginLeft = row.level * (grid.grouping.toggleButtonIndent - grid.grouping.groupIndent) + 'px';
                }
            }


            indent.innerHTML = indentDiv;
            content.innerHTML = cellValue;

            if (grid.appearance.showTooltips) {
                content.setAttribute('title', row.label ? row.label : cellValue);
            }
            else if (content.hasAttribute('title')) {
                content.removeAttribute('title');
            }
        }
        else if (row.label !== undefined && grid.grouping.enabled && !column._treeColumn) {
            htmlCellContent.innerHTML = cellValue;
        }

        if (grid.grouping.enabled && grid.dataSource.groupBy && grid.dataSource.groupBy.length > 0) {
            const indent = grid.grouping.groupIndent * (1 + row.level);

            if (column.dataField === grid.columns[grid.columns.length - 1].dataField) {
                that.style.width = column.computedWidth - indent + 'px';
                if (grid.appearance.showColumnLines) {
                    htmlCellContent.firstChild.classList.add('smart-grid-column-border');
                }
            }
        }

        let cellContentClassName = 'smart-label';

        if (htmlCellContent.className !== cellContentClassName) {
            htmlCellContent.className = cellContentClassName;
        }

        if (column.formatFunction) {
            const formatObject = {
                row: row,
                column: column,
                cell: that.cell,
                value: null,
                template: null,
                group: {
                    value: cellValue,
                    template: null
                }
            };

            column.formatFunction(formatObject);

            if (formatObject.group.value !== cellValue) {
                htmlCellContent.innerHTML = formatObject.group.value;
            }

            if (formatObject.group.template !== null) {
                htmlCellContent.innerHTML = formatObject.group.template;
            }
        }
    }

    _render() {
        const that = this;
        const grid = that.cell.grid;
        const column = that.cell.column;
        const row = that.cell.row;
        const data = row.data;
        const cellsFormat = !row._isMeasureRow ? column.cellsFormat : null;

        if (grid.grouping.enabled && grid.dataSource.groupBy.length > 0 && row.label !== undefined) {
            that._renderGroupCell();
            return;
        }

        if (grid.grouping.enabled && grid.dataSource.groupBy.length > 0 && that.toggleButton) {
            that.toggleButton.classList.remove('smart-hidden');
            that.toggleButton.classList.remove('smart-visibility-hidden');
            that.toggleButton.style.marginLeft = '';

            if (column._treeColumn && grid.grouping.enabled && grid.grouping.toggleButtonIndent > 0) {
                that.toggleButton.style.marginLeft = row.level * (grid.grouping.toggleButtonIndent - grid.grouping.groupIndent) + 'px';
            }
        }

        if (!column.visible) {
            that.style.width = '0px';
            return;
        }

        if (grid.appearance.showSortColumnBackground) {
            column.sorted ? that.setAttribute('sort', '') : that.removeAttribute('sort');
        }
        else if (column.sorted && that.hasAttribute('sort')) {
            that.removeAttribute('sort');
        }

        if (grid.appearance.showFilterColumnBackground) {
            column.filtered ? that.setAttribute('filter', '') : that.removeAttribute('filter');
        }
        else if (column.filtered && that.hasAttribute('filter')) {
            that.removeAttribute('filter');
        }

        if (grid.dataSource.boundHierarchy && that.hasAttribute('has-toggle-button') && !column._treeColumn) {
            that.removeAttribute('has-toggle-button');
        }

        let cellValue = !column.displayField ? data[column.dataField] : data[column.displayField];

        if (grid.editing.batch) {
            if (grid._cellsUpdatedValues) {
                that.removeAttribute('update');

                const tempValue = grid._cellsUpdatedValues[row.id + '_' + column.dataField];

                if (tempValue !== undefined) {
                    that.setAttribute('update', '');
                    cellValue = tempValue;
                }
            }

            if (grid._rowsDeleted) {
                if (grid._rowsDeleted.indexOf(row) >= 0) {
                    that.setAttribute('delete', '');
                }
                else {
                    that.removeAttribute('delete');
                }
            }

            if (grid._rowsAdded) {
                if (grid._rowsAdded.indexOf(row.id) >= 0) {
                    that.setAttribute('add', '');
                }
                else {
                    that.removeAttribute('add');
                }
            }
        }

        if (grid.onCellValue && !(column.rowHeaderColumn || column.selectionColumn)) {
            that.cell._updating = true;
            grid.onCellValue(that.cell);
            that.cell._updating = false;

            cellValue = that.cell.value;
        }

        if (cellValue === undefined) {
            cellValue = '';
        }

        let formattedValue = cellValue;

        if (cellsFormat) {
            formattedValue = that.cell.getFormattedValue(cellValue, cellsFormat);
        }

        const htmlCellContent = that.firstChild;

        if (grid.onCellRender || column.onCellRender) {
            requestAnimationFrame(function () {
                if (!column._cellsCachedValues) {
                    column._cellsCachedValues = [];
                }

                if (column._cellsCachedValues[row.index]) {
                    const cellContent = column._cellsCachedValues[row.index];

                    if (htmlCellContent.firstChild) {
                        htmlCellContent.removeChild(htmlCellContent.firstChild);
                    }

                    htmlCellContent.appendChild(cellContent);
                }
                else {
                    grid.onCellRender ? grid.onCellRender(that.cell) : column.onCellRender(that.cell);

                    if (that.cell.template !== column.template) {
                        const cellContent = document.createElement('div');

                        if (htmlCellContent.firstChild) {
                            htmlCellContent.removeChild(htmlCellContent.firstChild);
                        }

                        if (that.cell.template instanceof HTMLTemplateElement) {
                            cellContent.appendChild(that.cell.template.cloneNode(true));
                        }
                        else {
                            cellContent.appendChild(that.cell.template);
                        }

                        htmlCellContent.appendChild(cellContent);

                        column._cellsCachedValues[row.index] = cellContent;

                        return;
                    }
                }
            });
        }

        if (!column.autoGenerated) {
            that.setAttribute('data-field', column.dataField);
        }

        if (that.cell.focused) {
            if (grid.selection.allowCellSelection) {
                that.setAttribute('focus', '');
            }
            row.element.setAttribute('focus', '');

            if (!that.cell.id) {
                that.id = 'gridcell' + '_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            grid.setAttribute('aria-activedescendant', that.id);
        }
        else {
            that.removeAttribute('focus');
        }

        if (that.cell.selected) {
            that.setAttribute('selected', '');
            that.setAttribute('aria-selected', true);
        }
        else {
            that.removeAttribute('selected');
            that.removeAttribute('aria-selected');
        }


        if (grid.rowDetail.enabled && row.showDetail) {
            that.style.height = row.cellHeight + 'px';
            that.style.lineHeight = row.cellHeight + 'px';
        }

        if (row.expanded && row.expandHeight > 0) {
            that.style.height = row.cellHeight + 'px';
            that.style.lineHeight = row.cellHeight + 'px';
        }

        const alignment = that._getCellAlignment(row, column);
        const hasTemplate = that.cell.template !== '' && grid.isInitialized && !row._isMeasureRow;

        let cellContentClassName = '';

        if (alignment.align) {
            cellContentClassName += alignment.align + ' ';
        }

        if (alignment.verticalAlign) {
            cellContentClassName += alignment.verticalAlign + ' ';
        }

        if (column.cellsWrap) {
            cellContentClassName += 'wrap' + ' ';
        }

        cellContentClassName += 'smart-label';

        if (that.style.width !== column.computedWidth + 'px') {
            const isLastColumn = grid._isLastVisibleColumn(column);

            if (column.autoGenerated || isLastColumn) {
                that.style.width = column.computedWidth + 'px';
            }
            else {
                that.style.width = column.computedWidth - grid._columnGap + 'px';
            }
        }

        if (grid.grouping.enabled && grid.dataSource.groupBy && grid.dataSource.groupBy.length > 0) {
            const indent = grid.grouping.groupIndent * (1 + row.level);

            if (column.dataField === grid.columns[grid.columns.length - 1].dataField) {
                that.style.width = column.computedWidth - indent + grid.grouping.groupIndent + 'px';

                if (grid.appearance.showColumnLines) {
                    that.classList.add('smart-grid-column-border');
                }
            }
        }

        if (column === grid._firstVisibleColumn) {
            that.classList.add('smart-grid-column-border-collapse');
        }
        else {
            that.classList.remove('smart-grid-column-border-collapse');
        }

        if (grid._columnGap > 0 && grid.appearance.showColumnLines) {
            that.classList.add('smart-grid-column-border');
        }

        if (grid._rowGap > 0) {
            that.classList.add('smart-grid-row-border');
        }

        if (!grid.appearance.showColumnLines) {
            that.classList.add('smart-grid-vertical-border-collapse');
        }
        else {
            that.classList.remove('smart-grid-vertical-border-collapse');
        }

        if (!grid.appearance.showRowLines) {
            that.classList.add('smart-grid-horizontal-border-collapse');
        }
        else {
            that.classList.remove('smart-grid-horizontal-border-collapse');
        }


        let left = column.left;

        if (!grid.rightToLeft) {
            if (that.style.left !== left + 'px') {
                that.style.left = left + 'px';
            }
        }
        else {
            if (that.style.right !== left + 'px') {
                that.style.right = left + 'px';
            }
        }

        if (that.classList.contains('smart-hidden')) {
            that.classList.remove('smart-hidden');
        }

        if (that.hasAttribute('template')) {
            that.removeAttribute('template');
        }

        if (that.hasAttribute('freeze')) {
            that.removeAttribute('freeze');
        }

        if (that.hasAttribute('detail')) {
            that.removeAttribute('detail');
        }

        if (row.filterRow) {
            that.classList.add('smart-grid-filter-row-cell');
        }
        else if (row.summaryRow) {
            that.classList.add('smart-grid-summary-row-cell');
        }
        else if (column.freeze || row.freeze) {
            if (column.selectionColumn) {
                that.setAttribute('checkbox', '');
                cellContentClassName += ' smart-input';

                if (column.grid.selection.checkBoxes.enabled && column.grid.selection.checkBoxes.autoShow) {
                    that.setAttribute('auto-show', '');
                }
                else {
                    that.removeAttribute('auto-show');
                }
            }

            if (column.rowHeaderColumn || column.selectionColumn) {
                that.setAttribute('header', '');
                that.setAttribute('role', 'rowheader');
            }

            if (column.rowDetailColumn) {
                that.setAttribute('header', '');
                that.setAttribute('detail', '');
                that.setAttribute('has-toggle-button', '');
            }

            if (column.commandColumn) {
                that.setAttribute('command', '');
            }

            if (grid.appearance.showFrozenColumnBackground && column.freeze) {
                that.setAttribute('freeze', '');
            }

            if (grid.appearance.showFrozenRowBackground && row.freeze) {
                that.setAttribute('freeze', '');
            }
        }

        if (column.cellsRotationAngle) {
            const rotateResult = that._rotateCellContent(htmlCellContent, column, cellValue);

            if (!rotateResult) {
                return;
            }
        }
        else {
            if (row.filterRow) {
                if (column.toggleColumn || column.rowHeaderColumn) {
                    htmlCellContent.innerHTML = '';
                }
                else {
                    if (!column.filterEditorInitialized) {
                        column.filterEditorInitialized = true;
                    }
                }
            }
            else if (row.summaryRow) {
                if (column.toggleColumn || column.rowHeaderColumn) {
                    htmlCellContent.innerHTML = '';
                }
                else {
                    if (column.summary.length > 0 && grid._summaryItems) {
                        const summaryItem = grid._summaryItems[column.dataField];

                        let index = 0;

                        for (let summaryItemFunction in summaryItem) {
                            if (index === row.summaryRowIndex) {
                                htmlCellContent.innerHTML = grid.localize(summaryItemFunction, { value: summaryItem[summaryItemFunction] });
                            }
                            index++;
                        }
                    }
                }
            }
            else {
                if (grid.rowDetail.enabled && column.rowDetailColumn) {
                    if (htmlCellContent.innerHTML !== '') {
                        if (row.showDetail) {
                            htmlCellContent.innerHTML = '<button class="smart-animate" toggled toggle-button></button>';
                        }
                        else {
                            htmlCellContent.innerHTML = '<button class="smart-animate" toggle-button></button>';
                        }

                        row.element.toggleDetailButton = that.querySelector('button');
                    }
                }
                else if (column.commandColumn) {
                    that._renderCommands();
                }
                else if (grid.appearance.showRowHeaderNumber && column.rowHeaderColumn) {
                    if (row.addNewRow) {
                        htmlCellContent.textContent = '';
                    }
                    else {
                        const getLabel = (row) => {
                            if (that.cell.value) {
                                return that.cell.value;
                            }

                            if (grid.appearance.autoGenerateRowLabelMode === 'number') {
                                return row.visibleIndex + 1;
                            }
                            else {
                                const index = row.visibleIndex % 26;
                                const prefixes = Math.floor(row.visibleIndex / 26);
                                const charCode = 'A'.charCodeAt(0);
                                const letter = String.fromCharCode(charCode + index);
                                let prefix = '';

                                for (let p = 0; p < prefixes; p++) {
                                    prefix += 'A';
                                }

                                const label = prefix + letter;

                                return label;
                            }
                        }

                        if (grid._rowsAdded) {
                            if (grid._rowsAdded.indexOf(row.id) >= 0) {
                                htmlCellContent.textContent = '';
                            }
                            else {
                                htmlCellContent.textContent = getLabel(row);
                            }
                        }
                        else {
                            htmlCellContent.textContent = getLabel(row);
                        }
                    }
                }
                else if (hasTemplate) {

                    that.removeAttribute('readonly');

                    switch (that.cell.template) {
                        case 'checkBox':
                        case 'switchButton':
                        case 'radioButton':
                            if (htmlCellContent.textContent !== '') {
                                htmlCellContent.textContent = '';
                            }

                            if (!grid.editing.enabled || !column.allowEdit || that.cell.readonly || (grid.editing.enabled && grid.editing.commandColumn.visible && grid.editing.editRow !== that.cell.row)) {
                                that.setAttribute('readonly', '');
                            }

                            if (htmlCellContent.innerHTML !== '<span class="smart-input"></span>') {
                                htmlCellContent.innerHTML = '<span class="smart-input"></span>';
                            }

                            if (cellValue) {
                                htmlCellContent.firstChild.setAttribute('checked', '');
                            }
                            else if (cellValue === null) {
                                htmlCellContent.firstChild.setAttribute('checked', 'indeterminate');
                            }
                            else {
                                htmlCellContent.firstChild.removeAttribute('checked');
                            }

                            that.setAttribute('template', that.cell.template);
                            break;
                        default: {
                            let template = null;
                            that.setAttribute('template', '');

                            if (typeof that.cell.template === 'function') {
                                const formatObject = {
                                    row: row,
                                    column: column,
                                    cell: that.cell,
                                    oldValue: that.cell.oldValue,
                                    value: cellValue,
                                    template: null
                                };

                                let cellTemplate = htmlCellContent.querySelector('.smart-grid-cell-template');


                                if (cellTemplate && cellTemplate.getAttribute('column') === column.dataField) {
                                    formatObject.template = cellTemplate.firstElementChild;
                                }
                                else {
                                    cellTemplate = null;
                                }

                                if (that.formattedValue !== formattedValue) {
                                    cellTemplate = null;
                                }

                                if (!cellTemplate) {
                                    that.cell.template(formatObject);
                                }

                                if (!cellTemplate && formatObject.template) {
                                    if (formatObject.template instanceof HTMLElement) {
                                        const templateContainer = document.createElement('div');

                                        templateContainer.classList.add('smart-grid-cell-template');
                                        templateContainer.setAttribute('column', column.dataField);
                                        htmlCellContent.innerHTML = '';
                                        htmlCellContent.appendChild(templateContainer);
                                        templateContainer.appendChild(formatObject.template);
                                    }
                                    else {
                                        htmlCellContent.innerHTML = '<div column="' + column.dataField + '" class="smart-grid-cell-template">' + formatObject.template + '</div>';
                                    }
                                }
                                else if (!cellTemplate && formatObject.template === null) {
                                    htmlCellContent.innerHTML = cellValue;
                                }

                                if (that.cell._styleChanged) {
                                    that.cell.setStyle(htmlCellContent);
                                }


                                if (that.cell.oldValue === undefined) {
                                    that.cell.oldValue = cellValue;
                                }

                                that.formattedValue = formattedValue;
                            }
                            else {
                                if (htmlCellContent.textContent !== '') {
                                    htmlCellContent.textContent = '';
                                }

                                if (that.cell.template.startsWith('#')) {
                                    template = document.querySelector(that.cell.template);
                                }

                                if (template) {
                                    const templateContent = template.content.cloneNode(true).firstElementChild;

                                    cellValue = cellValue.toString();
                                    cellValue = cellValue.replace(/'/ig, '\\\'');
                                    cellValue = cellValue.replace(/"/ig, '\\"');

                                    let html = templateContent.outerHTML.replace(/{{value}}/ig, cellValue).replace(/{{id}}/ig, row.id);

                                    if (html.indexOf('{{value=') >= 0) {
                                        if (!cellValue) {
                                            html = html.replace(/{{value=/ig, '');
                                            html = html.replace(/}}/ig, '');
                                        }
                                        else {
                                            html = html.substring(0, html.indexOf('{{value=')) + cellValue + html.substring(html.indexOf('}'));
                                            html = html.replace(/}/ig, '');
                                            html = html.replace(/{/ig, '');
                                        }
                                    }

                                    if (htmlCellContent.innerHTML !== html) {
                                        htmlCellContent.innerHTML = html;
                                    }
                                }
                                else {
                                    const html = that.cell.template.replace(/{{value}}/ig, cellValue).replace(/{{id}}/ig, row.id);

                                    if (htmlCellContent.innerHTML !== html) {
                                        htmlCellContent.innerHTML = html;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (column.selectionColumn) {
                    if (grid.selectionMode === 'checkBox') {

                        if (row.getProperty('selected')) {
                            that.setAttribute('selected', '');
                            that.element.setAttribute('aria-selected', true);
                        }
                        else {
                            if (that.getAttribute('selected')) {
                                that.removeAttribute('selected');
                                that.element.removeAttribute('aria-selected');
                            }
                        }
                    }
                }

                else {
                    const firstChild = htmlCellContent.firstChild;

                    if (firstChild && firstChild.classList && that.toggleButton && column._treeColumn) {
                        const indent = htmlCellContent.children[0];
                        const toggleButton = htmlCellContent.children[1].children[0];
                        const checkbox = htmlCellContent.children[1].children[1].firstChild;
                        const content = htmlCellContent.children[1].children[2];

                        let indentDiv = '';

                        if (column._treeColumn) {
                            if (grid.grouping.enabled) {
                                let level = row.level - 1;

                                indentDiv += '<div style="width: ' + (1 + level) * grid.grouping.groupIndent + 'px;"></div>';
                            }
                            else {
                                for (let i = 0; i < row.level; i++) {
                                    indentDiv += '<div class=\'smart-indent\'></div>';
                                }
                            }

                            if (row.checked) {
                                checkbox.setAttribute('checked', '');
                            }
                            else if (row.checked === false) {
                                checkbox.removeAttribute('checked');
                            }
                            else if (row.checked === null) {
                                checkbox.setAttribute('checked', 'indeterminate');
                            }

                            if (row.leaf) {
                                if (row.allowCheck) {
                                    checkbox.classList.remove('smart-visibility-hidden');
                                }
                                else {
                                    checkbox.classList.add('smart-visibility-hidden');
                                }
                            }
                            else {
                                if (row.allowCheck) {
                                    checkbox.classList.remove('smart-hidden');
                                }
                                else {
                                    checkbox.classList.add('smart-hidden');
                                }
                            }
                        }

                        if (row.allowCheck) {
                            if (grid.checkBoxes.visible) {
                                checkbox.classList.remove('smart-hidden');
                            }
                            else {
                                checkbox.classList.add('smart-hidden');
                            }
                        }
                        else if (!grid.checkBoxes.visible) {
                            checkbox.classList.add('smart-hidden');
                        }

                        indent.innerHTML = indentDiv;

                        toggleButton.classList.add('smart-visibility-hidden');

                        if (!row.leaf) {
                            toggleButton.classList.remove('smart-visibility-hidden');
                            if (row.expanded) {
                                toggleButton.setAttribute('toggled', '');
                            }
                            else {
                                toggleButton.removeAttribute('toggled', '');
                            }
                        }
                        else {
                            toggleButton.classList.add('smart-visibility-hidden');
                        }

                        if (row.data.isEmpty) {
                            toggleButton.classList.add('smart-visibility-hidden');
                        }

                        content.innerHTML = formattedValue;

                        if (grid.appearance.showRowHeaderNumber && grid.grouping.enabled && grid.dataSource.groupBy.length > 0) {
                            formattedValue = '<span visible-index>' + (1 + row.visibleIndex) + '</span> ' + formattedValue;
                        }

                        if (grid.rowDetail.enabled && grid.grouping.enabled && grid.dataSource.groupBy.length > 0) {
                            content.innerHTML = '<button class="inline smart-animate" toggled toggle-button></button>' + formattedValue;
                            row.element.toggleDetailButton = that.querySelector('button.inline');
                            row.element.toggleDetailButton.setAttribute('title', grid.localize(!row.showDetail ? 'expandRow' : 'collapseRow', { elementType: 'Grid' }));

                            row.element.toggleDetailButton.onpointerdown = function () {
                                row.showDetail = !row.showDetail;
                            }
                        }

                        if (grid.appearance.showTooltips) {
                            content.setAttribute('title', formattedValue);
                        }
                        else if (content.hasAttribute('title')) {
                            content.removeAttribute('title');
                        }
                    }
                    else {
                        const cell = row['column_' + column.dataField];

                        if (that.getAttribute('rowspan')) {
                            that.removeAttribute('rowspan');
                            that.removeAttribute('aria-rowspan');
                            that.style.height = '';
                        }

                        if (that.getAttribute('colspan')) {
                            that.removeAttribute('colspan');
                            that.removeAttribute('aria-colspan');
                        }

                        if (cell) {
                            if (cell.colSpan > 1) {

                                const startColumnIndex = grid.columns.indexOf(column);
                                let width = 0;
                                for (let m = startColumnIndex; m < startColumnIndex + cell.colSpan; m++) {
                                    const viewColumn = grid.columns[m];

                                    if (viewColumn && viewColumn.visible) {
                                        width += viewColumn.computedWidth;
                                    }
                                }

                                that.style.width = width + 'px';

                                that.setAttribute('colspan', '');
                                that.setAttribute('aria-colspan', cell.colSpan);
                                cell._styleChanged = true;
                            }

                            if (cell.rowSpan > 1) {
                                const startRowIndex = grid.rows.indexOf(row);
                                let height = 0;

                                row.element.setAttribute('rowspan', '');

                                for (let m = startRowIndex; m <= startRowIndex + cell.rowSpan - 1; m++) {
                                    const viewRow = grid.rows[m];

                                    if (viewRow && viewRow.visible && viewRow.filtered) {
                                        height += viewRow.cellHeight;
                                    }
                                }

                                that.style.height = height + 'px';


                                that.setAttribute('rowspan', '');
                                that.setAttribute('aria-rowspan', cell.rowSpan);
                                cell._styleChanged = true;
                            }

                            if ((cell.colSpan === 1 && that.hasAttribute('colspan')) || (that.hasAttribute('rowspan') && cell.rowSpan === 1)) {
                                that.style.height = '';
                                that.style.width = '';
                                that.removeAttribute('colspan');
                                that.removeAttribute('rowspan');
                                that.removeAttribute('aria-rowspan');
                                that.removeAttribute('aria-colspan');
                                cell._styleChanged = true;
                            }

                            if (htmlCellContent.textContent !== formattedValue && !column.formatFunction) {
                                htmlCellContent.textContent = formattedValue;
                            }

                            cell.setStyle(htmlCellContent);

                            if (grid.appearance.showTooltips) {
                                htmlCellContent.setAttribute('title', cell.tooltip || formattedValue);
                            }
                            else if (htmlCellContent.hasAttribute('title')) {
                                htmlCellContent.removeAttribute('title');
                            }
                        }
                        else {
                            htmlCellContent.textContent = formattedValue;
                        }
                    }
                }
            }
        }

        if (htmlCellContent.className !== cellContentClassName) {
            htmlCellContent.className = cellContentClassName;
        }

        if (column.formatFunction && !row.data.isEmpty && grid.isInitialized) {
            const formatObject = {
                row: row,
                column: column,
                cell: that.cell,
                oldValue: that.cell.oldValue,
                value: cellValue,
                formattedValue: formattedValue,
                template: null
            };

            that.cell.canNotify = false;
            row.canNotify = false;

            const cellStyle = Object.assign({
            }, {
                background: that.cell.background,
                borderColor: that.cell.borderColor,
                color: that.cell.color,
                fontSize: that.cell.fontSize,
                fontFamily: that.cell.fontFamily,
                fontWeight: that.cell.fontWeight,
                fontStyle: that.cell.fontStyle
            });

            column.formatFunction(formatObject);

            if (htmlCellContent.style.background !== cellStyle.background ||
                htmlCellContent.style.borderColor !== cellStyle.borderColor ||
                htmlCellContent.style.color !== cellStyle.color ||
                htmlCellContent.style.fontSize !== cellStyle.fontSize ||
                htmlCellContent.style.fontWeight !== cellStyle.fontWeight ||
                htmlCellContent.style.fontStyle !== cellStyle.fontStyle
            ) {
                that.cell._styleChanged = true;
                that.cell.setStyle(htmlCellContent);
            }

            if (that.cell.background !== cellStyle.background ||
                that.cell.borderColor !== cellStyle.borderColor ||
                that.cell.color !== cellStyle.color ||
                that.cell.fontSize !== cellStyle.fontSize ||
                that.cell.fontWeight !== cellStyle.fontWeight ||
                that.cell.fontStyle !== cellStyle.fontStyle
            ) {
                that.cell._styleChanged = true;
                that.cell.setStyle(htmlCellContent);
            }

            let requiresUpdate = true;

            if (formatObject.value !== cellValue) {
                if (that.toggleButton) {
                    const content = htmlCellContent.children[1].children[2];

                    content.innerHTML = formatObject.value;
                }
                else {
                    htmlCellContent.innerHTML = formatObject.value;
                }

                requiresUpdate = false;
            }

            if (formatObject.template !== null) {
                if (that.toggleButton) {
                    const content = htmlCellContent.children[1].children[2];

                    if (content.innerHTML !== formatObject.template) {
                        content.innerHTML = formatObject.template;
                    }
                }
                else if (htmlCellContent.innerHTML !== formatObject.template) {
                    const checkTemplateElement = document.createElement('div');

                    checkTemplateElement.innerHTML = formatObject.template;

                    if (checkTemplateElement.innerHTML !== htmlCellContent.innerHTML) {
                        htmlCellContent.innerHTML = formatObject.template;
                    }
                }

                requiresUpdate = false;
            }

            if (requiresUpdate) {
                htmlCellContent.textContent = cellValue;
            }

            that.cell.canNotify = true;
            row.canNotify = true;
        }
    }

    _rotateCellContent(columnHeaderCellContentElement, column, cellValue) {
        const that = this;
        const textElement = document.createElement('span');

        columnHeaderCellContentElement.innerHTML = '';
        textElement.innerHTML = cellValue;
        columnHeaderCellContentElement.appendChild(textElement);

        textElement.className = 'rotate'
        textElement.style.transform = 'rotate(' + column.cellsRotationAngle + 'deg)';

        return that.grid._recycleRotate(columnHeaderCellContentElement, textElement, column.cellsAlign, column.cellsVerticalAlign, cellValue);
    }

    _getCellAlignment(row, column) {
        const cell = row['column_' + column.dataField];
        const verticalAlign = cell ? cell.verticalAlign || column.cellsVerticalAlign : column.cellsVerticalAlign;
        let align = cell ? cell.align || column.cellsAlign : column.cellsAlign;
        const alignment = {
            align: '', verticalAlign: ''
        };

        if (cell.grid.rightToLeft) {
            if (align === 'left') {
                align = 'right';
            }
            else if (align === 'right') {
                align = 'left';
            }
        }

        switch (align) {
            case 'left':
                alignment.align = 'align-left';
                break;
            case 'center':
            case 'middle':
                alignment.align = 'align-center';
                break;
            case 'right':
                alignment.align = 'align-right';
                break;
        }

        switch (verticalAlign) {
            case 'top':
                alignment.verticalAlign = 'align-top';
                break;
            case 'center':
            case 'middle':
                alignment.verticalAlign = 'align-middle';
                break;
            case 'bottom':
                alignment.verticalAlign = 'align-bottom';
                break;
        }

        return alignment;
    }

    template() {
        return '';
    }

    _detach() {
        const that = this;

        that.element = null;
        that.cell = null;
    }
    onDetached() {
        const that = this;

        that._detach();
    }
});


