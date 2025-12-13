import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

// MARK: Exported Schemas
export const paramIdSchema = z.object({
    id: z.string(),
});

// MARK: Exported Types
export interface BASE_RESPONSE {
    success: boolean;
    message: string;
}
export type PARAM_ID_DTO = z.infer<typeof paramIdSchema>;

// MARK: Exported Validators
export const PARAM_ID_VALIDTOR = zValidator(
    "param",
    paramIdSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Param Id Not Provided!",
                } satisfies BASE_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);
