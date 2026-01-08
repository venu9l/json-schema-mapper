/**
 * Test file for JSON Restruct
 * Run with: npm test
 */

const { map, validateSchema } = require("./index");

console.log("🧪 Running JSON Restruct Tests...\n");

// Test 1: Basic mapping
console.log("Test 1: Basic Mapping");
const source1 = {
    rows: [
        { name: "Alice", age: "30" },
        { name: "Bob", age: "25" }
    ]
};

const schema1 = {
    name: { path: "rows.*.name" },
    age: { path: "rows.*.age", transform: "toNumber" }
};

try {
    const result1 = map(source1, schema1);
    console.log("✅ Pass:", JSON.stringify(result1, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n");

// Test 2: Wildcards and nested structures
console.log("Test 2: Wildcards and Nested Structures");
const source2 = {
    client_id: "CLIENT_001",
    rows: [
        {
            "Application No": 230085,
            "User Name": "John Doe",
            Gender: "male",
            Age: 27,
            tests: [{ code: "CG", value: "10" }]
        }
    ]
};

const schema2 = {
    client_id: { path: "client_id" },
    user: {
        type: "object",
        properties: {
            application_no: {
                path: "rows.*.['Application No']",
                transform: "toNumber"
            },
            name: { path: "rows.*.['User Name']" },
            age: {
                path: "rows.*.Age",
                transform: "toNumber",
                default: 0
            }
        }
    },
    test: {
        type: "object",
        properties: {
            code: { path: "rows.*.tests.*.code" },
            value: {
                path: "rows.*.tests.*.value",
                transform: "toNumber"
            }
        }
    }
};

try {
    const result2 = map(source2, schema2);
    console.log("✅ Pass:", JSON.stringify(result2, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n");

// Test 3: Conditional transforms
console.log("Test 3: Conditional Transforms");
const source3 = {
    rows: [
        { Gender: "M", Age: 25 },
        { Gender: "F", Age: 30 },
        { Gender: "unknown", Age: 20 }
    ]
};

const schema3 = {
    gender: {
        path: "rows.*.Gender",
        transform: {
            when: [
                { if: { in: ["M", "m", "male"] }, then: "toLowerCase" },
                { if: { in: ["F", "f", "female"] }, then: "toLowerCase" }
            ],
            default: "unknown"
        }
    },
    age: { path: "rows.*.Age", transform: "toNumber" }
};

try {
    const result3 = map(source3, schema3);
    console.log("✅ Pass:", JSON.stringify(result3, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n");

// Test 4: Filters
console.log("Test 4: Filters");
const source4 = {
    rows: [
        { name: "Alice", age: 30, status: "active" },
        { name: "Bob", age: 15, status: "active" },
        { name: "Charlie", age: 25, status: "inactive" }
    ]
};

const schema4 = {
    name: { path: "rows.*.name" },
    age: { path: "rows.*.age", transform: "toNumber" },
    filter: {
        all: [
            { path: "rows.*.age", gte: 18 },
            { path: "rows.*.status", eq: "active" }
        ]
    }
};

try {
    const result4 = map(source4, schema4);
    console.log("✅ Pass:", JSON.stringify(result4, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n");

// Test 5: Array filtering
console.log("Test 5: Array Filtering");
const source5 = {
    clinical: [
        { key: "name", value: "Kumar" },
        { key: "age", value: "32" }
    ]
};

const schema5 = {
    patient_name: {
        path: "clinical[key=name].value"
    },
    patient_age: {
        path: "clinical[key=age].value",
        transform: "toNumber"
    }
};

try {
    const result5 = map(source5, schema5);
    console.log("✅ Pass:", JSON.stringify(result5, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n");

// Test 6: Schema validation
console.log("Test 6: Schema Validation");
const invalidSchema = {
    name: { path: "" } // Invalid: empty path
};

try {
    validateSchema(invalidSchema);
    console.log("❌ Fail: Should have thrown validation error");
} catch (error) {
    console.log("✅ Pass: Validation caught error:", error.message);
}

console.log("\n");

// Test 7: Regex transforms
console.log("Test 7: Regex Transforms");
const source7 = {
    rows: [{ id: "230085_12" }, { id: "230086_15" }]
};

const schema7 = {
    id: {
        path: "rows.*.id",
        transform: "regex:(\\d+)_(\\d+):1"
    },
    test_id: {
        path: "rows.*.id",
        transform: ["regex:(\\d+)_(\\d+):2", "toNumber"]
    }
};

try {
    const result7 = map(source7, schema7);
    console.log("✅ Pass:", JSON.stringify(result7, null, 2));
} catch (error) {
    console.log("❌ Fail:", error.message);
}

console.log("\n✅ All tests completed!");
