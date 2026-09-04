import { CircleCheck } from "lucide-react";
import { formatCurrency } from "../lib/format";
import type { EmiPlan } from "../types";

type Props = {
  plan: EmiPlan;
  selected: boolean;
  onSelect: () => void;
};

export function EmiPlanCard({ plan, selected, onSelect }: Props) {
  return (
    <label
      className={`relative grid cursor-pointer grid-cols-[4.5rem_1fr] border p-4 transition-colors duration-200 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center ${
        selected ? "border-blue bg-blue/[0.04]" : "border-ink/20 hover:border-ink/50"
      }`}
    >
      <input
        className="sr-only"
        type="radio"
        name="emi-plan"
        value={plan.id}
        checked={selected}
        aria-label={`${plan.tenureMonths} month plan, ${formatCurrency(plan.monthlyPayment)} per month`}
        onChange={onSelect}
      />
      <div className="border-r border-ink/15 pr-4">
        <span className="block text-4xl font-bold leading-none tracking-[-0.07em] text-blue sm:text-5xl">{plan.tenureMonths}</span>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink/55">months</span>
      </div>
      <div className="pl-4">
        <p className="text-xl font-bold tracking-tight">
          {formatCurrency(plan.monthlyPayment)} <span className="text-sm font-normal text-ink/60">per month</span>
        </p>
        <p className="mt-1 text-sm text-ink/65">
          {plan.interestRate === 0 ? "No-cost EMI" : `${plan.interestRate}% annual interest`} · {plan.fundPartner.name}
        </p>
        {plan.cashbackAmount !== null && (
          <p className="mt-2 text-sm font-bold text-blue">{formatCurrency(plan.cashbackAmount)} cashback</p>
        )}
      </div>
      <CircleCheck
        className={`absolute right-3 top-3 sm:static ${selected ? "text-blue" : "text-ink/20"}`}
        aria-hidden="true"
        size={22}
      />
    </label>
  );
}
