
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart.Utilities.Assign('Grid.Filter', class Filter {
    addFilter(dataField, filter, refreshFilters) {
        const that = this;
        const column = that.columnByDataField[dataField];

        if (typeof filter === 'string') {
            filter = that.dataSource._createFilter(column.dataType, [filter]);
        }

        if (column && column.canNotify) {
            column.setProperty('filter', filter);

            if (refreshFilters !== false) {
                that.refreshFilters();
            }
        }
    }

    removeFilter(dataField, refreshFilters) {
        const that = this;
        const column = that.columnByDataField[dataField];

        if (column && column.canNotify) {
            column.setProperty('filter', null);

            if (refreshFilters !== false) {
                that.refreshFilters();
            }
        }
    }

    clearFilter() {
        const that = this;

        for (let i = 0; i < that.columns.length; i++) {
            const column = that.columns[i];

            column.setProperty('filter', null);
        }

        that.refreshFilters();
    }

    getFilteredColumns() {
        const that = this;

        if (that._filters) {
            const columns = [];

            for (let i = 0; i < that._filters.length; i++) {
                const filter = that._filters[i];

                columns[filter[0]] = filter[1];

                columns.length++;
            }

            return columns;
        }

        return [];
    }

    getVisibleRows() {
        const that = this;

        if (that._visibleRows) {
            return that._visibleRows;
        }

        const visibleRows = [];
        const viewRows = that._viewRows;
        const offset = that.editing.addNewRow.visible && that.editing.addNewRow.position !== 'far' ? 1 : 0;

        for (let i = 0; i < viewRows.length; i++) {
            const row = viewRows[i];

            row.canNotify = false;
            row.visibleIndex = -1;

            if (row.visible && (row.filtered !== false || row.filtered === undefined)) {
                row.visibleIndex = visibleRows.length - offset;
                visibleRows.push(row);
            }

            row.canNotify = true;
        }

        that._visibleRows = visibleRows;

        return visibleRows;
    }

    refreshFilters() {
        const that = this;

        const filters = [];
        //const viewRows = that._viewRows;

        for (let i = 0; i < that.columns.length; i++) {
            const column = that.columns[i];

            if (column.filter) {
                filters.push([column.dataField, column.filter]);
            }
        }

        that.scrollTop = 0;
        that.closeMenu();

        if (that.dataSource && !that.dataSource.onFilter) {
            that.dataSource.onFilter = function () {
                const viewRows = that._viewRows;

                for (let i = 0; i < viewRows.length; i++) {
                    const row = viewRows[i];

                    if (row.data && !row.addNewRow) {
                        row.filtered = row.data.$.filtered !== undefined ? row.data.$.filtered : true;
                    }
                }

                that.refresh();
            }
        }

        that._filters = filters;
        that._visibleRows = null;

        if (that.dataSource && that.dataSource.virtualDataSource) {
            that.closeMenu();
            that._virtualDataRequest('filter');
        }
        else {
            that.dataSource._filter(filters);
        }

        if (that.paging.enabled && that.dataSource && !that.dataSource.virtualDataSource) {
            that._refreshPagesCount();
        }

        let detailColumns = [];
        for (let i = 0; i < that.columns.length; i++) {
            const column = that.columns[i];

            if (column.filter) {
                detailColumns.push(column);
            }
        }

        let data = [];

        if (that._filters) {
            for (let i = 0; i < that._filters.length; i++) {
                const filter = that._filters[i];

                data.push({ dataField: filter[0], filter: filter[1] });
            }
        }

        that.$.fireEvent('filter', {
            'columns': detailColumns,
            'data': data
        });
    }
});
