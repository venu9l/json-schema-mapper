/**
 * Filter utilities for JSON Restruct
 * Handles filtering logic for row-level data filtering
 * @module core/utils/filter
 */

const { resolvePath } = require("./path-resolver");

/**
 * Applies filter rules to determine if a context should be included.
 * @param {Object} source - Source data object
 * @param {Object} ctx - Context object with wildcard indices
 * @param {Object} filter - Filter configuration with all array of rules
 * @returns {boolean} True if context passes all filter rules
 */
function applyFilters(source, ctx, filter) {
    if (!filter) return true;

    const rules = filter.all || [];
    return rules.every((rule) => {
        const value = resolvePath(source, rule.path, ctx);

        if ("eq" in rule) return value === rule.eq;
        if ("gt" in rule) return value > rule.gt;
        if ("gte" in rule) return value >= rule.gte;
        if ("lt" in rule) return value < rule.lt;
        if ("lte" in rule) return value <= rule.lte;
        if ("ne" in rule) return value !== rule.ne;
        if ("in" in rule) return rule.in.includes(value);
        if ("not" in rule) return !applyFilters(source, ctx, rule.not);
        if ("and" in rule)
            return rule.and.every((r) => applyFilters(source, ctx, r));
        if ("or" in rule)
            return rule.or.some((r) => applyFilters(source, ctx, r));

        return true;
    });
}

module.exports = {
    applyFilters
};
