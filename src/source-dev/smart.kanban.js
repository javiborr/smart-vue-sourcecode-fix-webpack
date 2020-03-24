
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * Kanban custom element.
 */
Smart('smart-kanban', class Kanban extends Smart.BaseElement {
    // Kanban's properties.
    static get properties() {
        return {
            'addNewButton': {
                value: false,
                type: 'boolean'
            },
            'collapsibleColumns': {
                value: false,
                type: 'boolean'
            },
            'columns': {
                value: [],
                type: 'object',
                reflectToAttribute: false
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
            'selectionMode': {
                value: 'zeroOrOne',
                allowedValues: ['zeroOrOne', 'oneOrManyExtended'],
                type: 'string'
            },
            'users': {
                value: [],
                type: 'object',
                reflectToAttribute: false
            }
        };
    }

    /**
     * Kanban's event listeners.
     */
    static get listeners() {
        return {
            'resize': '_resizeHandler',
            'container.click': '_containerClickHandler'
        };
    }

    /**
     * Kanban's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                </div>`;
    }

    /**
     * Adds a task to a Kanban column.
     *
     * @param {Object} data Optional An object containing the new task's data.
     */
    add(data = {}) {
        const that = this,
            columns = that.columns;

        if (typeof data !== 'object' || columns.length === 0) {
            return;
        }

        if (!data.status) {
            data.status = columns[0].dataField;
        }

        that._createTask(data, true);
    }

    /**
     * Collapses a Kanban column.
     *
     * @param {String/Number} column The index or dataField of the column to collapse.
     */
    collapse(column) {
        const that = this,
            columns = that.columns;

        if (!that.collapsibleColumns || columns.length === 1) {
            return;
        }

        column = that._validateColumnArgument(column);

        if (!column || column.collapsed) {
            return;
        }

        column.collapsed = true;
        that._columnToElement.get(column).classList.add('collapsed');

        if (that._collapsedColumns === columns.length - 1) {
            const toCollapse = columns.indexOf(column) !== 0 ? 0 : 1;

            columns[toCollapse].collapsed = false;
            that._columnToElement.get(columns[toCollapse]).classList.remove('collapsed');
        }
        else {
            that._collapsedColumns++;
        }

        that._updateColumnWidths();
    }

    /**
     * Expands a Kanban column.
     *
     * @param {String/Number} column The index or dataField of the column to expand.
     */
    expand(column) {
        const that = this;

        column = that._validateColumnArgument(column);

        if (!column || !column.collapsed) {
            return;
        }

        const columnElement = that._columnToElement.get(column),
            columnScrollViewer = columnElement.children[1];

        column.collapsed = false;
        columnElement.classList.remove('collapsed');
        that._collapsedColumns--;
        that._updateColumnWidths();

        if (columnScrollViewer.toRefresh) {
            delete columnScrollViewer.toRefresh;
            columnScrollViewer.refresh();
        }
    }

    /**
    * Updates the Card when a property is changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value.
    * @param {number/string} newValue The new entered value.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        const that = this;

        super.propertyChangedHandler(propertyName, oldValue, newValue);

        switch (propertyName) {
            case '':

                break;
        }
    }

    render() {
        const that = this;

        that._collapsedColumns = 0;

        that.setAttribute('role', 'group');

        that._renderColumns();
        that._processDataSource();

        super.render();
    }

    /**
     * Container click handler.
     */
    _containerClickHandler(event) {
        const that = this,
            target = event.target,
            header = target.closest('.smart-kanban-header');

        if (header) {
            const column = header.parentElement.column,
                index = header.parentElement.index;

            if (target.closest('.smart-kanban-header-add')) {
                that.add({ status: column.dataField });
                return;
            }

            if (that.collapsibleColumns) {
                that[column.collapsed ? 'expand' : 'collapse'](index);
            }
        }
    }

    /**
     * Processes data source.
     */
    _processDataSource() {
        const that = this,
            dataSource = that.dataSource;

        dataSource.forEach(data => {
            that._createTask(data);
        });

        that.columns.forEach(column => that._refreshScrollViewer(column));
    }

    /**
     * Creates a task.
     */
    _createTask(data, refreshScrollbar) {
        const that = this,
            column = that.columns.find(column => column.dataField === data.status);

        if (!column) {
            return;
        }

        const task = document.createElement('div'),
            columnScrollViewer = that._columnToElement.get(column).children[1];

        task.className = 'smart-kanban-task smart-unselectable';
        task.innerHTML = that._applyTaskTemplate(data);

        if (data.color) {
            task.style.borderLeftColor = data.color;
        }

        columnScrollViewer.appendChild(task);

        if (refreshScrollbar) {
            if (column.collapsed) {
                columnScrollViewer.toRefresh = true;
            }
            else {
                columnScrollViewer.refresh();
            }
        }
    }

    /**
     * Applies task template.
     */
    _applyTaskTemplate(data) {
        let text = data.text || '',
            tags = data.tags,
            tagsContent = '';

        if (tags) {
            tagsContent = tags.split(',').map(tag => `<span class="smart-kanban-task-tag">${tag}</span>`).join('');
        }

        return `<div class="smart-kanban-task-content">
                    <div class="smart-kanban-task-text">${text}</div>
                    <div class="smart-kanban-task-user"></div>
                </div>
                <div class="smart-kanban-task-footer">
                    <div class="smart-kanban-task-tags">${tagsContent}</div >
                    <div class="smart-kanban-task-settings"></div>
                    <div class="smart-kanban-task-comments"${data.comments ? ' num="' + data.comments.length + '"' : ''}></div >
                </div>`;
    }

    /**
     * Renders Kanban columns.
     */
    _renderColumns() {
        const that = this,
            columns = that.columns,
            collapsibleColumns = that.collapsibleColumns,
            validColumns = [],
            container = that.$.container,
            structure = document.createDocumentFragment(),
            gridTemplateColumns = [];

        that._columnToElement = new Map();

        columns.forEach((column) => {
            if (typeof column === 'string') {
                column = { dataField: column, label: column };
            }

            if (!column.dataField && !column.label) {
                return;
            }

            if (!column.label) {
                column.label = column.dataField;
            }

            if (!column.dataField) {
                column.dataField = column.label;
            }

            if (!column.collapsed || !collapsibleColumns) {
                column.collapsed = false;
            }
            else {
                that._collapsedColumns++;
            }

            validColumns.push(column);
        });

        if (that._collapsedColumns === validColumns.length) {
            validColumns[0].collapsed = false;
            that._collapsedColumns--;
        }

        validColumns.forEach((column, index) => {
            const columnElement = document.createElement('div');

            columnElement.className = 'smart-kanban-column';

            if (column.collapsed) {
                columnElement.classList.add('collapsed');
                gridTemplateColumns.push('auto');
            }
            else {
                gridTemplateColumns.push('1fr');
            }

            columnElement.innerHTML =
                `<div class="smart-kanban-header smart-unselectable">
                    <div class="smart-kanban-header-add"></div>
                    <div class="smart-kanban-header-label">${column.label}</div >
                    <div class="smart-arrow smart-arrow-${index < validColumns.length - 1 ? 'left' : 'right'}"></div>
                </div >
                <smart-scroll-viewer class="smart-kanban-column-content"></smart-scroll-viewer>`;


            structure.appendChild(columnElement);

            columnElement.column = column;
            columnElement.index = index;

            that._columnToElement.set(column, columnElement);
        });

        container.style.gridTemplateColumns = gridTemplateColumns.join(' ');
        container.appendChild(structure);

        that.columns = validColumns;
    }

    /**
     * Updates column widths.
     */
    _updateColumnWidths() {
        const that = this,
            columns = that.columns,
            gridTemplateColumns = [];

        for (let i = 0; i < columns.length; i++) {
            gridTemplateColumns.push(columns[i].collapsed ? 'auto' : '1fr');
        }

        that.$.container.style.gridTemplateColumns = gridTemplateColumns.join(' ');
    }

    /**
     * Validates the column argument passed to a public method.
     */
    _validateColumnArgument(column) {
        const columns = this.columns;

        if (!isNaN(column)) {
            return columns[column];
        }

        if (typeof column === 'string') {
            return columns.find(col => col.dataField === column);
        }

        return null;
    }

    /**
     * resize handler.
     */
    _resizeHandler() {
        const that = this;

        clearTimeout(that._resizeTimeout);

        that._resizeTimeout = setTimeout(function () {
            that.columns.forEach(column => that._refreshScrollViewer(column));
        }, 50);
    }

    /**
     * Refreshes a column's ScrollViewer.
     */
    _refreshScrollViewer(column) {
        const columnScrollViewer = this._columnToElement.get(column).children[1];

        if (column.collapsed) {
            columnScrollViewer.toRefresh = true;
        }
        else {
            columnScrollViewer.refresh();
        }
    }
});
