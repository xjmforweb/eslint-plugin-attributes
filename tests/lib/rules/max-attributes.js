/**
 * @fileoverview  html标签属性数量过多时需换行
 * @author jle
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-attributes")
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 2018 }
})
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run("max-attributes", rule, {

    valid: [
        {
            filename: 'test.vue',
            code: ''
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom data-id="foo" slot-scope="{ data }" my-prop="prop"></custom>
                 </template>`,
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom
                         data-id="foo"
                          slot-scope="{ data }"
                           my-prop="prop"></custom>
                 </template>`,
            options: [{max: 1}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom data-id="foo"></custom>
                 </template>`,
            options: [{attrStrLimit: 3}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom
                         data-id="foo"
                         a="1"
                         v="2"
                         ></custom>
                 </template>`,
            options: [{attrStrLimit: 3, max: 2}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom data-id="foo"></custom>
                 </template>`,
            options: [{attrStrLimit: 2}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom data-id="foo" a="1"></custom>
                 </template>`,
            options: [{attrStrLimit: 14}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom
                         data-id="foo"
                          a="1"
                          a="asdasdsadsadadasdsadsadsadasdasdasd"
                          a="1"
                          a="1"
                          a="1"
                          ></custom>
                 </template>`,
            options: [{attrStrLimit: 14}]
        },
        {
            filename: 'test.vue',
            code: `<template>
                        <custom data-id="foo" a="1" a="1" a="1" a="1" a="1"></custom>
                 </template>`,
            options: [{max: 6}]
        }
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code:
                `<template>
                   <custom data-id="foo" a="1" b="1" c="1"></custom>
                </template>`,
            output:
                `<template>
                   <custom
                     data-id="foo"
                     a="1"
                     b="1"
                     c="1">
                   </custom>
                </template>`,
            errors: [{
                type: "VElement"
            }]
        },
        {
            code: `<template><custom
                     data-id="foo"
                      a="1"
                    ></custom></template>`,
            options: [{attrStrLimit: 33}],
            output: `<template><custom data-id="foo" a="1"></custom></template>`,
            errors: [{
                type: "VElement"
            }]
        }
    ]
});
