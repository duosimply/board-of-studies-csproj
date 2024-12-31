// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";

// export default function CompareCourse() {
//   const [courseDescription, setCourseDescription] = useState(null);
//   const [courseChanges, setCourseChanges] = useState([]);
//   const [error, setError] = useState(null);
//   const [updatedDescription, setUpdatedDescription] = useState({
//     context: "",
//     approach: "",
//     experiences: "", // Note we'll map 'experience' to 'experiences'
//   });
//   const params = useParams();
//   const courseId = params.course_id;

//   useEffect(() => {
//     const fetchDescription = async () => {
//       try {
//         const res = await fetch(`/api/description/${courseId}`);
//         const data = await res.json();

//         console.log("Fetched description data:", data);

//         if (res.ok && Array.isArray(data) && data.length > 0) {
//           // Take the first item from the array
//           const description = data[0];
//           setCourseDescription(description);

//           // Map the API response to our state structure
//           // Note that 'experience' in API is mapped to 'experiences' in our state
//           setUpdatedDescription({
//             context: description.context || "",
//             approach: description.approach || "",
//             experiences: description.experience || "", // Note the field name difference
//           });
//         } else {
//           setError("Failed to fetch course description or invalid data format");
//         }
//       } catch (err) {
//         console.error("Error fetching description:", err);
//         setError("Failed to fetch course description");
//       }
//     };

//     if (courseId) {
//       fetchDescription();
//     }
//   }, [courseId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedDescription((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Debug effect to monitor state changes
//   useEffect(() => {
//     console.log("Current courseDescription:", courseDescription);
//     console.log("Current updatedDescription:", updatedDescription);
//   }, [courseDescription, updatedDescription]);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         let res = await fetch(`/api/compare/${courseId}`);
//         let data = await res.json();

//         if (!res.ok || !data || Object.keys(data).length === 0) {
//           res = await fetch(`/api/course/${courseId}`);
//           data = await res.json();

//           if (res.ok && data && Object.keys(data).length > 0) {
//             const changes = Object.keys(data).map((field) => ({
//               field_name: field,
//               previous_value: data[field] || "NULL",
//               updated_value: "-",
//               operation_type: "not changed",
//               changed_at: new Date().toLocaleDateString(),
//             }));

//             setCourseChanges(changes);
//             return;
//           }

//           setError("No data found in both APIs");
//           return;
//         }

//         const comparisonData = data
//           .map((entry) => {
//             const { previous_value, updated_value, change_status, changed_at } =
//               entry;
//             const changes = [];

//             // Flatten the previous_value and updated_value for comparison
//             Object.keys(previous_value).forEach((field) => {
//               const prevVal = previous_value[field] || "NULL";
//               const updatedVal = updated_value[field] || "NULL";
//               const status =
//                 prevVal === updatedVal ? "No Change" : change_status;

//               changes.push({
//                 field_name: field,
//                 previous_value: prevVal,
//                 updated_value: updatedVal,
//                 operation_type: status,
//                 changed_at: new Date().toLocaleDateString(),
//               });
//             });

//             return changes;
//           })
//           .flat(); // Flatten the array of changes

//         setCourseChanges(comparisonData);
//       } catch (err) {
//         setError("Failed to fetch course details from compare API");
//       }
//     };

//     if (courseId) {
//       fetchCourseDetails();
//     }
//   }, [courseId, courseDescription]);

//   const [contentChanges, setContentChanges] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchContentDetails = async () => {
//       try {
//         // Fetch log_course_content data
//         let response = await fetch(`/api/log_content/${courseId}`);
//         let responseData = await response.json();

//         if (!response.ok || !responseData || responseData.length === 0) {
//           // Fallback to CourseContent API if log_course_content has no data
//           response = await fetch(`/api/content/${courseId}`);
//           responseData = await response.json();

//           if (response.ok && responseData && responseData[0]?.chapters) {
//             const { chapters } = responseData[0];
//             const changes = chapters.split("|").map((chapter, index) => ({
//               field_name: `Chapter ${index + 1}`,
//               previous_value: chapter.trim() || "NULL",
//               updated_value: "-",
//               operation_type: "not changed",
//               changed_at: new Date().toLocaleDateString(),
//             }));

//             setContentChanges(changes);
//             return;
//           }

//           setErrorMessage("No data found in both APIs");
//           return;
//         }

//         // Process log_course_content data for comparison
//         const comparisonData = responseData.flatMap((entry) => {
//           const { old_chapter_text, new_chapter_text, action, timestamp } =
//             entry;

//           const oldChapters = old_chapter_text
//             ? old_chapter_text.split("|").map((chapter) => chapter.trim())
//             : ["NULL"];
//           const newChapters = new_chapter_text
//             ? new_chapter_text.split("|").map((chapter) => chapter.trim())
//             : ["NULL"];

//           return oldChapters.map((oldChapter, index) => {
//             const newChapter = newChapters[index] || "NULL";

//             // Determine the operation type
//             let operationType = "No Change";
//             if (oldChapter === "NULL" && newChapter !== "NULL") {
//               operationType = "Added";
//             } else if (oldChapter !== "NULL" && newChapter === "NULL") {
//               operationType = "Removed";
//             } else if (oldChapter !== newChapter) {
//               operationType = "Updated";
//             }
//             const validTimestamp = timestamp
//               ? new Date(timestamp).toLocaleDateString()
//               : new Date().toLocaleDateString();

//             return {
//               field_name: `Chapter ${index + 1}`,
//               previous_value: oldChapter,
//               updated_value: newChapter,
//               operation_type: operationType,
//               changed_at: validTimestamp,
//             };
//           });
//         });

//         setContentChanges(comparisonData);
//       } catch (error) {
//         setErrorMessage("Failed to fetch course content details");
//       }
//     };

//     fetchContentDetails();
//   }, [courseId]);

//   const handleSave = async () => {
//     try {
//       const apiData = {
//         context: updatedDescription.context || courseDescription.context || "",
//         approach:
//           updatedDescription.approach || courseDescription.approach || "",
//         experiences:
//           updatedDescription.experiences || courseDescription.experience || "", // Map back to 'experience'
//       };

//       console.log("Payload to save:", apiData); // Debugging log

//       const res = await fetch(`/api/save_description/${courseId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Course description updated successfully!");
//       } else {
//         setError(data.error || "Failed to save course description");
//       }
//     } catch (err) {
//       console.error("Error saving description:", err);
//       setError("Failed to save course description");
//     }
//   };

//   if (error) {
//     return <pre>{JSON.stringify(error, null, 2)}</pre>;
//   }

//   if (!courseDescription) {
//     return <p>Loading course description...</p>;
//   }

//   // return (
//   //   <div className="p-4">
//   //     <h1 className="text-2xl font-bold mb-4">
//   //       Course Description for Course ID: {courseId}
//   //     </h1>

//   //     <div className="mb-4">
//   //       <h2 className="text-xl font-semibold mb-2">Context</h2>
//   //       <textarea
//   //         name="context"
//   //         value={updatedDescription.context || ""}
//   //         onChange={handleChange}
//   //         rows={5}
//   //         cols={50}
//   //         className="w-full p-2 border rounded"
//   //       />
//   //     </div>

//   //     <div className="mb-4">
//   //       <h2 className="text-xl font-semibold mb-2">Approach</h2>
//   //       <textarea
//   //         name="approach"
//   //         value={updatedDescription.approach || ""}
//   //         onChange={handleChange}
//   //         rows={5}
//   //         cols={50}
//   //         className="w-full p-2 border rounded"
//   //       />
//   //     </div>

//   //     <div className="mb-4">
//   //       <h2 className="text-xl font-semibold mb-2">Experiences</h2>
//   //       <textarea
//   //         name="experiences"
//   //         value={updatedDescription.experiences || ""}
//   //         onChange={handleChange}
//   //         rows={5}
//   //         cols={50}
//   //         className="w-full p-2 border rounded"
//   //       />
//   //     </div>

//   //     <button
//   //       onClick={handleSave}
//   //       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
//   //     >
//   //       Save
//   //     </button>
//   //     <div className="mt-8">
//   //       {courseChanges.length === 0 ? (
//   //         <p>No changes found for this course.</p>
//   //       ) : (
//   //         <div>
//   //           <h2 className="text-2xl font-bold mb-4">Course Change History</h2>
//   //           <div className="overflow-x-auto">
//   //             <table className="min-w-full border-collapse border border-gray-200">
//   //               <thead>
//   //                 <tr className="bg-gray-100">
//   //                   <th className="border border-gray-200 p-2">Field Name</th>
//   //                   <th className="border border-gray-200 p-2">Old Value</th>
//   //                   <th className="border border-gray-200 p-2">New Value</th>
//   //                   <th className="border border-gray-200 p-2">Change Type</th>
//   //                   <th className="border border-gray-200 p-2">Changed At</th>
//   //                 </tr>
//   //               </thead>
//   //               <tbody>
//   //                 {courseChanges.map((change, index) => (
//   //                   <tr key={index} className="hover:bg-gray-50">
//   //                     <td className="border border-gray-200 p-2">
//   //                       {change.field_name}
//   //                     </td>
//   //                     <td className="border border-gray-200 p-2">
//   //                       {JSON.stringify(change.previous_value)}
//   //                     </td>
//   //                     <td className="border border-gray-200 p-2">
//   //                       {JSON.stringify(change.updated_value)}
//   //                     </td>
//   //                     <td className="border border-gray-200 p-2">
//   //                       {change.operation_type}
//   //                     </td>
//   //                     <td className="border border-gray-200 p-2">
//   //                       {new Date(change.changed_at).toLocaleString()}
//   //                     </td>
//   //                   </tr>
//   //                 ))}
//   //               </tbody>
//   //             </table>
//   //           </div>
//   //         </div>
//   //       )}
//   //     </div>

//   //     <div>
//   //       {errorMessage ? (
//   //         <p style={{ color: "red" }}>{errorMessage}</p>
//   //       ) : (
//   //         <table
//   //           border="1"
//   //           style={{ width: "100%", borderCollapse: "collapse" }}
//   //         >
//   //           <thead>
//   //             <tr>
//   //               <th>Field Name</th>
//   //               <th>Previous Value</th>
//   //               <th>Updated Value</th>
//   //               <th>Operation Type</th>
//   //               <th>Changed At</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             {contentChanges.map((change, index) => (
//   //               <tr key={index}>
//   //                 <td>{change.field_name}</td>
//   //                 <td>{change.previous_value}</td>
//   //                 <td>{change.updated_value}</td>
//   //                 <td>{change.operation_type}</td>
//   //                 <td>{new Date(change.changed_at).toLocaleString()}</td>
//   //               </tr>
//   //             ))}
//   //           </tbody>
//   //         </table>
//   //       )}
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">
//         Course Description for Course ID: {courseId}
//       </h1>

//       <div className="mb-4">
//         <h2 className="text-xl font-semibold mb-2">Context</h2>
//         <textarea
//           name="context"
//           value={updatedDescription.context || ""}
//           onChange={handleChange}
//           rows={5}
//           cols={50}
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <h2 className="text-xl font-semibold mb-2">Approach</h2>
//         <textarea
//           name="approach"
//           value={updatedDescription.approach || ""}
//           onChange={handleChange}
//           rows={5}
//           cols={50}
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <h2 className="text-xl font-semibold mb-2">Experiences</h2>
//         <textarea
//           name="experiences"
//           value={updatedDescription.experiences || ""}
//           onChange={handleChange}
//           rows={5}
//           cols={50}
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <button
//         onClick={handleSave}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
//       >
//         Save
//       </button>

//       <div className="mt-8">
//         {courseChanges.length === 0 && contentChanges.length === 0 ? (
//           <p>No changes found for this course.</p>
//         ) : (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">
//               Course and Content Change History
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-200 p-2">
//                       Change Source
//                     </th>
//                     <th className="border border-gray-200 p-2">Field Name</th>
//                     <th className="border border-gray-200 p-2">Old Value</th>
//                     <th className="border border-gray-200 p-2">New Value</th>
//                     <th className="border border-gray-200 p-2">Change Type</th>
//                     <th className="border border-gray-200 p-2">Changed At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Merge both courseChanges and contentChanges */}
//                   {[...courseChanges, ...contentChanges].map(
//                     (change, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="border border-gray-200 p-2">
//                           {/* Determine if the change is from course or content */}
//                           {courseChanges.includes(change)
//                             ? "Course"
//                             : "Content"}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {change.field_name}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {JSON.stringify(change.previous_value)}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {JSON.stringify(change.updated_value)}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {change.operation_type}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {new Date(change.changed_at).toLocaleString()}
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* <div>
//         {errorMessage ? (
//           <p style={{ color: "red" }}>{errorMessage}</p>
//         ) : (
//           <table
//             border="1"
//             style={{ width: "100%", borderCollapse: "collapse" }}
//           >
//             <thead>
//               <tr>
//                 <th>Field Name</th>
//                 <th>Previous Value</th>
//                 <th>Updated Value</th>
//                 <th>Operation Type</th>
//                 <th>Changed At</th>
//               </tr>
//             </thead>
//             <tbody>

//               {[...courseChanges, ...contentChanges].map((change, index) => (
//                 <tr key={index}>
//                   <td>{change.field_name}</td>
//                   <td>{change.previous_value}</td>
//                   <td>{change.updated_value}</td>
//                   <td>{change.operation_type}</td>
//                   <td>{new Date(change.changed_at).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div> */}
//     </div>
//   );
// }

// useEffect(() => {
//   const fetchContentDetails = async () => {
//     try {
//       // Fetch log_course_content data
//       let response = await fetch(`/api/log_content/${courseId}`);
//       let responseData = await response.json();

//       if (!response.ok || !responseData || responseData.length === 0) {
//         // Fallback to CourseContent API if log_course_content has no data
//         response = await fetch(`/api/content/${courseId}`);
//         responseData = await response.json();

//         if (response.ok && responseData && responseData[0]?.chapters) {
//           const { chapters } = responseData[0];
//           const changes = chapters.split("|").map((chapter, index) => ({
//             field_name: `Chapter ${index + 1}`,
//             previous_value: chapter.trim() || "NULL",
//             updated_value: "-",
//             operation_type: "not changed",
//             changed_at: new Date().toLocaleDateString(),
//           }));

//           setContentChanges(changes);
//           return;
//         }

//         setErrorMessage("No data found in both APIs");
//         return;
//       }

//       // Process log_course_content data for comparison
//       const comparisonData = responseData.flatMap((entry) => {
//         const { old_chapter_text, new_chapter_text, action, timestamp } =
//           entry;

//         const oldChapters = old_chapter_text
//           ? old_chapter_text.split("|").map((chapter) => chapter.trim())
//           : ["NULL"];
//         const newChapters = new_chapter_text
//           ? new_chapter_text.split("|").map((chapter) => chapter.trim())
//           : ["NULL"];

//         return oldChapters.map((oldChapter, index) => {
//           const newChapter = newChapters[index] || "NULL";

//           // Determine the operation type
//           let operationType = "No Change";
//           if (oldChapter === "NULL" && newChapter !== "NULL") {
//             operationType = "Added";
//           } else if (oldChapter !== "NULL" && newChapter === "NULL") {
//             operationType = "Removed";
//           } else if (oldChapter !== newChapter) {
//             operationType = "Updated";
//           }
//           const validTimestamp = timestamp
//             ? new Date(timestamp).toLocaleDateString()
//             : new Date().toLocaleDateString();

//           return {
//             field_name: `Chapter ${index + 1}`,
//             previous_value: oldChapter,
//             updated_value: newChapter,
//             operation_type: operationType,
//             changed_at: validTimestamp,
//           };
//         });
//       });

//       setContentChanges(comparisonData);
//     } catch (error) {
//       setErrorMessage("Failed to fetch course content details");
//     }
//   };

//   fetchContentDetails();
// }, [courseId]);

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf"; // Import jsPDF
export default function CompareCourse() {
  const [courseDescription, setCourseDescription] = useState(null);
  const [courseChanges, setCourseChanges] = useState([]);
  const [error, setError] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState({
    context: "",
    approach: "",
    experiences: "", // Note we'll map 'experience' to 'experiences'
  });
  const params = useParams();
  const courseId = params.course_id;

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const res = await fetch(`/api/description/${courseId}`);
        const data = await res.json();

        console.log("Fetched description data:", data);

        if (res.ok && Array.isArray(data) && data.length > 0) {
          // Take the first item from the array
          const description = data[0];
          setCourseDescription(description);

          // Map the API response to our state structure
          // Note that 'experience' in API is mapped to 'experiences' in our state
          setUpdatedDescription({
            context: description.context || "",
            approach: description.approach || "",
            experiences: description.experience || "", // Note the field name difference
          });
        } else {
          setError("Failed to fetch course description or invalid data format");
        }
      } catch (err) {
        console.error("Error fetching description:", err);
        setError("Failed to fetch course description");
      }
    };

    if (courseId) {
      fetchDescription();
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log("Current courseDescription:", courseDescription);
    console.log("Current updatedDescription:", updatedDescription);
  }, [courseDescription, updatedDescription]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        let res = await fetch(`/api/compare/${courseId}`);
        let data = await res.json();

        if (!res.ok || !data || Object.keys(data).length === 0) {
          // Fallback to the course API
          res = await fetch(`/api/course/${courseId}`);
          data = await res.json();

          if (res.ok && data && Object.keys(data).length > 0) {
            // Process fallback data
            const changes = Object.keys(data).map((field) => {
              if (
                ["lect_points", "tut_points", "pract_points"].includes(field)
              ) {
                return null; // Skip individual fields
              }
              return {
                field_name: field,
                previous_value: data[field] || "NULL",
                updated_value: data[field] || "NULL",
                operation_type: "not changed",
                changed_at: new Date().toLocaleDateString(),
              };
            });

            // Add combined l-t-p row
            const ltpPrev = ["lect_points", "tut_points", "pract_points"]
              .map((field) => data[field] || 0)
              .join("-");
            changes.push({
              field_name: "l-t-p",
              previous_value: ltpPrev,
              updated_value: ltpPrev,
              operation_type: "not changed",
              changed_at: new Date().toLocaleDateString(),
            });

            setCourseChanges(changes.filter(Boolean)); // Remove null entries
            return;
          }

          setError("No data found in both APIs");
          return;
        }

        // Process comparison API data
        const comparisonData = data
          .map((entry) => {
            const { previous_value, updated_value, change_status } = entry;
            const changes = [];

            // Combine l-t-p
            const ltpFields = ["lect_points", "tut_points", "pract_points"];
            const ltpPrev = ltpFields
              .map((field) => previous_value[field] || 0)
              .join("-");
            const ltpUpdated = ltpFields
              .map((field) => updated_value[field] || 0)
              .join("-");
            changes.push({
              field_name: "l-t-p",
              previous_value: ltpPrev,
              updated_value: ltpUpdated,
              operation_type:
                ltpPrev === ltpUpdated ? "No Change" : change_status,
              changed_at: new Date().toLocaleDateString(),
            });

            // Process other fields
            Object.keys(previous_value).forEach((field) => {
              if (!ltpFields.includes(field)) {
                const prevVal = previous_value[field] || "NULL";
                const updatedVal = updated_value[field] || "NULL";
                const status =
                  prevVal === updatedVal ? "No Change" : change_status;

                changes.push({
                  field_name: field,
                  previous_value: prevVal,
                  updated_value: updatedVal,
                  operation_type: status,
                  changed_at: new Date().toLocaleDateString(),
                });
              }
            });

            return changes;
          })
          .flat(); // Flatten the array of changes

        setCourseChanges(comparisonData);
      } catch (err) {
        setError("Failed to fetch course details from compare API");
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, courseDescription]);

  const [contentChanges, setContentChanges] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   const fetchContentDetails = async () => {
  //     try {
  //       let response = await fetch(`/api/log_content/${courseId}`);
  //       let responseData = await response.json();

  //       if (!response.ok || !responseData || responseData.length === 0) {
  //         // Fallback to CourseContent API if log_course_content has no data
  //         response = await fetch(`/api/content/${courseId}`);
  //         responseData = await response.json();

  //         if (response.ok && responseData && responseData[0]?.chapters) {
  //           const { chapters } = responseData[0];
  //           const orderedChapters = chapters
  //             .split("|")
  //             // .map(
  //             //   (chapter, index) =>
  //             //     `${index + 1}. ${chapter.split(",")[0].trim()}`
  //             .map((chapter) => chapter.split(",")[0].trim())
  //             .join(", "); // Join chapters with a comma and space

  //           const changes = [
  //             {
  //               field_name: "Chapters",
  //               previous_value: orderedChapters,
  //               updated_value: orderedChapters,
  //               operation_type: "Not Changed",
  //               changed_at: new Date().toLocaleDateString(),
  //             },
  //           ];

  //           setContentChanges(changes);
  //           return;
  //         }

  //         setErrorMessage("No data found in both APIs");
  //         return;
  //       }

  //       // Process log_course_content data for comparison
  //       const groupedChanges = responseData.reduce(
  //         (acc, entry) => {
  //           const { old_chapter_text, new_chapter_text, action, timestamp } =
  //             entry;

  //           const oldChapters = old_chapter_text
  //             ? old_chapter_text
  //                 .split("|")
  //                 //     .map(
  //                 //       (chapter, index) =>
  //                 //         `${index + 1}. ${chapter.split(",")[0].trim()}`
  //                 //     )
  //                 // : ["1. NULL"];
  //                 .map((chapter) => chapter.split(",")[0].trim()) // Get chapter names only
  //             : ["NULL"];
  //           const newChapters = new_chapter_text
  //             ? new_chapter_text
  //                 .split("|")
  //                 //     .map(
  //                 //       (chapter, index) =>
  //                 //         `${index + 1}. ${chapter.split(",")[0].trim()}`
  //                 //     )
  //                 // : ["1. NULL"];
  //                 .map((chapter) => chapter.split(",")[0].trim()) // Get chapter names only
  //             : ["NULL"];

  //           acc.old = oldChapters.join(", "); // Join with a comma and space for same row
  //           acc.new = newChapters.join(", ");
  //           acc.operationType =
  //             oldChapters.join(", ") === newChapters.join(", ")
  //               ? "No Change"
  //               : "Updated";
  //           acc.changedAt = timestamp
  //             ? new Date(timestamp).toLocaleDateString()
  //             : new Date().toLocaleDateString();

  //           return acc;
  //         },
  //         { old: "", new: "", operationType: "No Change", changedAt: "" }
  //       );

  //       const comparisonData = [
  //         {
  //           field_name: "Chapters",
  //           previous_value: groupedChanges.old || "NULL",
  //           updated_value: groupedChanges.new || "NULL",
  //           operation_type: groupedChanges.operationType,
  //           changed_at: groupedChanges.changedAt,
  //         },
  //       ];

  //       setContentChanges(comparisonData);
  //     } catch (error) {
  //       setErrorMessage("Failed to fetch course content details");
  //     }
  //   };

  //   fetchContentDetails();
  // }, [courseId]);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        let response = await fetch(`/api/log_content/${courseId}`);
        let responseData = await response.json();

        if (!response.ok || !responseData || responseData.length === 0) {
          // Fallback to CourseContent API if log_course_content has no data
          response = await fetch(`/api/content/${courseId}`);
          responseData = await response.json();

          if (response.ok && responseData && responseData[0]?.chapters) {
            const { chapters } = responseData[0];
            const orderedChapters = chapters
              .split("|")
              .map((chapter, index) => {
                const chapterName = chapter.split(",")[0].trim();
                return `${index + 1}. ${chapterName}`; // Ensure number + name
              })
              .join(", "); // Join chapters with a comma and space

            const changes = [
              {
                field_name: "Chapters",
                previous_value: orderedChapters,
                updated_value: orderedChapters,
                operation_type: "Not Changed",
                changed_at: new Date().toLocaleDateString(),
              },
            ];

            setContentChanges(changes);
            return;
          }

          setErrorMessage("No data found in both APIs");
          return;
        }

        // Process log_course_content data for comparison
        const groupedChanges = responseData.reduce(
          (acc, entry) => {
            const { old_chapter_text, new_chapter_text, action, timestamp } =
              entry;

            const oldChapters = old_chapter_text
              ? old_chapter_text.split("|").map((chapter, index) => {
                  const chapterName = chapter.split(",")[0].trim();
                  return `${index + 1}. ${chapterName}`; // Ensure number + name
                })
              : ["1. NULL"];
            const newChapters = new_chapter_text
              ? new_chapter_text.split("|").map((chapter, index) => {
                  const chapterName = chapter.split(",")[0].trim();
                  return `${index + 1}. ${chapterName}`; // Ensure number + name
                })
              : ["1. NULL"];

            acc.old = oldChapters.join(", "); // Join with a comma and space for same row
            acc.new = newChapters.join(", ");
            acc.operationType =
              oldChapters.join(", ") === newChapters.join(", ")
                ? "No Change"
                : "Updated";
            acc.changedAt = timestamp
              ? new Date(timestamp).toLocaleDateString()
              : new Date().toLocaleDateString();

            return acc;
          },
          { old: "", new: "", operationType: "No Change", changedAt: "" }
        );

        const comparisonData = [
          {
            field_name: "Chapters",
            previous_value: groupedChanges.old || "NULL",
            updated_value: groupedChanges.new || "NULL",
            operation_type: groupedChanges.operationType,
            changed_at: groupedChanges.changedAt,
          },
        ];

        setContentChanges(comparisonData);
      } catch (error) {
        setErrorMessage("Failed to fetch course content details");
      }
    };

    fetchContentDetails();
  }, [courseId]);

  const handleSave = async () => {
    try {
      const apiData = {
        context: updatedDescription.context || courseDescription.context || "",
        approach:
          updatedDescription.approach || courseDescription.approach || "",
        experiences:
          updatedDescription.experiences || courseDescription.experience || "", // Map back to 'experience'
      };

      console.log("Payload to save:", apiData); // Debugging log

      const res = await fetch(`/api/save_description/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Course description updated successfully!");
      } else {
        setError(data.error || "Failed to save course description");
      }
    } catch (err) {
      console.error("Error saving description:", err);
      setError("Failed to save course description");
    }
  };

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  if (!courseDescription) {
    return <p>Loading course description...</p>;
  }
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 20;

    const addWrappedText = (text, y) => {
      const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(splitText, margin, y);
      return y + splitText.length * 7;
    };

    // Standard header and description sections remain the same
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    yPosition = addWrappedText(
      `Course Change Summary for Course ID: ${courseId}`,
      yPosition
    );
    yPosition += 15;

    ["Context", "Approach", "Experiences"].forEach((section) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(section, margin, yPosition);
      yPosition += 8;
      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        updatedDescription[section.toLowerCase()] || "",
        yPosition
      );
      yPosition += 12;
    });

    // Table setup (removed "Source" column)
    doc.setFont("helvetica", "bold");
    doc.text("Course and Content Change History", margin, yPosition);
    yPosition += 12;

    const headers = ["Field", "Old Value", "New Value", "Change Type", "Date"]; // Removed "Source" header
    const columnWidths = [45, 35, 35, 30, 30]; // Adjusted column widths (no "Source" column)
    const startX = margin;
    const baseRowHeight = 12;

    // Table headers (removed "Source" header)
    let currentX = startX;
    doc.setFillColor(240, 240, 240);
    doc.rect(startX, yPosition - 5, pageWidth - margin * 2, baseRowHeight, "F");
    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, currentX, yPosition);
      currentX += columnWidths[i];
    });
    yPosition += baseRowHeight;

    // Table content with increased spacing (removed "Source" column)
    const changes = [...courseChanges, ...contentChanges];
    changes.forEach((change) => {
      if (yPosition > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont("helvetica", "normal");
      currentX = startX;
      doc.setFontSize(10);

      const rowData = [
        change.field_name,
        String(change.previous_value),
        String(change.updated_value),
        change.operation_type,
        new Date(change.changed_at).toLocaleDateString(),
      ]; // Removed the "Source" field from rowData

      // Significantly increased spacing for content fields
      const hasLongContent =
        change.previous_value?.length > 50 || change.updated_value?.length > 50;
      const rowHeight = hasLongContent ? baseRowHeight * 6 : baseRowHeight;

      // Add extra space before row with long content
      if (hasLongContent) {
        yPosition += baseRowHeight;
      }

      rowData.forEach((text, i) => {
        const wrappedText = doc.splitTextToSize(text, columnWidths[i] - 2);
        doc.text(wrappedText, currentX, yPosition);
        currentX += columnWidths[i];
      });

      yPosition += rowHeight;

      // Add extra space after row with long content
      if (hasLongContent) {
        yPosition += baseRowHeight;
      }
    });

    doc.save(`Course_Change_Summary_${courseId}.pdf`);
  };

  return (
    <div className="p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Course change Summary for Course ID: {courseId}
      </h1>
      <div className="p-6 bg-white text-gray-900">
        <button
          onClick={downloadPDF}
          className="absolute top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Download as PDF
        </button>

        {/* Your existing content table */}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-500">Context</h2>
        <textarea
          name="context"
          value={updatedDescription.context || ""}
          onChange={handleChange}
          rows={3}
          cols={30}
          className="w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-500">Approach</h2>
        <textarea
          name="approach"
          value={updatedDescription.approach || ""}
          onChange={handleChange}
          rows={3}
          cols={30}
          className="w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-500">
          Experiences
        </h2>
        <textarea
          name="experiences"
          value={updatedDescription.experiences || ""}
          onChange={handleChange}
          rows={3}
          cols={30}
          className="w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-6"
      >
        Save
      </button>

      <div className="mt-8">
        {courseChanges.length === 0 && contentChanges.length === 0 ? (
          <p className="text-gray-600">No changes found for this course.</p>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              Summary Change
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 p-3 text-left text-blue-600">
                      Field Name
                    </th>
                    <th className="border border-gray-200 p-3 text-left text-blue-600">
                      Previous Value
                    </th>
                    <th className="border border-gray-200 p-3 text-left text-blue-600">
                      Updated Value
                    </th>
                    <th className="border border-gray-200 p-3 text-left text-blue-600">
                      Operation Type
                    </th>
                    <th className="border border-gray-200 p-3 text-left text-blue-600">
                      Changed At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[...courseChanges, ...contentChanges].map(
                    (change, index) => (
                      <tr key={index} className="even:bg-blue-50">
                        <td className="border border-gray-200 p-3 text-gray-700">
                          {change.field_name}
                        </td>
                        <td className="border border-gray-200 p-3 text-gray-700">
                          {/* Render previous_value with line breaks */}
                          {typeof change.previous_value === "string" ? (
                            change.previous_value
                              .split(", ") // Split by ", " to handle the list
                              .map((item, i) => (
                                <span key={i}>
                                  {item}
                                  <br />
                                </span>
                              ))
                          ) : (
                            <span>{change.previous_value || "N/A"}</span>
                          )}
                        </td>
                        <td className="border border-gray-200 p-3 text-gray-700">
                          {/* Render updated_value with line breaks */}
                          {typeof change.updated_value === "string" ? (
                            change.updated_value
                              .split(", ") // Split by ", " to handle the list
                              .map((item, i) => (
                                <span key={i}>
                                  {item}
                                  <br />
                                </span>
                              ))
                          ) : (
                            <span>{change.updated_value || "N/A"}</span>
                          )}
                        </td>
                        <td
                          className={`border border-gray-200 p-3 ${
                            change.operation_type === "Updated"
                              ? "text-yellow-600"
                              : change.operation_type === "Added"
                              ? "text-green-600"
                              : change.operation_type === "Removed"
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {change.operation_type}
                        </td>
                        <td className="border border-gray-200 p-3 text-gray-700">
                          {change.changed_at}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
