'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate-react');

var _utils = require('../utils');

/**
 * Split a list item at the start of the current range.
 */
function splitListItem(opts, editor) {
    var value = editor.value;

    var currentItem = (0, _utils.getCurrentItem)(opts, value);
    if (!currentItem) {
        return editor;
    }

    var start = value.selection.start;

    var splitOffset = start.offset;

    return editor.splitDescendantsByKey(currentItem.key, start.key, splitOffset);
}

exports.default = splitListItem;