# Examples Directory

This directory contains comprehensive examples demonstrating all features and use cases of the JSON Restruct.

## Available Examples

### Core Features

1. **`basic-usage.js`** - Simple mapping with basic transforms
   - Single wildcard usage
   - Basic transforms (toNumber, toLowerCase)
   - Simple field mapping

2. **`multi-path-fallback.js`** - Multiple path fallback
   - Using array of paths as fallbacks
   - Default values when all paths fail
   - Handling null/undefined values

3. **`multiple-wildcards.js`** - Cartesian expansion
   - Multiple wildcards in paths
   - Creating cartesian products (row × item)
   - Nested array handling

4. **`bracket-notation.js`** - Excel-style column names
   - Accessing properties with spaces
   - Special characters in property names
   - Excel column name support

### Transforms

5. **`case-conversions.js`** - All case conversion transforms
   - toLowerCase, toUpperCase
   - toTitleCase, toSentenceCase
   - toCamelCase, toSnakeCase, toKebabCase
   - toPascalCase, toLowerFirst, toUpperFirst, toCapitalize

6. **`regex-capture-groups.js`** - Regex pattern matching
   - Extracting specific capture groups
   - Group indexing (0, 1, 2, ...)
   - Combining regex with other transforms

7. **`transform-pipelines.js`** - Chaining transforms
   - Multiple transforms in sequence
   - Transform order matters
   - Complex data transformations

8. **`datetime-transforms.js`** - Date/time formatting
   - Custom date formats
   - Timezone conversion
   - Multiple format examples

### Conditional Logic

9. **`conditional-transforms.js`** - When/then conditions
   - Conditional transform application
   - Multiple conditions
   - Default fallback values

### Filtering

10. **`advanced-filters.js`** - Comprehensive filtering
    - All filter operators (eq, ne, gt, lt, gte, lte, in, regex)
    - Logical operators (and, or, not)
    - Complex filter combinations
    - Multiple examples

11. **`array-filtering.js`** - Array element filtering
    - Using [key=value] syntax
    - Finding specific array elements
    - Combining with wildcards

### Data Handling

12. **`default-values.js`** - Default value usage
    - Handling missing/null values
    - Applying defaults when paths fail
    - Comprehensive examples

13. **`nested-schemas.js`** - Complex nested structures
    - Nested output objects
    - Multiple levels of nesting
    - Combining with wildcards

### Real-World Scenarios

14. **`excel-to-api.js`** - Excel to API transformation
    - Complete real-world example
    - Multiple features combined
    - Practical use case

### Validation

15. **`schema-validation.js`** - Schema validation
    - Validating schemas before mapping
    - Error handling
    - Best practices

## Running Examples

Run any example using Node.js:

```bash
node examples/basic-usage.js
node examples/multi-path-fallback.js
node examples/advanced-filters.js
# ... etc
```

Or run all examples at once:

```bash
for file in examples/*.js; do
    if [ "$(basename $file)" != "README.md" ]; then
        echo "=== Running $(basename $file) ==="
        node "$file"
        echo ""
    fi
done
```

## Example Structure

Each example file follows this structure:

```javascript
/**
 * Example Name
 * Brief description
 */

const { map, validateSchema } = require("../src/index");

// Source data
const sourceData = { ... };

// Mapping schema
const schema = { ... };

// Execute mapping
const result = map(sourceData, schema);

// Display results
console.log("Example Output:");
console.log(JSON.stringify(result, null, 2));
```

## Learning Path

For beginners, follow this order:

1. Start with `basic-usage.js` to understand the fundamentals
2. Move to `multi-path-fallback.js` for flexible path handling
3. Explore `case-conversions.js` for transform basics
4. Learn `regex-capture-groups.js` for advanced extraction
5. Study `conditional-transforms.js` for conditional logic
6. Master `advanced-filters.js` for data filtering
7. Dive into `nested-schemas.js` for complex structures
8. Finally, see `excel-to-api.js` for a complete real-world scenario

## Contributing

When adding new examples:
- Follow the existing code style
- Include clear comments
- Use realistic data structures
- Show both input and output
- Document any special behaviors

