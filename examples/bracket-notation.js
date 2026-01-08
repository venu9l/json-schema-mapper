/**
 * Bracket Notation Example
 * Demonstrates accessing properties with special characters or spaces using bracket notation
 */

const { map } = require("../src/index");

const sourceData = {
    rows: [
        {
            "Application No": 230085,
            "User Name": "John Doe",
            "Date of Birth": "1990-05-15",
            "Email Address": "john.doe@example.com",
            "Phone Number": "+1-555-1234",
            "Special Field!": "Special Value",
            "Field-With-Dashes": "Dash Value",
            "Field.With.Dots": "Dot Value"
        },
        {
            "Application No": 230086,
            "User Name": "Jane Smith",
            "Date of Birth": "1992-08-20",
            "Email Address": "jane.smith@example.com",
            "Phone Number": "+1-555-5678",
            "Special Field!": "Another Value",
            "Field-With-Dashes": "Another Dash",
            "Field.With.Dots": "Another Dot"
        }
    ]
};

const schema = {
    application_no: {
        path: "rows.*.['Application No']",
        transform: "toNumber"
    },
    name: {
        path: "rows.*.['User Name']"
    },
    date_of_birth: {
        path: "rows.*.['Date of Birth']"
    },
    email: {
        path: "rows.*.['Email Address']",
        transform: "toLowerCase"
    },
    phone: {
        path: "rows.*.['Phone Number']"
    },
    special_field: {
        path: "rows.*.['Special Field!']"
    },
    dashed_field: {
        path: "rows.*.['Field-With-Dashes']"
    },
    dotted_field: {
        path: "rows.*.['Field.With.Dots']"
    }
};

const result = map(sourceData, schema);

console.log("Bracket Notation Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Use bracket notation ['key'] for properties with:");
console.log("  - Spaces in the name");
console.log("  - Special characters (!, -, ., etc.)");
console.log("  - Numbers at the start");
console.log("  - Excel-style column names");
