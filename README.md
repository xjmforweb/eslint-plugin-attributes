# eslint-plugin-attributes

html标签属性数量过多时需换行

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-attributes`:

```
$ npm install eslint-plugin-attributes --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-attributes` globally.

## Usage

Add `attributes` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "attributes"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "attributes/rule-name": 2
    }
}
```

## Supported Rules

Rule                              | Default                        | Options
----                              | -----------                    | -------
`max-attributes`                  | 2                              | max = 3
`max-attribute-value-logical`     | 1                              | max = 2


