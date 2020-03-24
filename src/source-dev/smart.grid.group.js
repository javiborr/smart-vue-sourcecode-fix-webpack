
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart.Utilities.Assign('Grid.Group', class Group {
    addGroup(dataField) {
        const that = this;

        if (!that.dataSource || !that.grouping.enabled) {
            return;
        }

        const index = that.dataSource.groupBy.indexOf(dataField);

        if (index === -1) {
            that.dataSource.groupBy.push(dataField);

            that.refresh(true);
            that.refreshFilters();
        }
    }

    removeGroup(dataField) {
        const that = this;

        if (!that.dataSource || !that.grouping.enabled) {
            return;
        }

        const index = that.dataSource.groupBy.indexOf(dataField);

        if (index >= 0) {
            that.dataSource.groupBy.splice(index, 1);

            that.refresh(true);
            that.refreshFilters();
        }
    }

    clearGroups() {
        const that = this;

        if (!that.dataSource || !that.grouping.enabled) {
            return;
        }

        that.dataSource.clearGroup();

        that.refresh(true);
        that.refreshFilters();
    }
});
