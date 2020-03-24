
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

// Draw class
Smart.Utilities.Assign('Draw', class Draw {
    constructor(host, renderEngine) {
        const that = this;

        that.host = host;
        that.renderEngine = renderEngine || '';

        that.refresh();

        const functions = [
            'clear',
            'removeElement',
            'attr',
            'getAttr',
            'line',
            'circle',
            'rect',
            'path',
            'pieslice',
            'pieSlicePath',
            'text',
            'measureText'
        ];

        for (let i in functions) {
            that._addFn(Smart.Utilities.Draw.prototype, functions[i]);
        }
    }

    _addFn(target, name) {
        if (target[name])
            return;

        target[name] = function () {
            return this.renderer[name].apply(this.renderer, arguments);
        };
    }

    _initRenderer(host) {
        return this.createRenderer(this, host);
    }

    _internalRefresh() {
        const self = this;

        if (!self.renderer) {
            self.host.innerHTML = '';
            self._initRenderer(self.host);
        }

        // validate visiblity
        if (window.getComputedStyle(self.host).display === 'none') {
            return;
        }

        const renderer = self.renderer;
        if (!renderer)
            return;

        const rect = renderer.getRect();

        self._render({ x: 1, y: 1, width: rect.width, height: rect.height });
    }

    _render(rect) {
        this._plotRect = rect;
    }

    // Public API
    refresh() {
        this._internalRefresh();
    }

    getSize() {
        const rect = this._plotRect;
        return { width: rect.width, height: rect.height };
    }

    toGreyScale(color) {
        if (color.indexOf('#') === -1)
            return color;

        const rgb = this.cssToRgb(color);
        rgb[0] = rgb[1] = rgb[2] = Math.round(0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]);
        const hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
        return '#' + hex[0] + hex[1] + hex[2];
    }

    decToHex(dec) {
        return dec.toString(16);
    }

    hexToDec(hex) {
        return parseInt(hex, 16);
    }

    rgbToHex(r, g, b) {
        return [this.decToHex(r), this.decToHex(g), this.decToHex(b)];
    }

    hexToRgb(h, e, x) {
        return [this.hexToDec(h), this.hexToDec(e), this.hexToDec(x)];
    }

    cssToRgb(color) {
        if (color.indexOf('rgb') <= -1) {
            return this.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
        }
        return color.substring(4, color.length - 1).split(',');
    }

    hslToRgb(hsl) {
        let r, g, b;
        const h = parseFloat(hsl[0]);
        const s = parseFloat(hsl[1]);
        const l = parseFloat(hsl[2]);

        if (s === 0) {
            r = g = b = l;
        }
        else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = this.hueToRgb(p, q, h + 1 / 3);
            g = this.hueToRgb(p, q, h);
            b = this.hueToRgb(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255];
    }

    hueToRgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;

        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        else if (t < 1 / 2)
            return q;
        else if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;

        return p;

    }

    rgbToHsl(rgb) {
        const r = parseFloat(rgb[0]) / 255;
        const g = parseFloat(rgb[1]) / 255;
        const b = parseFloat(rgb[2]) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        }
        else {
            const diff = max - min;
            s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            switch (max) {
                case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    swap(x, y) {
        const tmp = x;
        x = y;
        y = tmp;
    }

    getNum(arr) {
        if (arr.constructor !== Array) {
            if (isNaN(arr))
                return 0;
        }
        else {
            for (let i = 0; i < arr.length; i++)
                if (!isNaN(arr[i]))
                    return arr[i];
        }

        return 0;
    }

    _ptRotate(x, y, cx, cy, angle) {
        const radius = Math.sqrt(Math.pow(Math.abs(x - cx), 2) + Math.pow(Math.abs(y - cy), 2));
        const currAngle = Math.asin((x - cx) / radius);
        const newAngle = currAngle + angle;

        x = cx + Math.cos(newAngle) * radius;
        y = cy + Math.sin(newAngle) * radius;

        return { x: x, y: y };
    }

    log(val, base) {
        return Math.log(val) / (base ? Math.log(base) : 1);
    }

    _mod(a, b) {
        const min = Math.abs(a > b ? b : a);
        let scale = 1;
        if (min !== 0) {
            while (min * scale < 100)
                scale *= 10;
        }

        a = a * scale;
        b = b * scale;

        return (a % b) / scale;
    }

    createRenderer(widgetInstance, host) {
        const self = widgetInstance;
        let renderer = self.renderer = null;

        if (document.createElementNS && self.renderEngine !== 'HTML5') {
            renderer = new Smart.Utilities.SvgRenderer(this);
        }

        if (renderer === null && (self.renderEngine === 'HTML5' || self.renderEngine === undefined)) {
            renderer = new Smart.Utilities.HTML5Renderer(this);
        }

        renderer.init(host);
        self.renderer = renderer;

        return renderer;
    }

    getByPriority(arr) {
        let value = undefined;
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];

            if (current !== undefined && current !== null && current !== '') {
                value = current;
                break;
            }
        }

        return value;
    }

    get(array, index, key) {
        return key !== undefined ? array[index][key] : array[index];
    }

    min(array, key) {
        let min = NaN;
        for (let i = 0; i < array.length; i++) {
            const val = this.get(array, i, key);

            if (isNaN(min) || val < min)
                min = val;
        }

        return min;
    }

    max(array, key) {
        let max = NaN;
        for (let i = 0; i < array.length; i++) {
            const val = this.get(array, i, key);

            if (isNaN(max) || val > max)
                max = val;
        }

        return max;
    }

    sum(array, key) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            const val = this.get(array, i, key);
            if (!isNaN(val))
                sum += val;
        }

        return sum;
    }

    count(array, key) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            const val = this.get(array, i, key);
            if (!isNaN(val))
                count++;
        }

        return count;
    }

    avg(array, key) {
        return this.sum(array, key) / Math.max(1, this.count(array, key));
    }

    filter(array, fn) {
        if (!fn)
            return array;

        const out = [];
        for (let i = 0; i < array.length; i++)
            if (fn(array[i]))
                out.push(array[i]);

        return out;
    }

    scale(val, range, scale_range, params) {
        if (isNaN(val))
            return NaN;

        if (val < Math.min(range.min, range.max) || val > Math.max(range.min, range.max)) {
            if (!params || params['ignore_range'] !== true)
                return NaN;
        }

        let outVal = NaN;

        let percent = 1;
        if (range.type === undefined || range.type !== 'logarithmic') {
            let denom = Math.abs(range.max - range.min);
            if (!denom)
                denom = 1;
            percent = Math.abs(val - Math.min(range.min, range.max)) / denom;
        }
        else if (range.type === 'logarithmic') {
            let logBase = range.base;
            if (isNaN(logBase))
                logBase = 10;

            let min = Math.min(range.min, range.max);
            if (min <= 0)
                min = 1;

            let max = Math.max(range.min, range.max);
            if (max <= 0)
                max = 1;

            const maxPow = this.log(max, logBase);
            max = Math.pow(logBase, maxPow);

            const minPow = this.log(min, logBase);
            min = Math.pow(logBase, minPow);

            const valPow = this.log(val, logBase);

            percent = Math.abs(valPow - minPow) / (maxPow - minPow);
        }

        if (scale_range.type === 'logarithmic') {
            let logBase = scale_range.base;
            if (isNaN(logBase))
                logBase = 10;

            const maxPow = this.log(scale_range.max, logBase),
                minPow = this.log(scale_range.min, logBase);

            if (scale_range.flip)
                percent = 1 - percent;

            const valPow = Math.min(minPow, maxPow) + percent * Math.abs(maxPow - minPow);
            outVal = Math.pow(logBase, valPow);
        }
        else {
            outVal = Math.min(scale_range.min, scale_range.max) + percent * Math.abs(scale_range.max - scale_range.min);

            if (scale_range.flip)
                outVal = Math.max(scale_range.min, scale_range.max) - outVal + scale_range.min;
        }

        return outVal;
    }

    axis(min, max, preferedCount) {
        if (preferedCount <= 1)
            return [max, min];

        if (isNaN(preferedCount) || preferedCount < 2)
            preferedCount = 2;

        let decimalPlaces = 0;
        while (Math.round(min) !== min && Math.round(max) !== max && decimalPlaces < 10) {
            min *= 10;
            max *= 10;
            decimalPlaces++;
        }

        let preferedIntSize = (max - min) / preferedCount;
        while (decimalPlaces < 10 && Math.round(preferedIntSize) !== preferedIntSize) {
            min *= 10;
            max *= 10;
            preferedIntSize *= 10;
            decimalPlaces++;
        }

        const scale = [1, 2, 5];

        let i = 0,
            intSizeNext;

        // eslint-disable-next-line
        while (true) {
            let idx = i % scale.length;
            let pow = Math.floor(i / scale.length);
            let intSizeCurr = Math.pow(10, pow) * scale[idx];

            idx = (i + 1) % scale.length;
            pow = Math.floor((i + 1) / scale.length);
            intSizeNext = Math.pow(10, pow) * scale[idx];

            if (preferedIntSize >= intSizeCurr && preferedIntSize < intSizeNext)
                break;

            i++;
        }

        const intSizeSelected = intSizeNext;

        const out = [];
        let curr = this.renderer._rnd(min, intSizeSelected, false);
        const denominator = decimalPlaces <= 0 ? 1 : Math.pow(10, decimalPlaces);
        while (curr < max + intSizeSelected) {
            out.push(curr / denominator);
            curr += intSizeSelected;
        }

        return out;
    }

    _widgetToImage(widgetInstance, type, fileName, fnCallback, pageOrientation) {
        let self = widgetInstance;

        if (!self)
            return false;

        if (fileName === undefined || fileName === '')
            fileName = 'image.' + type;

        let renderEngineSaved = self.renderEngine;
        let enableAnimationsSaved = self.animation;

        self.animation = 'none';

        // try switching to HTML5
        self.renderEngine = 'HTML5';

        if (self.renderEngine !== renderEngineSaved) {
            try {
                self.refresh();
            }
            catch (e) {
                self.renderEngine = renderEngineSaved;
                self.refresh();
                self.animation = enableAnimationsSaved;

                return false;
            }
        }

        let canvas = self.renderer.getContainer().firstElementChild;

        let continueExport = true;
        if (typeof fnCallback === 'function') {
            continueExport = fnCallback(widgetInstance, canvas);
        }

        let result = true;
        if (continueExport)
            result = this.exportImage(widgetInstance, canvas, type, fileName, pageOrientation);

        // switch back to existing engine
        if (self.renderEngine !== renderEngineSaved) {
            self.renderEngine = renderEngineSaved;
            self.refresh();
            self.animation = enableAnimationsSaved;
        }

        return result;
    }

    _saveAsImage(type, fileName) {
        return this._widgetToImage(this, type, fileName);
    }

    saveAsPNG(filename) {
        return this._saveAsImage('png', filename);
    }

    saveAsJPEG(filename) {
        return this._saveAsImage('jpeg', filename);
    }

    exportImage(widgetInstance, canvas, type, fileName, pageOrientation) {
        if (!canvas)
            return false;

        let isPDF = type.toLowerCase() === 'pdf';
        if (isPDF) type = 'jpeg';
        if (fileName === undefined || fileName === '')
            fileName = 'image.' + type;

        let result = true;

        if (type === 'print') {
            const newWindow = window.open('', '', 'width=800,height=500'),
                printDocument = newWindow.document.open(),
                pageContent =
                    '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<meta charset="utf-8" />' +
                    '<title>jQWidgets Chart</title>' +
                    '</head>' +
                    '<body><img src="' + canvas.toDataURL() + '" /></html>';

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

            return;
        }

        try {
            if (canvas) {
                if (isPDF) {
                    pageOrientation = pageOrientation || 'portrait';

                    const data = canvas.toDataURL('image/' + type),
                        docDefinition = {
                            content: {
                                image: data,
                                width: Math.min(canvas.width / 1.35, (pageOrientation === 'portrait' ? 515 : 762))
                            },
                            pageOrientation: pageOrientation
                        };

                    try {
                        pdfMake.createPdf(docDefinition).download(fileName);
                    }
                    catch (error) {
                        widgetInstance.error(widgetInstance.localize('missingReference', { files: 'pdfmake.min.js' }));
                    }
                }
                else {
                    if (!Smart.Utilities.DataExporter) {
                        widgetInstance.error(widgetInstance.localize('missingReference', { files: 'smart.export.js' }));
                    }

                    const dataExporter = new Smart.Utilities.DataExporter();

                    canvas.toBlob(function (blob) {
                        dataExporter.downloadFile(blob, type, fileName);
                    });
                }
            }
        }
        catch (e) {
            result = false;
        }

        return result;
    }
});

// SvgRenderer class
Smart.Utilities.Assign('Renderer', class Renderer {
    constructor(draw) {
        const that = this;

        that.draw = draw;
        that._gradients = {};
        that._toRadiansCoefficient = Math.PI * 2 / 360;
    }

    pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
        if (!outerRadius)
            outerRadius = 1;

        const diff = Math.abs(angleFrom - angleTo);
        const lFlag = diff > 180 ? 1 : 0;
        if (diff >= 360) {
            angleTo = angleFrom + 359.99;
        }
        const radFrom = angleFrom * this._toRadiansCoefficient;
        const radTo = angleTo * this._toRadiansCoefficient;

        let x1 = x, x2 = x, y1 = y, y2 = y;

        const isDonut = !isNaN(innerRadius) && innerRadius > 0;

        if (isDonut)
            centerOffset = 0;

        const radFromCos = Math.cos(radFrom),
            radFromSin = Math.sin(radFrom),
            radToCos = Math.cos(radTo),
            radToSin = Math.sin(radTo);

        if (centerOffset + innerRadius > 0) {
            if (centerOffset > 0) {
                const midAngle = diff / 2 + angleFrom;
                const radMid = midAngle * this._toRadiansCoefficient;

                x += centerOffset * Math.cos(radMid);
                y -= centerOffset * Math.sin(radMid);
            }

            if (isDonut) {
                x1 = x + innerRadius * radFromCos;
                y1 = y - innerRadius * radFromSin;
                x2 = x + innerRadius * radToCos;
                y2 = y - innerRadius * radToSin;
            }
        }

        const x3 = x + outerRadius * radFromCos;
        const x4 = x + outerRadius * radToCos;
        const y3 = y - outerRadius * radFromSin;
        const y4 = y - outerRadius * radToSin;

        let path = '';

        const isPartialCircle = (Math.abs(Math.abs(angleTo - angleFrom) - 360) > 0.02);

        if (isDonut) {
            path = 'M ' + x2 + ',' + y2;
            path += ' a' + innerRadius + ',' + innerRadius;
            path += ' 0 ' + lFlag + ',1 ' + (x1 - x2) + ',' + (y1 - y2);
            if (isPartialCircle)
                path += ' L' + x3 + ',' + y3;
            else
                path += ' M' + x3 + ',' + y3;

            path += ' a' + outerRadius + ',' + outerRadius;
            path += ' 0 ' + lFlag + ',0 ' + (x4 - x3) + ',' + (y4 - y3);

            if (isPartialCircle)
                path += ' Z';
        }
        else {
            path = 'M ' + x4 + ',' + y4;
            path += ' a' + outerRadius + ',' + outerRadius;
            path += ' 0 ' + lFlag + ',1 ' + (x3 - x4) + ',' + (y3 - y4);

            if (isPartialCircle) {
                path += ' L' + x + ',' + y;
                path += ' Z';
            }
        }

        return path;
    }

    measureText(text, angle, params, includeTextPartsInfo) {
        const textPartsInfo = this._getTextParts(text, angle, params);
        const tw = textPartsInfo.width;
        let th = textPartsInfo.height;

        if (false === includeTextPartsInfo)
            th /= 0.6;

        let retVal = {};

        if (isNaN(angle))
            angle = 0;

        if (angle === 0) {
            retVal = { width: this._rup(tw), height: this._rup(th) };
        }
        else {
            const rads = angle * Math.PI * 2 / 360;
            const sn = Math.abs(Math.sin(rads));
            const cs = Math.abs(Math.cos(rads));
            const bh = Math.abs(tw * sn + th * cs);
            const bw = Math.abs(tw * cs + th * sn);

            retVal = { width: this._rup(bw), height: this._rup(bh) };
        }

        if (includeTextPartsInfo)
            retVal.textPartsInfo = textPartsInfo;

        //retVal.height += 5;
        return retVal;
    }

    alignTextInRect(x, y, width, height, textWidth, textHeight, halign, valign, angle, rotateAround) {
        const rads = angle * Math.PI * 2 / 360;
        const sn = Math.sin(rads);
        const cs = Math.cos(rads);

        const h2 = textWidth * sn;
        const w2 = textWidth * cs;

        if (halign === 'center' || halign === '' || halign === 'undefined')
            x = x + width / 2;
        else if (halign === 'right')
            x = x + width;

        if (valign === 'center' || valign === 'middle' || valign === '' || valign === 'undefined')
            y = y + height / 2;
        else if (valign === 'bottom')
            y += height - textHeight / 2;
        else if (valign === 'top')
            y += textHeight / 2;

        rotateAround = rotateAround || '';

        let adjustY = 'middle';
        if (rotateAround.indexOf('top') !== -1)
            adjustY = 'top';
        else if (rotateAround.indexOf('bottom') !== -1)
            adjustY = 'bottom';

        let adjustX = 'center';
        if (rotateAround.indexOf('left') !== -1)
            adjustX = 'left';
        else if (rotateAround.indexOf('right') !== -1)
            adjustX = 'right';

        if (adjustX === 'center') {
            x -= w2 / 2;
            y -= h2 / 2;
        }
        else if (adjustX === 'right') {
            x -= w2;
            y -= h2;
        }

        if (adjustY === 'top') {
            x -= textHeight * sn;
            y += textHeight * cs;
        }
        else if (adjustY === 'middle') {
            x -= textHeight * sn / 2;
            y += textHeight * cs / 2;
        }

        x = this._rup(x);
        y = this._rup(y);

        return { x: x, y: y };
    }

    adjustColor(color, adj) {
        if (typeof (color) !== 'string')
            return '#000000';

        if (color.indexOf('#') === -1)
            return color;

        const draw = this.draw;
        let rgb = draw.cssToRgb(color);
        const hsl = draw.rgbToHsl(rgb);
        hsl[2] = Math.min(1, hsl[2] * adj);
        hsl[1] = Math.min(1, hsl[1] * adj * 1.1);
        rgb = draw.hslToRgb(hsl);

        color = '#';
        for (let i = 0; i < 3; i++) {
            let c = Math.round(rgb[i]);
            c = draw.decToHex(c);
            if (c.toString().length === 1)
                color += '0';

            color += c;
        }

        return color.toUpperCase();
    }

    _rup(n) {
        let nr = Math.round(n);
        if (n > nr)
            nr++;

        return nr;
    }

    _ptdist(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    _rnd(num, unit, toGreater, fast) {
        if (isNaN(num))
            return num;

        if (undefined === fast)
            fast = true;

        let a = num - ((fast === true) ? num % unit : this._mod(num, unit));
        if (num === a)
            return a;

        if (toGreater) {
            if (num > a)
                a += unit;
        }
        else {
            if (a > num)
                a -= unit;
        }

        return (unit === 1) ? Math.round(a) : a;
    }

    _ptrnd(val) {
        if (!document.createElementNS) {
            if (Math.round(val) === val)
                return val;
            return this._rnd(val, 1, false, true);
        }

        const rnd = this._rnd(val, 0.5, false, true);
        if (Math.abs(rnd - Math.round(rnd)) !== 0.5) {
            return rnd > val ? rnd - 0.5 : rnd + 0.5;
        }
        return rnd;
    }

    _getContrastColor(color) {
        if (color === undefined) {
            return undefined;
        }

        let rgb = this.draw.hexToRgb(color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)),
            luminance = (0.299 * rgb[0] + 0.61 * rgb[1] + 0.114 * rgb[2]) / 255;

        if (luminance > 0.6) {
            return '#000000';
        }
        else {
            return '#FFFFFF';
        }
    }
});

// SvgRenderer class
Smart.Utilities.Assign('SvgRenderer', class SvgRenderer extends Smart.Utilities.Renderer {
    constructor(draw) {
        super(draw);

        const that = this;

        that._svgns = 'http://www.w3.org/2000/svg';
        that._openGroups = [];
        that._clipId = 0;
    }

    init(host) {
        const container = document.createElement('div');

        container.className = 'drawContainer';
        container.onselectstart = function () {
            return false;
        }

        host.appendChild(container);

        this.host = host;
        this.container = container;

        try {
            const svg = document.createElementNS(this._svgns, 'svg');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('overflow', 'hidden');
            container.appendChild(svg);
            this.canvas = svg;
        }
        catch (e) {
            return false;
        }

        this._id = new Date().getTime();
        this.clear();

        return true;
    }

    getType() {
        return 'SVG';
    }

    refresh() {
    }

    getRect() {
        return { x: 0, y: 0, width: Math.max(this._rup(this.host.offsetWidth) - 1, 0), height: Math.max(this._rup(this.host.offsetHeight) - 1, 0) };
    }

    getContainer() {
        return this.container;
    }

    clear() {
        while (this.canvas.childNodes.length > 0) {
            this.removeElement(this.canvas.firstElementChild);
        }

        this._defaultParent = undefined;
        this._defs = document.createElementNS(this._svgns, 'defs');
        this._gradients = {};
        this.canvas.appendChild(this._defs);
    }

    removeElement(element) {
        if (undefined === element)
            return;

        try {
            while (element.firstChild) {
                this.removeElement(element.firstChild);
            }

            if (element.parentNode)
                element.parentNode.removeChild(element);
            else
                this.canvas.removeChild(element);
        }
        catch (error) {
            //
        }
    }

    beginGroup() {
        const parent = this._activeParent();
        const g = document.createElementNS(this._svgns, 'g');
        parent.appendChild(g);
        this._openGroups.push(g);

        return g;
    }

    endGroup() {
        if (this._openGroups.length === 0)
            return;

        this._openGroups.pop();
    }

    _activeParent() {
        return this._openGroups.length === 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
    }

    createClipRect(rect) {
        const c = document.createElementNS(this._svgns, 'clipPath');
        const r = document.createElementNS(this._svgns, 'rect');
        this.attr(r, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fill: 'none' });

        this._clipId = this._clipId || 0;
        c.id = 'cl' + this._id + '_' + (++this._clipId).toString();
        c.appendChild(r);

        this._defs.appendChild(c);

        return c;
    }

    getWindowHref() {
        // Get modified href. This is needed to handle cases where the page uses <base> tags.

        let href = window.location.href;
        if (!href)
            return href;

        href = href.replace(/([\('\)])/g, '\\$1'); // escape brackets & quotes (Chrome)
        href = href.replace(/#.*$/, ''); // remove bookmark links

        return href;
    }

    setClip(elem, clip) {
        const url = 'url(' + this.getWindowHref() + '#' + clip.id + ')';
        return this.attr(elem, { 'clip-path': url });
    }

    addHandler(element, event, fn) {
        element.addEventListener(event, fn);
    }

    removeHandler(/*element, event, fn*/) {
        //if ($(element).off)
        //    $(element).off(event, fn);
        //else
        //    $(element).unbind(event, fn);
    }

    on(element, event, fn) {
        this.addHandler(element, event, fn);
    }

    off(element, event, fn) {
        this.removeHandler(element, event, fn);
    }

    shape(name, params) {
        const s = document.createElementNS(this._svgns, name);
        if (!s)
            return undefined;

        for (let param in params)
            s.setAttribute(param, params[param]);

        this._activeParent().appendChild(s);

        return s;
    }

    _getTextParts(text, angle, params) {
        const textPartsInfo = { width: 0, height: 0, parts: [] };
        if (undefined === text)
            return textPartsInfo;

        const coeff = 0.6;
        const textParts = text.toString().split('<br>');

        const parent = this._activeParent();
        const txt = document.createElementNS(this._svgns, 'text');
        this.attr(txt, params);

        for (let i = 0; i < textParts.length; i++) {
            const textPart = textParts[i];

            const txtNode = txt.ownerDocument.createTextNode(textPart);
            txt.appendChild(txtNode);

            parent.appendChild(txt);
            let bbox;
            try {
                bbox = txt.getBBox();
            }
            catch (e) {
                //
            }

            const tw = this._rup(bbox.width);
            const th = this._rup(bbox.height * coeff);

            txt.removeChild(txtNode);

            textPartsInfo.width = Math.max(textPartsInfo.width, tw);
            textPartsInfo.height += th + (i > 0 ? 4 : 0);
            textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
        }
        parent.removeChild(txt);

        return textPartsInfo;
    }

    _measureText(text, angle, params, includeTextPartsInfo) {
        return super.measureText(text, angle, params, includeTextPartsInfo);
    }

    measureText(text, angle, params) {
        return this._measureText(text, angle, params, false);
    }

    text(text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
        const sz = this._measureText(text, angle, params, true, this);
        const textPartsInfo = sz.textPartsInfo;
        const textParts = textPartsInfo.parts;
        const color = this._getContrastColor(arguments[11]);

        let gClip;
        if (!halign)
            halign = 'center';
        if (!valign)
            valign = 'center';

        if (textParts.length > 1 || clip)
            gClip = this.beginGroup();

        if (clip) {
            const crect = this.createClipRect({ x: this._rup(x) - 1, y: this._rup(y) - 1, width: this._rup(width) + 2, height: this._rup(height) + 2 });
            this.setClip(gClip, crect);
        }

        //this.rect(x, y, width, height, {fill: 'yellow', stroke: 'red'});

        let parent = this._activeParent();

        let tw = 0, th = 0;

        tw = textPartsInfo.width;
        th = textPartsInfo.height;

        if (isNaN(width) || width <= 0)
            width = tw;
        if (isNaN(height) || height <= 0)
            height = th;

        const w = width || 0;
        const h = height || 0;

        let yOffset = 0;

        if (!angle || angle === 0) {
            y += th;

            if (valign === 'center' || valign === 'middle')
                y += (h - th) / 2;
            else if (valign === 'bottom')
                y += h - th;

            if (!width)
                width = tw;

            if (!height)
                height = th;

            parent = this._activeParent();
            let txt;
            for (let i = textParts.length - 1; i >= 0; i--) {
                txt = document.createElementNS(this._svgns, 'text');
                this.attr(txt, params);
                this.attr(txt, { cursor: 'default' });

                const txtNode = txt.ownerDocument.createTextNode(textParts[i].text);
                txt.appendChild(txtNode);

                let xOffset = x;
                const wPart = textParts[i].width;
                const hPart = textParts[i].height;

                if (halign === 'center')
                    xOffset += (w - wPart) / 2;
                else if (halign === 'right')
                    xOffset += (w - wPart);

                this.attr(txt, { x: this._rup(xOffset), y: this._rup(y + yOffset), width: this._rup(wPart), height: this._rup(hPart) });

                if (color !== undefined) {
                    txt.style.fill = color;
                }

                parent.appendChild(txt);

                yOffset -= textParts[i].height + 4;
            }

            if (gClip) {
                this.endGroup();
                return gClip;
            }

            return txt;
        }

        const point = this.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
        x = point.x;
        y = point.y;

        const gTranslate = this.shape('g', { transform: 'translate(' + x + ',' + y + ')' });
        const gRotate = this.shape('g', { transform: 'rotate(' + angle + ')' });

        gTranslate.appendChild(gRotate);

        // add the text blocks
        yOffset = 0;

        for (let i = textParts.length - 1; i >= 0; i--) {
            const tx = document.createElementNS(this._svgns, 'text');
            this.attr(tx, params);
            this.attr(tx, { cursor: 'default' });

            const txtNode = tx.ownerDocument.createTextNode(textParts[i].text);
            tx.appendChild(txtNode);

            let xOffset = 0;
            const wPart = textParts[i].width;
            const hPart = textParts[i].height;

            if (halign === 'center')
                xOffset += (textPartsInfo.width - wPart) / 2;
            else if (halign === 'right')
                xOffset += (textPartsInfo.width - wPart);

            this.attr(tx, { x: this._rup(xOffset), y: this._rup(yOffset), width: this._rup(wPart), height: this._rup(hPart) });
            gRotate.appendChild(tx);

            yOffset -= hPart + 4;
        }

        parent.appendChild(gTranslate);

        if (gClip)
            this.endGroup();

        return gTranslate;
    }

    line(x1, y1, x2, y2, params) {
        const line = this.shape('line', { x1: x1, y1: y1, x2: x2, y2: y2 });
        this.attr(line, params);
        return line;
    }

    path(points, params) {
        const s = this.shape('path');
        s.setAttribute('d', points);
        if (params) {
            this.attr(s, params);
        }
        return s;
    }

    rect(x, y, w, h, params) {
        x = this._ptrnd(x);
        y = this._ptrnd(y);
        w = Math.max(1, this._rnd(w, 1, false));
        h = Math.max(1, this._rnd(h, 1, false));
        const s = this.shape('rect', { x: x, y: y, width: w, height: h });
        if (params)
            this.attr(s, params);
        return s;
    }

    circle(x, y, r, params) {
        const s = this.shape('circle', { cx: x, cy: y, r: r });
        if (params)
            this.attr(s, params);
        return s;
    }

    pieslice(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
        const pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);

        const s = this.shape('path');
        s.setAttribute('d', pathCmd);

        if (params)
            this.attr(s, params);

        return s;
    }

    attr(element, params) {
        if (!element || !params)
            return;

        for (let param in params) {
            if (param === 'textContent')
                element.textContent = params[param];
            else {
                if (param === 'width' || param === 'height') {
                    element.setAttribute(param, Math.max(0, params[param]));
                }
                else {
                    element.setAttribute(param, params[param]);
                }
            }
        }
    }

    removeAttr(element, params) {
        if (!element || !params)
            return;

        for (let param in params) {
            if (param === 'textContent')
                element.textContent = '';
            else {
                element.removeAttribute(params[param]);
            }
        }
    }

    getAttr(element, key) {
        return element['getAttribute'](key);
    }

    _toLinearGradient(color, isVertical, stops) {
        const id = 'grd' + this._id + color.replace('#', '') + (isVertical ? 'v' : 'h');
        const url = 'url(' + this.getWindowHref() + '#' + id + ')';
        if (this._gradients[url])
            return url;

        const gr = document.createElementNS(this._svgns, 'linearGradient');
        this.attr(gr, { x1: '0%', y1: '0%', x2: isVertical ? '0%' : '100%', y2: isVertical ? '100%' : '0%', id: id });

        for (let i = 0; i < stops.length; i++) {
            const stop = stops[i];
            const s = document.createElementNS(this._svgns, 'stop');
            const st = 'stop-color:' + this.adjustColor(color, stop[1]);
            this.attr(s, { offset: stop[0] + '%', style: st });
            gr.appendChild(s);
        }

        this._defs.appendChild(gr);
        this._gradients[url] = true;

        return url;
    }

    _toRadialGradient(color, stops, coords) {
        const id = 'grd' + this._id + color.replace('#', '') + 'r' + (coords !== undefined ? coords.key : '');

        const url = 'url(' + this.getWindowHref() + '#' + id + ')';
        if (this._gradients[url])
            return url;

        const gr = document.createElementNS(this._svgns, 'radialGradient');
        if (coords === undefined)
            this.attr(gr, { cx: '50%', cy: '50%', r: '100%', fx: '50%', fy: '50%', id: id });
        else
            this.attr(gr, { cx: coords.x, cy: coords.y, r: coords.outerRadius, id: id, gradientUnits: 'userSpaceOnUse' });

        for (let i = 0; i < stops.length; i++) {
            const stop = stops[i];
            const s = document.createElementNS(this._svgns, 'stop');
            const st = 'stop-color:' + this.adjustColor(color, stop[1]);
            this.attr(s, { offset: stop[0] + '%', style: st });
            gr.appendChild(s);
        }

        this._defs.appendChild(gr);
        this._gradients[url] = true;

        return url;
    }
});

// HTML5Renderer class
Smart.Utilities.Assign('HTML5Renderer', class HTML5Renderer extends Smart.Utilities.Renderer {
    constructor(draw) {
        super(draw);

        const that = this;

        that._renderers = new Smart.Utilities.HTML5RenderHelpers(that);
    }

    init(host) {
        try {
            this.host = host;

            const chartContainer = document.createElement('div'),
                canvas = document.createElement('canvas');

            chartContainer.className = 'chartContainer';
            chartContainer.style.position = 'relative';
            chartContainer.onselectstart = function () {
                return false;
            }

            canvas.id = '__smartCanvasWrap';
            canvas.style.width = '100%';
            canvas.style.height = '100%';

            chartContainer.appendChild(canvas);
            host.appendChild(chartContainer);

            this.canvas = canvas;
            canvas.width = host.offsetWidth;
            canvas.height = host.offsetHeight;
            this.ctx = canvas.getContext('2d');

            this._elements = {};
            this._maxId = 0;
            this._gradientId = 0;
            this._gradients = {};
            this._currentPoint = { x: 0, y: 0 };
            this._lastCmd = '';
            this._pos = 0;
        }
        catch (e) {
            return false;
        }

        return true;
    }

    getType() {
        return 'HTML5';
    }

    getContainer() {
        let container = this.host.getElementsByClassName('chartContainer')[0];
        return container;
    }

    getRect() {
        return { x: 0, y: 0, width: this.canvas.width - 1, height: this.canvas.height - 1 };
    }

    beginGroup() {
    }

    endGroup() {
    }

    setClip() {
    }

    createClipRect() {
    }

    addHandler() {
        // unsupported
    }

    removeHandler() {
        // unsupported
    }

    on(element, event, fn) {
        this.addHandler(element, event, fn);
    }

    off(element, event, fn) {
        this.removeHandler(element, event, fn);
    }

    clear() {
        this._elements = {};
        this._maxId = 0;
        this._renderers._gradients = {};
        this._gradientId = 0;
    }

    removeElement(element) {
        if (undefined === element)
            return;
        if (this._elements[element.id])
            delete this._elements[element.id];
    }

    shape(name, params) {
        let s = { type: name, id: this._maxId++ };

        for (let param in params)
            s[param] = params[param];

        this._elements[s.id] = s;

        return s;
    }

    attr(element, params) {
        for (let param in params)
            element[param] = params[param];
    }

    removeAttr(element, params) {
        for (let param in params) {
            delete element[params[param]];
        }
    }

    rect(x, y, w, h, params) {
        if (isNaN(x))
            throw 'Invalid value for "x"';
        if (isNaN(y))
            throw 'Invalid value for "y"';
        if (isNaN(w))
            throw 'Invalid value for "width"';
        if (isNaN(h))
            throw 'Invalid value for "height"';

        let s = this.shape('rect', { x: x, y: y, width: w, height: h });
        if (params)
            this.attr(s, params);
        return s;
    }

    path(pathCmd, params) {
        let s = this.shape('path', params);
        this.attr(s, { d: pathCmd });
        return s;
    }

    line(x1, y1, x2, y2, params) {
        return this.path('M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2, params);
    }

    circle(x, y, r, params) {
        let s = this.shape('circle', { x: x, y: y, r: r });
        if (params)
            this.attr(s, params);
        return s;
    }

    pieslice(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
        let element = this.path(this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset), params);
        this.attr(element, { x: x, y: y, innerRadius: innerRadius, outerRadius: outerRadius, angleFrom: angleFrom, angleTo: angleTo });
        return element;
    }

    _getCSSStyle(name) {
        const measureElement = document.createElement('div');

        measureElement.className = name;
        measureElement.style.position = 'absolute';
        measureElement.style.visibility = 'hidden';

        this.host.appendChild(measureElement);

        let style = window.getComputedStyle(measureElement);

        style = {
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight
        };

        this.host.removeChild(measureElement);

        return style;
    }

    _getTextParts(text, angle, params) {
        let fontFamily = 'Arial';
        let fontSize = '10pt';
        let fontWeight = '';
        if (params && params['class']) {
            let style = this._getCSSStyle(params['class']);

            if (style['fontSize'])
                fontSize = style['fontSize'];
            if (style['fontFamily'])
                fontFamily = style['fontFamily'];
            if (style['fontWeight'])
                fontWeight = style['fontWeight'];
        }

        this.ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

        let textPartsInfo = { width: 0, height: 0, parts: [] };

        let coeff = 0.6;
        let textParts = text.toString().split('<br>');
        for (let i = 0; i < textParts.length; i++) {
            let textPart = textParts[i];

            let tw = this.ctx.measureText(textPart).width;
            let span = document.createElement('span');
            span.className = 'smartchart';
            span.font = this.ctx.font;
            span.textContent = textPart;
            this.host.appendChild(span);
            let th = span.offsetHeight * coeff;
            this.host.removeChild(span);

            textPartsInfo.width = Math.max(textPartsInfo.width, this._rup(tw));
            textPartsInfo.height += th + (i > 0 ? 4 : 0);
            textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
        }

        return textPartsInfo;
    }

    _measureText(text, angle, params, includeTextPartsInfo) {
        return super.measureText(text, angle, params, includeTextPartsInfo);
    }

    measureText(text, angle, params) {
        return this._measureText(text, angle, params, false);
    }

    text(text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
        let t = this.shape('text', { text: text, x: x, y: y, width: width, height: height, angle: angle, clip: clip, halign: halign, valign: valign, rotateAround: rotateAround });
        if (params)
            this.attr(t, params);

        t.fontFamily = 'Arial';
        t.fontSize = '10pt';
        t.fontWeight = '';
        t.color = this._getContrastColor(arguments[11]);

        if (params && params['class']) {
            let style = this._getCSSStyle(params['class']);
            t.fontFamily = style.fontFamily || t.fontFamily;
            t.fontSize = style.fontSize || t.fontSize;
            t.fontWeight = style['fontWeight'] || t.fontWeight;
            t.color = t.color || style.color;
        }

        t.color = t.color || '#000000';

        let sz = this._measureText(text, 0, params, true);
        this.attr(t, { textPartsInfo: sz.textPartsInfo, textWidth: sz.width, textHeight: sz.height });

        if (width <= 0 || isNaN(width))
            this.attr(t, { width: sz.width });

        if (height <= 0 || isNaN(height))
            this.attr(t, { height: sz.height });

        return t;
    }

    _toLinearGradient(color, isVertical, stops) {
        if (this._renderers._gradients[color])
            return color;

        let colorStops = [];
        for (let i = 0; i < stops.length; i++)
            colorStops.push({ percent: stops[i][0] / 100, color: this.adjustColor(color, stops[i][1]) });

        let name = 'gr' + this._gradientId++;
        this.createGradient(name, isVertical ? 'vertical' : 'horizontal', colorStops);
        return name;
    }

    _toRadialGradient(color, stops) {
        if (this._renderers._gradients[color])
            return color;

        let colorStops = [];
        for (let i = 0; i < stops.length; i++)
            colorStops.push({ percent: stops[i][0] / 100, color: this.adjustColor(color, stops[i][1]) });

        let name = 'gr' + this._gradientId++;
        this.createGradient(name, 'radial', colorStops);
        return name;
    }

    createGradient(name, orientation, colorStops) {
        this._renderers.createGradient(this, name, orientation, colorStops);
    }

    refresh() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let element in this._elements) {
            let params = this._elements[element];

            this._renderers.setFillStyle(this, params);
            this._renderers.setStroke(this, params);

            this._renderers[this._elements[element].type](this.ctx, params);
        }
    }
});

// HTML5RenderHelpers class
Smart.Utilities.Assign('HTML5RenderHelpers', class HTML5RenderHelpers {
    constructor(HTML5Renderer) {
        this.HTML5Renderer = HTML5Renderer;
        this._cmds = 'mlcazq';
    }

    ptrnd(val) {
        if (Math.abs(Math.round(val) - val) === 0.5)
            return val;

        let rnd = Math.round(val);
        if (rnd < val)
            rnd = rnd - 1;

        return rnd + 0.5;
    }

    createGradient(context, name, orientation, colorStops) {
        context._gradients[name] = { orientation: orientation, colorStops: colorStops };
    }

    setStroke(context, params) {
        let ctx = context.ctx,
            strokeWidth = params['stroke-width'];

        ctx.strokeStyle = params['stroke'] || 'transparent';

        if (strokeWidth === 0) {
            ctx.lineWidth = 0.01;
        }
        else if (strokeWidth !== undefined) {
            ctx.lineWidth = strokeWidth;
        }
        else {
            ctx.lineWidth = 1;
        }

        if (params['fill-opacity'] !== undefined) {
            ctx.globalAlpha = params['fill-opacity'];
        }
        else if (params['opacity'] !== undefined) {
            ctx.globalAlpha = params['opacity'];
        }
        else {
            ctx.globalAlpha = 1;
        }

        if (ctx.setLineDash) {
            if (params['stroke-dasharray'])
                ctx.setLineDash(params['stroke-dasharray'].split(','));
            else
                ctx.setLineDash([]);
        }
    }

    setFillStyle(context, params) {
        let ctx = context.ctx;

        ctx.fillStyle = 'transparent';

        if (params['fill-opacity'] !== undefined) {
            ctx.globalAlpha = params['fill-opacity'];
        }
        else if (params['opacity'] !== undefined) {
            ctx.globalAlpha = params['opacity'];
        }
        else {
            ctx.globalAlpha = 1;
        }

        if (params.fill && params.fill.indexOf('#') === -1 && context._gradients[params.fill]) {
            let isVertical = context._gradients[params.fill].orientation !== 'horizontal';
            let isRadial = context._gradients[params.fill].orientation === 'radial';
            let x1 = this.ptrnd(params.x);
            let y1 = this.ptrnd(params.y);
            let x2 = this.ptrnd(params.x + (isVertical ? 0 : params.width));
            let y2 = this.ptrnd(params.y + (isVertical ? params.height : 0));

            let gradient;

            if ((params.type === 'circle' || params.type === 'path' || params.type === 'rect') && isRadial) {
                let x = this.ptrnd(params.x),
                    y = this.ptrnd(params.y);
                const r1 = params.innerRadius || 0,
                    r2 = params.outerRadius || params.r || 0;

                if (params.type === 'rect') {
                    x += params.width / 2;
                    y += params.height / 2;
                }

                gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
            }

            if (!isRadial) {
                if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                    x1 = 0;
                    y1 = 0;
                    x2 = isVertical ? 0 : ctx.canvas.width;
                    y2 = isVertical ? ctx.canvas.height : 0;
                }

                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            }

            let colorStops = context._gradients[params.fill].colorStops;
            for (let i = 0; i < colorStops.length; i++)
                gradient.addColorStop(colorStops[i].percent, colorStops[i].color);

            ctx.fillStyle = gradient;
        }
        else if (params.fill) {
            ctx.fillStyle = params.fill;
        }
    }

    rect(ctx, params) {
        if (params.width === 0 || params.height === 0)
            return;
        ctx.fillRect(this.ptrnd(params.x), this.ptrnd(params.y), params.width, params.height);
        ctx.strokeRect(this.ptrnd(params.x), this.ptrnd(params.y), params.width, params.height);
    }

    circle(ctx, params) {
        if (params.r === 0)
            return;
        ctx.beginPath();
        ctx.arc(this.ptrnd(params.x), this.ptrnd(params.y), params.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    _parsePoint(str) {
        let x = this._parseNumber(str);
        let y = this._parseNumber(str);
        return ({ x: x, y: y });
    }

    _parseNumber(str) {
        let numStarted = false, i;
        for (i = this._pos; i < str.length; i++) {
            if ((str[i] >= '0' && str[i] <= '9') || str[i] === '.' || str[i] === 'e' || (str[i] === '-' && !numStarted) || (str[i] === '-' && i >= 1 && str[i - 1] === 'e')) {
                numStarted = true;
                continue;
            }
            if (!numStarted && (str[i] === ' ' || str[i] === ',')) {
                this._pos++;
                continue;
            }

            break;
        }

        let val = parseFloat(str.substring(this._pos, i));
        if (isNaN(val))
            return undefined;

        this._pos = i;
        return val;
    }

    _isRelativeCmd(cmd) {
        return this._cmds.indexOf(cmd) !== -1;
    }

    _parseCmd(string) {
        for (let i = this._pos; i < string.length; i++) {
            if (this._cmds.toLowerCase().indexOf(string[i].toLowerCase()) !== -1) {
                this._pos = i + 1;
                this._lastCmd = string[i];
                return this._lastCmd;
            }
            if (string[i] === ' ') {
                this._pos++;
                continue;
            }
            if (string[i] >= '0' && string[i] <= '9') {
                this._pos = i;
                if (this._lastCmd === '')
                    break;
                else
                    return this._lastCmd;
            }
        }

        return undefined;
    }

    _toAbsolutePoint(point) {
        return { x: this._currentPoint.x + point.x, y: this._currentPoint.y + point.y };
    }

    path(ctx, params) {
        let path = params.d;

        this._pos = 0;
        this._lastCmd = '';

        let firstPoint = undefined;
        this._currentPoint = { x: 0, y: 0 };

        ctx.beginPath();

        while (this._pos < path.length) {
            let cmd = this._parseCmd(path);
            if (cmd === undefined)
                break;

            if (cmd === 'M' || cmd === 'm') {
                let point = this._parsePoint(path);
                if (point === undefined)
                    break;
                ctx.moveTo(point.x, point.y);
                this._currentPoint = point;
                if (firstPoint === undefined)
                    firstPoint = point;

                continue;
            }

            if (cmd === 'L' || cmd === 'l') {
                let point = this._parsePoint(path);
                if (point === undefined)
                    break;

                ctx.lineTo(point.x, point.y);
                this._currentPoint = point;
                continue;
            }

            if (cmd === 'A' || cmd === 'a') {
                let rx = this._parseNumber(path);
                let ry = this._parseNumber(path);
                let angle = this._parseNumber(path) * (Math.PI / 180.0);
                let largeFlag = this._parseNumber(path);
                let sweepFlag = this._parseNumber(path);
                let endPoint = this._parsePoint(path);

                if (this._isRelativeCmd(cmd)) {
                    endPoint = this._toAbsolutePoint(endPoint);
                }

                if (rx === 0 || ry === 0)
                    continue;

                let cp = this._currentPoint;

                /// START
                // x1', y1'
                let cp2 = {
                    x: Math.cos(angle) * (cp.x - endPoint.x) / 2.0 + Math.sin(angle) * (cp.y - endPoint.y) / 2.0,
                    y: -Math.sin(angle) * (cp.x - endPoint.x) / 2.0 + Math.cos(angle) * (cp.y - endPoint.y) / 2.0
                };

                // adjust radii
                let adj = Math.pow(cp2.x, 2) / Math.pow(rx, 2) + Math.pow(cp2.y, 2) / Math.pow(ry, 2);
                if (adj > 1) {
                    rx *= Math.sqrt(adj);
                    ry *= Math.sqrt(adj);
                }

                // cx', cy'
                let s = (largeFlag === sweepFlag ? -1 : 1) * Math.sqrt(
                    ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(cp2.y, 2)) - (Math.pow(ry, 2) * Math.pow(cp2.x, 2))) /
                    (Math.pow(rx, 2) * Math.pow(cp2.y, 2) + Math.pow(ry, 2) * Math.pow(cp2.x, 2))
                );

                if (isNaN(s))
                    s = 0;

                let cp3 = { x: s * rx * cp2.y / ry, y: s * -ry * cp2.x / rx };

                // cx, cy
                let centerPoint = {
                    x: (cp.x + endPoint.x) / 2.0 + Math.cos(angle) * cp3.x - Math.sin(angle) * cp3.y,
                    y: (cp.y + endPoint.y) / 2.0 + Math.sin(angle) * cp3.x + Math.cos(angle) * cp3.y
                };

                // vector magnitude
                let m = function (v) {
                    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
                }

                // ratio between two vectors
                let r = function (u, v) {
                    return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
                }

                // angle between two vectors
                let a = function (u, v) {
                    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
                }

                // initial angle
                let startAngle = a([1, 0], [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry]);

                // angle delta
                let u = [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry];
                let v = [(-cp2.x - cp3.x) / rx, (-cp2.y - cp3.y) / ry];
                let deltaAngle = a(u, v);
                if (r(u, v) <= -1)
                    deltaAngle = Math.PI;

                if (r(u, v) >= 1)
                    deltaAngle = 0;

                if (sweepFlag === 0 && deltaAngle > 0)
                    deltaAngle = deltaAngle - 2 * Math.PI;

                if (sweepFlag === 1 && deltaAngle < 0)
                    deltaAngle = deltaAngle + 2 * Math.PI;

                let r1 = (rx > ry) ? rx : ry;
                let sx = (rx > ry) ? 1 : rx / ry;
                let sy = (rx > ry) ? ry / rx : 1;

                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.rotate(angle);
                ctx.scale(sx, sy);
                ctx.arc(0, 0, r1, startAngle, startAngle + deltaAngle, 1 - sweepFlag);
                ctx.scale(1 / sx, 1 / sy);
                ctx.rotate(-angle);

                ctx.translate(-centerPoint.x, -centerPoint.y);

                continue;
            }

            if ((cmd === 'Z' || cmd === 'z') && firstPoint !== undefined) {
                ctx.lineTo(firstPoint.x, firstPoint.y);
                this._currentPoint = firstPoint;
                continue;
            }

            if (cmd === 'C' || cmd === 'c') {
                let p1 = this._parsePoint(path);
                let p2 = this._parsePoint(path);
                let p3 = this._parsePoint(path);

                ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                this._currentPoint = p3;
                continue;
            }

            if (cmd === 'Q' || cmd === 'q') {
                let p1 = this._parsePoint(path);
                let p2 = this._parsePoint(path);

                ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                this._currentPoint = p2;
                continue;
            }

        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    text(ctx, params) {
        let x = this.ptrnd(params.x);
        let y = this.ptrnd(params.y);
        let width = this.ptrnd(params.width);
        let height = this.ptrnd(params.height);
        let halign = params.halign;
        let valign = params.valign;
        let angle = params.angle;
        let rotateAround = params.rotateAround;
        let textPartsInfo = params.textPartsInfo;
        let textParts = textPartsInfo.parts;

        let clip = params.clip;
        if (clip === undefined)
            clip = true;

        ctx.save();

        if (!halign)
            halign = 'center';
        if (!valign)
            valign = 'center';

        if (clip) {
            ctx.rect(x, y, width, height);
            ctx.clip();
        }

        let tw = params.textWidth;
        let th = params.textHeight;

        let w = width || 0;
        let h = height || 0;

        ctx.fillStyle = params.color;
        ctx.font = params.fontWeight + ' ' + params.fontSize + ' ' + params.fontFamily;

        if (!angle || angle === 0) {
            y += th;

            if (valign === 'center' || valign === 'middle')
                y += (h - th) / 2;
            else if (valign === 'bottom')
                y += h - th;

            if (!width)
                width = tw;

            if (!height)
                height = th;

            let yOffset = 0;

            for (let i = textParts.length - 1; i >= 0; i--) {
                let textPart = textParts[i];
                let xOffset = x;
                let wPart = textParts[i].width;

                if (halign === 'center')
                    xOffset += (w - wPart) / 2;
                else if (halign === 'right')
                    xOffset += (w - wPart);

                ctx.fillText(textPart.text, xOffset, y + yOffset);
                yOffset -= textPart.height + (i > 0 ? 4 : 0);
            }
            ctx.restore();
            return;
        }

        let point = this.HTML5Renderer.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
        x = point.x;
        y = point.y;

        let rads = angle * Math.PI * 2 / 360;
        ctx.translate(x, y);
        ctx.rotate(rads);

        let yOffset = 0;
        let maxW = textPartsInfo.width;

        for (let i = textParts.length - 1; i >= 0; i--) {
            let xOffset = 0;

            if (halign === 'center')
                xOffset += (maxW - textParts[i].width) / 2;
            else if (halign === 'right')
                xOffset += (maxW - textParts[i].width);

            ctx.fillText(textParts[i].text, xOffset, yOffset);

            yOffset -= textParts[i].height + 4;
        }

        ctx.restore();
    }
});

// Plot class
Smart.Utilities.Assign('Plot', class Plot {
    constructor(renderer) {
        this.renderer = renderer;
    }

    get(array, index, key) {
        return key !== undefined ? array[index][key] : array[index];
    }

    min(array, key) {
        let min = NaN;
        for (let i = 0; i < array.length; i++) {
            let val = this.get(array, i, key);

            if (isNaN(min) || val < min)
                min = val;
        }

        return min;
    }

    max(array, key) {
        let max = NaN;
        for (let i = 0; i < array.length; i++) {
            let val = this.get(array, i, key);

            if (isNaN(max) || val > max)
                max = val;
        }

        return max;
    }

    sum(array, key) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            let val = this.get(array, i, key);
            if (!isNaN(val))
                sum += val;
        }

        return sum;
    }

    count(array, key) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            let val = this.get(array, i, key);
            if (!isNaN(val))
                count++;
        }

        return count;
    }

    avg(array, key) {
        return this.sum(array, key) / Math.max(1, this.count(array, key));
    }

    filter(array, fn) {
        if (!fn)
            return array;

        let out = [];
        for (let i = 0; i < array.length; i++)
            if (fn(array[i]))
                out.push(array[i]);

        return out;
    }

    scale(val, range, scale_range, params) {
        if (isNaN(val))
            return NaN;

        if (val < Math.min(range.min, range.max) || val > Math.max(range.min, range.max)) {
            if (!params || params['ignore_range'] !== true)
                return NaN;
        }

        let outVal = NaN;

        let percent = 1;
        if (range.type === undefined || range.type !== 'logarithmic') {
            let denom = Math.abs(range.max - range.min);
            if (!denom)
                denom = 1;
            percent = Math.abs(val - Math.min(range.min, range.max)) / denom;
        }
        else if (range.type === 'logarithmic') {
            let logBase = range.base;
            if (isNaN(logBase))
                logBase = 10;

            let min = Math.min(range.min, range.max);
            if (min <= 0)
                min = 1;

            let max = Math.max(range.min, range.max);
            if (max <= 0)
                max = 1;

            let maxPow = Math.log(max) / Math.log(logBase);
            max = Math.pow(logBase, maxPow);

            let minPow = Math.log(min) / Math.log(logBase);
            min = Math.pow(logBase, minPow);

            let valPow = Math.log(val) / Math.log(logBase);

            percent = Math.abs(valPow - minPow) / (maxPow - minPow);
        }

        if (scale_range.type === 'logarithmic') {
            let logBase = scale_range.base;
            if (isNaN(logBase))
                logBase = 10;

            let maxPow = Math.log(scale_range.max) / Math.log(logBase);
            let minPow = Math.log(scale_range.min) / Math.log(logBase);

            if (scale_range.flip)
                percent = 1 - percent;

            let valPow = Math.min(minPow, maxPow) + percent * Math.abs(maxPow - minPow);
            outVal = Math.pow(logBase, valPow);
        }
        else {
            outVal = Math.min(scale_range.min, scale_range.max) + percent * Math.abs(scale_range.max - scale_range.min);

            if (scale_range.flip)
                outVal = Math.max(scale_range.min, scale_range.max) - outVal + scale_range.min;
        }

        return outVal;
    }

    axis(min, max, preferedCount) {
        if (preferedCount <= 1)
            return [max, min];

        //let minSave = min;
        //let maxSave = max;

        if (isNaN(preferedCount) || preferedCount < 2)
            preferedCount = 2;

        let decimalPlaces = 0;
        while (Math.round(min) !== min && Math.round(max) !== max && decimalPlaces < 10) {
            min *= 10;
            max *= 10;
            decimalPlaces++;
        }

        let preferedIntSize = (max - min) / preferedCount;
        while (decimalPlaces < 10 && Math.round(preferedIntSize) !== preferedIntSize) {
            min *= 10;
            max *= 10;
            preferedIntSize *= 10;
            decimalPlaces++;
        }

        let scale = [1, 2, 5];

        //let itemsCount = 0;
        let i = 0;
        let intSizeNext;

        // eslint-disable-next-line
        while (true) {
            let idx = i % scale.length;
            let pow = Math.floor(i / scale.length);
            let intSizeCurr = Math.pow(10, pow) * scale[idx];

            idx = (i + 1) % scale.length;
            pow = Math.floor((i + 1) / scale.length);
            intSizeNext = Math.pow(10, pow) * scale[idx];

            if (preferedIntSize >= intSizeCurr && preferedIntSize < intSizeNext)
                break;

            i++;
        }

        let intSizeSelected = intSizeNext;

        let out = [];
        let curr = this.renderer._rnd(min, intSizeSelected, false);
        let denominator = decimalPlaces <= 0 ? 1 : Math.pow(10, decimalPlaces);
        while (curr < max + intSizeSelected) {
            out.push(curr / denominator);
            curr += intSizeSelected;
        }

        return out;
    }
});
