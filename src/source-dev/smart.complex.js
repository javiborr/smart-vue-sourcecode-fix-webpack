
/* Smart HTML Elements v6.1.0 (2020-Jan) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */

/**
 * A class for instantiating a complex number object.
 */
Smart.Utilities.Assign('Complex', class SmartComplex {
    constructor(value, imag) {
        if (typeof value === 'string') {
            this.complexNumber = this.parseComplexNumber(value);
            this.realPart = this.complexNumber.realPart;
            this.imaginaryPart = this.complexNumber.imaginaryPart;
        }
        else if (typeof value === 'number') {
            this.realPart = value;
            if (typeof imag === 'number') {
                this.imaginaryPart = imag;
            }
            else if (typeof imag === 'undefined') {
                this.imaginaryPart = 0;
            }
            else {
                throw new Error('Can\'t create complex number: invalid imaginary part');
            }

            this.complexNumber = this.parseComplexNumber(this.realPart, this.imaginaryPart);
        }
        else {
            throw new Error('Can\'t create complex number');
        }
    }

    valueOf() {
        if (this.imaginaryPart === 0) {
            return this.realPart;
        }
        return null;
    }

    isNaN() {
        return isNaN(this.realPart) || isNaN(this.imaginaryPart);
    }


    isZero() {
        return (
                (this.realPart === 0 || this.realPart === -0) &&
                (this.imaginaryPart === 0 || this.imaginaryPart === -0)
                );
    }


    isFinite() {
        return isFinite(this.realPart) && isFinite(this.imaginaryPart);
    }

    isInfinite() {
        return !(this.isNaN() || this.isFinite());
    }

    parseComplexNumber(value, imaginaryPart) {
        const complexNumber = { realPart: 0, imaginaryPart: 0 };

        if (value === undefined || value === null) {
            complexNumber.realPart = complexNumber.imaginaryPart = 0;
        }
        else if (imaginaryPart !== undefined) {
            complexNumber.realPart = value;
            complexNumber.imaginaryPart = imaginaryPart;
        }
        else
            switch (typeof value) {
                case 'object':
                    if ('imaginaryPart' in value && 'realPart' in value) {
                        complexNumber.realPart = value.realPart;
                        complexNumber.imaginaryPart = value.imaginaryPart;
                    }
                    else if (value.length === 2) {
                        complexNumber.realPart = value[0];
                        complexNumber.imaginaryPart = value[1];
                    }
                    else {
                        throw SyntaxError('Invalid Complex Number Parameter');
                    }
                    break;

                case 'string': {
                    complexNumber.imaginaryPart = complexNumber.realPart = 0;

                    const tokens = value.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);

                    let plus = 1;
                    let minus = 0;

                    if (tokens === null) {
                        throw SyntaxError('Invalid Complex Number Parameter');
                    }

                    for (let i = 0; i < tokens.length; i++) {
                        const token = tokens[i];

                        if (token === ' ' || token === '\t' || token === '\n') {
                            /* void */
                        }
                        else if (token === '+') {
                            plus++;
                        }
                        else if (token === '-') {
                            minus++;
                        }
                        else if (token === 'i' || token === 'I') {

                            if (plus + minus === 0) {
                                throw SyntaxError('Invalid Complex Number Parameter');
                            }

                            if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
                                complexNumber.imaginaryPart += parseFloat((minus % 2 ? '-' : '') + tokens[i + 1]);
                                i++;
                            }
                            else {
                                complexNumber.imaginaryPart += parseFloat((minus % 2 ? '-' : '') + '1');
                            }
                            plus = minus = 0;

                        }
                        else {
                            if (plus + minus === 0 || isNaN(token)) {
                                throw SyntaxError('Invalid Complex Number Parameter');
                            }

                            if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
                                complexNumber.imaginaryPart += parseFloat((minus % 2 ? '-' : '') + token);
                                i++;
                            }
                            else {
                                complexNumber.realPart += parseFloat((minus % 2 ? '-' : '') + token);
                            }
                            plus = minus = 0;
                        }
                    }

                    if (plus + minus > 0) {
                        throw SyntaxError('Invalid Complex Number Parameter');
                    }
                    break;
                }
                case 'number':
                    complexNumber.imaginaryPart = 0;
                    complexNumber.realPart = value;
                    break;

                default:
                    throw SyntaxError('Invalid Complex Number Parameter');
            }

        return complexNumber;
    }

    compare(value, imaginaryPart) {
        const complexNumber = this.parseComplexNumber(value, imaginaryPart);
        const epsilon = this.parseComplexNumber('1e-16');

        return Math.abs(complexNumber.realPart - this.realPart) <= epsilon &&
                    Math.abs(complexNumber.imaginaryPart - this.imaginaryPart) <= epsilon;
    }

    toString() {
        let realPart = this.realPart;
        let imaginaryPart = this.imaginaryPart;
        let complexNumberAsString = '';

        if (this.isNaN()) {
            return 'NaN';
        }

        if (this.isZero()) {
            return '0';
        }

        if (this.isInfinite()) {
            return 'Infinity';
        }

        if (realPart !== 0) {
            complexNumberAsString += realPart;
        }

        if (imaginaryPart !== 0) {
            if (realPart !== 0) {
                complexNumberAsString += imaginaryPart < 0 ? ' - ' : ' + ';
            }
            else if (imaginaryPart < 0) {
                complexNumberAsString += '-';
            }

            imaginaryPart = Math.abs(imaginaryPart);

            if (1 !== imaginaryPart) {
                complexNumberAsString += imaginaryPart;
            }

            complexNumberAsString += 'i';
        }

        if (!complexNumberAsString) {
            return '0';
        }

        return complexNumberAsString;
    }
});
