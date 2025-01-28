// app/profile-setup/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProfileStep {
  title: string;
  description: string;
  fields: {
    name: string;
    preferred_name?: string;
    label: string;
    type: string;
    options?: string[];
  }[];
}

const steps: ProfileStep[] = [
  {
    title: "Personal Information",
    description: "Let's get to know you better",
    fields: [
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "age", label: "Age", type: "number" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Non-binary", "Prefer not to say"],
      },
      { name: "occupation", label: "Occupation", type: "text" },
    ],
  },
  {
    title: "Depression Assessment",
    description: "Help us understand your experience with depression",
    fields: [
      {
        name: "depression_level",
        label:
          "On a scale of 0-10, how would you rate your depression symptoms?",
        type: "range",
      },
    ],
  },
  {
    title: "PTSD Assessment",
    description: "Help us understand your experience with PTSD",
    fields: [
      {
        name: "ptsd_level",
        label: "On a scale of 0-10, how would you rate your PTSD symptoms?",
        type: "range",
      },
    ],
  },
  {
    title: "Anxiety Assessment",
    description: "Help us understand your experience with anxiety",
    fields: [
      {
        name: "anxiety_level",
        label: "On a scale of 0-10, how would you rate your anxiety symptoms?",
        type: "range",
      },
    ],
  },
  {
    title: "Emergency Contact",
    description: "In case we need to reach someone",
    fields: [
      {
        name: "emergency_contact",
        label: "Emergency Contact Number",
        type: "tel",
      },
    ],
  },
];

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save all data
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // Save profile data
      await supabase.from("user_profiles").upsert({
        id: userId,
        full_name: formData.full_name,
        age: formData.age,
        gender: formData.gender,
        occupation: formData.occupation,
        emergency_contact: formData.emergency_contact,
      });

      // Save mental health assessment
      await supabase.from("mental_health_assessments").insert({
        user_id: userId,
        depression_level: formData.depression_level,
        ptsd_level: formData.ptsd_level,
        anxiety_level: formData.anxiety_level,
      });

      router.push("/");
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mt-2">{currentStepData.description}</p>
        </div>

        <div className="space-y-6">
          {currentStepData.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  className="w-full px-4 py-3 rounded-lg border text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "range" ? (
                <div className="space-y-2 text-black">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    className="w-full"
                    value={formData[field.name] || 0}
                    onChange={(e) =>
                      handleInputChange(field.name, parseInt(e.target.value))
                    }
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                  <div className="text-center text-lg font-medium">
                    {formData[field.name] || 0}
                  </div>
                </div>
              ) : (
                <input
                  type={field.type}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
