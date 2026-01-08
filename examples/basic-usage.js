/**
 * Basic Usage Example
 * Demonstrates simple mapping with transforms
 */

const { map } = require("../src/index");

const sourceData = {
    users: [
        { name: "Alice", age: "30", email: "ALICE@EXAMPLE.COM" },
        { name: "Bob", age: "25", email: "bob@example.com" }
    ]
};

const schema = {
    name: { path: "users.*.name" },
    age: { path: "users.*.age", transform: "toNumber" },
    email: { path: "users.*.email", transform: "toLowerCase" }
};

const result = map(sourceData, schema);

console.log("Basic Usage Example:");
console.log(JSON.stringify(result, null, 2));
