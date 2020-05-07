/**
 * @fileoverview  属性上'||'和'&&'出现的次数限制
 * @author jle
 * @param { max } 最多允许的数量，可选
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "属性上'||'和'&&'出现的次数限制",
            category: "Fill me in",
            recommended: false
        },
        fixable: "",  // or "code" or "whitespace"
        schema: [
            {
                "type": "object",
                "properties": {
                    "max": {
                        "type": "number"
                    }
                },
                "additionalProperties": false
            }
        ]
    },

    create: function(context) {
        const sourceCode = context.getSourceCode()

        // variables should be defined here
        const max = context.options.length && context.options[0].max || 2

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return context.parserServices.defineTemplateBodyVisitor(
            // Event handlers for <template>.
            {
                VAttribute (node) {
                    if (node.value) {
                        const attrSource = sourceCode.getText(node.value)
                        const logicalTag = attrSource.match(/(\|\|)|(&&)/g) || []
                        if (logicalTag.length > max) {
                            const attrKey = node.directive ? `v-${node.key.name.name}` : node.key.name.name
                            context.report({
                                node,
                                loc: node.loc,
                                message: `'{{name}}' has too many logicalExpressions. Expected a computed value or function`,
                                data: {
                                    name: attrKey
                                }
                            })
                        }
                    }
                }
            },
            // Event handlers for <script> or scripts. (optional)
            {
                Program(node) {
                    //...
                }
            }
        )
    }
};
