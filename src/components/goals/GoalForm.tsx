"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoalSheetSchema, GoalSheetInput } from "@/lib/validations/goal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput, GlassSelect } from "@/components/ui/Forms";
import { Plus, Trash2, Calculator, Save } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UomType } from "@prisma/client";
import { cn } from "@/lib/utils";

export function GoalForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<GoalSheetInput>({
    resolver: zodResolver(GoalSheetSchema),
    defaultValues: {
      goals: [{ title: "", thrustArea: "", uomType: UomType.MIN, targetValue: 0, weightage: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goals",
  });

  const watchedGoals = watch("goals");
  const totalWeightage = useMemo(() => 
    watchedGoals.reduce((acc, curr) => acc + (Number(curr.weightage) || 0), 0),
    [watchedGoals]
  );
  
  const isWeightageValid = totalWeightage === 100;
  const isGoalCountValid = fields.length <= 8;
  const areIndividualWeightsValid = watchedGoals.every(g => (g.weightage ?? 0) >= 10);
  const canSubmit = isValid && isWeightageValid && isGoalCountValid && areIndividualWeightsValid;
  const canAddMore = fields.length < 8;

  const onSubmit = async (data: GoalSheetInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">New Goal Sheet</h1>
          <p className="text-gray-400 mt-1">Define your performance targets for the current cycle.</p>
        </div>
        <GlassButton
          type="button"
          variant="secondary"
          onClick={() => append({ title: "", thrustArea: "", uomType: UomType.MIN, targetValue: 0, weightage: 0 })}
          disabled={!canAddMore}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal ({fields.length}/8)
        </GlassButton>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <GlassPanel key={field.id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-1">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500 border border-white/10">
                  {index + 1}
                </div>
              </div>
              
              <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassInput
                  label="Goal Title"
                  placeholder="e.g. Reduce downtime"
                  error={errors.goals?.[index]?.title?.message}
                  {...register(`goals.${index}.title`)}
                />
                <GlassInput
                  label="Thrust Area"
                  placeholder="e.g. Operational Excellence"
                  error={errors.goals?.[index]?.thrustArea?.message}
                  {...register(`goals.${index}.thrustArea`)}
                />
                <GlassSelect
                  label="UOM Type"
                  error={errors.goals?.[index]?.uomType?.message}
                  {...register(`goals.${index}.uomType`)}
                >
                  {Object.values(UomType).map((type) => (
                    <option key={type} value={type} className="bg-industrial-900">
                      {type}
                    </option>
                  ))}
                </GlassSelect>
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput
                    type="number"
                    label="Target"
                    error={errors.goals?.[index]?.targetValue?.message}
                    {...register(`goals.${index}.targetValue`, { valueAsNumber: true })}
                  />
                  <GlassInput
                    type="number"
                    label="Weightage (%)"
                    error={errors.goals?.[index]?.weightage?.message}
                    {...register(`goals.${index}.weightage`, { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex justify-end">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-gray-500 hover:text-accent-red transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Sticky Footer with Weightage Counter */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="pointer-events-auto liquid-glass rounded-full px-8 py-4 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/20">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-500",
                isWeightageValid ? "bg-accent-green/20 text-accent-green shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-accent-red/20 text-accent-red shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              )}>
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Weightage</p>
                <p className={cn(
                  "text-xl font-black transition-colors duration-500",
                  isWeightageValid ? "text-accent-green" : "text-accent-red"
                )}>
                  {totalWeightage}% / 100%
                </p>
              </div>
            </div>

            <GlassButton
              type="submit"
              size="lg"
              className="gap-3 min-w-[200px]"
              disabled={!canSubmit}
              isLoading={isLoading}
            >
              <Save className="w-5 h-5" />
              Submit for Approval
            </GlassButton>
          </div>
        </div>
      </div>
    </form>
  );
}
