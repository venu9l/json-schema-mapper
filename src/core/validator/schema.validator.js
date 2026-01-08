function schemaError(message) {
    throw new Error(`Schema validation error: ${message}`);
}

function validatePath(path, fieldPath) {
    if (typeof path !== "string" || !path.length) {
        schemaError(`${fieldPath}.path must be a non-empty string`);
    }

    if (path.includes("..")) {
        schemaError(`${fieldPath}.path contains invalid ".."`);
    }
}

const CONDITION_OPERATORS = [
    "eq",
    "ne",
    "gt",
    "lt",
    "gte",
    "lte",
    "in",
    "regex",
    "exists"
];

function validateCondition(condition, fieldPath) {
    if (typeof condition !== "object" || condition === null) {
        schemaError(`${fieldPath} must be an object`);
    }

    const keys = Object.keys(condition);

    if (keys.length !== 1) {
        schemaError(`${fieldPath} must contain exactly one condition`);
    }

    const operator = keys[0];

    if (!CONDITION_OPERATORS.includes(operator)) {
        schemaError(`${fieldPath} unsupported operator "${operator}"`);
    }
}

const ALLOWED_TRANSFORMS = [
    "toNumber",
    "toDateTime",
    "toUpperCase",
    "toLowerCase",
    "toTitleCase",
    "toSentenceCase",
    "toCamelCase",
    "toSnakeCase",
    "toKebabCase",
    "toPascalCase",
    "toLowerFirst",
    "toUpperFirst",
    "toCapitalize",
    "toJson",
    "toString",
    "toBoolean",
    "regex",
    "map"
];

function validateTransform(transform, fieldPath) {
    if (!transform) return;

    // pipeline
    if (Array.isArray(transform)) {
        transform.forEach((t, i) =>
            validateTransform(t, `${fieldPath}.transform[${i}]`)
        );
        return;
    }

    // conditional
    if (typeof transform === "object" && transform.when) {
        if (!Array.isArray(transform.when)) {
            schemaError(`${fieldPath}.transform.when must be an array`);
        }

        transform.when.forEach((rule, i) => {
            if (!rule.if || !rule.then) {
                schemaError(
                    `${fieldPath}.transform.when[${i}] must contain if and then`
                );
            }

            validateCondition(rule.if, `${fieldPath}.transform.when[${i}].if`);

            validateTransform(
                rule.then,
                `${fieldPath}.transform.when[${i}].then`
            );
        });

        if ("default" in transform) {
            validateTransform(
                transform.default,
                `${fieldPath}.transform.default`
            );
        }

        return;
    }

    // string transform
    if (typeof transform === "string") {
        const type = transform.split(":")[0];
        if (!ALLOWED_TRANSFORMS.includes(type)) {
            schemaError(
                `${fieldPath}.transform unsupported transform "${type}"`
            );
        }
        return;
    }

    schemaError(`${fieldPath}.transform invalid type`);
}

function validateFilter(filter) {
    if (!filter || typeof filter !== "object") return;

    if (!Array.isArray(filter.all)) {
        schemaError(`filter.all must be an array`);
    }

    filter.all.forEach((rule, i) => {
        if (!rule.path) {
            schemaError(`filter.all[${i}].path missing`);
        }

        validatePath(rule.path, `filter.all[${i}]`);

        const condition = { ...rule };
        delete condition.path;

        validateCondition(condition, `filter.all[${i}]`);
    });
}

function validateSchema(schema, parentPath = "schema") {
    if (typeof schema !== "object" || schema === null) {
        schemaError(`${parentPath} must be an object`);
    }

    for (const [key, config] of Object.entries(schema)) {
        const fieldPath = `${parentPath}.${key}`;

        if (key === "filter") {
            validateFilter(config);
            continue;
        }

        if (config.type === "object") {
            if (!config.properties) {
                schemaError(`${fieldPath}.properties missing`);
            }
            validateSchema(config.properties, fieldPath);
            continue;
        }

        if (!config.path) {
            schemaError(`${fieldPath}.path missing`);
        }

        if (Array.isArray(config.path)) {
            config.path.forEach((p) => validatePath(p, fieldPath));
        } else {
            validatePath(config.path, fieldPath);
        }

        validateTransform(config.transform, fieldPath);
    }
}

module.exports = { validateSchema };
