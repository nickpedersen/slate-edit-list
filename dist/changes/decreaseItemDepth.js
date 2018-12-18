'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

require('slate-react');

var _utils = require('../utils');

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 */
function decreaseItemDepth(opts, editor) {
    var value = editor.value;
    var document = value.document;

    // Cannot decrease item depth of root items

    var depth = (0, _utils.getItemDepth)(opts, value);
    if (depth == 1) {
        return editor;
    }

    var currentItem = (0, _utils.getCurrentItem)(opts, value);
    if (!currentItem) {
        return editor;
    }

    var currentList = document.getParent(currentItem.key);
    var parentItem = document.getParent(currentList.key);
    var parentList = document.getParent(parentItem.key);
    // The items following the item will be moved to a sublist of currentItem
    var followingItems = currentList.nodes.skipUntil(function (i) {
        return i === currentItem;
    }).rest();

    // True if the currentItem and the followingItems make the whole
    // currentList, and hence the currentList will be emptied
    var willEmptyCurrentList = currentList.nodes.size === followingItems.size + 1;

    if (!followingItems.isEmpty()) {
        // Add them as sublist of currentItem
        var sublist = _slate.Block.create({
            object: 'block',
            type: currentList.type,
            data: currentList.data
        });
        // Add the sublist
        editor.withoutNormalizing(function () {
            editor.insertNodeByKey(currentItem.key, currentItem.nodes.size, sublist);

            editor.moveNodeByKey(currentItem.key, parentList.key, parentList.nodes.indexOf(parentItem) + 1);

            // Move the followingItems to the sublist
            followingItems.forEach(function (item, index) {
                return editor.moveNodeByKey(item.key, sublist.key, sublist.nodes.size + index);
            });
        });
    } else {
        editor.moveNodeByKey(currentItem.key, parentList.key, parentList.nodes.indexOf(parentItem) + 1);
    }

    // Remove the currentList completely if needed
    if (willEmptyCurrentList) {
        editor.removeNodeByKey(currentList.key);
    }

    return editor;
}
exports.default = decreaseItemDepth;