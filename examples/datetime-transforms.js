/**
 * DateTime Transforms Example
 * Demonstrates date/time formatting and timezone conversion
 */

const { map } = require("../src/index");

const sourceData = {
    events: [
        {
            name: "Meeting",
            timestamp: "2024-01-15T10:30:00Z",
            created: "2024-01-15 10:30:00"
        },
        {
            name: "Conference",
            timestamp: "2024-01-20T14:00:00-05:00",
            created: "2024-01-20 14:00:00"
        },
        {
            name: "Workshop",
            timestamp: "2024-02-01T09:00:00+09:00",
            created: "2024-02-01 09:00:00"
        }
    ]
};

const schema = {
    event_name: {
        path: "events.*.name"
    },
    // Format with default format (YYYY-MM-DD HH:mm:ss) and UTC timezone
    formatted_datetime_utc: {
        path: "events.*.timestamp",
        transform: "toDateTime"
    },
    // Custom format and timezone
    formatted_datetime_est: {
        path: "events.*.timestamp",
        transform: "toDateTime:YYYY-MM-DD HH:mm:ss:America/New_York"
    },
    // Custom format only (defaults to UTC)
    formatted_datetime_custom: {
        path: "events.*.created",
        transform: "toDateTime:MM/DD/YYYY HH:mm"
    },
    // ISO format in different timezone
    formatted_datetime_pst: {
        path: "events.*.timestamp",
        transform: "toDateTime:YYYY-MM-DDTHH:mm:ssZ:America/Los_Angeles"
    },
    // Date only format
    formatted_date_only: {
        path: "events.*.timestamp",
        transform: "toDateTime:YYYY-MM-DD"
    }
};

const result = map(sourceData, schema);

console.log("DateTime Transforms Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: DateTime transforms support custom formats and timezone conversion.");
console.log("Format: toDateTime:FORMAT:TIMEZONE");
console.log("Example: toDateTime:YYYY-MM-DD HH:mm:ss:America/New_York");

