/**
 * Case Conversion Transforms Example
 * Demonstrates all available case conversion transforms
 */

const { map } = require("../src/index");

const sourceData = {
    items: [
        {
            title: "hello world example",
            code: "HELLO_WORLD_CODE",
            name: "someNameValue",
            description: "a simple description",
            category: "product-item"
        }
    ]
};

const schema = {
    original: {
        path: "items.*.title"
    },
    toLowerCase: {
        path: "items.*.title",
        transform: "toLowerCase"
    },
    toUpperCase: {
        path: "items.*.code",
        transform: "toUpperCase"
    },
    toTitleCase: {
        path: "items.*.title",
        transform: "toTitleCase"
    },
    toSentenceCase: {
        path: "items.*.description",
        transform: "toSentenceCase"
    },
    toCamelCase: {
        path: "items.*.code",
        transform: "toCamelCase"
    },
    toSnakeCase: {
        path: "items.*.name",
        transform: "toSnakeCase"
    },
    toKebabCase: {
        path: "items.*.category",
        transform: "toKebabCase"
    },
    toPascalCase: {
        path: "items.*.code",
        transform: "toPascalCase"
    },
    toLowerFirst: {
        path: "items.*.name",
        transform: "toLowerFirst"
    },
    toUpperFirst: {
        path: "items.*.description",
        transform: "toUpperFirst"
    },
    toCapitalize: {
        path: "items.*.title",
        transform: "toCapitalize"
    }
};

const result = map(sourceData, schema);

console.log("Case Conversion Transforms Example:");
console.log(JSON.stringify(result, null, 2));

