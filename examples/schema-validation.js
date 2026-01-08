/**
 * Schema Validation Example
 * Demonstrates validating schemas before mapping
 */

const { map, validateSchema } = require("../src/index");

console.log("=== Schema Validation Examples ===\n");

// Example 1: Valid schema
console.log("Example 1: Valid Schema");
const validSchema = {
    name: { path: "users.*.name" },
    age: { path: "users.*.age", transform: "toNumber" }
};

try {
    validateSchema(validSchema);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 2: Missing path
console.log("\nExample 2: Missing Path");
const invalidSchema1 = {
    name: {
        // Missing path property
        transform: "toNumber"
    }
};

try {
    validateSchema(invalidSchema1);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 3: Empty path
console.log("\nExample 3: Empty Path");
const invalidSchema2 = {
    name: {
        path: "" // Empty path is invalid
    }
};

try {
    validateSchema(invalidSchema2);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 4: Invalid transform
console.log("\nExample 4: Invalid Transform");
const invalidSchema3 = {
    name: {
        path: "users.*.name",
        transform: "invalidTransform" // Not a supported transform
    }
};

try {
    validateSchema(invalidSchema3);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 5: Invalid conditional transform
console.log("\nExample 5: Invalid Conditional Transform");
const invalidSchema4 = {
    status: {
        path: "users.*.status",
        transform: {
            when: [
                {
                    // Missing 'if' or 'then'
                    if: { eq: "active" }
                    // Missing 'then'
                }
            ]
        }
    }
};

try {
    validateSchema(invalidSchema4);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 6: Invalid filter
console.log("\nExample 6: Invalid Filter");
const invalidSchema5 = {
    name: { path: "users.*.name" },
    filter: {
        all: [
            {
                path: "users.*.age",
                // Invalid operator
                invalidOperator: 18
            }
        ]
    }
};

try {
    validateSchema(invalidSchema5);
    console.log("✅ Schema is valid!");
} catch (error) {
    console.log("❌ Validation error:", error.message);
}

// Example 7: Practical usage - validate before mapping
console.log("\nExample 7: Validate Before Mapping");
const sourceData = {
    users: [
        { name: "Alice", age: "30" },
        { name: "Bob", age: "25" }
    ]
};

const schema = {
    name: { path: "users.*.name" },
    age: { path: "users.*.age", transform: "toNumber" }
};

try {
    // Always validate schema before mapping in production
    validateSchema(schema);
    console.log("✅ Schema validated successfully");
    
    const result = map(sourceData, schema);
    console.log("✅ Mapping successful:", JSON.stringify(result, null, 2));
} catch (error) {
    console.log("❌ Error:", error.message);
}

console.log("\n=== Best Practice: Always validate schemas before mapping in production code ===");

