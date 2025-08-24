// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // Define the form data type
// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   recentTravel: boolean;
//   hasMedicalCondition: boolean;
//   isPregnant: boolean;
// }

// export const BloodDonationEligibilityForm: React.FC = () => {
//   const { requestId } = useParams<{ requestId: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<EligibilityFormData>({
//     age: null,
//     weight: null,
//     recentTravel: false,
//     hasMedicalCondition: false,
//     isPregnant: false,
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof EligibilityFormData, string>>
//   >({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;

//     setFormData((prev) => {
//       if (type === "checkbox") {
//         if (name === "recentTravel") return { ...prev, recentTravel: checked };
//         if (name === "hasMedicalCondition")
//           return { ...prev, hasMedicalCondition: checked };
//         if (name === "isPregnant") return { ...prev, isPregnant: checked };
//         return prev;
//       }
//       const numValue: number | null = value === "" ? null : Number(value);
//       if (name === "age") return { ...prev, age: numValue };
//       if (name === "weight") return { ...prev, weight: numValue };
//       return prev;
//     });

//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
//     if (formData.age === null) {
//       newErrors.age = "Please enter your age.";
//     } else if (formData.age < 17 || formData.age > 65) {
//       newErrors.age = "You must be between 17 and 65 years old to donate.";
//     }
//     if (formData.weight === null) {
//       newErrors.weight = "Please enter your weight.";
//     } else if (formData.weight < 50) {
//       newErrors.weight = "You must weigh at least 50 kg (110 lbs) to donate.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const isEligible =
//       formData.age !== null &&
//       formData.age >= 17 &&
//       formData.age <= 65 &&
//       formData.weight !== null &&
//       formData.weight >= 50 &&
//       !formData.recentTravel &&
//       !formData.hasMedicalCondition &&
//       !formData.isPregnant;

//     const result = isEligible
//       ? "You are eligible to donate blood! We will now check for nearby donation centers."
//       : "You are not eligible to donate blood at this time due to one or more criteria.";

//     navigate(`/eligibility/${requestId}/result`, {
//       state: { isEligible, formData, result },
//     });
//   };

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Blood Donation <span className="text-[#B02629]">Eligibility</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           Please answer the following questions to determine if you are eligible
//           to donate blood for Request ID: {requestId}.
//         </p>
//         <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-6">
//               <label className="block text-gray-800 font-semibold mb-2">
//                 What is your age?
//               </label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age !== null ? formData.age : ""}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
//                 placeholder="Enter your age"
//                 required
//               />
//               {errors.age && (
//                 <p className="text-red-600 text-sm mt-1">{errors.age}</p>
//               )}
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-800 font-semibold mb-2">
//                 What is your weight (in kg)?
//               </label>
//               <input
//                 type="number"
//                 name="weight"
//                 value={formData.weight !== null ? formData.weight : ""}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
//                 placeholder="Enter your weight in kg"
//                 required
//               />
//               {errors.weight && (
//                 <p className="text-red-600 text-sm mt-1">{errors.weight}</p>
//               )}
//             </div>
//             <div className="mb-6">
//               <label className="flex items-center text-gray-800 font-semibold">
//                 <input
//                   type="checkbox"
//                   name="recentTravel"
//                   checked={formData.recentTravel}
//                   onChange={handleChange}
//                   className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300 rounded"
//                 />
//                 Have you traveled to a high-risk area in the past 12 months?
//               </label>
//             </div>
//             <div className="mb-6">
//               <label className="flex items-center text-gray-800 font-semibold">
//                 <input
//                   type="checkbox"
//                   name="hasMedicalCondition"
//                   checked={formData.hasMedicalCondition}
//                   onChange={handleChange}
//                   className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300 rounded"
//                 />
//                 Do you have any medical conditions (e.g., HIV, recent surgery)?
//               </label>
//             </div>
//             <div className="mb-6">
//               <label className="flex items-center text-gray-800 font-semibold">
//                 <input
//                   type="checkbox"
//                   name="isPregnant"
//                   checked={formData.isPregnant}
//                   onChange={handleChange}
//                   className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300 rounded"
//                 />
//                 Are you pregnant or have you been pregnant in the past 6 months?
//               </label>
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//               >
//                 Check Eligibility
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/blood-requests")}
//                 className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors"
//               >
//                 Back to Requests
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Define the form data type
interface EligibilityFormData {
  age: number | null;
  weight: number | null;
  hemoglobin: number | null;
  goodHealth: "yes" | "no" | null;
  hasFeverOrInfection: "yes" | "no" | null;
  lastWholeBloodDonation: string | null;
  lastPlateletDonation: string | null;
  recentTattooOrPiercing: "yes" | "no" | null;
  isPregnantOrBreastfeeding: "yes" | "no" | null;
  recentSurgeryOrTransfusion: "yes" | "no" | null;
  recentVaccination: "yes" | "no" | null;
  recentAntibiotics: "yes" | "no" | null;
  recentDentalExtraction: "yes" | "no" | null;
  menstruationWeakness: "yes" | "no" | null;
  travelMalariaArea: "yes" | "no" | null;
  hasChronicDisease: "yes" | "no" | null;
  hasHepatitisOrHIV: "yes" | "no" | null;
  intravenousDrugUse: "yes" | "no" | null;
  highRiskSexualBehavior: "yes" | "no" | null;
}

export const BloodDonationEligibilityForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Changed from requestId to id
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EligibilityFormData>({
    age: null,
    weight: null,
    hemoglobin: null,
    goodHealth: null,
    hasFeverOrInfection: null,
    lastWholeBloodDonation: null,
    lastPlateletDonation: null,
    recentTattooOrPiercing: null,
    isPregnantOrBreastfeeding: null,
    recentSurgeryOrTransfusion: null,
    recentVaccination: null,
    recentAntibiotics: null,
    recentDentalExtraction: null,
    menstruationWeakness: null,
    travelMalariaArea: null,
    hasChronicDisease: null,
    hasHepatitisOrHIV: null,
    intravenousDrugUse: null,
    highRiskSexualBehavior: null,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof EligibilityFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "weight" || name === "hemoglobin"
          ? value === ""
            ? null
            : Number(value)
          : value || null,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
    if (!id) {
      newErrors.age = "Invalid request ID.";
    }
    if (formData.age === null) {
      newErrors.age = "Please enter your age.";
    } else if (formData.age < 18 || formData.age > 60) {
      newErrors.age = "You must be between 18 and 60 years old to donate.";
    }
    if (formData.weight === null) {
      newErrors.weight = "Please enter your weight.";
    } else if (formData.weight < 45) {
      newErrors.weight = "You must weigh at least 45 kg (100 lbs) to donate.";
    }
    if (formData.hemoglobin !== null && formData.hemoglobin < 12.5) {
      newErrors.hemoglobin = "Your hemoglobin must be at least 12.5 g/dL.";
    }
    if (formData.goodHealth === null) {
      newErrors.goodHealth = "Please select whether you are in good health.";
    } else if (formData.goodHealth === "no") {
      newErrors.goodHealth = "You must be in good general health to donate.";
    }
    if (formData.hasFeverOrInfection === null) {
      newErrors.hasFeverOrInfection = "Please select an option.";
    }
    if (formData.recentTattooOrPiercing === null) {
      newErrors.recentTattooOrPiercing = "Please select an option.";
    }
    if (formData.isPregnantOrBreastfeeding === null) {
      newErrors.isPregnantOrBreastfeeding = "Please select an option.";
    }
    if (formData.recentSurgeryOrTransfusion === null) {
      newErrors.recentSurgeryOrTransfusion = "Please select an option.";
    }
    if (formData.recentVaccination === null) {
      newErrors.recentVaccination = "Please select an option.";
    }
    if (formData.recentAntibiotics === null) {
      newErrors.recentAntibiotics = "Please select an option.";
    }
    if (formData.recentDentalExtraction === null) {
      newErrors.recentDentalExtraction = "Please select an option.";
    }
    if (formData.menstruationWeakness === null) {
      newErrors.menstruationWeakness = "Please select an option.";
    }
    if (formData.travelMalariaArea === null) {
      newErrors.travelMalariaArea = "Please select an option.";
    }
    if (formData.hasChronicDisease === null) {
      newErrors.hasChronicDisease = "Please select an option.";
    }
    if (formData.hasHepatitisOrHIV === null) {
      newErrors.hasHepatitisOrHIV = "Please select an option.";
    }
    if (formData.intravenousDrugUse === null) {
      newErrors.intravenousDrugUse = "Please select an option.";
    }
    if (formData.highRiskSexualBehavior === null) {
      newErrors.highRiskSexualBehavior = "Please select an option.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) {
      if (!id) {
        setErrors((prev) => ({
          ...prev,
          age: "Invalid request ID. Please access this form from a valid blood request.",
        }));
      }
      return;
    }

    const isEligible =
      formData.age !== null &&
      formData.age >= 18 &&
      formData.age <= 60 &&
      formData.weight !== null &&
      formData.weight >= 45 &&
      (formData.hemoglobin === null || formData.hemoglobin >= 12.5) &&
      formData.goodHealth === "yes" &&
      formData.hasFeverOrInfection === "no" &&
      (formData.lastWholeBloodDonation === null ||
        new Date(formData.lastWholeBloodDonation) <=
          new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000)) &&
      (formData.lastPlateletDonation === null ||
        new Date(formData.lastPlateletDonation) <=
          new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) &&
      formData.recentTattooOrPiercing === "no" &&
      formData.isPregnantOrBreastfeeding === "no" &&
      formData.recentSurgeryOrTransfusion === "no" &&
      formData.recentVaccination === "no" &&
      formData.recentAntibiotics === "no" &&
      formData.recentDentalExtraction === "no" &&
      formData.menstruationWeakness === "no" &&
      formData.travelMalariaArea === "no" &&
      formData.hasChronicDisease === "no" &&
      formData.hasHepatitisOrHIV === "no" &&
      formData.intravenousDrugUse === "no" &&
      formData.highRiskSexualBehavior === "no";

    const result = isEligible
      ? "You are eligible to donate blood! We will now check for nearby donation centers."
      : "You are not eligible to donate blood at this time due to one or more criteria.";

    navigate(`/donor/eligibility/${id}/result`, {
      state: { isEligible, formData, result },
    });
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Blood Donation <span className="text-[#B02629]">Eligibility</span>
        </h1>
        <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-10">
          Please answer the following questions to determine if you are eligible
          to donate blood for Request ID: {id}.
        </p>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                What is your age?
              </label>
              <input
                type="number"
                name="age"
                value={formData.age !== null ? formData.age : ""}
                onChange={handleChange}
                className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
                placeholder="Enter your age"
                required
              />
              {errors.age && (
                <p className="text-red-600 text-sm mt-2">{errors.age}</p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                What is your weight (in kg)?
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight !== null ? formData.weight : ""}
                onChange={handleChange}
                className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
                placeholder="Enter your weight in kg"
                required
              />
              {errors.weight && (
                <p className="text-red-600 text-sm mt-2">{errors.weight}</p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                What is your hemoglobin level (g/dL)? (Leave blank if unknown)
              </label>
              <input
                type="number"
                step="0.1"
                name="hemoglobin"
                value={formData.hemoglobin !== null ? formData.hemoglobin : ""}
                onChange={handleChange}
                className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
                placeholder="Enter hemoglobin level (e.g., 12.5)"
              />
              {errors.hemoglobin && (
                <p className="text-red-600 text-sm mt-2">{errors.hemoglobin}</p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Are you in good general health?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="goodHealth"
                    value="yes"
                    checked={formData.goodHealth === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="goodHealth"
                    value="no"
                    checked={formData.goodHealth === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.goodHealth && (
                <p className="text-red-600 text-sm mt-2">{errors.goodHealth}</p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Do you have a fever, infection, or flu-like symptoms?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasFeverOrInfection"
                    value="yes"
                    checked={formData.hasFeverOrInfection === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasFeverOrInfection"
                    value="no"
                    checked={formData.hasFeverOrInfection === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.hasFeverOrInfection && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.hasFeverOrInfection}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                When was your last whole blood donation? (Leave blank if none)
              </label>
              <input
                type="date"
                name="lastWholeBloodDonation"
                value={formData.lastWholeBloodDonation || ""}
                onChange={handleChange}
                className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                When was your last platelet donation? (Leave blank if none)
              </label>
              <input
                type="date"
                name="lastPlateletDonation"
                value={formData.lastPlateletDonation || ""}
                onChange={handleChange}
                className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you had a tattoo or piercing in the past 6 months?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentTattooOrPiercing"
                    value="yes"
                    checked={formData.recentTattooOrPiercing === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentTattooOrPiercing"
                    value="no"
                    checked={formData.recentTattooOrPiercing === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.recentTattooOrPiercing && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.recentTattooOrPiercing}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Are you pregnant or breastfeeding (in the past 6 months)?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPregnantOrBreastfeeding"
                    value="yes"
                    checked={formData.isPregnantOrBreastfeeding === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPregnantOrBreastfeeding"
                    value="no"
                    checked={formData.isPregnantOrBreastfeeding === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.isPregnantOrBreastfeeding && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.isPregnantOrBreastfeeding}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you had major surgery or a blood transfusion in the past
                6–12 months?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentSurgeryOrTransfusion"
                    value="yes"
                    checked={formData.recentSurgeryOrTransfusion === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentSurgeryOrTransfusion"
                    value="no"
                    checked={formData.recentSurgeryOrTransfusion === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.recentSurgeryOrTransfusion && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.recentSurgeryOrTransfusion}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you had a vaccination in the past 2–4 weeks?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentVaccination"
                    value="yes"
                    checked={formData.recentVaccination === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentVaccination"
                    value="no"
                    checked={formData.recentVaccination === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.recentVaccination && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.recentVaccination}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you used antibiotics or had an infection in the past 2
                weeks?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentAntibiotics"
                    value="yes"
                    checked={formData.recentAntibiotics === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentAntibiotics"
                    value="no"
                    checked={formData.recentAntibiotics === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.recentAntibiotics && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.recentAntibiotics}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you had a dental extraction in the past 1 week?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentDentalExtraction"
                    value="yes"
                    checked={formData.recentDentalExtraction === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recentDentalExtraction"
                    value="no"
                    checked={formData.recentDentalExtraction === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.recentDentalExtraction && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.recentDentalExtraction}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Are you menstruating and feeling weak or anemic?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="menstruationWeakness"
                    value="yes"
                    checked={formData.menstruationWeakness === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="menstruationWeakness"
                    value="no"
                    checked={formData.menstruationWeakness === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.menstruationWeakness && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.menstruationWeakness}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you traveled to a malaria-prone area in the past 6 months?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelMalariaArea"
                    value="yes"
                    checked={formData.travelMalariaArea === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelMalariaArea"
                    value="no"
                    checked={formData.travelMalariaArea === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.travelMalariaArea && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.travelMalariaArea}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Do you have chronic diseases (e.g., diabetes, cancer, epilepsy,
                heart disease, severe asthma)?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasChronicDisease"
                    value="yes"
                    checked={formData.hasChronicDisease === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasChronicDisease"
                    value="no"
                    checked={formData.hasChronicDisease === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.hasChronicDisease && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.hasChronicDisease}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you tested positive for Hepatitis B, Hepatitis C, or
                HIV/AIDS?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHepatitisOrHIV"
                    value="yes"
                    checked={formData.hasHepatitisOrHIV === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHepatitisOrHIV"
                    value="no"
                    checked={formData.hasHepatitisOrHIV === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.hasHepatitisOrHIV && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.hasHepatitisOrHIV}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you ever used intravenous drugs?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="intravenousDrugUse"
                    value="yes"
                    checked={formData.intravenousDrugUse === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="intravenousDrugUse"
                    value="no"
                    checked={formData.intravenousDrugUse === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.intravenousDrugUse && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.intravenousDrugUse}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-800 font-semibold text-lg mb-2">
                Have you engaged in high-risk sexual behavior?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="highRiskSexualBehavior"
                    value="yes"
                    checked={formData.highRiskSexualBehavior === "yes"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="highRiskSexualBehavior"
                    value="no"
                    checked={formData.highRiskSexualBehavior === "no"}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
                  />
                  No
                </label>
              </div>
              {errors.highRiskSexualBehavior && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.highRiskSexualBehavior}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-3 rounded-full transition-colors text-lg"
              >
                Check Eligibility
              </button>
              <button
                type="button"
                onClick={() => navigate("/donor/bloodRequestsPage")}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full transition-colors text-lg"
              >
                Back to Requests
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
