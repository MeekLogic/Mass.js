  
/** 
 * Parsing and formatting mass units.
 *
 * @author Tyler Vigario (MeekLogic)
 * @license GPL-3.0-only
 * @version 1.0.0
 */

/**
 * Class for working with string representations of mass.
 */
export default class MassJS
{
    /**
     * Creates an instance of Mass.
     * 
     * @param {array} [units = null] - Array of mass unit definitions objects.
     */
    constructor(units = null)
    {
        if (typeof units !== 'object') {
            throw new Error('Parameter "units" must be of type "object".');
        }

        this.Units = units;
    }

    /**
     * Parse variable for Mass.
     * 
     * @param {string} text - String to parse for mass.
     * @returns {(number|false)} Returns mass as it's base unit, if an invalid string for mass or any value is negative, false.
     */
    parse(text)
    {
        // Validate text parameter
        if (typeof text !== 'string') {
            throw new Error('Parameter "text" must be of type "string".');
        }

        // Remove possible case sensitivity
        text = text.toLowerCase();

        // Remove non alphanumeric characters except "." and "-"
        text = text.replace(/[^0-9a-z.-]/g, '');

        // Is string empty?
        if (text.length === 0) {
            return false;
        }

        // Linear char parsing
        let value = '';
        let signifier = '';
        let unit;
        let total = 0;

        // Loop through each character of string
        for (let i = 0; i < text.length; i++) {
            // Get current char
            const char = text.charAt(i);

            // Check for alphabet letter (a-z,0-9|a-z,0-9|...) [comma = separator between value and signifier, | = separator between pairs]
            if (char.match(/[a-z]/)) {
                // Catch the case where they supply text prior to the value
                if (value.length === 0) {
                    return false;
                }

                signifier += char;
            } else {
                // Check if this is next unit pair (i.e. value,signifier|value,signifier|...)
                if (signifier.length > 0) {
                    // Convert to string to number
                    let v = parseFloat(value);

                    // Mass cannot be negative
                    if (v < 0) {
                        return false;
                    }

                    // Lookup unit signifier
                    unit = this.lookup(signifier);

                    // Does signifier not match?
                    if (unit === undefined) {
                        // If we cannot reliably match this signifier to a unit
                        return false;
                    }

                    // Convert to base unit value and add to total
                    total += v * unit.value;

                    // Reset storage variables
                    value = '';
                    signifier = '';
                }

                value += char;
            }
        }

        // Convert to string to number
        let v = parseFloat(value);

        // Mass cannot be negative
        if (v < 0) {
            return false;
        }

        // Lookup unit signifier
        unit = this.lookup(signifier);

        // Does signifier not match?
        if (unit === undefined) {
            // If we cannot reliably match this signifier to a unit
            return false;
        }

        // Convert to base unit value and add to total
        total += value * unit.value;

        // Return total mass (as base unit)
        return total;
    }

    /**
     * Format mass as text.
     * 
     * @param {number} value - Value to format (must be a positive number).
     * @param {(number|string)} [unitValue = 1] - Value of unit or string mass unit signifier for lookup.
     * @param {(boolean|number)} [spaces = true] - Truthy values will add space between value and signifier.
     * @returns {(string|false)} Formatted mass string or, if value is negative or unit signifier lookup fails, false.
     */
    format(value, unitValue = 1, spaces = true)
    {
        let formatted = '';

        // Validate value parameter
        if (typeof value !== 'number') {
            throw new Error('Parameter "value" must be of type "number".');
        }

        // Accepts any positive number
        if (value < 0) {
            return false;
        }
        
        // Did they supply custom unit ratio or signifier?
        if (unitValue !== 1) {
            if (typeof unitValue === 'number') {
                // Validate number
                if (unitValue < 0) {
                    throw new Error('Parameter "unitValue" cannot be a negative number.');
                }
            } else if (typeof unitValue === 'string') {
                // Perform lookup using signifier
                unitValue = this.lookup(unitValue);

                // Validate Unit lookup
                if (unitValue === undefined) {
                    return false;
                }

                // We want unit value
                unitValue = unitValue.value;
            } else {
                throw new Error('Parameter "unitValue" must be of type "number" or "string".');
            }

            // Convert value to base unit value
            value = value * unitValue;
        }

        // Loop through Units
        for (let unit of this.Units) {
            // Check if Unit is displaying and value is greater than unit value
            if (unit.display && value >= unit.value) {
                // Calculate quantity of unit
                let q = value / unit.value;

                // Exclusive means it will display the whole value under its sole unit
                // Here we check to make sure it isn't exclusive so we can remove the change from value and make it whole
                if (!unit.display.exclusive) {
                    // Whole unit quantity
                    q = Math.floor(q);

                    // Subtract change from total
                    value -= q * unit.value;
                }

                // Add space if text has content already
                if (formatted.length > 0) {
                    formatted += ' ';
                }

                // Add formatted value
                formatted += q.toFixed(unit.display.rounding ? unit.display.rounding : 0);

                // Add spaces (if applicable)
                if (spaces) {
                    formatted += ' ';
                }

                // Add unit signifier
                if (typeof unit.display === 'object') {
                    formatted += (q === 1 ? unit.display.singular : unit.display.plural);
                } else {
                    formatted += unit.display;
                }

                // Is unit exclusive or is there no longer any value to format?
                if (unit.display.exclusive || value === 0) {
                    break;
                }
            }
        }

        return formatted;
    }

    /**
     * Lookup string with signifier returning matching Unit.
     * 
     * @param {string} signifier - Mass unit signifier string for lookup.
     * @return {(object|undefined)} Matching Unit object, if found, otherwise false.
     */
    lookup(signifier)
    {
        // Validate signifier parameter type
        if (typeof signifier !== 'string') {
            throw new Error('Parameter "signifier" must be of type "string".');
        }

        // Search through units
        return this.Units.find((unit) => {
            // Search for matching signifier within unit
            return unit.signifiers.includes(signifier);
        });
    }
}