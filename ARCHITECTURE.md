# Architecture Overview

This document describes the architecture and organization of the JSON Map Engine codebase.

## Project Structure

```
JSON_MAPPER/
├── src/
│   ├── index.js                    # Main entry point - exports map() and validateSchema()
│   ├── index.d.ts                  # TypeScript definitions
│   ├── test.js                     # Test suite
│   └── core/
│       ├── validator/
│       │   └── schema.validator.js # Schema validation logic
│       └── utils/
│           ├── transformer.js      # Transform parsing and application
│           ├── filter.js           # Filter logic
│           ├── path-resolver.js    # Path tokenization and resolution
│           └── builder.js          # Output object building
├── examples/                       # Example usage files
├── README.md                       # Main documentation
├── package.json                    # npm configuration
└── LICENSE                         # MIT License
```

## Module Responsibilities

### `src/index.js`
**Main Entry Point**
- Public API exports (`map`, `validateSchema`)
- High-level mapping orchestration
- Input validation
- Context extraction coordination

### `src/core/utils/transformer.js`
**Transform Processing**
- Transform string parsing (`parseTransform`)
- Condition evaluation (`evaluateCondition`)
- Conditional transform application (`applyConditional`)
- Transform pipeline execution (`applyTransforms`)
- Built-in transform functions (toNumber, toDateTime, case conversions, regex, etc.)

### `src/core/utils/filter.js`
**Filtering Logic**
- Row-level filtering (`applyFilters`)
- Filter rule evaluation
- Logical operators (and, or, not) support

### `src/core/utils/path-resolver.js`
**Path Resolution**
- Path tokenization (`tokenize`)
- Wildcard context extraction (`extractContexts`)
- Value resolution with array filtering (`resolvePath`)
- Support for bracket notation and wildcards

### `src/core/utils/builder.js`
**Output Construction**
- Output object building (`buildObject`)
- Nested schema handling
- Default value application
- Integration with transforms

### `src/core/validator/schema.validator.js`
**Schema Validation**
- Schema structure validation
- Path validation
- Transform validation
- Filter validation

## Data Flow

```
1. map(source, schema)
   ↓
2. Extract wildcard paths from schema
   ↓
3. extractContexts() - Expand wildcards into contexts
   ↓
4. For each context:
   ├─→ applyFilters() - Check if context matches filter criteria
   └─→ buildObject() - Build output object
       ├─→ resolvePath() - Get value from source
       ├─→ applyTransforms() - Transform value
       └─→ Apply defaults if needed
   ↓
5. Return array of mapped objects
```

## Module Dependencies

```
index.js
  ├─→ schema.validator.js (validateSchema)
  ├─→ path-resolver.js (extractContexts)
  ├─→ filter.js (applyFilters)
  └─→ builder.js (buildObject)
       ├─→ path-resolver.js (resolvePath)
       └─→ transformer.js (applyTransforms)
            └─→ transformer.js (recursive for conditionals)
filter.js
  └─→ path-resolver.js (resolvePath)
```

## Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Modularity**: Utilities can be tested and maintained independently
3. **Reusability**: Common functions like `resolvePath` are shared across modules
4. **Extensibility**: Easy to add new transforms or filters
5. **Performance**: Efficient path resolution and context extraction

## Extension Points

### Adding New Transforms
Add to `transforms` object in `transformer.js`:
```javascript
transforms.myTransform = (value, parsed) => {
    // Transform logic
    return transformedValue;
};
```

### Adding New Filter Operators
Modify `applyFilters` function in `filter.js`:
```javascript
if ("myOperator" in rule) {
    return myOperatorLogic(value, rule.myOperator);
}
```

### Custom Path Syntax
Extend `tokenize` and `resolvePath` in `path-resolver.js`

