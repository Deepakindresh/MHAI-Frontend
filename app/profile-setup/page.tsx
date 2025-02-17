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
  type: "personal" | "assessment" | "results";
  fields?: {
    name: string;
    label: string;
    type: string;
    options?: string[];
  }[];
  questions?: {
    id: string;
    text: string;
    options: {
      text: string;
      value: number;
    }[];
  }[];
}

// interface AssessmentResultsProps {
//   scores: {
//     gad_score: number;
//     gad_severity: string;
//     phq_score: number;
//     phq_severity: string;
//     ptsd_positive: boolean;
//     has_suicidal_thoughts: boolean;
//   };
//   onContinue: () => void;
// }

const steps: ProfileStep[] = [
  {
    title: "Personal Information",
    description: "Let's get to know you better",
    type: "personal",
    fields: [
      { name: "full_name", label: "Full Name", type: "text" },
      {
        name: "preferred_name",
        label: "How should the bot call you?",
        type: "text",
      },
      { name: "age", label: "Age", type: "number" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Non-binary", "Prefer not to say"],
      },
      { name: "occupation", label: "Occupation", type: "text" },
      {
        name: "emergency_contact",
        label: "Emergency Contact Number",
        type: "tel",
      },
    ],
  },
  {
    title: "Anxiety Assessment (GAD-7)",
    description:
      "Over the last 2 weeks, how often have you been bothered by the following problems?",
    type: "assessment",
    questions: [
      {
        id: "gad1",
        text: "Feeling nervous, anxious or on edge?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad2",
        text: "Not being able to stop or control worrying?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad3",
        text: "Worrying too much about different things?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad4",
        text: "Trouble relaxing?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad5",
        text: "Being so restless that it is hard to sit still?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad6",
        text: "Becoming easily annoyed or irritable?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "gad7",
        text: "Feeling afraid as if something awful might happen?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
    ],
  },
  {
    title: "Depression Assessment (PHQ-9)",
    description:
      "Over the last 2 weeks, how often have you been bothered by the following problems?",
    type: "assessment",
    questions: [
      {
        id: "phq1",
        text: "Little interest or pleasure in doing things?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq2",
        text: "Feeling down, depressed or hopeless?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq3",
        text: "Trouble falling asleep, staying asleep, or sleeping too much?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq4",
        text: "Feeling tired or having little energy?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq5",
        text: "Poor appetite or overeating?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq6",
        text: "Feeling bad about yourself - or that you're a failure or have let yourself or your family down?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq7",
        text: "Trouble concentrating on things, such as reading the newspaper or watching television?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq8",
        text: "Moving or speaking so slowly that other people could have noticed. Or, the opposite - being so fidgety or restless that you have been moving around a lot more than usual.",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "phq9",
        text: "Thoughts that you would be better off dead or of hurting yourself in some way?",
        options: [
          { text: "Not at all", value: 0 },
          { text: "Several days", value: 1 },
          { text: "More than half the days", value: 2 },
          { text: "Nearly every day", value: 3 },
        ],
      },
    ],
  },
  {
    title: "PTSD Assessment (PC-PTSD-5)",
    description:
      "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire, a physical or sexual assault or abuse, an earthquake or flood, a war, seeing someone be killed or seriously injured, having a loved one die through homicide or suicide.\n\nIn the past month, have you:",
    type: "assessment",
    questions: [
      {
        id: "ptsd1",
        text: "Had nightmares about the event(s) or thought about the event(s) when you did not want to?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
      {
        id: "ptsd2",
        text: "Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
      {
        id: "ptsd3",
        text: "Been constantly on guard, watchful, or easily startled?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
      {
        id: "ptsd4",
        text: "Felt numb or detached from people, activities, or your surroundings?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
      {
        id: "ptsd5",
        text: "Felt guilty or unable to stop blaming yourself or others for the events(s) or any problems the event(s) may have caused?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
    ],
  },
  {
    title: "Additional Assessment",
    description:
      "Please answer this question honestly to help us provide appropriate support.",
    type: "assessment",
    questions: [
      {
        id: "has_suicidal_thoughts",
        text: "Have you ever had thoughts about killing yourself?",
        options: [
          { text: "No", value: 0 },
          { text: "Yes", value: 1 },
        ],
      },
    ],
  },
  {
    title: "Assessment Results",
    description: "Here's a summary of your mental health assessment",
    type: "results",
  },
];

export function AssessmentResults({ scores, onContinue }) {
  const getGADDescription = (severity: string) => {
    switch (severity) {
      case "Minimal":
        return "Your anxiety symptoms are minimal at this time.";
      case "Mild":
        return "You're experiencing mild anxiety symptoms. Consider discussing these with a mental health professional.";
      case "Moderate":
        return "You're experiencing moderate anxiety symptoms. It's recommended to consult with a mental health professional.";
      case "Severe":
        return "You're experiencing severe anxiety symptoms. We strongly recommend seeking professional help.";
      default:
        return "";
    }
  };

  const getPHQDescription = (severity: string) => {
    switch (severity) {
      case "None-minimal":
        return "Your depression symptoms are minimal at this time.";
      case "Mild":
        return "You're experiencing mild depression symptoms. Consider discussing these with a mental health professional.";
      case "Moderate":
        return "You're experiencing moderate depression symptoms. It's recommended to consult with a mental health professional.";
      case "Moderately Severe":
        return "You're experiencing moderately severe depression symptoms. We strongly recommend seeking professional help.";
      case "Severe":
        return "You're experiencing severe depression symptoms. Please seek professional help as soon as possible.";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minimal":
      case "None-minimal":
        return "bg-green-100 text-green-800";
      case "Mild":
        return "bg-yellow-100 text-yellow-800";
      case "Moderate":
        return "bg-orange-100 text-orange-800";
      case "Moderately Severe":
      case "Severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreIndicator = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="h-2.5 rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Assessment Results
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s a summary of your mental health assessment. Remember,
            these results are not a diagnosis.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* GAD-7 Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-950">
              Anxiety Assessment (GAD-7)
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-800">
                  Score: {scores.gad_score}/21
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(
                    scores.gad_severity
                  )}`}
                >
                  {scores.gad_severity}
                </span>
              </div>
              {getScoreIndicator(scores.gad_score, 21)}
            </div>
            <p className="text-gray-700">
              {getGADDescription(scores.gad_severity)}
            </p>
          </div>

          {/* PHQ-9 Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-950">
              Depression Assessment (PHQ-9)
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-800">
                  Score: {scores.phq_score}/27
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(
                    scores.phq_severity
                  )}`}
                >
                  {scores.phq_severity}
                </span>
              </div>
              {getScoreIndicator(scores.phq_score, 27)}
            </div>
            <p className="text-gray-700">
              {getPHQDescription(scores.phq_severity)}
            </p>
          </div>

          {/* PTSD Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-950">
              PTSD Screening (PC-PTSD-5)
            </h2>
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  scores.ptsd_positive
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {scores.ptsd_positive
                  ? "Further Assessment Recommended"
                  : "Screen Negative"}
              </span>
            </div>
            <p className="text-gray-700">
              {scores.ptsd_positive
                ? "Your responses suggest you may benefit from a more detailed PTSD assessment. We recommend discussing these results with a mental health professional."
                : "Your responses do not indicate significant PTSD symptoms at this time."}
            </p>
          </div>
        </div>

        {(scores.phq_severity === "Severe" ||
          scores.gad_severity === "Severe") && (
          <div className="mb-6 bg-red-100 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800">
              Important Notice
            </h3>
            <div className="text-red-700">
              Your responses indicate severe symptoms. We strongly recommend
              seeking professional help. If you&apos;re having thoughts of
              self-harm or suicide, please contact emergency services or a
              crisis helpline immediately:
              <div className="mt-2">
                <strong>National Crisis Helpline:</strong> 988 or 1-800-273-8255
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Remember, these assessments are screening tools and not diagnostic
            instruments. For a proper diagnosis, please consult with a qualified
            mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  const calculateScores = () => {
    const gadScore = Object.entries(formData)
      .filter(([key]) => key.startsWith("gad"))
      .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0);

    const phqScore = Object.entries(formData)
      .filter(([key]) => key.startsWith("phq"))
      .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0);

    const ptsdScore = Object.entries(formData)
      .filter(([key]) => key.startsWith("ptsd"))
      .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0);

    return {
      gad_score: gadScore,
      gad_severity: getGADSeverity(gadScore),
      phq_score: phqScore,
      phq_severity: getPHQSeverity(phqScore),
      ptsd_positive: ptsdScore >= 3,
      has_suicidal_thoughts: formData.has_suicidal_thought === 1,
    };
  };

  const getGADSeverity = (score: number) => {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    return "Severe";
  };

  const getPHQSeverity = (score: number) => {
    if (score <= 4) return "None-minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Moderately Severe";
    return "Severe";
  };

  const [error, setError] = useState<string>("");

  const validateStep = () => {
    const currentStepData = steps[currentStep];

    if (currentStepData.type === "personal") {
      // Required fields for personal information
      const requiredFields = ["full_name", "age", "gender"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        setError(
          "Please fill in all required fields: " +
            missingFields
              .map((field) =>
                field
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              )
              .join(", ")
        );
        return false;
      }
    } else {
      // For assessment steps, check if all questions are answered
      const questions = currentStepData.questions || [];
      const unanswered = questions.filter((q) => formData[q.id] === undefined);

      if (unanswered.length > 0) {
        setError("Please answer all questions before proceeding");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;
      const scores = calculateScores();

      // Save profile data
      await supabase.from("user_profiles").upsert({
        id: userId,
        full_name: formData.full_name,
        preferred_name: formData.preferred_name,
        age: formData.age,
        gender: formData.gender,
        occupation: formData.occupation,
        emergency_contact: formData.emergency_contact,
        role: "user",
      });

      // Save assessment responses and scores
      await supabase.from("mental_health_assessments").insert({
        user_id: userId,
        assessment_date: new Date().toISOString(),
        gad7_score: scores.gad_score,
        gad7_severity: scores.gad_severity,
        phq9_score: scores.phq_score,
        phq9_severity: scores.phq_severity,
        ptsd_positive: scores.ptsd_positive,
        has_suicidal_thoughts: formData.has_suicidal_thoughts === 1,
        raw_responses: formData, // Store individual question responses
      });

      router.push("/");
    }
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderStep = () => {
    const step = steps[currentStep];

    if (step.type === "results") {
      const scores = calculateScores();
      return <AssessmentResults scores={scores} onContinue={handleNext} />;
    }

    if (step.type === "personal") {
      return step.fields?.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            {field.label}
            {(field.name === "full_name" ||
              field.name === "age" ||
              field.name === "gender") && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          {field.type === "select" ? (
            <select
              className={`w-full px-4 py-3 rounded-lg border focus:ring-blue-500 focus:border-blue-500 text-black border-gray-300`}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            >
              <option value="">Select...</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              required={
                field.name === "full_name" ||
                field.name === "age" ||
                field.name === "gender"
              }
              className={`w-full px-4 py-3 rounded-lg border focus:ring-blue-500 focus:border-blue-500 text-black border-gray-300`}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          )}
        </div>
      ));
    }

    return step.questions?.map((question) => (
      <div key={question.id} className="space-y-4 mb-6">
        <p className="text-gray-800 font-medium">{question.text}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <label
              key={option.text}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={formData[question.id] === option.value}
                onChange={(e) =>
                  handleInputChange(question.id, Number(e.target.value))
                }
                className="text-blue-600"
              />
              <span className="text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
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
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
        </div>

        <div className="space-y-6">
          {renderStep()}
          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
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
