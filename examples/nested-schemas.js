/**
 * Nested Output Schemas Example
 * Demonstrates creating complex nested output structures
 */

const { map } = require("../src/index");

const sourceData = {
    orders: [
        {
            order_id: "ORD-001",
            order_date: "2024-01-15",
            customer: {
                id: "CUST-123",
                name: "John Doe",
                email: "john@example.com",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    zip: "10001"
                }
            },
            items: [
                { product_id: "PROD-1", quantity: 2, price: "29.99" },
                { product_id: "PROD-2", quantity: 1, price: "49.99" }
            ],
            total: "109.97"
        },
        {
            order_id: "ORD-002",
            order_date: "2024-01-16",
            customer: {
                id: "CUST-456",
                name: "Jane Smith",
                email: "jane@example.com",
                address: {
                    street: "456 Oak Ave",
                    city: "Los Angeles",
                    zip: "90001"
                }
            },
            items: [
                { product_id: "PROD-3", quantity: 3, price: "19.99" }
            ],
            total: "59.97"
        }
    ]
};

const schema = {
    // Top-level fields
    order_id: {
        path: "orders.*.order_id"
    },
    order_date: {
        path: "orders.*.order_date"
    },

    // Nested customer object
    customer: {
        type: "object",
        properties: {
            id: {
                path: "orders.*.customer.id"
            },
            name: {
                path: "orders.*.customer.name"
            },
            email: {
                path: "orders.*.customer.email",
                transform: "toLowerCase"
            },
            // Nested address object within customer
            address: {
                type: "object",
                properties: {
                    street: {
                        path: "orders.*.customer.address.street"
                    },
                    city: {
                        path: "orders.*.customer.address.city"
                    },
                    zip: {
                        path: "orders.*.customer.address.zip",
                        transform: "toNumber"
                    }
                }
            }
        }
    },

    // Nested item object (with wildcard for array items)
    item: {
        type: "object",
        properties: {
            product_id: {
                path: "orders.*.items.*.product_id"
            },
            quantity: {
                path: "orders.*.items.*.quantity",
                transform: "toNumber",
                default: 1
            },
            price: {
                path: "orders.*.items.*.price",
                transform: "toNumber"
            }
        }
    },

    // Top-level calculated field
    total: {
        path: "orders.*.total",
        transform: "toNumber"
    }
};

const result = map(sourceData, schema);

console.log("Nested Output Schemas Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Nested schemas create structured output objects.");
console.log("Each order × item combination creates a separate output with nested customer and address objects.");

