/**
 * Conditional Transforms Example
 * Demonstrates using when/then conditions for dynamic transformations
 */

const { map } = require("../src/index");

const sourceData = {
    products: [
        { name: "Product A", price: "100.50", status: "active" },
        { name: "Product B", price: "200.75", status: "inactive" },
        { name: "Product C", price: "50.25", status: "pending" }
    ]
};

const schema = {
    name: { path: "products.*.name" },
    price: {
        path: "products.*.price",
        transform: "toNumber"
    },
    status: {
        path: "products.*.status",
        transform: {
            when: [
                { if: { eq: "active" }, then: "toUpperCase" },
                { if: { eq: "inactive" }, then: "toUpperCase" }
            ],
            default: "toLowerCase"
        }
    },
    category: {
        path: "products.*.price",
        transform: {
            when: [
                { if: { gte: 200 }, then: "premium" },
                { if: { gte: 100 }, then: "standard" }
            ],
            default: "basic"
        }
    }
};

const result = map(sourceData, schema);

console.log("Conditional Transforms Example:");
console.log(JSON.stringify(result, null, 2));
