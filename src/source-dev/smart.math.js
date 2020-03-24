
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

let bigIntNativeSupport;

try {
    BigInt;
    bigIntNativeSupport = true;
}
catch (error) {
    bigIntNativeSupport = false;
}

// BigNumber class in Smart.Utilities
Smart.Utilities.Assign('BigNumber', class UtilitiesBigNumber {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/classes/bignumber [rev. #4]

    constructor(n, p, r) {
        var o = this, i;

        if (Smart.Utilities.BigNumber.bigIntSupport) {
            if (n instanceof Smart.Utilities.BigNumber) {
                if (Array.isArray(n._d)) {
                    n = (n._s ? '-' : '') + (n._d.slice(0, n._f).join('') || '0') + (n._f != n._d.length ? '.' + n._d.slice(n._f).join('') : '');
                }
                else {
                    return new Smart.Utilities.BigNumber(n._d);
                }
            }

            try {
                if (n === null) {
                    o._d = BigInt(0);
                }
                else if (typeof n === 'string' && n.toLowerCase().indexOf('e') !== -1) {
                    o._d = BigInt(parseFloat(n));
                }
                else {
                    o._d = BigInt(n);
                }
            }
            catch (error) {
                try {
                    const numberParts = n.toString().split('.');
                    let result = BigInt(numberParts[0]),
                        firstDecimalDigit = parseInt(numberParts[1].charAt(0));

                    if (result >= 0 && firstDecimalDigit >= 5) {
                        result = result + BigInt(1);
                    }
                    else if (result < 0) {
                        if (firstDecimalDigit > 5) {
                            result = result - BigInt(1);
                        }
                        else if (firstDecimalDigit === 5) {
                            let iterator = 1,
                                nextChar = numberParts[1].charAt(iterator),
                                roundDown = false;

                            while (nextChar !== '') {
                                iterator++;
                                nextChar = numberParts[1].charAt(iterator);

                                if (nextChar !== '0') {
                                    roundDown = true;
                                    break;
                                }
                            }

                            if (roundDown) {
                                result = result - BigInt(1);
                            }
                        }
                    }

                    o._d = result;
                }
                catch (error) {
                    o._d = BigInt(0);
                }
            }

            o._f = o._d.toString().replace('-', '').length;
            o._s = o._d < 0;
            return;
        }

        if (n instanceof Smart.Utilities.BigNumber) {
            if (typeof n._d === 'bigint') {
                return new Smart.Utilities.BigNumber(n._d.toString());
            }

            for (i in { precision: 0, roundType: 0, _s: 0, _f: 0 }) o[i] = n[i];
            o._d = n._d.slice();

            if (n._s && n._d.length === 1 && n._d[0] === 0) {
                // n is -0
                o._s = false;
            }

            return;
        }

        if (n !== undefined) {
            if (n === '-0') {
                n = '0';
            }

            // exponential notation support
            if (new RegExp(/e/i).test(n)) {
                var stringExponential = n.toString().toLowerCase(),
                    indexOfE = stringExponential.indexOf('e'),
                    mantissa = new Smart.Utilities.BigNumber(stringExponential.slice(0, indexOfE)),
                    exponent = stringExponential.slice(indexOfE + 2),
                    sign = stringExponential.slice(indexOfE + 1, indexOfE + 2),
                    bigTen = new Smart.Utilities.BigNumber(10),
                    multyplyBy = bigTen.pow(sign + exponent),
                    result = mantissa.multiply(multyplyBy);

                n = result.toString();
            }
        }

        o.precision = isNaN(p = Math.abs(p)) ? Smart.Utilities.BigNumber.defaultPrecision : p;
        o.roundType = isNaN(r = Math.abs(r)) ? Smart.Utilities.BigNumber.defaultRoundType : r;
        o._s = (n += '').charAt(0) == '-';
        o._f = ((n = n.replace(/[^\d.]/g, '').split('.', 2))[0] = n[0].replace(/^0+/, '') || '0').length;
        for (i = (n = o._d = (n.join('') || '0').split('')).length; i; n[--i] = +n[i]);
        o.round();
    }

    static get defaultPrecision() {
        return 40;
    }

    static get defaultRoundType() {
        return 4;
    }

    static get bigIntSupport() {
        return bigIntNativeSupport && Smart.Utilities.BigNumber.ignoreBigIntNativeSupport !== true;
    }

    add(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d + new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        if (that.isZero() && that._s) { // that.toString() is '-0'
            that._s = false;
        }

        if (n === 0 || (n.constructor === Smart.Utilities.BigNumber && n._d.length === 1 && n._d[0] === 0)) {
            return new Smart.Utilities.BigNumber(that);
        }

        if (that._s != (n = new Smart.Utilities.BigNumber(n))._s)
            return n._s ^= 1, that.subtract(n);
        var o = new Smart.Utilities.BigNumber(that), a = o._d, b = n._d, la = o._f,
            lb = n._f, i, r;
        n = Math.max(la, lb);
        la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
        i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length;
        for (r = 0; i; r = (a[--i] = a[i] + b[i] + r) / 10 >>> 0, a[i] %= 10);
        return r && ++n && a.unshift(r), o._f = n, o.round();
    }

    subtract(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d - new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        if (that.isZero() && that._s) { // that.toString() is '-0'
            that._s = false;
        }

        if (n === 0 || (n.constructor === Smart.Utilities.BigNumber && n._d.length === 1 && n._d[0] === 0)) {
            return new Smart.Utilities.BigNumber(that);
        }

        if (that._s != (n = new Smart.Utilities.BigNumber(n))._s)
            return n._s ^= 1, that.add(n);
        var o = new Smart.Utilities.BigNumber(that), c = o.abs().compare(n.abs()) + 1, a = c ? o : n, b = c ? n : o, la = a._f, lb = b._f, d = la, i, j;
        a = a._d, b = b._d, la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
        for (i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length; i;) {
            if (a[--i] < b[i]) {
                for (j = i; j && !a[--j]; a[j] = 9);
                --a[j], a[i] += 10;
            }
            b[i] = a[i] - b[i];
        }
        return c || (o._s ^= 1), o._f = d, o._d = b, o.round();
    }

    multiply(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d * new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        var o = new Smart.Utilities.BigNumber(that), r = o._d.length >= (n = new Smart.Utilities.BigNumber(n))._d.length, a = (r ? o : n)._d,
            b = (r ? n : o)._d, la = a.length, lb = b.length, x = new Smart.Utilities.BigNumber, i, j, s;
        for (i = lb; i; r && s.unshift(r), x.set(x.add(new Smart.Utilities.BigNumber(s.join('')))))
            for (s = (new Array(lb - --i)).join('0').split(''), r = 0, j = la; j; r += a[--j] * b[i], s.unshift(r % 10), r = (r / 10) >>> 0);
        return o._s = o._s != n._s, o._f = ((r = la + lb - o._f - n._f) >= (j = (o._d = x._d).length) ? that._zeroes(o._d, r - j + 1, 1).length : j) - r, o.round();
    }

    divide(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d / new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        if ((n = new Smart.Utilities.BigNumber(n)) == '0')
            throw new Error('Division by 0');
        else if (that == '0')
            return new Smart.Utilities.BigNumber;
        var o = new Smart.Utilities.BigNumber(that), a = o._d, b = n._d, la = a.length - o._f,
            lb = b.length - n._f, r = new Smart.Utilities.BigNumber, i = 0, j, s, l, f = 1, c = 0, e = 0;
        r._s = o._s != n._s, r.precision = Math.max(o.precision, n.precision),
            r._f = +r._d.pop(), la != lb && o._zeroes(la > lb ? b : a, Math.abs(la - lb));
        n._f = b.length, b = n, b._s = false, b = b.round();
        for (n = new Smart.Utilities.BigNumber; a[0] == '0'; a.shift());
        out:
        do {
            for (l = c = 0, n == '0' && (n._d = [], n._f = 0); i < a.length && n.compare(b) == -1; ++i) {
                (l = i + 1 == a.length, (!f && ++c > 1 || (e = l && n == '0' && a[i] == '0')))
                    && (r._f == r._d.length && ++r._f, r._d.push(0));
                (a[i] == '0' && n == '0') || (n._d.push(a[i]), ++n._f);
                if (e)
                    break out;
                if ((l && n.compare(b) == -1 && (r._f == r._d.length && ++r._f, 1)) || (l = 0))
                    while (r._d.push(0), n._d.push(0), ++n._f, n.compare(b) == -1);
            }
            if (f = 0, n.compare(b) == -1 && !(l = 0))
                while (l ? r._d.push(0) : l = 1, n._d.push(0), ++n._f, n.compare(b) == -1);
            var y;
            for (s = new Smart.Utilities.BigNumber, j = 0; n.compare(y = s.add(b)) + 1 && ++j; s.set(y));
            n.set(n.subtract(s)), !l && r._f == r._d.length && ++r._f, r._d.push(j);
        }
        while ((i < a.length || n != '0') && (r._d.length - r._f) <= r.precision);
        return r.round();
    }

    mod(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d % new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        var result = that.subtract(that.divide(n).intPart().multiply(n));
        if (result.isZero() && result._s) {
            result._s = !(result._s);
        }
        return result;
    }

    pow(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            let result = BigInt(1);

            for (let i = BigInt(0); i < new Smart.Utilities.BigNumber(n)._d; i = i + BigInt(1)) {
                result = result * this._d;
            }

            return new Smart.Utilities.BigNumber(result);
            // Use the following solution when UglifyJS supports **
            //return new Smart.Utilities.BigNumber(this._d ** new Smart.Utilities.BigNumber(n)._d);
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        var o = new Smart.Utilities.BigNumber(that), i;
        if ((n = (new Smart.Utilities.BigNumber(n)).intPart()) == 0) return o.set(1);
        for (i = Math.abs(n); --i; o.set(o.multiply(that)));
        return n < 0 ? o.set((new Smart.Utilities.BigNumber(1)).divide(o)) : o;
    }

    set(n) {
        n = new Smart.Utilities.BigNumber(n);
        this._d = n._d;
        this._f = n._f;
        this._s = n._s;
        return this;
    }

    compare(n) {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            const otherNumber = new Smart.Utilities.BigNumber(n)._d;

            if (this._d === otherNumber) {
                return 0;
            }

            if (this._d > otherNumber) {
                return 1;
            }

            return -1;
        }

        let that = this.normalizeOperand(this);

        n = that.normalizeOperand(n);

        var a = that, la = that._f, b = new Smart.Utilities.BigNumber(n), lb = b._f, r = [-1, 1], i, l, arr;
        if (a.isZero() && b.isZero()) {
            return 0;
        }
        if (a._s != b._s)
            return a._s ? -1 : 1;
        if (la != lb)
            return r[(la > lb) ^ a._s];
        for (la = (arr = a._d).length, lb = (b = b._d).length, i = -1, l = Math.min(la, lb); ++i < l;)
            if (arr[i] != b[i])
                return r[(arr[i] > b[i]) ^ a._s];
        return la != lb ? r[(la > lb) ^ a._s] : 0;
    }

    negate() {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d * BigInt(-1));
        }

        let that = this.normalizeOperand(this);

        var n = new Smart.Utilities.BigNumber(that); return n._s ^= 1, n;
    }

    abs() {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d < 0 ? this._d * BigInt(-1) : this._d);
        }

        let that = this.normalizeOperand(this);

        var n = new Smart.Utilities.BigNumber(that); return n._s = 0, n;
    }

    intPart() {
        if (Smart.Utilities.BigNumber.bigIntSupport) {
            return new Smart.Utilities.BigNumber(this._d);
        }

        let that = this.normalizeOperand(this);

        return new Smart.Utilities.BigNumber((that._s ? '-' : '') + (that._d.slice(0, that._f).join('') || '0'));
    }

    valueOf(radix, wordLength) {
        let that = this.normalizeOperand(this);

        return that.toString(radix, wordLength);
    }

    toString(radix, wordLength, leadingZeros) {
        function negativeBinary(result, radix, wordLength) {
            var reversedResult = '';

            if (String.prototype.repeat) {
                var zeroPadding = '0'.repeat(wordLength - result.length);
                result = zeroPadding + result;
            } {
                while (result.length < wordLength) {
                    result = '0' + result;
                }
            }

            reversedResult = result.replace(/0/g, 'a');
            reversedResult = reversedResult.replace(/1/g, 'b');
            reversedResult = reversedResult.replace(/a/g, '1');
            reversedResult = reversedResult.replace(/b/g, '0');

            var plusOne = true;
            var finalResult = '';

            for (var j = reversedResult.length - 1; j >= 0; j--) {
                var currentDigit = reversedResult.charAt(j);
                var newDigit;

                if (currentDigit === '0') {
                    if (plusOne === true) {
                        newDigit = '1';
                        plusOne = false;
                    }
                    else {
                        newDigit = '0';
                    }
                }
                else {
                    if (plusOne === true) {
                        newDigit = '0';
                    }
                    else {
                        newDigit = '1';
                    }
                }
                finalResult = newDigit + '' + finalResult;
            }

            switch (radix) {
                case 2:
                    return finalResult;
                case 8:
                    var totalOct, zeroesToAdd;
                    switch (wordLength) {
                        case 8:
                            totalOct = 3;
                            zeroesToAdd = '0';
                            break;
                        case 16:
                            totalOct = 6;
                            zeroesToAdd = '00';
                            break;
                        case 32:
                            totalOct = 11;
                            zeroesToAdd = '0';
                            break;
                        case 64:
                            totalOct = 22;
                            zeroesToAdd = '00';
                            break;
                    }

                    finalResult = zeroesToAdd + finalResult;
                    var octResult = '';
                    for (var k = totalOct; k >= 1; k--) {
                        var currentOct = finalResult[k * 3 - 3] + '' + finalResult[k * 3 - 2] + '' + finalResult[k * 3 - 1];
                        octResult = parseInt(currentOct, 2).toString(8) + '' + octResult;
                    }
                    return octResult;
                case 16:
                    var totalHex;
                    switch (wordLength) {
                        case 8:
                            totalHex = 2;
                            break;
                        case 16:
                            totalHex = 4;
                            break;
                        case 32:
                            totalHex = 8;
                            break;
                        case 64:
                            totalHex = 16;
                            break;
                    }

                    var hexResult = '';
                    for (var l = totalHex; l >= 1; l--) {
                        var currentHex = finalResult[l * 4 - 4] + '' + finalResult[l * 4 - 3] + '' + finalResult[l * 4 - 2] + '' + finalResult[l * 4 - 1];
                        hexResult = parseInt(currentHex, 2).toString(16) + '' + hexResult;
                    }
                    return hexResult.toUpperCase();
            }
        }

        function toBinary(positiveNumber) {
            var two = new Smart.Utilities.BigNumber(2),
                remainder,
                remaindersArray = [],
                temp;
            if (positiveNumber === undefined) {
                temp = o;
            }
            else {
                temp = positiveNumber;
            }
            do {
                remainder = temp.mod(two);
                remaindersArray.push(remainder.toString());
                temp = temp.subtract(remainder).divide(two).intPart();
            }
            while (temp.compare(new Smart.Utilities.BigNumber(0)) === 1);

            return remaindersArray.reverse().join('');
        }
        function toOctal(binary) {
            var result = '';
            while (binary.length % 3 !== 0) {
                binary = '0' + binary;
            }
            for (var k = binary.length / 3; k >= 1; k--) {
                var currentOct = binary[k * 3 - 3] + '' + binary[k * 3 - 2] + '' + binary[k * 3 - 1];
                result = parseInt(currentOct, 2).toString(8) + '' + result;
            }
            return result;
        }
        function toHexadecimal(binary) {
            var result = '';
            while (binary.length % 4 !== 0) {
                binary = '0' + binary;
            }
            for (var l = binary.length / 4; l >= 1; l--) {
                var currentHex = binary[l * 4 - 4] + '' + binary[l * 4 - 3] + '' + binary[l * 4 - 2] + '' + binary[l * 4 - 1];
                result = parseInt(currentHex, 2).toString(16) + '' + result;
            }
            return result;
        }

        let o, decimal;

        if (Smart.Utilities.BigNumber.bigIntSupport) {
            o = this;

            if (Array.isArray(o._d)) {
                decimal = (o._s ? '-' : '') + (o._d.slice(0, o._f).join('') || '0') + (o._f != o._d.length ? '.' + o._d.slice(o._f).join('') : '');
            }
            else {
                decimal = this._d.toString();
            }
        }
        else {
            o = this.normalizeOperand(this);
            decimal = (o._s ? '-' : '') + (o._d.slice(0, o._f).join('') || '0') + (o._f != o._d.length ? '.' + o._d.slice(o._f).join('') : '');
        }

        if (radix === undefined || radix === 10) {
            return decimal;
        }

        let result;

        if (o.compare(0) > -1) {
            switch (radix) {
                case 2:
                    result = toBinary();

                    if (leadingZeros) {
                        result = result.padStart(wordLength, '0');
                    }

                    break;
                case 8:
                    result = toOctal(toBinary());
                    break;
                case 16:
                    result = toHexadecimal(toBinary()).toUpperCase();

                    if (leadingZeros) {
                        result = result.padStart(wordLength / 4, '0');
                    }

                    break;
            }
        }
        else {
            var positiveNumber = o.negate(),
                positiveBinary = toBinary(positiveNumber);
            result = negativeBinary(positiveBinary, radix, wordLength);
        }

        return result;
    }

    _zeroes(n, l, t) {
        var s = ['push', 'unshift'][t || 0];
        for (++l; --l; n[s](0));
        return n;
    }

    round() {
        if ('_rounding' in this) return this;
        var $ = Smart.Utilities.BigNumber, r = this.roundType, b = this._d, d, p, n, x;
        for (this._rounding = true; this._f > 1 && !b[0]; --this._f, b.shift());
        for (d = this._f, p = this.precision + d, n = b[p]; b.length > d && !b[b.length - 1]; b.pop());
        x = (this._s ? '-' : '') + (p - d ? '0.' + this._zeroes([], p - d - 1).join('') : '') + 1;
        if (b.length > p) {
            n && (r == $.DOWN ? false : r == $.UP ? true : r == $.CEIL ? !this._s
                : r == $.FLOOR ? this._s : r == $.HALF_UP ? n >= 5 : r == $.HALF_DOWN ? n > 5
                    : r == $.HALF_EVEN ? n >= 5 && b[p - 1] & 1 : false) && this.add(x);
            b.splice(p, b.length - p);
        }
        return delete this._rounding, this;
    }

    isZero() {
        return this._d.length === 1 && this._d[0] === 0;
    }

    normalizeOperand(n) {
        if (n instanceof Smart.Utilities.BigNumber &&
            typeof n._d === 'bigint') {
            return new Smart.Utilities.BigNumber(n._d.toString());
        }

        return n;
    }
});
