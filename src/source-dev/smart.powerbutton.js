
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
* Power Button custom element.
*/
Smart('smart-power-button', class PowerButton extends Smart.ToggleButton {

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.powerbutton.css'
        ]
    }

    /** PowerButton's Html template. */
    template() {
        return `<div id='container' class='smart-container'>
                    <div id='powerButtonAnimation' class='smart-animation'></div>
                    <span id='button' class='smart-input' aria-hidden="true"></span>
                    <input id='hiddenInput' class='smart-hidden-input' type='hidden'>
                </div>`;
    }

    /** Called when the element is ready. Used for one-time configuration of the PowerButton. */
    ready() {
        const that = this;

        super.ready();
        that._updateHidenInputNameAndValue();
    }
});
