"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { CategorySetup } from "./category-setup";
import { FinancialGoals } from "./financial-goals";
import { ProfileSetup } from "./profile-setup";

const steps = [
  { id: 1, title: "Perfil", component: ProfileSetup },
  { id: 2, title: "Categorias", component: CategorySetup },
  { id: 3, title: "Objetivos", component: FinancialGoals },
];

export function OnboardingSteps() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const CurrentStepComponent = steps.find(
    (step) => step.id === currentStep,
  )?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center ${
              step.id === currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`flex size-8 items-center justify-center rounded-full border ${step.id === currentStep ? "border-primary bg-primary/10" : "border-muted"} `}
            >
              {step.id}
            </div>
            <span className="ml-2">{step.title}</span>
          </div>
        ))}
      </div>

      <Card className="p-6">
        {CurrentStepComponent && <CurrentStepComponent onNext={handleNext} />}
      </Card>
    </div>
  );
}
