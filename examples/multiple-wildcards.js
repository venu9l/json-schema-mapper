/**
 * Multiple Wildcards Example
 * Demonstrates cartesian expansion with multiple wildcards
 * Creates one output for each combination of array items
 */

const { map } = require("../src/index");

const sourceData = {
    students: [
        {
            name: "Alice",
            subjects: [
                { code: "MATH", score: 95 },
                { code: "SCI", score: 88 }
            ]
        },
        {
            name: "Bob",
            subjects: [
                { code: "MATH", score: 87 },
                { code: "ENG", score: 92 }
            ]
        }
    ]
};

const schema = {
    student_name: {
        path: "students.*.name"
    },
    subject_code: {
        path: "students.*.subjects.*.code"
    },
    score: {
        path: "students.*.subjects.*.score",
        transform: "toNumber"
    }
};

const result = map(sourceData, schema);

console.log("Multiple Wildcards (Cartesian Expansion) Example:");
console.log(JSON.stringify(result, null, 2));
console.log("\nNote: Each student × subject combination creates a separate output object.");
console.log("Result: 2 students × 2 subjects = 4 output objects");

