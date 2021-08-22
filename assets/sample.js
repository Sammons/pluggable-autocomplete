/**
 * This is a sample file for pluggable-autocomplete,
 * if you just generated it you will need to RELOAD THE WINDOW
 * to load it. You can do this via the command pallette.
 */

/**
 * When a name is given, it will prefix the values displayed
 * and will be usable a search term when trying to pick an element.
 * This is handy to distinguish multiple plugins
 */
exports.name = 'Sample';

/**
 *  expects a list of elements, or promise of list of elements, shaped like this:
 *   [{
 *     prefix: string; // optional, displayed between name and value in "." separated label
 *     value: string; // required, actual thing to insert when selected
 *     comment: string; // optional, extra data when selected
 *     sortToken: string; // optional, vscode will sort using this
 *   }]
 * 
 *   when shouldStopEarly() returns true, the value will be discarded
 */
exports.resolveItems = (shouldStopEarly) => {
    return Promise.resolve([
        { value: 'SampleA' },
        { value: 'SampleB', comment: 'Its the second sample' },
        { value: 'SampleC' },
        { prefix: 'col', value: 'WhateverYouWant', sortToken: '_A' },
        { prefix: 'col', value: 'MoreThings' },
        { prefix: 'col', value: 'MoreStuff' },
        { prefix: 'col', value: 'Really should have populated this some other way' },
    ]);
};

/**
 *  passes an element, and expects a Thenable<element> | element
 *  an element looks like this:
 *   {
 *     prefix: string; // optional, displayed between name and value in "." separated label
 *     value: string; // required, actual thing to insert when selected
 *     comment: string; // optional, extra data when selected
 *     sortToken: string; // optional, vscode will sort using this
 *   }
 *   when shouldStopEarly() returns true, the value will be discarded
 */
// TODO will be implemented in future revision
// for slow operations
// exports.furtherResolveItem = (element, shouldStopEarly) => {
//     elment.comment = element.comment += ' WAAA '
//     return bluebird.delay(2000).thenReturn(element);
// }

