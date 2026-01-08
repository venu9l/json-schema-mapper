/**
 * Excel to API Example
 * Demonstrates transforming Excel-like data structure to API-ready format
 */

const { map } = require("../src/index");

// Simulated Excel data structure
const excelData = {
    client_id: "CLIENT_001",
    rows: [
        {
            "Application No": 230085,
            "User Name": "John Doe",
            Gender: "male",
            Age: 27,
            "Date of Birth": "1996-05-15",
            id "230085_12",
            tests: [
                { code: "CG", value: "10", unit: "mg/dL" },
                { code: "CH", value: "200", unit: "mg/dL" }
            ]
        },
        {
            "Application No": 230086,
            "User Name": "Jane Smith",
            Gender: "female",
            Age: 32,
            "Date of Birth": "1991-08-20",
            id "230086_15",
            tests: [{ code: "CG", value: "12", unit: "mg/dL" }]
        }
    ]
};

// API-ready schema
const apiSchema = {
    client_id: { path: "client_id" },

    user: {
        type: "object",
        properties: {
            application_no: {
                path: "rows.*.['Application No']",
                transform: "toNumber"
            },
            name: {
                path: "rows.*.['User Name']",
                transform: "toTitleCase"
            },
            gender: {
                path: "rows.*.Gender",
                transform: {
                    when: [
                        { if: { in: ["M", "m", "male"] }, then: "toLowerCase" },
                        {
                            if: { in: ["F", "f", "female"] },
                            then: "toLowerCase"
                        }
                    ],
                    default: "unknown"
                }
            },
            age: {
                path: "rows.*.Age",
                transform: "toNumber",
                default: 0
            },
            date_of_birth: {
                path: "rows.*.['Date of Birth']"
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
            },
            unit: { path: "rows.*.tests.*.unit" }
        }
    },

    filter: {
        all: [{ path: "rows.*.Age", gte: 18 }]
    }
};

const result = map(excelData, apiSchema);

console.log("Excel to API Example:");
console.log(JSON.stringify(result, null, 2));
