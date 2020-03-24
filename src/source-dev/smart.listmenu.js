
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * List Menu custom element.
 */
Smart('smart-list-menu', class ListMenu extends Smart.Menu {
    // List Menu's properties.
    static get properties() {
        return {
            'displayLoadingIndicator': {
                value: false,
                type: 'boolean'
            },
            'dropDownPosition': {
                value: 'auto',
                allowedValues: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'auto'],
                type: 'string'
            },
            'filterable': {
                value: false,
                type: 'boolean'
            },
            'filterInputPlaceholder': {
                value: '',
                type: 'string'
            },
            'filterMode': {
                value: 'containsIgnoreCase',
                allowedValues: ['contains', 'containsIgnoreCase', 'doesNotContain', 'doesNotContainIgnoreCase', 'equals', 'equalsIgnoreCase', 'startsWith', 'startsWithIgnoreCase', 'endsWith', 'endsWithIgnoreCase'],
                type: 'string'
            },
            'grouped': {
                value: false,
                type: 'boolean'
            },
            'loadingIndicatorPlaceholder': {
                value: 'Loading...',
                type: 'string'
            },
            'loadingIndicatorPosition': {
                value: 'center',
                allowedValues: ['bottom', 'center', 'top'],
                type: 'string'
            }
        };
    }

    /**
     * List Menu's event listeners.
     */
    static get listeners() {
        return {
            'resize': '_resizeHandler',
            'backButton.click': '_backButtonClickHandler',
            'filterInput.keyup': '_filterInputKeyupHandler',
            'mainContainer.down': '_mainContainerDownHandler',
            'mainContainer.move': '_mainContainerMoveHandler',
            'mainContainer.swipeleft': '_mainContainerSwipeHandler',
            'mainContainer.swiperight': '_mainContainerSwipeHandler',
            'view.click': '_viewHandler',
            'view.mouseout': '_viewHandler',
            'view.mouseover': '_viewHandler',
            'view.transitionend': '_viewHandler',
            'view.wheel': '_wheelHandler'
        };
    }

    /**
     * CSS files needed for the element (ShadowDOM)
     */
    static get styleUrls() {
        return [
            'smart.listmenu.css'
        ]
    }

    /**
     * List Menu's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div id="hamburgerIcon" class="smart-hamburger-icon smart-hidden" role="button" aria-label="Toggle minimized menu" aria-haspopup="true">
                        <div id="hamburgerIconLineTop" class="smart-hamburger-icon-line smart-hamburger-icon-line-top" role="presentation"></div>
                        <div id="hamburgerIconLineCenter" class="smart-hamburger-icon-line smart-hamburger-icon-line-center" role="presentation"></div>
                        <div id="hamburgerIconLineBottom" class="smart-hamburger-icon-line smart-hamburger-icon-line-bottom" role="presentation"></div>
                        <div id="customIconContainer" class="smart-hamburger-icon-custom-container smart-hidden" role="presentation"></div>
                    </div>
                    <div id="view" class="smart-list-menu-view" role="presentation">
                        <div id="header" class="smart-header smart-hidden" role="heading" aria-level="1">
                            <smart-button id="backButton" animation="[[animation]]" disabled="[[disabled]]" unfocusable right-to-left="[[rightToLeft]]" aria-label="Back">
                                <div id="backButtonArrow" class="smart-arrow ${this.rightToLeft ? 'smart-arrow-right' : 'smart-arrow-left'}" aria-hidden="true"></div>
                            </smart-button>
                            <div id="title" class="smart-title"></div>
                        </div>
                        <div class="smart-list-menu-filter-input-container smart-hidden" id="filterInputContainer" role="presentation"><input id="filterInput" class="smart-filter-input" disabled="[[disabled]]" placeholder="[[filterInputPlaceholder]]" type="text" role="searchbox" aria-label="[[filterInputPlaceholder]]" /></div>
                        <smart-repeat-button id="scrollButtonNear" class="smart-menu-scroll-button smart-spin-button smart-scroll-button-near smart-hidden" animation="[[animation]]" unfocusable aria-label="Scroll up">
                            <div id="arrowNear" class="smart-arrow smart-arrow-up" right-to-left="[[rightToLeft]]"></div>
                        </smart-repeat-button>
                        <div id="mainContainer" class="smart-menu-main-container" role="presentation">
                            <content></content>
                        </div>
                        <smart-repeat-button id="scrollButtonFar" class="smart-menu-scroll-button smart-spin-button smart-scroll-button-far smart-hidden" animation="[[animation]]" unfocusable right-to-left="[[rightToLeft]]" aria-label="Scroll down">
                            <div id="arrowFar" class="smart-arrow smart-arrow-down"></div>
                        </smart-repeat-button>
                        <div id="loadingIndicatorContainer" class="smart-loader-container smart-hidden" role="presentation">
                            <span id="loadingIndicator" class="smart-loader" role="img" aria-label="[[loadingIndicatorPlaceholder]]"></span>
                            <span id="loadingIndicatorPlaceHolder" class="smart-loader-label smart-hidden">[[loadingIndicatorPlaceholder]]</span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is attached to the DOM.
     */
    attached() {
        const that = this;

        super.attached();

        if (that.isCompleted && that.dropDownAppendTo !== null && that._minimized) {
            that._dropDownParent.appendChild(that.$.view);
        }
    }

    /**
     * Called when the element is detached from the DOM.
     */
    detached() {
        const that = this;

        super.detached();

        that._close();

        if (that.dropDownAppendTo !== null && that._minimized) {
            that._dropDownParent.removeChild(that.$.view);
        }
    }

    /**
     * Adds an item.
     *
     * @param {HTMLElement} item A smart-menu-item to add to the List Menu.
     * @param {HTMLElement/String} parent Optional The smart-menu-items-group (or its id or numeric path) to add the item to.
     */
    addItem(item, parent) {
        const that = this;

        if (!(item instanceof Smart.MenuItem || item instanceof Smart.MenuItemsGroup)) {
            return;
        }

        let parentView, level, container, appliedFilter;

        if (parent === undefined) {
            parent = that.$.mainContainer;
            parentView = undefined;
            level = 1;
            container = parent;
            appliedFilter = that._topLevelFilter;
        }
        else {
            if (typeof parent === 'string') {
                parent = that.getItem(parent);
            }

            if (parent === undefined ||
                !(parent instanceof Smart.MenuItemsGroup &&
                    (that.contains(parent) ||
                        parent.closest('.smart-list-menu-view') === that.$.view))) {
                return;
            }

            parentView = parent;
            level = parent.level + 1;
            container = parent.itemContainer;
            appliedFilter = parent.filter;
        }

        that._createItemHTMLStructure(item, level, parent, that._getCurrentViewItems(parentView).length, 0);

        if (item instanceof Smart.MenuItemsGroup) {
            that._processHTML(item, level + 1);
        }

        if (that._view !== parent && !parent.$.hasClass('smart-hidden') &&
            parent.offsetHeight > 0 && parent.offsetWidth > 0 &&
            (!that._view && !that.$.mainContainer.contains(parent) ||
                that._view && !that._view.contains(parent))) {
            item.$.addClass('smart-hidden');
        }

        if (that.grouped) {
            const children = Array.from(container.children);

            for (let i = children.length - 1; i >= 0; i--) {
                if (children[i].$.hasClass('smart-list-menu-group-label')) {
                    container.removeChild(children[i]);
                }
            }

            that._unsortItems(parent, true);
        }

        container.appendChild(item);

        if (that.grouped) {
            const view = that._view;

            that._applyGrouping(parent, true);
            that._home();

            if (view) {
                that.changePage(view.path);
            }

        }

        if (that.filterable && appliedFilter !== undefined &&
            appliedFilter !== '' && that._findItem(item, appliedFilter) === null) {
            item.$.addClass('smart-hidden');
            item.hidden = true;
        }

        that._toggleFilterInputGroupLabelVisibility();
        that._checkOverflow();
    }

    /**
     * Navigates to the previous page (smart-menu-items-group).
     *
     * @param {Boolean} animation Optional If set to false, disables collapse animation even if animation is enabled for the element.
     */
    back(animation) {
        const that = this,
            animationType = that.animation,
            restoreAnimation = animation === false && animationType !== 'none';

        if (restoreAnimation) {
            that.animation = 'none';
        }

        that._backButtonClickHandler();

        if (restoreAnimation) {
            that.animation = animationType;
        }
    }

    /**
     * Navigates to a particular page (smart-menu-items-group).
     *
     * @param {String} id The id or numeric path of a page (smart-menu-items-group).
     */
    changePage(id) {
        const that = this,
            item = that.getItem(id);

        if (item === undefined || item instanceof Smart.MenuItem || item.hidden) {
            return;
        }

        const stack = [item];
        let stackItem = item.parentItem,
            start = 0;

        that._discardKeyboardHover();

        while (stackItem) {
            stack.unshift(stackItem);
            stackItem = stackItem.parentItem;
        }

        if (that._view) {
            const index = stack.indexOf(that._view);

            if (index === -1) {
                that._home();
            }
            else {
                start = index + 1;
            }
        }

        for (let i = start; i < stack.length; i++) {
            if (stack[i].disabled || stack[i].hidden) {
                break;
            }

            that._menuItemsGroupSelectionHandler(stack[i], { type: 'expand' }, true);
        }
    }

    /**
     * Maximizes the List Menu.
     */
    maximize() {
        const that = this;

        if (!that._minimized) {
            return;
        }

        that._positionDetection.removeOverlay();
        that._minimized = false;

        if (that._minimizedDropDownOpened) {
            that.$hamburgerIcon.removeClass('smart-close-button');
            that._minimizedDropDownOpened = false;
        }

        if (that.dropDownAppendTo !== null) {
            that._appendMinimizedContainerToMenu(that.$.view, null);
        }

        that.$view.removeClass('smart-visibility-hidden');
        that.$view.removeClass('smart-list-menu-view-minimized');
        that.$hamburgerIcon.addClass('smart-hidden');

        that.removeAttribute('minimized');

        if (that.enableShadowDOM) {
            that.$.view.id = that.$.view.getAttribute('smart-id');

            const templateElements = that.$.view.querySelectorAll('[smart-id]');

            for (let i = 0; i < templateElements.length; i++) {
                templateElements[i].id = templateElements[i].getAttribute('smart-id');
            }
        }

        that.$.mainContainer.scrollTop = 0;
        that._checkOverflow();

        that.$.hamburgerIcon.removeAttribute('aria-expanded');
        that.$.hamburgerIcon.removeAttribute('aria-owns');
        that.$.view.setAttribute('role', 'presentation');
        that.$.view.removeAttribute('aria-orientation');
        that.setAttribute('role', 'menu');
    }

    /**
     * Minimizes the List Menu.
     */
    minimize() {
        const that = this;

        if (that._minimized) {
            return;
        }

        that.$view.addClass('smart-visibility-hidden');

        if (that.enableShadowDOM) {
            that.$.view.removeAttribute('id');

            const templateElements = that.$.view.querySelectorAll('[smart-id]');

            for (let i = 0; i < templateElements.length; i++) {
                templateElements[i].removeAttribute('id');
            }
        }

        if (that._edgeMacFF) {
            that.$view.addClass('not-in-view');
        }

        that.$hamburgerIcon.removeClass('smart-hidden');

        setTimeout(function () {
            if (that.dropDownAppendTo !== null) {
                that._appendMinimizedContainerToExternalElement(that.$.view);
            }

            that.$view.addClass('smart-list-menu-view-minimized');

            that.$.mainContainer.scrollTop = 0;
            that._checkOverflow();
        }, 0);

        that._minimized = true;
        that.setAttribute('minimized', '');

        that.setAttribute('role', 'presentation');
        that.removeAttribute('aria-orientation');
        that.$.hamburgerIcon.setAttribute('aria-expanded', false);
        that.$.hamburgerIcon.setAttribute('aria-owns', that.$.view.id);
        that.$.view.setAttribute('role', 'menu');
        that.$.view.setAttribute('aria-orientation', 'vertical');
    }

    /**
     * Removes an item.
     *
     * @param {HTMLElement/String} item The smart-menu-item/smart-menu-items-group (or its id or numeric path) to remove.
     */
    removeItem(item) {
        const that = this;

        if (typeof item === 'string') {
            item = that.getItem(item);
        }

        if (item === undefined ||
            !(item instanceof Smart.MenuItem || item instanceof Smart.MenuItemsGroup) ||
            !(that.contains(item) || item.closest('.smart-list-menu-view') === that.$.view)) {
            return;
        }

        const itemParent = item.parentElement;

        while (item.contains(that._view)) {
            that._backButtonClickHandler(undefined, true);
        }

        const view = that._view;

        if (that.grouped) {
            that._home();
            that._discardGrouping();
        }

        itemParent.removeChild(item);
        that._menuItems = {};
        that._refreshItemPaths(that.$.mainContainer, true, function (item) {
            return that._getCurrentViewItems(item === that.$.mainContainer ? undefined : item);
        });

        if (that.grouped) {
            that._applyGrouping(that.$.mainContainer);

            if (view) {
                that.changePage(view.path);
            }
        }

        that._toggleFilterInputGroupLabelVisibility();
        that._checkOverflow();
    }

    /**
     * Called when a property is changed.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        if (propertyName === 'disabled' ||
            propertyName === 'dropDownOverlay' ||
            propertyName === 'minimizeIconTemplate' ||
            propertyName === 'minimizeWidth' ||
            propertyName === 'overflow' ||
            propertyName === 'unfocusable') {
            super.propertyChangedHandler(propertyName, oldValue, newValue);
            return;
        }

        const that = this;

        switch (propertyName) {
            case 'animation':
                that.$.view.setAttribute('animation', newValue);
                break;
            case 'checkable':
            case 'checkboxes':
                if (that._minimized && that.dropDownAppendTo !== null) {
                    if (newValue) {
                        that.$.view.setAttribute(propertyName, '');
                    }
                    else {
                        that.$.view.removeAttribute(propertyName);
                    }
                }

                break;
            case 'checkMode':
                that._changeToRadioButtonMode(newValue, that.$.mainContainer);

                if (that._minimized && that.dropDownAppendTo !== null) {
                    that.$.view.setAttribute('check-mode', newValue);
                }

                break;
            case 'dataSource':
                that.$header.addClass('smart-hidden');
                that.$mainContainer.removeClass('header-shown');
                that._view = undefined;

                that._menuItems = {};
                that._topLevelFilter = '';
                that._processDataSource();
                that._toggleFilterInputGroupLabelVisibility();
                that._checkOverflow();
                break;
            case 'displayLoadingIndicator':
                if (newValue) {
                    const hoveredItem = that.$.mainContainer.querySelector('[hover]');

                    if (hoveredItem) {
                        hoveredItem.removeAttribute('hover');
                    }

                    that._discardKeyboardHover();
                    that.$loadingIndicatorContainer.removeClass('smart-hidden');
                }
                else {
                    that.$loadingIndicatorContainer.addClass('smart-hidden');
                }

                break;
            case 'dropDownAppendTo': {
                const oldDropDownParent = that._dropDownParent;

                that._positionDetection.getDropDownParent();

                if (that._dropDownParent === oldDropDownParent || !that._minimized) {
                    return;
                }

                that._close();

                if (newValue === null) {
                    that._appendMinimizedContainerToMenu(that.$.view, null);
                }
                else {
                    that._appendMinimizedContainerToExternalElement(that.$.view);
                }

                that.$.mainContainer.scrollTop = 0;
                that._checkOverflow();
                break;
            }
            case 'dropDownPosition': {
                that._close();

                if (that._minimized && that.dropDownAppendTo !== null) {
                    that.$.view.setAttribute('drop-down-position', newValue);
                }

                break;
            }
            case 'filterable':
                that._toggleFilterInputGroupLabelVisibility(true);

                if (newValue === false) {
                    if (that._topLevelFilter !== '') {
                        that._applyFilter('');
                    }

                    for (let i = that._filteredLowerLevelGroups.length - 1; i >= 0; i--) {
                        that._applyFilter('', that._filteredLowerLevelGroups[i]);
                    }
                }

                that._checkOverflow();
                break;
            case 'filterMode':
                if (!that.filterable) {
                    return;
                }

                if (that._topLevelFilter !== '') {
                    that._applyFilter(that._topLevelFilter);
                }

                for (let i = that._filteredLowerLevelGroups.length - 1; i >= 0; i--) {
                    that._applyFilter(that._filteredLowerLevelGroups[i].filter, that._filteredLowerLevelGroups[i]);
                }

                break;
            case 'grouped':
                that._home();

                if (newValue) {
                    that._applyGrouping(that.$.mainContainer);
                }
                else {
                    that._discardGrouping();
                }

                that._toggleFilterInputGroupLabelVisibility(false, true);
                that._checkOverflow();
                break;
            case 'loadingIndicatorPosition':
                if (that.dropDownAppendTo !== null && that._minimized) {
                    that.$.view.setAttribute('loading-indicator-position', newValue);
                }

                if (newValue === 'center') {
                    that.$loadingIndicatorPlaceHolder.addClass('smart-hidden');
                }
                else {
                    that.$loadingIndicatorPlaceHolder.removeClass('smart-hidden');
                }

                break;
            case 'rightToLeft':
                if (newValue) {
                    that.$backButtonArrow.removeClass('smart-arrow-left');
                    that.$backButtonArrow.addClass('smart-arrow-right');
                }
                else {
                    that.$backButtonArrow.removeClass('smart-arrow-right');
                    that.$backButtonArrow.addClass('smart-arrow-left');
                }

                newValue ? that.$.view.setAttribute('right-to-left', '') : that.$.view.removeAttribute('right-to-left');

                Array.prototype.forEach.call(that.$.mainContainer.querySelectorAll('.smart-menu-items-group-arrow'),
                    arrow => arrow.className = 'smart-menu-items-group-arrow ' + (that.rightToLeft ? 'smart-arrow-left left' : 'smart-arrow-right right'));

                break;
            case 'theme':
                super.propertyChangedHandler(propertyName, oldValue, newValue);

                if (that.dropDownAppendTo !== null && that._minimized) {
                    if (oldValue !== '') {
                        that.$view.removeClass(oldValue);
                    }

                    if (newValue) {
                        that.$view.addClass(newValue);
                    }
                }

                break;
        }
    }

    /**
     * Appends group headers.
     */
    _appendGroupLabels(groups, groupChildren) {
        for (let i = 0; i < groups.length; i++) {
            const groupLabel = document.createElement('div');

            groupLabel.$ = Smart.Utilities.Extend(groupLabel);
            groupLabel.className = 'smart-list-menu-group-label';
            groupLabel.setAttribute('role', 'heading');
            groupLabel.setAttribute('aria-level', 1);
            groupLabel.innerHTML = groups[i];
            groupLabel.groupChildren = groupChildren[i];
            groupChildren[i][0].parentElement.insertBefore(groupLabel, groupChildren[i][0]);

            for (let j = 0; j < groupChildren[i].length; j++) {
                groupChildren[i][j].groupLabel = groupLabel;
            }
        }
    }

    /**
     * Applies filter.
     */
    _applyFilter(filterQuery, view) {
        const that = this,
            items = that._getCurrentViewItems(view);

        for (let i = 0; i < items.length; i++) {
            const item = that._findItem(items[i], filterQuery);

            if (item && item.hidden) {
                item.hidden = false;
                if (view === that._view ||
                    (that._view !== undefined && view !== undefined && !view.contains(that._view)) ||
                    that._view === undefined) {
                    item.$.removeClass('smart-hidden');
                }
            }
            else if (!item) {
                items[i].hidden = true;
                items[i].$.addClass('smart-hidden');
            }
        }

        if (view) {
            view.filter = filterQuery;

            const index = that._filteredLowerLevelGroups.indexOf(view);

            if (filterQuery === '') {
                if (index !== -1) {
                    that._filteredLowerLevelGroups.splice(index, 1);
                }
            }
            else if (index === -1) {
                that._filteredLowerLevelGroups.push(view);
            }
        }
        else {
            that._topLevelFilter = filterQuery;
        }
    }

    /**
     * Back button click handler.
     */
    _backButtonClickHandler(event, noAnimation) {
        const that = this,
            view = that._view;

        if (event) {
            event.stopPropagation();
        }

        if (!view || that.disabled && event || that.displayLoadingIndicator || that._inTransition) {
            return;
        }

        let animation = that.hasAnimation,
            animationType = that.animation,
            resetAnimation = false;

        if (animation && noAnimation) {
            animation = false;
            resetAnimation = true;
            that.animation = 'none';
        }

        that._discardKeyboardHover();

        that.$scrollButtonNear.addClass('smart-hidden');
        that.$scrollButtonFar.addClass('smart-hidden');
        that.$mainContainer.removeClass('scroll-buttons-shown');
        view.firstElementChild.classList.remove('smart-hidden');

        if (!animation) {
            view.$.removeClass('smart-menu-items-group-opened');
            view.container.$.addClass('smart-hidden');
        }
        else {
            that._inTransition = true;
            view.container.$.addClass('no-transition');
            view.container.$.addClass('smart-hidden');
            view.$.addClass('right');
            view.$.removeClass('right');
            view.container.$.removeClass('no-transition');
        }

        that._showHideMenuItemsGroupSiblings(view, 'removeClass', animation);

        if (animation) {
            setTimeout(function () {
                view.container.style.top = view.parentElement.getBoundingClientRect().top - view.getBoundingClientRect().top + 'px';
            }, 0);
        }
        else if (resetAnimation) {
            that.animation = animationType;
        }

        if (view.level === 1) {
            that.$header.addClass('smart-hidden');
            that.$mainContainer.removeClass('header-shown');
            that._view = undefined;
        }
        else {
            that.$.title.innerHTML = view.parentItem.titleLabel;
            that._view = view.parentItem;
        }

        that._toggleFilterInputGroupLabelVisibility();

        that.$.mainContainer.scrollTop = 0;

        if (!animation) {
            that._checkOverflow();
        }

        if (event) {
            that.focus();
        }
    }

    /**
     * Applies bottom bounce effect.
     */
    _bounceBottom(initialScrollTop) {
        const that = this,
            mainContainer = that.$.mainContainer;

        that.$mainContainer.addClass('bounce-bottom');

        function bounceBack() {
            mainContainer.scrollTop -= 5;

            if (mainContainer.scrollTop > initialScrollTop) {
                window.requestAnimationFrame(bounceBack);
            }
            else {
                that.$mainContainer.removeClass('bounce-bottom');
            }
        }

        function bounceForth() {
            mainContainer.scrollTop += 5;

            if (mainContainer.scrollTop !== mainContainer.scrollHeight - mainContainer.offsetHeight) {
                window.requestAnimationFrame(bounceForth);
            }
            else {
                window.requestAnimationFrame(bounceBack);
            }
        }

        window.requestAnimationFrame(bounceForth);
    }

    /**
     * Applies top bounce effect.
     */
    _bounceTop() {
        const that = this,
            mainContainer = that.$.mainContainer;

        that.$mainContainer.addClass('bounce-top');

        function bounceBack() {
            mainContainer.scrollTop -= 5;

            if (mainContainer.scrollTop > 0) {
                window.requestAnimationFrame(bounceBack);
            }
            else {
                window.requestAnimationFrame(bounceForth);
            }
        }

        function bounceForth() {
            mainContainer.scrollTop += 5;

            if (mainContainer.scrollTop !== 50) {
                window.requestAnimationFrame(bounceForth);
            }
            else {
                mainContainer.scrollTop = 0;
                that.$mainContainer.removeClass('bounce-top');
            }
        }

        window.requestAnimationFrame(bounceBack);
    }

    /**
     * Checks if items overflow and shows/hides scroll buttons.
     */
    _checkOverflow() {
        const that = this,
            overflow = that.overflow;

        if (overflow === 'hidden') {
            return;
        }

        const overflowing = Math.round(that.$.mainContainer.scrollHeight) > Math.round(that.$.mainContainer.offsetHeight),
            showNear = Math.round(that.$.mainContainer.scrollTop) > 0,
            showFar = Math.round(that.$.mainContainer.offsetHeight + that.$.mainContainer.scrollTop) < Math.round(that.$.mainContainer.scrollHeight);

        if (overflowing) {
            if (overflow === 'auto') {
                if (!that.$mainContainer.hasClass('scroll-buttons-shown')) {
                    that.$mainContainer.addClass('scroll-buttons-shown');
                }

                if (showNear) {
                    that.$scrollButtonNear.removeClass('smart-hidden');
                }
                else {
                    that.$scrollButtonNear.addClass('smart-hidden');
                }

                if (showFar) {
                    that.$scrollButtonFar.removeClass('smart-hidden');
                }
                else {
                    that.$scrollButtonFar.addClass('smart-hidden');
                }

                if ((showNear && showFar) === false) {
                    that.$mainContainer.addClass('one-button-shown');
                }
                else {
                    that.$mainContainer.removeClass('one-button-shown');
                }

                if (!that.disabled) {
                    that.$.scrollButtonNear.disabled = false;
                    that.$.scrollButtonFar.disabled = false;
                }
            }
            else {
                that.$scrollButtonNear.removeClass('smart-hidden');
                that.$scrollButtonFar.removeClass('smart-hidden');

                if (that.disabled) {
                    that.$.scrollButtonNear.disabled = true;
                    that.$.scrollButtonFar.disabled = true;
                }
                else {
                    that.$.scrollButtonNear.disabled = !showNear;
                    that.$.scrollButtonFar.disabled = !showFar;
                }
            }
        }
        else if (!overflowing && overflow === 'auto' && that.$mainContainer.hasClass('scroll-buttons-shown')) {
            that.$mainContainer.removeClass('scroll-buttons-shown');
            that.$mainContainer.removeClass('one-button-shown');
            that.$scrollButtonNear.addClass('smart-hidden');
            that.$scrollButtonFar.addClass('smart-hidden');
        }
        else if (!overflowing && overflow === 'scroll') {
            that.$.scrollButtonNear.disabled = true;
            that.$.scrollButtonFar.disabled = true;
        }
    }

    /**
     * Closes any open pop-up containers.
     */
    _close() {
        const that = this;

        that._discardKeyboardHover(true);

        if (that._minimized && that._minimizedDropDownOpened) {
            that._positionDetection.removeOverlay();
            that.$view.addClass('smart-visibility-hidden');

            if (that._edgeMacFF) {
                that.$.view.style.left = '';
                that.$.view.style.top = '';
                that.$view.addClass('not-in-view');
            }

            that.$hamburgerIcon.removeClass('smart-close-button');
            that._minimizedDropDownOpened = false;
            that.$.hamburgerIcon.setAttribute('aria-expanded', false);
        }
    }

    /**
     * Applies initial settings to the List Menu element.
     */
    _createElement() {
        const that = this;

        if (!that.$.title.id) {
            that.$.title.id = that.id + 'Title';
        }

        if (!that.$.view.id) {
            that.$.view.id = that.id + 'View';
        }

        that.setAttribute('role', 'menu');
        that.setAttribute('aria-labelledby', that.$.title.id);
        that.setAttribute('aria-orientation', 'vertical');
        that.$.header.setAttribute('aria-labelledby', that.$.title.id);

        that.mode = 'vertical';

        that._positionDetection = new Smart.Utilities.PositionDetection(that);
        that._positionDetection.getDropDownParent();

        if (that.dataSource === null && that.$.mainContainer.firstElementChild instanceof HTMLUListElement) {
            that._processUList();
        }

        const items = that.getElementsByTagName('smart-menu-item'),
            itemsReady = function () {
                that._setFocusable();
                that._menuItems = {};
                that._topLevelFilter = '';
                that._filteredLowerLevelGroups = [];

                that.$.view.setAttribute('animation', that.animation);

                if (that.dataSource === null) {
                    that._processHTML(undefined, 1);
                }
                else {
                    that._processDataSource();
                }

                that._toggleFilterInputGroupLabelVisibility();

                if (that.overflow === 'scroll') {
                    that.$mainContainer.addClass('scroll-buttons-shown');
                    that.$scrollButtonNear.removeClass('smart-hidden');
                    that.$scrollButtonFar.removeClass('smart-hidden');
                    that._updateScrollButtonVisibility(that.$.mainContainer, false, [that.$.scrollButtonNear, that.$.scrollButtonFar]);
                }

                that._applyMinimizeIconTemplate(that.minimizeIconTemplate, null);

                if (that.minimizeWidth !== null && that.offsetWidth <= that.minimizeWidth) {
                    that.minimize();
                }
                else {
                    that._checkOverflow();
                }

                if (that.displayLoadingIndicator) {
                    that.$loadingIndicatorContainer.removeClass('smart-hidden');
                }

                if (that.loadingIndicatorPosition !== 'center') {
                    that.$loadingIndicatorPlaceHolder.removeClass('smart-hidden');
                }

                if (that.__onCompleted) {
                    that._onCompleted = that.__onCompleted;
                    that.__onCompleted = null;
                    that._onCompleted();
                }
            }

        if (items.length === 0) {
            itemsReady();
        }
        else {
            if (that._onCompleted) {
                that.__onCompleted = that._onCompleted;
                that._onCompleted = null;
            }
            that._ensureItemsReady(items, itemsReady);
        }
    }

    /**
     * Creates the pop-up container of smart-menu-items-group.
     */
    _createMenuItemsGroupContainer(item, level) {
        const container = document.createElement('div'),
            itemContainer = document.createElement('div');

        container.className = 'smart-menu-drop-down smart-hidden';
        container.$ = Smart.Utilities.Extend(container);
        container.level = level;
        container.setAttribute('level', level);
        container.setAttribute('role', 'menu');
        container.menuItemsGroup = item;

        itemContainer.className = 'smart-menu-item-container';
        itemContainer.$ = Smart.Utilities.Extend(itemContainer);
        itemContainer.container = container;
        itemContainer.menuItemsGroup = item;

        if (item.checkable) {
            itemContainer.setAttribute('checkable', '');
        }

        itemContainer.setAttribute('check-mode', item.checkMode);

        container.itemContainer = itemContainer;
        container.appendChild(itemContainer);

        return container;
    }

    /**
     * Removes grouping.
     */
    _discardGrouping() {
        const that = this,
            groupLabels = Array.from(that.$.view.getElementsByClassName('smart-list-menu-group-label'));

        for (let i = 0; i < groupLabels.length; i++) {
            let currentGroupLabel = groupLabels[i];

            currentGroupLabel.parentElement.removeChild(currentGroupLabel);
        }

        that._unsortItems(that.$.mainContainer);
    }

    /**
     * Removes "hover" attribute added by keyboard navigation.
     */
    _discardKeyboardHover() {
        const that = this;

        if (!that._focusedViaKeyboard) {
            return;
        }

        if (that._focusedViaKeyboard === that.$.backButton) {
            that.$.backButton.removeAttribute('hover');
            that.$.backButton.$.button.removeAttribute('hover');
        }
        else {
            that._focusedViaKeyboard.removeAttribute('focus');
            that._focusedViaKeyboard.removeAttribute('hover');
        }

        that._focusedViaKeyboard = undefined;
    }

    /**
     * Document up handler.
     */
    _documentUpHandler(event) {
        const that = this,
            target = event.originalEvent.target,
            swipeAction = (direction) => {
                if ((direction === 'right' && !that.rightToLeft) || (direction === 'left' && that.rightToLeft)) {
                    that._backButtonClickHandler();
                }
                else if (that._swipeDetails.target) {
                    that._selectionHandler({ target: that._swipeDetails.target }, that._swipeDetails.target, true);
                }
            };

        that._endSwiping(event, Date.now());

        if (that._swipeDetails) {
            if (that._swipeDetails.direction === 'left') {
                if (that._swipeDetails.start > event.pageX && that._swipeDetails.start - event.pageX > that.offsetWidth / 4) {
                    swipeAction(that._swipeDetails.direction);
                }
            }
            else {
                if (that._swipeDetails.start < event.pageX && event.pageX - that._swipeDetails.start > that.offsetWidth / 4) {
                    swipeAction(that._swipeDetails.direction);
                }
            }

            delete that._swipeDetails;
            return;
        }

        if (target === that.$.filterInput || that.disabled || that.displayLoadingIndicator || !target.closest) {
            return;
        }

        if (!that.contains(target) && target.closest('.smart-list-menu-view') !== that.$.view) {
            that._close();

            if (that._scrolling) {
                delete that._scrolling;
            }
        }
        else if ((that.contains(target) || target.closest('.smart-list-menu-view') === that.$.view) &&
            that !== document.activeElement) {
            that.focus();
        }
    }

    /**
     * Makes sure a smart-menu-item/smart-menu-items-group is visible by scrolling to it.
     */
    _ensureVisible(scrollTarget) {
        const that = this,
            parent = that.$.mainContainer;

        if (!parent.$.hasClass('scroll-buttons-shown') && that.overflow !== 'hidden') {
            return;
        }

        const parentBoundingRect = parent.getBoundingClientRect(),
            scrollTargetBoundingRect = scrollTarget.getBoundingClientRect(),
            scrollButtons = [that.$.scrollButtonNear, that.$.scrollButtonFar],
            oldScrollTop = parent.scrollTop;

        if (parentBoundingRect.top > scrollTargetBoundingRect.top || parentBoundingRect.bottom < scrollTargetBoundingRect.bottom) {
            parent.scrollTop = scrollTarget.offsetTop;
            that._updateScrollButtonVisibility(parent, false, scrollButtons);
        }

        that._fireScrollBottomReachedEvent(oldScrollTop);
    }

    /**
     * Fires the "scrollBottomReached" event.
     */
    _fireScrollBottomReachedEvent(oldScrollTop) {
        const that = this,
            mainContainer = that.$.mainContainer,
            currentScrollTop = mainContainer.scrollTop;

        if (oldScrollTop === currentScrollTop ||
            currentScrollTop !== mainContainer.scrollHeight - mainContainer.offsetHeight) {
            return;
        }

        that.$.fireEvent('scrollBottomReached');
    }

    /**
     * Gets all smart-menu-item and smart-menu-items-group elements in current view.
     */
    _getCurrentViewItems(view) {
        const that = this;

        if (!that.grouped) {
            if (view === undefined) {
                return that.$.mainContainer.children;
            }
            else {
                return view.container.firstElementChild.children;
            }
        }
        else {
            if (view === undefined) {
                return that.$.view.querySelectorAll('.smart-menu-main-container > smart-menu-item, .smart-menu-main-container > smart-menu-items-group');
            }
            else {
                const allChildren = view.container.firstElementChild.children,
                    items = [];

                for (let i = 0; i < allChildren.length; i++) {
                    let currentItem = allChildren[i];

                    if (currentItem instanceof Smart.MenuItem || currentItem instanceof Smart.MenuItemsGroup) {
                        items.push(currentItem);
                    }
                }

                return items;
            }
        }
    }

    /**
     * Sorts and groups items.
     */
    _sortItems(item) {
        const that = this;

        if (!that.grouped) {
            return;
        }

        const groups = [],
            groupChildren = [];
        let parent;

        if (item instanceof Smart.MenuItemsGroup) {
            parent = item.container.firstElementChild;
        }
        else if (item === that.$.mainContainer) {
            parent = item;
        }

        const children = Array.from(parent.children);

        children.sort(function (a, b) {
            return (a.label).localeCompare(b.label);
        });

        // sort items in DOM
        for (let i = children.length - 1; i >= 0; i--) {
            parent.insertBefore(children[i], parent.firstElementChild);
        }

        // retrieve groups and first elements in groups
        for (let i = 0; i < children.length; i++) {
            const currentChild = children[i],
                firstCharacter = currentChild.label.charAt(0),
                index = groups.indexOf(firstCharacter.toUpperCase());

            if (index === -1) {
                groups.push(firstCharacter.toUpperCase());
                groupChildren.push([currentChild]);
            }
            else {
                groupChildren[index].push(currentChild);
            }
        }

        that._appendGroupLabels(groups, groupChildren);
    }

    /**
     * Displays top-level view.
     */
    _home() {
        const that = this;

        while (that._view) {
            that._backButtonClickHandler(undefined, true);
        }
    }

    /**
     * Keydown event handler.
     */
    _keydownHandler(event) {
        const that = this,
            key = event.key,
            activeElement = (that.shadowRoot || that.getRootNode()).activeElement || document.activeElement;

        if (activeElement !== that ||
            ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Enter', 'Escape', 'Home', ' '].indexOf(key) === -1 ||
            that.disabled || that.displayLoadingIndicator) {
            return;
        }

        event.preventDefault();

        const view = that._view,
            lastOpenedContainer = view ? view.itemContainer : that.$.mainContainer,
            hoveredItem = that.$.backButton.hasAttribute('hover') ? that.$.backButton : lastOpenedContainer.querySelector('[focus]');

        switch (key) {
            case 'ArrowDown':
                that._navigate('_getNextEnabledChild', hoveredItem, lastOpenedContainer);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                if ((key === 'ArrowLeft' && !that.rightToLeft) || (key === 'ArrowRight' && that.rightToLeft)) {
                    that._backButtonClickHandler();
                    break;
                }

                if ((key === 'ArrowRight' && !that.rightToLeft) || (key === 'ArrowLeft' && that.rightToLeft)) {
                    if (hoveredItem && hoveredItem instanceof Smart.MenuItemsGroup) {
                        that._menuItemsGroupSelectionHandler(hoveredItem, { type: 'keydown' });
                    }
                }

                break;
            case 'ArrowUp':
                that._navigate('_getPreviousEnabledChild', hoveredItem, lastOpenedContainer);
                break;
            case 'End':
            case 'Home': {
                if (view && key === 'Home') {
                    that.$.mainContainer.scrollTop = 0;
                    that._checkOverflow();
                    that.$.backButton.setAttribute('hover', '');
                    that.$.backButton.$.button.setAttribute('hover', '');
                    that._focusedViaKeyboard = that.$.backButton;

                    if (hoveredItem) {
                        hoveredItem.removeAttribute('focus');
                    }

                    return;
                }

                const enabledChild = key === 'End' ?
                    that._getLastEnabledChild(lastOpenedContainer) :
                    that._getFirstEnabledChild(lastOpenedContainer);

                if (!enabledChild || hoveredItem === enabledChild) {
                    return;
                }

                if (hoveredItem) {
                    if (hoveredItem === that.$.backButton) {
                        that.$.backButton.removeAttribute('hover');
                        that.$.backButton.$.button.removeAttribute('hover');
                    }
                    else {
                        hoveredItem.removeAttribute('focus');
                    }
                }

                that._hoverViaKeyboard(enabledChild);
                break;
            }
            case 'Enter':
                if (that._minimized && !that._minimizedDropDownOpened) {
                    that._hamburgerIconClickHandler(undefined, that.$.view);
                }
                else if (hoveredItem) {
                    if (hoveredItem === that.$.backButton) {
                        that._backButtonClickHandler();
                    }
                    else {
                        that._selectionHandler({ target: hoveredItem });
                    }
                }

                break;
            case 'Escape':
                if (that._minimized && that._minimizedDropDownOpened && !that._view) {
                    that._close();
                }
                else {
                    that._backButtonClickHandler();
                }

                break;
            case ' ':
                if (hoveredItem) {
                    if (hoveredItem === that.$.backButton) {
                        that._backButtonClickHandler();
                    }
                    else {
                        that._toggleItem(hoveredItem);
                    }
                }

                break;
        }
    }

    /**
     * mainContainer down handler.
     */
    _mainContainerDownHandler(event) {
        const that = this;

        if (!Smart.Utilities.Core.isMobile || that.disabled || that.displayLoadingIndicator) {
            return;
        }

        that._dragStartDetails = { startY: event.pageY, x: event.pageX, y: event.pageY, startTime: Date.now(), target: event.originalEvent.target };
    }

    /**
     * mainContainer handler.
     */
    _mainContainerHandler() {
        return;
    }

    /**
     * mainContainer move handler.
     */
    _mainContainerMoveHandler(event) {
        const that = this;

        if (!that._dragStartDetails) {
            return;
        }

        const pageY = event.pageY,
            difference = that._dragStartDetails.y - pageY,
            oldScrollTop = that.$.mainContainer.scrollTop;

        that.$.mainContainer.scrollTop += difference;

        if (oldScrollTop !== that.$.mainContainer.scrollTop) {
            that._checkOverflow();
            that._fireScrollBottomReachedEvent(oldScrollTop);
        }

        that._dragStartDetails = { startY: that._dragStartDetails.startY, x: event.pageX, y: pageY, startTime: that._dragStartDetails.startTime, target: event.originalEvent.target };
        that._scrolling = true;
    }

    /**
     * mainContainer swipeleft/swiperight handler.
     */
    _mainContainerSwipeHandler(event) {
        const that = this;

        if (!Smart.Utilities.Core.isMobile || that.disabled || that.displayLoadingIndicator) {
            return;
        }

        const target = event.originalEvent.target,
            closestItem = target.closest('smart-menu-item'),
            closestGroup = target.closest('smart-menu-items-group');

        if ((event.type === 'swiperight' && !that.rightToLeft) || (event.type === 'swipeleft' && that.rightToLeft)) {
            const target = closestItem || closestGroup;

            if (target) {
                delete that._dragStartDetails;
                delete that._scrolling;

                that._swipeDetails = { direction: event.type.replace('swipe', ''), start: event.pageX, target: target };
            }
        }
        else if ((event.type === 'swipeleft' && !that.rightToLeft) || (event.type === 'swiperight' && that.rightToLeft) && closestGroup && closestItem === null) {
            delete that._dragStartDetails;
            delete that._scrolling;

            that._swipeDetails = { direction: event.type.replace('swipe', ''), start: event.pageX, target: closestGroup };
        }
    }

    /**
     * Returns the root's activeElement and isInside flag indicating whether the target is inside the element or not.
     * @param {any} target - target
     */
    _getRootDetails(rootNode, event) {
        const that = this;

        if (!rootNode) {
            return;
        }

        if (!that.enableShadowDOM) {
            return { activeElement: rootNode.activeElement, isInsideElement: that.contains(event.target) };
        }

        let activeElement, isInsideElement;

        while (rootNode) {
            if (!activeElement && rootNode.activeElement) {
                activeElement = rootNode.activeElement;
            }

            if (rootNode.host === that) {
                isInsideElement = true;
            }

            if (rootNode === document) {
                break;
            }

            rootNode = rootNode.host ? rootNode.host.getRootNode() : rootNode.getRootNode();
        }

        return { activeElement: activeElement, isInsideElement: isInsideElement };
    }

    /**
     * smart-menu-items-group selection handler.
     */
    _menuItemsGroupSelectionHandler(closestItemsGroup, event, noAnimation) {
        const that = this,
            container = closestItemsGroup.container,
            level = container.level,
            rootDetails = that._getRootDetails(event.target ? event.target.getRootNode() : null, event);

        if (that._view === closestItemsGroup) {
            return;
        }

        that._discardKeyboardHover();

        if (rootDetails && rootDetails.activeElement !== that && that.dropDownAppendTo !== null && event.type === 'click' && !rootDetails.isInsideElement) {
            that.focus();
        }

        if (that._inTransition) {
            return;
        }

        if (event.type === 'click' && !event.target.classList.contains('smart-menu-items-group-arrow') && that._toggleItem(closestItemsGroup)) {
            that._ripple(closestItemsGroup, event);
            return;
        }

        let animation = that.hasAnimation,
            animationType = that.animation,
            resetAnimation = false;

        if (animation && noAnimation) {
            animation = false;
            resetAnimation = true;
            that.animation = 'none';
        }

        if (level === 2) {
            that.$header.removeClass('smart-hidden');
            that.$mainContainer.addClass('header-shown');
        }

        that.$.title.innerHTML = closestItemsGroup.titleLabel;
        that._view = closestItemsGroup;
        that._toggleFilterInputGroupLabelVisibility();

        closestItemsGroup.removeAttribute('hover');
        closestItemsGroup.removeAttribute('focus');
        closestItemsGroup.$.addClass('smart-menu-items-group-opened');

        that._showHideMenuItemsGroupSiblings(closestItemsGroup, 'addClass', animation);

        if (!animation) {
            closestItemsGroup.firstElementChild.classList.add('smart-hidden');
        }
        else {
            that._inTransition = true;
            closestItemsGroup.firstElementChild.classList.add('animate');
            setTimeout(function () {
                container.style.top = closestItemsGroup.parentElement.getBoundingClientRect().top - closestItemsGroup.getBoundingClientRect().top + 'px';
            }, 0);
        }

        container.$.removeClass('smart-hidden');

        if (resetAnimation) {
            that.animation = animationType;
        }

        that.$.mainContainer.scrollTop = 0;

        if (!animation) {
            that._checkOverflow();
        }

        that.$.fireEvent('expand', { 'item': closestItemsGroup, 'label': closestItemsGroup.label, 'path': closestItemsGroup.path, 'value': closestItemsGroup.value });
    }

    /**
     * Mouseout/mouseover handler.
     */
    _mouseoutMouseoverHandler(event) {
        const that = this;

        if (that.disabled || that.displayLoadingIndicator) {
            return;
        }

        const closestItem = event.target.closest('smart-menu-item') || event.target.closest('smart-menu-items-group');

        if (closestItem === null || (that._view && closestItem.level <= that._view.level) || closestItem.disabled || closestItem.templateApplied) {
            return;
        }

        that._discardKeyboardHover();

        if (event.type === 'mouseover') {
            closestItem.setAttribute('hover', '');
            that._discardKeyboardHover(true);
        }
        else {
            closestItem.removeAttribute('hover');
        }
    }

    /**
     * Navigates to an item via the keyboard.
     */
    _navigate(method, hoveredItem, lastOpenedContainer) {
        const that = this;

        if (!hoveredItem) {
            if (method === '_getNextEnabledChild') {
                if (that._view) {
                    that.$.backButton.setAttribute('hover', '');
                    that.$.backButton.$.button.setAttribute('hover', '');
                    that._focusedViaKeyboard = that.$.backButton;
                }
                else {
                    that._hoverViaKeyboard(that._getFirstEnabledChild(lastOpenedContainer));
                }
            }
            else {
                that._hoverViaKeyboard(that._getLastEnabledChild(lastOpenedContainer));
            }

            return;
        }

        let navigateToChild;

        if (method === '_getNextEnabledChild' && hoveredItem === that.$.backButton) {
            navigateToChild = that._getFirstEnabledChild(lastOpenedContainer);

            if (navigateToChild) {
                that.$.backButton.removeAttribute('hover');
                that.$.backButton.$.button.removeAttribute('hover');
            }
            else {
                return;
            }
        }
        else if (method === '_getPreviousEnabledChild' && that._view && hoveredItem === that._getFirstEnabledChild(lastOpenedContainer)) {
            that.$.backButton.setAttribute('hover', '');
            that.$.backButton.$.button.setAttribute('hover', '');
            that._focusedViaKeyboard = that.$.backButton;
            hoveredItem.removeAttribute('focus');
            return;
        }
        else {
            navigateToChild = that[method](hoveredItem);
        }

        if (navigateToChild) {
            hoveredItem.removeAttribute('focus');
            that._hoverViaKeyboard(navigateToChild);
        }
    }

    /**
     * Processes initial HTML structure.
     */
    _processHTML(item, level) {
        const that = this;
        let container, itemContainer;

        if (item === undefined) {
            item = that.$.mainContainer;
        }

        if (level > 1) {
            container = that._createMenuItemsGroupContainer(item, level);
            itemContainer = container.itemContainer;
        }

        const itemChildren = Array.from(item.children),
            checkedChildren = [];
        let pathOffset = 0;

        for (let i = 0; i < itemChildren.length; i++) {
            if (level > 1 && i === 0) {
                pathOffset++;
                continue;
            }

            const currentItem = itemChildren[i];

            if (!(currentItem instanceof Smart.MenuItem || currentItem instanceof Smart.MenuItemsGroup)) {
                currentItem.parentElement.removeChild(currentItem);
                pathOffset++;
                continue;
            }

            that._createItemHTMLStructure(currentItem, level, item, i - pathOffset);

            if (currentItem.checked) {
                if (!currentItem.disabled && !currentItem.templateApplied) {
                    checkedChildren.push(currentItem);
                }
                else {
                    currentItem.checked = false;
                }
            }

            if (level > 1) {
                itemContainer.appendChild(currentItem);
            }

            if (currentItem instanceof Smart.MenuItemsGroup) {
                that._processHTML(currentItem, level + 1);
            }
        }

        if (level > 1) {
            item.container = container;
            item.itemContainer = itemContainer;

            if (item instanceof Smart.MenuItemsGroup) {
                const arrowElement = document.createElement('div');

                arrowElement.className = 'smart-menu-items-group-arrow ' + (that.rightToLeft ? 'smart-arrow-left left' : 'smart-arrow-right right');
                item.children[0].appendChild(arrowElement);
            }

            item.appendChild(container);
        }

        that._validateRadioButtonSelection(item, level, checkedChildren);

        that._sortItems(item);
    }

    /**
     * Resize handler.
     */
    _resizeHandler() {
        const that = this,
            minimizeWidth = that.minimizeWidth;

        if (minimizeWidth !== null) {
            if (!that._minimized && that.offsetWidth <= minimizeWidth) {
                that.minimize();
                return;
            }
            else if (that._minimized && that.offsetWidth > minimizeWidth) {
                that.maximize();
                return;
            }
        }

        that._checkOverflow();
    }

    /**
     * Scrolls using scroll buttons.
     */
    _scroll(scrollButton) {
        const that = this,
            mainContainer = that.$.mainContainer,
            scrollCoefficient = scrollButton.classList.contains('smart-scroll-button-near') ? -1 : 1,
            oldScrollTop = mainContainer.scrollTop;

        mainContainer.scrollTop = mainContainer.scrollTop + scrollCoefficient * 10;

        if (oldScrollTop !== mainContainer.scrollTop) {
            that._updateScrollButtonVisibility(mainContainer, false, [that.$.scrollButtonNear, that.$.scrollButtonFar]);
            that._fireScrollBottomReachedEvent(oldScrollTop);
        }
    }

    /**
     * Selection handler.
     */
    _selectionHandler(event, closestItemsGroup, swipe) {
        const that = this,
            target = event.target;

        if (that.disabled || that.displayLoadingIndicator) {
            return;
        }

        if (that._scrolling || that._swipeDetails && !swipe) {
            delete that._dragStartDetails;
            delete that._scrolling;
            delete that._swipeDetails;
            return;
        }

        function focus() {
            const rootDetails = that._getRootDetails(target.getRootNode(), event);

            if (rootDetails && rootDetails.activeElement !== that && that.dropDownAppendTo !== null && event.type === 'click' && !rootDetails.isInsideElement) {
                that.focus();
            }
        }

        if (closestItemsGroup === undefined) {
            if (event.type === 'click') {
                const closestScrollButton = target.closest('smart-repeat-button');

                if (closestScrollButton) {
                    that._scroll(closestScrollButton, event);
                    return;
                }
            }

            const closestItem = target.closest('smart-menu-item');

            if (closestItem) {
                if (closestItem.disabled || closestItem.templateApplied) {
                    focus();
                    return;
                }

                if (!that._toggleItem(closestItem)) {
                    that.$.fireEvent('itemClick', { 'item': closestItem, 'label': closestItem.label, 'value': closestItem.value });
                }

                that._ensureVisible(closestItem);
                that._ripple(closestItem, event);
                focus();
                return;
            }

            closestItemsGroup = target.closest('smart-menu-items-group');

            if (closestItemsGroup && (target === closestItemsGroup.container || target === closestItemsGroup.container.firstElementChild)) {
                return;
            }
        }

        if (closestItemsGroup && !closestItemsGroup.disabled) {
            that._menuItemsGroupSelectionHandler(closestItemsGroup, event);
        }
    }

    /**
     * Shows/hides the siblings of a smart-menu-items-group.
     */
    _showHideMenuItemsGroupSiblings(menuItemsGroup, method, animation) {
        const parentElement = menuItemsGroup.parentElement,
            children = parentElement.children;

        for (let i = 0; i < children.length; i++) {
            const currentChild = children[i];

            if (currentChild === menuItemsGroup) {
                continue;
            }

            if (!currentChild.hidden) {
                if (!animation) {
                    currentChild.$[method]('smart-hidden');
                }
                else {
                    if (method === 'addClass') {
                        currentChild.$.addClass('animate');
                    }
                    else {
                        currentChild.$.removeClass('smart-hidden');
                        currentChild.$.addClass('right');
                        setTimeout(function () {
                            currentChild.$.removeClass('right');
                        }, 0);
                    }
                }
            }
        }
    }

    /**
     * Toggles the visibility of the filter input.
     */
    _toggleFilterInputGroupLabelVisibility(filterableChanged, groupedChanged) {
        const that = this,
            itemsCount = that._getCurrentViewItems(that._view).length;

        if (groupedChanged !== true) {
            const shown = !that.$filterInputContainer.hasClass('smart-hidden');

            if (that.filterable && itemsCount > 1) {
                if (!shown) {
                    that.$mainContainer.addClass('filter-input-shown');
                    that.$filterInputContainer.removeClass('smart-hidden');
                }

                if (that._view) {
                    that.$.filterInput.value = that._view.filter || '';
                }
                else {
                    that.$.filterInput.value = that._topLevelFilter;
                }
            }
            else if (shown) {
                that.$mainContainer.removeClass('filter-input-shown');
                that.$filterInputContainer.addClass('smart-hidden');
            }
        }

        if (!filterableChanged && that.grouped && itemsCount > 0) {
            const firstGroupLabel = that._view ?
                that._view.container.firstElementChild.firstElementChild.$ :
                that.$.mainContainer.firstElementChild.$;

            if (itemsCount === 1) {
                firstGroupLabel.addClass('smart-hidden');
            }
            else {
                firstGroupLabel.removeClass('smart-hidden');
            }
        }
    }

    /**
     * External view handler.
     */
    _viewHandler(event) {
        const that = this;

        if (event.type === 'transitionend') {
            const target = event.target;

            if (target === that.$.view || that.$.backButton.contains(target)) {
                return;
            }

            if (target.classList.contains('animate')) {
                target.classList.remove('animate');
                target.classList.add('smart-hidden');
            }

            if (target.classList.contains('smart-menu-drop-down')) {
                target.style.top = '';
            }

            if (target.classList.contains('smart-menu-items-group-opened')) {
                target.classList.remove('smart-menu-items-group-opened');
            }

            that._checkOverflow();
            that._inTransition = false;
            return;
        }

        if (!that._minimized || that.dropDownAppendTo === null) {
            return;
        }

        switch (event.type) {
            case 'click':
                that._selectionHandler(event);
                break;
            case 'mouseout':
                that._mouseoutMouseoverHandler(event);
                break;
            case 'mouseover':
                that._mouseoutMouseoverHandler(event);
                break;
        }
    }
});
