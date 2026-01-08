/**
 * Advanced Filters Example
 * Demonstrates comprehensive filtering with all operators and logical combinations
 */

const { map } = require("../src/index");

const sourceData = {
    employees: [
        { name: "Alice", age: 30, salary: 50000, department: "Engineering", status: "active" },
        { name: "Bob", age: 25, salary: 45000, department: "Marketing", status: "active" },
        { name: "Charlie", age: 35, salary: 60000, department: "Engineering", status: "inactive" },
        { name: "Diana", age: 28, salary: 55000, department: "Sales", status: "active" },
        { name: "Eve", age: 22, salary: 40000, department: "Engineering", status: "active" },
        { name: "Frank", age: 45, salary: 80000, department: "Management", status: "active" }
    ]
};

// Example 1: Basic filter with eq (equals)
console.log("=== Example 1: Filter by Department ===");
const schema1 = {
    name: { path: "employees.*.name" },
    department: { path: "employees.*.department" },
    filter: {
        all: [{ path: "employees.*.department", eq: "Engineering" }]
    }
};
const result1 = map(sourceData, schema1);
console.log(JSON.stringify(result1, null, 2));

// Example 2: Multiple conditions with and
console.log("\n=== Example 2: Age and Salary Range (AND) ===");
const schema2 = {
    name: { path: "employees.*.name" },
    age: { path: "employees.*.age", transform: "toNumber" },
    salary: { path: "employees.*.salary", transform: "toNumber" },
    filter: {
        all: [
            { path: "employees.*.age", gte: 28 },
            { path: "employees.*.age", lte: 40 },
            { path: "employees.*.salary", gte: 50000 }
        ]
    }
};
const result2 = map(sourceData, schema2);
console.log(JSON.stringify(result2, null, 2));

// Example 3: Using in operator
console.log("\n=== Example 3: Filter by Multiple Departments (IN) ===");
const schema3 = {
    name: { path: "employees.*.name" },
    department: { path: "employees.*.department" },
    filter: {
        all: [
            { path: "employees.*.department", in: ["Engineering", "Sales"] },
            { path: "employees.*.status", eq: "active" }
        ]
    }
};
const result3 = map(sourceData, schema3);
console.log(JSON.stringify(result3, null, 2));

// Example 4: Comparison operators (gt, lt, gte, lte)
console.log("\n=== Example 4: Salary Range ===");
const schema4 = {
    name: { path: "employees.*.name" },
    salary: { path: "employees.*.salary", transform: "toNumber" },
    filter: {
        all: [
            { path: "employees.*.salary", gt: 45000 },
            { path: "employees.*.salary", lt: 70000 }
        ]
    }
};
const result4 = map(sourceData, schema4);
console.log(JSON.stringify(result4, null, 2));

// Example 5: Not equals (ne)
console.log("\n=== Example 5: Exclude Department (NOT EQUALS) ===");
const schema5 = {
    name: { path: "employees.*.name" },
    department: { path: "employees.*.department" },
    filter: {
        all: [
            { path: "employees.*.department", ne: "Management" },
            { path: "employees.*.status", eq: "active" }
        ]
    }
};
const result5 = map(sourceData, schema5);
console.log(JSON.stringify(result5, null, 2));

// Example 6: Regex filter
console.log("\n=== Example 6: Filter by Name Pattern (REGEX) ===");
const schema6 = {
    name: { path: "employees.*.name" },
    filter: {
        all: [{ path: "employees.*.name", regex: "^[AC].*" }] // Names starting with A or C
    }
};
const result6 = map(sourceData, schema6);
console.log(JSON.stringify(result6, null, 2));

// Example 7: Complex filter with nested logic
console.log("\n=== Example 7: Complex Filter (Age OR High Salary) ===");
const schema7 = {
    name: { path: "employees.*.name" },
    age: { path: "employees.*.age", transform: "toNumber" },
    salary: { path: "employees.*.salary", transform: "toNumber" },
    filter: {
        all: [
            {
                or: [
                    { path: "employees.*.age", gte: 35 },
                    { path: "employees.*.salary", gte: 60000 }
                ]
            },
            { path: "employees.*.status", eq: "active" }
        ]
    }
};
const result7 = map(sourceData, schema7);
console.log(JSON.stringify(result7, null, 2));

