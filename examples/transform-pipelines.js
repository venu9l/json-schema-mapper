/**
 * Transform Pipelines Example
 * Demonstrates chaining multiple transforms together
 */

const { map } = require("../src/index");

const sourceData = {
    products: [
        {
            id: "PROD-123-ABC",
            price: "  99.99  ",
            sku: "HELLO_WORLD_SKU",
            status: "  active  "
        },
        {
            id: "PROD-456-XYZ",
            price: "  199.50  ",
            sku: "EXAMPLE_PRODUCT",
            status: "  inactive  "
        }
    ]
};

const schema = {
    // Chain: Extract ID → Convert to number
    product_number: {
        path: "products.*.id",
        transform: ["regex:PROD-(\\d+)-.*:1", "toNumber"]
    },
    // Chain: Trim whitespace → Convert to number
    price: {
        path: "products.*.price",
        transform: ["toString", "toNumber"] // toString removes extra spaces, then convert
    },
    // Chain: Convert case → Replace underscores
    clean_sku: {
        path: "products.*.sku",
        transform: ["toKebabCase"] // Converts HELLO_WORLD_SKU to hello-world-sku
    },
    // Chain: Extract → Lowercase → Capitalize
    clean_status: {
        path: "products.*.status",
        transform: ["toLowerCase", "toCapitalize"]
    },
    // Complex pipeline: Regex extract → Convert case → Extract number
    formatted_id: {
        path: "products.*.id",
        transform: [
            "regex:PROD-(\\d+)-(.+):1", // Extract number part
            "toString",
            "toNumber"
        ]
    }
};

const result = map(sourceData, schema);

console.log("Transform Pipelines Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Transforms are applied in order, left to right.");

