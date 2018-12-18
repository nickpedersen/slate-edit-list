'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

require('slate');

var _slateReact = require('slate-react');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a schema definition with rules to normalize lists
 */
function normalizeNode(opts) {
    return function (node, editor, next) {
        return joinAdjacentLists(opts, node, next);
    };
}

/**
 * A rule that joins adjacent lists of the same type
 */

function joinAdjacentLists(opts, node, next) {
    if (node.object !== 'document' && node.object !== 'block') {
        return next();
    }

    var invalids = node.nodes.map(function (child, i) {
        if (!(0, _utils.isList)(opts, child)) return null;
        var nextNode = node.nodes.get(i + 1);
        if (!nextNode || !(0, _utils.isList)(opts, nextNode) || !opts.canMerge(child, nextNode)) {
            return null;
        }

        return [child, nextNode];
    }).filter(Boolean);

    if (invalids.isEmpty()) {
        return next();
    }

    /**
     * Join the list pairs
     */
    // We join in reverse order, so that multiple lists folds onto the first one
    return function (change) {
        change.withoutNormalizing(function () {
            invalids.reverse().forEach(function (pair) {
                var _pair = (0, _slicedToArray3.default)(pair, 2),
                    first = _pair[0],
                    second = _pair[1];

                var updatedSecond = change.value.document.getDescendant(second.key);
                updatedSecond.nodes.forEach(function (secondNode, index) {
                    change.moveNodeByKey(secondNode.key, first.key, first.nodes.size + index);
                });

                change.removeNodeByKey(second.key);
            });
        });
    };
}

exports.default = normalizeNode;