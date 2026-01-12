/**
 * Database type definitions that match the Prisma schema.
 * These are the canonical types for the database entities.
 */

// Decimal type - represents Prisma's Decimal as a string for JSON compatibility
// In runtime, this will be a Prisma Decimal object, but for type sharing we use string | number
export type Decimal = string | number;

// JSON types compatible with Prisma's JsonValue
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

// Input JSON type for create/update operations
export type InputJsonValue = JsonValue;
