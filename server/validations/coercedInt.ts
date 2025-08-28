import { z } from "zod";


export const coercedInt: z.ZodTransform<number, string> = z.transform((val, ctx) => {
    try {
        const parsed = Number.parseInt(String(val));
        return parsed;
    } catch (e) {
        ctx.issues.push({
            code: "custom",
            message: "Not a number",
            input: val,
        });
        return z.NEVER;
    }
});