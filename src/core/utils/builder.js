/**
 * Object builder utilities for JSON Restruct
 * Handles building output objects from schemas
 * @module core/utils/builder
 */

const { resolvePath } = require("./path-resolver");
const { applyTransforms } = require("./transformer");

/**
 * Builds an output object from a schema, source data, and context.
 * @param {Object} schema - Mapping schema definition
 * @param {Object} source - Source data object
 * @param {Object} ctx - Context object with wildcard indices
 * @returns {Object} Built output object
 */
function buildObject(schema, source, ctx) {
    const output = {};

    for (const [key, config] of Object.entries(schema)) {
        if (key === "filter") continue;

        if (config.type === "object") {
            output[key] = buildObject(config.properties, source, ctx);
            continue;
        }

        let value = resolvePath(source, config.path, ctx);

        if (config.transform) {
            value = applyTransforms(value, config.transform);
        }

        if (
            (value === null || value === undefined) &&
            Object.keys(config).includes("default")
        ) {
            value = config.default;
        }

        output[key] = value;
    }

    return output;
}

module.exports = {
    buildObject
};
