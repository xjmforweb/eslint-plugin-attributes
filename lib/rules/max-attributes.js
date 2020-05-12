/**
 * @fileoverview  html标签属性数量过多时需换行
 * @author jle
 * @param { max } 最多允许的属性数量，可选
 * @param { attrStrLimit } 单个属性的字符串长度超出时，即使属性数量没有超过max，也要换行
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: " html标签属性数量过多时需换行",
            category: "Fill me in",
            recommended: false
        },
        fixable: "code",  // or "code" or "whitespace"
        schema: [
            {
                "type": "object",
                "properties": {
                    "max": {
                        "type": "number"
                    },
                    "attrStrLimit": {
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
        const max = context.options.length && context.options[0].max || 3
        const attrStrLimit = context.options.length && context.options[0].attrStrLimit || 50

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        /**
         * token是什么：词法分析中的一个词对象
         * 遇到中文时，loc定位会不准确
         * 只要有loc等属性，就可以算一个node节点
         * schema定义可选参数
         *
         * ***/
        return context.parserServices.defineTemplateBodyVisitor(
            // Event handlers for <template>.
            {
                VElement (node) {
                    let maxLen = 0
                    node.startTag.attributes.forEach(attr => {
                        const code = sourceCode.getText(attr)
                        maxLen = Math.max(maxLen, code.length)
                    })
                    if (node.startTag.attributes.length > max) {
                        // 属性没有换行,startTag的内容都在同一行
                        if (node.startTag.loc.start.line === node.startTag.loc.end.line) {
                            context.report({
                                node,
                                loc: node.loc,
                                message: '{{name}} has too many attributes ({{count}}). Maximum allowed is {{max}}, Expected newline before each property',
                                data: {
                                    max,
                                    name: node.name,
                                    count: node.startTag.attributes.length
                                },
                                fix: fixer => {
                                    const startTagCol = node.startTag.loc.start.column
                                    const result = node.startTag.attributes.map(attr => {
                                        return fixer.insertTextBefore(attr, '\n' + Array(startTagCol + 2).fill(' ').join(''))
                                    })
                                    if (node.endTag && node.startTag.loc.start.line === node.endTag.loc.start.line) {
                                        result.push(fixer.insertTextBefore(node.endTag, '\n' + Array(startTagCol).fill(' ').join('')))
                                    }
                                    return result
                                }
                            })
                        }
                    } else if (node.startTag.attributes.length > 0) {
                        if (node.startTag.loc.start.line !== node.startTag.loc.end.line) {
                            let str = `<${node.name}`
                            node.startTag.attributes.forEach(attr => {
                                const code = sourceCode.getText(attr)
                                str += ` ${code}`
                            })
                            str += '>'
                            if (maxLen > attrStrLimit) return
                            context.report({
                                node,
                                loc: node.loc,
                                message: 'just a few attributes should be in one line',
                                data: {},
                                fix: fixer => {
                                    // tag内没有内容，只有换行
                                    if (node.children.length === 1) {
                                        if (node.children[0].type === 'VText' && /[\s\n]+/.test(node.children[0].value)) {
                                            str += sourceCode.getText(node.endTag)
                                            return fixer.replaceTextRange(node.range, str)
                                        }
                                    }
                                    return fixer.replaceTextRange(node.startTag.range, str)
                                }
                            })
                        }
                        // 属性少，但是属性值的字符串太长，则还是要换行
                        if (node.startTag.loc.start.line === node.startTag.loc.end.line && maxLen > attrStrLimit) {
                            context.report({
                                node,
                                loc: node.loc,
                                message: 'Single attribute string is too long. Maximum allowed is {{attrStrLimit}}, Expected newline before each property',
                                data: {
                                    attrStrLimit
                                },
                                fix: fixer => {
                                    const startTagCol = node.startTag.loc.start.column
                                    const result = node.startTag.attributes.map(attr => {
                                        return fixer.insertTextBefore(attr, '\n' + Array(startTagCol + 2).fill(' ').join(''))
                                    })
                                    if (node.endTag && node.startTag.loc.start.line === node.endTag.loc.start.line) {
                                        result.push(fixer.insertTextBefore(node.endTag, '\n' + Array(startTagCol).fill(' ').join('')))
                                    }
                                    return result
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
