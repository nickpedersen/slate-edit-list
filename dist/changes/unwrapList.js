'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate-react');

var _utils = require('../utils');

/**
 * Unwrap items at range from their list.
 */
function unwrapList(opts, editor) {
    var items = (0, _utils.getItemsAtRange)(opts, editor.value);

    if (items.isEmpty()) {
        return editor;
    }

    return editor.withoutNormalizing(function () {
        // Unwrap the items from their list
        items.forEach(function (item) {
            return editor.unwrapNodeByKey(item.key);
        });

        // Parent of the list of the items
        var firstItem = items.first();
        var parent = editor.value.document.getParent(firstItem.key);

        var index = parent.nodes.findIndex(function (node) {
            return node.key === firstItem.key;
        });

        // Unwrap the items' children
        items.forEach(function (item) {
            return item.nodes.forEach(function (node) {
                editor.moveNodeByKey(node.key, parent.key, index);
                index += 1;
            });
        });

        // Finally, remove the now empty items
        items.forEach(function (item) {
            return editor.removeNodeByKey(item.key);
        });

        return editor;
    });
}

exports.default = unwrapList;