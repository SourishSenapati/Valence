import { z } from "zod";
import { UomType, GoalStatus } from "@prisma/client";

export const GoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  thrustArea: z.string().min(2, "Thrust Area is required"),
  uomType: z.nativeEnum(UomType),
  targetValue: z.number().min(0, "Target must be positive"),
  weightage: z.number().min(10, "Minimum weightage is 10").max(100),
});

export const GoalSheetSchema = z.object({
  goals: z.array(GoalSchema).min(1).max(8),
});

export type GoalInput = z.infer<typeof GoalSchema>;
export type GoalSheetInput = z.infer<typeof GoalSheetSchema>;
