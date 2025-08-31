// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // Define the form data type
// interface EligibilityFormData {
//   gender: "male" | "female" | null;
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// export const BloodDonationEligibilityForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<EligibilityFormData>({
//     gender: null,
//     age: null,
//     weight: null,
//     hemoglobin: null,
//     goodHealth: null,
//     hasFeverOrInfection: null,
//     lastWholeBloodDonation: null,
//     lastPlateletDonation: null,
//     recentTattooOrPiercing: null,
//     isPregnantOrBreastfeeding: null,
//     recentSurgeryOrTransfusion: null,
//     recentVaccination: null,
//     recentAntibiotics: null,
//     recentDentalExtraction: null,
//     menstruationWeakness: null,
//     travelMalariaArea: null,
//     hasChronicDisease: null,
//     hasHepatitisOrHIV: null,
//     intravenousDrugUse: null,
//     highRiskSexualBehavior: null,
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof EligibilityFormData, string>>
//   >({});

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "age" || name === "weight" || name === "hemoglobin"
//           ? value === ""
//             ? null
//             : Number(value)
//           : value || null,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
//     if (!id) {
//       newErrors.age = "Invalid request ID.";
//     }
//     if (formData.gender === null) {
//       newErrors.gender = "Please select your gender.";
//     }
//     if (formData.age === null) {
//       newErrors.age = "Please enter your age.";
//     } else if (formData.age < 18 || formData.age > 60) {
//       newErrors.age = "You must be between 18 and 60 years old to donate.";
//     }
//     if (formData.weight === null) {
//       newErrors.weight = "Please enter your weight.";
//     } else if (formData.weight < 45) {
//       newErrors.weight = "You must weigh at least 45 kg (100 lbs) to donate.";
//     }
//     if (formData.hemoglobin !== null && formData.hemoglobin < 12.5) {
//       newErrors.hemoglobin = "Your hemoglobin must be at least 12.5 g/dL.";
//     }
//     if (formData.goodHealth === null) {
//       newErrors.goodHealth = "Please select whether you are in good health.";
//     } else if (formData.goodHealth === "no") {
//       newErrors.goodHealth = "You must be in good general health to donate.";
//     }
//     if (formData.hasFeverOrInfection === null) {
//       newErrors.hasFeverOrInfection = "Please select an option.";
//     }
//     if (formData.recentTattooOrPiercing === null) {
//       newErrors.recentTattooOrPiercing = "Please select an option.";
//     }
//     if (
//       formData.gender === "female" &&
//       formData.isPregnantOrBreastfeeding === null
//     ) {
//       newErrors.isPregnantOrBreastfeeding = "Please select an option.";
//     }
//     if (formData.recentSurgeryOrTransfusion === null) {
//       newErrors.recentSurgeryOrTransfusion = "Please select an option.";
//     }
//     if (formData.recentVaccination === null) {
//       newErrors.recentVaccination = "Please select an option.";
//     }
//     if (formData.recentAntibiotics === null) {
//       newErrors.recentAntibiotics = "Please select an option.";
//     }
//     if (formData.recentDentalExtraction === null) {
//       newErrors.recentDentalExtraction = "Please select an option.";
//     }
//     if (
//       formData.gender === "female" &&
//       formData.menstruationWeakness === null
//     ) {
//       newErrors.menstruationWeakness = "Please select an option.";
//     }
//     if (formData.travelMalariaArea === null) {
//       newErrors.travelMalariaArea = "Please select an option.";
//     }
//     if (formData.hasChronicDisease === null) {
//       newErrors.hasChronicDisease = "Please select an option.";
//     }
//     if (formData.hasHepatitisOrHIV === null) {
//       newErrors.hasHepatitisOrHIV = "Please select an option.";
//     }
//     if (formData.intravenousDrugUse === null) {
//       newErrors.intravenousDrugUse = "Please select an option.";
//     }
//     if (formData.highRiskSexualBehavior === null) {
//       newErrors.highRiskSexualBehavior = "Please select an option.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm() || !id) {
//       if (!id) {
//         setErrors((prev) => ({
//           ...prev,
//           age: "Invalid request ID. Please access this form from a valid blood request.",
//         }));
//       }
//       return;
//     }

//     const isEligible =
//       formData.age !== null &&
//       formData.age >= 18 &&
//       formData.age <= 60 &&
//       formData.weight !== null &&
//       formData.weight >= 45 &&
//       (formData.hemoglobin === null || formData.hemoglobin >= 12.5) &&
//       formData.goodHealth === "yes" &&
//       formData.hasFeverOrInfection === "no" &&
//       (formData.lastWholeBloodDonation === null ||
//         new Date(formData.lastWholeBloodDonation) <=
//           new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000)) &&
//       (formData.lastPlateletDonation === null ||
//         new Date(formData.lastPlateletDonation) <=
//           new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) &&
//       formData.recentTattooOrPiercing === "no" &&
//       (formData.gender !== "female" ||
//         formData.isPregnantOrBreastfeeding === "no") &&
//       formData.recentSurgeryOrTransfusion === "no" &&
//       formData.recentVaccination === "no" &&
//       formData.recentAntibiotics === "no" &&
//       formData.recentDentalExtraction === "no" &&
//       (formData.gender !== "female" ||
//         formData.menstruationWeakness === "no") &&
//       formData.travelMalariaArea === "no" &&
//       formData.hasChronicDisease === "no" &&
//       formData.hasHepatitisOrHIV === "no" &&
//       formData.intravenousDrugUse === "no" &&
//       formData.highRiskSexualBehavior === "no";

//     const result = isEligible
//       ? "You are eligible to donate blood! We will now check for nearby donation centers."
//       : "You are not eligible to donate blood at this time due to one or more criteria.";

//     navigate(`/donor/eligibility/${id}/result`, {
//       state: { isEligible, formData, result },
//     });
//   };

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
//           Blood Donation <span className="text-[#B02629]">Eligibility</span>
//         </h1>
//         <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-10">
//           Please answer the following questions to determine if you are eligible
//           to donate blood for Request ID: {id}.
//         </p>
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 What is your gender?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="male"
//                     checked={formData.gender === "male"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Male
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="female"
//                     checked={formData.gender === "female"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Female
//                 </label>
//               </div>
//               {errors.gender && (
//                 <p className="text-red-600 text-sm mt-2">{errors.gender}</p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 What is your age?
//               </label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age !== null ? formData.age : ""}
//                 onChange={handleChange}
//                 className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                 placeholder="Enter your age"
//                 required
//               />
//               {errors.age && (
//                 <p className="text-red-600 text-sm mt-2">{errors.age}</p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 What is your weight (in kg)?
//               </label>
//               <input
//                 type="number"
//                 name="weight"
//                 value={formData.weight !== null ? formData.weight : ""}
//                 onChange={handleChange}
//                 className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                 placeholder="Enter your weight in kg"
//                 required
//               />
//               {errors.weight && (
//                 <p className="text-red-600 text-sm mt-2">{errors.weight}</p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 What is your hemoglobin level (g/dL)? (Leave blank if unknown)
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 name="hemoglobin"
//                 value={formData.hemoglobin !== null ? formData.hemoglobin : ""}
//                 onChange={handleChange}
//                 className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                 placeholder="Enter hemoglobin level (e.g., 12.5)"
//               />
//               {errors.hemoglobin && (
//                 <p className="text-red-600 text-sm mt-2">{errors.hemoglobin}</p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Are you in good general health?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="goodHealth"
//                     value="yes"
//                     checked={formData.goodHealth === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="goodHealth"
//                     value="no"
//                     checked={formData.goodHealth === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.goodHealth && (
//                 <p className="text-red-600 text-sm mt-2">{errors.goodHealth}</p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Do you have a fever, infection, or flu-like symptoms?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasFeverOrInfection"
//                     value="yes"
//                     checked={formData.hasFeverOrInfection === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasFeverOrInfection"
//                     value="no"
//                     checked={formData.hasFeverOrInfection === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.hasFeverOrInfection && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.hasFeverOrInfection}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 When was your last whole blood donation? (Leave blank if none)
//               </label>
//               <input
//                 type="date"
//                 name="lastWholeBloodDonation"
//                 value={formData.lastWholeBloodDonation || ""}
//                 onChange={handleChange}
//                 className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//               />
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 When was your last platelet donation? (Leave blank if none)
//               </label>
//               <input
//                 type="date"
//                 name="lastPlateletDonation"
//                 value={formData.lastPlateletDonation || ""}
//                 onChange={handleChange}
//                 className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//               />
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you had a tattoo or piercing in the past 6 months?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentTattooOrPiercing"
//                     value="yes"
//                     checked={formData.recentTattooOrPiercing === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentTattooOrPiercing"
//                     value="no"
//                     checked={formData.recentTattooOrPiercing === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.recentTattooOrPiercing && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.recentTattooOrPiercing}
//                 </p>
//               )}
//             </div>
//             {formData.gender === "female" && (
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Are you pregnant or breastfeeding (in the past 6 months)?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isPregnantOrBreastfeeding"
//                       value="yes"
//                       checked={formData.isPregnantOrBreastfeeding === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isPregnantOrBreastfeeding"
//                       value="no"
//                       checked={formData.isPregnantOrBreastfeeding === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.isPregnantOrBreastfeeding && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.isPregnantOrBreastfeeding}
//                   </p>
//                 )}
//               </div>
//             )}
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you had major surgery or a blood transfusion in the past
//                 6–12 months?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentSurgeryOrTransfusion"
//                     value="yes"
//                     checked={formData.recentSurgeryOrTransfusion === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentSurgeryOrTransfusion"
//                     value="no"
//                     checked={formData.recentSurgeryOrTransfusion === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.recentSurgeryOrTransfusion && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.recentSurgeryOrTransfusion}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you had a vaccination in the past 2–4 weeks?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentVaccination"
//                     value="yes"
//                     checked={formData.recentVaccination === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentVaccination"
//                     value="no"
//                     checked={formData.recentVaccination === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.recentVaccination && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.recentVaccination}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you used antibiotics or had an infection in the past 2
//                 weeks?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentAntibiotics"
//                     value="yes"
//                     checked={formData.recentAntibiotics === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentAntibiotics"
//                     value="no"
//                     checked={formData.recentAntibiotics === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.recentAntibiotics && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.recentAntibiotics}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you had a dental extraction in the past 1 week?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentDentalExtraction"
//                     value="yes"
//                     checked={formData.recentDentalExtraction === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="recentDentalExtraction"
//                     value="no"
//                     checked={formData.recentDentalExtraction === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.recentDentalExtraction && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.recentDentalExtraction}
//                 </p>
//               )}
//             </div>
//             {formData.gender === "female" && (
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Are you menstruating and feeling weak or anemic?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="menstruationWeakness"
//                       value="yes"
//                       checked={formData.menstruationWeakness === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="menstruationWeakness"
//                       value="no"
//                       checked={formData.menstruationWeakness === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.menstruationWeakness && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.menstruationWeakness}
//                   </p>
//                 )}
//               </div>
//             )}
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you traveled to a malaria-prone area in the past 6 months?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="travelMalariaArea"
//                     value="yes"
//                     checked={formData.travelMalariaArea === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="travelMalariaArea"
//                     value="no"
//                     checked={formData.travelMalariaArea === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.travelMalariaArea && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.travelMalariaArea}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Do you have chronic diseases (e.g., diabetes, cancer, epilepsy,
//                 heart disease, severe asthma)?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasChronicDisease"
//                     value="yes"
//                     checked={formData.hasChronicDisease === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasChronicDisease"
//                     value="no"
//                     checked={formData.hasChronicDisease === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.hasChronicDisease && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.hasChronicDisease}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you tested positive for Hepatitis B, Hepatitis C, or
//                 HIV/AIDS?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasHepatitisOrHIV"
//                     value="yes"
//                     checked={formData.hasHepatitisOrHIV === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="hasHepatitisOrHIV"
//                     value="no"
//                     checked={formData.hasHepatitisOrHIV === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.hasHepatitisOrHIV && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.hasHepatitisOrHIV}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you ever used intravenous drugs?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="intravenousDrugUse"
//                     value="yes"
//                     checked={formData.intravenousDrugUse === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="intravenousDrugUse"
//                     value="no"
//                     checked={formData.intravenousDrugUse === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.intravenousDrugUse && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.intravenousDrugUse}
//                 </p>
//               )}
//             </div>
//             <div className="mb-8">
//               <label className="block text-gray-800 font-semibold text-lg mb-2">
//                 Have you engaged in high-risk sexual behavior?
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="highRiskSexualBehavior"
//                     value="yes"
//                     checked={formData.highRiskSexualBehavior === "yes"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="highRiskSexualBehavior"
//                     value="no"
//                     checked={formData.highRiskSexualBehavior === "no"}
//                     onChange={handleChange}
//                     className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                   />
//                   No
//                 </label>
//               </div>
//               {errors.highRiskSexualBehavior && (
//                 <p className="text-red-600 text-sm mt-2">
//                   {errors.highRiskSexualBehavior}
//                 </p>
//               )}
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-3 rounded-full transition-colors text-lg"
//               >
//                 Check Eligibility
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/donor/bloodRequestsPage")}
//                 className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full transition-colors text-lg"
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







// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
//   gender?: string;
// }

// export const BloodDonationEligibilityForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<EligibilityFormData>({
//     age: null,
//     weight: null,
//     hemoglobin: null,
//     goodHealth: null,
//     hasFeverOrInfection: null,
//     lastWholeBloodDonation: null,
//     lastPlateletDonation: null,
//     recentTattooOrPiercing: null,
//     isPregnantOrBreastfeeding: null,
//     recentSurgeryOrTransfusion: null,
//     recentVaccination: null,
//     recentAntibiotics: null,
//     recentDentalExtraction: null,
//     menstruationWeakness: null,
//     travelMalariaArea: null,
//     hasChronicDisease: null,
//     hasHepatitisOrHIV: null,
//     intravenousDrugUse: null,
//     highRiskSexualBehavior: null,
//   });
//   const [gender, setGender] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof EligibilityFormData, string>>
//   >({});

//   useEffect(() => {
//     const fetchDonorProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get<Donor>(
//           `http://localhost:9095/donors/profile`,
//           { withCredentials: true }
//         );
//         console.log("Fetched profile data:", response.data);
//         const rawGender = response.data.gender || null;
//         console.log("Raw gender value:", rawGender);
//         const normalizedGender = rawGender ? rawGender.toLowerCase() : null;
//         console.log("Normalized gender value:", normalizedGender);
//         setGender(normalizedGender);
//         setFormData((prev) => ({
//           ...prev,
//           lastWholeBloodDonation: response.data.last_donation_date || null,
//         }));
//       } catch (err: any) {
//         console.error("Error fetching profile:", err);
//         if (
//           err.response?.status === 500 &&
//           err.response?.data?.message.includes("Authentication required")
//         ) {
//           window.location.href = "/login";
//         } else {
//           setErrors((prev) => ({
//             ...prev,
//             age: "Failed to load profile data. Please try again.",
//           }));
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDonorProfile();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "age" || name === "weight" || name === "hemoglobin"
//           ? value === ""
//             ? null
//             : Number(value)
//           : value || null,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
//     if (!id) {
//       newErrors.age = "Invalid request ID.";
//     }
//     if (gender === null) {
//       newErrors.age =
//         "Gender information is missing. Please update your profile in the Profile section.";
//     } else if (gender !== "male" && gender !== "female") {
//       newErrors.age = `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`;
//     }
//     if (formData.age === null) {
//       newErrors.age = "Please enter your age.";
//     } else if (formData.age < 18 || formData.age > 60) {
//       newErrors.age = "You must be between 18 and 60 years old to donate.";
//     }
//     if (formData.weight === null) {
//       newErrors.weight = "Please enter your weight.";
//     } else if (formData.weight < 45) {
//       newErrors.weight = "You must weigh at least 45 kg (100 lbs) to donate.";
//     }
//     if (formData.hemoglobin !== null && formData.hemoglobin < 12.5) {
//       newErrors.hemoglobin = "Your hemoglobin must be at least 12.5 g/dL.";
//     }
//     if (formData.goodHealth === null) {
//       newErrors.goodHealth = "Please select whether you are in good health.";
//     } else if (formData.goodHealth === "no") {
//       newErrors.goodHealth = "You must be in good general health to donate.";
//     }
//     if (formData.hasFeverOrInfection === null) {
//       newErrors.hasFeverOrInfection = "Please select an option.";
//     }
//     if (formData.recentTattooOrPiercing === null) {
//       newErrors.recentTattooOrPiercing = "Please select an option.";
//     }
//     if (gender === "female" && formData.isPregnantOrBreastfeeding === null) {
//       newErrors.isPregnantOrBreastfeeding = "Please select an option.";
//     }
//     if (formData.recentSurgeryOrTransfusion === null) {
//       newErrors.recentSurgeryOrTransfusion = "Please select an option.";
//     }
//     if (formData.recentVaccination === null) {
//       newErrors.recentVaccination = "Please select an option.";
//     }
//     if (formData.recentAntibiotics === null) {
//       newErrors.recentAntibiotics = "Please select an option.";
//     }
//     if (formData.recentDentalExtraction === null) {
//       newErrors.recentDentalExtraction = "Please select an option.";
//     }
//     if (gender === "female" && formData.menstruationWeakness === null) {
//       newErrors.menstruationWeakness = "Please select an option.";
//     }
//     if (formData.travelMalariaArea === null) {
//       newErrors.travelMalariaArea = "Please select an option.";
//     }
//     if (formData.hasChronicDisease === null) {
//       newErrors.hasChronicDisease = "Please select an option.";
//     }
//     if (formData.hasHepatitisOrHIV === null) {
//       newErrors.hasHepatitisOrHIV = "Please select an option.";
//     }
//     if (formData.intravenousDrugUse === null) {
//       newErrors.intravenousDrugUse = "Please select an option.";
//     }
//     if (formData.highRiskSexualBehavior === null) {
//       newErrors.highRiskSexualBehavior = "Please select an option.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form data on submit:", formData);
//     console.log("Gender on submit:", gender);
//     if (!validateForm() || !id) {
//       if (!id) {
//         setErrors((prev) => ({
//           ...prev,
//           age: "Invalid request ID. Please access this form from a valid blood request.",
//         }));
//       }
//       return;
//     }

//     // Debug eligibility criteria
//     const eligibilityCriteria = {
//       ageValid:
//         formData.age !== null && formData.age >= 18 && formData.age <= 60,
//       weightValid: formData.weight !== null && formData.weight >= 45,
//       hemoglobinValid:
//         formData.hemoglobin === null || formData.hemoglobin >= 12.5,
//       goodHealthValid: formData.goodHealth === "yes",
//       noFeverOrInfection: formData.hasFeverOrInfection === "no",
//       wholeBloodDonationValid:
//         formData.lastWholeBloodDonation === null ||
//         new Date(formData.lastWholeBloodDonation) <=
//           new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
//       plateletDonationValid:
//         formData.lastPlateletDonation === null ||
//         new Date(formData.lastPlateletDonation) <=
//           new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//       noRecentTattoo: formData.recentTattooOrPiercing === "no",
//       notPregnantOrBreastfeeding:
//         gender !== "female" || formData.isPregnantOrBreastfeeding === "no",
//       noRecentSurgery: formData.recentSurgeryOrTransfusion === "no",
//       noRecentVaccination: formData.recentVaccination === "no",
//       noRecentAntibiotics: formData.recentAntibiotics === "no",
//       noRecentDentalExtraction: formData.recentDentalExtraction === "no",
//       noMenstruationWeakness:
//         gender !== "female" || formData.menstruationWeakness === "no",
//       noTravelMalaria: formData.travelMalariaArea === "no",
//       noChronicDisease: formData.hasChronicDisease === "no",
//       noHepatitisOrHIV: formData.hasHepatitisOrHIV === "no",
//       noIntravenousDrugUse: formData.intravenousDrugUse === "no",
//       noHighRiskSexualBehavior: formData.highRiskSexualBehavior === "no",
//     };
//     console.log("Eligibility criteria:", eligibilityCriteria);

//     const isEligible = Object.values(eligibilityCriteria).every(
//       (criterion) => criterion
//     );
//     console.log("Is eligible:", isEligible);

//     let failedCriteria: string[] = [];
//     if (!isEligible) {
//       failedCriteria = Object.entries(eligibilityCriteria)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       console.log("Failed criteria:", failedCriteria);
//     }

//     const result = isEligible
//       ? "You are eligible to donate blood! We will now check for nearby donation centers."
//       : "You are not eligible to donate blood at this time due to one or more criteria. Check console for failed criteria.";

//     navigate(`/donor/eligibility/${id}/result`, {
//       state: { isEligible, formData, result, gender, failedCriteria },
//     });
//   };

//   if (loading) {
//     return (
//       <div className="w-full bg-gray-50 py-12 text-center">
//         <p className="text-gray-600">Loading profile data...</p>
//       </div>
//     );
//   }

//   if (errors.age && errors.age.includes("Failed to load profile data")) {
//     return (
//       <div className="w-full bg-gray-50 py-12 text-center">
//         <p className="text-red-600">{errors.age}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
//           Blood Donation <span className="text-[#B02629]">Eligibility</span>
//         </h1>
//         <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-10">
//           Please answer the following questions to determine if you are eligible
//           to donate blood for Request ID: {id}.
//         </p>
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           {(gender === null || (gender !== "male" && gender !== "female")) && (
//             <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
//               <p>
//                 {gender === null
//                   ? "Your profile does not have gender information."
//                   : `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`}{" "}
//                 Please update your gender in the{" "}
//                 <a
//                   href="/donor/profile"
//                   className="text-[#B02629] underline hover:text-[#9a1f22]"
//                 >
//                   Profile section
//                 </a>{" "}
//                 to proceed.
//               </p>
//             </div>
//           )}
//           <form onSubmit={handleSubmit}>
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                 General Questions
//               </h2>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   What is your age?
//                 </label>
//                 <input
//                   type="number"
//                   name="age"
//                   value={formData.age !== null ? formData.age : ""}
//                   onChange={handleChange}
//                   className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                   placeholder="Enter your age"
//                   required
//                 />
//                 {errors.age && (
//                   <p className="text-red-600 text-sm mt-2">{errors.age}</p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   What is your weight (in kg)?
//                 </label>
//                 <input
//                   type="number"
//                   name="weight"
//                   value={formData.weight !== null ? formData.weight : ""}
//                   onChange={handleChange}
//                   className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                   placeholder="Enter your weight in kg"
//                   required
//                 />
//                 {errors.weight && (
//                   <p className="text-red-600 text-sm mt-2">{errors.weight}</p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   What is your hemoglobin level (g/dL)? (Leave blank if unknown)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   name="hemoglobin"
//                   value={
//                     formData.hemoglobin !== null ? formData.hemoglobin : ""
//                   }
//                   onChange={handleChange}
//                   className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                   placeholder="Enter hemoglobin level (e.g., 12.5)"
//                 />
//                 {errors.hemoglobin && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.hemoglobin}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Are you in good general health?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="goodHealth"
//                       value="yes"
//                       checked={formData.goodHealth === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="goodHealth"
//                       value="no"
//                       checked={formData.goodHealth === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.goodHealth && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.goodHealth}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Do you have a fever, infection, or flu-like symptoms?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasFeverOrInfection"
//                       value="yes"
//                       checked={formData.hasFeverOrInfection === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasFeverOrInfection"
//                       value="no"
//                       checked={formData.hasFeverOrInfection === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.hasFeverOrInfection && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.hasFeverOrInfection}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   When was your last whole blood donation? (Leave blank if none)
//                 </label>
//                 <input
//                   type="date"
//                   name="lastWholeBloodDonation"
//                   value={formData.lastWholeBloodDonation || ""}
//                   onChange={handleChange}
//                   className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                 />
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   When was your last platelet donation? (Leave blank if none)
//                 </label>
//                 <input
//                   type="date"
//                   name="lastPlateletDonation"
//                   value={formData.lastPlateletDonation || ""}
//                   onChange={handleChange}
//                   className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent text-lg"
//                 />
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you had a tattoo or piercing in the past 6 months?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentTattooOrPiercing"
//                       value="yes"
//                       checked={formData.recentTattooOrPiercing === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentTattooOrPiercing"
//                       value="no"
//                       checked={formData.recentTattooOrPiercing === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.recentTattooOrPiercing && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.recentTattooOrPiercing}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you had major surgery or a blood transfusion in the past
//                   6–12 months?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentSurgeryOrTransfusion"
//                       value="yes"
//                       checked={formData.recentSurgeryOrTransfusion === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentSurgeryOrTransfusion"
//                       value="no"
//                       checked={formData.recentSurgeryOrTransfusion === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.recentSurgeryOrTransfusion && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.recentSurgeryOrTransfusion}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you had a vaccination in the past 2–4 weeks?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentVaccination"
//                       value="yes"
//                       checked={formData.recentVaccination === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentVaccination"
//                       value="no"
//                       checked={formData.recentVaccination === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.recentVaccination && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.recentVaccination}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you used antibiotics or had an infection in the past 2
//                   weeks?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentAntibiotics"
//                       value="yes"
//                       checked={formData.recentAntibiotics === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentAntibiotics"
//                       value="no"
//                       checked={formData.recentAntibiotics === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.recentAntibiotics && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.recentAntibiotics}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you had a dental extraction in the past 1 week?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentDentalExtraction"
//                       value="yes"
//                       checked={formData.recentDentalExtraction === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="recentDentalExtraction"
//                       value="no"
//                       checked={formData.recentDentalExtraction === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.recentDentalExtraction && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.recentDentalExtraction}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you traveled to a malaria-prone area in the past 6
//                   months?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="travelMalariaArea"
//                       value="yes"
//                       checked={formData.travelMalariaArea === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="travelMalariaArea"
//                       value="no"
//                       checked={formData.travelMalariaArea === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.travelMalariaArea && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.travelMalariaArea}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Do you have chronic diseases (e.g., diabetes, cancer,
//                   epilepsy, heart disease, severe asthma)?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasChronicDisease"
//                       value="yes"
//                       checked={formData.hasChronicDisease === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasChronicDisease"
//                       value="no"
//                       checked={formData.hasChronicDisease === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.hasChronicDisease && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.hasChronicDisease}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you tested positive for Hepatitis B, Hepatitis C, or
//                   HIV/AIDS?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasHepatitisOrHIV"
//                       value="yes"
//                       checked={formData.hasHepatitisOrHIV === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="hasHepatitisOrHIV"
//                       value="no"
//                       checked={formData.hasHepatitisOrHIV === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.hasHepatitisOrHIV && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.hasHepatitisOrHIV}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you ever used intravenous drugs?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="intravenousDrugUse"
//                       value="yes"
//                       checked={formData.intravenousDrugUse === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="intravenousDrugUse"
//                       value="no"
//                       checked={formData.intravenousDrugUse === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.intravenousDrugUse && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.intravenousDrugUse}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-8">
//                 <label className="block text-gray-800 font-semibold text-lg mb-2">
//                   Have you engaged in high-risk sexual behavior?
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="highRiskSexualBehavior"
//                       value="yes"
//                       checked={formData.highRiskSexualBehavior === "yes"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="highRiskSexualBehavior"
//                       value="no"
//                       checked={formData.highRiskSexualBehavior === "no"}
//                       onChange={handleChange}
//                       className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                     />
//                     No
//                   </label>
//                 </div>
//                 {errors.highRiskSexualBehavior && (
//                   <p className="text-red-600 text-sm mt-2">
//                     {errors.highRiskSexualBehavior}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {gender === "female" && (
//               <div className="mb-8">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                   Additional Questions for Female Donors
//                 </h2>
//                 <div className="mb-8">
//                   <label className="block text-gray-800 font-semibold text-lg mb-2">
//                     Are you pregnant or breastfeeding (in the past 6 months)?
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isPregnantOrBreastfeeding"
//                         value="yes"
//                         checked={formData.isPregnantOrBreastfeeding === "yes"}
//                         onChange={handleChange}
//                         className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                       />
//                       Yes
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isPregnantOrBreastfeeding"
//                         value="no"
//                         checked={formData.isPregnantOrBreastfeeding === "no"}
//                         onChange={handleChange}
//                         className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                       />
//                       No
//                     </label>
//                   </div>
//                   {errors.isPregnantOrBreastfeeding && (
//                     <p className="text-red-600 text-sm mt-2">
//                       {errors.isPregnantOrBreastfeeding}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-8">
//                   <label className="block text-gray-800 font-semibold text-lg mb-2">
//                     Are you menstruating and feeling weak or anemic?
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="menstruationWeakness"
//                         value="yes"
//                         checked={formData.menstruationWeakness === "yes"}
//                         onChange={handleChange}
//                         className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                       />
//                       Yes
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="menstruationWeakness"
//                         value="no"
//                         checked={formData.menstruationWeakness === "no"}
//                         onChange={handleChange}
//                         className="mr-2 h-5 w-5 text-[#B02629] focus:ring-[#B02629] border-gray-300"
//                       />
//                       No
//                     </label>
//                   </div>
//                   {errors.menstruationWeakness && (
//                     <p className="text-red-600 text-sm mt-2">
//                       {errors.menstruationWeakness}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-3 rounded-full transition-colors text-lg"
//                 disabled={
//                   gender === null || (gender !== "male" && gender !== "female")
//                 }
//               >
//                 Check Eligibility
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/donor/bloodRequestsPage")}
//                 className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full transition-colors text-lg"
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



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { CheckCircle, XCircle, Heart, AlertTriangle, User, Activity } from "lucide-react";
// import axios from "axios";

// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
//   gender?: string;
// }

// interface PopupProps {
//   isVisible: boolean;
//   isEligible: boolean;
//   onClose: () => void;
//   onProceed: () => void;
//   failedCriteria?: string[];
// }

// const EligibilityPopup: React.FC<PopupProps> = ({ 
//   isVisible, 
//   isEligible, 
//   onClose, 
//   onProceed, 
//   failedCriteria = [] 
// }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
//         {isEligible ? (
//           <>
//             <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
//               <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
//               <h2 className="text-2xl font-bold text-white">Great News!</h2>
//               <p className="text-green-100 mt-2">You're eligible to donate blood</p>
//             </div>
//             <div className="p-6">
//               <div className="text-center mb-6">
//                 <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
//                 <p className="text-gray-700 text-lg leading-relaxed">
//                   Thank you for your willingness to save lives! Your donation can help up to 3 people in need.
//                 </p>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={onProceed}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
//                 >
//                   Find Donation Centers
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
//               <XCircle className="w-16 h-16 text-white mx-auto mb-3" />
//               <h2 className="text-2xl font-bold text-white">Not Eligible</h2>
//               <p className="text-red-100 mt-2">Unable to donate at this time</p>
//             </div>
//             <div className="p-6">
//               <div className="text-center mb-6">
//                 <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
//                 <p className="text-gray-700 text-lg leading-relaxed mb-4">
//                   Unfortunately, you don't meet the current eligibility criteria for blood donation.
//                 </p>
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-red-600 font-medium mb-2">Reasons for ineligibility:</p>
//                   <ul className="text-sm text-red-600 space-y-1">
//                     {failedCriteria.map((criteria, index) => (
//                       <li key={index} className="flex items-center">
//                         <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
//                         {criteria}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
//               >
//                 Understood
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export const BloodDonationEligibilityForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<EligibilityFormData>({
//     age: null,
//     weight: null,
//     hemoglobin: null,
//     goodHealth: null,
//     hasFeverOrInfection: null,
//     lastWholeBloodDonation: null,
//     lastPlateletDonation: null,
//     recentTattooOrPiercing: null,
//     isPregnantOrBreastfeeding: null,
//     recentSurgeryOrTransfusion: null,
//     recentVaccination: null,
//     recentAntibiotics: null,
//     recentDentalExtraction: null,
//     menstruationWeakness: null,
//     travelMalariaArea: null,
//     hasChronicDisease: null,
//     hasHepatitisOrHIV: null,
//     intravenousDrugUse: null,
//     highRiskSexualBehavior: null,
//   });
  
//   const [gender, setGender] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState<Partial<Record<keyof EligibilityFormData, string>>>({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [eligibilityResult, setEligibilityResult] = useState<{
//     isEligible: boolean;
//     failedCriteria: string[];
//   }>({ isEligible: false, failedCriteria: [] });

//   useEffect(() => {
//     const fetchDonorProfile = async () => {
//       try {
//         setLoading(true);
//         // Simulating API call - replace with actual API
//         // const response = await axios.get<Donor>(`http://localhost:9095/donors/profile`, { withCredentials: true });
        
//         // Mock data for demonstration
//         const mockResponse = {
//           data: {
//             donor_id: 1,
//             donor_name: "John Doe",
//             email: "john@example.com",
//             phone_number: "1234567890",
//             district_name: "Colombo",
//             blood_group: "O+",
//             last_donation_date: "2024-01-15",
//             gender: "male"
//           }
//         };
        
//         console.log("Fetched profile data:", mockResponse.data);
//         const rawGender = mockResponse.data.gender || null;
//         const normalizedGender = rawGender ? rawGender.toLowerCase() : null;
//         setGender(normalizedGender);
//         setFormData((prev) => ({
//           ...prev,
//           lastWholeBloodDonation: mockResponse.data.last_donation_date || null,
//         }));
//       } catch (err: any) {
//         console.error("Error fetching profile:", err);
//         setErrors((prev) => ({
//           ...prev,
//           age: "Failed to load profile data. Please try again.",
//         }));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDonorProfile();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "age" || name === "weight" || name === "hemoglobin"
//           ? value === "" ? null : Number(value)
//           : value || null,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const getFailedCriteriaMessages = (failedCriteria: string[]): string[] => {
//     const messages: { [key: string]: string } = {
//       ageValid: "Age must be between 18 and 60 years",
//       weightValid: "Weight must be at least 45 kg",
//       hemoglobinValid: "Hemoglobin level must be at least 12.5 g/dL",
//       goodHealthValid: "Must be in good general health",
//       noFeverOrInfection: "Cannot have fever, infection, or flu-like symptoms",
//       wholeBloodDonationValid: "Must wait at least 4 months since last whole blood donation",
//       plateletDonationValid: "Must wait at least 2 weeks since last platelet donation",
//       noRecentTattoo: "Cannot have had tattoo or piercing in past 6 months",
//       notPregnantOrBreastfeeding: "Cannot be pregnant or breastfeeding",
//       noRecentSurgery: "Cannot have had major surgery or transfusion in past 6-12 months",
//       noRecentVaccination: "Cannot have had vaccination in past 2-4 weeks",
//       noRecentAntibiotics: "Cannot have used antibiotics or had infection in past 2 weeks",
//       noRecentDentalExtraction: "Cannot have had dental extraction in past week",
//       noMenstruationWeakness: "Cannot donate while menstruating and feeling weak",
//       noTravelMalaria: "Cannot have traveled to malaria-prone area in past 6 months",
//       noChronicDisease: "Cannot have chronic diseases",
//       noHepatitisOrHIV: "Cannot have tested positive for Hepatitis or HIV",
//       noIntravenousDrugUse: "Cannot have history of intravenous drug use",
//       noHighRiskSexualBehavior: "Cannot have engaged in high-risk sexual behavior"
//     };
    
//     return failedCriteria.map(criteria => messages[criteria] || criteria);
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
//     if (!id) {
//       newErrors.age = "Invalid request ID.";
//     }
//     if (gender === null) {
//       newErrors.age = "Gender information is missing. Please update your profile in the Profile section.";
//     } else if (gender !== "male" && gender !== "female") {
//       newErrors.age = `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`;
//     }
//     if (formData.age === null) {
//       newErrors.age = "Please enter your age.";
//     } else if (formData.age < 18 || formData.age > 60) {
//       newErrors.age = "You must be between 18 and 60 years old to donate.";
//     }
//     if (formData.weight === null) {
//       newErrors.weight = "Please enter your weight.";
//     } else if (formData.weight < 45) {
//       newErrors.weight = "You must weigh at least 45 kg (100 lbs) to donate.";
//     }
//     if (formData.hemoglobin !== null && formData.hemoglobin < 12.5) {
//       newErrors.hemoglobin = "Your hemoglobin must be at least 12.5 g/dL.";
//     }
//     if (formData.goodHealth === null) {
//       newErrors.goodHealth = "Please select whether you are in good health.";
//     } else if (formData.goodHealth === "no") {
//       newErrors.goodHealth = "You must be in good general health to donate.";
//     }
//     if (formData.hasFeverOrInfection === null) {
//       newErrors.hasFeverOrInfection = "Please select an option.";
//     }
//     if (formData.recentTattooOrPiercing === null) {
//       newErrors.recentTattooOrPiercing = "Please select an option.";
//     }
//     if (gender === "female" && formData.isPregnantOrBreastfeeding === null) {
//       newErrors.isPregnantOrBreastfeeding = "Please select an option.";
//     }
//     if (formData.recentSurgeryOrTransfusion === null) {
//       newErrors.recentSurgeryOrTransfusion = "Please select an option.";
//     }
//     if (formData.recentVaccination === null) {
//       newErrors.recentVaccination = "Please select an option.";
//     }
//     if (formData.recentAntibiotics === null) {
//       newErrors.recentAntibiotics = "Please select an option.";
//     }
//     if (formData.recentDentalExtraction === null) {
//       newErrors.recentDentalExtraction = "Please select an option.";
//     }
//     if (gender === "female" && formData.menstruationWeakness === null) {
//       newErrors.menstruationWeakness = "Please select an option.";
//     }
//     if (formData.travelMalariaArea === null) {
//       newErrors.travelMalariaArea = "Please select an option.";
//     }
//     if (formData.hasChronicDisease === null) {
//       newErrors.hasChronicDisease = "Please select an option.";
//     }
//     if (formData.hasHepatitisOrHIV === null) {
//       newErrors.hasHepatitisOrHIV = "Please select an option.";
//     }
//     if (formData.intravenousDrugUse === null) {
//       newErrors.intravenousDrugUse = "Please select an option.";
//     }
//     if (formData.highRiskSexualBehavior === null) {
//       newErrors.highRiskSexualBehavior = "Please select an option.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form data on submit:", formData);
//     console.log("Gender on submit:", gender);
    
//     if (!validateForm() || !id) {
//       if (!id) {
//         setErrors((prev) => ({
//           ...prev,
//           age: "Invalid request ID. Please access this form from a valid blood request.",
//         }));
//       }
//       return;
//     }

//     const eligibilityCriteria = {
//       ageValid: formData.age !== null && formData.age >= 18 && formData.age <= 60,
//       weightValid: formData.weight !== null && formData.weight >= 45,
//       hemoglobinValid: formData.hemoglobin === null || formData.hemoglobin >= 12.5,
//       goodHealthValid: formData.goodHealth === "yes",
//       noFeverOrInfection: formData.hasFeverOrInfection === "no",
//       wholeBloodDonationValid: formData.lastWholeBloodDonation === null || 
//         new Date(formData.lastWholeBloodDonation) <= new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
//       plateletDonationValid: formData.lastPlateletDonation === null || 
//         new Date(formData.lastPlateletDonation) <= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//       noRecentTattoo: formData.recentTattooOrPiercing === "no",
//       notPregnantOrBreastfeeding: gender !== "female" || formData.isPregnantOrBreastfeeding === "no",
//       noRecentSurgery: formData.recentSurgeryOrTransfusion === "no",
//       noRecentVaccination: formData.recentVaccination === "no",
//       noRecentAntibiotics: formData.recentAntibiotics === "no",
//       noRecentDentalExtraction: formData.recentDentalExtraction === "no",
//       noMenstruationWeakness: gender !== "female" || formData.menstruationWeakness === "no",
//       noTravelMalaria: formData.travelMalariaArea === "no",
//       noChronicDisease: formData.hasChronicDisease === "no",
//       noHepatitisOrHIV: formData.hasHepatitisOrHIV === "no",
//       noIntravenousDrugUse: formData.intravenousDrugUse === "no",
//       noHighRiskSexualBehavior: formData.highRiskSexualBehavior === "no",
//     };

//     const isEligible = Object.values(eligibilityCriteria).every(criterion => criterion);
//     const failedCriteria = Object.entries(eligibilityCriteria)
//       .filter(([_, value]) => !value)
//       .map(([key]) => key);

//     setEligibilityResult({
//       isEligible,
//       failedCriteria: getFailedCriteriaMessages(failedCriteria)
//     });
//     setShowPopup(true);
//   };

//   const handleProceed = () => {
//     navigate(`/donor/eligibility/${id}/result`, {
//       state: { 
//         isEligible: eligibilityResult.isEligible, 
//         formData, 
//         result: "You are eligible to donate blood! We will now check for nearby donation centers.",
//         gender,
//         failedCriteria: eligibilityResult.failedCriteria
//       },
//     });
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     if (!eligibilityResult.isEligible) {
//       navigate("/donor/bloodRequestsPage");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="text-center">
//           <Activity className="w-12 h-12 text-red-500 mx-auto mb-4 animate-spin" />
//           <p className="text-gray-600 text-lg">Loading profile data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (errors.age && errors.age.includes("Failed to load profile data")) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="text-center">
//           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 text-lg">{errors.age}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
//         <div className="container mx-auto px-4 py-12">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
//               <Heart className="w-10 h-10 text-white" />
//             </div>
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
//               Blood Donation <span className="text-red-500">Eligibility</span>
//             </h1>
//             <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
//               Please answer the following questions to determine if you are eligible to donate blood for Request ID: <span className="font-semibold text-red-500">#{id}</span>
//             </p>
//           </div>

//           {/* Main Form */}
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
//               {/* Gender Warning */}
//               {(gender === null || (gender !== "male" && gender !== "female")) && (
//                 <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
//                   <div className="flex items-center text-white">
//                     <User className="w-6 h-6 mr-3" />
//                     <div>
//                       <p className="font-semibold">
//                         {gender === null
//                           ? "Your profile does not have gender information."
//                           : `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`}
//                       </p>
//                       <p className="text-red-100 mt-1">
//                         Please update your gender in the{" "}
//                         <a href="/donor/profile" className="underline hover:text-white font-medium">
//                           Profile section
//                         </a>{" "}
//                         to proceed.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="p-8 md:p-12">
//                 {/* General Questions Section */}
//                 <div className="mb-12">
//                   <div className="flex items-center mb-8">
//                     <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
//                       <Activity className="w-5 h-5 text-white" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-800">General Health Information</h2>
//                   </div>

//                   {/* Age Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your age? <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age !== null ? formData.age : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter your age"
//                       required
//                     />
//                     {errors.age && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.age}
//                       </p>
//                     )}
//                   </div>

//                   {/* Weight Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your weight (in kg)? <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="weight"
//                       value={formData.weight !== null ? formData.weight : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter your weight in kg"
//                       required
//                     />
//                     {errors.weight && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.weight}
//                       </p>
//                     )}
//                   </div>

//                   {/* Hemoglobin Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your hemoglobin level (g/dL)? <span className="text-gray-500">(Leave blank if unknown)</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       name="hemoglobin"
//                       value={formData.hemoglobin !== null ? formData.hemoglobin : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter hemoglobin level (e.g., 12.5)"
//                     />
//                     {errors.hemoglobin && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.hemoglobin}
//                       </p>
//                     )}
//                   </div>

//                   {/* Radio Button Questions */}
//                   {[
//                     { name: "goodHealth", label: "Are you in good general health?", required: true },
//                     { name: "hasFeverOrInfection", label: "Do you have a fever, infection, or flu-like symptoms?", required: true },
//                     { name: "recentTattooOrPiercing", label: "Have you had a tattoo or piercing in the past 6 months?", required: true },
//                     { name: "recentSurgeryOrTransfusion", label: "Have you had major surgery or a blood transfusion in the past 6–12 months?", required: true },
//                     { name: "recentVaccination", label: "Have you had a vaccination in the past 2–4 weeks?", required: true },
//                     { name: "recentAntibiotics", label: "Have you used antibiotics or had an infection in the past 2 weeks?", required: true },
//                     { name: "recentDentalExtraction", label: "Have you had a dental extraction in the past 1 week?", required: true },
//                     { name: "travelMalariaArea", label: "Have you traveled to a malaria-prone area in the past 6 months?", required: true },
//                     { name: "hasChronicDisease", label: "Do you have chronic diseases (e.g., diabetes, cancer, epilepsy, heart disease, severe asthma)?", required: true },
//                     { name: "hasHepatitisOrHIV", label: "Have you tested positive for Hepatitis B, Hepatitis C, or HIV/AIDS?", required: true },
//                     { name: "intravenousDrugUse", label: "Have you ever used intravenous drugs?", required: true },
//                     { name: "highRiskSexualBehavior", label: "Have you engaged in high-risk sexual behavior?", required: true },
//                     ...(gender === "female" ? [
//                       { name: "isPregnantOrBreastfeeding", label: "Are you pregnant or breastfeeding (in the past 6 months)?", required: true },
//                       { name: "menstruationWeakness", label: "Are you menstruating and feeling weak or anemic?", required: true }
//                     ] : [])
//                   ].map((question) => (
//                     <div key={question.name} className="mb-8">
//                       <label className="block text-gray-800 font-semibold text-lg mb-4">
//                         {question.label} {question.required && <span className="text-red-500">*</span>}
//                       </label>
//                       <div className="flex space-x-6">
//                         <label className="flex items-center cursor-pointer group">
//                           <input
//                             type="radio"
//                             name={question.name}
//                             value="yes"
//                             checked={formData[question.name as keyof EligibilityFormData] === "yes"}
//                             onChange={handleChange}
//                             className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                           />
//                           <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
//                         </label>
//                         <label className="flex items-center cursor-pointer group">
//                           <input
//                             type="radio"
//                             name={question.name}
//                             value="no"
//                             checked={formData[question.name as keyof EligibilityFormData] === "no"}
//                             onChange={handleChange}
//                             className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                           />
//                           <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
//                         </label>
//                       </div>
//                       {errors[question.name as keyof EligibilityFormData] && (
//                         <p className="text-red-500 text-sm mt-2 flex items-center">
//                           <XCircle className="w-4 h-4 mr-1" />
//                           {errors[question.name as keyof EligibilityFormData]}
//                         </p>
//                       )}
//                     </div>
//                   ))}

//                   {/* Date Inputs */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       When was your last whole blood donation? <span className="text-gray-500">(Leave blank if none)</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="lastWholeBloodDonation"
//                       value={formData.lastWholeBloodDonation || ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                     />
//                   </div>

//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       When was your last platelet donation? <span className="text-gray-500">(Leave blank if none)</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="lastPlateletDonation"
//                       value={formData.lastPlateletDonation || ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                     />
//                   </div>
//                 </div>



//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-200">
//                   <button
//                     type="submit"
//                     disabled={gender === null || (gender !== "male" && gender !== "female")}
//                     className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     <Heart className="w-5 h-5 mr-2" />
//                     Check Eligibility
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/donor/bloodRequestsPage")}
//                     className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
//                   >
//                     Back to Requests
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Floating Hearts Animation */}
//         <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
//           {[...Array(6)].map((_, i) => (
//             <Heart
//               key={i}
//               className={`absolute text-red-200 opacity-20 animate-pulse`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 fontSize: `${Math.random() * 20 + 10}px`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${Math.random() * 2 + 3}s`
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Eligibility Popup */}
//       <EligibilityPopup
//         isVisible={showPopup}
//         isEligible={eligibilityResult.isEligible}
//         onClose={handleClosePopup}
//         onProceed={handleProceed}
//         failedCriteria={eligibilityResult.failedCriteria}
//       />
//     </>
//   );
// };











// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { CheckCircle, XCircle, Heart, AlertTriangle, User, Activity } from "lucide-react";
// import axios from "axios";

// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
//   gender?: string;
// }

// interface PopupProps {
//   isVisible: boolean;
//   isEligible: boolean;
//   onClose: () => void;
//   onProceed: () => void;
//   failedCriteria?: string[];
// }

// const EligibilityPopup: React.FC<PopupProps> = ({ 
//   isVisible, 
//   isEligible, 
//   onClose, 
//   onProceed, 
//   failedCriteria = [] 
// }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
//         {isEligible ? (
//           <>
//             <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
//               <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
//               <h2 className="text-2xl font-bold text-white">Great News!</h2>
//               <p className="text-green-100 mt-2">You're eligible to donate blood</p>
//             </div>
//             <div className="p-6">
//               <div className="text-center mb-6">
//                 <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
//                 <p className="text-gray-700 text-lg leading-relaxed">
//                   Thank you for your willingness to save lives! Your donation can help up to 3 people in need.
//                 </p>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={onProceed}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
//                 >
//                   Find Donation Centers
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
//               <XCircle className="w-16 h-16 text-white mx-auto mb-3" />
//               <h2 className="text-2xl font-bold text-white">Not Eligible</h2>
//               <p className="text-red-100 mt-2">Unable to donate at this time</p>
//             </div>
//             <div className="p-6">
//               <div className="text-center mb-6">
//                 <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
//                 <p className="text-gray-700 text-lg leading-relaxed mb-4">
//                   Unfortunately, you don't meet the current eligibility criteria for blood donation.
//                 </p>
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-red-600 font-medium mb-2">Reasons for ineligibility:</p>
//                   <ul className="text-sm text-red-600 space-y-1">
//                     {failedCriteria.map((criteria, index) => (
//                       <li key={index} className="flex items-center">
//                         <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
//                         {criteria}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
//               >
//                 Understood
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export const BloodDonationEligibilityForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<EligibilityFormData>({
//     age: null,
//     weight: null,
//     hemoglobin: null,
//     goodHealth: null,
//     hasFeverOrInfection: null,
//     lastWholeBloodDonation: null,
//     lastPlateletDonation: null,
//     recentTattooOrPiercing: null,
//     isPregnantOrBreastfeeding: null,
//     recentSurgeryOrTransfusion: null,
//     recentVaccination: null,
//     recentAntibiotics: null,
//     recentDentalExtraction: null,
//     menstruationWeakness: null,
//     travelMalariaArea: null,
//     hasChronicDisease: null,
//     hasHepatitisOrHIV: null,
//     intravenousDrugUse: null,
//     highRiskSexualBehavior: null,
//   });
  
//   const [gender, setGender] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState<Partial<Record<keyof EligibilityFormData, string>>>({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [eligibilityResult, setEligibilityResult] = useState<{
//     isEligible: boolean;
//     failedCriteria: string[];
//   }>({ isEligible: false, failedCriteria: [] });

//   useEffect(() => {
//     const fetchDonorProfile = async () => {
//       try {
//         setLoading(true);
//         // Simulating API call - replace with actual API
//         // const response = await axios.get<Donor>(`http://localhost:9095/donors/profile`, { withCredentials: true });
        
//         // Mock data for demonstration
//         const mockResponse = {
//           data: {
//             donor_id: 1,
//             donor_name: "John Doe",
//             email: "john@example.com",
//             phone_number: "1234567890",
//             district_name: "Colombo",
//             blood_group: "O+",
//             last_donation_date: "2024-01-15",
//             gender: "male"
//           }
//         };
        
//         console.log("Fetched profile data:", mockResponse.data);
//         const rawGender = mockResponse.data.gender || null;
//         const normalizedGender = rawGender ? rawGender.toLowerCase() : null;
//         setGender(normalizedGender);
//         setFormData((prev) => ({
//           ...prev,
//           lastWholeBloodDonation: mockResponse.data.last_donation_date || null,
//         }));
//       } catch (err: any) {
//         console.error("Error fetching profile:", err);
//         setErrors((prev) => ({
//           ...prev,
//           age: "Failed to load profile data. Please try again.",
//         }));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDonorProfile();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "age" || name === "weight" || name === "hemoglobin"
//           ? value === "" ? null : Number(value)
//           : value || null,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const getFailedCriteriaMessages = (failedCriteria: string[]): string[] => {
//     const messages: { [key: string]: string } = {
//       ageValid: "Age must be between 18 and 60 years",
//       weightValid: "Weight must be at least 45 kg",
//       hemoglobinValid: "Hemoglobin level must be at least 12.5 g/dL",
//       goodHealthValid: "Must be in good general health",
//       noFeverOrInfection: "Cannot have fever, infection, or flu-like symptoms",
//       wholeBloodDonationValid: "Must wait at least 4 months since last whole blood donation",
//       plateletDonationValid: "Must wait at least 2 weeks since last platelet donation",
//       noRecentTattoo: "Cannot have had tattoo or piercing in past 6 months",
//       notPregnantOrBreastfeeding: "Cannot be pregnant or breastfeeding",
//       noRecentSurgery: "Cannot have had major surgery or transfusion in past 6-12 months",
//       noRecentVaccination: "Cannot have had vaccination in past 2-4 weeks",
//       noRecentAntibiotics: "Cannot have used antibiotics or had infection in past 2 weeks",
//       noRecentDentalExtraction: "Cannot have had dental extraction in past week",
//       noMenstruationWeakness: "Cannot donate while menstruating and feeling weak",
//       noTravelMalaria: "Cannot have traveled to malaria-prone area in past 6 months",
//       noChronicDisease: "Cannot have chronic diseases",
//       noHepatitisOrHIV: "Cannot have tested positive for Hepatitis or HIV",
//       noIntravenousDrugUse: "Cannot have history of intravenous drug use",
//       noHighRiskSexualBehavior: "Cannot have engaged in high-risk sexual behavior"
//     };
    
//     return failedCriteria.map(criteria => messages[criteria] || criteria);
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
//     if (!id) {
//       newErrors.age = "Invalid request ID.";
//     }
//     if (gender === null) {
//       newErrors.age = "Gender information is missing. Please update your profile in the Profile section.";
//     } else if (gender !== "male" && gender !== "female") {
//       newErrors.age = `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`;
//     }
//     if (formData.age === null) {
//       newErrors.age = "Please enter your age.";
//     } else if (formData.age < 18 || formData.age > 60) {
//       newErrors.age = "You must be between 18 and 60 years old to donate.";
//     }
//     if (formData.weight === null) {
//       newErrors.weight = "Please enter your weight.";
//     } else if (formData.weight < 45) {
//       newErrors.weight = "You must weigh at least 45 kg (100 lbs) to donate.";
//     }
//     if (formData.hemoglobin !== null && formData.hemoglobin < 12.5) {
//       newErrors.hemoglobin = "Your hemoglobin must be at least 12.5 g/dL.";
//     }
//     if (formData.goodHealth === null) {
//       newErrors.goodHealth = "Please select whether you are in good health.";
//     } else if (formData.goodHealth === "no") {
//       newErrors.goodHealth = "You must be in good general health to donate.";
//     }
//     if (formData.hasFeverOrInfection === null) {
//       newErrors.hasFeverOrInfection = "Please select an option.";
//     }
//     if (formData.recentTattooOrPiercing === null) {
//       newErrors.recentTattooOrPiercing = "Please select an option.";
//     }
//     if (gender === "female" && formData.isPregnantOrBreastfeeding === null) {
//       newErrors.isPregnantOrBreastfeeding = "Please select an option.";
//     }
//     if (formData.recentSurgeryOrTransfusion === null) {
//       newErrors.recentSurgeryOrTransfusion = "Please select an option.";
//     }
//     if (formData.recentVaccination === null) {
//       newErrors.recentVaccination = "Please select an option.";
//     }
//     if (formData.recentAntibiotics === null) {
//       newErrors.recentAntibiotics = "Please select an option.";
//     }
//     if (formData.recentDentalExtraction === null) {
//       newErrors.recentDentalExtraction = "Please select an option.";
//     }
//     if (gender === "female" && formData.menstruationWeakness === null) {
//       newErrors.menstruationWeakness = "Please select an option.";
//     }
//     if (formData.travelMalariaArea === null) {
//       newErrors.travelMalariaArea = "Please select an option.";
//     }
//     if (formData.hasChronicDisease === null) {
//       newErrors.hasChronicDisease = "Please select an option.";
//     }
//     if (formData.hasHepatitisOrHIV === null) {
//       newErrors.hasHepatitisOrHIV = "Please select an option.";
//     }
//     if (formData.intravenousDrugUse === null) {
//       newErrors.intravenousDrugUse = "Please select an option.";
//     }
//     if (formData.highRiskSexualBehavior === null) {
//       newErrors.highRiskSexualBehavior = "Please select an option.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form data on submit:", formData);
//     console.log("Gender on submit:", gender);
    
//     if (!validateForm() || !id) {
//       if (!id) {
//         setErrors((prev) => ({
//           ...prev,
//           age: "Invalid request ID. Please access this form from a valid blood request.",
//         }));
//       }
//       return;
//     }

//     const eligibilityCriteria = {
//       ageValid: formData.age !== null && formData.age >= 18 && formData.age <= 60,
//       weightValid: formData.weight !== null && formData.weight >= 45,
//       hemoglobinValid: formData.hemoglobin === null || formData.hemoglobin >= 12.5,
//       goodHealthValid: formData.goodHealth === "yes",
//       noFeverOrInfection: formData.hasFeverOrInfection === "no",
//       wholeBloodDonationValid: formData.lastWholeBloodDonation === null || 
//         new Date(formData.lastWholeBloodDonation) <= new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
//       plateletDonationValid: formData.lastPlateletDonation === null || 
//         new Date(formData.lastPlateletDonation) <= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//       noRecentTattoo: formData.recentTattooOrPiercing === "no",
//       notPregnantOrBreastfeeding: gender !== "female" || formData.isPregnantOrBreastfeeding === "no",
//       noRecentSurgery: formData.recentSurgeryOrTransfusion === "no",
//       noRecentVaccination: formData.recentVaccination === "no",
//       noRecentAntibiotics: formData.recentAntibiotics === "no",
//       noRecentDentalExtraction: formData.recentDentalExtraction === "no",
//       noMenstruationWeakness: gender !== "female" || formData.menstruationWeakness === "no",
//       noTravelMalaria: formData.travelMalariaArea === "no",
//       noChronicDisease: formData.hasChronicDisease === "no",
//       noHepatitisOrHIV: formData.hasHepatitisOrHIV === "no",
//       noIntravenousDrugUse: formData.intravenousDrugUse === "no",
//       noHighRiskSexualBehavior: formData.highRiskSexualBehavior === "no",
//     };

//     const isEligible = Object.values(eligibilityCriteria).every(criterion => criterion);
//     const failedCriteria = Object.entries(eligibilityCriteria)
//       .filter(([_, value]) => !value)
//       .map(([key]) => key);

//     setEligibilityResult({
//       isEligible,
//       failedCriteria: getFailedCriteriaMessages(failedCriteria)
//     });
//     setShowPopup(true);
//   };

//   const handleProceed = () => {
//     navigate(`/donor/eligibility/${id}/result`, {
//       state: { 
//         isEligible: eligibilityResult.isEligible, 
//         formData, 
//         result: "You are eligible to donate blood! We will now check for nearby donation centers.",
//         gender,
//         failedCriteria: eligibilityResult.failedCriteria
//       },
//     });
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     if (!eligibilityResult.isEligible) {
//       navigate("/donor/bloodRequestsPage");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="text-center">
//           <Activity className="w-12 h-12 text-red-500 mx-auto mb-4 animate-spin" />
//           <p className="text-gray-600 text-lg">Loading profile data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (errors.age && errors.age.includes("Failed to load profile data")) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="text-center">
//           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 text-lg">{errors.age}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
//         <div className="container mx-auto px-4 py-12">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
//               <Heart className="w-10 h-10 text-white" />
//             </div>
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
//               Blood Donation <span className="text-red-500">Eligibility</span>
//             </h1>
//             <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
//               Please answer the following questions to determine if you are eligible to donate blood for Request ID: <span className="font-semibold text-red-500">#{id}</span>
//             </p>
//           </div>

//           {/* Main Form */}
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
//               {/* Gender Warning */}
//               {(gender === null || (gender !== "male" && gender !== "female")) && (
//                 <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
//                   <div className="flex items-center text-white">
//                     <User className="w-6 h-6 mr-3" />
//                     <div>
//                       <p className="font-semibold">
//                         {gender === null
//                           ? "Your profile does not have gender information."
//                           : `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female.`}
//                       </p>
//                       <p className="text-red-100 mt-1">
//                         Please update your gender in the{" "}
//                         <a href="/donor/profile" className="underline hover:text-white font-medium">
//                           Profile section
//                         </a>{" "}
//                         to proceed.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="p-8 md:p-12">
//                 {/* General Questions Section */}
//                 <div className="mb-12">
//                   <div className="flex items-center mb-8">
//                     <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
//                       <Activity className="w-5 h-5 text-white" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-800">General Health Information</h2>
//                   </div>

//                   {/* Age Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your age? <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age !== null ? formData.age : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter your age"
//                       required
//                     />
//                     {errors.age && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.age}
//                       </p>
//                     )}
//                   </div>

//                   {/* Weight Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your weight (in kg)? <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="weight"
//                       value={formData.weight !== null ? formData.weight : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter your weight in kg"
//                       required
//                     />
//                     {errors.weight && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.weight}
//                       </p>
//                     )}
//                   </div>

//                   {/* Hemoglobin Input */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       What is your hemoglobin level (g/dL)? <span className="text-gray-500">(Leave blank if unknown)</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       name="hemoglobin"
//                       value={formData.hemoglobin !== null ? formData.hemoglobin : ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                       placeholder="Enter hemoglobin level (e.g., 12.5)"
//                     />
//                     {errors.hemoglobin && (
//                       <p className="text-red-500 text-sm mt-2 flex items-center">
//                         <XCircle className="w-4 h-4 mr-1" />
//                         {errors.hemoglobin}
//                       </p>
//                     )}
//                   </div>

//                   {/* General Radio Button Questions */}
//                   {[
//                     { name: "goodHealth", label: "Are you in good general health?", required: true },
//                     { name: "hasFeverOrInfection", label: "Do you have a fever, infection, or flu-like symptoms?", required: true },
//                     { name: "recentTattooOrPiercing", label: "Have you had a tattoo or piercing in the past 6 months?", required: true },
//                     { name: "recentSurgeryOrTransfusion", label: "Have you had major surgery or a blood transfusion in the past 6–12 months?", required: true },
//                     { name: "recentVaccination", label: "Have you had a vaccination in the past 2–4 weeks?", required: true },
//                     { name: "recentAntibiotics", label: "Have you used antibiotics or had an infection in the past 2 weeks?", required: true },
//                     { name: "recentDentalExtraction", label: "Have you had a dental extraction in the past 1 week?", required: true },
//                     { name: "travelMalariaArea", label: "Have you traveled to a malaria-prone area in the past 6 months?", required: true },
//                     { name: "hasChronicDisease", label: "Do you have chronic diseases (e.g., diabetes, cancer, epilepsy, heart disease, severe asthma)?", required: true },
//                     { name: "hasHepatitisOrHIV", label: "Have you tested positive for Hepatitis B, Hepatitis C, or HIV/AIDS?", required: true },
//                     { name: "intravenousDrugUse", label: "Have you ever used intravenous drugs?", required: true },
//                     { name: "highRiskSexualBehavior", label: "Have you engaged in high-risk sexual behavior?", required: true },
//                   ].map((question) => (
//                     <div key={question.name} className="mb-8">
//                       <label className="block text-gray-800 font-semibold text-lg mb-4">
//                         {question.label} {question.required && <span className="text-red-500">*</span>}
//                       </label>
//                       <div className="flex space-x-6">
//                         <label className="flex items-center cursor-pointer group">
//                           <input
//                             type="radio"
//                             name={question.name}
//                             value="yes"
//                             checked={formData[question.name as keyof EligibilityFormData] === "yes"}
//                             onChange={handleChange}
//                             className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                           />
//                           <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
//                         </label>
//                         <label className="flex items-center cursor-pointer group">
//                           <input
//                             type="radio"
//                             name={question.name}
//                             value="no"
//                             checked={formData[question.name as keyof EligibilityFormData] === "no"}
//                             onChange={handleChange}
//                             className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                           />
//                           <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
//                         </label>
//                       </div>
//                       {errors[question.name as keyof EligibilityFormData] && (
//                         <p className="text-red-500 text-sm mt-2 flex items-center">
//                           <XCircle className="w-4 h-4 mr-1" />
//                           {errors[question.name as keyof EligibilityFormData]}
//                         </p>
//                       )}
//                     </div>
//                   ))}

//                   {/* Date Inputs */}
//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       When was your last whole blood donation? <span className="text-gray-500">(Leave blank if none)</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="lastWholeBloodDonation"
//                       value={formData.lastWholeBloodDonation || ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                     />
//                   </div>

//                   <div className="mb-8">
//                     <label className="block text-gray-800 font-semibold text-lg mb-3">
//                       When was your last platelet donation? <span className="text-gray-500">(Leave blank if none)</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="lastPlateletDonation"
//                       value={formData.lastPlateletDonation || ""}
//                       onChange={handleChange}
//                       className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
//                     />
//                   </div>
//                 </div>

//                 {/* Additional Questions for Female Donors */}
//                 {gender === "female" && (
//                   <div className="mb-12">
//                     <div className="flex items-center mb-8">
//                       <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
//                         <User className="w-5 h-5 text-white" />
//                       </div>
//                       <h2 className="text-3xl font-bold text-gray-800">Additional Questions for Female Donors</h2>
//                     </div>

//                     {[
//                       { name: "isPregnantOrBreastfeeding", label: "Are you pregnant or breastfeeding (in the past 6 months)?", required: true },
//                       { name: "menstruationWeakness", label: "Are you menstruating and feeling weak or anemic?", required: true }
//                     ].map((question) => (
//                       <div key={question.name} className="mb-8">
//                         <label className="block text-gray-800 font-semibold text-lg mb-4">
//                           {question.label} {question.required && <span className="text-red-500">*</span>}
//                         </label>
//                         <div className="flex space-x-6">
//                           <label className="flex items-center cursor-pointer group">
//                             <input
//                               type="radio"
//                               name={question.name}
//                               value="yes"
//                               checked={formData[question.name as keyof EligibilityFormData] === "yes"}
//                               onChange={handleChange}
//                               className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                             />
//                             <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
//                           </label>
//                           <label className="flex items-center cursor-pointer group">
//                             <input
//                               type="radio"
//                               name={question.name}
//                               value="no"
//                               checked={formData[question.name as keyof EligibilityFormData] === "no"}
//                               onChange={handleChange}
//                               className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
//                             />
//                             <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
//                           </label>
//                         </div>
//                         {errors[question.name as keyof EligibilityFormData] && (
//                           <p className="text-red-500 text-sm mt-2 flex items-center">
//                             <XCircle className="w-4 h-4 mr-1" />
//                             {errors[question.name as keyof EligibilityFormData]}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-200">
//                   <button
//                     type="submit"
//                     disabled={gender === null || (gender !== "male" && gender !== "female")}
//                     className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     <Heart className="w-5 h-5 mr-2" />
//                     Check Eligibility
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/donor/bloodRequestsPage")}
//                     className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
//                   >
//                     Back to Requests
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Floating Hearts Animation */}
//         <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
//           {[...Array(6)].map((_, i) => (
//             <Heart
//               key={i}
//               className={`absolute text-red-200 opacity-20 animate-pulse`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 fontSize: `${Math.random() * 20 + 10}px`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${Math.random() * 2 + 3}s`
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Eligibility Popup */}
//       <EligibilityPopup
//         isVisible={showPopup}
//         isEligible={eligibilityResult.isEligible}
//         onClose={handleClosePopup}
//         onProceed={handleProceed}
//         failedCriteria={eligibilityResult.failedCriteria}
//       />
//     </>
//   );
// };





import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Heart, AlertTriangle, User, Activity } from "lucide-react";
import axios from "axios";

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

interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone_number: string;
  district_name: string;
  blood_group: string;
  last_donation_date?: string;
  gender?: string;
}

interface PopupProps {
  isVisible: boolean;
  isEligible: boolean;
  onClose: () => void;
  onProceed: () => void;
  failedCriteria?: string[];
}

const EligibilityPopup: React.FC<PopupProps> = ({ 
  isVisible, 
  isEligible, 
  onClose, 
  onProceed, 
  failedCriteria = [] 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
        {isEligible ? (
          <>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Great News!</h2>
              <p className="text-green-100 mt-2">You're eligible to donate blood</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-gray-700 text-lg leading-relaxed">
                  Thank you for your willingness to save lives! Your donation can help up to 3 people in need.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onProceed}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Find Donation Centers
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
              <XCircle className="w-16 h-16 text-white mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Not Eligible</h2>
              <p className="text-red-100 mt-2">Unable to donate at this time</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Unfortunately, you don't meet the current eligibility criteria for blood donation.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-red-600 font-medium mb-2">Reasons for ineligibility:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {failedCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
              >
                Understood
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const BloodDonationEligibilityForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof EligibilityFormData, string>>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean;
    failedCriteria: string[];
  }>({ isEligible: false, failedCriteria: [] });

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Donor>(`http://localhost:9095/donors/profile`, { withCredentials: true });
        console.log("Fetched profile data:", response.data);
        const rawGender = response.data.gender || null;
        console.log("Raw gender value:", rawGender);
        const normalizedGender = rawGender ? rawGender.toLowerCase() : null;
        console.log("Normalized gender value:", normalizedGender);
        
        // Validate gender
        if (normalizedGender !== "male" && normalizedGender !== "female") {
          console.warn("Invalid gender value received:", normalizedGender);
          setErrors((prev) => ({
            ...prev,
            age: `Invalid gender value ("${normalizedGender || 'null'}"). Please update your profile to set gender as Male or Female. Please update your gender in the Profile section to proceed.`,
          }));
        }
        
        setGender(normalizedGender);
        
        // Reset female-specific fields if gender is male
        setFormData((prev) => ({
          ...prev,
          lastWholeBloodDonation: response.data.last_donation_date || null,
          isPregnantOrBreastfeeding: normalizedGender === "male" ? null : prev.isPregnantOrBreastfeeding,
          menstruationWeakness: normalizedGender === "male" ? null : prev.menstruationWeakness,
        }));
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 500 && err.response?.data?.message.includes("Authentication required")) {
          navigate("/login");
        } else {
          setErrors((prev) => ({
            ...prev,
            age: "Failed to load profile data. Please try again.",
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDonorProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "weight" || name === "hemoglobin"
          ? value === "" ? null : Number(value)
          : value || null,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getFailedCriteriaMessages = (failedCriteria: string[]): string[] => {
    const messages: { [key: string]: string } = {
      ageValid: "Age must be between 18 and 60 years",
      weightValid: "Weight must be at least 45 kg",
      hemoglobinValid: "Hemoglobin level must be at least 12.5 g/dL",
      goodHealthValid: "Must be in good general health",
      noFeverOrInfection: "Cannot have fever, infection, or flu-like symptoms",
      wholeBloodDonationValid: "Must wait at least 4 months since last whole blood donation",
      plateletDonationValid: "Must wait at least 2 weeks since last platelet donation",
      noRecentTattoo: "Cannot have had tattoo or piercing in past 6 months",
      notPregnantOrBreastfeeding: "Cannot be pregnant or breastfeeding",
      noRecentSurgery: "Cannot have had major surgery or transfusion in past 6-12 months",
      noRecentVaccination: "Cannot have had vaccination in past 2-4 weeks",
      noRecentAntibiotics: "Cannot have used antibiotics or had infection in past 2 weeks",
      noRecentDentalExtraction: "Cannot have had dental extraction in past week",
      noMenstruationWeakness: "Cannot donate while menstruating and feeling weak",
      noTravelMalaria: "Cannot have traveled to malaria-prone area in past 6 months",
      noChronicDisease: "Cannot have chronic diseases",
      noHepatitisOrHIV: "Cannot have tested positive for Hepatitis or HIV",
      noIntravenousDrugUse: "Cannot have history of intravenous drug use",
      noHighRiskSexualBehavior: "Cannot have engaged in high-risk sexual behavior"
    };
    
    return failedCriteria.map(criteria => messages[criteria] || criteria);
  };

  const validateForm = (): boolean => {
    console.log("Validating form with gender:", gender);
    const newErrors: Partial<Record<keyof EligibilityFormData, string>> = {};
    if (!id) {
      newErrors.age = "Invalid request ID.";
    }
    if (gender === null) {
      newErrors.age = "Gender information is missing. Please update your profile in the Profile section.";
    } else if (gender !== "male" && gender !== "female") {
      newErrors.age = `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female. Please update your gender in the Profile section to proceed.`;
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
    if (gender === "female" && formData.isPregnantOrBreastfeeding === null) {
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
    if (gender === "female" && formData.menstruationWeakness === null) {
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
    console.log("Form data on submit:", formData);
    console.log("Gender on submit:", gender);
    
    if (!validateForm() || !id) {
      if (!id) {
        setErrors((prev) => ({
          ...prev,
          age: "Invalid request ID. Please access this form from a valid blood request.",
        }));
      }
      return;
    }

    const eligibilityCriteria = {
      ageValid: formData.age !== null && formData.age >= 18 && formData.age <= 60,
      weightValid: formData.weight !== null && formData.weight >= 45,
      hemoglobinValid: formData.hemoglobin === null || formData.hemoglobin >= 12.5,
      goodHealthValid: formData.goodHealth === "yes",
      noFeverOrInfection: formData.hasFeverOrInfection === "no",
      wholeBloodDonationValid: formData.lastWholeBloodDonation === null || 
        new Date(formData.lastWholeBloodDonation) <= new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
      plateletDonationValid: formData.lastPlateletDonation === null || 
        new Date(formData.lastPlateletDonation) <= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      noRecentTattoo: formData.recentTattooOrPiercing === "no",
      notPregnantOrBreastfeeding: gender !== "female" || formData.isPregnantOrBreastfeeding === "no",
      noRecentSurgery: formData.recentSurgeryOrTransfusion === "no",
      noRecentVaccination: formData.recentVaccination === "no",
      noRecentAntibiotics: formData.recentAntibiotics === "no",
      noRecentDentalExtraction: formData.recentDentalExtraction === "no",
      noMenstruationWeakness: gender !== "female" || formData.menstruationWeakness === "no",
      noTravelMalaria: formData.travelMalariaArea === "no",
      noChronicDisease: formData.hasChronicDisease === "no",
      noHepatitisOrHIV: formData.hasHepatitisOrHIV === "no",
      noIntravenousDrugUse: formData.intravenousDrugUse === "no",
      noHighRiskSexualBehavior: formData.highRiskSexualBehavior === "no",
    };

    const isEligible = Object.values(eligibilityCriteria).every(criterion => criterion);
    const failedCriteria = Object.entries(eligibilityCriteria)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    setEligibilityResult({
      isEligible,
      failedCriteria: getFailedCriteriaMessages(failedCriteria)
    });
    setShowPopup(true);
  };

  const handleProceed = () => {
    navigate(`/donor/eligibility/${id}/result`, {
      state: { 
        isEligible: eligibilityResult.isEligible, 
        formData, 
        result: "You are eligible to donate blood! We will now check for nearby donation centers.",
        gender,
        failedCriteria: eligibilityResult.failedCriteria
      },
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (!eligibilityResult.isEligible) {
      navigate("/donor/bloodRequestsPage");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-red-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (errors.age && errors.age.includes("Failed to load profile data")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{errors.age}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Blood Donation <span className="text-red-500">Eligibility</span>
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Please answer the following questions to determine if you are eligible to donate blood for Request ID: <span className="font-semibold text-red-500">#{id}</span>
            </p>
          </div>

          {/* Main Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
              {/* Gender Warning */}
              {(gender === null || (gender !== "male" && gender !== "female")) && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                  <div className="flex items-center text-white">
                    <User className="w-6 h-6 mr-3" />
                    <div>
                      <p className="font-semibold">
                        {gender === null
                          ? "Your profile does not have gender information."
                          : `Invalid gender value ("${gender}"). Please update your profile to set gender as Male or Female. Please update your gender in the Profile section to proceed.`}
                      </p>
                      <p className="text-red-100 mt-1">
                        Please update your gender in the{" "}
                        <a href="/donor/profile" className="underline hover:text-white font-medium">
                          Profile section
                        </a>{" "}
                        to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 md:p-12">
                {/* General Questions Section */}
                <div className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">General Health Information</h2>
                  </div>

                  {/* Age Input */}
                  <div className="mb-8">
                    <label className="block text-gray-800 font-semibold text-lg mb-3">
                      What is your age? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age !== null ? formData.age : ""}
                      onChange={handleChange}
                      className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
                      placeholder="Enter your age"
                      required
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.age}
                      </p>
                    )}
                  </div>

                  {/* Weight Input */}
                  <div className="mb-8">
                    <label className="block text-gray-800 font-semibold text-lg mb-3">
                      What is your weight (in kg)? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight !== null ? formData.weight : ""}
                      onChange={handleChange}
                      className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
                      placeholder="Enter your weight in kg"
                      required
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  {/* Hemoglobin Input */}
                  <div className="mb-8">
                    <label className="block text-gray-800 font-semibold text-lg mb-3">
                      What is your hemoglobin level (g/dL)? <span className="text-gray-500">(Leave blank if unknown)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="hemoglobin"
                      value={formData.hemoglobin !== null ? formData.hemoglobin : ""}
                      onChange={handleChange}
                      className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
                      placeholder="Enter hemoglobin level (e.g., 12.5)"
                    />
                    {errors.hemoglobin && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.hemoglobin}
                      </p>
                    )}
                  </div>

                  {/* General Radio Button Questions */}
                  {[
                    { name: "goodHealth", label: "Are you in good general health?", required: true },
                    { name: "hasFeverOrInfection", label: "Do you have a fever, infection, or flu-like symptoms?", required: true },
                    { name: "recentTattooOrPiercing", label: "Have you had a tattoo or piercing in the past 6 months?", required: true },
                    { name: "recentSurgeryOrTransfusion", label: "Have you had major surgery or a blood transfusion in the past 6–12 months?", required: true },
                    { name: "recentVaccination", label: "Have you had a vaccination in the past 2–4 weeks?", required: true },
                    { name: "recentAntibiotics", label: "Have you used antibiotics or had an infection in the past 2 weeks?", required: true },
                    { name: "recentDentalExtraction", label: "Have you had a dental extraction in the past 1 week?", required: true },
                    { name: "travelMalariaArea", label: "Have you traveled to a malaria-prone area in the past 6 months?", required: true },
                    { name: "hasChronicDisease", label: "Do you have chronic diseases (e.g., diabetes, cancer, epilepsy, heart disease, severe asthma)?", required: true },
                    { name: "hasHepatitisOrHIV", label: "Have you tested positive for Hepatitis B, Hepatitis C, or HIV/AIDS?", required: true },
                    { name: "intravenousDrugUse", label: "Have you ever used intravenous drugs?", required: true },
                    { name: "highRiskSexualBehavior", label: "Have you engaged in high-risk sexual behavior?", required: true },
                  ].map((question) => (
                    <div key={question.name} className="mb-8">
                      <label className="block text-gray-800 font-semibold text-lg mb-4">
                        {question.label} {question.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name={question.name}
                            value="yes"
                            checked={formData[question.name as keyof EligibilityFormData] === "yes"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name={question.name}
                            value="no"
                            checked={formData[question.name as keyof EligibilityFormData] === "no"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
                        </label>
                      </div>
                      {errors[question.name as keyof EligibilityFormData] && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors[question.name as keyof EligibilityFormData]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Date Inputs */}
                  <div className="mb-8">
                    <label className="block text-gray-800 font-semibold text-lg mb-3">
                      When was your last whole blood donation? <span className="text-gray-500">(Leave blank if none)</span>
                    </label>
                    <input
                      type="date"
                      name="lastWholeBloodDonation"
                      value={formData.lastWholeBloodDonation || ""}
                      onChange={handleChange}
                      className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-gray-800 font-semibold text-lg mb-3">
                      When was your last platelet donation? <span className="text-gray-500">(Leave blank if none)</span>
                    </label>
                    <input
                      type="date"
                      name="lastPlateletDonation"
                      value={formData.lastPlateletDonation || ""}
                      onChange={handleChange}
                      className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-lg transition-all duration-200 hover:border-red-300"
                    />
                  </div>
                </div>

                {/* Additional Questions for Female Donors */}
                {gender === "female" && (
                  <div className="mb-12">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">Additional Questions for Female Donors</h2>
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-800 font-semibold text-lg mb-4">
                        Are you pregnant or breastfeeding (in the past 6 months)? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="isPregnantOrBreastfeeding"
                            value="yes"
                            checked={formData.isPregnantOrBreastfeeding === "yes"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="isPregnantOrBreastfeeding"
                            value="no"
                            checked={formData.isPregnantOrBreastfeeding === "no"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
                        </label>
                      </div>
                      {errors.isPregnantOrBreastfeeding && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.isPregnantOrBreastfeeding}
                        </p>
                      )}
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-800 font-semibold text-lg mb-4">
                        Are you menstruating and feeling weak or anemic? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="menstruationWeakness"
                            value="yes"
                            checked={formData.menstruationWeakness === "yes"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="menstruationWeakness"
                            value="no"
                            checked={formData.menstruationWeakness === "no"}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
                          />
                          <span className="text-lg group-hover:text-red-500 transition-colors">No</span>
                        </label>
                      </div>
                      {errors.menstruationWeakness && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.menstruationWeakness}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={gender === null || (gender !== "male" && gender !== "female")}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Check Eligibility
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/donor/bloodRequestsPage")}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Back to Requests
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Floating Hearts Animation */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-red-200 opacity-20 animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Eligibility Popup */}
      <EligibilityPopup
        isVisible={showPopup}
        isEligible={eligibilityResult.isEligible}
        onClose={handleClosePopup}
        onProceed={handleProceed}
        failedCriteria={eligibilityResult.failedCriteria}
      />
    </>
  );
};