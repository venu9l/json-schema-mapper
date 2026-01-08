# Setup Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Try examples:**
   ```bash
   node examples/basic-usage.js
   node examples/excel-to-api.js
   node examples/conditional-transforms.js
   node examples/array-filtering.js
   ```

## Publishing to npm

1. **Update version in package.json** (if needed)

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

## Development

The project structure:
```
JSON_MAPPER/
├── src/              # Source code
│   ├── index.js      # Main module
│   ├── index.d.ts    # TypeScript definitions
│   ├── test.js       # Test suite
│   └── core/         # Core utilities
├── examples/         # Example files
├── README.md         # Documentation
├── LICENSE           # MIT License
├── package.json      # npm configuration
└── .gitignore        # Git ignore rules
```

## Testing

Run the test suite:
```bash
npm test
```

The test suite covers:
- Basic mapping
- Wildcards and nested structures
- Conditional transforms
- Filters
- Array filtering
- Schema validation
- Regex transforms

