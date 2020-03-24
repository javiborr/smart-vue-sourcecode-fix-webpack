
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

Smart('smart-rating', class Rating extends Smart.BaseElement {
    static get properties() {
        return {
            'max':
            {
                value: 5,
                type: 'number'
            },
            'name':
            {
                value: 'rating',
                type: 'string'
            },
            'value':
            {
                value: 3,
                type: 'number'
            }
        };
    }

    static get listeners() {
        return {
            'stars.click': '_clickHandler',
            'stars.move': '_moveHandler',
            'stars.mouseout': '_mouseoutHandler'
        };
    }

    attached() {
        // this.itemsIndexes = [...Array(this.max).keys()];

        if (this.value > this.max) {
            this.value = this.max;
        }

        this._updateActiveStars(this.value);
    }

    template() {
        return `<div id="container" role="presentation">
                    <div id="stars" class="smart-content" role="presentation">
                        <template>
                            <div id="ratingStars" *items={{max}} role="presentation"><span class="rating-star" index={{item}} role="button" aria-label="Star"></span></div>
                        </template>
                    </div>
                    <input class="smart-hidden" value="[[value]]" name="[[max]]"></input>
                </div>`;
    }

    render() {
        const that = this;

        that.setAttribute('role', 'group');
        that.$.stars.firstElementChild.setAttribute('role', 'presentation');

        super.render();
    }

    _clickHandler(event) {
        if (event.target.className.includes('rating-star')) {
            const star = event.target;
            const ratingContainer = star.parentNode;
            const starIndex = Array.prototype.indexOf.call(ratingContainer.children, star);

            this.value = starIndex + 1;
            this._updateActiveStars(this.value);
            this._updateHoveredStars(0);
        }
    }

    _moveHandler(event) {
        const that = this;
        const ratingContainer = this.querySelector('#ratingStars');

        const getOffset = (el) => {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY
            };
        }

        const getHoveredStarIndex = () => {
            const stars = that.querySelectorAll('#ratingStars .rating-star');
            for (let i = 0; i < stars.length; i++) {

                const offset = getOffset(stars[i]);
                if (event.x >= offset.left && event.x <= offset.left + stars[i].offsetWidth) {
                    return i;
                }
            }
        }

        const starIndex = getHoveredStarIndex();
        that._updateHoveredStars(starIndex + 1);
    }

    _mouseoutHandler(event) {
        this._updateHoveredStars(0);
    }

    _updateActiveStars(value) {
        const stars = this.getElementsByClassName('rating-star');

        for (let i = 0; i < stars.length; i++) {
            if (i < value) {
                stars[i].classList.add('active');
            } else {
                stars[i].classList.remove('active');
            }
        }
    }

    _updateHoveredStars(value) {
        const stars = this.getElementsByClassName('rating-star');

        for (let i = 0; i < stars.length; i++) {
            if (i < value) {
                stars[i].classList.add('hover');
            } else {
                stars[i].classList.remove('hover');
            }
        }
    }
});