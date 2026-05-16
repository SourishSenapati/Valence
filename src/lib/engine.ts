import { Goal, UomType } from "@prisma/client";

/**
 * Result of the goal sheet validation
 */
export type GoalValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Validates a collection of goals for an employee.
 * Rules:
 * 1. Total weightage must strictly equal 100.
 * 2. Individual goal weightage must be at least 10.
 * 3. Maximum goals per employee is 8.
 */
export function validateGoalSheet(goals: Partial<Goal>[]): GoalValidationResult {
  const errors: string[] = [];

  if (goals.length === 0) {
    errors.push("Goal sheet must contain at least one goal.");
    return { isValid: false, errors };
  }

  if (goals.length > 8) {
    errors.push("Maximum goals per employee is 8. Current sheet has " + goals.length + ".");
  }

  let totalWeightage = 0;
  goals.forEach((goal, index) => {
    const weightage = goal.weightage ?? 0;
    totalWeightage += weightage;
    if (weightage < 10) {
      errors.push(`Goal #${index + 1} ("${goal.title || 'Untitled'}"): Weightage ${weightage} is below the minimum of 10.`);
    }
  });

  if (totalWeightage !== 100) {
    errors.push(`Total weightage must be exactly 100. Current total is ${totalWeightage}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates the achievement percentage based on the Unit of Measure (UOM) type.
 * 
 * @param uom - The measurement type (MIN, MAX, TIMELINE, ZERO)
 * @param target - The target value to achieve
 * @param actual - The actual value achieved
 * @param deadline - (Required for TIMELINE) The target completion date
 * @param completionDate - (Required for TIMELINE) The actual completion date
 * @returns Achievement percentage (0 - 120 for MIN/MAX, 0 - 100 for others)
 */
export function calculateAchievement(
  uom: UomType,
  target: number,
  actual: number,
  deadline?: Date,
  completionDate?: Date
): number {
  switch (uom) {
    case "MIN": {
      // MIN: Higher actual is better (e.g., Sales Revenue)
      if (target <= 0) return actual > target ? 120 : 0;
      const achievement = (actual / target) * 100;
      return Math.min(Math.max(achievement, 0), 120);
    }

    case "MAX": {
      // MAX: Lower actual is better (e.g., Defects, Waste)
      if (actual <= 0) return 120;
      if (target <= 0) return actual <= target ? 120 : 0;
      const achievement = (target / actual) * 100;
      return Math.min(Math.max(achievement, 0), 120);
    }

    case "TIMELINE": {
      // TIMELINE: Achievement based on deadline adherence
      if (!deadline || !completionDate) return 0;
      if (completionDate <= deadline) return 100;

      const diffTime = completionDate.getTime() - deadline.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Scale down by 10% per day overdue (e.g., 25 hours late = 1 day late)
      const achievement = 100 - diffDays * 10;
      return Math.max(achievement, 0);
    }

    case "ZERO": {
      // ZERO: Achievement only if actual is zero (e.g., Fatal Accidents)
      return actual === 0 ? 100 : 0;
    }

    default:
      return 0;
  }
}
