/**
 * Path resolution utilities for JSON Restruct
 * Handles path tokenization, context extraction, and value resolution
 * @module core/utils/path-resolver
 */

/**
 * Tokenizes a path string into an array of tokens.
 * Handles wildcards (*) and bracket notation (['key']).
 * @param {string} path - Path string (e.g., "rows.*.age", "rows.*.['Application No']")
 * @returns {string[]} Array of path tokens
 */
function tokenize(path) {
    const tokens = [];
    const regex = /(\*)|\[['"](.+?)['"]\]|([^.]+)/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
        if (match[1]) tokens.push("*");
        else if (match[2]) tokens.push(match[2]);
        else if (match[3]) tokens.push(match[3]);
    }

    return tokens;
}

/**
 * Extracts all contexts from a source object based on a wildcard path.
 * @param {Object} source - Source data object
 * @param {string} path - Path containing wildcards
 * @returns {Array<{value: *, ctx: Object}>} Array of context objects with values and context indices
 */
function extractContexts(source, path) {
    const tokens = tokenize(path);
    let contexts = [{ value: source, ctx: {} }];

    tokens.forEach((token, depth) => {
        const next = [];

        for (const c of contexts) {
            if (token === "*") {
                if (Array.isArray(c.value)) {
                    c.value.forEach((item, i) => {
                        next.push({
                            value: item,
                            ctx: { ...c.ctx, [depth]: i }
                        });
                    });
                }
            } else {
                next.push({
                    value: c.value?.[token],
                    ctx: c.ctx
                });
            }
        }

        contexts = next;
    });

    return contexts;
}

/**
 * Resolves a value from source object using a path and context.
 * Supports wildcards, bracket notation, and array filtering.
 * @param {Object} source - Source data object
 * @param {string|string[]} path - Path string or array of fallback paths
 * @param {Object} ctx - Context object with wildcard indices
 * @returns {*} Resolved value or null if not found
 */
function resolvePath(source, path, ctx) {
    const paths = Array.isArray(path) ? path : [path];

    for (const p of paths) {
        const tokens = tokenize(p);
        let current = source;
        let valid = true;

        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];

            if (t === "*") {
                current = current?.[ctx[i]];
            } else {
                // Array key=value resolver
                const match = t.match(/^(\w+)\[(\w+)=(.+)\]$/);

                if (match) {
                    const [, arrayKey, filterKey, filterValue] = match;
                    const arr = current?.[arrayKey];

                    if (!Array.isArray(arr)) {
                        valid = false;
                        break;
                    }

                    current = arr.find(
                        (item) => String(item?.[filterKey]) === filterValue
                    );
                } else {
                    // Existing behavior - direct property access
                    current = current?.[t];
                }
            }

            if (current === undefined) {
                valid = false;
                break;
            }
        }

        if (valid && current !== null) {
            return current;
        }
    }

    return null;
}

module.exports = {
    tokenize,
    extractContexts,
    resolvePath
};
