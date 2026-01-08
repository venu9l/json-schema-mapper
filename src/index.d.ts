/**
 * JSON Restruct - TypeScript Definitions
 * @module json-restruct
 */

/**
 * Condition operators for filtering and conditional transforms
 */
export interface Condition {
    /** Equals */
    eq?: any;
    /** Not equals */
    ne?: any;
    /** Greater than */
    gt?: number;
    /** Less than */
    lt?: number;
    /** Greater than or equal */
    gte?: number;
    /** Less than or equal */
    lte?: number;
    /** Value exists in array */
    in?: any[];
    /** Regex test */
    regex?: string;
    /** Value exists (not null/undefined) */
    exists?: boolean;
}

/**
 * Transform definition - can be a string, array of transforms, or conditional object
 */
export type Transform =
    | string
    | string[]
    | {
          when: Array<{
              if: Condition;
              then: Transform;
          }>;
          default?: Transform;
      }
    | ((value: any) => any);

/**
 * Field mapping configuration
 */
export interface FieldMapping {
    /** Source path(s) - supports wildcards (*) and bracket notation */
    path: string | string[];
    /** Transform to apply to the value */
    transform?: Transform;
    /** Default value if resolved value is null/undefined */
    default?: any;
    /** For nested objects, set type to "object" */
    type?: "object";
    /** Nested properties (required when type is "object") */
    properties?: Schema;
}

/**
 * Filter rule for row-level filtering
 */
export interface FilterRule {
    /** Path to the value to filter on */
    path: string;
    /** Condition operators */
    eq?: any;
    ne?: any;
    gt?: number;
    lt?: number;
    gte?: number;
    lte?: number;
    in?: any[];
    regex?: string;
    exists?: boolean;
    /** Logical NOT - negates a filter */
    not?: FilterRule | FilterRule[];
    /** Logical AND - all conditions must be true */
    and?: FilterRule[];
    /** Logical OR - at least one condition must be true */
    or?: FilterRule[];
}

/**
 * Filter configuration
 */
export interface Filter {
    /** All rules must pass */
    all: FilterRule[];
}

/**
 * Mapping schema definition
 */
export interface Schema {
    [key: string]: FieldMapping | Filter;
}

/**
 * Maps source data to output format using a declarative schema.
 *
 * @param source - Source data object to transform
 * @param schema - Mapping schema definition
 * @returns Array of mapped objects
 * @throws Error if source or schema is invalid, or mapping encounters errors
 *
 * @example
 * ```typescript
 * const result = map({ rows: [{ name: "John", age: 30 }] }, {
 *   name: { path: "rows.*.name" },
 *   age: { path: "rows.*.age", transform: "toNumber" }
 * });
 * ```
 */
export function map(source: any, schema: Schema): any[];

/**
 * Validates a mapping schema for correctness.
 *
 * @param schema - Mapping schema to validate
 * @throws Error if schema is invalid with descriptive error message
 *
 * @example
 * ```typescript
 * try {
 *   validateSchema(schema);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export function validateSchema(schema: Schema): void;

/**
 * JSON Restruct namespace
 */
declare const _json: {
    map: typeof map;
    validateSchema: typeof validateSchema;
};

export default _json;
