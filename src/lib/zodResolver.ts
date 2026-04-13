/**
 * Compatibility wrapper for @hookform/resolvers/zod with Zod v4.3+.
 *
 * @hookform/resolvers v5 was typed against Zod v4.0.x and uses a
 * `_zod.version.minor` literal type discriminant that breaks on v4.3+.
 * The runtime behaviour is identical — only the type-level check fails.
 */
import { zodResolver as _zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: type-version bridge
export function zodResolver<T extends FieldValues>(
  schema: ZodType,
): Resolver<T> {
  return _zodResolver(schema as any) as Resolver<T>;
}
