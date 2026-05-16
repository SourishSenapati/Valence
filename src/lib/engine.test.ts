import { describe, it, expect } from "vitest";
import { validateGoalSheet, calculateAchievement } from "./engine";
import { Goal } from "@prisma/client";

describe("Goal Engine - validateGoalSheet", () => {
  it("should validate a correct goal sheet (100% weightage, valid counts)", () => {
    const goals = [
      { title: "Increase Efficiency", weightage: 40 },
      { title: "Reduce Waste", weightage: 30 },
      { title: "Safety Protocol", weightage: 30 },
    ];
    const result = validateGoalSheet(goals as unknown as Goal[]);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail if total weightage is not exactly 100", () => {
    const result99 = validateGoalSheet([{ title: "G1", weightage: 99 }] as unknown as Goal[]);
    expect(result99.isValid).toBe(false);
    expect(result99.errors).toContainEqual(expect.stringContaining("Total weightage must be exactly 100. Current total is 99."));

    const result101 = validateGoalSheet([{ title: "G1", weightage: 101 }] as unknown as Goal[]);
    expect(result101.isValid).toBe(false);
    expect(result101.errors).toContainEqual(expect.stringContaining("Total weightage must be exactly 100. Current total is 101."));
  });

  it("should fail if any goal weightage is below 10", () => {
    const goals = [
      { title: "Heavyweight", weightage: 91 },
      { title: "Lightweight", weightage: 9 },
    ];
    const result = validateGoalSheet(goals as unknown as Goal[]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining("Weightage 9 is below the minimum of 10."));
  });

  it("should fail if goal count exceeds 8", () => {
    const goals = Array(9).fill(null).map((_, i) => ({ title: `G${i}`, weightage: 11.11 }));
    const result = validateGoalSheet(goals as unknown as Goal[]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining("Maximum goals per employee is 8."));
  });

  it("should provide specific error messages for multiple failures", () => {
    const goals = [
      { title: "Tiny", weightage: 5 },
      { title: "Another Tiny", weightage: 5 },
    ];
    const result = validateGoalSheet(goals as unknown as Goal[]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3); // 2 min weightage errors + 1 total weightage error
  });
});

describe("Goal Engine - calculateAchievement", () => {
  describe("MIN (Higher is Better)", () => {
    it("should calculate standard achievement", () => {
      expect(calculateAchievement("MIN", 100, 80)).toBe(80);
      expect(calculateAchievement("MIN", 50, 25)).toBe(50);
    });

    it("should cap at 120%", () => {
      expect(calculateAchievement("MIN", 100, 150)).toBe(120);
    });

    it("should handle zero target safely", () => {
      expect(calculateAchievement("MIN", 0, 10)).toBe(120);
      expect(calculateAchievement("MIN", 0, 0)).toBe(0);
    });
  });

  describe("MAX (Lower is Better)", () => {
    it("should calculate standard achievement", () => {
      expect(calculateAchievement("MAX", 100, 100)).toBe(100);
      expect(calculateAchievement("MAX", 100, 200)).toBe(50);
    });

    it("should cap at 120% for performance better than target", () => {
      expect(calculateAchievement("MAX", 100, 50)).toBe(120);
    });

    it("should handle division by zero (actual=0) safely", () => {
      expect(calculateAchievement("MAX", 100, 0)).toBe(120);
    });
  });

  describe("TIMELINE (Date adherence)", () => {
    const deadline = new Date("2024-05-01T12:00:00Z");

    it("should return 100% if completed on or before deadline", () => {
      const sameDay = new Date("2024-05-01T10:00:00Z");
      const early = new Date("2024-04-20T12:00:00Z");
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, sameDay)).toBe(100);
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, early)).toBe(100);
    });

    it("should scale down by 10% per day overdue", () => {
      const oneDayLate = new Date("2024-05-02T13:00:00Z");
      const threeDaysLate = new Date("2024-05-04T12:00:00Z");
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, oneDayLate)).toBe(90);
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, threeDaysLate)).toBe(70);
    });

    it("should floor at 0% for very late completion", () => {
      const veryLate = new Date("2024-06-01T12:00:00Z");
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, veryLate)).toBe(0);
    });

    it("should return 0% if dates are missing", () => {
      expect(calculateAchievement("TIMELINE", 0, 0, deadline, undefined)).toBe(0);
    });
  });

  describe("ZERO (Boolean achievement)", () => {
    it("should return 100% only if actual is exactly 0", () => {
      expect(calculateAchievement("ZERO", 1, 0)).toBe(100);
      expect(calculateAchievement("ZERO", 0, 0)).toBe(100);
    });

    it("should return 0% if actual is not 0", () => {
      expect(calculateAchievement("ZERO", 0, 1)).toBe(0);
      expect(calculateAchievement("ZERO", 0, 0.1)).toBe(0);
      expect(calculateAchievement("ZERO", 0, -5)).toBe(0);
    });
  });
});
