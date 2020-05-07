/**
 * @fileoverview  html标签属性数量过多时需换行
 * @author jle
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-attributes"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("max-attributes", rule, {

    valid: [
        {
            code: ``
        }
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "...",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
