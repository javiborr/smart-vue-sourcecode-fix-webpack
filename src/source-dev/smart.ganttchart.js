
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * smartGanttChart custom element
 */
Smart('smart-gantt-chart', class GanttChart extends Smart.ScrollViewer {

    // Gantt Chart's properties
    static get properties() {
        return {
            'autoSchedule': {
                value: false,
                type: 'boolean'
            },
            'autoScheduleStrictMode': {
                value: false,
                type: 'boolean'
            },
            'autoScrollStep': {
                value: 5,
                type: 'number'
            },
            'dataExport': {
                value: {
                    'header': {
                        value: true,
                        type: 'boolean'
                    },
                    'style': {
                        value: null,
                        type: 'object'
                    },
                    'fileName': {
                        value: 'smartGanttChart',
                        type: 'string?'
                    },
                    'pageOrientation': {
                        value: 'portrait',
                        type: 'string'
                    },
                    'expandChar': {
                        value: '+',
                        type: 'string'
                    },
                    'collapseChar': {
                        value: '-',
                        type: 'string'
                    }
                },
                type: 'object'
            },
            'dataSource': {
                value: [],
                type: 'any',
                reflectToAttribute: false
            },
            'dayFormat': {
                value: 'short',
                allowedValues: ['2-digit', 'numeric', 'long', 'short', 'narrow'],
                type: 'string'
            },
            'dateEnd': {
                value: '',
                type: 'any',
                validator: '_dateValidator'
            },
            'dateStart': {
                value: '',
                type: 'any',
                validator: '_dateValidator'
            },
            'disableAutoScroll': {
                value: false,
                type: 'boolean'
            },
            'durationUnit': {
                value: 'milisecond',
                allowedValues: ['day', 'week', 'hour', 'minute', 'second', 'milisecond'],
                type: 'string'
            },
            'inverted': {
                value: false,
                type: 'boolean'
            },
            'messages': {
                extend: true,
                value: {
                    'en': {
                        'incorrectArgument': '{{elementType}}: Incorrect argument {{argumentName}} in method {{methodName}}.',
                        'outOfBounds': '{{elementType}}: Out of bounds argument {{argumentName}} in method {{methodName}}.',
                        'missingReference': '{{elementType}}: Missing reference to {{file}} in method {{methodName}}.',
                        'noId': 'smartGanttChart requires an id in order to save/load/clear a state.',
                        'ok': 'Ok',
                        'cancel': 'Cancel',
                        'delete': 'Delete',
                        'confirm': '{{componentName}} will be deleted permanently, <b>are you sure? </b>',
                        'columnLabel': 'Task Name',
                        'deleteLink': 'Delete link'
                    }
                },
                type: 'object'
            },
            'monthFormat': {
                value: 'short',
                allowedValues: ['2-digit', 'numeric', 'long', 'short', 'narrow'],
                type: 'string'
            },
            'max': {
                value: new Date(2100, 0, 1),
                type: 'any',
                validator: '_dateValidator'
            },
            'min': {
                value: new Date(1900, 0, 1),
                type: 'any',
                validator: '_dateValidator'
            },
            'nonworkingDays': {
                value: [],
                type: 'array'
            },
            //NOTE: if type is 'any', by setting a number it could be possible to set the nonworking hours count instead of specific hours array
            'nonworkingHours': {
                value: [],
                type: 'array'
            },
            'popupWindowCustomizationFunction': {
                value: null,
                reflectToAttribute: false,
                type: 'function?'
            },
            'resizeHandlesVisibility': {
                allowedValues: ['auto', 'hidden', 'visible'],
                value: 'auto',
                type: 'string'
            },
            'selectedIndexes': {
                value: [],
                type: 'array'
            },
            'snapToNearest': {
                value: false,
                type: 'boolean'
            },
            //TODO: Make it hierarhical
            'taskColumns': {
                value: [{ label: 'columnLabel', value: 'label' }],
                type: 'array',
                reflectToAttribute: false
            },
            'timelineMin': {
                value: 200,
                type: 'any'
            },
            'treeMin': {
                value: 100,
                type: 'any'
            },
            'treeSize': {
                value: '20%',
                type: 'any'
            },
            'hourFormat': {
                value: 'default',
                allowedValues: ['default', '2-digit', 'numeric'],
                type: 'string'
            },
            'timelineHeaderFormatFunction': {
                value: null,
                reflectToAttribute: false,
                type: 'function?'
            },
            'verticalScrollBarVisibility': {
                type: 'string',
                value: 'auto',
                allowedValues: ['auto', 'disabled', 'hidden', 'visible']
            },
            'view': {
                value: 'year',
                allowedValues: ['day', 'week', 'month', 'year'], //year shows months, month shows weeks, week shows days and day shows hours
                type: 'any'
            },
            //TODO: Defines an array of custom properties for specific view
            //'views': {
            //    value: [],
            //    type: 'array'
            //},
            'yearFormat': {
                value: 'numeric',
                allowedValues: ['2-digit', 'numeric'],
                type: 'string'
            },
            'weekFormat': {
                value: 'long',
                allowedValues: ['long', 'numeric'],
                type: 'string'
            }
        };
    }

    /**
    * GanntChart's template
    */
    template() {
        return `<div id="container" role="presentation">
                    <smart-splitter id="mainSplitter" auto-fit-mode="end" keep-proportions-on-resize right-to-left="[[rightToLeft]]">
                        <smart-splitter-item id="treeSplitterItem" class="smart-task-tree-splitter-item" min="[[treeMin]]">
                            <smart-splitter id="treeSplitter" auto-fit-mode="end" class="smart-task-tree-splitter" unfocusable right-to-left="[[rightToLeft]]">
                                <smart-splitter-item id="taskTreeSplitterItem">
                                    <div class="smart-task-tree-header"></div>
                                    <div class="smart-task-tree-content">
                                        <smart-tree id="taskTree" selection-mode="zeroOrOne" overflow="hidden" toggle-mode="arrow" 
                                            aria-controls="[[id]]" right-to-left="[[rightToLeft]]">
                                        </smart-tree>
                                    </div>
                                </smart-splitter-item>                               
                            <smart-splitter>
                        </smart-splitter-item>
                        <smart-splitter-item id="timelineSplitterItem" class="smart-timeline-splitter-item" min="[[timelineMin]]">
                                <div id="timeline" class="smart-timeline">
                                    <div id="timelineContainer" class="smart-timeline-container" role="presentation">
                                        <div id="timelineHeader" class="smart-timeline-header" role="rowgroup">
                                            <div class="smart-timeline-view-details" id="timelineViewDetails" role="row"></div>
                                            <div class="smart-timeline-view-cells" id="timelineViewCells" role="row"></div>
                                        </div>
                                        <div id="timelineContent" class="smart-timeline-content">
                                            <div id="timelineCellsContainer" class="smart-timeline-cells-container" aria-hidden="true"></div>
                                            <div id="timelineConnectionsContainer" class="smart-timeline-connections-container" role="group"></div>
                                            <div id="timelineTasksContainer" class="smart-timeline-tasks-container" role="group"></div>
                                        </div>
                                        <div id="timelineAnimationContainer" class="smart-timeline-animation-container smart-visibility-hidden" aria-hidden="true">
                                            <div class="smart-timeline-animation-inner-container">
                                                <div><div></div><div></div></div><div><div></div><div></div></div><div><div></div><div></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <smart-scroll-bar id="verticalScrollBar" class="smart-timeline-scroll-bar" orientation="vertical">
                                    right-to-left="[[rightToLeft]]" aria-controls="[[id]]" 
                                </smart-scroll-bar>
                        </smart-splitter-item>
                    </smart-splitter>
                    <smart-scroll-bar wait right-to-left="[[rightToLeft]]" id="horizontalScrollBar" class="smart-timeline-scroll-bar"></smart-scroll-bar>
                </div>`;
    }

    /**
     * GanntChart's Event Listeners
     */
    static get listeners() {
        return {
            'down': '_downHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler',
            'document.dragstart': '_dragStartHandler',
            'container.wheel': '_mouseWheelandler',
            'horizontalScrollBar.change': '_horizontalScrollbarHandler',
            'verticalScrollBar.change': '_verticalScrollbarHandler',
            'mainSplitter.resizeEnd': '_resizeEventHandler',
            'move': '_moveHandler',
            'resize': '_resizeEventHandler',
            'taskTree.change': '_taskTreeChangeHandler',
            'taskTree.collapse': '_taskTreeExpandHandler',
            'taskTree.expand': '_taskTreeExpandHandler',
            'taskTree.blur': '_taskTreeBlurHandler',
            'timelineAnimationContainer.transitionend': '_timelineAnimationContainerTransitionendHandler'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.ganttchart.css'
        ]
    }

    /**
     * Element Attached method. Called when element is attached to the DOM.
     */
    attached() {
        const that = this;

        super.attached();

        if (!that._scrollView) {
            that._scrollView = new Smart.Utilities.Scroll(that, that.$.horizontalScrollBar, that.$.verticalScrollBar);
        }

        const popupWindows = ['taskPopupWindow', 'connectionPopupWindow', 'confirmPopupWindow'];

        for (let i = 0; i < popupWindows.length; i++) {
            const popupWindow = popupWindows[i];

            if (that.$[popupWindow] && that.$[popupWindow].opened) {
                //Open the modal
                that._handleModal(true);

                //Bind to events
                that['$' + popupWindow].listen('close', that._popupWindowCloseHandler.bind(that));
                that['$' + popupWindow].listen('closing', that._popupWindowClosingHandler.bind(that));
                that['$' + popupWindow].listen('open', that._popupWindowOpenHandler.bind(that));
                that['$' + popupWindow].listen('click', that._popupWindowClickHandler.bind(that));
                that['$' + popupWindow].listen('transitionend', that._popupWindowTransitionendHandler.bind(that));

                document.body.appendChild(that.$[popupWindow]);
            }
        }
    }

    /**
     * Element Detached method. Called when the element is detached from the DOM.
     */
    detached() {
        const that = this;

        super.detached();

        if (that._scrollView) {
            that._scrollView.unlisten();
            delete that._scrollView;
        }

        //Remove additional event listeners
        const popupWindows = ['taskPopupWindow', 'connectionPopupWindow', 'confirmPopupWindow'];

        //Remove the modal
        that._handleModal();

        for (let i = 0; i < popupWindows.length; i++) {
            const popupWindow = popupWindows[i];

            if (that.$[popupWindow] && that.$[popupWindow].parentElement) {
                that.$[popupWindow].parentElement.removeChild(that.$[popupWindow]);
            }

            if (that['$' + popupWindow]) {
                that['$' + popupWindow].unlisten('open');
                that['$' + popupWindow].unlisten('close');
                that['$' + popupWindow].unlisten('closing');
                that['$' + popupWindow].unlisten('transitionend');
            }
        }
    }

    /**
    * Called when a property is changed.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        const that = this;

        switch (propertyName) {
            case 'autoSchedule':
                newValue ? that._autoSchedule() : that._autoScheduleRestore();
                break;
            case 'autoScheduleStrictMode':
                if (newValue) {
                    that._autoSchedule();
                    that._refreshTimeline(that.view);
                }

                break;
            case 'dataSource':
                //Not called in some cases, so call it manually
                that.$.mainSplitter._resizeEventHandler();

                that._createTasks();
                that._createTaskColumns();
                that._createTimeline();
                that._setAriaControls();
                that._refresh();
                break;
            case 'durationUnit':
                //Validate all tasks
                for (let t = 0; t < that._tasks.length; t++) {
                    const task = that._tasks[t];

                    that._validateTaskProperties(task, task.project);
                }

                //Recreate timeline
                that._createTimelineCells();

                //Update timeline taskBars/connections
                for (let t = 0; t < that._tasks.length; t++) {
                    const task = that._tasks[t];

                    that._setTimelineTaskBar(task, true);
                    that._refreshTaskConnections(task);
                }

                break;
            case 'inverted':
                that._handleInverted();

                //Update the scrollLeft after clearing the timeline because it was reset
                if (that.scrollLeft) {
                    that.$.timeline.scrollLeft = that._getScrollLeft(that.scrollLeft);
                }
                break;
            case 'rightToLeft':
                that._handleInverted();
                that._refreshTimeline();
                //Update the progress bar of each task
                that._tasks.forEach(task => that._setTaskBarProgress(task));
                break;
            case 'dateStart':
            case 'dateEnd':
            case 'nonworkingDays':
            case 'nonworkingHours':
                //that._createTimelineCells();
                that._refreshTimeline();
                break;
            case 'messages':
            case 'locale':
            case 'dayFormat':
            case 'hourFormat':
            case 'timelineHeaderFormatFunction':
            case 'monthFormat':
            case 'yearFormat':
                that._refreshHeaderDate();
                that._refreshColumnsHeaders();
                break;
            case 'selectedIndexes':
                that._applySelection(oldValue);
                break;
            case 'taskColumns':
                that._createTaskColumns();
                break;
            case 'timelineMin':
                //Fallback for the binded property because the binding isn't working
                that.$.timelineSplitterItem.min = newValue;
                that.$.treeSplitter.refresh();
                break;
            case 'treeMin':
                //Fallback for the binded property because the binding isn't working
                that.$.treeSplitterItem.min = newValue;
                that.$.treeSplitter.refresh();
                break;
            case 'treeSize':
                that.$.treeSplitterItem.size = newValue;
                that.$.treeSplitter.refresh();
                break;
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'view':
                that._refreshTimeline(oldValue);
                break;
            default:
                super.propertyChangedHandler(propertyName, oldValue, newValue);
                break;
        }
    }

    /**
     * Predefines the getters for dateStart/dateEnd properties
     */
    _predefPropertyGetter(propertyName) {
        const that = this;

        Object.defineProperty(that, propertyName, {
            get: function () {
                const timelineCells = that._timelineCells;

                if (timelineCells.length) {
                    return new Date(propertyName === 'dateStart' ? timelineCells[0].date : timelineCells[timelineCells.length - 1].date);
                }

                that.properties[propertyName].value;
            },
            set(value) {
                that.updateProperty(that, that._properties[propertyName], value);
            }
        });
    }

    /**
     * GanttChart's ready function. Called on initialization
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        //Stopping resizeObservers
        //NOTE: Doesn't work when Tree has 'wait'. Never enters the 'ready' method
        //that.$.treeSplitter.hasResizeObserver = false;
        //that.$.taskTree.hasResizeObserver = false;
        //that.$.taskTree.wait = false;

        //Accessibility
        that.setAttribute('role', 'treegrid');

        //Pre-define the getter for the dateStart/dateEnd properties
        that._predefPropertyGetter('dateStart');
        that._predefPropertyGetter('dateEnd');

        //NOTE: The styles of the Splitter,Window,etc are loaded but not applied yet
        if (that.shadowRoot) {
            requestAnimationFrame(() => that.$.treeSplitterItem.size = that.treeSize);
        }
        else {
            that.$.treeSplitterItem.size = that.treeSize;
        }

        //NOTE: The binding is not working on initialization
        if (!that.rightToLeft) {
            that.$.verticalScrollBar.removeAttribute('right-to-left');
        }

        //Property binding not working. Manually setting the min size of the Splitter Items
        //that.$.timelineSplitterItem.min = that.timelineMin;
        //that.$.treeSplitterItem.min = that.treeMin;

        //Callbacks for Task Tree item navigation
        that.$.taskTree._ensureVisibleCallback = that._ensureVisible.bind(that);
        that.$.taskTree._hoverViaKeyboardCallback = that._hoverViaKeyboardCallback.bind(that);

        //Disable animation interruptions. Setting this property will wait for the animation to finish before starting a new one
        that.$.taskTree._waitAnimation = true;

        //Disable kinetic scrolling of the Tree
        that.$.taskTree.$.scrollViewer._scrollView.disableSwipeScroll = true;
        that.$.taskTree.$.scrollViewer.disabled = true;

        //Configures the ScrollBars
        that._setScrollBars();

        //NOTE: Resize not thrown at this moment, so call the handler manually
        that.$.treeSplitter.refresh();

        that._handleInverted(true);
        that._createTasks();
        that._createTaskColumns();
        that._createTimeline();
        that._applySelection();
        that._setAriaControls();
        that._setFocusable();
        that.checkLicense();

        //NOTE: The styles of the Splitter,Window,etc are loaded but not applied yet
        if (that.shadowRoot) {
            requestAnimationFrame(() => that.refresh());
        }

        super.render();
    }

    /**
     * Sets the aria-controls property to the task bars and their representing Tree tasks
     */
    _setAriaControls() {
        const that = this,
            taskTreeSplitterItems = that.$.treeSplitter._items;

        function setArialControls(items) {
            const timelineTasks = that.$.timelineTasksContainer.children;

            for (let i = 0; i < items.length; i++) {
                let item = items[i], taskBarControlled;

                if (item.path) {
                    taskBarControlled = timelineTasks[that._tasks.indexOf(that._getTaskByTreeIndex(item.path))];
                }
                else {
                    taskBarControlled = timelineTasks[that._getTaskItemIndex(item)]
                    item = item.parentElement;
                }

                if (taskBarControlled) {
                    item.setAttribute('aria-controls', taskBarControlled.id);
                    taskBarControlled.setAttribute('aria-controls', ((taskBarControlled.getAttribute('aria-controls') || '') + ' ' + (item.id || '')).trim());
                }
            }
        }

        for (let i = 0; i < taskTreeSplitterItems.length; i++) {
            const splitterItem = taskTreeSplitterItems[i];
            let items;

            if (that.$.taskTreeSplitterItem === splitterItem) {
                items = that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group');
            }
            else {
                const dataContainer = splitterItem.querySelector('.smart-task-tree-content');

                if (!dataContainer) {
                    continue;
                }

                items = dataContainer.querySelectorAll('.smart-task-label-container');
            }

            setArialControls(items);
        }
    }

    /**
     * Refreshes the ScrollBars
     */
    refresh() {
        this._resizeEventHandler();
    }

    /**
   * Checks for missing modules.
   */
    static get requires() {
        return {
            'Smart.Splitter': 'smart.splitter.js',
            'Smart.Tree': 'smart.tree.js',
            'Smart.Window': 'smart.window.js'
        }
    }

    /**
     * Ensures an item is inside the View area
     * @param {any} item - string/number representing the index of an item
     */
    ensureVisible(item) {
        const that = this,
            tasks = that._tasks;

        if (item === undefined || item === null || !tasks.length) {
            return;
        }

        if (typeof item === 'number') {
            item = tasks[item];
        }
        else if (typeof item === 'string') {
            item = that._tasks.indexOf(that._getTaskByTreeIndex(item));
        }
        else {
            return;
        }

        if (!item) {
            return;
        }

        //Vertical ensure
        that._ensureVisible(item);

        //Horizontal ensure
        that._scrollTo(item.dateStart);
    }

    /**
     * Removes all connections
     */
    removeAllConnections() {
        const that = this;

        if (!that.isCompleted) {
            return;
        }

        that.$.timelineConnectionsContainer.innerHTML = '';

        that._tasks.map(task => task.connections = []);
    }

    /**
     * Removes a connection based on parameters
     * @param {any} connectionId - the id of the connection : startTaskIndex + endTaskIndex + connectionType, e.g. ('0-1-1')
     * or (startTaskId, endTaskId, connectionType), e.g. (0, 1, 1)
     */
    removeConnection() {
        const that = this;

        if (!that.isCompleted) {
            return;
        }

        let connectionId;

        if (arguments.length === 1) {
            if (typeof arguments[0] === 'string') {
                const connection = document.getElementById(arguments[0]);

                if (connection) {
                    connectionId = connection.getAttribute('connection-id');
                }
            }

            if (!connectionId) {
                connectionId = (arguments[0] + '').split('-');
                connectionId = that._getValidConnectionId(connectionId[0], connectionId[1], connectionId[2], 'removeConnection');
            }
        }
        else if (arguments.length === 3) {
            connectionId = that._getValidConnectionId(arguments[0], arguments[1], arguments[2], 'removeConnection');
        }

        if (!connectionId) {
            return;
        }

        that._removeConnection(connectionId);
    }

    /**
     * Removes the connections of a Task or between two tasks
     * @param {any} taskId
     */
    removeTaskConnection(taskStartId, taskEndId) {
        const that = this;

        if (!that.isCompleted) {
            return;
        }

        taskStartId += '';

        if (taskStartId.indexOf('-') > -1 && !taskEndId) {
            const ids = taskStartId.split('-');

            taskEndId = ids[1];
            taskStartId = ids[0];
        }

        taskStartId = that._getTaskIndexById(taskStartId);
        taskEndId = that._getTaskIndexById(taskEndId);

        if (isNaN(taskStartId)) {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'removeTaskConnection', argumentName: 'taskEndIndex' }));
            return;
        }

        that._removeConnection('' + taskStartId + (isNaN(taskEndId) ? '' : taskEndId));
    }

    /**
     * Deletes all tasks and clears the timeline
     */
    clearTasks() {
        const that = this;

        that._tasks = [];
        that._timelineCells = [];
        that._timelineHeaderCells = [];

        //reset the width of the timeline header
        that.$.timelineContent.style.width = that.$.timelineAnimationContainer.style.width = '';

        //Remove the variable for the height of the column lines
        that.$.container.style.removeProperty('--smart-gantt-chart-timeline-content-height');

        //Timeline header details
        that.$.timelineViewDetails.innerHTML = '';

        //Timeline header
        that.$.timelineViewCells.innerHTML = '';

        //Timeline Task cells
        that.$.timelineCellsContainer.innerHTML = '';

        //Timeline Connections
        that.$.timelineConnectionsContainer.innerHTML = '';

        //Timeline Tasks
        that.$.timelineTasksContainer.innerHTML = '';

        //TaskTree
        const treeSplitterItems = that.$.treeSplitter._items;

        for (let i = 0; i < treeSplitterItems.length; i++) {
            const splitterItem = treeSplitterItems[i];

            if (splitterItem === that.$.taskTreeSplitterItem) {
                that.$.taskTree.dataSource = [];
            }
            else {
                const dataContainer = splitterItem.getElementsByClassName('smart-task-tree-content')[0];

                if (dataContainer) {
                    dataContainer.innerHTML = '';
                }
            }
        }

        //Refresh the scrollViwer
        that._refresh();
    }

    /**
     * Creates a connection between tasks
     * @param {any} connectionId - the id of the connection : startTaskIndex + endTaskIndex + connectionType, e.g. (011)
     * or (startTaskId, endTaskId, connectionType), e.g. (0, 1, 1)
     */
    createConnection() {
        const that = this,
            tasks = that._tasks;
        let connectionId;

        if (!that.isCompleted || tasks.length === 0) {
            return;
        }

        if (arguments.length === 1) {
            connectionId = (arguments[0] + '').split('-');
        }
        else if (arguments.length === 3) {
            connectionId = arguments;
        }

        connectionId = that._getValidConnectionId(connectionId[0], connectionId[1], connectionId[2], 'createConnection');

        if (!connectionId) {
            return;
        }

        that._connectTask(connectionId);
    }

    /**
     * Collapses a Project Task
     */
    collapse(task) {
        const that = this;

        if (typeof task === 'number') {
            task = that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')[task];
        }

        if (task === undefined) {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'collapse', argumentName: 'taskIndex' }));
            return;
        }

        that.$.taskTree.collapseItem(task instanceof Smart.TreeItemsGroup ? task : task.parentItem);
    }

    /**
     * Expands a Project Task
     */
    expand(task) {
        const that = this;

        if (typeof task === 'number') {
            task = that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')[task];
        }

        if (task === undefined) {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'expand', argumentName: 'taskIndex' }));
            return;
        }

        that.$.taskTree.expandItem(task instanceof Smart.TreeItemsGroup ? task : task.parentItem);
    }


    /**
     * Exports the TaskTree to XLSX or PDF
     */
    exportData(dataFormat, callback) {
        const that = this;

        //Function to convert rgb color to hex format
        function toHex(rgb) {
            function hex(x) {
                const hexDigits = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
                return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
            }

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            if (!rgb) {
                return '#ffffff';
            }

            return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]).toUpperCase();
        };

        //Creates a record from a task object
        function getRecord(task) {
            let record = {};

            //Create the Header
            for (let c = 0; c < taskColumns.length; c++) {
                const col = taskColumns[c];

                if (task) {
                    record[col.value] = task[col.value];
                    record._keyDataField = tasks.indexOf(task);

                    if (task.tasks) {
                        record._expanded = !!task.expanded;
                    }

                    if (task.project) {
                        record._parentDataField = tasks.indexOf(task.project);
                    }
                }
                else {
                    record[col.value] = col.label;
                }
            }

            return record;
        }

        if (!Smart.Utilities.DataExporter) {
            that.error(that.localize('missingReference', { elementType: that.nodeName.toLowerCase(), methodName: 'exportData', file: 'smart.export.js' }));
            return;
        }
        try {
            new JSZip();
        }
        catch (error) {
            that.error(that.localize('missingReference', { elementType: that.nodeName.toLowerCase(), methodName: 'exportData', file: 'jszip.min.js' }));
            return;
        }

        if (dataFormat === 'pdf') {
            if (!window.pdfMake) {
                that.error(that.localize('missingReference', { elementType: that.nodeName.toLowerCase(), methodName: 'exportData', file: 'pdfMake.min.js' }));
                return;
            }
        }

        const tasks = that._tasks,
            taskColumns = that.taskColumns;

        if (!tasks || !tasks.length || !taskColumns.length) {
            return;
        }

        const dataExporter = new Smart.Utilities.DataExporter(
            {
                collapseChar: that.dataExport.collapseChar,
                exportHeader: that.dataExport.header,
                expandChar: that.dataExport.expandChar,
                hierarchical: true,
                pageOrientation: that.dataExport.pageOrientation,
                style: that.dataExport.style
            });

        const header = getRecord();
        let dataExporterHeader = { columns: [] };

        for (let h in header) {
            dataExporterHeader.columns.push({ label: header[h], dataField: h });
        }

        dataExporter.header = dataExporterHeader;

        if (!dataExporter.style) {
            const computedStyle = window.getComputedStyle(that),
                headerStyle = window.getComputedStyle(that.$.timelineHeader),
                header = {
                    height: that.$.treeSplitter.querySelector('.smart-task-tree-header').offsetHeight + 'px',
                    border: '1px solid ' + toHex(headerStyle.borderRightColor),
                    fontFamily: 'Helvetica',
                    fontSize: headerStyle.fontSize,
                    color: toHex(headerStyle.color),
                    backgroundColor: toHex(headerStyle.backgroundColor),
                    fontWeight: '400'
                },
                columns = {
                    border: '1px solid ' + toHex(computedStyle.borderColor),
                    fontFamily: computedStyle.fontFamily,
                    fontSize: computedStyle.fontSize
                },
                columnsData = dataExporterHeader.columns,
                treeSplitterItems = that.$.treeSplitter.items;

            for (let i = 0; i < columnsData.length; i++) {
                const column = columnsData[i],
                    taskColumn = taskColumns.find(col => col.value === column.dataField),
                    row = treeSplitterItems[i].querySelector('.smart-tree-item-label-container') || treeSplitterItems[i].querySelector('.smart-task-label-container');

                header[column.dataField] = {
                    textAlign: headerStyle.textAlign,
                    width: treeSplitterItems[i].offsetWidth + 'px'
                }

                let textAlign;

                if (row) {
                    textAlign = getComputedStyle(row).justifyContent || getComputedStyle(row).textAlign;
                }

                columns[column.dataField] = {
                    textAlign: ['left', 'center', 'right', 'justify'].indexOf(textAlign) < 0 ? 'start' : textAlign,
                    format: taskColumn.exportFormat || (column.dataField.indexOf('date') > -1 ? 'd' : '')
                };
            }

            dataExporter.style = {
                border: '1px solid ' + toHex(computedStyle.borderColor),
                borderCollapse: 'collapse',
                header: header,
                columns: columns,
                rows: {
                    height: (parseFloat(computedStyle.getPropertyValue('--smart-gantt-chart-task-default-height')) || 0) + 'px'
                }
            }
        }

        //Prepare the data to export
        let data = [];

        //Create all records
        for (let t = 0; t < tasks.length; t++) {
            data.push(getRecord(tasks[t]));
        }

        return dataExporter.exportData(data, dataFormat, that.dataExport.fileName, callback);
    }

    /**
     * Prepares the element for printing
     */
    print() {
        const that = this,
            fileName = that.dataExport.fileName;

        that.dataExport.fileName = null;

        const output = that.exportData('html');

        const newWindow = window.open('', '', 'width=800,height=500'),
            printDocument = newWindow.document.open(),
            pageContent =
                '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8" />' +
                '<title>' + fileName + '</title>' +
                '</head>' +
                '<body>' + output + '</body></html>';

        try {
            printDocument.write(pageContent);
            printDocument.close();

            setTimeout(function () {
                newWindow.print();
                newWindow.close();
            }, 100);
        }
        catch (error) {
            //
        }

        that.dataExport.fileName = fileName;
    }

    /**
     * Returns the current state of the Element as JSON
     */
    getState() {
        return this._getTasksJSON();
    }

    /**
    * Returns an array of all the tasks inside the element
    */
    get tasks() {
        const that = this;

        if (!that.isReady || !that._tasks || !that._tasks.length) {
            return;
        }

        return that._tasks;
    }

    /**
     * Returns the index of a Task
     * @param {any} task
     */
    getTaskIndex(task) {
        const that = this;

        if (task instanceof Smart.TreeItem || task instanceof Smart.TreeItemsGroup) {
            return [].slice.call(that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')).indexOf(task);
        }

        if (!that._tasks) {
            return;
        }

        if (task instanceof HTMLElement && task.classList.contains('smart-timeline-task')) {
            return that._tasks.index(task._task);
        }

        return that._tasks.index(task);
    }

    /**
    * Clears the previously saved state
    */
    clearState() {
        const that = this;

        if (!that.id) {
            that.warn(that.localize('noId'));
            return;
        }

        window.localStorage.removeItem('smartGanttChart' + that.id);
    }

    /**
     * Loads a previously saved state of the element
     * @param {any} state - must be an array of tasks
     */
    loadState(state) {
        const that = this;

        if (!state) {
            if (!that.id) {
                return;
            }

            state = JSON.parse(window.localStorage.getItem('smartGanttChart' + that.id));
        }

        if (!Array.isArray(state)) {
            return;
        }

        that._createTasks(state);
        that._createTimeline();
        that._createTaskColumns();

        //Update the dataSource property
        that.set('dataSource', state);
    }

    /**
    * Saves the current state of the Layout
    */
    saveState() {
        const that = this;

        if (!that.id) {
            that.warn(that.localize('noId'));
            return;
        }

        //Save to LocalStorage
        window.localStorage.setItem('smartGanttChart' + that.id, JSON.stringify(that.getState()));
    }

    /**
     * Insert a task
     * @param {string || number} index - the target index where the new task should ne inserted.
     */
    insertTask(index, newTask) {
        const that = this;

        if (typeof newTask !== 'object') {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'insertTask', argumentName: 'newTask' }));
            return;
        }

        if (!that._tasks) {
            return;
        }

        const tasks = that._tasks.slice(0);
        let targetTask;

        if (typeof index === 'string') {
            targetTask = that._getTaskByTreeIndex(index);
            index = that._tasks.indexOf(targetTask);
        }
        else if (typeof index === 'number') {
            targetTask = that._tasks[index];
        }
        else {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'insertTask', argumentName: 'index' }));
            return;
        }

        if (!targetTask) {
            index = that._tasks.length;
        }

        const newTasks = that._createTasks([newTask], true);

        //remove all connections
        that.$.timelineConnectionsContainer.innerHTML = '';

        //Refresh connection indexes
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            if (task.connections) {
                for (let c = 0; c < task.connections.length; c++) {
                    const con = task.connections[c];

                    if (typeof con.target === 'number' && con.target >= index) {
                        con.target += newTasks.length;
                    }
                }
            }
        }

        //Insert the new project/task
        for (let t = 0; t < newTasks.length; t++) {
            tasks.splice(index + t, 0, newTasks[t]);
        }

        if (targetTask && targetTask.project) {
            newTask.project = targetTask.project;

            //Add the sub tasks as well
            for (let t = 0; t < newTasks.length; t++) {
                targetTask.project.tasks.splice(targetTask.project.tasks.indexOf(targetTask), 0, newTasks[t]);
            }
        }

        that._tasks = tasks;

        that._taskAPIManipulation = true;

        //Insert a new Task Tree item
        const taskTreeSplitterItems = that.$.treeSplitter._items;

        for (let i = 0; i < taskTreeSplitterItems.length; i++) {
            const splitterItem = taskTreeSplitterItems[i];

            if (that.$.taskTreeSplitterItem === splitterItem) {
                that.$.taskTree.insert(newTask, typeof index === 'number' ? that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')[index] : index);
            }
            else {
                const dataContainer = splitterItem.getElementsByClassName('smart-task-tree-content')[0],
                    headerDetails = that.taskColumns[i];

                if (!dataContainer || !headerDetails || !headerDetails.value) {
                    continue;
                }

                const targetTaskItem = dataContainer.getElementsByClassName('smart-task-item')[index];

                if (targetTaskItem) {
                    targetTaskItem.parentElement.insertBefore(that._createTaskContainers([newTask], headerDetails), targetTaskItem);
                }
                else {
                    dataContainer.appendChild(that._createTaskContainers([newTask], headerDetails));
                }
            }
        }

        that._autoSchedule(newTasks);

        //Flag used to avoid animation when inserting a collapsed item
        that._noAnimation = true;

        //Handle expanding and task connections
        for (let i = 0; i < newTasks.length; i++) {
            const task = newTasks[i];

            that._createTimelineTask(task, index + i);
            that._setTaskBarProgress(task);
            that._setTaskBarLabel(task);

            if (!that._expandTask(task)) {
                continue;
            }
        }

        delete that._noAnimation;

        that._refreshTimeline(that.view);

        //Set the CSS variable for the content height. Used by the header's pseudo elements
        that.$.container.style.setProperty('--smart-gantt-chart-timeline-content-height', that.$.timelineCellsContainer.offsetHeight + 'px');

        const selectedIndex = that.$.taskTree.selectedIndexes[0];

        if (selectedIndex) {
            that._selectTask(that._getTaskByTreeIndex(selectedIndex));
        }

        delete that._taskAPIManipulation;
    }

    /**
     * Opens the popupWindow editor for a certain Task
     */
    openWindow(target) {
        const that = this;

        //If target is a Connection
        if (typeof target === 'string') {
            let connectionId = (arguments[0] + '').split('-');

            connectionId = that._getValidConnectionId(connectionId[0], connectionId[1], connectionId[2], 'openEditor');

            if (connectionId) {
                that._openPopupWindow(that.$.timelineConnectionsContainer.querySelector('.smart-task-connection[connection-id^="' + connectionId + '"]'));
                return;
            }
        }

        const taskIndex = that._getTaskIndexById(target);

        //If target is a Task
        if (taskIndex > -1) {
            that._openPopupWindow(that.$.timelineTasksContainer.children[taskIndex]);
            return;
        }

    }

    /**
     * Closes the Task Editor
     */
    closeWindow() {
        const that = this,
            popupWindows = ['confirm', 'task', 'connection'];

        for (let i = 0; i < popupWindows.length; i++) {
            const popupWindow = that.$[popupWindows[i] + 'PopupWindow'];

            if (popupWindow) {
                popupWindow.close();
                delete popupWindow._target;
            }
        }
    }

    /**
     * Updates the properties of a task
     */
    updateTask(index, taskDetails) {
        const that = this,
            tasks = that._tasks;
        let task;

        if (typeof index === 'string') {
            index = that._tasks.indexOf(that._getTaskByTreeIndex(index));
            task = tasks[index];
        }
        if (typeof index === 'number') {
            task = that._tasks[index];
        }
        else if (typeof index === 'object') {
            task = index;
            index = tasks.indexOf(index);
        }

        if (typeof taskDetails !== 'object') {
            //Throw Error
            return;
        }

        if (task === undefined || (index === undefined || index === null) || !tasks || !tasks.length) {
            return;
        }

        index = Math.max(0, Math.min(tasks.length - 1, index));

        const timelineTask = that.$.timelineTasksContainer.children[index];

        for (let prop in taskDetails) {
            let oldValue = task[prop],
                newValue = taskDetails[prop];

            if ((newValue instanceof Date && newValue.getTime() === new Date(oldValue).getTime()) || newValue === oldValue) {
                continue;
            }

            if (timelineTask && prop === 'class') {
                timelineTask.classList.remove(task.class);

                if (newValue) {
                    timelineTask.classList.add(newValue);
                }
            }

            //Validation for properties that shouldn't be edited at given circumstances
            if ((task.type === 'project' && prop === 'type') ||
                (task.type === 'project' && task.synchronized && (prop.toLowerCase().indexOf('date') > -1 || prop.toLowerCase().indexOf('duration') > -1))) {
                continue;
            }

            if (prop === 'dateEnd') {
                task.duration = undefined;
            }

            task[prop] = newValue;

            if (task.type === 'milestone' && (prop === 'dateStart' || prop === 'dateEnd')) {
                task.dateEnd = task.dateStart = newValue;
            }
        }

        //task.duration = undefined;
        that._validateTaskProperties(task, task.project);

        //TODO: Handle type convertion. Same as creating/deleting task. Converting a task to milestone and vice versa

        //that._removeConnection(index);
        that._setTaskBarProgress(task);
        that._setTaskBarLabel(task);

        //Refresh the timeline cells
        that._refreshTimeline(that.view);

        //Update the Task Columns
        that._refreshTaskColumnsData(task);

        //Refresh the connections of the Task
        that._refreshTaskConnections(task);

        //Re-schedule if needed
        that._autoSchedule();
    }

    /**
     * Removes a Task
     */
    removeTask(index) {
        const that = this,
            tasks = that._tasks.slice(0);
        let targetTask;

        if (typeof index === 'string') {
            targetTask = that._getTaskByTreeIndex(index);
            index = that._tasks.indexOf(targetTask);
        }
        else if (typeof index === 'number') {
            targetTask = that._tasks[index];
        }
        else {
            that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: 'insertTask', argumentName: 'index' }));
            return;
        }

        if (!targetTask) {
            //TODO: Throw out of bounds error
            return;
        }

        that._taskAPIManipulation = true;

        that._removeConnection(index);
        that._removeConnectionsToTask(index, tasks);

        let removedTasks = 1;

        if (targetTask.type === 'project') {
            const targetTasks = targetTask.tasks,
                originalTasks = tasks.slice(0);

            for (let i = targetTasks.length - 1; i > -1; i--) {
                const subTaskIndex = originalTasks.indexOf(targetTasks[i]);

                //Remove connections that target the subTask that's going to be removed
                that._removeConnectionsToTask(subTaskIndex, originalTasks, targetTasks);
                that._removeConnection(subTaskIndex);

                that.$.timelineTasksContainer.removeChild(that.$.timelineTasksContainer.children[subTaskIndex]);
                that.$.timelineCellsContainer.removeChild(that.$.timelineCellsContainer.children[subTaskIndex]);

                tasks.splice(subTaskIndex, 1);
                targetTasks.splice(subTaskIndex, 1);
                removedTasks++;
            }
        }

        if (targetTask.project) {
            targetTask.project.tasks.splice(targetTask.project.tasks.indexOf(targetTask), 1 + (targetTask.tasks ? targetTask.tasks.length : 0));
        }

        tasks.splice(tasks.indexOf(targetTask), 1);

        that.$.timelineTasksContainer.removeChild(that.$.timelineTasksContainer.children[index]);
        that.$.timelineCellsContainer.removeChild(that.$.timelineCellsContainer.children[index]);

        //Remove the item from the Task Tree
        const taskTreeSplitterItems = that.$.treeSplitter._items;

        for (let i = 0; i < taskTreeSplitterItems.length; i++) {
            const splitterItem = taskTreeSplitterItems[i];

            if (that.$.taskTreeSplitterItem === splitterItem) {
                that.$.taskTree.removeItem(that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')[index]);
            }
            else {
                const dataContainer = splitterItem.getElementsByClassName('smart-task-tree-content')[0],
                    headerDetails = that.taskColumns[i];

                if (!dataContainer || !headerDetails || !headerDetails.value) {
                    continue;
                }

                const targetTask = dataContainer.getElementsByClassName('smart-task-item')[index];

                if (targetTask) {
                    targetTask.parentElement.removeChild(targetTask);
                }
            }
        }

        //Refresh connection indexes
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            if (task.connections) {
                for (let c = 0; c < task.connections.length; c++) {
                    const con = task.connections[c],
                        conTarget = that._getTaskIndexById(con.target);

                    if (conTarget >= index) {
                        //Delete the old connection elements from the container
                        const connectionContainer = that.$.timelineConnectionsContainer,
                            connections = connectionContainer.querySelectorAll('.smart-task-connection[connection-id^="' + (i >= index ? i + removedTasks : i) + '-' + conTarget + '"]');

                        for (let i = 0; i < connections.length; i++) {
                            connectionContainer.removeChild(connections[i])
                        }

                        //Update the connectionTarget index
                        if (typeof con.target === 'number') {
                            con.target -= removedTasks;
                        }
                    }
                }
            }
        }

        //Set the CSS variable for the content height. Used by the header's pseudo elements
        that.$.container.style.setProperty('--smart-gantt-chart-timeline-content-height', that.$.timelineCellsContainer.offsetHeight + 'px');

        that._tasks = tasks;
        that._refreshTimeline(that.view);

        //Resize the items inside the TreeSplitter
        that.$.treeSplitter._resizeEventHandler();

        const selectedIndex = that.$.taskTree.selectedIndexes[0];

        if (selectedIndex) {
            that._selectTask(that._getTaskByTreeIndex(selectedIndex));
        }

        delete that._taskAPIManipulation;
    }

    /**
     * Validate the arguments for removeConnection/createConnection methods
     * @param {any} taskStartIndex - index of the starting task
     * @param {any} taskEndIndex - index of the end task
     * @param {any} type - type of connection between tasks
     */
    _getValidConnectionId(taskStartIndex, taskEndIndex, type, methodName) {
        const that = this,
            tasks = that._tasks,
            isPrivateMethod = methodName.indexOf('_') === 0;
        let indexFromId;

        if (typeof taskStartIndex === 'string') {
            indexFromId = that._getTaskIndexById(taskStartIndex);

            if (indexFromId >= 0) {
                taskStartIndex = indexFromId;
            }
        }

        if (typeof taskEndIndex === 'string') {
            indexFromId = that._getTaskIndexById(taskEndIndex);

            if (indexFromId >= 0) {
                taskEndIndex = indexFromId;
            }
        }

        taskStartIndex = parseInt(taskStartIndex);
        taskEndIndex = parseInt(taskEndIndex);
        type = parseInt(type);

        if (isNaN(taskStartIndex) || isNaN(taskEndIndex) || taskStartIndex === taskEndIndex) {
            if (!isPrivateMethod) {
                that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: methodName, argumentName: 'taskIndex' }));
            }

            return;
        }

        if (taskStartIndex >= tasks.length || taskStartIndex < 0 || taskEndIndex >= tasks.length || taskEndIndex < 0) {
            if (!isPrivateMethod) {
                that.error(that.localize('outOfBounds', { elementType: that.nodeName.toLowerCase(), methodName: methodName, argumentName: 'taskIndex' }));
            }

            return;
        }

        if (isNaN(type) || type < 0 || type > 3) {
            if (!isPrivateMethod) {
                that.error(that.localize('incorrectArgument', { elementType: that.nodeName.toLowerCase(), methodName: methodName, argumentName: 'connectionType' }));
            }

            return;
        }

        if (isPrivateMethod) {
            return [taskStartIndex, taskEndIndex, type];
        }

        return taskStartIndex + '-' + taskEndIndex + '-' + type;
    }

    /**
     * Applies the new selection via that.selectedIndexes
     */
    _applySelection(oldValue) {
        const that = this,
            newSelection = that.selectedIndexes.slice(0);
        let previouslySelectedTasks = [];

        if (oldValue && oldValue.length > 0) {
            previouslySelectedTasks = oldValue.filter(taskIndex => that._tasks[taskIndex]);
        }

        //Prevent 'change' event firing
        that._taskAPIManipulation = true;

        for (let i = 0; i < newSelection.length; i++) {
            let itemToSelect = newSelection[i];

            if (typeof itemToSelect === 'string' && itemToSelect.indexOf('.') > -1) {
                itemToSelect = that._getTaskByTreeIndex(itemToSelect);
            }
            else {
                itemToSelect = that._tasks[itemToSelect];
            }

            if (itemToSelect && previouslySelectedTasks.indexOf(itemToSelect) < 0) {
                that._selectTask(itemToSelect);
            }
        }

        if (!newSelection.length) {
            that._selectTask();
        }

        delete that._taskAPIManipulation;

        if (oldValue) {
            that.$.fireEvent('change', { value: newSelection, oldValue: oldValue });
        }
    }

    /**
     * Auto schedules the tasks according to their connections
     * @param {any} tasks
     */
    _autoSchedule(tasks) {
        const that = this,
            allTasks = that._tasks;

        if (!that.autoSchedule) {
            return;
        }

        if (!tasks) {
            tasks = allTasks;
        }
        else if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }

        //Validate the tasks according to their connections
        for (let t = 0; t < tasks.length; t++) {
            const task = tasks[t];

            task.minDateStart = task.minDateEnd = undefined;
            that._autoScheduleTasks(task);
        }

        if (!that._isUpdateRequired) {
            return;
        }

        //Recreate the timeline cells
        that._createTimelineCells();

        //update the Timeline tasks
        for (let i = 0; i < allTasks.length; i++) {
            that._setTimelineTaskBar(allTasks[i], true);
            that._refreshTaskConnections(allTasks[i]);
        }

        delete that._isUpdateRequired;
    }

    /**
     * Validates the dates of the tasks on autoSchedule
     * Info regarding Project(Project Management) lag: https://dhtmlx.com/blog/lead-lag-need-know-auto-scheduling-gantt/
     * @param {any} task - task
     * @param {any} connections - task's connections
     * @param {any} checkSubTasks - flag to indicate whether or not to validate it's sub tasks
     */
    _autoScheduleTasks(task) {
        const that = this,
            tasks = that._tasks,
            taskIndex = tasks.indexOf(task),
            subTaskConnections = task.connections;

        //Validates the timeline for loops connected to the task
        for (let i = 0; i < subTaskConnections.length; i++) {
            that._isAutoScheduled({ _task: task }, { _task: tasks[that._getTaskIndexById(subTaskConnections[i].target)] }, true);
        }

        const connectedTasks = that._getConnectedTasks(taskIndex);
        let newDate, timeDiff, newMinDate;

        for (let c = 0; c < connectedTasks.length; c++) {
            const conTask = connectedTasks[c],
                connection = conTask.connections.find(con => that._getTaskIndexById(con.target) === taskIndex),
                conType = connection.type,
                conLag = connection.lag || 0;

            if (conType === 0 || conType === 1) {
                //Note: Setting the minDateStart to take advantage of the minDateStart limiters during dragging
                newMinDate = new Date((conType === 0 ? conTask.dateStart : conTask.dateEnd).getTime() + conLag);
                task.minDateStart = new Date(task.minDateStart ? Math.max(task.minDateStart.getTime(), newMinDate.getTime()) : newMinDate);
                timeDiff = task.minDateStart.getTime() - task.dateStart.getTime();
                newDate = new Date(task.dateEnd.getTime() + (that.autoScheduleStrictMode ? timeDiff : Math.max(0, timeDiff)));

                if (newDate.getTime() !== task.dateEnd.getTime()) {
                    task.dateEnd = newDate;
                    that._isUpdateRequired = true;
                }

                if (that.autoScheduleStrictMode && task.minDateStart.getTime() !== task.dateStart.getTime()) {
                    task.dateStart = task.minDateStart;
                    that._isUpdateRequired = true;
                }
            }
            else {
                //Note: Setting the minDateEnd to take advantage ot the minDateStart limiters during dragging
                newMinDate = new Date((conType === 2 ? conTask.dateEnd : conTask.dateStart).getTime() + conLag);
                task.minDateEnd = new Date(task.minDateEnd ? Math.min(task.minDateEnd.getTime(), newMinDate.getTime()) : newMinDate);
                timeDiff = task.minDateEnd.getTime() - task.dateEnd.getTime();
                newDate = new Date(task.dateStart.getTime() + (that.autoScheduleStrictMode ? timeDiff : Math.max(0, timeDiff)));

                if (newDate.getTime() !== task.dateStart.getTime()) {
                    task.dateStart = newDate;
                    that._isUpdateRequired = true;
                }

                if (that.autoScheduleStrictMode && task.minDateEnd.getTime() !== task.dateEnd.getTime()) {
                    task.dateEnd = task.minDateEnd;
                    that._isUpdateRequired = true;
                }
            }

            //validate the dates of the task
            that._validateTaskProperties(task, task.project);
        }

        for (let t = 0; t < subTaskConnections.length; t++) {
            const subTask = tasks[subTaskConnections[t].target];

            if (subTask) {
                subTask.minDateStart = subTask.minDateEnd = undefined;
                that._autoScheduleTasks(subTask);
            }
        }
    }

    /**
     * Returns the tasks that are connected to the target task
     * @param {any} taskId
     */
    _getConnectedTasks(taskId) {
        const that = this,
            tasks = that._tasks;

        if (!tasks || tasks.length === 0) {
            return;
        }

        let connectedTasks = [];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i],
                connections = task.connections;

            if (connections) {
                for (let c = 0; c < connections.length; c++) {
                    if (connections[c].target === taskId) {
                        connectedTasks.push(task);
                    }
                }
            }
        }

        return connectedTasks;
    }

    /**
     * Restore the items from autoSchedule
     * @param {any} tasks - a timeline task
     * @param {any} conType - connection type to restore from
     */
    _autoScheduleRestore(tasks, conType) {
        const that = this,
            allTasks = that._tasks;

        if (!tasks) {
            tasks = allTasks;
        }

        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            if (allTasks.indexOf(tasks[i]) > -1) {
                if (!conType) {
                    task.minDateStart = task.minDateEnd = undefined;
                }
                else {
                    conType === 0 || conType === 1 ? task.minDateStart = undefined : task.minDateEnd = undefined;
                }
            }
        }
    }

    /**
    * Handles autoScroll functionality
    * @param {any} event
    */
    _autoScroll(event) {
        const that = this;

        function continueOperation(coeff) {
            if (!that._dragDetails) {
                clearInterval(that._scrollInterval);
                that._scrollInterval = undefined;
                delete that._autoScrolling;
                return;
            }

            that._autoScrolling = true;
            that.scrollLeft -= (that.rightToLeft ? -1 : 1) * that.autoScrollStep * coeff;
            that._dragDetails.coordinates.x += that.autoScrollStep * coeff;

            if (that.hasAttribute('dragged')) {
                that._handleTaskBarDrag(event);
            }
            else if (that.hasAttribute('resized')) {
                that._handleTaskBarResize(event);
            }
        }

        if (that.disableAutoScroll || !event || (!that.hasAttribute('dragged') && !that.hasAttribute('resized') && !that.hasAttribute('connecting-task'))) {
            return;
        }

        const timelineRect = that.$.timeline.getBoundingClientRect();

        if (that._scrollInterval) {
            clearInterval(that._scrollInterval);
        }

        that._scrollInterval = setInterval(function () {
            //20px is the autoScroll zone size
            if ((that.scrollLeft || that.rightToLeft) && event.clientX <= timelineRect.left + 20) {
                continueOperation(1);
            }
            else if (that.scrollLeft !== (that.rightToLeft ? 0 : that.scrollWidth) && event.clientX >= timelineRect.left + timelineRect.width - 20) {
                continueOperation(-1);
            }
            else {
                clearInterval(that._scrollInterval);
                that._scrollInterval = undefined;
                delete that._autoScrolling;
            }
        }, 1);
    }

    /**
     * Checks if the Timeline Task is reziable or not
     * @param {any} timelineTask
     */
    _checkTaskBarResizability(event) {
        const that = this;
        let target = event.originalEvent.target;

        if (that.shadowRoot && target === that) {
            target = event.originalEvent.composedPath()[0];
        }

        const timeline = that.$.timeline;
        let timelineTaskCell = target.closest('.smart-timeline-task-cell') || target.closest('.smart-timeline-task'), timelineTask;

        if (!timelineTaskCell || !timeline.contains(timelineTaskCell)) {
            return;
        }

        if (timelineTaskCell.classList.contains('smart-timeline-task-cell')) {
            timelineTask = that.$.timelineTasksContainer.children[that._tasks.indexOf(timelineTaskCell._task)];
        }
        else if (timelineTaskCell.classList.contains('smart-timeline-task')) {
            timelineTask = timelineTaskCell;
            timelineTaskCell = that.$.timelineCellsContainer.children[that._tasks.indexOf(timelineTaskCell._task)];
        }

        //execute if (timelineTask && !timelineTask._task.synchronized && !timelineTask._task.disableResize)
        if (!timelineTask || timelineTask.classList.contains('milestone') || (timelineTask._task.synchronized || timelineTask._task.disableResize)) {
            return;
        }

        if (target.classList && target.classList.contains('smart-task-connection-point')) {
            timeline.removeAttribute('task-bar-hovered');
            return;
        }

        const pageX = event.pageX - window.pageXOffset,
            minOffset = that.resizeHandlesVisibility === 'visible' || Smart.Utilities.Core.isMobile ? 20 : 5,
            taskBarRect = timelineTask.getBoundingClientRect(),
            taskRect = timelineTaskCell.getBoundingClientRect(),
            distanceStart = Math.min(minOffset, pageX - taskRect.left),
            distanceEnd = Math.min(minOffset, taskRect.left + taskRect.width - pageX);

        if (Math.round(taskBarRect.left) + distanceStart >= pageX && Math.round(taskBarRect.left) - distanceStart <= pageX) {
            timeline.setAttribute('task-bar-hovered', 'left');
        }
        else if (Math.round(taskBarRect.left + taskBarRect.width) + distanceEnd >= pageX &&
            Math.round(taskBarRect.left + taskBarRect.width) - distanceEnd <= pageX) {
            timeline.setAttribute('task-bar-hovered', 'right');
        }
        else {
            timeline.removeAttribute('task-bar-hovered');
        }
    }

    /**
     * Executes specific functions when a specific style is loaded insnide ShadowDOM
     */
    _onShadowDomLoaded(target, styleName, handler) {
        function checkLoadedStyles() {
            const linkElements = (target.shadowRoot || target.getRootNode()).querySelectorAll('link');

            for (let i = 0; i < linkElements.length; i++) {
                if (linkElements[i].href.indexOf(styleName) !== -1) {
                    handler()
                    return;
                }
            }

            requestAnimationFrame(checkLoadedStyles);
        }

        requestAnimationFrame(checkLoadedStyles);
    }

    /**
     * Opens the popupWindow
     */
    _openPopupWindow(target, isConfirmWindow) {
        const that = this;

        function configureWindow() {
            function positionWindow() {
                //Positions the windiow in the center always
                const rect = that.getBoundingClientRect();

                popupWindow.style.left = Math.max(rect.left + window.pageXOffset, (rect.left + window.pageXOffset + rect.width / 2 - popupWindow.offsetWidth / 2)) + 'px';
                popupWindow.style.top = Math.max(rect.top + window.pageYOffset, (rect.top + window.pageYOffset + rect.height / 2 - popupWindow.offsetHeight / 2)) + 'px';

                if (popupWindow.opened) {
                    popupWindow.bringToFront();
                    popupWindow._handleActiveState();
                }
                else {
                    popupWindow.open();
                }
            }

            //Set the Content for the Window
            if (that.popupWindowCustomizationFunction) {
                that.popupWindowCustomizationFunction(popupWindow, type, that._tasks.indexOf(target._task));
            }

            that._setPopupWindowTemplate('header', type, target);
            that._setPopupWindowTemplate('footer', type, target);
            that._setPopupWindowTemplate('content', type, target);

            if (!that._popupWindow[type + 'PopupWindow']) {
                const windowExtended = that['$' + type + 'PopupWindow'];

                windowExtended.unlisten('transitionend');
                windowExtended.unlisten('open');
                windowExtended.unlisten('close');
                windowExtended.unlisten('closing');
                windowExtended.unlisten('click');

                //Bind to events
                windowExtended.listen('transitionend', that._popupWindowTransitionendHandler.bind(that));
                windowExtended.listen('open', that._popupWindowOpenHandler.bind(that));
                windowExtended.listen('close', that._popupWindowCloseHandler.bind(that));
                windowExtended.listen('closing', that._popupWindowClosingHandler.bind(that));
                windowExtended.listen('click', that._popupWindowClickHandler.bind(that));
            }

            if (popupWindow.shadowRoot) {
                //The styles for the input
                popupWindow.importStyle(Smart.Utilities.Core.getScriptLocation() + Smart.StyleBaseUrl.replace('/scoped/', '/smart.textbox.css'));

                that._onShadowDomLoaded(popupWindow, 'smart.window.css', positionWindow);
            }
            else {
                positionWindow();
            }

            that._popupWindow[type + 'PopupWindow'] = popupWindow;
        }

        if (!target) {
            return;
        }

        if (!isConfirmWindow) {
            const isOpeningEventPrevented = that.$.fireEvent('opening').defaultPrevented;

            if (isOpeningEventPrevented) {
                return;
            }
        }

        const type = isConfirmWindow ? 'confirm' : (target.classList.contains('smart-task-connection') ? 'connection' : 'task'),
            popupWindow = that._createPopupWindow(type);

        //Used to destinguish the windows. Target can be a connection or a task
        popupWindow._target = target;

        if (!popupWindow.parentElement) {
            document.body.appendChild(popupWindow);
        }

        if (!that._popupWindow) {
            that._popupWindow = {};
        }

        if (!popupWindow.isCompleted) {
            popupWindow.whenReady(() => configureWindow());
        }
        else {
            configureWindow();
        }
    }

    /**
     * Creates the Popup Window for task/connection editing
     */
    _createPopupWindow(type) {
        const that = this,
            windowName = type + 'PopupWindow';

        if (that.$[windowName]) {
            return that.$[windowName];
        }

        const popupWindow = document.createElement('smart-window');

        popupWindow.classList.add('smart-' + type + '-popup-window');
        popupWindow.classList.add('smart-gantt-chart-popup-window');

        //Configure
        popupWindow.setAttribute('smart-id', windowName);
        that.$[windowName] = popupWindow;
        that['$' + windowName] = Smart.Utilities.Extend(popupWindow);

        //Set properties
        //popupWindow.modal = true;
        popupWindow.rightToLeft = that.rightToLeft;
        popupWindow.theme = that.theme;
        popupWindow.animation = that.animation;
        popupWindow.disableSnap = true;
        popupWindow.headerButtons = ['close'];

        //Bind properties
        //that.addPropertyBinding('[[pager_navigationButtons_position]]', 'navigationButtonsPosition', popupwindow);

        return popupWindow;
    }

    /**
     * PopupWindow Open event handler
     */
    _popupWindowOpenHandler(event) {
        const that = this,
            targetWindow = that['$' + event.target.getAttribute('smart-id')];

        if (targetWindow) {
            that._handleModal(true);
            that.$.fireEvent(event.type, event.detail);
            targetWindow.unlisten('open');
        }
    }
    /**
     * PopupWindow Closing event handler
     */
    _popupWindowClosingHandler(event) {
        const that = this,
            windowName = event.target.getAttribute('smart-id'),
            targetWindow = that['$' + windowName];

        if (!targetWindow) {
            return;
        }

        const customEvent = that.$.fireEvent(event.type, event.detail);

        if (customEvent.defaultPrevented) {
            event.preventDefault();
        }

        targetWindow.unlisten(event.type);
    }

    /**
     * PopupWindow Close event handler
     */
    _popupWindowCloseHandler(event) {
        const that = this,
            windowName = event.target.getAttribute('smart-id'),
            targetWindow = that['$' + windowName];

        if (targetWindow) {
            that._handleModal();
            that.$.fireEvent(event.type, event.detail);
            targetWindow.unlisten('close');
            targetWindow.unlisten('click');
            delete that._popupWindow[windowName];

            //Focus the original popupWindow
            const popupWindows = Object.keys(that._popupWindow);

            if (popupWindows.length === 1 && that._popupWindow.confirmPopupWindow) {
                delete that._popupWindow.confirmPopupWindow._target;
                that._popupWindow.confirmPopupWindow.close();
                return;
            }

            if (windowName === 'confirmPopupWindow' && popupWindows.length) {
                requestAnimationFrame(() => {
                    const lastVisibleWindow = that._popupWindow[popupWindows[popupWindows.length - 1]];

                    if (lastVisibleWindow) {
                        lastVisibleWindow.focus();
                    }
                });
            }
        }
    }

    /**
     * PopupWindow Transitionend Event Handler
     */
    _popupWindowTransitionendHandler(event) {
        const that = this,
            targetWindow = event.target;

        //Removes the popupWindow from the DOM when it's closed
        if (!targetWindow.opened && event.propertyName === 'visibility') {

            that['$' + targetWindow.getAttribute('smart-id')].unlisten('transitionend');

            if (targetWindow.parentElement) {
                targetWindow.parentElement.removeChild(targetWindow);
            }
        }
    }

    /**
     * Handles the modal
     * @param {any} open
     */
    _handleModal(open) {
        const that = this;

        let modal = (that.shadowRoot || that).querySelector('.smart-popup-window-modal');

        if (open) {
            if (!modal) {
                //Create the modal for the element
                modal = document.createElement('div');
                modal.classList.add('smart-popup-window-modal');
            }

            if (!modal.parentElement) {
                that.$.container.appendChild(modal);
            }
        }
        else if (modal && modal.parentElement && Object.keys(that._popupWindow).length < 2) {
            modal.parentElement.removeChild(modal);
        }
    }

    /**
    * Creates a Task Editor for the Task Popup Window
    */
    _createTaskEditor(column, task, editorContainers) {
        const that = this,
            label = column.value,
            value = task[column.value];
        let editorContainer = editorContainers.find(cont => cont._label === label),
            labelElement, editElement;

        if (editorContainer) {
            labelElement = editorContainer.firstElementChild;
            editElement = editorContainer.lastElementChild;
        }
        else {
            editorContainer = document.createElement('div');

            editorContainer.classList.add('smart-gantt-chart-popup-window-editor');
            editorContainer._label = label;

            if (column.customEditor) {
                editorContainer.appendChild(column.customEditor(label, value));
                return editorContainer;
            }

            labelElement = document.createElement('label');

            if (!labelElement.id) {
                labelElement.id = 'editorLabel' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            if (typeof value === 'number' || typeof value === 'string') {
                editElement = document.createElement('input');
                editElement.classList.add('smart-input');
            }
            else if (value instanceof Date) {
                if (Smart.DateTimePicker) {
                    editElement = document.createElement('smart-date-time-picker');
                    editElement.locale = that.locale;
                    editElement.dropDownAppendTo = 'body';
                    editElement.calendarButton = true;
                    editElement.dropDownDisplayMode = 'auto';
                    editElement.enableMouseWheelAction = true;
                    editElement.formatString = 'yyyy-MMM-dd HH:mm:ss';
                }
                else {
                    editElement = document.createElement('input');
                    editElement.type = 'datetime-local';
                    //editElement.pattern = '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}'; //Standart JS pattern
                }
            }

            editElement.setAttribute('aria-labelledby', labelElement.id);
        }

        if (!editorContainer.parentElement) {
            editorContainer.appendChild(labelElement);
            editorContainer.appendChild(editElement);

            return editorContainer;
        }

        //Set the content now because the editors are already in the DOM
        that._setPopupWindowEditors(column, task, editorContainer);
    }

    /**
     * Sets the value of the editors inside the Poup Window
     */
    _setPopupWindowEditors(column, targetTask, editorContainer) {
        const that = this,
            labelElement = editorContainer.firstElementChild,
            editElement = editorContainer.lastElementChild,
            label = (column.value + '').split(/(?=[A-Z])/).join(' '),
            value = targetTask[column.value];

        if (!column.customEditor) {
            labelElement.innerHTML = that.localize(column.value) || label.charAt(0).toUpperCase() + label.slice(1);

            if (typeof value === 'number') {
                editElement.value = parseFloat(value.toFixed(2));
            }
            else if (typeof value === 'string') {
                editElement.value = value;
            }
            else if (value instanceof Date) {
                editElement.value = new Date(value);
            }

            if (targetTask.type === 'project' && targetTask.synchronized && (label.toLowerCase().indexOf('date') > -1 || label.toLowerCase().indexOf('duration') > -1)) {
                editElement.disabled = true;
            }
            else {
                editElement.disabled = false;
            }

            editElement.rightToLeft = that.rightToLeft;
            editElement.animation = that.animation;
            editElement.theme = that.theme;
        }
        else if (column.setCustomEditorValue) {
            column.setCustomEditorValue(editorContainer, label, value);
        }
    }

    /**
     * Sets the content for the Popup Windows
     * @param {any} type
     * @param {any} target
     */
    _setPopupWindowContent(type, target) {
        const that = this,
            popupWindow = that.$[type + 'PopupWindow'],
            targetTask = target._task,
            editorContainers = [].slice.call(popupWindow.getElementsByClassName('smart-gantt-chart-popup-window-editor'));

        if (!popupWindow.content || (popupWindow.content.innerHTML && !editorContainers.length)) {
            return;
        }

        if (type === 'task' && targetTask) {
            const taskColumns = that.taskColumns;

            for (let i = 0; i < taskColumns.length; i++) {
                const col = taskColumns[i];

                if (!targetTask[col.value]) {
                    continue;
                }

                const newEditor = that._createTaskEditor(col, targetTask, editorContainers);

                if (newEditor) {
                    popupWindow.appendChild(newEditor);

                    //Set the value of the editors here because now they are in the DOM
                    that._setPopupWindowEditors(col, targetTask, newEditor);
                }
            }

            //Accessibility
            if (target.id) {
                popupWindow.setAttribute('aria-controls', target.id);
            }
        }
        else if (type === 'confirm') {
            popupWindow.innerHTML = '<div class="smart-gantt-chart-popup-window-editor">' + that.localize('confirm', { componentName: 'The task' }) + '</div >';

            //Accessibility
            if (that._popupWindow) {
                const popupWindows = Object.keys(that._popupWindow);

                popupWindow.setAttribute('aria-controls', that._popupWindow[popupWindows[popupWindows.length - 1]].id);
            }
        }
        else {
            const conDetails = target.getAttribute('connection-id').split('-'),
                taskStart = that._tasks[conDetails[0]],
                taskEnd = that._tasks[conDetails[1]];

            popupWindow.innerHTML = '<div class="smart-gantt-chart-popup-window-editor">' + that.localize('deleteLink') +
                '<b> ' + taskStart.label + ' - ' + taskEnd.label + '?</b></div>'
        }
    }

    /**
     * Returns the template for the Popup Window
     * @param {any} section - the section of the Window
     * @param {any} type - type of content for the Window
     */
    _setPopupWindowTemplate(section, type, target) {
        const that = this,
            popupWindow = that.$[type + 'PopupWindow'];

        if (section === 'content') {
            that._setPopupWindowContent(type, target);
            return;
        }

        if (!popupWindow[section + 'Template']) {
            popupWindow[section + 'Template'] = that._createPopupWindowTemplate(section, type, target);
        }

        //Update the content of the template
        if (section === 'header' && target && target._task) {
            const label = (popupWindow.shadowRoot || popupWindow).querySelector('.smart-popup-window-label');

            if (label) {
                label.innerHTML = target._task.label
            }

            //const dateStart = target._task.dateStart,
            //    dateEnd = target._task.dateEnd;

            //if (!dateStart || !dateEnd) {
            //    template.innerHTML = '';
            //}

            //const dayFormat = ['2-digit', 'numeric'][that.dayFormat] || 'numeric';

            //template.innerHTML = dateStart.toLocaleDateString(that.locale, { day: dayFormat, month: that.monthFormat, year: that.yearFormat }) + ' - ' +
            //    dateEnd.toLocaleDateString(that.locale, { day: dayFormat, month: that.monthFormat, year: that.yearFormat });
        }
        else if (section === 'footer') {
            const buttons = (popupWindow.shadowRoot || popupWindow).querySelectorAll('.smart-popup-window-button');

            for (let b = 0; b < buttons.length; b++) {
                const button = buttons[b];

                //Avoids problems when ShadowDOM is applied
                button.innerHTML = type === 'task' ? '<span class="smart-icon"></span>' : '';
                button.theme = that.theme;
                button.rightToLeft = that.rightToLeft;
                button.animation = that.animation;

                if (button.classList.contains('ok')) {
                    button.innerHTML += that.localize('ok');
                    button.setAttribute('aria-label', 'ok');
                }
                else if (button.classList.contains('cancel')) {
                    button.innerHTML += that.localize('cancel');
                    button.setAttribute('aria-label', 'cancel');
                }
                else if (button.classList.contains('delete')) {
                    button.innerHTML += that.localize('delete');
                    button.setAttribute('aria-label', 'delete');
                }

                //Remove ripple element left from incomplete animation
                const unfinishedRippleElement = button.querySelector('.smart-ripple');

                if (unfinishedRippleElement) {
                    unfinishedRippleElement.parentElement.removeChild(unfinishedRippleElement);
                }
            }
        }
    }

    /**
     * Creates the Template for the corresponding section of the popupWindow
     */
    _createPopupWindowTemplate(section, type) {
        const that = this,
            template = document.createElement('template');

        if (section === 'footer') {
            switch (type) {
                case 'task':
                    template.innerHTML =
                        `<smart-button class="smart-popup-window-button ok primary" 
                            animation="${that.animation}" theme="${that.theme}" ${that.rightToLeft ? 'right-to-left' : ''}>
                        </smart-button>
                        <smart-button class="smart-popup-window-button cancel" 
                            animation="${that.animation}" theme="${that.theme}" ${that.rightToLeft ? 'right-to-left' : ''}>
                        </smart-button>
                        <smart-button class="smart-popup-window-button delete secondary"  
                            animation="${that.animation}" theme="${that.theme}" ${that.rightToLeft ? 'right-to-left' : ''}>
                        </smart-button>`;
                    break;
                case 'connection':
                case 'confirm':
                    template.innerHTML =
                        `<smart-button class="smart-popup-window-button ok primary"  
                            animation="${that.animation}" theme="${that.theme}" ${that.rightToLeft ? 'right-to-left' : ''}>
                        </smart-button>
                    <smart-button class="smart-popup-window-button cancel"
                        animation="${that.animation}" theme="${that.theme}" ${that.rightToLeft ? 'right-to-left' : ''}>
                    </smart-button>`;
                    break;
            }
        }
        else if (section === 'header' && (type === 'task' || type === 'confirm')) {
            template.innerHTML = '<span class="smart-popup-window-label"></span>';
        }

        return template;
    }

    /**
     * Click Handler for the Popup Window
     * @param {any} event
     */
    _popupWindowClickHandler(event) {
        const that = this;
        let target = (event.originalEvent || event).target;

        if (target.shadowRoot) {
            target = (event.originalEvent || event).composedPath()[0];
        }

        const popupWindow = target.closest('smart-window') || (target.getRootNode() && target.getRootNode().host ? target.getRootNode().host : undefined),
            popupWindowTarget = popupWindow._target;

        if (target.closest('.smart-popup-window-button.cancel')) {
            if (that._popupWindow && that._popupWindow.confirmPopupWindow && popupWindow !== that._popupWindow.confirmPopupWindow) {
                that._popupWindow.confirmPopupWindow.close();
            }

            popupWindow.close();

            delete popupWindow._target;
            return;
        }

        if (target.closest('.smart-popup-window-button.ok')) {
            if (popupWindow === that.$.connectionPopupWindow && popupWindowTarget.classList.contains('smart-task-connection')) {
                that._removeConnection(popupWindowTarget);
            }
            else if (popupWindow === that.$.confirmPopupWindow) {
                that.removeTask(that._tasks.indexOf(popupWindowTarget._task));
                popupWindow.close();

                if (that.$.taskPopupWindow) {
                    that.$.taskPopupWindow.close();
                }

                delete popupWindow._target;
            }
            else {
                const editors = (popupWindow.shadowRoot || popupWindow).querySelectorAll('.smart-gantt-chart-popup-window-editor');
                let taskDetails = {};

                for (let e = 0; e < editors.length; e++) {
                    const propName = editors[e]._label,
                        taskColumn = that.taskColumns.find(taskC => taskC.value === propName);

                    if (taskColumn.customEditor) {
                        taskDetails[propName] = taskColumn.getCustomEditorValue(editors[e]);
                    }
                    else {
                        const editor = editors[e].lastElementChild;
                        let editorValue;

                        if (Smart.DateTimePicker && editor instanceof Smart.DateTimePicker) {
                            editorValue = editor.value.toDate();
                        }
                        else if (editor instanceof HTMLInputElement && editor.type === 'datetime-local') {
                            editorValue = new Date(editor.value);
                        }
                        else if (Smart.DropDownList && editor instanceof Smart.DropDownList) {
                            editorValue = editor.selectedValue[0];
                        }
                        else {
                            editorValue = editor.value;
                        }

                        if (editorValue instanceof Date && isNaN(editorValue.getTime())) {
                            editorValue = undefined;
                        }

                        if (editorValue !== undefined && editorValue !== null) {
                            taskDetails[propName] = editorValue;
                        }
                    }
                }

                that.updateTask(that._tasks.indexOf(popupWindowTarget._task), taskDetails);
            }

            if (that._popupWindow && that._popupWindow.confirmPopupWindow && popupWindow !== that._popupWindow.confirmPopupWindow) {
                that._popupWindow.confirmPopupWindow.close();
            }

            popupWindow.close();

            delete popupWindow._target;
            return;
        }

        if (target.closest('.smart-popup-window-button.delete')) {
            that._openPopupWindow(popupWindow._target, true);
            return;
        }
    }

    /**
     * Creates the tasks object
     */
    _createTasks(dataSource, isCustomTaskList) {
        const that = this;

        if (!isCustomTaskList) {
            //Clear all tasks
            that.clearTasks();
        }

        let tasks = [];

        function loadTasks(source, project) {
            let projectTasks = [];

            if (source.length === 0) {
                return;
            }

            for (let d = 0; d < source.length; d++) {
                let task = source[d];

                if (typeof task !== 'object') {
                    continue;
                }

                task = that._validateTaskProperties(task, project);

                if (!task) {
                    continue;
                }

                task.project = project;

                if (task.tasks instanceof Array && task.tasks.length > 0) {
                    if (task.synchronized) {
                        task.dateStart = task.minDateStart = task.maxDateStart = undefined;
                        task.dateEnd = task.minDateEnd = task.maxDateEnd = undefined;
                    }

                    task.type = 'project';
                    task.tasks = loadTasks(task.tasks, task);

                    if (task.tasks.length === 0) {
                        delete task.tasks;
                    }
                }

                if (!task.type || ['project', 'task', 'milestone'].indexOf(task.type) < 0) {
                    task.type = 'task';
                }

                //task.project = project;

                if (project && task.type === 'project' && task.tasks.length > 0) {
                    projectTasks.push(task);
                    projectTasks = projectTasks.concat(task.tasks);
                    continue;
                }

                if (!project) {
                    if (task.dateStart && task.dateEnd && !isNaN(task.dateStart.getTime()) && !isNaN(task.dateEnd.getTime())) {
                        //that._tasks.push(task);
                        tasks.push(task);
                    }

                    if (task.tasks) {
                        //that._tasks = that._tasks.concat(task.tasks);
                        tasks = tasks.concat(task.tasks);
                    }
                }

                projectTasks.push(task);
            }

            return projectTasks;
        }

        loadTasks(dataSource || that.dataSource);

        if (isCustomTaskList) {
            return tasks.slice(0);
        }

        that._tasks = tasks.slice(0);
    }

    /**
     * Creates the Timeline according to the tasks
     */
    _createTimeline() {
        const that = this;

        if (!that._tasks || that._tasks.length === 0) {
            return;
        }

        that._autoSchedule();
        that._createTimelineCells();

        //--- Reset the timeline
        that._resetTimeline();
        // ---

        that._insertTimelineTasks(that._tasks);
    }

    /**
     * Inserts Tasks / task cells into the Timeline and updates it
     * @param {any} tasks
     */
    _insertTimelineTasks(tasks, index, newItemsInsert) {
        const that = this,
            isTaskVisible = function (task) {
                let projectTask = task.project;

                while (projectTask) {
                    if (!projectTask.expanded) {
                        return false;
                    }

                    projectTask = projectTask.project;
                }

                return true;
            };
        let lazyLoadConnections = {};

        for (let t = 0; t < tasks.length; t++) {
            const task = tasks[t],
                connections = task.connections;

            that._createTimelineTask(task, index ? index + t : undefined);
            that._setTimelineTaskBar(task);
            that._setTaskBarProgress(task);
            that._setTaskBarLabel(task);

            if (newItemsInsert) {
                continue;
            }

            //Handles expanding/collapsing
            that._expandTask(task);

            if (!isTaskVisible(task)) {
                continue;
            }

            //Handle task connecting
            for (let c = 0; c < connections.length; c++) {
                let targetId = connections[c].target;

                if (typeof targetId === 'string') {
                    let targetIndexFromId = that._getTaskIndexById(targetId);

                    targetId = targetIndexFromId !== undefined ? targetIndexFromId : parseInt(targetId);
                }

                if (!targetId || isNaN(targetId) || targetId < 0 || targetId >= tasks.length || targetId === t) {
                    connections.splice(connections.indexOf(connections[c]), 1);
                    continue;
                }

                const connectionId = t + '-' + targetId + '-' + connections[c].type;

                if (targetId > t) {
                    if (!lazyLoadConnections[targetId]) {
                        lazyLoadConnections[targetId] = [];
                    }

                    if (lazyLoadConnections[targetId].indexOf(connectionId) < 0) {
                        lazyLoadConnections[targetId].push(connectionId);
                    }

                    continue;
                }

                that._connectTask(connectionId);
            }

            if (lazyLoadConnections[t]) {
                for (let l = 0; l < lazyLoadConnections[t].length; l++) {
                    that._connectTask(lazyLoadConnections[t][l]);
                }

                delete lazyLoadConnections[t];
            }
        }

        that._refresh();

        //Set the CSS variable for the content height. Used by the header's pseudo elements
        that.$.container.style.setProperty('--smart-gantt-chart-timeline-content-height', that.$.timelineCellsContainer.offsetHeight + 'px');
    }

    /**
     * Ensures an item is always visible
     * @param {any} item
     */
    _ensureVisible(item) {
        const that = this;

        if (item === undefined || item === null) {
            return;
        }

        const taskTreeItems = Array.from(that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')),
            itemIndex = taskTreeItems.indexOf(item);

        if (!taskTreeItems.length) {
            return;
        }

        if (typeof item === 'number') {
            item = Math.min(Math.max(0, item), taskTreeItems.length - 1);
            that.$.taskTree.ensureVisible(taskTreeItems[item]);
        }
        else if (typeof item === 'string') {
            that.$.taskTree.ensureVisible(item);
        }

        const taskBar = that.$.timelineCellsContainer.children[itemIndex];

        if (!taskBar) {
            return;
        }

        if (taskBar.offsetTop + taskBar.offsetHeight > that.scrollTop + that.$.timelineContent.offsetHeight) {
            that.scrollTop = Math.max(0, taskBar.offsetTop + taskBar.offsetHeight - that.$.timelineContent.offsetHeight);
        }
        else if (taskBar.offsetTop < that.scrollTop) {
            that.scrollTop = Math.max(0, taskBar.offsetTop);
        }

        that.$.timelineContent.scrollTop = that.scrollTop;
    }

    /**
     * Expands/Collapses a timeline task.
     * @param {any} task - a Project task
     * @param {any} expand - flag indicating whether to expand or collapse.
     */
    _expandTask(task, expand) {
        const that = this;

        if (!task) {
            return true;
        }

        const projectTask = task.tasks && task.tasks.length ? task : task.project;

        if (!projectTask) {
            return true;
        }

        //Reset the animation necessities
        that.$.timelineContent.style.minHeight = '';
        that.$.timelineContent.style.maxHeight = '';

        if (expand === undefined) {
            expand = projectTask.expanded;

            if (expand && expand === projectTask.expanded) {
                return true;
            }
        }
        else {
            //Animates the timeline during expanding/collapsing
            that._animateTimelineExpanding(projectTask, expand);
            return;
        }

        //Expand/Collapse a task
        that._handleExpanding(projectTask, expand);

        return projectTask.expanded;
    }

    /**
     * Handles the actual collapse/expand operation
     * @param {any} projectTask - the project task to be expanded
     * @param {any} expand - a flag indicating whether to expand or collapse
     */
    _handleExpanding(projectTask, expand) {
        const that = this,
            tasks = that._tasks,
            connectionsContainer = that.$.timelineConnectionsContainer,
            connections = [].slice.call(connectionsContainer.children),
            timelineCellsContainerChildren = that.$.timelineCellsContainer.children,
            timelineTasksContainerChildren = that.$.timelineTasksContainer.children,
            projectTasks = projectTask.tasks,
            taskBarHeight = parseFloat(window.getComputedStyle(that).getPropertyValue('--smart-gantt-chart-task-default-height')) || 0;
        let timelineContentHeight = that.$.timelineCellsContainer.offsetHeight,
            taskIndex = 0;

        that._handleTaskItemExpanding(projectTask, expand);

        for (let t = 0; t < projectTasks.length; t++) {
            taskIndex = tasks.indexOf(projectTasks[t]);

            const taskBar = timelineTasksContainerChildren[taskIndex],
                timelineCell = timelineCellsContainerChildren[taskIndex];

            if (!taskBar) {
                continue;
            }

            //Removes the connection lines
            for (let c = 0; c < connections.length; c++) {
                const con = connections[c],
                    conId = con.getAttribute('connection-id').split('-');

                if ((parseInt(conId[1]) === taskIndex || parseInt(conId[0]) === taskIndex) && con.parentElement) {
                    connectionsContainer.removeChild(con);
                }
            }

            if (expand) {
                if (!taskBar.classList.contains('smart-visibility-hidden')) {
                    continue;
                }

                const taskProject = taskBar._task.project;

                if (taskProject && taskProject !== projectTask && !that._isTaskExpanded(taskBar._task, projectTask)) {
                    continue;
                }

                //Show the taskBar and it's connections
                taskBar.classList.remove('smart-visibility-hidden');
                timelineCell.classList.remove('smart-visibility-hidden');

                //NOTE: calculating the Timeline height here. If not transitions will interfere with the calculation later.
                //Refresh the Height of the Timeline

                timelineContentHeight += taskBarHeight;

                that.$.container.style.setProperty('--smart-gantt-chart-timeline-content-height', timelineContentHeight + 'px');

                //Refreshes the connections
                that._refreshTaskConnections(taskBar);
            }
            else {
                if (taskBar.classList.contains('smart-visibility-hidden')) {
                    continue;
                }

                //Hide the taskBar and it's connections
                taskBar.classList.add('smart-visibility-hidden');
                timelineCell.classList.add('smart-visibility-hidden');

                timelineContentHeight -= taskBarHeight;

                //NOTE: calculating the Timeline height here. If not transitions will interfere with the calculation later.
                //Refresh the Height of the Timeline
                that.$.container.style.setProperty('--smart-gantt-chart-timeline-content-height', timelineContentHeight + 'px');
            }
        }

        //Update the top position of the tasks below the target
        for (let i = tasks.indexOf(projectTask) + 1; i < timelineTasksContainerChildren.length; i++) {
            //for (let i = taskIndex + 1; i < timelineTasksContainerChildren.length; i++) {
            const timelineTaskBar = timelineTasksContainerChildren[i];

            timelineTaskBar.style.top = (timelineCellsContainerChildren[i].offsetTop) + 'px';

            //Refreshes the connections
            that._refreshTaskConnections(timelineTaskBar);
        }

        projectTask.expanded = expand;

        //Refresh the ScrollBars
        that._refresh();

        //smartTree and Splitter have smart-resize-trigger that add 2px to the overal height. So SplitterBar have to be recalculated
        //that.$.treeSplitter._validateBarsSize();
        //that.$.mainSplitter._validateBarsSize();
    }

    /**
     * Handles expanding/collapsing of Task Tree column items
     * @param {any} projectTask - the project task to be expanded/collapsed
     * @param {any} expand - flag indicating whether to expand or collapse the task
     */
    _handleTaskItemExpanding(projectTask, expand) {
        const that = this,
            tasks = that._tasks,
            taskIndex = tasks.indexOf(projectTask),
            taskColumns = that.$.treeSplitter._items;

        function transitionendHandler(event) {
            const that = this;

            if (event.propertyName === 'visibility') {
                return;
            }

            that.style.height = '';
            that.removeEventListener('transitionend', transitionendHandler);
        }

        for (let i = 1; i < taskColumns.length; i++) {
            const taskItems = taskColumns[i].getElementsByClassName('smart-task-item');

            if (!taskItems.length || !taskItems[taskIndex]) {
                continue;
            }

            const dropDown = taskItems[taskIndex].lastElementChild;

            if (that._noAnimation) {
                expand ? dropDown.classList.remove('smart-visibility-hidden') : dropDown.classList.add('smart-visibility-hidden');
                return;
            }

            //Necessary to see the full transitions
            requestAnimationFrame(function () {
                //NOTE: Height is 'auto' but we need a fixed height for the Transitions
                let childrenHeight = 0;

                for (let c = 0; c < dropDown.children.length; c++) {
                    childrenHeight += dropDown.children[c].offsetHeight;
                }

                dropDown.style.height = childrenHeight + 'px';
                dropDown.addEventListener('transitionend', transitionendHandler);

                if (expand) {
                    dropDown.classList.remove('smart-visibility-hidden');
                }
                else {
                    dropDown.classList.add('smart-visibility-hidden');

                    //Necessary because the start height is 'auto'
                    requestAnimationFrame(function () {
                        dropDown.style.height = '0';
                    });
                }
            });
        }
    }

    /**
     * Checks if a Task is expanded or not
     * @param {any} task
     */
    _isTaskExpanded(task, ignoredProject) {
        if (!task) {
            return;
        }

        let isExpanded,
            taskProject = task.project;

        while (taskProject) {
            isExpanded = taskProject.expanded;

            if (!isExpanded) {
                return;
            }

            taskProject = taskProject.project;

            if (taskProject === ignoredProject) {
                break;
            }
        }

        return isExpanded;
    }

    /**
     * Handles keyboard hover/focus states of the Task Tree. Callback used inside Tree's keydown handler
     * @param {any} hoveredTreeitem
     */
    _hoverViaKeyboardCallback(hoveredTreeitem) {
        const that = this;

        //Unfocuses the Task Tree items
        that._unfocusTaskTreeItems();

        if (!hoveredTreeitem) {
            return;
        }

        const itemIndex = Array.from(that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')).indexOf(hoveredTreeitem);

        const timelineTaskCell = that.$.timelineCellsContainer.children[itemIndex];
        //timelineTask = that.$.timelineCellsContainer.children[itemIndex];

        if (timelineTaskCell) {
            timelineTaskCell.setAttribute('focus', '');
        }

        //if (timelineTask) {
        //    timelineTask.setAttribute('focus', '');
        //}

        //Set focus state to the task inside the animation container
        if (!that.$.timelineAnimationContainer.classList.contains('smart-visibility-hidden')) {
            const animationTasks = that.$.timelineAnimationContainer.getElementsByClassName('smart-timeline-task');

            for (let t = 0; t < animationTasks.length; t++) {
                const animationTask = animationTasks[t];

                if (that._tasks.indexOf(animationTask._task) === itemIndex) {
                    animationTask.setAttribute('focus', '');
                    break;
                }
            }
        }

        //if (Smart.Utilities.Core.isMobile) {
        //    return;
        //}

        const taskSplitterItems = that.$.treeSplitter._items;

        //set hover state
        for (let i = 0; i < taskSplitterItems.length; i++) {
            const taskSplitterItem = taskSplitterItems[i];

            if (taskSplitterItem !== that.$.taskTreeSplitterItem) {
                //Unfocus last item


                const item = taskSplitterItem.getElementsByClassName('smart-task-label-container')[itemIndex];

                if (item) {
                    item.setAttribute('focus', '');
                }
            }
        }

        that._focusedItem = itemIndex;
    }

    /**
     * Unfocuses teh last focused Task Tree item.
     */
    _unfocusTaskTreeItems() {
        const that = this,
            taskSplitterItems = that.$.treeSplitter._items;

        //remove focus state
        for (let i = 0; i < taskSplitterItems.length; i++) {
            const taskSplitterItem = taskSplitterItems[i];

            if (taskSplitterItem !== that.$.taskTreeSplitterItem) {
                const items = taskSplitterItem.getElementsByClassName('smart-task-label-container');

                for (let t = 0; t < items.length; t++) {
                    items[t].removeAttribute('focus');
                }
            }
        }

        const timelineTaskCells = that.$.timelineCellsContainer.children;
        //timelineTasks = that.$.timelineCellsContainer.children;

        for (let i = 0; i < timelineTaskCells.length; i++) {
            const taskCell = timelineTaskCells[i];
            //task = timelineTasks[i];

            if (taskCell.hasAttribute('focus')) {
                taskCell.removeAttribute('focus');
            }

            //if (task.hasAttribute('focus')) {
            //    task.removeAttribute('focus');
            //}
        }

        delete that._focusedItem;
    }

    /**
     * Removes the content from the animation container
     */
    _emptyAnimationContainer() {
        const timelineAnimationChildren = this.$.timelineAnimationContainer.firstElementChild.children;

        for (let i = 0; i < timelineAnimationChildren.length; i++) {
            timelineAnimationChildren[i].firstElementChild.innerHTML = '';
            timelineAnimationChildren[i].lastElementChild.innerHTML = '';
        }
    }

    /**
     * Animates the Timeline during collapsing/expanding of tasks
     * @param {any} projectTask
     * @param {any} expand
     */
    _animateTimelineExpanding(projectTask, expand) {
        const that = this,
            timelineAnimationContainer = that.$.timelineAnimationContainer,
            timelineAnimationInnerContainer = timelineAnimationContainer.firstElementChild,
            contentBefore = timelineAnimationInnerContainer.children[0],
            contentAnimation = timelineAnimationInnerContainer.children[1],
            contentAfter = timelineAnimationInnerContainer.children[2];

        if (that.animation === 'none') {
            timelineAnimationContainer.classList.add('smart-visibility-hidden');
            that._emptyAnimationContainer();
            that._handleExpanding(projectTask, expand);
            return;
        }

        const tasks = that._tasks,
            timelineTasks = that.$.timelineTasksContainer.children,
            timelineConnections = that.$.timelineConnectionsContainer.children,
            isProjectTask = function (task) {
                let taskProject = task.project;

                while (taskProject) {
                    if (taskProject === projectTask) {
                        return true;
                    }

                    taskProject = taskProject.project;
                }
            },
            expandedProjectTasks = projectTask.tasks.filter(task => task.project === projectTask || that._isTaskExpanded(task, projectTask));

        let taskIndex = tasks.indexOf(projectTask);
        const taskBarHeight = timelineTasks[taskIndex].offsetHeight,
            timelineContentOffsetTop = that.$.timelineContent.offsetTop;

        that._emptyAnimationContainer();

        //Set the initial state of the project task
        expand ? contentAnimation.classList.add('animate') : contentAnimation.classList.remove('animate');

        let contentBeforeTaskIndexes = [],
            contentAnimationIndexes = [],
            contentAfterIndexes = [],
            contentAnimationHeight = 0;

        //Fill with tasks
        for (let i = 0; i < timelineTasks.length; i++) {
            const task = timelineTasks[i],
                clone = task.cloneNode(true),
                timelineTaskIndex = tasks.indexOf(task._task),
                taskProject = task._task.project;

            //if (taskProject && taskProject !== projectTask && !taskProject.expanded) {
            if (taskProject && taskProject !== projectTask && !that._isTaskExpanded(task._task, projectTask)) {
                continue;
            }

            clone.style['margin' + (that.rightToLeft ? 'Right' : 'Left')] = clone.style[that.rightToLeft ? 'right' : 'left'];
            clone.classList.remove('smart-visibility-hidden');

            if (timelineTaskIndex <= taskIndex) {
                contentBefore.lastElementChild.appendChild(clone);
                contentBeforeTaskIndexes.push(timelineTaskIndex);
            }
            else if (isProjectTask(task._task)) {
                contentAnimation.lastElementChild.appendChild(clone);
                contentAnimationIndexes.push(timelineTaskIndex);
                contentAnimationHeight += clone.offsetHeight;
            }
            else {
                contentAfter.lastElementChild.appendChild(clone);
                contentAfterIndexes.push(timelineTaskIndex);
            }

            if (that._focusedItem !== undefined && that._focusedItem === taskIndex && timelineTaskIndex === taskIndex) {
                clone.setAttribute('focus', '');
            }
        }

        //Temporarly avoid transitions
        contentAnimation.style.transition = 'none';

        //NOTE: The order of execution is important for the Transition
        if (expand) {
            that._handleExpanding(projectTask, expand);
        }

        //Fill with connections
        for (let i = 0; i < timelineConnections.length; i++) {
            const con = timelineConnections[i],
                clone = con.cloneNode(),
                conId = clone.getAttribute('connection-id').split('-');

            if (contentBeforeTaskIndexes.indexOf(parseInt(conId[0])) > -1 && contentBeforeTaskIndexes.indexOf(parseInt(conId[1])) > -1) {
                contentBefore.firstElementChild.appendChild(clone);
            }
            else if (contentAnimationIndexes.indexOf(parseInt(conId[0])) > -1 && contentAnimationIndexes.indexOf(parseInt(conId[1])) > -1) {
                contentAnimation.firstElementChild.appendChild(clone);
            }
            else if (contentAfterIndexes.indexOf(parseInt(conId[0])) > -1 && contentAfterIndexes.indexOf(parseInt(conId[1])) > -1) {
                contentAfter.firstElementChild.appendChild(clone);
            }
        }

        //Position the connections to their target
        contentAnimation.firstElementChild.style.transform = 'translateY(-' + (contentBefore.offsetHeight) + 'px)';
        contentAfter.firstElementChild.style.transform = 'translateY(-' + (contentAnimationHeight + contentBefore.offsetHeight) + 'px)';

        //NOTE: The order of execution is important for the Transition
        let timelineContentHeight;

        if (!expand) {
            that._handleExpanding(projectTask, expand);
        }

        timelineContentHeight = that.$.timelineContent.offsetHeight;

        if (timelineContentHeight !== timelineAnimationInnerContainer.offsetHeight) {
            that.$.timelineContent.style[(expand ? 'max' : 'min') + 'Height'] = timelineAnimationInnerContainer.offsetHeight + 'px';
        }

        //Position the animation container 
        timelineAnimationContainer.style.top = timelineContentOffsetTop + 'px';
        timelineAnimationInnerContainer.style.top = (-that.scrollTop) + 'px';

        //Show the timeline animation container
        timelineAnimationContainer.classList.remove('smart-visibility-hidden');

        //Hide the Timeline tasks Container
        that.$.timelineContent.classList.add('smart-visibility-hidden');

        //Necessary to see the full transitions
        requestAnimationFrame(function () {
            //NOTE: Height is 'auto' but we need a fixed height for the Transitions
            contentAnimation.style.height = expandedProjectTasks.length * taskBarHeight + 'px';

            //Reset the transition
            contentAnimation.style.transition = '';

            if (expand) {
                contentAnimation.classList.remove('animate');
                that.$.timelineContent.style.maxHeight = timelineContentHeight + 'px';
            }
            else {
                contentAnimation.classList.add('animate');

                //Necessary because the start height is 'auto'
                requestAnimationFrame(function () {
                    contentAnimation.style.height = '0';
                    that.$.timelineContent.style.minHeight = timelineContentHeight + 'px';
                });
            }
        });
    }

    /**
     * Handles the timeline Animation container's transitionEnd event
     */
    _timelineAnimationContainerTransitionendHandler(event) {
        const that = this;

        if (event.propertyName === 'height') {
            const timelineAnimationContainer = that.$.timelineAnimationContainer;

            timelineAnimationContainer.classList.add('smart-visibility-hidden');
            that.$.timelineContent.classList.remove('smart-visibility-hidden');
            that._emptyAnimationContainer();
            that.$.timelineContent.style.minHeight = '';
            that.$.timelineContent.style.maxHeight = '';

            //Resetting the height of the Content section
            timelineAnimationContainer.firstElementChild.children[1].style.height = '';
        }
    }

    /**
     * Returns the task by tree index 
     * @param {any} index
     */
    _getTaskByTreeIndex(index, onlyProjects) {
        const that = this;

        if (!index) {
            return;
        }

        const targetPath = index.split('.');
        let targetProject = that._tasks.filter(task => !task.project)[index.split('.')[0]];

        if (!targetProject) {
            return;
        }

        if (!targetProject.tasks || !targetProject.tasks.length) {
            return onlyProjects ? null : targetProject;
        }

        for (let p = 1; p < targetPath.length; p++) {
            const target = targetProject.tasks.filter(item => item.project === targetProject)[targetPath[p]];

            if (!target || (onlyProjects && (!target.tasks || !target.tasks.length))) {
                break;
            }

            targetProject = target;
        }

        if (onlyProjects) {
            return targetProject && targetProject.type === 'project' ? targetProject : undefined;
        }

        return targetProject;
    }

    /**
     * Task Tree Blur Handler
     */
    _taskTreeBlurHandler() {
        const that = this;

        that._unfocusTaskTreeItems();
    }

    /**
     * Task Tree change event handler
     * @param {any} event
     */
    _taskTreeChangeHandler(event) {
        const that = this;

        event.stopPropagation();

        if (that._taskAPIManipulation || that._itemIndexClicked !== undefined || that._dragDetails) {
            return;
        }

        that._treeChangeEventFired = true;
        that._selectTask(that._getTaskByTreeIndex(event.detail.selectedIndexes[0]));
        delete that._treeChangeEventFired;
    }

    /**
     * Task Tree expand event handler
     * @param {any} event
     */
    _taskTreeExpandHandler(event) {
        const that = this;

        if (!that._tasks || !that._tasks.length) {
            return;
        }

        const index = event.detail.item.path,
            targetProject = that._getTaskByTreeIndex(index, true);

        if (!targetProject) {
            return;
        }

        if (event.type === 'collapse') {
            //Handle collapse
            that._expandTask(targetProject, false);
        }
        else {
            //Handle expand
            that._expandTask(targetProject, true);
        }
    }

    /**
     * Resets the Timeline by removing all of the cells
     */
    _resetTimeline() {
        const that = this;

        that.$.timelineCellsContainer.innerHTML = '';

        const taskBars = that.$.timelineTasksContainer.children;

        for (let i = 0; i < taskBars.length; i++) {
            delete taskBars[i]._cellStart;
            delete taskBars[i]._cellEnd;
        }
    }

    /**
     * Recreates the timeline and scrolls to the last known position
     * @param {any} lastView
     */
    _refreshTimeline(lastView) {
        const that = this,
            tasks = that._tasks;

        if (!lastView) {
            lastView = that.view;
        }

        //Scroll to last possible position
        const dateInView = that._getDateFromCell(that.scrollLeft, that._getFirstCellObjInView(), lastView);

        //reset the scrollLeft
        that.scrollLeft = 0;

        that._resetTimeline();
        that._createTimelineCells();

        for (let t = 0; t < tasks.length; t++) {
            const task = tasks[t];

            that._createTimelineTaskCells(task);
            that._setTimelineTaskBar(task);
            that._refreshTaskConnections(task);
        }

        that._refresh();
        that._scrollTo(dateInView);
    }

    /**
     * Scrolls to the target date - can be a public method
     * @param {any} date
     */
    _scrollTo(date) {
        const that = this,
            timelineCells = that._timelineCells;
        let left;

        for (let i = 0; i < timelineCells.length; i++) {
            const cell = timelineCells[i],
                cellDate = cell.date;

            switch (that.view) {
                case 'year':
                    if (cellDate.getFullYear() === date.getFullYear() && cellDate.getMonth() === date.getMonth()) {
                        let daysInMonth = new Date(date);

                        daysInMonth.setMonth(date.getMonth() + 1);
                        daysInMonth.setDate(0);

                        daysInMonth = daysInMonth.getDate();
                        left = cell.left + ((date.getDate() - 1) / daysInMonth * cell.width);
                    }

                    break;
                case 'month': {
                    let startDate = new Date(cellDate),
                        endDate = new Date(cellDate);

                    startDate.setDate(startDate.getDate() - startDate.getDay());
                    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()) + 1);
                    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

                    if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                        left = cell.left + (date.getDay() / 7 * cell.width);
                    }

                    break;
                }
                case 'week':
                    if (cellDate.getFullYear() === date.getFullYear() && cellDate.getMonth() === date.getMonth() && cellDate.getDate() === date.getDate()) {
                        left = cell.left + (parseFloat(date.getHours() + '.' + date.getMinutes() + date.getSeconds()) / 24 * cell.width);
                    }
                    break;
                case 'day':
                    if (cellDate.getFullYear() === date.getFullYear() && cellDate.getMonth() === date.getMonth() &&
                        cellDate.getDate() === date.getDate() && cellDate.getHours() === date.getHours()) {
                        left = cell.left + (parseFloat(date.getMinutes() + date.getSeconds()) / 60 * cell.width);
                    }

                    break;
            }

            if (left !== undefined) {
                that.scrollLeft = left;
                return;
            }
        }
    }

    /**
     * Updates the connection of the related tasks(start and end tasks)
     * @param {any} connection
     */
    _updateConnection(connectionId, deleteTask) {
        const that = this;

        function removeConnectionObject(startTask, endTaskId, type) {
            const startTaskConnections = startTask.connections;
            let isConnectionRetained;

            //Check if exists
            for (let c = 0; c < startTaskConnections.length; c++) {
                let targetId = startTaskConnections[c].target;

                if (typeof targetId === 'string') {
                    let indexFromId = tasks.indexOf(tasks.find((task) => task.id === targetId));

                    if (indexFromId >= 0) {
                        targetId = indexFromId
                    }
                }

                if (targetId === endTaskId) {
                    if (!deleteTask && type !== undefined && startTaskConnections[c].type === type && !isConnectionRetained) {
                        isConnectionRetained = true;
                        continue;
                    }

                    startTaskConnections.splice(c, 1);
                }
            }

            return isConnectionRetained;
        }

        connectionId += '';
        connectionId = connectionId.split('-');

        const tasks = that._tasks,
            startTaskId = parseInt(connectionId[0]),
            endTaskId = parseInt(connectionId[1]),
            connectionType = parseInt(connectionId[2]),
            startTask = tasks[startTaskId],
            endTask = tasks[endTaskId];

        if (!startTask) {
            return;
        }

        if (!endTask) {
            startTask.connections = [];
            return;
        }

        if (connectionType === undefined) {
            return;
        }

        //remove the connection for the starTask
        const isConnectionRetained = removeConnectionObject(startTask, endTaskId, connectionType);

        //remove the connection from the related task
        removeConnectionObject(tasks[endTaskId], startTaskId);

        if (deleteTask || isConnectionRetained) {
            return;
        }

        startTask.connections.push({ target: endTaskId, type: connectionType });

        //check for a duplicate in the endTask
        const duplicateConnection = endTask.connections.find(con => that._getTaskIndexById(con.target) === startTaskId && con.type === connectionType);

        if (duplicateConnection) {
            endTask.connections.splice(endTask.connections.indexOf(duplicateConnection), 1);
        }
    }

    /**
     * Creates the cells used for the Timeline
     */
    _createTimelineCells() {
        const that = this,
            tasks = that._tasks,
            elementDateStart = that.properties['dateStart'].value,
            elementDateEnd = that.properties['dateEnd'].value;
        let dateStart, dateEnd;

        if (elementDateStart) {
            dateStart = elementDateStart;
        }

        if (elementDateEnd) {
            dateEnd = elementDateEnd;
        }

        if (tasks.length > 0) {
            let taskDateStart = tasks[0].dateStart,
                taskDateEnd = tasks[0].dateEnd;

            for (let t = 0; t < tasks.length; t++) {
                if (!tasks[t].dateStart || !tasks[t].dateEnd) {
                    continue;
                }

                if (!taskDateStart) {
                    taskDateStart = tasks[t].dateStart;
                }

                if (!taskDateEnd) {
                    taskDateEnd = tasks[t].dateEnd;
                }

                if (taskDateStart.getTime() > tasks[t].dateStart.getTime()) {
                    taskDateStart = tasks[t].dateStart;
                }

                if (taskDateEnd.getTime() < tasks[t].dateEnd.getTime()) {
                    taskDateEnd = tasks[t].dateEnd;
                }
            }

            if (!dateStart || dateStart.getTime() > taskDateStart.getTime()) {
                dateStart = taskDateStart;
            }

            if (!dateEnd || dateEnd.getTime() < taskDateEnd.getTime()) {
                dateEnd = taskDateEnd;
            }
        }

        if (!dateStart || !dateEnd) {
            return;
        }

        //Validate the dates according to min/max
        dateStart = that._minMaxDateValidator(dateStart);
        dateEnd = that._minMaxDateValidator(dateEnd);

        that._createTimelineHeader(dateStart, that._getCellsCount(dateStart, dateEnd));
    }

    /**
     * Returns the nubmer of cells that should be created depending on the view
     * @param {any} dateStart
     * @param {any} dateEnd
     * @param {any} view
     */
    _getCellsCount(dateStart, dateEnd, view) {
        let cellsCount, years, months, weeks, days, hours,
            dayStart = new Date(dateStart),
            dayEnd = new Date(dateEnd);

        //Years between two dates
        const yearDifference = dateEnd.getFullYear() - dateStart.getFullYear();

        years = cellsCount = Math.round(yearDifference) + 1;

        if (view === 'year') {
            return { year: years };
        }

        //Resetting the time while preserving the hours
        dayStart.setHours(dayStart.getHours(), 0, 0, 0);
        dayEnd.setHours(dayEnd.getHours(), 0, 0, 0);

        hours = Math.floor((dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60));

        if (hours > 0) {
            let date = new Date(dayStart);

            hours = 1;

            //Big performance optimization for cases where the year interval is big
            if (dayStart.getFullYear() !== dayEnd.getFullYear()) {
                let firstDateEnd = new Date(dayStart.getFullYear() + 1, 0, 1, 0, 0, 0, 0);

                //Hours till the end of the year
                while (date.getTime() !== firstDateEnd.getTime()) {
                    const currentTime = date.getTime();

                    date.setHours(date.getHours() + 1);

                    //Safari bug fix. When daylight date is reached Safari doesn't change the date. The result is an infinite loop
                    if (date.getTime() === currentTime) {
                        date.setHours(date.getHours() + 2);
                    }

                    hours++;
                }

                const yearsTillEnd = dayEnd.getFullYear() - firstDateEnd.getFullYear();

                for (let y = 0; y < yearsTillEnd; y++) {
                    const year = date.getFullYear();

                    //-1 to avoid counting twice the start hour from every year
                    hours += (((year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) ? 366 : 365) * 24) - 1;
                    date.setFullYear(year + 1);
                }
            }

            //Standart method for finding number of hours. Slow with many years. 
            while (date.getTime() !== dayEnd.getTime()) {
                const currentTime = date.getTime();

                date.setHours(date.getHours() + 1);

                //Safari bug fix. When daylight date is reached Safari doesn't change the date. The result is an infinite loop
                if (date.getTime() === currentTime) {
                    date.setHours(date.getHours() + 2);
                }

                hours++;
            }
        }

        //const manualCalculation = function () {
        //    let hours = 1;
        //    let date = new Date(dayStart);

        //    while (date.getTime() !== dayEnd.getTime()) {
        //        date.setHours(date.getHours() + 1);
        //        hours++;
        //    }

        //    return hours;
        //}();

        if (view === 'hour') {
            return { hour: hours };
        }

        //Days between two dates
        dayStart.setHours(0, 0, 0, 0);
        dayEnd.setHours(23, 59, 59, 999);

        days = cellsCount = Math.round((dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60 * 24));

        if (view === 'day') {
            return { day: days };
        }

        dayStart.setDate(dayStart.getDate() - dayStart.getDay());
        dayEnd.setDate(dayEnd.getDate() + 6 - dayEnd.getDay());

        //Weeks between two dates
        weeks = cellsCount = Math.round((dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60 * 24 * 7));


        if (view === 'week') {
            return { week: weeks };
        }

        //NOTE: if view is 'month' the full week must be shown. Which means all months for visible weeks should be shown
        if (this.view === 'month') {
            if (dateStart.getDay() !== 0) {
                dateStart = new Date(dateStart.setDate(dateStart.getDate() - dateStart.getDay()));
            }

            if (dateEnd.getDay() !== 6) {
                dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 6 - dateEnd.getDay()));
            }
        }

        //Months between two dates
        if (dateStart.getFullYear() !== dateEnd.getFullYear()) {
            cellsCount = 12 - dateStart.getMonth();

            const yearEnd = dateEnd.getFullYear();

            for (let y = dateStart.getFullYear() + 1; y <= yearEnd; y++) {
                cellsCount += y === dateEnd.getFullYear() ? dateEnd.getMonth() + 1 : 12;
            }
        }
        else {
            cellsCount = dateEnd.getMonth() - dateStart.getMonth() + 1; // +1 because January is the 0
        }

        months = Math.ceil(cellsCount);

        if (view === 'months') {
            return { month: months };
        }

        return { year: years, month: months, week: weeks, day: days, hour: hours };
    }

    /**
     * Creates the Timeline tasks
     * @param {any} task - a Timeline task
     */
    _createTimelineTask(task, index) {
        const that = this,
            taskBar = that._createTaskBar(task.type),
            isProjectSynchronized = task.type === 'project' && task.synchronized;

        task.disableDrag || (isProjectSynchronized && !task.dragProject) ? taskBar.setAttribute('disable-drag', '') : taskBar.removeAttribute('disable-drag');
        task.disableResize || isProjectSynchronized ? taskBar.setAttribute('disable-resize', '') : taskBar.removeAttribute('disable-resize');

        if (task.id) {
            taskBar.id = task.id;
        }
        else {
            taskBar.id = 'ganttTask' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        that._createTimelineTaskCells(task, index);

        taskBar._task = task;
        taskBar.classList.add('smart-timeline-task');

        if (task.class) {
            taskBar.classList.add(task.class);
        }

        //Accessibility
        //Formats a date to ISO format, 'yyyy-mm-dd'
        const dateFormatter = (date) => date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) +
            '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

        taskBar.setAttribute('aria-label', task.label + ' Start date: ' + dateFormatter(task.dateStart) + ', End date: ' + dateFormatter(task.dateEnd));
        taskBar.setAttribute('aria-selected', 'false');

        that.$.timelineTasksContainer.insertBefore(taskBar, that.$.timelineTasksContainer.children[index]);
    }

    /**
     * Creates the cells for a timeline task
     * @param {any} task - a task from the dataSource
     */
    _createTimelineTaskCells(task, index) {
        const that = this,
            taskElementWrapper = document.createElement('div');

        if (task.project && !that._isTaskExpanded(task)) {
            taskElementWrapper.classList.add('smart-visibility-hidden');
        }

        taskElementWrapper._task = task;
        taskElementWrapper.classList.add('smart-timeline-task-cell');

        that.$.timelineCellsContainer.insertBefore(taskElementWrapper, that.$.timelineCellsContainer.children[index]);
    }

    /**
     * Creates Timeline cells
     * @param {any} count - number of cells to create
     * @param {any} startDate - date for the first cell
     * @param {any} type - type of cell
     */
    _createCells(count) {
        let cell,
            fragment = document.createDocumentFragment();

        for (let c = 0; c < count; c++) {
            cell = document.createElement('div');
            cell.classList.add('smart-timeline-view-cell');

            //Accesibility
            cell.setAttribute('role', 'columnheader');
            fragment.appendChild(cell);
        }

        return fragment;
    }

    /**
     * Returns the count of timeline cells that should be rendered/visible
     */
    _getTimelineVisibleCellsCount() {
        const that = this,
            timelineCells = that._timelineCells;

        if (!timelineCells) {
            return;
        }

        const firstCellObj = that._getFirstCellObjInView(),
            firstCellOffset = 1 - (firstCellObj.left + firstCellObj.width - that.scrollLeft) / timelineCells[0].width;

        return Math.ceil(parseFloat((that.$.timeline.offsetWidth / firstCellObj.width).toFixed(2)) + firstCellOffset);
    }

    /**
     * Returns the number of header details view cells that should be rendered
     */
    _getHeaderVisibleCellsCount() {
        const that = this;

        if (!that._timelineHeaderCells) {
            return;
        }

        const scrollLeft = Math.abs(that.scrollLeft),
            offsetWidth = that.$.timeline.parentElement.offsetWidth,
            timelineViewCells = that._timelineHeaderCells;
        let headerDetailsObjCount = 0;

        for (let i = 0; i < timelineViewCells.length; i++) {
            const cell = timelineViewCells[i];

            if (cell.left + cell.width > scrollLeft && cell.left < offsetWidth + scrollLeft) {
                headerDetailsObjCount++;
            }
        }

        return headerDetailsObjCount;
    }

    /**
     * Refreshes the content of the header cells
     */
    _refreshHeaderDate() {
        const that = this,
            type = that._getCellsViewType(),
            //scrollLeft = that.$.scrollViewer.scrollLeft,
            scrollLeft = that.scrollLeft,
            cells = that.$.timelineViewCells.children,
            cellsObj = that._timelineCells;
        let startTimelineCellIndex;

        //Update the content of the additional header
        that._refreshHeaderDetailsDate();

        //Get the first visible timeline cell
        for (let i = 0; i < cellsObj.length; i++) {
            const cellObj = cellsObj[i];

            if (scrollLeft <= cellObj.left + cellObj.width) {
                startTimelineCellIndex = i;
                break;
            }
        }

        //Update the content of the header cells
        for (let c = 0; c < cells.length; c++) {
            const cell = cells[c],
                cellObj = cellsObj[startTimelineCellIndex];

            if (!cellObj) {
                break;
            }

            const date = cellObj.date;

            cell._date = new Date(date);
            cell.innerHTML = that._getDateString(new Date(date), type);
            cell.style.width = cellObj.width + 'px';
            cell.style[that.rightToLeft ? 'right' : 'left'] = cellObj.left + 'px';
            cellObj.weekend ? cell.setAttribute('weekend', '') : cell.removeAttribute('weekend');
            cellObj.nonworking ? cell.setAttribute('nonworking', '') : cell.removeAttribute('nonworking');
            startTimelineCellIndex++;
        }
    }

    /**
     * Returns the Date string according to the view
     * @param {any} date
     * @param {any} type
     */
    _getDateString(date, type, isHeaderDetailsContainer) {
        const that = this,
            dateFormat = ['2-digit', 'numeric'][that.dayFormat] || 'numeric';

        if (that.timelineHeaderFormatFunction) {
            return that.timelineHeaderFormatFunction(date, type, isHeaderDetailsContainer);
        }

        if (type === 'year') {
            return date.toLocaleDateString(that.locale, { year: that.yearFormat });
        }
        else if (type === 'month') {
            return date.toLocaleDateString(that.locale, { month: that.monthFormat });
        }
        else if (type === 'week') {
            return that.weekFormat !== 'numeric' && isHeaderDetailsContainer ?
                date.toLocaleDateString(that.locale, { day: dateFormat, month: that.monthFormat, year: that.yearFormat }) : that._getWeekNumber(date);
        }
        else if (type === 'day') {
            return date.toLocaleDateString(that.locale, that.view === 'day' ?
                { day: dateFormat, month: that.monthFormat, year: that.yearFormat } :
                (['long', 'short', 'narrow'].indexOf(that.dayFormat) > -1 ? { weekday: that.dayFormat } : { day: that.dayFormat }));
        }
        else if (type === 'hour') {
            return that.hourFormat === 'default' ?
                date.toLocaleTimeString(that.locale, { hour12: false }) : date.toLocaleDateString(that.locale, { hour: that.hourFormat });
        }
    }

    /**
     * Sets the content of the header details cells
     * @param {any} startCellIndex
     */
    _refreshHeaderDetailsDate() {
        const that = this,
            view = that.view,
            //scrollLeft = that.$.scrollViewer.scrollLeft,
            scrollLeft = that.scrollLeft,
            headerDetailsCells = that.$.timelineViewDetails.children,
            headerCells = that._timelineHeaderCells;
        let startCellIndex

        //Get the first visible timeline cell
        for (let i = 0; i < headerCells.length; i++) {
            const cellObj = headerCells[i];

            if (scrollLeft <= cellObj.left + cellObj.width) {
                startCellIndex = i;
                break;
            }
        }

        //const date = new Date(headerCells[startCellIndex].date);

        for (let i = 0; i < headerDetailsCells.length; i++) {
            const cellObj = headerCells[startCellIndex],
                cell = headerDetailsCells[i];
            let date = new Date(cellObj.date);

            if (that.view === 'week') {
                date.setDate(date.getDate() - date.getDay());
            }

            date = new Date(Math.max(cellObj.date.getTime(), date.getTime()));

            cell._date = date;
            cell.innerHTML = that._getDateString(date, view, true);
            cell.style[that.rightToLeft ? 'right' : 'left'] = cellObj.left + 'px';
            cell.style.width = cellObj.width + 'px';
            startCellIndex++;
        }
    }

    /**
    * Returns the number of the week.
    */
    _getWeekNumber(date) {
        let newYear = new Date(date.getFullYear(), 0, 1),
            dayNumber = Math.round((date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1,
            day = newYear.getDay(), //the day of week the year begins on
            weeknum;

        day = day >= 0 ? day : day + 7;

        //if the year starts before the middle of a week
        if (day < 4) {
            weeknum = Math.floor((dayNumber + day - 1) / 7) + 1;

            if (weeknum > 52) {
                newYear = new Date(date.getFullYear() + 1, 0, 1);
                day = newYear.getDay();
                day = day >= 0 ? day : day + 7;

                //if the next year starts before the middle of the week, it is week #1 of that year
                weeknum = day < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.round((dayNumber + day - 1) / 7);
        }

        return weeknum;
    }

    /**
     * Converts the duration of a task to miliseconds or back to it's original value according to durationUnit.
     * @param {number} duration - a number representing the time duration
     * @param {boolean} toDurationUnit - a flag inidicating whether the returned value should be according to durationUnit property or in not
     */
    _convertDuration(duration, toDurationUnit) {
        if (!duration) {
            return 0;
        }

        let milSeconds;

        switch (this.durationUnit) {
            case 'day':
                milSeconds = 1000 * 60 * 60 * 24;
                break;
            case 'hour':
                milSeconds = 1000 * 60 * 60;
                break;
            case 'minute':
                milSeconds = 1000 * 60;
                break;
            case 'second':
                milSeconds = 1000;
                break;
            case 'milisecond':
                return duration;
            case 'week':
                milSeconds = 1000 * 60 * 60 * 24 * 7;
        }

        return toDurationUnit ? duration / milSeconds : duration * milSeconds;
    }

    /**
     * Creates a taskBar DIV element
     * @param {any} type
     */
    _createTaskBar(type) {
        const taskBar = document.createElement('div');

        taskBar.classList.add('smart-timeline-task');
        taskBar.classList.add(type);

        taskBar.innerHTML = type === 'milestone' ?
            `<div class="smart-task-container" aria-hidden="true">
                <div class="smart-task-connection-point start"></div>
                <div class="smart-timeline-task-fill"></div>
                <div class="smart-task-connection-point end"></div>
            </div>`
            :
            `<div class="smart-task-container" aria-hidden="true">
                <div class="smart-task-connection-point start"></div>
                <div class="smart-timeline-task-fill">
                    <div class="smart-timeline-task-progress"></div>
                </div>
                <div class="smart-timeline-task-progress-thumb"></div>
                <div class="smart-timeline-task-label"></div> 
                <div class="smart-task-connection-point end"></div>
            </div>`;

        return taskBar;
    }

    /**
     * Sets the header section
     */
    _createTimelineHeader(dateStart, cellsCount) {
        const that = this,
            type = that._getCellsViewType();

        if (!dateStart) {
            const monthCells = that.$.timelineViewCells.children;

            if (monthCells.length === 0) {
                return;
            }

            dateStart = monthCells[0]._date;
        }

        if (that.view !== 'day') {
            dateStart.setHours(0, 0, 0, 0);
        }

        //Avoids recreating the timeline objects when unnecessary
        if (that.$.timelineContent.offsetWidth === that.$.timeline.offsetWidth && that._timelineCells && that._timelineCells[0] &&
            that._timelineCells[0].date.getTime() === dateStart.getTime() && that._timelineCells.length === cellsCount[that._getCellsViewType()]) {

            //Timeline scrollBars refresh
            that._refresh();
            return;
        }

        //reset the width of the timeline header
        that.$.timelineContent.style.width = that.$.timelineAnimationContainer.style.width = '';

        //Creates the cell objects
        that._createTimelineCellsObj(dateStart, cellsCount);
        that._createTimelineHeaderCellsObj(dateStart, cellsCount);

        //Creates the Header View Details cells
        that.$.timelineViewDetails.innerHTML = '';
        that.$.timelineViewDetails.appendChild(that._createCells(that._getHeaderVisibleCellsCount()));

        //Creates View Header cells
        that.$.timelineViewCells.innerHTML = '';
        that.$.timelineViewCells.appendChild(that._createCells(that._getTimelineVisibleCellsCount()));

        //Refreshes the content of the header
        that._refreshHeaderDate();

        //Set size to the timeline
        that.$.timelineContent.style.width = that.$.timelineAnimationContainer.style.width =
            Math.max(cellsCount[type] * that._timelineCells[0].width, that.$.timeline.parentElement.offsetWidth) + 'px';

        //Timeline scrollBars refresh
        that._refresh();

        //Update the scrollLeft after clearing the timeline because it was reset
        if (that.scrollLeft) {
            that.$.timeline.scrollLeft = that._getScrollLeft(that.scrollLeft);
        }

        //Update the scrollTop after clearing the timeline because it was reset
        if (that.scrollTop) {
            that.$.timelineContent.scrollTop = that.scrollTop;
        }
    }

    /**
     * Returns the type of the header cells according to the view
     */
    _getCellsViewType() {
        switch (this.view) {
            case 'year':
                return 'month';
            case 'month':
                return 'week';
            case 'week':
                return 'day';
            case 'day':
                return 'hour';
        }
    }

    /**
     * Creates the cell objects ( virtual cells)
     * @param {any} startDate - the date for the first cell
     * @param {any} cellsCount - the number of cells to be created
     * @param {any} type - type of date for the cells
     */
    _createTimelineCellsObj(startDate, cellsCount) {
        const that = this,
            type = that._getCellsViewType();

        cellsCount = cellsCount[type];

        const computedStyle = window.getComputedStyle(that),
            viewSize = that.$.timeline.parentElement.offsetWidth;
        let cellWidth = Math.max(parseFloat(computedStyle.getPropertyValue('--smart-gantt-chart-timeline-cell-size')) || 0,
            parseFloat(computedStyle.getPropertyValue('--smart-gantt-chart-timeline-cell-min-size') || 0)),
            //cellBorderWidth = parseFloat(computedStyle.getPropertyValue('--smart-gantt-chart-timeline-column-border-width')) || 0,
            left = 0,
            date = new Date(startDate);

        if (cellsCount * cellWidth < viewSize) {
            cellWidth = viewSize / cellsCount;
        }

        cellWidth = parseFloat(cellWidth.toFixed(2));

        that._timelineCells = [];

        //let endDate;

        for (let i = 0; i < cellsCount; i++) {
            const cellObj = { left: left, width: cellWidth };

            if (type === 'year') {
                date.setMonth(0);
                cellObj.date = new Date(date);
                date.setFullYear(date.getFullYear() + 1);
            }
            else if (type === 'month') {
                //if first day is non working set it to 2 or whatever
                date.setDate(1);
                cellObj.date = new Date(date);
                date.setMonth(date.getMonth() + 1);
            }
            else if (type === 'week') {

                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() - date.getDay());
                cellObj.date = new Date(date);
                date.setDate(date.getDate() + 7);
            }
            else if (type === 'day') {
                if (that.nonworkingDays.indexOf(date.getDay()) > -1) {
                    cellObj.nonworking = true;
                }

                date.setHours(0, 0, 0, 0);
                cellObj.date = new Date(date);
                date.setDate(date.getDate() + 1);
                cellObj.weekend = cellObj.date.getDay() === 0 || cellObj.date.getDay() === 6;
            }
            else if (type === 'hour') {
                if (that.nonworkingHours.indexOf(date.getHours()) > -1 || that.nonworkingDays.indexOf(date.getDay()) > -1) {
                    cellObj.nonworking = true;
                }

                date.setHours(date.getHours(), 0, 0, 0);
                cellObj.date = new Date(date);

                const currentTime = date.getTime();

                date.setHours(date.getHours() + 1);

                //Safari bug fix
                if (currentTime === date.getTime()) {
                    date.setHours(date.getHours() + 2);
                }

                cellObj.weekend = cellObj.date.getDay() === 0 || cellObj.date.getDay() === 6;
            }

            that._timelineCells.push(cellObj);
            left = parseFloat((left + cellWidth).toFixed(2));
        }
    }

    /**
     * Creates the header view cell objects
     * @param {any} dateStart
     * @param {any} cellsCount
     */
    _createTimelineHeaderCellsObj(dateStart, cellsCount) {
        const that = this,
            view = that.view;
        let lastCellIndex = 0,
            //date = new Date(that._timelineCells[0].date);
            date = new Date(dateStart);

        cellsCount = cellsCount[view];

        that._timelineHeaderCells = [];

        for (let i = 0; i < cellsCount; i++) {
            const cellObj = {};

            cellObj.date = new Date(date);

            switch (view) {
                case 'year':
                    date.setFullYear(date.getFullYear() + 1);
                    break;
                case 'month':
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    break;
                case 'week':
                    date.setDate(date.getDate() + 7);
                    break;
                case 'day':
                    date.setDate(date.getDate() + 1);
                    break;
            }

            lastCellIndex = that._refreshViewDetailCell(cellObj, lastCellIndex, i);

            that._timelineHeaderCells.push(cellObj);
        }
    }

    /**
     * Validates a date according to element's min/max property
     * @param {any} date
     */
    _minMaxDateValidator(date) {
        if (!date || isNaN(date.getTime())) {
            return date;
        }

        const that = this,
            min = new Date(that.min),
            max = new Date(that.max);

        if (min) {
            date = new Date(Math.max(min.getTime(), date.getTime()))
        }

        if (max) {
            date = new Date(Math.min(max.getTime(), date.getTime()));
        }

        return date;
    }

    /**
     * Date validator for the startDate, endDate properties
     */
    _dateValidator(oldValue, newValue) {
        const that = this;

        if (newValue instanceof Date) {
            return that._minMaxDateValidator(newValue);
        }
        else if (Smart.Utilities.DateTime && newValue instanceof Smart.Utilities.DateTime) {
            return that._minMaxDateValidator(newValue.toDate());
        }
        else if (typeof (newValue) === 'string') {
            if (newValue.trim() === 'new Date()' || newValue.trim() === 'new Smart.Utilities.DateTime()') {
                return that._minMaxDateValidator(new Date());
            }

            let regex = /(\d+[,-.\/]{1}\s*\d+[,-.\/]{1}\s*\d+)/, newDate;

            if (regex.test(newValue)) {
                const date = regex.exec(newValue)[0].replace(/[,-.\/]/g, ',').split(',');

                if (date.length === 3) {
                    newDate = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));

                    //regex for the time
                    regex = /\d+:\d+:\d+/;

                    if (regex.test(newValue)) {
                        const time = regex.exec(newValue)[0].split(':');

                        newDate.setHours(time[0] || 0, time[1] || 0, time[2] || 0);
                    }

                    newValue = newDate;
                }
            }
        }
        else {
            return that._minMaxDateValidator(oldValue);
        }

        return that._minMaxDateValidator(new Date(newValue));
    }

    /**
     * Returns the min/max left position of the taskBar according to the dateName. 
     * @param {any} task - timeline task
     * @param {any} dateName - dateName can be dateStart or dateEnd
     */
    _getTaskBarPositionLimits(task, dateName) {
        const that = this;

        function getLimit(date) {
            const dateCell = that._getTimelineTaskCellByDate(task, date);

            if (dateCell) {
                return dateCell.left + that._getTimelineTaskOffset(dateCell, date) || 0;
            }
        }

        return { min: getLimit(task._task['min' + dateName]), max: getLimit(task._task['max' + dateName]) };
    }

    /**
     * Returns the offsetLeft of a Timeline task according to the date by passing the cell that the date belongs to.
     * @param {any} dateCell - a timeline cell
     * @param {any} date - a random date that's in the range of the dateCell's date.
     */
    _getTimelineTaskOffset(dateCell, date) {
        const that = this;

        if (!dateCell) {
            return;
        }

        let maxDate, offset;

        switch (that.view) {
            case 'year':
                {
                    const timeOffsetInDays = ((date.getHours() / 24) + (date.getMinutes() / (60 * 24)) + (date.getSeconds() / (60 * 60 * 24)));

                    maxDate = new Date(dateCell.date.getFullYear(), dateCell.date.getMonth() + 1, 0);
                    offset = (date.getDate() - 1 + timeOffsetInDays) / maxDate.getDate() * dateCell.width;
                    break;
                }
            case 'month':
                offset = (date.getDay() / 7) * dateCell.width;
                break;
            case 'week':
                offset = parseFloat(date.getHours() + date.getMinutes() / 60 + date.getSeconds() / (60 * 60)) / 24 * dateCell.width;
                break;
            case 'day':
                offset = parseFloat(date.getMinutes() + date.getSeconds() / 60) / 60 * dateCell.width;
                break;
        }

        return offset;
    }

    /**
     * Returns the min/max Dates of a TaskBar
     * @param {any} taskBar
     * @param {any} resizeSide - the resizing side that is selected
     */
    _getTaskBarSizeLimits(timelineTask, resizeSide) {
        const that = this,
            getTaskRange = that._getTaskBarDateRange(timelineTask); //TODO: Get them from the Task itself instead of calculting them again
        let possibleDuration,
            timeZoneOffset = 0,
            minDuration = that._convertDuration(timelineTask._task.minDuration) || that._getMinDuration(timelineTask, resizeSide),
            maxDuration = that._convertDuration(timelineTask._task.maxDuration);

        function getSizeLimit(duration, isMin) {
            if (!duration) {
                return;
            }

            let dayOffset, dateStart;

            if ((resizeSide === 'left' && !that.rightToLeft) || (resizeSide === 'right' && that.rightToLeft)) {
                duration = -1 * duration;
                dateStart = getTaskRange.dateEnd;
            }
            else {
                dateStart = getTaskRange.dateStart;
            }

            if (isMin && Math.abs(dayOffset) === Math.abs(duration)) {
                dayOffset = 0;
            }

            //let endDate = new Date(dateStart.getTime() + duration);
            let endDate = that._getTaskWorkingDateEnd({ dateStart: dateStart }, duration);

            const time = endDate.getTime() + (endDate.getTimezoneOffset() - dateStart.getTimezoneOffset()) * 60 * 1000,
                dateCell = that._getTimelineTaskCellByDate(timelineTask, new Date(time));

            if (!dateCell) {
                return;
            }

            const offset = that._getTimelineTaskOffset(dateCell, new Date(time));

            //NOTE: In RTL mode, dateCell.left represents the right position, while in LTR is left
            return that.rightToLeft ?
                (resizeSide === 'left' ? (offset - (that.$.timelineContent.offsetWidth - timelineTask.offsetLeft - timelineTask.offsetWidth - dateCell.left)) :
                    ((that.$.timelineContent.offsetWidth - timelineTask.offsetLeft - dateCell.left) - offset)) :
                (resizeSide === 'left' ? timelineTask.offsetLeft + timelineTask.offsetWidth - dateCell.left - offset : dateCell.left - timelineTask.offsetLeft + offset);
        }

        if ((resizeSide === 'left' && !that.rightToLeft) || (resizeSide === 'right' && that.rightToLeft)) {
            const maxDateStart = timelineTask._task.maxDateStart,
                minDateStart = timelineTask._task.minDateStart;

            if (minDateStart) {
                timeZoneOffset = (minDateStart.getTimezoneOffset() - getTaskRange.dateEnd.getTimezoneOffset()) * 60 * 1000;
                possibleDuration = Math.abs(minDateStart.getTime() - getTaskRange.dateEnd.getTime()) + timeZoneOffset;
                maxDuration = maxDuration ? Math.min(possibleDuration, maxDuration) : possibleDuration;
            }

            if (maxDateStart) {
                timeZoneOffset = (maxDateStart.getTimezoneOffset() - getTaskRange.dateEnd.getTimezoneOffset()) * 60 * 1000;
                possibleDuration = Math.abs(maxDateStart.getTime() - getTaskRange.dateEnd.getTime()) + timeZoneOffset;
                minDuration = minDuration ? Math.max(possibleDuration, minDuration) : possibleDuration;
            }
        }
        else {
            const maxDateEnd = timelineTask._task.maxDateEnd,
                minDateEnd = timelineTask._task.minDateEnd;

            if (minDateEnd) {
                timeZoneOffset = (minDateEnd.getTimezoneOffset() - getTaskRange.dateStart.getTimezoneOffset()) * 60 * 1000;
                possibleDuration = Math.abs(minDateEnd.getTime() - getTaskRange.dateStart.getTime()) + timeZoneOffset;
                minDuration = minDuration ? Math.max(possibleDuration, minDuration) : possibleDuration;
            }

            if (maxDateEnd) {
                timeZoneOffset = (maxDateEnd.getTimezoneOffset() - getTaskRange.dateStart.getTimezoneOffset()) * 60 * 1000;
                possibleDuration = Math.abs(maxDateEnd.getTime() - getTaskRange.dateStart.getTime()) + timeZoneOffset;
                maxDuration = maxDuration ? Math.min(possibleDuration, maxDuration) : possibleDuration;
            }
        }

        if (maxDuration) {
            minDuration = Math.min(minDuration, maxDuration);
        }

        return { min: getSizeLimit(minDuration, true), max: getSizeLimit(maxDuration) };
    }

    /**
     * Returns the min duration of a cell according to hte CSS variable and the view
     * @param {any} timelineTask
     * @param {any} resizeSide
     */
    _getMinDuration(timelineTask, resizeSide) {
        const that = this,
            minSize = parseFloat(getComputedStyle(that).getPropertyValue('--smart-gantt-chart-timeline-task-min-width')) || 0;

        if (!minSize || !that._timelineCells || that._timelineCells.length === 0) {
            return;
        }

        const task = timelineTask._task;
        let dateStart, offsetLeft, operator = 1;

        if (that.rightToLeft) {
            offsetLeft = parseFloat(timelineTask.style.right) || (that.$.timelineContent.offsetWidth - timelineTask.offsetLeft - timelineTask.offsetWidth);
        }
        else {
            offsetLeft = parseFloat(timelineTask.style.left) || timelineTask.offsetLeft;
        }

        if (resizeSide === 'left') {
            dateStart = task.dateEnd;
            offsetLeft += (parseFloat(timelineTask.style.width) || timelineTask.offsetWidth);
            operator = -1;
        }
        else {
            dateStart = task.dateStart;
        }

        //find the timeline cell for the minDate
        const minOffsetLeft = offsetLeft + operator * minSize;
        let targetCell;

        for (let i = 0; i < that._timelineCells.length; i++) {
            const timelineCell = that._timelineCells[i];

            if (minOffsetLeft < timelineCell.left) {
                break;
            }

            targetCell = timelineCell;
        }

        const minDate = that._getDateFromCell(minOffsetLeft, targetCell);

        if (!minDate) {
            return;
        }

        return Math.abs(dateStart.getTime() - minDate.getTime());
    }

    /**
     * Creates a delimiter for the task bar
     */
    _createDelimiter(name, resizeSide) {
        const that = this,
            limit = name.slice(0, 3),
            delimiter = document.createElement('div');

        delimiter.classList.add('smart-task-bar-limitter-' + name);

        if (name.indexOf('date') > -1) {
            if (!this._dragDetails[limit].left) {
                return;
            }

            const taskBar = that._dragDetails.timelineTask,
                timelineTaskCells = that.$.timelineCellsContainer.children[that._tasks.indexOf(taskBar._task)];

            if (limit.indexOf('max') > -1) {
                delimiter.style.width = (timelineTaskCells.offsetWidth - that._dragDetails[limit].left - taskBar.offsetWidth) + 'px';
            }
            else {
                delimiter.style.width = that._dragDetails[limit].left + 'px';
            }

        }
        else {
            if (!this._dragDetails[limit].width) {
                return;
            }

            delimiter.style[resizeSide === 'left' ? 'right' : 'left'] = that._dragDetails[limit].width + 'px';
        }

        return delimiter;
    }

    /**
     * Double click handler
     * @param {any} event
     */
    _doubleClickHandler(event) {
        const that = this;
        let eventTarget = event.target;

        if (that.shadowRoot && eventTarget === that) {
            eventTarget = event.composedPath()[0];
        }

        let target = eventTarget.closest ? eventTarget.closest('.smart-task-connection') : undefined;

        if (target) {
            that._openPopupWindow(target);
            return;
        }

        target = eventTarget.closest('.smart-timeline-task') || eventTarget.closest('.smart-task-label-container') || eventTarget.closest('.smart-tree-item-label-container');

        if (target) {
            if (target.classList.contains('smart-timeline-task')) {
                that._openPopupWindow(target);
            }
            else {
                that._openPopupWindow(that.$.timelineTasksContainer.children[that._getTaskItemIndex(target)]);
            }

            return;
        }
    }

    /**
     * Checks for mouse double click on tasks
     */
    _checkDoubleClick(event) {
        const that = this;
        let pressedItem = event.target;

        if (that.shadowRoot && pressedItem === that) {
            pressedItem = event.composedPath()[0];
        }

        //Check for double click
        if (that._dblClickDetails === undefined) {
            that._dblClickDetails = { clicks: 0 };
        }

        clearTimeout(that._dblClickDetails.timeOut);

        if (pressedItem !== that._dblClickDetails.target) {
            that._dblClickDetails.clicks = 0;
        }

        that._dblClickDetails.target = pressedItem;
        that._dblClickDetails.clicks++;

        that._dblClickDetails.timeOut = setTimeout(function () {
            if (that._dblClickDetails) {
                that._dblClickDetails.clicks = 0;
            }
        }, 300);

        if (that._dblClickDetails.clicks === 2) {
            that._doubleClickHandler(event);
            that._dblClickDetails.clicks = 0;
            return true;
        }
    }

    /**
     * Element Down Event Handler
     * @param {any} event
     */
    _downHandler(event) {
        const that = this,
            originalEvent = event.originalEvent,
            target = (that.shadowRoot || that.isInShadowDOM ? originalEvent.composedPath()[0] : originalEvent.target),
            timelineTaskCell = target.closest ? (target.closest('.smart-timeline-task-cell') || target.closest('.smart-timeline-task')) : null;

        event.stopPropagation();

        if (that._dragDetails) {
            //TODO: Terminate all interaction processes like drag/resize, etc
            delete that._dragDetails;
            that._setConnectionFeedback();
            return;
        }

        if (!Smart.Utilities.Core.isMobile && event.button !== 0) {
            return;
        }

        if (!timelineTaskCell) {
            if (target.classList.contains('smart-popup-window-modal')) {
                if (that._popupWindow) {
                    const popupWindows = Object.keys(that._popupWindow);

                    requestAnimationFrame(() => that._popupWindow[popupWindows[popupWindows.length - 1]].focus());
                }

                return;
            }

            if ((target.closest('.smart-tree-item-label-container') && !target.classList.contains('smart-arrow-down')) ||
                target.closest('.smart-task-connection') || target.closest('.smart-task-label-container')) {
                if (that._checkDoubleClick(originalEvent)) {
                    return;
                }
            }

            if (!target.closest('.smart-tree-item-label-container') && !target.closest('smart-scroll-bar')) {
                that._itemIndexClicked = that._getTaskItemIndex(target);
                that._selectTask(that._itemIndexClicked !== undefined ? that._tasks[that._itemIndexClicked] : null);

                //Focus the Tree to use it's key handling
                that.$.taskTree.focus();

                //Prevent Splitter from focusing
                if (that.$.mainSplitter.contains(target)) {
                    originalEvent.preventDefault();
                }
            }

            return;
        }

        const timelineTask = that.$.timelineTasksContainer.children[that._tasks.indexOf(timelineTaskCell._task)],
            task = timelineTask._task;

        if (!task) {
            return;
        }

        //Task-bar Details
        if (timelineTask.getElementsByClassName('smart-timeline-task-fill')[0] || that.$.timeline.hasAttribute('task-bar-hovered')) {
            //Check if Fill of a TaskBar is pressed
            if (target.closest('.smart-timeline-task-fill') || (timelineTask.classList.contains('milestone') && target.closest('.smart-task-container'))) {
                if (that._checkDoubleClick(originalEvent)) {
                    return;
                }
            }

            const taskBarThumb = target.closest('.smart-timeline-task-progress-thumb'),
                pageX = event.pageX - window.pageXOffset,
                pageY = event.pageY - window.pageYOffset;

            that._dragDetails = {};

            that._dragDetails.target = taskBarThumb || target;
            that._dragDetails.timelineTask = timelineTask;
            that._dragDetails.coordinates = { x: pageX, y: pageY };

            const targetRect = (taskBarThumb || timelineTask).getBoundingClientRect();

            that._dragDetails.offset = { x: pageX - targetRect.left, y: pageY - targetRect.top };

            if (taskBarThumb || (!taskBarThumb && task.type === 'project' && task.synchronized && !task.dragProject)) {
                return;
            }

            if (that.resizeHandlesVisibility === 'visible' || (Smart.Utilities.Core.isMobile && that.resizeHandlesVisibility === 'auto')) {
                if (target.closest('.smart-timeline-task-fill')) {
                    that._checkTaskBarResizability(event);
                }
                else {
                    that.$.timeline.removeAttribute('task-bar-hovered');
                }
            }

            if (that.rightToLeft) {
                that._dragDetails.originalPosition = { x: that.$.timelineContent.offsetWidth - (timelineTask.offsetLeft + timelineTask.offsetWidth), y: timelineTask.offsetTop };
            }
            else {
                that._dragDetails.originalPosition = { x: timelineTask.offsetLeft, y: timelineTask.offsetTop };
            }

            that._dragDetails.originalSize = { width: timelineTask.offsetWidth, height: timelineTask.offsetHeight };
            that._dragDetails.min = {};
            that._dragDetails.max = {};

            that._setDragLimits(target);
        }
    }

    /**
     * Document Move Event Handler
     * @param {any} event
     */
    _documentMoveHandler(event) {
        const that = this;

        //Hovers a task
        if (!that._dragDetails || !that._dragDetails.target) {
            let target = event.originalEvent.target;

            if (that.shadowRoot && target === that) {
                target = event.originalEvent.composedPath()[0];
            }

            that._hoverTask(that._getTaskItemIndex(target));

            if (that._hoveredIndex === undefined) {
                that._handleTimelineHover(event);
            }

            that._checkTaskBarResizability(event);
            return;
        }

        //Handles the connection line feedback
        if (that._dragDetails.target.classList.contains('smart-task-connection-point')) {
            that._setConnectionFeedback(event);
            that._handleTimelineHover(event);

            //Handles autoScroll
            that._autoScroll(event);
            return;
        }

        //Handles Task Progress manipulation
        if (that._dragDetails.target.classList.contains('smart-timeline-task-progress-thumb')) {
            that._handleTaskProgressChange(event);
            return;
        }

        //Handles autoScroll
        that._autoScroll(event);

        if (that._autoScrolling) {
            return;
        }

        //Handles Task Bar resizing
        if (that.$.timeline.hasAttribute('task-bar-hovered')) {
            that._handleTaskBarResize(event);
            return;
        }

        //Handles Task bar dragging
        if (that._dragDetails.target.closest('.smart-timeline-task-fill') && that._dragDetails.timelineTask && !that._dragDetails.timelineTask.hasAttribute('disable-drag')) {
            that._handleTaskBarDrag(event);
            return;
        }
    }

    /**
    * Document Up event Handler
    * @param {any} event
    */
    _documentUpHandler(event) {
        const that = this,
            originalEvent = event.originalEvent;
        let target = originalEvent.target;

        //Handle task item selection
        if (that._itemIndexClicked !== undefined) {
            that._itemIndexClicked = undefined;
            return;
        }

        if (!that._dragDetails) {
            return;
        }

        if (that.shadowRoot && target === that) {
            target = originalEvent.composedPath()[0];
        }

        let targetTask;
        const targetTaskBar = that._dragDetails.timelineTask;

        if (targetTaskBar) {
            targetTask = that.$.timelineCellsContainer.children[that._tasks.indexOf(targetTaskBar._task)];
        }

        if (that.hasAttribute('dragged')) {
            that._snapToNearest(targetTaskBar);
            that._checkWorkingDays(targetTaskBar);

            //Refresh the project if any
            that._refreshProject(targetTask._task.project);

            that.removeAttribute('dragged');

            that.$.fireEvent('dragEnd', { dateStart: targetTask._task.dateStart, dateEnd: targetTask._task.dateEnd });

            const taskMinDateLine = targetTask.getElementsByClassName('smart-task-bar-limitter-min-date')[0],
                taskMaxDateLine = targetTask.getElementsByClassName('smart-task-bar-limitter-max-date')[0]

            if (taskMinDateLine) {
                taskMinDateLine.parentElement.removeChild(taskMinDateLine);
            }

            if (taskMaxDateLine) {
                taskMaxDateLine.parentElement.removeChild(taskMaxDateLine);
            }

            that._autoSchedule(targetTaskBar._task);
            that._scrollView.disableSwipeScroll = false;
        }
        else if (that.hasAttribute('progress-change')) {
            that.removeAttribute('progress-change');
            that.$.fireEvent('progressChangeEnd', { taskId: that._tasks.indexOf(targetTask._task), progress: targetTask._task.progress || 0 });
            that._scrollView.disableSwipeScroll = false;
        }
        else if (that.hasAttribute('resized')) {
            that._snapToNearest(targetTaskBar);

            //Refresh the project if any
            that._refreshProject(targetTask._task.project);

            that.removeAttribute('resized');
            that.$.fireEvent('resizeEnd', { dateStart: targetTask._task.dateStart, dateEnd: targetTask._task.dateEnd });
            that._autoSchedule(targetTaskBar._task);
            that._scrollView.disableSwipeScroll = false;
        }
        else if (that.hasAttribute('connecting-task')) {
            const connectionDetails = that._connectTask(event),
                tasks = that._tasks

            that._setConnectionFeedback();

            if (connectionDetails) {
                that.$.fireEvent('connectionEnd', {
                    source: tasks.indexOf(connectionDetails.taskStart),
                    target: tasks.indexOf(connectionDetails.target),
                    type: connectionDetails.type
                });
                that._autoSchedule(connectionDetails.taskStart._task);
            }

            if (Smart.Utilities.Core.isMobile) {
                that._handleTimelineHover(event, true);
                that._scrollView.disableSwipeScroll = false;
            }
        }
        else {
            const taskBar = target.closest('.smart-timeline-task');

            if (taskBar === targetTaskBar) {
                that._selectTask(targetTask._task);
            }
            else {
                that._selectTask();
            }
        }

        if (targetTaskBar) {
            const taskMaxLine = targetTaskBar.getElementsByClassName('smart-task-bar-limitter-max')[0],
                taskMinLine = targetTaskBar.getElementsByClassName('smart-task-bar-limitter-min')[0];

            if (taskMaxLine) {
                taskMaxLine.parentElement.removeChild(taskMaxLine);
            }

            if (taskMinLine) {
                taskMinLine.parentElement.removeChild(taskMinLine);
            }
        }

        delete that._dragDetails;
    }

    /**
     * Element move handler . Important! iOS Safari/Chrome fix, CSS 'touchAction' has no support on iOS
     */
    _moveHandler(event) {
        const that = this;

        if (!Smart.Utilities.Core.isMobile) {
            event.stopPropagation();
        }

        if (that.hasAttribute('dragged') || that.hasAttribute('progress-change')) {
            if (event.originalEvent.type === 'touchmove') {
                event.originalEvent.preventDefault();
            }
        }
    }

    /**
     * Returns the hovered/selected tree task index
     * @param {any} target
     */
    _getTaskItemIndex(target) {
        const that = this;

        if (!target || !target.closest || !(that.shadowRoot || that).contains(target)) {
            return;
        }

        let taskItem = target.closest('.smart-task-label-container');

        if (taskItem) {
            return [].slice.call(taskItem.closest('smart-splitter-item').getElementsByClassName('smart-task-label-container')).indexOf(taskItem);
        }

        taskItem = target.closest('.smart-tree-item-label-container');

        if (taskItem) {
            return [].slice.call(that.$.taskTree.getElementsByClassName('smart-tree-item-label-container')).indexOf(taskItem);
        }
    }

    /**
     * Set hover state to the Task Tree section
     * @param {any} index - index of the row to be hovered
     */
    _hoverTask(index) {
        const that = this;

        if (that._hoveredIndex === index) {
            return;
        }

        const labelContainers = that.$.treeSplitter.querySelectorAll('smart-tree-item, smart-tree-items-group, .smart-task-label-container');

        //Remove hovered state from all items
        for (let i = 0; i < labelContainers.length; i++) {
            labelContainers[i].removeAttribute('hover');
        }

        if (index === undefined || index < 0) {
            that._hoveredIndex = undefined;
            that._handleTimelineHover({ target: that });
            return;
        }

        if (Smart.Utilities.Core.isMobile || !that.taskColumns.length) {
            return;
        }

        const taskSplitterItems = that.$.treeSplitter._items;

        //set hover state
        for (let i = 0; i < taskSplitterItems.length; i++) {
            const taskSplitterItem = taskSplitterItems[i];
            let items;

            if (taskSplitterItem === that.$.taskTreeSplitterItem) {
                items = [].slice.call(taskSplitterItem.querySelectorAll('smart-tree-item, smart-tree-items-group'));
            }
            else {
                items = [].slice.call(taskSplitterItem.getElementsByClassName('smart-task-label-container'));
            }

            if (items[index]) {
                items[index].setAttribute('hover', '');
            }
        }

        that._hoveredIndex = index;

        //Set hover state to the Timeline Task as well
        that._handleTimelineHover({ target: that.$.timelineTasksContainer.children[index] });
    }

    /**
     * Checks for nonworkingdays/nonworkinghours after drag operation
     * @param {any} target
     */
    _checkWorkingDays(target) {
        const that = this;

        if (!that._dragDetails._taskDuration && !that._timelineCells.length) {
            return;
        }

        if (target instanceof HTMLElement && target.classList.contains('smart-timeline-task') && that.hasAttribute('dragged')) {
            if (that.nonworkingDays.length === 0 && that.nonworkingHours.length === 0 || !that._dragDetails._taskDuration) {
                return;
            }

            const timelineTask = target._task,
                workingDateEnd = that._getTaskWorkingDateEnd(timelineTask);

            //Calculate the max timeline date
            let maxTimelineDate = new Date(that._timelineCells[that._timelineCells.length - 1].date);

            if (that.view === 'year') {
                maxTimelineDate.setMonth(maxTimelineDate.getMonth() + 1);
                maxTimelineDate.setDate(0);
                maxTimelineDate.setHours(23, 59, 59, 999);
            }
            else if (that.view === 'month') {
                maxTimelineDate.setDate(maxTimelineDate.getDate() + 6 - maxTimelineDate.getDay());
                maxTimelineDate.setHours(23, 59, 59, 999);
            }
            else if (that.view === 'week') {
                maxTimelineDate.setHours(23, 59, 59, 999);
            }
            else {
                maxTimelineDate.setHours(maxTimelineDate.getHours(), 59, 59, 999);
            }

            //Refresh the timelineTaskBar
            timelineTask.dateEnd = timelineTask.maxDateEnd ? new Date(Math.min(workingDateEnd.getTime(), timelineTask.maxDateEnd.getTime())) : workingDateEnd;
            timelineTask.dateEnd = new Date(Math.min(maxTimelineDate.getTime(), timelineTask.dateEnd.getTime()));

            timelineTask.duration = that._convertDuration(that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0 ?
                that._getWorkingTime(timelineTask.dateStart, timelineTask.dateEnd) : timelineTask.dateEnd.getTime() - timelineTask.dateStart.getTime(), true);

            //Refresh the task's position
            that._setTimelineTaskBar(target._task, true);
            that._refreshTaskConnections(target._task);
            that._refreshTaskColumnsData(timelineTask, ['dateEnd', 'duration']);
        }
    }

    /**
     * Returns the dateEnd according to the duration of a task
     * @param {any} timelineTask
     */
    _getTaskWorkingDateEnd(timelineTask, workDuration) {
        if (!timelineTask || !timelineTask.dateStart) {
            return;
        }

        const that = this;
        let tempDate = new Date(timelineTask.dateStart), timeLeft, nextDate;

        if (!workDuration) {
            workDuration = that._dragDetails ? that._dragDetails._taskDuration : that._getWorkingTime(timelineTask.dateStart, timelineTask.dateEnd);
        }

        const sign = workDuration < 0 ? -1 : 1;

        //if (workDuration === that._getWorkingTime(timelineTask.dateStart, timelineTask.dateEnd)) {
        //    return new Date(tempDate.getTime() + workDuration);
        //}

        workDuration = Math.abs(workDuration);

        while (workDuration > 0) {
            const timeDiff = Math.min(workDuration, 60 * 60 * 1000 - (tempDate.getMinutes() * 60 * 1000 + tempDate.getSeconds() * 1000 + tempDate.getMilliseconds()));

            if (that.nonworkingDays.indexOf(tempDate.getDay()) > -1) {
                nextDate = new Date(tempDate);
                nextDate.setHours(0, 0, 0, 0);
                nextDate.setDate(tempDate.getDate() + sign * 1);

                timeLeft = Math.min(timeDiff, nextDate.getTime() - tempDate.getTime());

                tempDate = new Date(tempDate.getTime() + timeLeft);
                continue;
            }

            if (that.nonworkingHours.indexOf(tempDate.getHours()) > -1) {
                nextDate = new Date(tempDate);

                const currentTime = nextDate.getTime();

                nextDate.setHours(tempDate.getHours() + sign * 1, 0, 0, 0);

                if (currentTime === nextDate.getTime()) {
                    nextDate.setHours(tempDate.getHours() + sign * 2, 0, 0, 0);
                }

                timeLeft = Math.min(timeDiff, nextDate.getTime() - tempDate.getTime());

                tempDate = new Date(tempDate.getTime() + timeLeft);
                continue;
            }

            workDuration -= timeDiff;
            tempDate = new Date(tempDate.getTime() + sign * timeDiff);
        }

        return tempDate;
    }

    /**
     * Creates the connection line - a div element and appends in to the Timeline container
     * @param {any} x - x coordinate
     * @param {any} y - y coordinate
     * @param {any} size - width/height of the line
     * @param {any} orientation - horizontal/ vertical orientation
     */
    _createConnectingElement(x, y, size, orientation, arrow) {
        const that = this;

        if (!that._connectionDetails || !that._connectionDetails.start) {
            return;
        }

        const connectionDetails = that._connectionDetails,
            connectionType = connectionDetails.type,
            connectionContainer = that.$.timelineConnectionsContainer;

        let connection = connectionDetails.connections.shift();

        if (!connection) {
            connection = document.createElement('div');
            connection.classList.add('smart-task-connection');
        }

        connection.style.width = connection.style.width = '';

        if (orientation === 'horizontal') {
            connection.style.width = Math.abs(size) + 'px';
            connection.style.height = '';
        }
        else {
            connection.style.width = '';
            connection.style.height = Math.abs(size) + 'px';
        }

        //Reset from RTL
        connection.style[that.rightToLeft ? 'left' : 'right'] = '';
        connection.style[that.rightToLeft ? 'right' : 'left'] = x + 'px';
        connection.style.top = y + 'px';
        connection.setAttribute('connection-id', connectionDetails.id);

        //Accessibility
        const startLabel = connectionDetails.start.task._task.label,
            startPoint = connectionType === 0 || connectionType === 3 ? 'start' : 'end',
            endLabel = connectionDetails.end.task._task.label,
            endPoint = connectionType === 0 || connectionType === 1 ? 'start' : 'end';

        connection.setAttribute('aria-label', 'Connection between ' + startLabel + ' (' + startPoint + ') and ' + endLabel + ' (' + endPoint + ')');

        if (arrow) {
            let arrowDirection = connectionType === 0 || connectionType === 1 ? 'right' : 'left';

            if (that.rightToLeft) {
                arrowDirection = arrowDirection === 'left' ? 'right' : 'left';
            }

            connection.setAttribute('arrow-direction', arrowDirection);
        }
        else {
            connection.removeAttribute('arrow-direction');
        }

        if (!connection.parentElement) {
            connectionContainer.appendChild(connection);
        }
    }

    /**
    * Returns the type of connection between two timeline tasks
    * @param {any} connectionStart - the connection point FROM which the connection begins
    * @param {any} connectionEnd - the connection point TO which the connection ends
    */
    _getConnectionType(connectionStart, connectionEnd) {
        if (!connectionStart || !connectionEnd) {
            return;
        }

        let isFromStart = !connectionStart.classList.contains('end'),
            isToEnd = connectionEnd.classList.contains('end');

        //start-to-start
        if (isFromStart && !isToEnd) {
            return 0;
        }
        //end-to-start
        else if (!isFromStart && !isToEnd) {
            return 1;
        }
        //end-to-end
        else if (!isFromStart && isToEnd) {
            return 2;
        }
        //start-to-end
        else if (isFromStart && isToEnd) {
            return 3;
        }
    }

    /**
    * Sets the connection feedback
    * @param {any} event
    */
    _setConnectionFeedback(event) {
        const that = this;

        if (!that._dragDetails || !that._dragDetails.target || !event) {
            if (that._connectionFeedback && that._connectionFeedback.parentElement) {
                that._connectionFeedback.closest('.smart-timeline-task').removeAttribute('connection-point');
                that._connectionFeedback.parentElement.removeChild(that._connectionFeedback);
            }

            that.removeAttribute('connecting-task');
            delete that._connectionFeedback;
            return;
        }

        if (!that._dragDetails.target || !that._dragDetails.target.classList.contains('smart-task-connection-point')) {
            return;
        }

        const taskBar = that._dragDetails.target.closest('.smart-timeline-task');

        if (!taskBar) {
            return;
        }

        if (!that.hasAttribute('connecting-task')) {
            if (that.$.fireEvent('connectionStart', { source: taskBar }).defaultPrevented) {
                delete that._dragDetails.target;
                return;
            }

            that.setAttribute('connecting-task', '');

            if (Smart.Utilities.Core.isMobile) {
                that._scrollView.disableSwipeScroll = true;
            }
        }

        const isMilestone = taskBar.classList.contains('milestone');
        let startSideOffsetX = isMilestone ? -1 * taskBar.offsetHeight / 2 : 0;

        if (that._dragDetails.target.classList.contains('end')) {
            taskBar.setAttribute('connection-point', 'end');
            startSideOffsetX = isMilestone ? -1 * startSideOffsetX : taskBar.offsetWidth;
        }

        if (!that._connectionFeedback) {
            that._connectionFeedback = document.createElement('div');
            that._connectionFeedback.classList.add('smart-task-connection-feedback');
        }

        const startX = that._dragDetails.coordinates.x + ((that.rightToLeft ? -1 : 1) * startSideOffsetX),
            startY = that._dragDetails.coordinates.y,
            offsetX = that._dragDetails.offset.x - (that.rightToLeft ? taskBar.offsetWidth : 0),
            offsetY = that._dragDetails.offset.y,
            currentX = event.pageX - window.pageXOffset + offsetX,
            currentY = event.pageY - window.pageYOffset + offsetY - taskBar.offsetHeight / 2;

        //calculates the rotation angle and length of the connection
        that._connectionFeedback.style.width = Math.sqrt(Math.pow(Math.abs(currentX - startX), 2) + Math.pow(Math.abs(currentY - startY), 2)) + 'px';
        that._connectionFeedback.style.transform = that.rightToLeft ?
            'rotate(' + ((Math.atan2(startY - currentY, startX - currentX) || 0) * 180 / Math.PI) + 'deg)' :
            'rotate(' + ((Math.atan2(currentY - startY, currentX - startX) || 0) * 180 / Math.PI) + 'deg)';

        if (!that._connectionFeedback.parentElement) {
            taskBar.firstElementChild.appendChild(that._connectionFeedback);
        }
    }

    /**
     * Determines the tasks to be connected
     * @param {any} event
     */
    _connectTask(event) {
        const that = this;
        let connectionStart, connectionEnd, taskStart, taskEnd, connectionType

        if (event.originalEvent) {
            const originalEvent = event.originalEvent;
            let target = Smart.Utilities.Core.isMobile ?
                document.elementFromPoint(originalEvent.pageX - window.pageXOffset, originalEvent.pageY - window.pageYOffset) : originalEvent.target;

            if (!that._dragDetails || !that._dragDetails.target || !target || !target.classList) {
                return;
            }

            if (that.shadowRoot && target === that) {
                target = Smart.Utilities.Core.isMobile ?
                    that.shadowRoot.elementFromPoint(originalEvent.pageX - window.pageXOffset, originalEvent.pageY - window.pageYOffset) : originalEvent.composedPath()[0];
            }

            connectionStart = that._dragDetails.target.classList.contains('smart-task-connection-point') ? that._dragDetails.target : undefined;
            connectionEnd = target.classList.contains('smart-task-connection-point') ? target : undefined;

            if (connectionStart) {
                taskStart = connectionStart.closest('.smart-timeline-task');
            }

            if (connectionEnd) {
                taskEnd = connectionEnd.closest('.smart-timeline-task');
            }
            else if (Smart.Utilities.Core.isMobile && target.classList.contains('smart-timeline-task-fill')) {
                taskEnd = target.closest('.smart-timeline-task');

                if (taskEnd) {
                    const left = originalEvent.pageX - window.pageXOffset - taskEnd.getBoundingClientRect().left;

                    connectionEnd = taskEnd.querySelector('.smart-task-connection-point.' + (left >= taskEnd.offsetWidth / 2 ? 'end' : 'start'));
                }

            }
        }
        //Handle direct task connection
        else {
            if (!event || event.length < 3) {
                return;
            }

            event = (event + '').split('-');
            event = that._getValidConnectionId(event[0], event[1], event[2], '_connectTask');

            if (event === undefined) {
                return;
            }

            const tasks = that.$.timelineTasksContainer.children;

            taskStart = tasks[parseInt(event[0])];
            taskEnd = tasks[parseInt(event[1])];
            connectionType = parseInt(event[2]);

            if (taskStart && taskEnd) {
                connectionStart = taskStart.querySelector('.smart-task-connection-point.' + (connectionType === 0 || connectionType === 3 ? 'start' : 'end'));
                connectionEnd = taskEnd.querySelector('.smart-task-connection-point.' + (connectionType === 0 || connectionType === 1 ? 'start' : 'end'));
            }
        }

        if (!connectionStart || !connectionEnd || !taskStart || !taskEnd || taskStart === taskEnd ||
            taskStart.classList.contains('smart-visibility-hidden') || taskEnd.classList.contains('smart-visibility-hidden')) {
            return;
        }

        //Check if the targetTask is already connected in the same chain
        if (that._isAutoScheduled(taskStart, taskEnd)) {
            return;
        }

        if (connectionType === undefined) {
            connectionType = that._getConnectionType(connectionStart, connectionEnd);
        }

        that._connectionDetails = {
            start: { point: connectionStart }, end: { point: connectionEnd }, type: connectionType
        };

        //Create the Task details for the connection
        that._setConnectionDetails();

        //Create the task connection
        that._createTaskConnection();

        //Update the task with the new connection info
        if (!that.hasAttribute('dragged') && !that.hasAttribute('resized')) {
            that._updateConnection(that._tasks.indexOf(taskStart._task) + '-' + that._tasks.indexOf(taskEnd._task) + '-' + that._connectionDetails.type);
        }

        delete that._connectionDetails;

        taskStart.setAttribute('connected', '');
        taskEnd.setAttribute('connected', '');

        return { taskStart: taskStart, taskEnd: taskEnd, type: connectionType };
    }

    /**
     * Checks if the target task is already connected to the starTask's connection chain
     */
    _isAutoScheduled(taskStart, taskEnd, removeLastConnection) {
        const that = this,
            tasks = that._tasks;
        let checkedTasks = {};

        function isConnected(task, targetIndex) {
            const taskEndConnections = task.connections,
                taskIndex = tasks.indexOf(task);

            checkedTasks[taskIndex] = true;

            for (let i = 0; i < taskEndConnections.length; i++) {
                const con = taskEndConnections[i],
                    conTarget = that._getTaskIndexById(con.target);

                if (conTarget === targetIndex) {
                    if (removeLastConnection) {
                        that._removeConnection(taskIndex + '-' + conTarget + '-' + con.type, true);
                    }

                    return true;
                }

                if (!checkedTasks[conTarget]) {
                    if (isConnected(tasks[conTarget], targetIndex)) {
                        return true;
                    }
                }
            }
        }

        if (!that.autoSchedule) {
            return;
        }

        return isConnected(taskEnd._task, tasks.indexOf(taskStart._task));
    }

    /**
     * Calculates the details for the connection
     */
    _setConnectionDetails() {
        const that = this;

        if (!that._connectionDetails) {
            return;
        }

        const connectionDetails = that._connectionDetails,
            connectionStart = connectionDetails.start.point,
            connectionEnd = connectionDetails.end.point,
            connectionType = connectionDetails.type;

        if (!connectionStart || !connectionEnd) {
            return;
        }

        let taskStart = connectionStart.closest('.smart-timeline-task'),
            taskEnd = connectionEnd.closest('.smart-timeline-task'), inverted,
            taskStartWidth = taskStart.offsetWidth,
            taskEndWidth = taskEnd.offsetWidth,
            taskStartOffsetLeft = taskStart.offsetLeft,
            taskEndOffsetLeft = taskEnd.offsetLeft,
            taskStartOffsetTop = taskStart.offsetTop,
            taskEndOffsetTop = taskEnd.offsetTop,
            connectionStartOffset = connectionStart.offsetLeft,
            connectionEndOffset = connectionEnd.offsetLeft;
        const isStartMilestone = taskStart.classList.contains('milestone'),
            isEndMilestone = taskEnd.classList.contains('milestone'),
            timelineTasks = [].slice.call(that.$.timelineTasksContainer.children),
            taskStartIndex = timelineTasks.indexOf(taskStart),
            taskEndIndex = timelineTasks.indexOf(taskEnd);

        if (that.rightToLeft) {
            const contentWidth = that.$.timelineContent.offsetWidth;

            taskStartOffsetLeft = contentWidth - (taskStartOffsetLeft + taskStartWidth);
            taskEndOffsetLeft = contentWidth - (taskEndOffsetLeft + taskEndWidth);
        }

        connectionDetails.id = (taskStartIndex + '-') + (taskEndIndex + '-') + connectionType;

        if (isStartMilestone) {
            taskStartWidth = taskStart.offsetHeight;
            taskStartOffsetLeft -= taskStartWidth / 2;
        }
        else if (isEndMilestone) {
            taskEndWidth = taskEnd.offsetHeight;
            taskEndOffsetLeft -= taskEndWidth / 2;
        }

        if (!connectionDetails.connectionStartOffset || !connectionDetails.connectionEndOffset) {
            //Calculate the start/end connectionPoint offsets
            if (connectionType === 0) {
                if (that.rightToLeft) {
                    connectionStartOffset = connectionStartOffset - (isStartMilestone ? taskStartWidth / 2 : taskStartWidth);
                    connectionEndOffset = connectionEndOffset - (isEndMilestone ? taskEndWidth / 2 : taskEndWidth);
                }
                else {
                    connectionStartOffset = Math.abs(connectionStartOffset) - connectionStart.offsetWidth - (isStartMilestone ? taskStartWidth / 2 : 0);
                    connectionEndOffset = Math.abs(connectionEndOffset) - connectionEnd.offsetWidth - (isEndMilestone ? taskEndWidth / 2 : 0);
                }
            }
            else if (connectionType === 1) {
                if (that.rightToLeft) {
                    connectionStartOffset = Math.abs(connectionStartOffset) - connectionStart.offsetWidth - (isStartMilestone ? taskStartWidth / 2 : 0);
                    connectionEndOffset = connectionEndOffset - (isEndMilestone ? taskEndWidth / 2 : taskEndWidth);
                }
                else {
                    connectionStartOffset = connectionStartOffset - (isStartMilestone ? taskStartWidth / 2 : taskStartWidth);
                    connectionEndOffset = Math.abs(connectionEndOffset) - connectionEnd.offsetWidth - (isEndMilestone ? taskEndWidth / 2 : 0);
                }
            }
            else if (connectionType === 2) {
                if (that.rightToLeft) {
                    connectionStartOffset = Math.abs(connectionStartOffset) - connectionStart.offsetWidth - (isStartMilestone ? taskStartWidth / 2 : 0);
                    connectionEndOffset = Math.abs(connectionEndOffset) - connectionEnd.offsetWidth - (isEndMilestone ? taskEndWidth / 2 : 0);
                }
                else {
                    connectionStartOffset = connectionStartOffset - (isStartMilestone ? taskStartWidth / 2 : taskStartWidth);
                    connectionEndOffset = connectionEndOffset - (isEndMilestone ? taskEndWidth / 2 : taskEndWidth);
                }
            }
            else {
                if (that.rightToLeft) {
                    connectionStartOffset = connectionStartOffset - (isStartMilestone ? taskStartWidth / 2 : taskStartWidth);
                    connectionEndOffset = Math.abs(connectionEndOffset) - connectionEnd.offsetWidth - (isEndMilestone ? taskEndWidth / 2 : 0);
                }
                else {
                    connectionStartOffset = Math.abs(connectionStartOffset) - connectionStart.offsetWidth - (isStartMilestone ? taskStartWidth / 2 : 0);
                    connectionEndOffset = connectionEndOffset - (isEndMilestone ? taskEndWidth / 2 : taskEndWidth);
                }
            }

            connectionDetails.start.offset = connectionStartOffset = connectionStartOffset + connectionStart.offsetWidth / 2;
            connectionDetails.end.offset = connectionEndOffset = connectionEndOffset + connectionEnd.offsetWidth / 2;
        }

        //Check if the connection should be inverted
        if ((connectionType === 0 && taskStartOffsetLeft > taskEndOffsetLeft) ||
            (connectionType === 1 && taskStartOffsetLeft + taskStartWidth + connectionStartOffset > taskEndOffsetLeft - connectionEndOffset && taskEndOffsetTop > taskStartOffsetTop) ||
            (connectionType === 2 && taskEndOffsetLeft + taskEndWidth > taskStartOffsetLeft + taskStartWidth) ||
            (connectionType === 3 && ((taskStartOffsetLeft - connectionStartOffset < taskEndOffsetLeft + taskEndWidth + connectionEndOffset && taskEndOffsetTop > taskStartOffsetTop) ||
                (taskStartOffsetLeft - connectionStartOffset > taskEndOffsetLeft + taskEndWidth + connectionEndOffset && taskStartOffsetTop > taskEndOffsetTop)))) {
            inverted = true;

            //Reverse the connection details
            let originalValue = taskStart;

            taskStart = taskEnd;
            taskEnd = originalValue;

            originalValue = connectionStartOffset;

            connectionStartOffset = connectionEndOffset;
            connectionEndOffset = originalValue;

            originalValue = taskStartWidth;

            taskStartWidth = taskEndWidth;
            taskEndWidth = originalValue;

            originalValue = taskStartOffsetLeft;

            taskStartOffsetLeft = taskEndOffsetLeft;
            taskEndOffsetLeft = originalValue;

            originalValue = taskStartOffsetTop;

            taskStartOffsetTop = taskEndOffsetTop
            taskEndOffsetTop = originalValue
        }

        //Calculate the start/end point
        let startX = taskStartOffsetLeft,
            endX = taskEndOffsetLeft;

        if ((!inverted && connectionType === 1) || (inverted && connectionType === 3)) {
            startX += taskStartWidth;
        }
        else if ((!inverted && connectionType === 3) || (inverted && connectionType === 1)) {
            endX += taskEndWidth;
        }
        else if (connectionType === 2) {
            startX += taskStartWidth;
            endX += taskEndWidth;
        }

        let connections = that.$.timelineConnectionsContainer.querySelectorAll('.smart-task-connection[connection-id^="' + taskStartIndex + '-' + taskEndIndex + '-' + '"]');

        //Check for the same connection but inverted
        if (connections.length === 0) {
            connections = that.$.timelineConnectionsContainer.
                querySelectorAll('.smart-task-connection[connection-id^="' + (taskEndIndex + '-' + taskStartIndex) + '"]');
        }

        connectionDetails.connections = [].slice.call(connections);

        connectionDetails.start.x = startX;
        connectionDetails.start.y = taskStartOffsetTop + connectionStart.offsetTop;
        connectionDetails.start.task = taskStart;

        connectionDetails.end.x = endX;
        connectionDetails.end.y = taskEndOffsetTop + connectionEnd.offsetTop;
        connectionDetails.end.task = taskEnd;

        connectionDetails.type = connectionType;
        connectionDetails.inverted = inverted;
    }

    /**
     * The Algorithm for creating the connection lines
     */
    _createTaskConnection() {
        const that = this,
            connectionDetails = that._connectionDetails;

        if (!connectionDetails) {
            return;
        }

        const borderWidth = 2 * (parseFloat(getComputedStyle(that).getPropertyValue('--smart-gantt-chart-timeline-task-connection-width')) || 1),
            startX = connectionDetails.start.x,
            startY = connectionDetails.start.y,
            connectionStartOffset = connectionDetails.start.offset,
            connectionStartOffsetTop = connectionDetails.start.point.offsetTop,
            endX = connectionDetails.end.x,
            endY = connectionDetails.end.y,
            connectionEndOffset = connectionDetails.end.offset,
            connectionType = connectionDetails.type,
            inverted = connectionDetails.inverted,
            isConnectionEndToStart = (!inverted && connectionType === 3) || (inverted && connectionType === 1),
            isConnectionStartToEnd = (!inverted && connectionType === 1) || (inverted && connectionType === 3);
        let x, y, length,
            lineStartX = startX,
            lineEndX = endX;

        if (isConnectionEndToStart) {
            lineStartX = startX - connectionEndOffset;
            lineEndX = endX + connectionEndOffset;
        }
        else if (isConnectionStartToEnd) {
            lineStartX = startX + connectionStartOffset;
            lineEndX = endX - connectionEndOffset;
        }

        const isStartBeforeEnd = lineStartX <= lineEndX && isConnectionEndToStart,
            isEndBeforeStart = lineStartX >= lineEndX && isConnectionStartToEnd,
            includeBorderWidth = connectionType === 2 || isConnectionStartToEnd;

        //recursive function for connection line drawing
        function createConnectionLine(direction) {
            if (x === endX) {
                return;
            }

            if (!direction) {
                if (!x) {
                    //Start
                    x = startX;
                    y = startY;

                    if (connectionType === 0 || (!inverted && connectionType === 3) || (inverted && connectionType === 1)) {
                        x -= connectionStartOffset;
                    }

                    that._createConnectingElement(x, y, connectionStartOffset, 'horizontal', connectionDetails.inverted);

                    if (includeBorderWidth) {
                        x += connectionStartOffset - borderWidth;
                    }

                    if (!isStartBeforeEnd && !isEndBeforeStart) {
                        createConnectionLine('vertical');
                    }
                    else {
                        that._createConnectingElement(x, y -= startY > endY ? connectionStartOffsetTop : 0, connectionStartOffsetTop, 'vertical');
                        y += startY < endY ? connectionStartOffsetTop : 0;
                    }
                }
                else {
                    //End
                    length = Math.abs(x - endX);

                    if (x >= endX) {
                        x += -1 * length;
                        length += borderWidth;
                    }

                    that._createConnectingElement(x, y + (startY < endY ? Math.abs(y - endY) : 0), length, 'horizontal', !connectionDetails.inverted);
                    x = endX;
                }

                createConnectionLine('horizontal');
            }
            else {
                if (direction === 'horizontal') {
                    length = x - endX + (isStartBeforeEnd ? -1 : 1) * connectionStartOffset;
                    x = lineStartX > lineEndX ? x - Math.abs(length) : x;
                    that._createConnectingElement(x, y, (lineStartX === lineEndX ? 0 : Math.abs(length)) + (includeBorderWidth ? borderWidth : 0), 'horizontal');

                    //Update the x position before creating the vertical line
                    x = lineStartX < lineEndX ? x - length : x;
                    createConnectionLine('vertical');
                }
                else {
                    length = Math.abs(y - endY);
                    y += startY < endY ? 0 : -1 * length;
                    x -= (inverted && connectionType === 1) || (!inverted && connectionType === 3 && startY > endY) ? borderWidth : 0;
                    that._createConnectingElement(x, y, length, 'vertical');

                    createConnectionLine();
                }
            }
        }

        createConnectionLine();

        //Removes unnececssary connecion elements
        connectionDetails.connections.map(con => con.parentElement.removeChild(con));
    }

    /**
     * Returns the numeric index of a task by it's id
     * @param {any} id
     */
    _getTaskIndexById(id) {
        const that = this;

        if (typeof id === 'number') {
            return id;
        }

        const tasks = that._tasks;

        if (typeof id === 'object') {
            return tasks.indexOf(id);
        }

        if (typeof id === 'string') {
            for (let t = 0; t < tasks.length; t++) {
                const task = tasks[t];

                if (task.id === id) {
                    return t;
                }
            }

            return isNaN(parseInt(id)) ? -1 : parseInt(id);
        }
    }

    /**
     * Refreshes the connections of a Task
     * @param {any} taskBar - a timeline Task bar
     */
    _refreshTaskConnections(taskBar) {
        const that = this,
            task = taskBar instanceof HTMLElement ? taskBar._task : taskBar,
            taskBarIndex = that._tasks.indexOf(task);

        if (taskBarIndex === undefined || (taskBar.classList && taskBar.classList.contains('smart-visibility-hidden'))) {
            return;
        }

        let relatedConnections;

        if (that._dragDetails) {
            relatedConnections = that._dragDetails.relatedConnections[taskBarIndex];
        }

        if (!relatedConnections) {
            relatedConnections = {};

            const tasks = that._tasks;

            for (let t = 0; t < tasks.length; t++) {
                const connections = tasks[t].connections.filter(con => that._getTaskIndexById(con.target) === taskBarIndex);

                if (connections.length > 0) {
                    relatedConnections[t] = connections;
                }
            }

            if (that._dragDetails) {
                that._dragDetails.relatedConnections[taskBarIndex] = relatedConnections;
            }
        }

        const connections = task.connections;

        //refresh the connections that start from the task
        for (let c = 0; c < connections.length; c++) {
            const con = connections[c];

            that._connectTask(taskBarIndex + '-' + that._getTaskIndexById(con.target) + '-' + con.type);
        }

        //refresh the connections that target tha task
        if (Object.keys(relatedConnections).length > 0) {
            for (const con in relatedConnections) {
                const cons = relatedConnections[con];

                for (let c = 0; c < cons.length; c++) {
                    that._connectTask(con + '-' + that._getTaskIndexById(cons[c].target) + '-' + cons[c].type);
                }
            }
        }
    }

    /**
     * Document Drag Start
     * @param {any} event
     */
    _dragStartHandler(event) {
        const that = this,
            closest = event.target.closest;

        if (that._dragDetails || (closest && closest.call(that, 'smart-gantt-chart') === that)) {
            event.preventDefault();
        }
    }

    /**
     * Returns the first visible cell object
     */
    _getFirstCellObjInView(timelineCells) {
        const that = this;

        if (!timelineCells) {
            timelineCells = that._timelineCells;
        }

        if (!timelineCells) {
            return;
        }

        const scrollLeft = Math.abs(that.scrollLeft);
        let firstCellObj;

        for (let i = 0; i < timelineCells.length; i++) {
            const cellObj = timelineCells[i];

            if (cellObj.left + cellObj.width > scrollLeft) {
                firstCellObj = cellObj;
                break;
            }
        }

        return firstCellObj;
    }

    /**
    * Returns the limits of a project's subtasks. Used when dragProject attribute is set
    * @param {any} timelineTask
    */
    _getSubTaskLimits(timelineTask) {
        const that = this;

        if (!timelineTask) {
            return;
        }

        const task = timelineTask._task,
            subTasks = task.tasks;
        let min, max;

        if (!task.tasks || task.tasks.length === 0) {
            return;
        }

        let firstSubTask = subTasks[0],
            lastSubTask = subTasks[0];

        for (let i = 0; i < subTasks.length; i++) {
            const subTask = subTasks[i];

            if (!subTasks[i].dateEnd || !subTasks[i].dateStart) {
                continue;
            }

            if (!firstSubTask.dateStart) {
                firstSubTask = subTask[i];
            }

            if (!lastSubTask.dateEnd) {
                lastSubTask = subTask[i];
            }

            if (subTasks[i].dateEnd.getTime() > lastSubTask.dateEnd.getTime()) {
                lastSubTask = subTasks[i];
            }

            if (subTasks[i].dateStart.getTime() < firstSubTask.dateStart.getTime()) {
                firstSubTask = subTasks[i];
            }
        }

        const timelineTasks = that.$.timelineTasksContainer.children,
            taskMaxWidth = that.$.timelineContent.offsetWidth;
        let timelineSubTask;

        if (firstSubTask) {
            timelineSubTask = timelineTasks[that._tasks.indexOf(firstSubTask)];

            if (timelineSubTask) {
                min = Math.max(0, that.rightToLeft ?
                    ((taskMaxWidth - timelineTask.offsetLeft - timelineTask.offsetWidth) - (taskMaxWidth - timelineSubTask.offsetLeft - timelineSubTask.offsetWidth)) :
                    (timelineTask.offsetLeft - timelineSubTask.offsetLeft));
            }
        }

        if (lastSubTask) {
            timelineSubTask = timelineTasks[that._tasks.indexOf(lastSubTask)];

            if (timelineSubTask) {
                const timelineTaskCell = that.$.timelineCellsContainer.children[that._tasks.indexOf(lastSubTask)];

                if (that.rightToLeft) {
                    const timelineTaskRight = taskMaxWidth - timelineTask.offsetLeft - timelineTask.offsetWidth;

                    max = Math.max(timelineTaskRight, timelineTaskRight + timelineTaskCell.offsetWidth - (taskMaxWidth - timelineSubTask.offsetLeft));
                }
                else {
                    max = Math.max(timelineTask.offsetLeft, timelineTask.offsetLeft + timelineTaskCell.offsetWidth - (timelineSubTask.offsetLeft + timelineSubTask.offsetWidth));
                }

            }
        }

        return { min: min, max: max }
    }

    /**
     * Returns the limits in pixels according to minDateStart/minDateEnd/maxDateStart/maxDateEnd task attributes
     * @param {any} task
     */
    _getTaskDragLimits(task) {
        const that = this;

        //Calculates the min/max dateStart/dateEnd
        const dateStartLimits = that._getTaskBarPositionLimits(task, 'DateStart'),
            dateEndLimits = that._getTaskBarPositionLimits(task, 'DateEnd'),
            taskBar = that._dragDetails.timelineTask;
        let limits = {};

        if (dateStartLimits.min || dateEndLimits.min) {
            limits.min = Math.max(dateStartLimits.min || 0, Math.max(0, (dateEndLimits.min || 0) - taskBar.offsetWidth));
        }

        if (dateEndLimits.max) {
            limits.max = Math.max(0, dateEndLimits.max - taskBar.offsetWidth);
        }

        if (dateStartLimits.max) {
            limits.max = limits.max ? Math.min(dateStartLimits.max, limits.max) : dateStartLimits.max;
        }

        return limits;
    }

    /**
     * Returns the exact Date Range (start, end) according to the position of the taskBar
     * @param {any} taskBar
     */
    _getTaskBarDateRange(taskBar) {
        if (!taskBar) {
            return;
        }

        const that = this,
            taskBarLeft = that.rightToLeft ?
                (parseFloat(taskBar.style.right) || (that.$.timelineContent.offsetWidth - taskBar.offsetLeft - taskBar.offsetWidth)) :
                (parseFloat(taskBar.style.left) || taskBar.offsetLeft),
            taskBarWidth = parseFloat(taskBar.style.width) || taskBar.offsetWidth,
            cellStart = taskBar._cellStart,
            cellEnd = taskBar._cellEnd,
            timelineTask = taskBar._task,
            minDateStart = timelineTask.minDateStart,
            maxDateEnd = timelineTask.maxDateEnd;

        let dateStart, dateEnd;

        dateStart = that._getDateFromCell(taskBarLeft, cellStart);

        if (minDateStart && !(taskBar._task.type === 'project' && taskBar._task.synchronized)) {
            dateStart = new Date(Math.max(minDateStart.getTime(), dateStart.getTime()));
        }

        dateEnd = that._getDateFromCell(taskBarLeft + taskBarWidth, cellEnd);

        if (maxDateEnd && !(taskBar._task.type === 'project' && taskBar._task.synchronized)) {
            dateEnd = new Date(Math.min(maxDateEnd.getTime(), dateEnd.getTime()));
        }

        return { dateStart: dateStart, dateEnd: dateEnd };
    }

    /**
     * Returns the position and size of the Task Bar according to the Task startDate and startEnd
     * @param {any} taskBar
     */
    _getTaskBarDetails(taskBar) {
        const that = this;

        if (!taskBar.classList || !taskBar.classList.contains('smart-timeline-task')) {
            return;
        }

        const timelineTask = that.$.timelineCellsContainer.children[that._tasks.indexOf(taskBar._task)];

        if (!timelineTask) {
            return;
        }

        let dateStart = new Date(timelineTask._task.dateStart);
        const dateEnd = new Date(timelineTask._task.dateEnd),
            cellStart = taskBar._cellStart,
            cellEnd = taskBar._cellEnd;

        if (!cellStart || !cellEnd) {
            //TODO: hide the task since it has no dateStart/dateEnd
            taskBar.classList.add('smart-visibility-hidden');
            return;
        }

        if (that.snapToNearest) {
            let left, width,
                dateStart = taskBar._task.dateStart,
                dateEnd = taskBar._task.dateEnd;
            const dateStartMin = new Date(cellStart.date),
                dateStartMax = that._getDateFromCell(cellStart.left + cellStart.width, cellStart),
                dateEndMin = new Date(cellEnd.date),
                dateEndMax = that._getDateFromCell(cellEnd.left + cellEnd.width, cellEnd);

            if (dateStartMax.getTime() - dateStart.getTime() >= dateStartMax.getTime() - dateStartMin.getTime()) {
                dateStart = dateStartMin;
                left = cellStart.left;
            }
            else {
                dateStart = dateStartMax;
                left = cellStart.left + cellStart.width;
            }

            if (taskBar._task.type !== 'milestone') {
                if (dateEndMax.getTime() - dateEnd.getTime() >= dateEnd.getTime() - dateEndMin.getTime()) {
                    dateEnd = dateEndMin;
                    width = cellEnd.left - left;
                }
                else {
                    dateEnd = dateEndMax;
                    width = cellEnd.left - left + cellEnd.width;
                }
            }

            taskBar._task.dateEnd = dateEnd;
            taskBar._task.dateStart = dateStart;

            return { left: left, width: width, top: timelineTask.offsetTop };
        }

        let taskBarLeft, taskBarWidth, daysInStartMonth, daysInEndMonth, startTimeProportion, endTimeProportion;

        switch (that.view) {
            case 'year': {
                daysInStartMonth = (new Date(dateStart.getFullYear(), dateStart.getMonth() + 1, 0)).getDate();
                daysInEndMonth = (new Date(dateEnd.getFullYear(), dateEnd.getMonth() + 1, 0)).getDate();

                const timeOffsetInDaysStart = ((dateStart.getHours() / 24) + (dateStart.getMinutes() / (60 * 24)) + (dateStart.getSeconds() / (60 * 60 * 24))),
                    timeOffsetinDaysEnd = ((dateEnd.getHours() / 24) + (dateEnd.getMinutes() / (60 * 24)) + (dateEnd.getSeconds() / (60 * 60 * 24)));

                // - 1 because month start with day 1 not day 0
                taskBarLeft = cellStart.left + ((dateStart.getDate() - 1 + timeOffsetInDaysStart) / daysInStartMonth * cellStart.width);
                taskBarWidth = cellEnd.left + ((dateEnd.getDate() - 1 + timeOffsetinDaysEnd) / daysInEndMonth * cellEnd.width) - taskBarLeft;
                break;
            }
            case 'month': {
                startTimeProportion = parseFloat(dateStart.getHours() + '.' + dateStart.getMinutes() + dateStart.getSeconds()) / 24 * (cellStart.width / 7);
                endTimeProportion = parseFloat(dateEnd.getHours() + '.' + dateEnd.getMinutes() + dateEnd.getSeconds()) / 24 * (cellStart.width / 7);

                taskBarLeft = cellStart.left + (((dateStart.getDay()) / 7) * cellStart.width) + startTimeProportion;
                taskBarWidth = cellEnd.left + (((dateEnd.getDay()) / 7) * cellEnd.width) - taskBarLeft + endTimeProportion;
                break;
            }
            case 'week': {
                startTimeProportion = parseFloat(dateStart.getHours() + '.' + dateStart.getMinutes() + dateStart.getSeconds()) / 24 * cellStart.width;
                endTimeProportion = parseFloat(dateEnd.getHours() + '.' + dateEnd.getMinutes() + dateEnd.getSeconds()) / 24 * cellStart.width;

                taskBarLeft = cellStart.left + startTimeProportion;
                taskBarWidth = cellEnd.left + (endTimeProportion - startTimeProportion) - cellStart.left;
                break;
            }
            case 'day':
                startTimeProportion = parseFloat(dateStart.getMinutes() + dateStart.getSeconds() / 60) / 60 * cellStart.width;
                endTimeProportion = parseFloat(dateEnd.getMinutes() + dateEnd.getSeconds() / 60) / 60 * cellStart.width;

                taskBarLeft = cellStart.left + startTimeProportion;
                taskBarWidth = cellEnd.left + (endTimeProportion - startTimeProportion) - cellStart.left;
                break;
        }

        return { width: timelineTask._task.type === 'milestone' ? '' : taskBarWidth, left: taskBarLeft, top: timelineTask.offsetTop };
    }

    /**
     * Returns the Task cell that contains the date
     * @param {any} task
     * @param {any} date
     */
    _getTimelineTaskCellByDate(task, date) {
        if (!date || !task) {
            return;
        }

        const that = this;

        if (task.classList && task.classList.contains('smart-timeline-task')) {
            task = that.$.timelineCellsContainer.children[that._tasks.indexOf(task._task)];
        }

        //const dateCells = that.$.timelineViewCells.children;
        const dateCells = that._timelineCells;
        let targetCell;

        dateCellsLoop: for (let c = 0; c < dateCells.length; c++) {
            const cell = dateCells[c];

            switch (that.view) {
                case 'year':
                    if (cell.date.getYear() === date.getYear() && cell.date.getMonth() === date.getMonth()) {
                        targetCell = dateCells[c];
                        break dateCellsLoop;
                    }

                    break;
                case 'month': {
                    let cellEndDate = new Date(cell.date);

                    cellEndDate.setDate(cellEndDate.getDate() + (6 - cellEndDate.getDay()) + 1);
                    cellEndDate.setMilliseconds(cellEndDate.getMilliseconds() - 1);

                    if (date.getTime() >= cell.date.getTime() && date.getTime() <= cellEndDate.getTime()) {
                        targetCell = dateCells[c];
                        break dateCellsLoop;
                    }

                    break;
                }
                case 'week':
                    if (cell.date.getYear() === date.getYear() && cell.date.getMonth() === date.getMonth() && cell.date.getDate() === date.getDate()) {
                        targetCell = dateCells[c];
                        break dateCellsLoop;
                    }

                    break;
                case 'day':
                    if (cell.date.getYear() === date.getYear() && cell.date.getMonth() === date.getMonth() &&
                        cell.date.getDate() === date.getDate() && cell.date.getHours() === date.getHours()) {
                        targetCell = dateCells[c];
                        break dateCellsLoop;
                    }

                    break;
            }
        }

        return targetCell;
    }

    /**
     * Handles inverted property. Reverses the position of the Timeline and Tree.
     */
    _handleInverted(isInitializing) {
        const that = this;

        if (isInitializing && !that.inverted && !that.rightToLeft) {
            return;
        }

        const mainSplitter = that.$.mainSplitter,
            splitterItemTimeline = that.$.timelineSplitterItem;

        splitterItemTimeline.size = splitterItemTimeline.offsetWidth;
        mainSplitter.removeChild(splitterItemTimeline);

        if ((that.inverted && !that.rightToLeft) || (!that.inverted && that.rightToLeft)) {
            mainSplitter.insertBefore(splitterItemTimeline, that.$.treeSplitterItem)
        }
        else {
            mainSplitter.appendChild(splitterItemTimeline);
        }
    }

    /**
     * Handles the Task bar progress changing by dragging the thumb inside the task progress area
     * @param {any} event
     */
    _handleTaskProgressChange(event) {
        const that = this,
            targetTaskBarThumb = that._dragDetails.target,
            targetTask = targetTaskBarThumb.closest('.smart-timeline-task');

        if (!that.hasAttribute('progress-change')) {
            if (that.$.fireEvent('progressChangeStart', { taskId: that._tasks.indexOf(targetTask._task), progress: targetTask._task.progress || 0 }).defaultPrevented) {
                delete that._dragDetails.target;
                return;
            }

            that.setAttribute('progress-change', '');
            that._scrollView.disableSwipeScroll = true;
        }

        const targetTaskProgressElement = targetTask.querySelector('.smart-timeline-task-progress'), //targetTaskBarThumb.parentElement,
            taskFillElement = targetTaskProgressElement.parentElement,
            targetParentOffsetleft = taskFillElement.getBoundingClientRect().left,
            maxWidth = taskFillElement.offsetWidth,
            pageX = event.pageX - window.pageXOffset;

        if (!that._dragDetails.progress) {
            that._dragDetails.progress = targetTaskProgressElement.offsetWidth;
        }

        that._dragDetails.progress = Math.max(0, Math.min(maxWidth, that._dragDetails.progress + (that.rightToLeft ? -1 : 1) * (pageX - that._dragDetails.coordinates.x)));

        const progress = that._dragDetails.timelineTask._task.progress = that._dragDetails.progress / maxWidth * 100;


        that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + that._dragDetails.offset.x,
            Math.min(targetParentOffsetleft + maxWidth + that._dragDetails.offset.x, pageX));

        targetTaskBarThumb.style[that.rightToLeft ? 'left' : 'right'] = '';
        targetTaskBarThumb.style[that.rightToLeft ? 'right' : 'left'] = targetTaskProgressElement.style.width = progress + '%';

        //Update the task with the new progress
        that._dragDetails.timelineTask._task.progress = progress.toFixed(2);
    }

    /**
    * Handles the dragging of a Task Bar
    * @param {any} event
    */
    _handleTaskBarDrag(event) {
        const that = this;

        if (Math.abs(event.pageX - that._dragDetails.coordinates.x) <= 5) {
            return;
        }

        const targetTaskBar = that._dragDetails.timelineTask,
            timelineTask = that.$.timelineCellsContainer.children[that._tasks.indexOf(targetTaskBar._task)];

        if (!that.hasAttribute('dragged')) {
            if (that.$.fireEvent('dragStart', { dateStart: targetTaskBar._task.dateStart, dateEnd: targetTaskBar._task.dateEnd }).defaultPrevented) {
                delete that._dragDetails.timelineTask;
                return;
            }

            that.setAttribute('dragged', '');
            that._scrollView.disableSwipeScroll = true;

            const minPositionDelimiter = that._createDelimiter('min-date'),
                maxPositionDelimiter = that._createDelimiter('max-date');

            if (minPositionDelimiter) {
                timelineTask.appendChild(minPositionDelimiter);
            }

            if (maxPositionDelimiter) {
                timelineTask.appendChild(maxPositionDelimiter);
            }
        }

        if (!that._dragDetails.position) {
            that._dragDetails.position = { x: that._dragDetails.originalPosition.x, y: that._dragDetails.originalPosition.y };
        }

        const targetParentOffsetleft = timelineTask.getBoundingClientRect().left,
            maxWidth = timelineTask.offsetWidth,
            targetWidth = targetTaskBar.offsetWidth,
            minLeft = that._dragDetails.min.left || 0,
            maxLeft = that._dragDetails.max.left,
            pageX = event.pageX - window.pageXOffset;
        let maxLeftOffset = 0;

        that._dragDetails.position.x = Math.max(minLeft,
            Math.min(maxWidth - targetWidth, that._dragDetails.position.x + (that.rightToLeft ? -1 : 1) * (pageX - that._dragDetails.coordinates.x)));

        if (maxLeft !== undefined) {
            that._dragDetails.position.x = Math.min(maxLeft, that._dragDetails.position.x);
            maxLeftOffset = maxWidth - targetWidth - maxLeft;
        }

        if (that.rightToLeft) {
            that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + that._dragDetails.offset.x + maxLeftOffset,
                Math.min(targetParentOffsetleft + maxWidth - (targetWidth - that._dragDetails.offset.x + minLeft), pageX));
        }
        else {
            that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + that._dragDetails.offset.x + minLeft,
                Math.min(targetParentOffsetleft + maxWidth - (targetWidth - that._dragDetails.offset.x + maxLeftOffset), pageX));
        }

        const offsetLeftDiff = that._dragDetails.position.x -
            (that.rightToLeft ? (timelineTask.offsetWidth - targetTaskBar.offsetLeft - targetTaskBar.offsetWidth) : targetTaskBar.offsetLeft);

        targetTaskBar.style[that.rightToLeft ? 'right' : 'left'] = that._dragDetails.position.x + 'px';

        that._refreshTask(targetTaskBar);
        that._refreshProject(targetTaskBar._task.project);

        if (targetTaskBar._task.type === 'project' && targetTaskBar._task.dragProject) {
            that._refreshProjectTasks(timelineTask, offsetLeftDiff);
        }
    }

    /**
    * Handles the resizing of a Task Bar
    * @param {any} event
    */
    _handleTaskBarResize(event) {
        const that = this;

        const targetTaskBar = that._dragDetails.timelineTask,
            timelineTask = that.$.timelineCellsContainer.children[that._tasks.indexOf(targetTaskBar._task)];
        let eventPrevented;

        if (!that.hasAttribute('resized')) {
            if (that.$.fireEvent('resizeStart', { dateStart: targetTaskBar._task.dateStart, dateEnd: targetTaskBar._task.dateEnd }).defaultPrevented) {
                that.$.timeline.removeAttribute('task-bar-hovered');
                return;
            }

            that.setAttribute('resized', '');
            that._scrollView.disableSwipeScroll = true;
        }

        if (!that._dragDetails.position) {
            that._dragDetails.position = { x: that._dragDetails.originalPosition.x, y: that._dragDetails.originalPosition.y };
        }

        if (!that._dragDetails.size) {
            that._dragDetails.size = { width: that._dragDetails.originalSize.width };
        }

        if (eventPrevented) {
            return;
        }

        const resizeSide = that.$.timeline.getAttribute('task-bar-hovered'),
            targetParentOffsetleft = timelineTask.getBoundingClientRect().left,
            taskBarMinWidth = that._dragDetails.min.width || 0,
            taskBarMaxWidth = that._dragDetails.max.width,
            pageX = event.pageX - window.pageXOffset;
        let taskBarWidth = that._dragDetails.size.width;

        let size = typeof (event) === 'object' ? pageX - that._dragDetails.coordinates.x : event;

        //Resize From Left side
        if ((resizeSide === 'left' && !that.rightToLeft) || (resizeSide === 'right' && that.rightToLeft)) {
            if (that.rightToLeft) {
                if (size < 0) {
                    size = Math.min(Math.abs(size), taskBarWidth - (taskBarMinWidth || 0)) * -1;
                }
                else if (taskBarMaxWidth !== undefined) {
                    size = Math.min(taskBarMaxWidth - taskBarWidth, Math.abs(size));
                }

                taskBarWidth = that._dragDetails.size.width = Math.max(taskBarMinWidth, Math.min(timelineTask.offsetWidth - targetTaskBar.offsetLeft, taskBarWidth + size));

                const targetTaskBarLeft = targetTaskBar.offsetLeft;

                targetTaskBar.style.left = '';
                targetTaskBar.style.right = (Math.max(0, (parseFloat(targetTaskBar.style.right) ||
                    (timelineTask.offsetWidth - targetTaskBar.offsetLeft - targetTaskBar.offsetWidth)) - size)) + 'px';

                that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + targetTaskBar.offsetLeft + taskBarMinWidth,
                    Math.min(targetParentOffsetleft + targetTaskBarLeft + taskBarWidth, pageX));
            }
            else {
                if (size > 0) {
                    size = Math.min(size, taskBarWidth - (taskBarMinWidth || 0));
                }
                else if (taskBarMaxWidth !== undefined) {
                    size = Math.min(taskBarMaxWidth - taskBarWidth, Math.abs(size)) * -1;
                }

                taskBarWidth = that._dragDetails.size.width = Math.max(taskBarMinWidth, Math.min(targetTaskBar.offsetLeft + taskBarWidth, taskBarWidth - size));

                targetTaskBar.style.right = '';
                targetTaskBar.style.left = (Math.max(0, (parseFloat(targetTaskBar.style.left) || targetTaskBar.offsetLeft) + size)) + 'px';

                that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + targetTaskBar.offsetLeft,
                    Math.min(targetParentOffsetleft + targetTaskBar.offsetLeft + taskBarWidth - taskBarMinWidth, pageX));
            }
        }
        //Resize From Right side
        else {
            if (that.rightToLeft) {
                if (size < 0 && taskBarMaxWidth !== undefined) {
                    size = Math.min(taskBarMaxWidth - taskBarWidth, Math.abs(size)) * -1;
                }

                taskBarWidth = that._dragDetails.size.width = Math.max(taskBarMinWidth, Math.min(targetTaskBar.offsetLeft + targetTaskBar.offsetWidth,
                    taskBarWidth - size));

                targetTaskBar.style.width = that._dragDetails.size.width + 'px';

                that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + targetTaskBar.offsetLeft,
                    Math.min(targetParentOffsetleft + targetTaskBar.offsetLeft + taskBarWidth - taskBarMinWidth, pageX));
            }
            else {
                if (size > 0 && taskBarMaxWidth !== undefined) {
                    size = Math.min(taskBarMaxWidth - taskBarWidth, size);
                }

                taskBarWidth = that._dragDetails.size.width = Math.max(taskBarMinWidth, Math.min(timelineTask.offsetWidth - targetTaskBar.offsetLeft,
                    taskBarWidth + size));

                that._dragDetails.coordinates.x = Math.max(targetParentOffsetleft + targetTaskBar.offsetLeft + taskBarMinWidth,
                    Math.min(targetParentOffsetleft + targetTaskBar.offsetLeft + (taskBarMaxWidth || taskBarWidth), pageX));
            }
        }

        targetTaskBar.style.width = that._dragDetails.size.width + 'px';

        that._refreshTask(targetTaskBar);
        that._refreshProject(targetTaskBar._task.project);
    }

    /**
     * Handles connection hover state
     * @param {any} target
     */
    _handleTimelineConnectionHover(target) {
        const that = this;

        if (!(that.shadowRoot || that).contains(target)) {
            return;
        }

        const connections = that.$.timelineConnectionsContainer.children,
            connection = target.closest('.smart-task-connection');

        if (!connection && that.$.timelineConnectionsContainer.querySelector('.smart-task-connection[hover]')) {
            for (let i = 0; i < connections.length; i++) {
                connections[i].removeAttribute('hover');
            }

            return;
        }

        if (connection) {
            const connectionId = connection.getAttribute('connection-id');

            for (let i = 0; i < connections.length; i++) {
                const con = connections[i];

                if (con.getAttribute('connection-id') === connectionId) {
                    con.setAttribute('hover', '');
                }
                else {
                    con.removeAttribute('hover');
                }
            }

            that._hoveredConnectionTasks = connection.tasks;
        }
    }

    /**
     * Handles timeline task hover state
     * @param {any} timelineTask
     */
    _handleTimelineHover(event, reset) {
        const that = this,
            originalEvent = (event.originalEvent || event);
        let target = originalEvent.pageX && Smart.Utilities.Core.isMobile ?
            document.elementFromPoint(originalEvent.pageX - window.pageXOffset, originalEvent.pageY - window.pageYOffset) : originalEvent.target;

        if (originalEvent.pageX && that.shadowRoot && target === that) {
            target = originalEvent.pageX && Smart.Utilities.Core.isMobile ?
                that.shadowRoot.elementFromPoint(originalEvent.pageX - window.pageXOffset, originalEvent.pageY - window.pageYOffset) : originalEvent.composedPath()[0];
        }

        function resetHoverState() {
            if (that._hoveredTimelineTask) {
                that._hoveredTimelineTask.removeAttribute('hover');
                that.$.timeline.removeAttribute('task-bar-hovered');
                delete that._hoveredTimelineTask;
            }
        }

        if (!target || !target.closest) {
            return;
        }

        that._handleTimelineConnectionHover(target);

        let timelineTask = target.closest('.smart-timeline-task-cell') || target.closest('.smart-timeline-task');

        if (reset || !timelineTask || !(that.shadowRoot || that).contains(timelineTask)) {
            resetHoverState();
            return;
        }

        if (timelineTask.classList.contains('smart-timeline-task-cell')) {
            timelineTask = that.$.timelineTasksContainer.children[that._tasks.indexOf(timelineTask._task)];
        }

        const isTaskConnecting = timelineTask && that._connectionFeedback && timelineTask.contains(that._connectionFeedback);

        if (timelineTask !== that._hoveredTimelineTask || (isTaskConnecting && that._hoveredTimelineTask === timelineTask)) {
            resetHoverState();
        }

        if (timelineTask && !isTaskConnecting) {
            that._hoveredTimelineTask = timelineTask;

            if (isTaskConnecting) {
                return;
            }

            timelineTask.setAttribute('hover', '');
        }

        //Hover the task tree item as well
        that._hoverTask(that._tasks.indexOf(timelineTask._task));
    }

    /**
    * Returns the scrollLeft of the itemsContainer
    */
    _getScrollLeft(scrollLeft, scrollWidth) {
        const that = this;

        if (!that.rightToLeft) {
            return scrollLeft;
        }

        //Note: Chrome has a bug with direction: rtl. Doesn't inverse the scrollLeft
        //see: https://bugs.chromium.org/p/chromium/issues/detail?id=721759
        if (Smart.Utilities.Core.Browser.Chrome) {
            if (!scrollWidth) {
                scrollWidth = that.scrollWidth;
            }

            scrollLeft = scrollWidth - scrollLeft;
        }
        else {
            scrollLeft *= -1;
        }

        return scrollLeft;
    }

    /**
     * MainSplitter resizeEnd Event Handler
     * @param {any} event
     */
    _resizeEventHandler() {
        const that = this,
            timelineTasks = that.$.timelineCellsContainer.children,
            refreshTimeline = that.offsetWidth !== that.$.timeline.offsetWidth;

        if (!that._timelineCells) {
            that._refresh();
            return;
        }

        //Refresh the Timeline cells if necessary or just refresh the scrollBars
        if (refreshTimeline) {
            //In cases where the size is in percentages the resizeHandler must be thrown
            that.$.mainSplitter._resizeEventHandler();
            that._createTimelineCells();
        }
        else {
            that._refresh();
        }

        that._recycle();

        for (let d = 0; d < timelineTasks.length; d++) {
            that._setTimelineTaskBar(timelineTasks[d]._task, refreshTimeline);
            that._refreshTaskConnections(timelineTasks[d]._task);
        }

        //Update the scrollLeft/scrollTop after resizing
        that.$.timeline.scrollLeft = that._getScrollLeft(that.scrollLeft);
        that.$.timelineContent.scrollTop = that.scrollTop;

        //NOTE: A possible solution for the Many Resize Triggers. Uncomment after setting display: none to the triggers
        //Call TaskTree resizeHandler
        that.$.taskTree._checkOverflow();

        //Call Tree Splitter resizeHander
        that.$.treeSplitter._resizeEventHandler();

        //call Main Splitter resizeHandler
        that.$.mainSplitter._resizeEventHandler();
    }

    /**
    * Recycles the timeline header cells and updates them with fresh data
    */
    _recycle(event) {
        const that = this;

        if (!event || event.context.orientation === 'horizontal') {
            //Refresh the timeline cells
            that._recycleHeaderCells(that.$.timelineViewCells);

            //Refresh the header cells
            that._recycleHeaderCells(that.$.timelineViewDetails);
            return;
        }

        const taskTreeColumns = that.$.treeSplitter._items;

        for (let i = 0; i < taskTreeColumns.length; i++) {
            const column = taskTreeColumns[i];

            if (column === that.$.taskTreeSplitterItem) {
                that.$.taskTree.$.scrollViewer.scrollTop = event.detail.value;
            }
            else {
                const content = column.getElementsByClassName('smart-task-tree-content')[0];

                content.scrollTop = event.detail.value;
            }
        }
    }

    /**
     * Updates the content of the timeline cells and header during scrolling
     * @param {any} event
     * @param {any} container
     */
    _recycleHeaderCells(container) {
        const that = this,
            viewCells = container.children,
            scrollLeft = that.scrollLeft,
            isHeaderContainer = container === that.$.timelineViewCells,
            timelineCells = isHeaderContainer ? that._timelineCells : that._timelineHeaderCells;

        if (!timelineCells.length) {
            return;
        }

        let fragment = document.createDocumentFragment();

        while (viewCells.length) {
            fragment.appendChild(container.firstElementChild);
        }

        const firstCellObj = that._getFirstCellObjInView(timelineCells),
            firstCellOffset = 1 - (firstCellObj.left + firstCellObj.width - Math.abs(scrollLeft)) / timelineCells[0].width,
            cellsAvailable = fragment.children.length,
            cellsNeeded = isHeaderContainer ?
                Math.ceil((parseFloat((that.$.timeline.offsetWidth / firstCellObj.width).toFixed(2)) + firstCellOffset).toFixed(2)) : that._getHeaderVisibleCellsCount();

        //Generate additional cells if needed

        if (cellsAvailable > cellsNeeded) {
            while (fragment.children.length && fragment.children.length !== cellsNeeded) {
                fragment.removeChild(fragment.firstElementChild);
            }
        }
        else if (cellsAvailable < cellsNeeded) {
            const newFragment = that._createCells(cellsNeeded - cellsAvailable);

            while (newFragment.children.length) {
                fragment.appendChild(newFragment.firstElementChild);
            }
        }

        const cellType = isHeaderContainer ? that._getCellsViewType() : that.view;
        let cellIndex = timelineCells.indexOf(firstCellObj);

        for (let i = 0; i < fragment.children.length; i++) {
            const fragmentCell = fragment.children[i],
                timelineCell = timelineCells[cellIndex];

            if (!timelineCell) {
                break;
            }

            let date = new Date(timelineCell.date);

            if (!isHeaderContainer && that.view === 'week') {
                date.setDate(date.getDate() - date.getDay());
            }

            fragmentCell.style[that.rightToLeft ? 'right' : 'left'] = timelineCell.left + 'px';
            fragmentCell.style.width = timelineCell.width + 'px';
            fragmentCell._date = date;
            fragmentCell.innerHTML = that._getDateString(date, cellType, !isHeaderContainer);

            timelineCell.weekend ? fragmentCell.setAttribute('weekend', '') : fragmentCell.removeAttribute('weekend');
            timelineCell.nonworking ? fragmentCell.setAttribute('nonworking', '') : fragmentCell.removeAttribute('nonworking');

            cellIndex++;
        }

        container.appendChild(fragment);
    }

    /**
    * Refreshes the ScrollBars
    */
    _refresh() {
        const that = this;

        function getScrollWidth() {
            const scrollWidth = that.$.timelineCellsContainer.offsetWidth - that.$.timeline.offsetWidth;

            if (scrollWidth > 0 && that.horizontalScrollBarVisibility !== 'hidden' || that.horizontalScrollBarVisibility === 'visible') {
                that.$container.addClass('hscroll');
            }
            else {
                that.$container.removeClass('hscroll');
            }

            return scrollWidth;
        }

        function getScrollHeight() {
            const scrollHeight = that.$.timelineCellsContainer.offsetHeight - that.$.timelineContent.offsetHeight;

            if (scrollHeight > 0 && that.verticalScrollBarVisibility !== 'hidden' || that.verticalScrollBarVisibility === 'visible') {
                that.$container.addClass('vscroll');
            }
            else {
                that.$container.removeClass('vscroll');
            }

            return scrollHeight;
        }

        //Caching the size's before they are re-calculated. Used to check if width/height of the container have changed.
        let initialWidth = that.scrollWidth,
            initialHeight = that.scrollHeight;

        that.scrollWidth = getScrollWidth();
        that.scrollHeight = getScrollHeight();

        //double check in case vScroll has become hidden and hScroll visibility should be checked 
        if (!that.scrollHeight || initialHeight !== that.scrollHeight) {
            that.scrollWidth = getScrollWidth();
        }

        //doble check in case hScroll has become hidden and vScroll visibility should be checked
        if (!that.scrollWidth || initialWidth !== that.scrollWidth) {
            that.scrollHeight = getScrollHeight();
        }

        //if (that.computedVerticalScrollBarVisibility) {
        //    that.scrollHeight += that._scrollView.hScrollBar.offsetHeight;
        //}

        //if (that.computedHorizontalScrollBarVisibility) {
        //    that.scrollWidth += that._scrollView.vScrollBar.offsetWidth;
        //}
    }

    /**
     * Updates the position of the project tasks and refreshes the task data.
     */
    _refreshProjectTasks(projectTimelineTask, offsetLeftDiff) {
        const that = this,
            task = projectTimelineTask._task;

        if (!task.tasks || (task.tasks instanceof Array && task.tasks.length === 0)) {
            return;
        }

        const projectTasks = task.tasks;

        for (let t = 0; t < projectTasks.length; t++) {
            const timelineTaskBar = that.$.timelineTasksContainer.children[that._tasks.indexOf(projectTasks[t])];

            if (timelineTaskBar) {
                if (that.rightToLeft) {
                    timelineTaskBar.style.right = (that.$.timelineContent.offsetWidth - (timelineTaskBar.offsetLeft + timelineTaskBar.offsetWidth - offsetLeftDiff)) + 'px';
                }
                else {
                    timelineTaskBar.style.left = (timelineTaskBar.offsetLeft + offsetLeftDiff) + 'px';
                }

                that._refreshTask(timelineTaskBar);
            }
        }
    }

    /**
     * Refresh the project task
     */
    _refreshProject(project) {
        const that = this;

        if (!project) {
            return;
        }

        if (!project.synchronized) {
            that._refreshProject(project.project);
            return;
        }

        while (project) {
            const projectTasks = project.tasks;
            let minTask = projectTasks[0],
                maxTask = projectTasks[0];

            for (let t = 0; t < projectTasks.length; t++) {
                if (minTask.dateStart.getTime() >= projectTasks[t].dateStart.getTime()) {
                    minTask = projectTasks[t];
                }

                if (maxTask.dateEnd.getTime() <= projectTasks[t].dateEnd.getTime()) {
                    maxTask = projectTasks[t];
                }
            }

            const projectBar = that.$.timelineTasksContainer.children[that._tasks.indexOf(project)],
                minTaskBar = that.$.timelineTasksContainer.children[that._tasks.indexOf(minTask)],
                maxTaskBar = that.$.timelineTasksContainer.children[that._tasks.indexOf(maxTask)],
                maxTaskSize = that.$.timelineContent.offsetWidth;

            if (!projectBar) {
                return;
            }

            if (minTaskBar) {
                project.dateStart = minTask.dateStart;

                if (that.rightToLeft) {
                    projectBar.style.width = (projectBar.offsetWidth - ((maxTaskSize - minTaskBar.offsetLeft - minTaskBar.offsetWidth) -
                        (maxTaskSize - projectBar.offsetLeft - projectBar.offsetWidth))) + 'px';
                    projectBar.style.right = minTaskBar.style.right;
                }
                else {
                    projectBar.style.width = (projectBar.offsetWidth - (minTaskBar.offsetLeft - projectBar.offsetLeft)) + 'px';
                    projectBar.style.left = minTaskBar.style.left;
                }
            }

            if (maxTaskBar) {
                project.dateEnd = maxTask.dateEnd;

                if (that.rightToLeft) {
                    projectBar.style.width = (projectBar.offsetWidth - (maxTaskSize - projectBar.offsetLeft - (maxTaskSize - maxTaskBar.offsetLeft))) + 'px';
                }
                else {
                    projectBar.style.width = (projectBar.offsetWidth - (projectBar.offsetLeft + projectBar.offsetWidth - (maxTaskBar.offsetLeft + maxTaskBar.offsetWidth))) + 'px';
                }
            }

            that._refreshTask(projectBar);
            project = project.project;
        }
    }

    /**
     * Refreshes the dateStart/End of a task
     * @param {any} taskBar
     */
    _refreshTask(taskBar) {
        const that = this;

        //Refresh Task From TaskBar change
        const cellRange = that._getTaskBarCellRange(taskBar),
            cellStart = cellRange.cellStart,
            cellEnd = cellRange.cellEnd;

        if (!cellRange || !cellStart || !cellEnd) {
            return;
        }

        //Set the new Range to the Task Bar
        taskBar._cellStart = cellStart;
        taskBar._cellEnd = cellEnd;

        const dateRange = that._getTaskBarDateRange(taskBar);

        if (!dateRange) {
            return;
        }

        const task = taskBar._task,
            taskIndex = that._tasks.indexOf(task),
            timelineTaskElement = that.$.timelineCellsContainer.children[taskIndex];

        if (!timelineTaskElement) {
            return;
        }

        timelineTaskElement._task.dateStart = task.dateStart = dateRange.dateStart;
        timelineTaskElement._task.dateEnd = task.dateEnd = dateRange.dateEnd;
        timelineTaskElement._task.duration = task.duration = that._convertDuration(that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0 ?
            that._getWorkingTime(task.dateStart, task.dateEnd) : task.dateEnd.getTime() - task.dateStart.getTime(), true);

        //Accessibility
        //Formats a date to ISO format, 'yyyy-mm-dd'
        const dateFormatter = (date) => date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) +
            '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

        taskBar.setAttribute('aria-label', task.label + ' Start date: ' + dateFormatter(task.dateStart) + ', End date: ' + dateFormatter(task.dateEnd));

        that._refreshTaskConnections(taskBar);

        //Updates the Task Tree Data
        that._refreshTaskColumnsData(task, ['dateStart', 'dateEnd', 'duration']);
    }

    /**
     * Refreshes the data inside the Task columns
     * @param {any} task
     * @param {any} properties
     */
    _refreshTaskColumnsData(task, properties) {
        const that = this,
            taskColumns = that.taskColumns;

        function getTaskColumnIndex(prop) {
            for (let i = 0; i < taskColumns.length; i++) {
                if (taskColumns[i].value === prop) {
                    return i;
                }
            }
        }

        if (!task) {
            return;
        }

        const taskSplitter = that.$.treeSplitter,
            taskIndex = that._tasks.indexOf(task);
        let columnIndexes = [];

        if (properties) {
            for (let i = 0; i < properties.length; i++) {
                const columnIndex = getTaskColumnIndex(properties[i]);

                if (columnIndex !== undefined) {
                    columnIndexes.push(columnIndex);
                }
            }
        }
        else {
            columnIndexes = taskColumns.map((col, index) => index);
        }

        for (let i = 0; i < columnIndexes.length; i++) {
            const taskColumn = taskSplitter._items[columnIndexes[i]],
                headerDetails = taskColumns[columnIndexes[i]];
            let taskItem;

            if (!taskColumn) {
                continue;
            }

            if (taskColumn === that.$.taskTreeSplitterItem) {
                taskItem = taskColumn.querySelectorAll('smart-tree-item, smart-tree-items-group')[taskIndex];

                if (taskItem) {
                    taskItem.label = that._formatColumnData(task, headerDetails);
                }
            }
            else {
                taskItem = taskColumn.getElementsByClassName('smart-task-label-container')[taskIndex];
                taskItem.innerHTML = that._formatColumnData(task, headerDetails);
            }

        }
    }

    /*
    * Removes a connection
    * @param {string} connection - this argument represents the id of a connection or a direct instance of a connection
    */
    _removeConnection(connectionId, noAutoScheduling) {
        const that = this,
            connectionContainer = that.$.timelineConnectionsContainer;

        if (connectionId.classList && connectionId.classList.contains('smart-task-connection')) {
            connectionId = connectionId.getAttribute('connection-id');
        }
        else {
            connectionId += '';
        }

        if (connectionId === undefined) {
            return;
        }

        const connections = connectionContainer.querySelectorAll('.smart-task-connection[connection-id^="' + connectionId + '"]'),
            tasks = that._tasks,
            timelineTasks = that.$.timelineTasksContainer.children,
            connectionIdDetails = connectionId.split('-'),
            taskStartId = parseInt(connectionIdDetails[0]),
            taskEndId = parseInt(connectionIdDetails[1]);

        for (let i = 0; i < connections.length; i++) {
            connectionContainer.removeChild(connections[i])
        }

        //update the task
        that._updateConnection(connectionId, true);

        if (timelineTasks[taskStartId] && tasks[taskStartId].connections.length === 0 &&
            !tasks.find(task => task.connections.find(con => that._getTaskIndexById(con.target) === taskStartId))) {
            timelineTasks[taskStartId].removeAttribute('connected');
        }

        if (timelineTasks[taskEndId] && tasks[taskEndId].connections.length === 0 &&
            !tasks.find(task => task.connections.find(con => that._getTaskIndexById(con.target) === taskEndId))) {
            timelineTasks[taskEndId].removeAttribute('connected');
        }

        if (!noAutoScheduling && that.autoSchedule) {
            that._autoScheduleRestore(tasks[taskEndId], parseInt(connectionIdDetails[2]));
            that._autoSchedule(tasks[taskEndId]);
        }
    }

    /**
    * Removes all connections that target a task
    * @param {any} index - the target task
    * @param {any} tasks - list of tasks
    * @param {any} ignoredTasks - tasks that should be ignored
    */
    _removeConnectionsToTask(index, tasks, ignoredTasks) {
        const that = this;

        if (!index) {
            return;
        }

        if (!tasks) {
            tasks = that._tasks;
        }

        for (let t = 0; t < tasks.length; t++) {
            const task = tasks[t];

            if (!task.connections || !task.connections.length || (ignoredTasks && ignoredTasks.indexOf(task) > -1)) {
                continue;
            }

            const taskConnections = task.connections;

            for (let c = 0; c < taskConnections.length; c++) {
                if (taskConnections[c].target === index) {
                    that._removeConnection(t, index);
                }
            }
        }
    }

    /**
     * Sets the connection points of a hovered task
     */
    _setConnectionPoints(timelineTask) {
        const that = this;
        let connectionPoints;

        if (!timelineTask || that._hoveredTimelineTask !== timelineTask) {
            //Hide connection points
            const timelineTasks = that.$.timelineCellsContainer.children;

            for (let t = 0; t < timelineTasks.length; t++) {
                const timelineTask = timelineTasks[t];

                if (timelineTask && !timelineTask.hasAttribute('selected')) {
                    connectionPoints = timelineTask.getElementsByClassName('smart-task-connection-point');

                    for (let cp = 0; cp < connectionPoints.length; cp++) {
                        connectionPoints[cp].classList.add('smart-visibility-hidden');
                    }
                }
            }

            return;
        }

        //Show task's connection points
        connectionPoints = timelineTask.getElementsByClassName('smart-task-connection-point');

        for (let cp = 0; cp < connectionPoints.length; cp++) {
            connectionPoints[cp].classList.remove('smart-visibility-hidden');
        }
    }

    /**
    * Selects a Timeline task
    * @param {any} task
    */
    _selectTask(task) {
        const that = this;

        //Handles Task Bar selection
        const taskIndex = that._tasks.indexOf(task);

        if (taskIndex < 0) {
            //Unselect previous tasks
            that._unselectAllTasks();
            return;
        }

        const targetTaskCells = that.$.timelineCellsContainer.children[taskIndex],
            timelineTask = that.$.timelineTasksContainer.children[taskIndex];

        if (targetTaskCells && targetTaskCells.hasAttribute('selected')) {
            //Unselect previous tasks
            that._unselectAllTasks();
            return;
        }

        const oldSelection = that.selectedIndexes.slice(0);

        //Unselect previous tasks
        that._unselectAllTasks(true);

        if (targetTaskCells) {
            targetTaskCells.setAttribute('selected', '');
        }

        if (timelineTask) {
            timelineTask.setAttribute('selected', '');
            timelineTask.setAttribute('aria-selected', 'true');
        }

        //Focus the Tree so the user can use the keyboard navigation
        const scrollElement = document.scrollingElement || document.documentElement,
            x = scrollElement.scrollLeft,
            y = scrollElement.scrollTop;

        that.$.taskTree.focus();
        window.scrollTo(x, y);

        //Select the tree item
        that.$.taskTree.select(that.$.taskTree.querySelectorAll('smart-tree-item, smart-tree-items-group')[taskIndex]);

        //Set selected attribute to the item in the rest of the columns
        const taskSplitterItems = that.$.treeSplitter._items;

        for (let i = 0; i < taskSplitterItems.length; i++) {
            const taskSplitterItem = taskSplitterItems[i];
            let items;

            if (taskSplitterItem === that.$.taskTreeSplitterItem) {
                continue;
            }

            items = [].slice.call(taskSplitterItem.getElementsByClassName('smart-task-label-container'));

            if (items[taskIndex]) {
                items[taskIndex].setAttribute('selected', '');
            }
        }

        //Scroll to the first possible cell before task's start cell
        const taskCellStart = timelineTask._cellStart;

        if ((that.scrollLeft > taskCellStart.left && that.scrollLeft > taskCellStart.left + timelineTask.offsetWidth) ||
            (that.scrollLeft + that.$.timeline.offsetWidth < taskCellStart.left)) {
            const taskCellIndex = that._timelineCells.indexOf(taskCellStart);

            that._scrollTo((that._timelineCells[taskCellIndex - 1] ? that._timelineCells[taskCellIndex - 1] : taskCellStart).date);
        }

        if (oldSelection[0] !== taskIndex) {
            that.selectedIndexes = [taskIndex];

            that.$.fireEvent('change', { value: [taskIndex], oldValue: oldSelection });
        }
    }

    /**
    * Snaps the Task to the nearest cell start/end
    * @param {any} target
    */
    _snapToNearest(target) {
        const that = this;

        if (target instanceof HTMLElement && target.classList.contains('smart-timeline-task')) {
            if (that.snapToNearest) {
                const cellRange = that._getTaskBarCellRange(target);

                if (!cellRange) {
                    return;
                }

                const cellStart = cellRange.cellStart,
                    cellEnd = cellRange.cellEnd;
                let targetWidth = parseFloat(target.style.width) || target.offsetWidth,
                    targetLeft = parseFloat(target.style[that.rightToLeft ? 'right' : 'left']) || target.offsetLeft;

                if (that.hasAttribute('dragged')) {
                    const distanceToCellEnd = cellEnd.width - (targetLeft + targetWidth - cellEnd.left);

                    if (targetLeft - cellStart.left <= distanceToCellEnd) {
                        target.style[that.rightToLeft ? 'right' : 'left'] = cellStart.left + 'px';
                    }
                    else {
                        target.style[that.rightToLeft ? 'right' : 'left'] = (targetLeft + distanceToCellEnd) + 'px';
                    }
                }
                else if (that.hasAttribute('resized')) {
                    const minSize = cellStart === cellEnd ? parseFloat(getComputedStyle(that).getPropertyValue('--smart-gantt-chart-timeline-task-min-width')) || 0 : 0;
                    let sizeDiff;

                    if (that.$.timeline.getAttribute('task-bar-hovered') === 'left') {
                        sizeDiff = targetLeft - cellStart.left;
                        sizeDiff = sizeDiff - (sizeDiff >= cellStart.width / 2 ? (cellStart.width - minSize) : 0);
                        target.style[that.rightToLeft ? 'right' : 'left'] = (targetLeft -= sizeDiff) + 'px';

                        if (targetLeft + targetWidth > cellEnd.left + cellEnd.width / 2) {
                            sizeDiff = cellEnd.left + cellEnd.width - (targetLeft + targetWidth);
                        }
                        else {
                            sizeDiff = cellEnd.left - (targetLeft + targetWidth);
                        }

                        target.style.width = Math.max(minSize, targetWidth + sizeDiff) + 'px';
                    }
                    else {
                        if (targetLeft > cellStart.left + cellStart.width / 2) {
                            target.style[that.rightToLeft ? 'right' : 'left'] = cellStart.left + cellStart.width + 'px';
                        }
                        else {
                            target.style[that.rightToLeft ? 'right' : 'left'] = cellStart.left + 'px';
                        }

                        targetLeft = parseFloat(target.style[that.rightToLeft ? 'right' : 'left']) || target.offsetLeft;

                        sizeDiff = targetLeft + targetWidth - cellEnd.left;
                        sizeDiff = -1 * (sizeDiff - (sizeDiff >= cellStart.width / 2 ? (cellEnd.width) : minSize));

                        target.style.width = (targetWidth + sizeDiff) + 'px';
                    }
                }

                that._refreshTask(target);

                const task = target._task;

                if (task.type !== 'project' || !task.dragProject) {
                    return;
                }

                const projectTasks = task.tasks;

                if (!projectTasks || !Array.isArray(projectTasks)) {
                    return;
                }

                for (let t = 0; t < projectTasks.length; t++) {
                    const timelineTaskBar = that.$.timelineTasksContainer.children[that._tasks.indexOf(projectTasks[t])];

                    if (timelineTaskBar) {
                        that._snapToNearest(timelineTaskBar);
                    }
                }
            }
        }
    }

    /**
    * Sets the limits for resizing and dragging. Adds them to the _dragDetails object
    * @param {any} target
    */
    _setDragLimits(target) {
        const that = this;

        if (!that._dragDetails) {
            return;
        }

        const timelineTask = that._dragDetails.timelineTask;

        if (!timelineTask || !target) {
            return;
        }

        const resizeSide = that.$.timeline.getAttribute('task-bar-hovered'),
            task = timelineTask._task;

        //If hovered set min/max limits
        if (resizeSide) {
            if (task.disableResize) {
                delete that._dragDetails;
                return;
            }

            const sizeLimits = that._getTaskBarSizeLimits(timelineTask, resizeSide);

            that._dragDetails.min.width = sizeLimits.min;
            that._dragDetails.max.width = sizeLimits.max;

            const minDelimeter = that._createDelimiter('min', resizeSide),
                maxDelimeter = that._createDelimiter('max', resizeSide);

            if (minDelimeter) {
                timelineTask.appendChild(minDelimeter);
            }

            if (maxDelimeter) {
                timelineTask.appendChild(maxDelimeter);
            }
        }
        else if (target.closest('.smart-task-connection-point')) {
            that._dragDetails.timelineTask = undefined;
        }
        else if (target.closest('.smart-timeline-task') === timelineTask) {
            if (task.disableDrag || (timelineTask.hasAttribute('connected') && that.autoSchedule && that.autoScheduleStrictMode)) {
                delete that._dragDetails.target;
                return;
            }

            that._dragDetails._taskDuration = that._getWorkingTime(task.dateStart, task.dateEnd);

            if (timelineTask.classList.contains('milestone')) {
                that._dragDetails.target = timelineTask.getElementsByClassName('smart-timeline-task-fill')[0];
            }

            const dragLimits = that._getTaskDragLimits(timelineTask),
                timelineTaskOffset = that.rightToLeft ? that.$.timelineContent.offsetWidth - timelineTask.offsetLeft - timelineTask.offsetWidth : timelineTask.offsetLeft;

            if (dragLimits.min !== undefined) {
                that._dragDetails.min.left = dragLimits.min;

                if (timelineTask._task.type === 'project' && dragLimits.min > timelineTaskOffset) {
                    that._dragDetails.min.left = timelineTaskOffset;
                }
            }

            if (dragLimits.max !== undefined) {
                that._dragDetails.max.left = dragLimits.max;

                if (timelineTask._task.type === 'project' && dragLimits.max < timelineTaskOffset) {
                    that._dragDetails.max.left = timelineTaskOffset;
                }
            }

            if (task.type === 'project' && task.dragProject && !that.synchronized) {
                const subTaskLimits = that._getSubTaskLimits(timelineTask);

                if (subTaskLimits.min !== undefined) {
                    that._dragDetails.min.left = that._dragDetails.min.left ? Math.max(that._dragDetails.min.left, subTaskLimits.min) : subTaskLimits.min;
                }

                if (subTaskLimits.max !== undefined) {
                    that._dragDetails.max.left = that._dragDetails.max.left ? Math.min(that._dragDetails.max.left, subTaskLimits.max) : subTaskLimits.max;
                }
            }
            else if (task.type === 'milestone') {
                that._dragDetails.target = timelineTask.getElementsByClassName('smart-timeline-task-fill')[0];
            }
        }
        else {
            that._dragDetails.timelineTask = undefined;
        }

        that._dragDetails.relatedConnections = {};
    }

    /**
    * Configures the Scroll Bars on initialization
    */
    _setScrollBars() {
        const that = this;

        if (!that._scrollView) {
            that._scrollView = new Smart.Utilities.Scroll(that, that.$.horizontalScrollBar, that.$.verticalScrollBar);
        }

        const vScrollBar = that._scrollView.vScrollBar,
            hScrollBar = that._scrollView.hScrollBar;

        hScrollBar.$.addClass('smart-hidden');
        vScrollBar.$.addClass('smart-hidden');

        //Cancel Style/Resize observers of the ScrollBars
        vScrollBar.hasStyleObserver = false;
        hScrollBar.hasStyleObserver = false;
        vScrollBar.hasResizeObserver = false;
        hScrollBar.hasResizeObserver = false;

        hScrollBar.wait = false;

        //Refreshes the ScrollBars
        that._refresh();
    }

    /**
     * Returns the working time between two dates
     * @param {any} dateStart - start date
     * @param {any} dateEnd - end date
     */
    _getWorkingTime(dateStart, dateEnd) {
        if (!dateStart || !dateEnd) {
            return;
        }

        const that = this;

        //Calculates the actual workingTime in miliseconds
        function getWorkingTime(dateStart, dateEnd) {
            let dateTime = dateEnd.getTime() - dateStart.getTime(),
                tempDate = new Date(dateStart), timeLeft, nextDate, workingTime = 0;

            while (dateTime > 0) {
                const timeDiff = Math.min(dateTime, 60 * 60 * 1000 - (tempDate.getMinutes() * 60 * 1000 + tempDate.getSeconds() * 1000 + tempDate.getMilliseconds()));

                if (that.nonworkingDays.indexOf(tempDate.getDay()) > -1) {
                    nextDate = new Date(tempDate);
                    nextDate.setHours(0, 0, 0, 0);
                    nextDate.setDate(tempDate.getDate() + 1);

                    timeLeft = Math.min(timeDiff, nextDate.getTime() - tempDate.getTime());

                    tempDate = new Date(tempDate.getTime() + timeLeft);
                    dateTime -= timeLeft;
                    continue;
                }

                if (that.nonworkingHours.indexOf(tempDate.getHours()) > -1) {
                    nextDate = new Date(tempDate);

                    const currentTime = nextDate.getTime();

                    nextDate.setHours(tempDate.getHours() + 1, 0, 0, 0);

                    //Safari bug fix
                    if (currentTime === nextDate.getTime()) {
                        nextDate.setHours(tempDate.getHours() + 2, 0, 0, 0);
                    }

                    timeLeft = Math.min(timeDiff, nextDate.getTime() - tempDate.getTime());

                    tempDate = new Date(tempDate.getTime() + timeLeft);
                    dateTime -= timeLeft;
                    continue;
                }

                workingTime += timeDiff;
                dateTime -= timeDiff;
                tempDate = new Date(tempDate.getTime() + timeDiff);
            }

            return workingTime;
        }

        if (dateStart.getFullYear() === dateEnd.getFullYear()) {
            return getWorkingTime(dateStart, dateEnd);
        }

        //Optimized malgorithm for calculating the working days of long date ranges
        let firstDateEnd = new Date(dateStart.getFullYear() + 1, 0, 1, 0, 0, 0, 0);

        //WorkHours from the starting date till the end of the year
        let workTime = getWorkingTime(dateStart, firstDateEnd);

        if (dateEnd.getFullYear() > firstDateEnd.getFullYear()) {
            const yearsTillEnd = Math.max(0, dateEnd.getFullYear() - (firstDateEnd.getFullYear()));

            for (let y = 0; y < yearsTillEnd; y++) {
                let workDaysInAnYear = that._getWorkingDaysBetweenDays(firstDateEnd);

                //Remove the nonworking hours from the calculation
                workTime += ((workDaysInAnYear * 24) - workDaysInAnYear * that.nonworkingHours.length) * 60 * 60 * 1000;

                firstDateEnd.setFullYear(firstDateEnd.getFullYear() + 1);
            }
        }

        //WorkHours from the beginning of the end year till the end time
        workTime += getWorkingTime(firstDateEnd, dateEnd);

        return workTime;
    }

    /**
     * Calculates the working days of an year
     * @param {any} date
     */
    _getWorkingDaysBetweenDays(date) {
        const that = this,
            year = date.getFullYear(),
            daysInYear = (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) ? 366 : 365;

        let tempDate = new Date(date),
            workingDays = 0;

        for (let d = 0; d < daysInYear; d++) {
            if (that.nonworkingDays.indexOf(tempDate.getDay()) < 0) {
                workingDays++;
            }

            tempDate.setDate(tempDate.getDate() + 1);
        }

        return workingDays;
    }
    /**
    * Sets the tab index
    */
    _setFocusable() {
        const that = this;

        if (that.disabled || that.unfocusable) {
            that.tabIndex = -1;
            return;
        }

        that.tabIndex = that.tabIndex > 0 ? that.tabIndex : 0;
    }

    /**
    * Set the label of the TaskBar
    * @param {any} task - the actual task from the dataSource
    * @param {any} label - a new custom label. (Optional)
    */
    _setTaskBarLabel(task, label) {
        const that = this,
            taskBar = (that.shadowRoot || that).querySelectorAll('.smart-timeline-task')[that._tasks.indexOf(task)];

        if (!taskBar) {
            return;
        }

        const taskLabel = taskBar.getElementsByClassName('smart-timeline-task-label')[0];

        if (!taskLabel) {
            return;
        }

        taskLabel.innerHTML = label || task.label;
    }

    /**
     * Sets the progress of the Task Bar
     * @param {any} task
     */
    _setTaskBarProgress(task) {
        const that = this,
            taskBar = (that.shadowRoot || that).querySelectorAll('.smart-timeline-task')[that._tasks.indexOf(task)];

        if (!taskBar) {
            return;
        }

        let progress = task.progress;
        const taskProgressBar = taskBar.querySelector('.smart-timeline-task-progress'),
            taskBarThumb = taskBar.querySelector('.smart-timeline-task-progress-thumb');

        if (!taskProgressBar) {
            return;
        }

        taskBarThumb.style[that.rightToLeft ? 'left' : 'right'] = '';
        taskBarThumb.style[that.rightToLeft ? 'right' : 'left'] = taskProgressBar.style.width = (Math.min(100, Math.max(0, progress)) || 0) + '%';
    }

    /**
     * Configures the Timeline Task Bar's settings like size, progress, etc.
     */
    _setTimelineTaskBar(taskDetails, reset) {
        const that = this,
            taskBarIndex = that._tasks.indexOf(taskDetails),
            taskBars = that.$.timelineTasksContainer.children,
            taskBar = taskBars[taskBarIndex];

        let cellStart, cellEnd;

        if (taskBars.length === 0 || !taskBar) {
            return;
        }

        cellStart = (!reset && taskBar._cellStart) || that._getTimelineCellByDate(taskDetails.dateStart instanceof Date ? taskDetails.dateStart : new Date(taskDetails.dateStart));
        cellEnd = (!reset && taskBar._cellEnd) || that._getTimelineCellByDate(taskDetails.dateEnd instanceof Date ? taskDetails.dateEnd : new Date(taskDetails.dateEnd));

        taskBar._cellStart = cellStart;
        taskBar._cellEnd = cellEnd;

        const taskBarDetails = that._getTaskBarDetails(taskBar);

        if (taskBarDetails) {
            taskBar.style.top = taskBarDetails.top + 'px';
            //Reset from RTL
            taskBar.style[that.rightToLeft ? 'left' : 'right'] = '';
            taskBar.style[that.rightToLeft ? 'right' : 'left'] = taskBarDetails.left + 'px';
            taskBar.style.width = taskBarDetails.width + 'px';
        }

        if (taskDetails.project && !that._isTaskExpanded(taskDetails)) {
            taskBar.classList.add('smart-visibility-hidden');
        }
        else {
            taskBar.classList.remove('smart-visibility-hidden');
        }
    }

    /**
     * Returns the timeline cell according to a date
     */
    _getTimelineCellByDate(targetDate) {
        const that = this,
            dateCells = that._timelineCells;

        if (!dateCells || dateCells.length === 0) {
            return;
        }

        for (let m = 0; m < dateCells.length; m++) {
            const cell = dateCells[m],
                cellDate = cell.date;

            switch (that.view) {
                case 'year':
                    if (cellDate.getFullYear() === targetDate.getFullYear() && cellDate.getMonth() === targetDate.getMonth()) {
                        return cell;
                    }

                    break;
                case 'month': {
                    const startDate = new Date(cellDate);
                    let endDate = new Date(cellDate);

                    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()) + 1);
                    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

                    if (targetDate.getTime() >= startDate.getTime() && targetDate.getTime() <= endDate.getTime()) {
                        return cell;
                    }

                    break;
                }
                case 'week':
                    if (cellDate.getFullYear() === targetDate.getFullYear() && cellDate.getMonth() === targetDate.getMonth() &&
                        cellDate.getDate() === targetDate.getDate()) {
                        return cell;
                    }

                    break;
                case 'day':
                    if (cellDate.getFullYear() === targetDate.getFullYear() && cellDate.getMonth() === targetDate.getMonth() &&
                        cellDate.getDate() === targetDate.getDate() && cellDate.getHours() === targetDate.getHours()) {
                        return cell;
                    }

                    break;
            }
        }
    }

    /**
     * Refreshes the size and position of the header view detail cells
     * @param {any} cell
     * @param {any} cellIndex
     */
    _refreshViewDetailCell(viewDetailObj, timelineCellIndex, index) {
        const that = this,
            timelineCells = that._timelineCells,
            date = viewDetailObj.date;
        let cellWidth = 0, left = index === 0 ? 0 : undefined;

        if (timelineCellIndex === undefined) {
            timelineCellIndex = 0;
        }

        for (timelineCellIndex; timelineCellIndex < timelineCells.length; timelineCellIndex++) {
            const timelineCellObj = timelineCells[timelineCellIndex],
                width = that._getCellWidth(timelineCellObj, date);

            if (!width) {
                if (timelineCellObj.date.getTime() > date.getTime()) {
                    break;
                }
                else {
                    continue;
                }
            }

            if (left === undefined) {
                left = timelineCellObj.left + timelineCellObj.width - width;
            }

            cellWidth += width;
        }

        if (that._isLastWeekCellNotFull) {
            delete that._isLastWeekCellNotFull;
            timelineCellIndex--;
        }

        viewDetailObj.width = cellWidth;
        //viewDetailObj.width = cellWidth + (timelineCellIndex - 2);
        viewDetailObj.left = left;

        return timelineCellIndex;
    }

    /**
     * Returns the widh
     * @param {any} cell
     * @param {any} date2
     */
    _getCellWidth(cell, date2) {
        const that = this,
            date1 = cell.date,
            isSameYear = (date1, date2) => (date1.getFullYear() === date2.getFullYear()),
            isSameMonth = (date1, date2) => (date1.getMonth() === date2.getMonth()),
            cellWidth = cell.width;

        switch (that.view) {
            case 'month':
                {
                    let cellStartDate = new Date(date1),
                        cellEndDate = new Date(cellStartDate),
                        weekDays = 0;

                    cellEndDate.setDate(cellEndDate.getDate() + (6 - cellStartDate.getDay()) + 1);
                    cellEndDate.setMilliseconds(cellEndDate.getMilliseconds() - 1);

                    while (cellStartDate.getTime() <= cellEndDate.getTime()) {
                        if (isSameYear(cellStartDate, date2) && isSameMonth(cellStartDate, date2)) {
                            weekDays++;
                        }

                        cellStartDate.setDate(cellStartDate.getDate() + 1);
                    }

                    if (weekDays === 0) {
                        return;
                    }

                    //Used to determine if the cell should be checked again for next month
                    that._isLastWeekCellNotFull = weekDays / 7 !== 1;

                    return cellWidth * weekDays / 7;
                }
            case 'year':
                if (isSameYear(date1, date2)) {
                    return cellWidth;
                }

                break;
            case 'week':
                {
                    const weekStartDate = new Date(date2),
                        weekEndDate = new Date(date2);

                    weekStartDate.setDate(date2.getDate() - date2.getDay());
                    weekEndDate.setDate(date2.getDate() + (6 - date2.getDay()));

                    if (date1.getTime() >= weekStartDate.getTime() && date1.getTime() <= weekEndDate.getTime()) {
                        return cellWidth;
                    }

                    break;
                }
            case 'day':
                if (isSameYear(date1, date2) && isSameMonth(date1, date2) && date1.getDate() === date2.getDate()) {
                    return cellWidth;
                }
                break;
        }
    }

    /**
     * Returns the timeline cell according to the offsetleft
     * @param {any} offsetLeft
     */
    _getCellByOffsetLeft(offsetLeft) {
        const that = this,
            timelineCells = that._timelineCells;

        if (!offsetLeft) {
            return;
        }

        let targetCell;

        for (let i = 0; i < timelineCells.length; i++) {
            if (timelineCells[i].left >= offsetLeft) {
                break;
            }

            targetCell = timelineCells[i];
        }

        return targetCell;
    }

    /**
     * Unselects all Tasks
     */
    _unselectAllTasks(noEventFiring) {
        const that = this,
            timelineTasksContainer = that.$.timelineTasksContainer,
            timelineCellsContainer = that.$.timelineCellsContainer;

        //Unselect all timeline cells
        if (timelineCellsContainer.querySelector('.smart-timeline-task-cell[selected]')) {
            const allTimelineCells = timelineCellsContainer.children;

            for (let t = 0; t < allTimelineCells.length; t++) {
                allTimelineCells[t].removeAttribute('selected');
            }
        }

        //Unselect all Timeline tasks
        if (timelineTasksContainer.querySelector('.smart-timeline-task[selected]')) {
            const allTimelineTasks = timelineTasksContainer.children;

            for (let t = 0; t < allTimelineTasks.length; t++) {
                allTimelineTasks[t].removeAttribute('selected');
                allTimelineTasks[t].setAttribute('aria-selected', 'false');
            }
        }

        //Handle Tree task unselection
        if (!that._treeChangeEventFired) {
            that.$.taskTree.clearSelection();
        }

        const labelContainers = that.$.treeSplitter.getElementsByClassName('smart-task-label-container');

        //Remove hovered state from all items
        for (let i = 0; i < labelContainers.length; i++) {
            labelContainers[i].removeAttribute('selected');
        }

        if (noEventFiring) {
            return;
        }

        const oldSelection = that.selectedIndexes.slice(0);

        if (oldSelection.length) {
            that.selectedIndexes = [];

            that.$.fireEvent('change', { value: [], oldValue: oldSelection })
        }
    }

    /**
    * Returns the Timeline cells that contains the start and end dates of the taskBar
    * @param {any} position - the numeric representation of the x coordinate of the target
    */
    _getTaskBarCellRange(taskBar) {
        const that = this;

        if (!taskBar.classList || !taskBar.classList.contains('smart-timeline-task')) {
            return;
        }

        let taskBarWidth = parseFloat(taskBar.style.width) || taskBar.offsetWidth;

        const timelineCells = that._timelineCells,
            timelineContent = that.$.timelineContent,
            taskBarLeft = parseFloat(taskBar.style[that.rightToLeft ? 'right' : 'left']) ||
                (that.rightToLeft ? (parseFloat(timelineContent.style.width) || timelineContent.offsetWidth) - (taskBar.offsetLeft + taskBar.offsetWidth) : taskBar.offsetLeft);
        let cellStart, cellEnd;

        if (!taskBarWidth && taskBar.classList.contains('milestone')) {
            taskBarWidth = taskBar.offsetHeight / 2;
        }

        for (let c = 0; c < timelineCells.length; c++) {
            const cell = timelineCells[c],
                cellLeft = cell.left,
                cellWidth = cell.width,
                cellRight = parseFloat((cellLeft + cellWidth).toFixed(2)),
                taskBarRight = parseFloat((taskBarLeft + taskBarWidth).toFixed(2));

            if (!cellStart && taskBarLeft >= cellLeft && taskBarLeft <= cellRight) {
                cellStart = cell;
            }

            if (!cellEnd && taskBarRight > cellLeft && taskBarRight <= cellRight) {
                cellEnd = cell;
            }

            if (cellStart && cellEnd) {
                break;
            }
        }

        if (!cellStart) {
            cellStart = taskBar.classList.contains('milestone') && cellEnd ? cellEnd : timelineCells[0];
        }

        if (!cellEnd) {
            cellEnd = timelineCells[timelineCells.length - 1];
        }

        return { cellStart: cellStart, cellEnd: cellEnd };
    }

    /**
    * Returns the Date according to the offset
    * @param {any} offset - taskBar offsetLeft
    * @param {any} cell - the target cell
    */
    _getDateFromCell(offset, cell, view) {
        if (!cell) {
            return new Date();
        }

        const that = this,
            cellDate = new Date(cell.date);
        let timeInterval,
            startDay = 0,
            startHour = 0;

        if (!view) {
            view = that.view;
        }

        switch (view) {
            case 'year': {
                //Description: Shows the months of the year
                timeInterval = new Date(cellDate.getFullYear(), cellDate.getMonth() + 1, 0).getDate();
                startDay = 1;
                break;
            }
            case 'month': {
                //Description: Shows the first day of each week
                startDay = cellDate.getDate();
                timeInterval = 7;
                break;
            }
            case 'week':
                //Description: Shows the days of the week
                timeInterval = 1;
                startDay = cellDate.getDate();
                break;
            case 'day':
                //Description: Shows the Time of the day
                timeInterval = 1 / 24;
                startDay = cellDate.getDate();
                startHour = cellDate.getHours();
                break;
        }

        const dayProportion = parseFloat((((offset - cell.left) / cell.width) * timeInterval).toFixed(12)),
            day = Math.min(timeInterval, Math.floor(dayProportion)),
            hoursProportion = dayProportion % 1 * 24,
            hours = Math.floor(hoursProportion),
            minutesProportion = Math.abs((hoursProportion - hours)) * 60,
            minutes = Math.floor(minutesProportion),
            secondsProportion = Math.abs((minutesProportion - minutes)) * 60,
            seconds = Math.floor(secondsProportion),
            miliSecondProportion = Math.abs((secondsProportion - seconds)) * 1000,
            miliSeconds = Math.floor(miliSecondProportion);

        return new Date(cellDate.getFullYear(), cellDate.getMonth(), startDay + day, startHour + hours, minutes, seconds, miliSeconds);
    }

    /**
     * Creates a dataSource for the Tree custom element
     * @param {any} tasks
     */
    _createTreeTasks(tasks, attrName) {
        if (!tasks) {
            return [];
        }

        let treeTasks = [];

        for (let t = 0; t < tasks.length; t++) {
            const treeTask = {};

            treeTask.label = tasks[t][attrName];

            if (tasks[t].tasks) {
                treeTask.items = this._createTreeTasks(tasks[t].tasks, attrName);
            }

            treeTasks.push(treeTask);
        }

        return treeTasks;
    }

    /**
     * Returns the JSON structure of the items
     */
    _getTasksJSON() {
        const that = this,
            tasks = that._tasks;

        function cloneObject(obj) {
            let newObj = {};

            for (let prop in obj) {
                let objValue = obj[prop];

                if (prop === 'project') {
                    continue;
                }

                //if (Array.isArray(objValue)) {
                //    newObj[prop] = objValue.map(taskObj => cloneObject(taskObj));
                //}
                //else {
                newObj[prop] = objValue instanceof Date ? objValue.toISOString() : objValue;
                //}
            }

            return newObj;
        }

        function getTasksJSON(tasks, project) {
            if (!tasks) {
                return;
            }

            let tasksJSON = [];

            for (let t = 0; t < tasks.length; t++) {
                const task = tasks[t];
                let clonedObject;

                if (!task.project || task.project === project) {
                    clonedObject = cloneObject(task);
                    clonedObject.tasks = getTasksJSON(task.tasks, task);

                    tasksJSON.push(clonedObject);
                }
            }

            return tasksJSON;
        }

        return getTasksJSON(tasks);
    }

    /**
     * Refresh the Task Tree and the other task columns. Updates the headers and fills the cells with content
     */
    _createTaskColumns() {
        const that = this,
            tasks = that._getTasksJSON(),
            columnHeadersDetails = that.taskColumns,
            columnHeaders = that.$.treeSplitter.getElementsByClassName('smart-task-tree-header');

        if (columnHeadersDetails.length > columnHeaders.length) {
            while (columnHeadersDetails.length > columnHeaders.length) {
                const splitterItem = document.createElement('smart-splitter-item');

                splitterItem.innerHTML = '<div class="smart-task-tree-header"></div><div class="smart-task-tree-content">';
                that.$.treeSplitter.appendChild(splitterItem);
            }
        }
        else {
            while (columnHeaders.length > columnHeadersDetails.length) {
                if (columnHeaders.length === 1) {
                    break;
                }

                that.$.treeSplitter.removeChild(that.$.treeSplitter.lastElementChild);
            }
        }

        if (!columnHeadersDetails.length) {
            that.$.taskTree.dataSource = [];
            columnHeaders[0].innerHTML = '';
            return;
        }

        const columnsCount = columnHeadersDetails.length,
            columnMinWidth = parseFloat(getComputedStyle(that).getPropertyValue('--smart-gantt-chart-timeline-cell-min-size') || 0);

        for (let i = 0; i < columnsCount; i++) {
            const headerDetails = columnHeadersDetails[i],
                columnHeader = columnHeaders[i],
                columnHeaderSplitterItem = columnHeader.closest('smart-splitter-item');

            columnHeader.innerHTML = that.localize(headerDetails.label) || headerDetails.label;

            if (columnHeaderSplitterItem) {
                if (headerDetails.size) {
                    if (that.shadowRoot) {
                        requestAnimationFrame(() => columnHeaderSplitterItem.size = headerDetails.size);
                    }
                    else {
                        columnHeaderSplitterItem.size = headerDetails.size;
                    }
                }

                //columnHeaderSplitterItem.size = headerDetails.size ? headerDetails.size : 100 / columnsCount + '%';
                columnHeaderSplitterItem.min = headerDetails.min ? headerDetails.min : columnMinWidth;
                columnHeaderSplitterItem.max = headerDetails.max ? headerDetails.max : columnHeaderSplitterItem.max;
            }

            //if (columnHeader._value !== headerDetails.value) {
            that._createTaskColumnsData(columnHeaderSplitterItem, headerDetails, tasks);
            //columnHeader._value = headerDetails.value;
            //}
        }

        if (that.$.mainSplitter.isCompleted) {
            that.$.mainSplitter.refresh();
        }

        that._refresh();
    }

    /**
     * Refreshes the labels of the headers of the Columns
     */
    _refreshColumnsHeaders() {
        const that = this,
            columnHeadersDetails = that.taskColumns,
            columnHeaders = that.$.treeSplitter.getElementsByClassName('smart-task-tree-header');

        for (let i = 0; i < columnHeaders.length; i++) {
            columnHeaders[i].innerHTML = that.localize(columnHeadersDetails[i].label) || columnHeadersDetails[i].label;
        }
    }

    /**
     * Populates the Task Tree with data
     * @param {any} splitterItem - the parent splitter of a task tree column
     * @param {any} headerDetails - object containing the details for the column data
     * @param {any} tasks - JSON array of the tasks inside the element
     */
    _createTaskColumnsData(splitterItem, headerDetails, tasks) {
        const that = this;

        if (!splitterItem) {
            return;
        }

        const value = headerDetails.value;

        if (that.$.taskTreeSplitterItem === splitterItem) {
            if (value) {
                that.$.taskTree.itemsMember = 'tasks';
                that.$.taskTree.displayMember = headerDetails.value;

                //Updates the dataSource of the tree element
                that.$.taskTree.dataSource = tasks.map((task) => {
                    task[headerDetails.value] = that._formatColumnData(task, headerDetails)
                    return task;
                });
            }
            else {
                that.$.taskTree.dataSource = [];
            }

            return;
        }

        const dataContainer = splitterItem.getElementsByClassName('smart-task-tree-content')[0];

        if (!dataContainer) {
            return;
        }

        dataContainer.innerHTML = '';

        if (!value) {
            return;
        }

        dataContainer.appendChild(that._createTaskContainers(tasks, headerDetails));
    }

    /**
     * Creates a Task Tree container
     * @param {any} tasks - tasks array
    * @param {any} tasks - header Details
     */
    _createTaskContainers(tasks, headerDetails) {
        const that = this,
            fragment = document.createDocumentFragment();

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i],
                taskContainer = document.createElement('div');

            taskContainer.innerHTML = '<div class="smart-task-label-container"></div>';
            taskContainer.firstElementChild.innerHTML = that._formatColumnData(tasks[i], headerDetails);

            if (task.tasks && task.tasks.length > 0) {
                taskContainer.innerHTML += '<div class="smart-task-drop-down' + (!task.expanded ? ' smart-visibility-hidden' : '') + '"></div>';
                taskContainer.lastElementChild.appendChild(that._createTaskContainers(task.tasks, headerDetails));
            }

            taskContainer.classList.add('smart-task-item');

            //Accessibility
            if (!taskContainer.id) {
                taskContainer.setAttribute('id', 'taskItem' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
            }

            fragment.appendChild(taskContainer);
        }

        return fragment;
    }

    /**
     * Formats the column data
     * @param {any} data
     * @param {any} headerDetails
     */
    _formatColumnData(task, headerDetails) {
        const that = this,
            data = task[headerDetails.value];

        if (typeof headerDetails.formatFunction === 'function') {
            return headerDetails.formatFunction(headerDetails.value.toLowerCase().indexOf('date') > -1 ? new Date(data) : data, that._tasks.indexOf(task));
        }

        if (headerDetails.value) {
            const headerValue = (headerDetails.value + '').toLowerCase();

            if (headerValue.indexOf('date') > -1) {
                const date = Date.parse(data);

                if (!isNaN(date)) {
                    return new Date(date).toLocaleDateString(that.locale, { year: 'numeric', month: '2-digit', day: 'numeric' })
                }
            }
            else if (headerValue.indexOf('duration') > -1) {
                //return parseFloat(that._convertDuration(data, true).toFixed(1));
                return parseFloat(data.toFixed(1));
            }
        }

        return data !== undefined ? data.toString() : '';
    }

    /**
     * Validates the properties of the task
     * @param {any} task
     */
    _validateTaskProperties(task, project) {
        const that = this;

        function validateDate(task, date) {
            task[date] = that._dateValidator(undefined, task[date]);

            if (!task[date] || isNaN(task[date].getTime())) {
                task[date] = undefined;
            }

            return task[date];
        }

        //TODO: Validate min/max dateStart/dateEnd if project is true

        //Validate duration
        let duration = that._convertDuration(parseInt(task.duration)) || 0,
            minDuration = that._convertDuration(parseInt(task.minDuration)) || 0,
            maxDuration = that._convertDuration(parseInt(task.maxDuration)) || 0;

        if (minDuration && maxDuration) {
            maxDuration = Math.max(minDuration, maxDuration);
        }

        if (duration) {
            if (minDuration) {
                duration = Math.max(minDuration, duration);
            }
            else if (maxDuration) {
                duration = Math.min(duration, maxDuration);
            }
        }

        //Set the validated duration in the appropriate unit accordint to durationUnit
        task.duration = that._convertDuration(duration, true)
        task.minDuration = that._convertDuration(minDuration, true);
        task.maxDuration = that._convertDuration(maxDuration, true);

        //Validates minDateStart/maxDateStart
        task.minDateStart = validateDate(task, 'minDateStart');
        task.maxDateStart = validateDate(task, 'maxDateStart');

        if (task.minDateStart && task.maxDateStart) {
            task.maxDateStart = new Date(Math.max(task.minDateStart.getTime(), task.maxDateStart.getTime()));
        }

        task.minDateEnd = validateDate(task, 'minDateEnd');
        task.maxDateEnd = validateDate(task, 'maxDateEnd');

        if (task.minDateEnd && task.maxDateEnd) {
            task.maxDateEnd = new Date(Math.max(task.minDateEnd.getTime(), task.maxDateEnd.getTime()));
        }

        //Validate dateStart/dateEnd
        task.dateStart = validateDate(task, 'dateStart');
        task.dateEnd = validateDate(task, 'dateEnd');

        if (!task.dateStart) {
            if (task.minDateStart) {
                task.dateStart = task.minDateStart;
            }
            else if (task.maxDateStart) {
                task.dateStart = task.maxDateStart;
            }
        }

        if (!task.dateEnd) {
            if (task.minDateEnd) {
                task.dateEnd = task.minDateEnd;
            }
            else if (task.maxDateEnd) {
                task.dateEnd = task.maxDateEnd;
            }
        }

        if (task.minDateStart) {
            task.dateStart = new Date(Math.max(task.minDateStart.getTime(), task.dateStart.getTime()));
        }

        if (task.maxDateStart) {
            task.dateStart = new Date(Math.min(task.maxDateStart.getTime(), task.dateStart.getTime()));
        }

        if (task.minDateEnd) {
            task.dateEnd = new Date(Math.max(task.minDateEnd.getTime(), task.dateEnd.getTime()));
        }

        if (task.maxDateEnd) {
            task.dateEnd = new Date(Math.min(task.maxDateEnd.getTime(), task.dateEnd.getTime()));
        }

        if (task.dateStart) {
            if (that.min) {
                duration = Math.min(task.dateStart.getTime() - that.min.getTime(), duration);
            }

            if (that.max) {
                duration = Math.min(that.max.getTime() - task.dateStart.getTime(), duration);
            }
        }

        if (!task.dateStart && duration && task.dateEnd) {
            task.dateStart = new Date(task.dateEnd.getTime() - duration);
        }

        if (task.type === 'task' && (!task.dateStart || isNaN(task.dateStart.getTime())) && project) {
            task.dateStart = new Date(project.dateStart);
        }

        //Validate agains the minDuration
        if (minDuration && task.dateStart) {
            if (that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0) {
                const minDateEnd = that._getTaskWorkingDateEnd(task, minDuration);

                task.dateEnd = new Date(Math.max(task.dateEnd ? task.dateEnd.getTime() : 0, minDateEnd.getTime()));
            }
            else {
                task.dateEnd = new Date(Math.max(task.dateEnd ? task.dateEnd.getTime() : 0, task.dateStart.getTime() + duration));
            }
        }

        if (duration && task.dateStart) {
            //Validate accroding to workDays/workHours
            task.dateEnd = that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0 ? that._getTaskWorkingDateEnd(task, duration) : new Date(task.dateStart.getTime() + duration);
        }

        if (duration || maxDuration) {
            let possibleMaxDate;

            if (that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0) {
                possibleMaxDate = that._getTaskWorkingDateEnd(task, Math.max(duration, maxDuration));
            }
            else {
                possibleMaxDate = new Date(task.dateStart.getTime() + Math.max(duration, maxDuration));
            }

            if (task.dateEnd.getTime() > possibleMaxDate.getTime()) {
                task.dateEnd = possibleMaxDate;
            }
        }

        if (task.type === 'task' && !task.dateEnd && project) {
            task.dateEnd = new Date(project.dateEnd);
        }

        //Validate agains min/max
        task.dateStart = that._minMaxDateValidator(task.dateStart);
        task.dateEnd = that._minMaxDateValidator(task.dateEnd);

        if (task.type === 'milestone') {
            task.dateStart = validateDate(task, 'dateStart');
            task.dateEnd = validateDate(task, 'dateEnd');

            task.dateStart = task.dateEnd = new Date(Math.max(task.dateStart ? task.dateStart.getTime() : 0, task.dateEnd ? task.dateEnd.getTime() : 0));
        }

        //Update the project's start/end
        if (project) {
            that._synchronizeProjectDates(project, task);
        }

        if (!task.dateStart && !task.dateEnd && (task.type === 'project' && !task.synchronized)) {
            return;
        }

        if (task.dateStart && task.dateEnd && task.dateStart.getTime() > task.dateEnd.getTime()) {
            task.dateEnd = new Date(task.dateStart.getTime() + 1000 * 60 * 60 * (that.view === 'day' ? 1 : 24));
        }

        if (task.dateStart && task.dateEnd) {
            task.duration = that._convertDuration(that.nonworkingDays.length > 0 || that.nonworkingHours.length > 0 ?
                that._getWorkingTime(task.dateStart, task.dateEnd) : task.dateEnd.getTime() - task.dateStart.getTime(), true);
        }

        //Validate the task connections
        const connections = task.connections;

        if (!(connections instanceof Array)) {
            task.connections = [];
        }
        else {
            for (let c = 0; c < connections.length; c++) {
                const con = connections[c],
                    target = con.target = typeof con.target === 'string' ? con.target : parseInt(con.target),
                    type = con.type = parseInt(con.type);

                if (!target || (typeof target === 'number' && isNaN(target)) || isNaN(type)) {
                    connections.splice(connections.indexOf(con), 1);
                    continue;
                }

                con.lag = parseInt(con.lag) || 0;
            }
        }

        task.class = task.class ? task.class + '' : '';
        task.class = task.class !== undefined && task.class !== null ? task.class : '';

        return task;
    }

    /**
     * Synchronizes the dateStart and dateEnd between synchronized Projects and their tasks
     * @param {any} project
     * @param {any} task
     */
    _synchronizeProjectDates(project, task) {
        const projectDateStart = project.dateStart,
            projectDateEnd = project.dateEnd;

        if (project.synchronized) {
            if (task.dateStart) {
                project.dateStart = projectDateStart ? new Date(Math.min(projectDateStart.getTime(), task.dateStart.getTime())) : task.dateStart;
            }

            if (task.dateEnd) {
                project.dateEnd = projectDateEnd ? new Date(Math.max(projectDateEnd.getTime(), task.dateEnd.getTime())) : task.dateEnd;
            }

            if (task.minDateStart) {
                project.minDateStart = project.minDateStart ? new Date(Math.max(project.minDateStart.getTime(), task.minDateStart.getTime())) : task.minDateStart;
            }

            if (task.maxDateStart) {
                project.maxDateStart = project.maxDateStart ? new Date(Math.min(project.maxDateStart.getTime(), task.maxDateStart.getTime())) : task.maxDateStart;
            }

            if (task.minDateEnd) {
                project.minDateEnd = project.minDateEnd ? new Date(Math.max(project.minDateEnd.getTime(), task.minDateEnd.getTime())) : task.minDateEnd;
            }

            if (task.maxDateEnd) {
                project.maxDateEnd = project.maxDateEnd ? new Date(Math.min(project.maxDateEnd.getTime(), task.maxDateEnd.getTime())) : task.maxDateEnd;
            }

            if (project.dateStart && project.dateEnd) {
                project.duration = this._convertDuration(project.dateEnd.getTime() - project.dateStart.getTime(), true);
            }
        }

        if (project.project) {
            this._synchronizeProjectDates(project.project, task);
        }
    }

    /**
     * Mouse wheel event handler
     * @param {any} event
     */
    _mouseWheelandler(event) {
        const that = this;

        if (!that.computedHorizontalScrollBarVisibility && !that.computedVerticalScrollBarVisibility) {
            return;
        }

        const popupWindow = (that.shadowRoot || that).querySelector('.smart-task-popup-window');

        if (popupWindow && popupWindow.modal && popupWindow.opened) {
            event.stopPropagation();
            return;
        }

        if (!that.disabled && that.computedVerticalScrollBarVisibility) {
            event.stopPropagation();
            event.preventDefault();
            that.scrollTo(that.scrollTop + that._getScrollCoefficient(event, that.offsetHeight));
        }
    }

    /**
     * Horizontal Scroll Bar Change handler
     * @param {any} event
     */
    _horizontalScrollbarHandler(event) {
        const that = this;

        event.stopPropagation();

        that.$.timeline.scrollLeft = that._getScrollLeft(event.detail.value);

        that._recycle(event);

        //if (event.context.max === event.context.value) {
        //    that.$.fireEvent('scrollLeftReached');
        //    return;
        //}

        //if (event.context.min === event.context.value) {
        //    that.$.fireEvent('scrollRightReached');
        //}
    }

    /**
     * Vertical Scroll Bar change handler
     * @param {any} event
     */
    _verticalScrollbarHandler(event) {
        const that = this;

        event.stopPropagation();

        that.$.timelineContent.scrollTop = event.detail.value;

        that._recycle(event);

        if (event.context.max === event.context.value) {
            that.$.fireEvent('scrollBottomReached');
            return;
        }

        if (event.context.min === event.context.value) {
            that.$.fireEvent('scrollTopReached');
        }
    }
});




