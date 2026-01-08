/**
 * Multi-Path Fallback Example
 * Demonstrates using multiple paths as fallbacks when the first path doesn't exist
 */

const { map } = require("../src/index");

const sourceData = {
    rows: [
        {
            PolicyNo: 12345, // First path exists
            PolicyNumber: null
        },
        {
            PolicyNo: null, // First path is null, fallback to second
            PolicyNumber: 67890
        },
        {
            // Neither path exists, uses default
            PolicyNo: null,
            PolicyNumber: null
        }
    ]
};

const schema = {
    policy_no: {
        path: [
            "rows.*.PolicyNo", // Try this first
            "rows.*.PolicyNumber", // Fallback to this
            "rows.*.policy_number" // Final fallback
        ],
        transform: "toNumber",
        default: 0 // Use this if all paths fail
    }
};

const result = map(sourceData, schema);

console.log("Multi-Path Fallback Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: The mapper tries each path in order until it finds a non-null value.");

