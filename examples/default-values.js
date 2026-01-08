/**
 * Default Values Example
 * Demonstrates using default values when paths resolve to null/undefined
 */

const { map } = require("../src/index");

const sourceData = {
    users: [
        {
            name: "Alice",
            age: 30,
            email: "alice@example.com",
            phone: null // Missing phone
        },
        {
            name: "Bob",
            age: null, // Missing age
            email: null, // Missing email
            phone: "555-1234"
        },
        {
            name: "Charlie",
            // Missing age, email, and phone
            status: "active"
        }
    ]
};

const schema = {
    name: {
        path: "users.*.name",
        default: "Unknown"
    },
    age: {
        path: "users.*.age",
        transform: "toNumber",
        default: 0 // Default age if missing
    },
    email: {
        path: "users.*.email",
        default: "no-email@default.com"
    },
    phone: {
        path: "users.*.phone",
        default: "N/A"
    },
    status: {
        path: "users.*.status",
        default: "inactive" // Default status if missing
    },
    role: {
        path: "users.*.role", // Path doesn't exist at all
        default: "user" // Will use default for all records
    }
};

const result = map(sourceData, schema);

console.log("Default Values Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Default values are applied when the resolved value is null or undefined.");

