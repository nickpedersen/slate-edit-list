'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

require('slate');

require('slate-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a schema definition with rules to normalize lists
 */
function schema(opts) {
    var constructedSchema = {
        blocks: (0, _defineProperty3.default)({}, opts.typeItem, {
            parent: opts.types.map(function (t) {
                return { type: t };
            }),
            nodes: [{ match: { object: 'block' } }],

            normalize: normalize({
                parent_type_invalid: function parent_type_invalid(editor, context) {
                    return editor.unwrapBlockByKey(context.node.key, {
                        normalize: false
                    });
                },
                child_object_invalid: function child_object_invalid(editor, context) {
                    return wrapChildrenInDefaultBlock(opts, editor, context.node);
                }
            })
        })
    };

    // validate all list types, ensure they only have list item children
    opts.types.forEach(function (type) {
        constructedSchema.blocks[type] = {
            nodes: [{ match: { type: opts.typeItem } }],
            normalize: normalize({
                child_type_invalid: function child_type_invalid(editor, context) {
                    return editor.wrapBlockByKey(context.child.key, opts.typeItem, {
                        normalize: false
                    });
                }
            })
        };
    });

    return constructedSchema;
}

/*
 * Allows to define a normalize function through a keyed collection of functions
 */
function normalize(reasons) {
    return function (editor, error) {
        var reasonFn = reasons[error.code];
        if (reasonFn) {
            reasonFn(editor, error);
        }
    };
}

/**
 * Wraps all child of a node in the default block type.
 * Returns a editor, for chaining purposes
 */
function wrapChildrenInDefaultBlock(opts, editor, node) {
    editor.wrapBlockByKey(node.nodes.first().key, opts.typeDefault, {
        normalize: false
    });

    var wrapper = editor.value.document.getDescendant(node.key).nodes.first();

    // Add in the remaining items
    node.nodes.rest().forEach(function (child, index) {
        return editor.moveNodeByKey(child.key, wrapper.key, index + 1, {
            normalize: false
        });
    });

    return editor;
}

exports.default = schema;