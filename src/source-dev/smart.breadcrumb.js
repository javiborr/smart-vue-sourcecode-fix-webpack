
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * Breadcrumb custom element.
 */
Smart('smart-breadcrumb', class Breadcrumb extends Smart.BaseElement {
    // Breadcrumb's properties.
    static get properties() {
        return {
            'addNewItem': {
                value: false,
                type: 'boolean'
            },
            'allowDrag': {
                value: false,
                type: 'boolean'
            },
            'allowDrop': {
                value: false,
                type: 'boolean'
            },
            'closeButtons': {
                value: false,
                type: 'boolean'
            },
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'itemTemplate': {
                value: null,
                type: 'any'
            },
            'minimizeWidth': {
                value: 150,
                type: 'number?'
            }
        };
    }

    /**
     * Breadcrumb's event listeners.
     */
    static get listeners() {
        return {
            'move': '_moveHandler',
            'resize': '_resizeHandler',
            'container.click': '_containerClickHandler',
            'container.down': '_containerDownHandler',
            'container.transitionend': '_containerTransitionendHandler',
            'hamburgerIcon.click': '_hamburgerIconClickHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler'
        };
    }

    /**
  * CSS files needed for the element (ShadowDOM)
  */
    static get styleUrls() {
        return [
            'smart.breadcrumb.css'
        ]
    }

    /**
     * Breadcrumb's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div id="minimizedHeader" class="smart-header smart-minimized-header smart-hidden" role="presentation">
                        <div id="hamburgerIcon" class="smart-hamburger-icon" role="button" aria-label="Toggle" aria-haspopup="dialog" aria-expanded="false">
                            <div id="hamburgerIconLineTop" class="smart-hamburger-icon-line smart-hamburger-icon-line-top" role="presentation"></div>
                            <div id="hamburgerIconLineCenter" class="smart-hamburger-icon-line smart-hamburger-icon-line-center" role="presentation"></div>
                            <div id="hamburgerIconLineBottom" class="smart-hamburger-icon-line smart-hamburger-icon-line-bottom" role="presentation"></div>
                        </div>
                    </div>
                    <template>
                        <div class="smart-breadcrumb-items" *items={{dataSource}} role="list">
                            <div class="smart-breadcrumb-item" role="listitem" aria-label={{item.label}}>
                                <div class="smart-breadcrumb-item-label" inner-H-T-M-L={{item.label}} role="presentation"></div>
                                <div class="smart-close-button" role="button" aria-label="Close">&#xe81f</div>
                            </div>
                        </div>
                    </template>
                </div>`;
    }

    /**
    * Updates the Breadcrumb when a property is changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value.
    * @param {number/string} newValue The new entered value.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'addNewItem':
                if (newValue) {
                    that._appendNewItemButton();
                }
                else {
                    that.$.templateContainer.firstElementChild.removeChild(that._addNewItemButton);
                    delete that._addNewItemButton;
                }

                that._setIndentation();
                break;
            case 'animation':
            case 'disabled':
            case 'unfocusable':
                if (that.addNewItem) {
                    that._addNewItemButton[propertyName] = newValue;
                }

                if (propertyName === 'disabled' && that._minimizedDropDownOpened) {
                    that._hamburgerIconClickHandler();
                }

                break;
            case 'itemTemplate':
                for (let i = 0; i < that._items.length; i++) {
                    that._items[i].firstElementChild.innerHTML = that.dataSource[i].label;
                }

                if (newValue) {
                    that._applyTemplate();
                }

                break;
            case 'minimizeWidth':
                if (newValue !== null && that.offsetWidth <= newValue) {
                    that.minimize();
                }
                else {
                    that.maximize();
                }

                break;
            case 'closeButtons':
                if (!that._minimized) {
                    that._setIndentation();
                }

                break;
        }
    }

    ready() {
        super.ready();

        const that = this;

        that.setAttribute('role', 'navigation');
        that.$.container.children[1].setAttribute('id', that.id + 'TemplateContainer');
        that.$.container.children[1].setAttribute('role', 'presentation');
        that.$.hamburgerIcon.setAttribute('aria-controls', that.id + 'TemplateContainer');

        that._edgeMacFF = Smart.Utilities.Core.Browser.Edge ||
            Smart.Utilities.Core.Browser.Firefox && navigator.platform.toLowerCase().indexOf('mac') !== -1;
        that.templateContainer = that.$.container.children[1];

        if (that.minimizeWidth !== null && that.offsetWidth <= that.minimizeWidth) {
            that.minimize();
        }
    }

    templateAttached() {
        this._handleDataSourceRefresh();
    }

    /**
     * Adds an item.
     *
     * @param {Object} itemDetails An Object with the fields "index", "label", and "value".
     */
    addItem(itemDetails) {
        const that = this,
            newSource = that.dataSource.slice(0);

        if (!itemDetails || typeof itemDetails !== 'object' ||
            isNaN(itemDetails.index) || itemDetails.index < 0) {
            return;
        }

        newSource.splice(itemDetails.index, 0, { label: itemDetails.label, value: itemDetails.value });
        that.dataSource = newSource;
    }

    /**
     * Maximizes the Breadcrumb.
     */
    maximize() {
        const that = this;

        if (!that._minimized) {
            return;
        }

        that.$minimizedHeader.addClass('smart-hidden');
        that.templateContainer.classList.remove('smart-visibility-hidden');

        if (that._edgeMacFF) {
            that.templateContainer.classList.remove('not-in-view');
        }

        that.$hamburgerIcon.removeClass('smart-close-button');
        that.removeAttribute('minimized');
        that.$.container.children[1].setAttribute('role', 'presentation');
        that._minimizedDropDownOpened = false;
        that._minimized = false;
        that._setIndentation();
    }

    /**
     * Minimizes the Breadcrumb.
     */
    minimize() {
        const that = this;

        if (that._minimized) {
            return;
        }

        const animationType = that.animation,
            restoreAnimation = that.hasAnimation;

        if (restoreAnimation) {
            that.animation = 'none';
        }

        that.$minimizedHeader.removeClass('smart-hidden');
        that.templateContainer.classList.add('smart-visibility-hidden');

        if (that._edgeMacFF) {
            that.templateContainer.classList.add('not-in-view');
        }

        if (restoreAnimation) {
            setTimeout(function () {
                that.animation = animationType;
            }, 0);
        }

        that.setAttribute('minimized', '');
        that.$.container.children[1].setAttribute('role', 'dialog');
        that._minimized = true;
        that._setIndentation();
    }

    /**
     * Removes an item.
     *
     * @param {HTMLElement} item The item to remove.
     */
    removeItem(item) {
        const that = this,
            index = that._items.indexOf(item),
            newSource = that.dataSource.slice(0);

        if (index === -1) {
            return;
        }

        newSource.splice(index, 1);
        that.dataSource = newSource;
    }

    /**
     * move handler.
     */
    _moveHandler(event) {
        if (event.originalEvent.type === 'touchmove') {
            event.originalEvent.preventDefault();
        }
    }

    /**
     * resize handler.
     */
    _resizeHandler() {
        const that = this;

        if (that.minimizeWidth !== null && that.offsetWidth <= that.minimizeWidth) {
            that.minimize();
        }
        else if (that._minimized) {
            that.maximize();
        }
        else {
            that._setIndentation();
        }
    }

    /**
     * container click handler.
     */
    _containerClickHandler(event) {
        const that = this;

        if (that.disabled || !that.templateContainer.contains(event.target)) {
            return;
        }

        const closeButton = event.target.closest('.smart-close-button');

        if (!closeButton) {
            return;
        }

        const item = closeButton.closest('.smart-breadcrumb-item'),
            closingEvent = that.$.fireEvent('closing', { item: item });

        if (!closingEvent.defaultPrevented) {
            const newSource = that.dataSource.slice(0);

            newSource.splice(that._items.indexOf(item), 1);
            that.dataSource = newSource;
            that.$.fireEvent('close', { item: item });
        }
    }

    /**
     * container down handler.
     */
    _containerDownHandler(event) {
        const that = this,
            target = event.originalEvent.target;

        if (!that.allowDrag || that.disabled || target.classList.contains('smart-close-button')) {
            return;
        }

        const item = target.closest('.smart-breadcrumb-item');

        if (!item) {
            return;
        }

        that._dragDetails = { item: item, x: event.pageX, y: event.pageY };
    }

    /**
     * container transitionend handler.
     */
    _containerTransitionendHandler(event) {
        const that = this;

        if (that._edgeMacFF && event.target === that.templateContainer &&
            !that._minimizedDropDownOpened && that.hasAnimation) {
            that.templateContainer.classList.add('not-in-view');
        }
    }

    /**
     * hamburger icon click handler.
     */
    _hamburgerIconClickHandler() {
        const that = this;

        if (that._minimizedDropDownOpened) {
            that.$hamburgerIcon.removeClass('smart-close-button');
            that.templateContainer.classList.add('smart-visibility-hidden');
            that.$.hamburgerIcon.setAttribute('aria-expanded', false);
            that._minimizedDropDownOpened = false;
        }
        else {
            that.$hamburgerIcon.addClass('smart-close-button');

            if (that._edgeMacFF) {
                that.templateContainer.classList.remove('not-in-view');
            }

            that.templateContainer.classList.remove('smart-visibility-hidden');
            that.$.hamburgerIcon.setAttribute('aria-expanded', true);
            that._minimizedDropDownOpened = true;
        }
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

        let feedback = dragDetails.feedback;

        event.originalEvent.preventDefault();

        if (!feedback) {
            if (Math.abs(dragDetails.x - event.pageX) > 5 ||
                Math.abs(dragDetails.y - event.pageY) > 5) {
                feedback = document.createElement('div');
                feedback.className = 'smart-breadcrumb-feedback';
                feedback.style.height = that._dragDetails.item.offsetHeight + 'px';
                feedback.innerHTML = that._dragDetails.item.firstElementChild.innerHTML;
                document.body.appendChild(feedback);
                dragDetails.feedback = feedback;
                that._getItemCoordinates();
            }
            else {
                return;
            }
        }

        if (that.rightToLeft) {
            feedback.setAttribute('right-to-left', true);
        }
        else {
            feedback.removeAttribute('right-to-left');
        }

        const originalTarget = !Smart.Utilities.Core.isMobile ?
            (that.shadowRoot || that.isInShadowDOM ? event.originalEvent.composedPath()[0] : event.originalEvent.target) :
            document.elementFromPoint(event.clientX, event.clientY);

        feedback.style.left = (event.pageX + 10) + 'px';
        feedback.style.top = (event.pageY + 10) + 'px';

        if (!that.allowDrop) {
            feedback.classList.add('error');
            that.$.fireEvent('dragging', { item: dragDetails.item, target: originalTarget, originalEvent: event.originalEvent });
            return;
        }

        delete dragDetails.target;
        that._clearItemDragClass();

        if (!(that.shadowRoot || that).contains(originalTarget)) {
            feedback.classList.add('error');
            that.$.fireEvent('dragging', { item: dragDetails.item, target: originalTarget, originalEvent: event.originalEvent });
            return;
        }

        let targetItem = originalTarget.closest('.smart-breadcrumb-item');

        if (targetItem) {
            that._applyItemDragClass(targetItem, targetItem.getBoundingClientRect(), event);
            return;
        }

        if (that._minimized) {
            feedback.classList.add('error');
            that.$.fireEvent('dragging', { item: dragDetails.item, target: originalTarget, originalEvent: event.originalEvent });
            return;
        }

        if ((that.shadowRoot || that).contains(originalTarget)) {
            const rows = that._itemCoordinates.rows,
                coordinates = that._itemCoordinates.coordinates,
                padding = parseFloat(window.getComputedStyle(that).getPropertyValue('--smart-breadcrumb-padding')) / 2;
            let onRow;

            for (let i = 0; i < rows.length; i++) {
                if (event.clientY < rows[i].bottom + padding) {
                    onRow = i;
                    break;
                }
            }

            if (onRow === undefined) {
                dragDetails.feedback.classList.add('error');
                that.$.fireEvent('dragging', { item: dragDetails.item, target: originalTarget, originalEvent: event.originalEvent });
                return;
            }

            let closestItem = that._items[coordinates[onRow][coordinates[onRow].length - 1].index],
                closestItemRect;

            for (let i = 0; i < coordinates[onRow].length; i++) {
                closestItemRect = coordinates[onRow][i].rect;

                if (event.clientX < closestItemRect.right + padding) {
                    closestItem = that._items[coordinates[onRow][i].index];
                    break;
                }
            }

            that._applyItemDragClass(closestItem, closestItemRect, event);
            return;
        }
    }

    /**
     * Gets item coordinates.
     */
    _getItemCoordinates() {
        const that = this,
            items = that._items,
            coordinates = [[]],
            rows = [];
        let previousTop = items[0].offsetTop,
            level = 0;

        coordinates[0].push({ index: 0, rect: items[0].getBoundingClientRect() });
        rows[0] = { top: coordinates[0][0].rect.top, bottom: coordinates[0][0].rect.bottom };

        for (let i = 1; i < items.length; i++) {
            const item = items[i],
                rect = item.getBoundingClientRect(),
                top = items[i].offsetTop;

            if (top > previousTop) {
                previousTop = top;
                level++;
                coordinates[level] = [];
                rows[level] = { top: rect.top, bottom: rect.bottom };
            }

            coordinates[level].push({ index: i, rect: rect });
        }

        that._itemCoordinates = { coordinates: coordinates, rows: rows };
    }

    /**
     * Clears the item class related to dragging.
     */
    _applyItemDragClass(targetItem, targetRect, event) {
        const that = this,
            dragDetails = that._dragDetails;
        let coordinate, position, dimension;

        dragDetails.target = targetItem;
        dragDetails.feedback.classList.remove('error');
        dragDetails.before = false;

        if (!that._minimized) {
            coordinate = event.clientX;
            position = 'left';
            dimension = 'width';
        }
        else {
            coordinate = event.clientY;
            position = 'top';
            dimension = 'height';
        }

        const nextElementSibling = targetItem[(that.rightToLeft ? 'previous' : 'next') + 'ElementSibling'];

        //if (coordinate <= (position === 'left' && that.rightToLeft ? targetItem.parentElement.offsetWidth - targetRect[position] : targetRect[position]) + targetRect[dimension] / 2) {
        if (coordinate <= targetRect[position] + targetRect[dimension] / 2) {
            targetItem.classList.add('target');
            dragDetails.before = true;
        }
        else if (nextElementSibling) {
            nextElementSibling.classList.add('target');
        }
        else {
            targetItem.classList.add('afterTarget');
        }

        if (that.rightToLeft) {
            dragDetails.before = !dragDetails.before;
        }

        that.$.fireEvent('dragging', { item: dragDetails.item, target: targetItem, originalEvent: event.originalEvent });
    }

    /**
     * Clears the item class related to dragging.
     */
    _clearItemDragClass() {
        const previousTarget = (this.shadowRoot || this).querySelector('.target, .afterTarget');

        if (previousTarget) {
            previousTarget.classList.remove('target');
            previousTarget.classList.remove('afterTarget');
        }
    }

    /**
     * document up handler.
     */
    _documentUpHandler(event) {
        const that = this,
            dragDetails = that._dragDetails;

        if (!dragDetails) {
            return;
        }

        delete that._dragDetails;

        if (dragDetails.feedback) {
            document.body.removeChild(dragDetails.feedback);
            that._clearItemDragClass();

            if (!that.allowDrop) {
                return;
            }

            if (!dragDetails.target || dragDetails.item === dragDetails.target) {
                that.$.fireEvent('dragEnd', {
                    item: dragDetails.item,
                    target: dragDetails.target || !Smart.Utilities.Core.isMobile ?
                        (that.shadowRoot || that.isInShadowDOM ? event.originalEvent.composedPath()[0] : event.originalEvent.target) :
                        document.elementFromPoint(event.clientX, event.clientY),
                    originalEvent: event.originalEvent
                });
                return;
            }

            const items = that._items.slice(0),
                itemIndex = items.indexOf(dragDetails.item),
                newSource = that.dataSource.slice(0),
                toMove = newSource.splice(itemIndex, 1);

            items.splice(itemIndex, 1);

            const targetIndex = items.indexOf(dragDetails.target) + (dragDetails.before ? 0 : 1);

            if (itemIndex !== targetIndex) {
                newSource.splice(targetIndex, 0, toMove[0]);
                that.dataSource = newSource;
            }

            that.$.fireEvent('dragEnd', {
                item: dragDetails.item,
                target: dragDetails.target,
                droppedBeforeTarget: dragDetails.before,
                originalEvent: event.originalEvent
            });
        }
    }

    /**
     * Handles dataSource refresh.
     */
    _handleDataSourceRefresh() {
        const that = this;

        that._items = Array.from(that.$.templateContainer.firstElementChild.children);

        if (that.addNewItem) {
            that._appendNewItemButton();
        }

        that._applyTemplate();
        that._setIndentation();
    }

    /**
     * Appends "Add new item" button.
     */
    _appendNewItemButton() {
        const that = this,
            addNewItemButton = document.createElement('smart-button');

        addNewItemButton.innerHTML = '+';
        addNewItemButton.animation = that.animation;
        addNewItemButton.disabled = that.disabled;
        addNewItemButton.unfocusable = that.unfocusable;
        addNewItemButton.setAttribute('aria-label', 'Add');
        addNewItemButton.addEventListener('click', function () {
            that.$.fireEvent('addNewItem');
        });
        that.$.templateContainer.firstElementChild.appendChild(addNewItemButton);
        that._addNewItemButton = addNewItemButton;
    }

    /**
     * Sets item indentation.
     */
    _setIndentation() {
        const that = this,
            items = that._items.slice(0);

        if (that._addNewItemButton) {
            items.push(that._addNewItemButton);
        }

        if (items.length === 0) {
            return;
        }

        let previousTop = items[0].offsetTop,
            level = 0;

        items.forEach(function (item) {
            item.style.marginLeft = item.style.marginRight = null;
        });

        if (that._minimized) {
            return;
        }

        for (let i = 1; i < items.length; i++) {
            const item = items[i],
                top = items[i].offsetTop;

            if (top > previousTop) {
                previousTop = top;
                level++
                item.style['margin' + (that.rightToLeft ? 'Right' : 'Left')] = (level * 10) + 'px';
            }
        }
    }

    /**
     * Applies item template.
     */
    _applyTemplate() {
        const that = this,
            itemTemplate = that.itemTemplate;

        if (itemTemplate === null) {
            return;
        }

        let potentialHTMLTemplate;

        if (itemTemplate instanceof HTMLTemplateElement) {
            potentialHTMLTemplate = itemTemplate;
        }
        else {
            potentialHTMLTemplate = document.getElementById(itemTemplate);
        }

        if (potentialHTMLTemplate !== null && potentialHTMLTemplate instanceof HTMLTemplateElement) {
            const templateContent = document.importNode(potentialHTMLTemplate.content, true),
                div = document.createElement('div');

            div.appendChild(templateContent);

            const templateText = div.innerHTML;

            for (let i = 0; i < that._items.length; i++) {
                const dataSource = that.dataSource,
                    label = dataSource[i].label,
                    value = dataSource[i].value,
                    labelElement = that._items[i].firstElementChild;

                labelElement.innerHTML = templateText.replace(/{{label}}/g, label).replace(/{{value}}/g, value);
            }
        }
    }
});
