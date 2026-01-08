# JSON Restruct

[![npm version](https://img.shields.io/npm/v/json-restruct.svg)](https://www.npmjs.com/package/json-restruct)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/json-restruct.svg)](https://nodejs.org/)

A **high-performance JSON mapping engine** for transforming JSON data into structured, API-ready payloads using **declarative schemas**.

## ✨ Features

- ✅ **Multiple wildcards** (`*`) for array expansion
- ✅ **Excel-style column names** (`['Applicant Name']`)
- ✅ **Multi-path fallback** for flexible data extraction
- ✅ **Nested output schemas** for complex structures
- ✅ **Built-in transforms** (`toNumber`, `toDateTime`, `regex`, case conversions, etc.)
- ✅ **Regex capture groups** with group indexing
- ✅ **Transform pipelines** for chained transformations
- ✅ **Conditional transforms** (`when/then`) for dynamic mapping
- ✅ **Default values** for missing data
- ✅ **Row-level filters** for data filtering
- ✅ **Array filtering** with `[key=value]` syntax
- ✅ **Stream-friendly** & memory efficient
- ✅ **Schema validation** for type safety
- ✅ **Zero dependencies** (except dayjs for date handling)

## 📦 Installation

```bash
npm install json-restruct
```

## 🚀 Quick Start

```javascript
const _json = require('json-restruct');

const sourceData = {
  rows: [
    {
      'Application No': 230085,
      'User Name': 'John Doe',
      Gender: 'male',
      Age: 27,
      id '230085_12'
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
  age: {
    path: "rows.*.Age",
    transform: "toNumber",
    default: 0
  }
};

const result = _json.map(sourceData, schema);
console.log(result);
// Output: [{ application_no: 230085, name: 'John Doe', age: 27 }]
```

## 📚 Table of Contents

1. [Basic Usage](#basic-usage)
2. [Mapping Schema](#mapping-schema)
3. [Paths & Wildcards](#paths--wildcards)
4. [Transforms](#transforms)
5. [Conditional Transforms](#conditional-transforms)
6. [Filters](#filters)
7. [Nested Output Schemas](#nested-output-schemas)
8. [Array Filtering](#array-filtering)
9. [Schema Validation](#schema-validation)
10. [API Reference](#api-reference)
11. [Performance Considerations](#performance-considerations)
12. [Examples](#examples)

## Basic Usage

### Import the Module

```javascript
// CommonJS
const _json = require('json-restruct');

// ES Modules (if supported)
import _json from 'json-restruct';
```

### Simple Mapping

```javascript
const source = {
  users: [
    { name: 'Alice', age: '30' },
    { name: 'Bob', age: '25' }
  ]
};

const schema = {
  name: { path: 'users.*.name' },
  age: { path: 'users.*.age', transform: 'toNumber' }
};

const result = _json.map(source, schema);
// [
//   { name: 'Alice', age: 30 },
//   { name: 'Bob', age: 25 }
// ]
```

## Mapping Schema

A mapping schema defines how source data should be transformed into output format. Each field in the schema can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `path` | `string` or `string[]` | Source path(s), supports wildcards (`*`) |
| `transform` | `string`, `string[]`, or `object` | Transform definition (see [Transforms](#transforms)) |
| `default` | `any` | Default value used if resolved value is `null` or `undefined` |
| `type` | `"object"` | Indicates nested output object (requires `properties`) |
| `properties` | `object` | Nested schema properties (when `type: "object"`) |

### Example Schema

```javascript
const schema = {
  id: {
    path: 'rows.*.id',
    transform: 'toNumber'
  },
  name: {
    path: ['rows.*.name', 'rows.*.fullName'], // Fallback paths
    default: 'Unknown'
  },
  metadata: {
    type: 'object',
    properties: {
      created: { path: 'rows.*.created' },
      updated: { path: 'rows.*.updated' }
    }
  }
};
```

## Paths & Wildcards

### Single Wildcard

Expands arrays to create one output object per array item:

```javascript
{
  name: { path: 'rows.*.name' }
}
```

### Multiple Wildcards

Creates a cartesian product of all wildcard expansions:

```javascript
{
  test_code: { path: 'rows.*.tests.*.code' }
}
```

### Multi-Path Fallback

If the first path returns `null`, subsequent paths are tried:

```javascript
{
  policy_no: {
    path: [
      'rows.*.PolicyNo',
      'rows.*.[\'Policy Number\']',
      'rows.*.policy_number'
    ]
  }
}
```

### Bracket Notation

Use bracket notation for keys with special characters or spaces:

```javascript
{
  applicant_name: {
    path: 'rows.*.[\'Applicant Name\']'
  }
}
```

## Transforms

Transforms modify values during mapping. They can be applied as strings, arrays (pipelines), or objects (conditionals).

### Available Transforms

| Transform | Description | Example |
|-----------|-------------|---------|
| `toNumber` | Converts to number | `"123"` → `123` |
| `toDateTime` | Formats date/time | `toDateTime:YYYY-MM-DD HH:mm:ss` |
| `toLowerCase` | Converts to lowercase | `"HELLO"` → `"hello"` |
| `toUpperCase` | Converts to uppercase | `"hello"` → `"HELLO"` |
| `toTitleCase` | Converts to title case | `"hello world"` → `"Hello World"` |
| `toCamelCase` | Converts to camelCase | `"hello_world"` → `"HelloWorld"` |
| `toSnakeCase` | Converts to snake_case | `"HelloWorld"` → `"hello_world"` |
| `toKebabCase` | Converts to kebab-case | `"HelloWorld"` → `"hello-world"` |
| `toPascalCase` | Converts to PascalCase | `"hello_world"` → `"HelloWorld"` |
| `prefix` | Adds prefix to value | `prefix:ID-` → `"ID-123"` |
| `postfix` | Adds postfix to value | `postfix:-END` → `"123-END"` |
| `regex` | Extracts using regex | `regex:\\d+:0` |
| `toJson` | Parses JSON string | `'{"key":"value"}'` → `{key: "value"}` |
| `toString` | Converts to string | `123` → `"123"` |
| `toBoolean` | Converts to boolean | `"true"` → `true` |

### Transform Syntax

**Simple transform:**
```javascript
{
  age: {
    path: 'rows.*.age',
    transform: 'toNumber'
  }
}
```

**Transform with parameters:**
```javascript
{
  date: {
    path: 'rows.*.timestamp',
    transform: 'toDateTime:YYYY-MM-DD HH:mm:ss'
  }
}
```

**Regex with capture group:**
```javascript
{
  id: {
    path: 'rows.*.indexing',
    transform: 'regex:(\\d+)_(\\d+):2' // Extracts second capture group
  }
}
```

**Prefix transform:**
```javascript
{
  product_id: {
    path: 'rows.*.id',
    transform: 'prefix:PROD-' // Adds "PROD-" before the value
  }
}
```

**Postfix transform:**
```javascript
{
  order_number: {
    path: 'rows.*.order',
    transform: 'postfix:-COMPLETE' // Adds "-COMPLETE" after the value
  }
}
```

**Combining prefix and postfix:**
```javascript
{
  formatted_id: {
    path: 'rows.*.id',
    transform: ['prefix:ID-', 'postfix:-END'] // Pipeline: adds prefix then postfix
  }
}
```

**Transform pipeline:**
```javascript
{
  extracted_id: {
    path: 'rows.*.indexing',
    transform: [
      'regex:(\\d+)_(\\d+):1',
      'toNumber'
    ]
  }
}
```

## Conditional Transforms

Use conditional transforms to apply different transformations based on value conditions.

### Syntax

```javascript
{
  transform: {
    when: [
      { if: <condition>, then: <transform> }
    ],
    default: <transform> // Optional
  }
}
```

### Supported Condition Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals | `{ eq: "male" }` |
| `ne` | Not equals | `{ ne: "female" }` |
| `gt` | Greater than | `{ gt: 18 }` |
| `lt` | Less than | `{ lt: 100 }` |
| `gte` | Greater than or equal | `{ gte: 18 }` |
| `lte` | Less than or equal | `{ lte: 65 }` |
| `in` | Value exists in array | `{ in: ["M", "m", "male"] }` |
| `regex` | Regex test | `{ regex: "^\\d+_\\d+$" }` |
| `exists` | Value exists (not null/undefined) | `{ exists: true }` |

### Examples

**Gender Normalization:**
```javascript
{
  gender: {
    path: 'rows.*.Gender',
    transform: {
      when: [
        { if: { in: ['M', 'm', 'male'] }, then: 'toLowerCase' },
        { if: { in: ['F', 'f', 'female'] }, then: 'toLowerCase' }
      ],
      default: 'unknown'
    }
  }
}
```

**Conditional Regex:**
```javascript
{
  test_id: {
    path: 'rows.*.Indexing',
    transform: {
      when: [
        {
          if: { regex: '^\\d+_\\d+$' },
          then: 'regex:(\\d+)_(\\d+):2'
        }
      ],
      default: null
    }
  }
}
```

## Filters

Filters allow you to skip rows that don't match certain criteria. Rows that fail filter conditions are excluded from the output.

### Filter Syntax

```javascript
{
  // ... field mappings ...
  filter: {
    all: [
      { path: 'rows.*.Gender', eq: 'male' },
      { path: 'rows.*.Age', gt: 18 }
    ]
  }
}
```

### Filter Operators

Filters support the same operators as conditional transforms, plus logical operators:

- `eq`, `ne`, `gt`, `lt`, `gte`, `lte`, `in`, `regex`, `exists`
- `and` - All conditions must be true
- `or` - At least one condition must be true
- `not` - Negates a condition

### Example

```javascript
const schema = {
  name: { path: 'rows.*.name' },
  age: { path: 'rows.*.age', transform: 'toNumber' },
  filter: {
    all: [
      { path: 'rows.*.age', gte: 18 },
      { path: 'rows.*.status', eq: 'active' }
    ]
  }
};
```

## Nested Output Schemas

Create nested output structures using `type: "object"`:

```javascript
{
  user: {
    type: 'object',
    properties: {
      id: {
        path: 'rows.*.[\'Application No\']',
        transform: 'toNumber'
      },
      name: {
        path: 'rows.*.[\'User Name\']'
      },
      age: {
        path: 'rows.*.Age',
        transform: 'toNumber',
        default: 0
      }
    }
  }
}
```

## Array Filtering

Select specific objects from arrays using inline filter syntax: `arrayField[key=value].property`

### Syntax

```
arrayField[key=value].property
```

### Example

**Input:**
```javascript
{
  clinical: [
    { key: 'name', value: 'Kumar' },
    { key: 'age', value: 32 }
  ]
}
```

**Schema:**
```javascript
{
  patient_name: {
    path: 'clinical[key=name].value'
  }
}
```

**Output:**
```javascript
[
  { patient_name: 'Kumar' }
]
```

### With Wildcards

```javascript
{
  age: {
    path: 'rows.*.clinical[key=age].value',
    transform: 'toNumber'
  }
}
```

## Schema Validation

Validate schemas before mapping to catch errors early:

```javascript
const _json = require('json-restruct');

try {
  _json.validateSchema(schema);
  const result = _json.map(source, schema);
} catch (error) {
  console.error('Schema validation failed:', error.message);
}
```

## API Reference

### `map(source, schema)`

Maps source data to output format using a declarative schema.

**Parameters:**
- `source` (Object): Source data object to transform
- `schema` (Object): Mapping schema definition

**Returns:**
- `Array<Object>`: Array of mapped objects

**Throws:**
- `Error`: If source or schema is invalid, or mapping encounters errors

**Example:**
```javascript
const result = _json.map(sourceData, mappingSchema);
```

### `validateSchema(schema)`

Validates a mapping schema for correctness.

**Parameters:**
- `schema` (Object): Mapping schema to validate

**Throws:**
- `Error`: If schema is invalid with descriptive error message

**Example:**
```javascript
try {
  _json.validateSchema(schema);
} catch (error) {
  console.error(error.message);
}
```

## Performance Considerations

The mapper is optimized for large datasets:

- ✅ **Stream-friendly** - Can process data in chunks
- ✅ **Early filtering** - Filters applied before object construction
- ✅ **Pre-tokenized paths** - Paths are parsed once
- ✅ **Regex compiled once** - Patterns are cached
- ✅ **No recursion** - Iterative algorithms
- ✅ **Deterministic execution** - Predictable performance

**Performance Tips:**
- Use filters early to reduce processing
- Avoid deeply nested wildcards when possible
- Use specific paths instead of multiple fallbacks when you know the structure
- Pre-validate schemas in development

**Tested with:**
- 100k+ rows efficiently
- 500k+ rows with proper memory management

## Examples

### Complete Example

**Input Data:**
```javascript
{
  client_id: 'CLIENT_001',
  rows: [
    {
      'Application No': 230085,
      'User Name': 'John Doe',
      Gender: 'male',
      Age: 27,
      id '230085_12',
      tests: [
        { code: 'CG', value: '10' }
      ]
    }
  ]
}
```

**Mapping Schema:**
```javascript
{
  client_id: { path: 'client_id' },
  
  user: {
    type: 'object',
    properties: {
      application_no: {
        path: 'rows.*.[\'Application No\']',
        transform: 'toNumber'
      },
      name: { path: 'rows.*.[\'User Name\']' },
      age: {
        path: 'rows.*.Age',
        transform: 'toNumber',
        default: 0
      }
    }
  },
  
  test: {
    type: 'object',
    properties: {
      code: { path: 'rows.*.tests.*.code' },
      value: {
        path: 'rows.*.tests.*.value',
        transform: 'toNumber'
      }
    }
  },
  
  filter: {
    all: [
      { path: 'rows.*.Age', gt: 18 }
    ]
  }
}
```

**Output:**
```javascript
[
  {
    client_id: 'CLIENT_001',
    user: {
      application_no: 230085,
      name: 'John Doe',
      age: 27
    },
    test: {
      code: 'CG',
      value: 10
    }
  }
]
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Made with ❤️ for efficient data transformation**

