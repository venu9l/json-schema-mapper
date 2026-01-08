/**
 * Regex Capture Groups Example
 * Demonstrates extracting specific capture groups using regex transforms
 */

const { map } = require("../src/index");

const sourceData = {
    records: [
        {
            id "230085_12",
            email: "john.doe@example.com",
            phone: "+1-555-123-4567",
            version: "v2.3.4"
        },
        {
            id "230086_15",
            email: "jane.smith@test.org",
            phone: "+44-20-7946-0958",
            version: "v1.0.0"
        }
    ]
};

const schema = {
    // Extract first part before underscore (group 1)
    application_id: {
        path: "records.*.indexing",
        transform: "regex:(\\d+)_(\\d+):1"
    },
    // Extract second part after underscore (group 2)
    test_id: {
        path: "records.*.indexing",
        transform: ["regex:(\\d+)_(\\d+):2", "toNumber"]
    },
    // Extract username from email (group 1)
    username: {
        path: "records.*.email",
        transform: "regex:([^@]+)@.*:1"
    },
    // Extract domain from email (group 2)
    domain: {
        path: "records.*.email",
        transform: "regex:[^@]+@(.+):1"
    },
    // Extract area code from phone (group 1)
    area_code: {
        path: "records.*.phone",
        transform: "regex:\\+\\d+[-\\.]?(\\d+):1"
    },
    // Extract major version number (group 1)
    major_version: {
        path: "records.*.version",
        transform: ["regex:v(\\d+)\\.(\\d+)\\.(\\d+):1", "toNumber"]
    }
};

const result = map(sourceData, schema);

console.log("Regex Capture Groups Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Regex pattern (\\d+)_(\\d+) has two groups:");
console.log("  Group 0: Full match (230085_12)");
console.log("  Group 1: First capture (230085)");
console.log("  Group 2: Second capture (12)");

