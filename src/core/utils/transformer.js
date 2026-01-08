/**
 * Transform utilities for JSON Restruct
 * Handles all transform-related operations including parsing, evaluation, and application
 * @module core/utils/transformer
 */

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

/**
 * Parses a transform string into a structured object.
 * @param {string} str - Transform string (e.g., "toNumber", "regex:pattern:group", "toDateTime:format:timezone", "prefix:value", "postfix:value")
 * @returns {{type: string, pattern?: string, group?: number, timezone?: string, value?: string}} Parsed transform object
 */
function parseTransform(str) {
    const firstColon = str.indexOf(":");
    if (firstColon === -1) return { type: str };

    const type = str.slice(0, firstColon);
    const rest = str.slice(firstColon + 1);

    const parts = rest.split(":");

    // Special handling for toDateTime which may have format and timezone
    if (type === "toDateTime" && parts.length >= 2) {
        return {
            type,
            pattern: parts[0],
            timezone: parts[1]
        };
    }

    return {
        type,
        pattern: parts[0],
        group: parts[1] ? Number(parts[1]) : 0
    };
}

/**
 * Evaluates a condition against a value.
 * @param {*} value - The value to evaluate
 * @param {Object} condition - Condition object with operators (eq, ne, gt, lt, gte, lte, in, regex, exists)
 * @returns {boolean} True if condition is met
 */
function evaluateCondition(value, condition) {
    if ("exists" in condition) {
        return condition.exists ? value != null : value == null;
    }
    if ("eq" in condition) return value === condition.eq;
    if ("ne" in condition) return value !== condition.ne;
    if ("gt" in condition) return value > condition.gt;
    if ("lt" in condition) return value < condition.lt;
    if ("gte" in condition) return value >= condition.gte;
    if ("lte" in condition) return value <= condition.lte;
    if ("in" in condition) return condition.in.includes(value);
    if ("regex" in condition)
        return new RegExp(condition.regex).test(String(value));

    return false;
}

/**
 * Available transform functions
 */
const transforms = {
    toNumber: (v) =>
        v === null || v === undefined || v === "" ? null : Number(v),

    toDateTime: (v, parsed) => {
        if (v === null || v === undefined || v === "") return null;

        // Support both parsed object and direct parameters
        const format = parsed?.pattern || parsed?.format;
        const timezone = parsed?.timezone || parsed?.tz || "UTC";

        try {
            return dayjs(v)
                .tz(timezone)
                .format(format || "YYYY-MM-DD HH:mm:ss");
        } catch (e) {
            throw new Error(`DateTime transform error: ${e.message}`);
        }
    },

    currentDateTime: (v) => {
        return dayjs().format("YYYY-MM-DD HH:mm:ss");
    },

    toLowerCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().toLowerCase(),

    toUpperCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().toUpperCase(),

    toTitleCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().charAt(0).toUpperCase() +
              v.trim().slice(1).toLowerCase(),

    toSentenceCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().charAt(0).toUpperCase() +
              v.trim().slice(1).toLowerCase(),

    toCamelCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v
                  .trim()
                  .replace(/_/g, "")
                  .replace(/\b\w/g, (char) => char.toUpperCase()),

    toSnakeCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v
                  .trim()
                  .replace(/([A-Z])/g, "_$1")
                  .toLowerCase(),

    toKebabCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v
                  .trim()
                  .replace(/([A-Z])/g, "-$1")
                  .toLowerCase(),

    toPascalCase: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v
                  .trim()
                  .replace(/(^\w|-\w)/g, (char) =>
                      char.toUpperCase().replace("-", "")
                  ),

    toLowerFirst: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().charAt(0).toLowerCase() + v.trim().slice(1),

    toUpperFirst: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().charAt(0).toUpperCase() + v.trim().slice(1),

    toCapitalize: (v) =>
        v === null || v === undefined || v === ""
            ? null
            : v.trim().charAt(0).toUpperCase() +
              v.trim().slice(1).toLowerCase(),

    toJson: (v) => {
        try {
            return JSON.parse(v);
        } catch (e) {
            throw new Error(`JSON parse error: ${e.message}`);
        }
    },

    toString: (v) => v.toString(),

    toBoolean: (v) => Boolean(v),

    regex: (value, { pattern, group = 0 }) => {
        if (value == null) return null;

        try {
            const re = new RegExp(pattern);
            const match = String(value).match(re);

            if (!match) return null;

            return match[group] ?? null;
        } catch (e) {
            throw new Error(`Invalid regex pattern "${pattern}": ${e.message}`);
        }
    },

    prefix: (value, parsed) => {
        if (value === null || value === undefined || value === "") return null;
        const prefixValue = parsed?.pattern || parsed?.value || "";
        return String(prefixValue) + String(value);
    },

    postfix: (value, parsed) => {
        if (value === null || value === undefined || value === "") return null;
        const postfixValue = parsed?.pattern || parsed?.value || "";
        return String(value) + String(postfixValue);
    }
};

/**
 * Applies conditional transforms based on when/then rules.
 * @param {*} value - The value to transform
 * @param {Object} config - Conditional transform configuration with when array and optional default
 * @param {Function} applyTransformsFn - Reference to applyTransforms function (to avoid circular dependency)
 * @returns {*} Transformed value
 */
function applyConditional(value, config, applyTransformsFn) {
    for (const rule of config.when || []) {
        if (evaluateCondition(value, rule.if)) {
            return applyTransformsFn(value, rule.then);
        }
    }

    if ("default" in config) {
        return applyTransformsFn(value, config.default);
    }

    return value;
}

/**
 * Applies a transform or transform pipeline to a value.
 * @param {*} value - The value to transform
 * @param {string|string[]|Object|Function} transform - Transform definition (string, array, object, or function)
 * @returns {*} Transformed value
 */
function applyTransforms(value, transform) {
    if (!transform) return value;

    // Simple conditional
    if (typeof transform === "object" && transform.when) {
        return applyConditional(value, transform, applyTransforms);
    }

    const pipeline = Array.isArray(transform) ? transform : [transform];
    let result = value;

    for (const step of pipeline) {
        if (typeof step === "function") {
            result = step(result);
        } else if (typeof step === "string") {
            const parsed = parseTransform(step);
            result = transforms[parsed.type]?.(result, parsed);
        } else if (typeof step === "object") {
            result = transforms[step.type]?.(result, step);
        }
    }

    return result;
}

module.exports = {
    applyTransforms,
    evaluateCondition,
    transforms,
    parseTransform
};
