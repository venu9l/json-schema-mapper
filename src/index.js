/**
 * @fileoverview JSON Restruct - A high-performance JSON Restruct
 * for transforming Excel/JSON data into structured, API-ready payloads using declarative schemas.
 * @module json-restruct
 */

const { validateSchema } = require("./core/validator/schema.validator");
const { extractContexts } = require("./core/utils/path-resolver");
const { applyFilters } = require("./core/utils/filter");
const { buildObject } = require("./core/utils/builder");

/**
 * Maps source data to output format using a declarative schema.
 * @param {Object} source - Source data object to transform
 * @param {Object} schema - Mapping schema definition
 * @returns {Array<Object>} Array of mapped objects
 * @throws {Error} If schema validation fails or mapping encounters errors
 * @example
 * const result = map({ rows: [{ name: "John", age: 30 }] }, {
 *   name: { path: "rows.*.name" },
 *   age: { path: "rows.*.age", transform: "toNumber" }
 * });
 */
function map(source, schema) {
    if (!source || typeof source !== "object") {
        throw new Error("Source must be a non-null object");
    }
    if (!schema || typeof schema !== "object") {
        throw new Error("Schema must be a non-null object");
    }

    // Extract base path with wildcards for context extraction
    const wildcardPaths = JSON.stringify(schema).match(/[^"]*\*/g);
    const basePath = wildcardPaths?.[0];

    // Extract contexts for wildcard expansion
    const contexts = basePath
        ? extractContexts(source, basePath)
        : [{ ctx: {} }];

    const result = [];

    // Process each context and build output objects
    for (const c of contexts) {
        // Apply filters - skip if context doesn't match filter criteria
        if (!applyFilters(source, c.ctx, schema.filter)) continue;

        // Build output object for this context
        result.push(buildObject(schema, source, c.ctx));
    }

    return result;
}

/**
 * JSON Restruct
 * @namespace
 */
const _json = {
    /**
     * Maps source data to output format using a declarative schema.
     * @function
     * @param {Object} source - Source data object to transform
     * @param {Object} schema - Mapping schema definition
     * @returns {Array<Object>} Array of mapped objects
     */
    map,

    /**
     * Validates a mapping schema for correctness.
     * @function
     * @param {Object} schema - Mapping schema to validate
     * @throws {Error} If schema is invalid
     */
    validateSchema
};

module.exports = _json;
