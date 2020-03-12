/**
 * Imperial `Mass` unit definition objects.
 *
 * @author Tyler Vigario (MeekLogic)
 * @license GPL-3.0-only
 * @version 1.2.0
 */
export default [{
  name: 'ton',
  value: 2240,
  display: {
    symbol: 't',
    written: 'ton',
    rounding: 2,
    exclusive: true,
  },
  signifiers: [
    't',
    'ton',
    'tons',
  ],
}, {
  name: 'hundredweight',
  value: 112,
  signifiers: [
    'cwt',
    'hundredweight',
  ],
}, {
  name: 'quarter',
  value: 28,
  signifiers: [
    'qr',
    'qtr',
    'quarter',
    'quarters',
  ],
}, {
  name: 'stone',
  value: 14,
  signifiers: [
    'st',
    'stone',
    'stones',
  ],
}, {
  name: 'pound',
  value: 1,
  display: {
    symbol: 'lb',
    written: 'pound',
  },
  signifiers: [
    'lb',
    'lbs',
    'pound',
    'pounds',
  ],
}, {
  name: 'ounce',
  value: 0.0625,
  display: {
    symbol: 'oz',
    written: 'ounce',
  },
  signifiers: [
    'oz',
    'ounce',
    'ounces',
  ],
}, {
  name: 'dram',
  value: 0.00390625,
  signifiers: [
    'dr',
    'dram',
    'drams',
    'drachm',
    'drachms',
  ],
}, {
  name: 'grain',
  value: 1.4285714285714285714285714285714e-4,
  signifiers: [
    'gr',
    'grain',
    'grains',
  ],
}];