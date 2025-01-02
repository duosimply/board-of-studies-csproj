"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf"; // Import jsPDF

export default function CompareCourse() {
  const [semId, setSemId] = useState(null);
  const [error, setError] = useState(null);
  const [updatedCourseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState(null);
  const [courseChanges, setCourseChanges] = useState([]);

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
            const updatedCourseName = data.course_name || "Unknown Course";
            setCourseName(updatedCourseName); // Store the course name
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
            const updatedCourseName =
              updated_value.course_name || "Unknown Course";
            setCourseName(updatedCourseName);
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

  useEffect(() => {
    if (!courseId) return; // Skip if courseId is not available

    const fetchSemId = async () => {
      try {
        const res = await fetch(`/api/findSem/${courseId}`);
        const data = await res.json();

        if (res.ok) {
          const semId = data.sem_id;

          // Extract the year and semester using string manipulation
          const year = semId.substring(3, 7); // Extract the year (characters 3-6)
          const semester = semId.substring(7); // Extract the semester number (remaining part)

          setSemId({ year, semester }); // Store both values in state
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (error) {
        setError("Failed to fetch semester");
      }
    };

    fetchSemId();
  }, [courseId]);

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
  // Conditional rendering based on semId or error state
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!semId) {
    return <div>Loading...</div>;
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = 20;

    const addWrappedText = (text, y) => {
      const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(splitText, margin, y);
      return y + splitText.length * doc.getLineHeight() * 0.6; // Adjusted for compact space
    };

    const checkAndAddPage = (heightNeeded = 0) => {
      if (yPosition + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    const addContentSection = (section, content) => {
      const contentLines = doc.splitTextToSize(content, pageWidth - margin * 2);
      const sectionHeight =
        (contentLines.length + 1) * doc.getLineHeight() * 0.6;

      if (yPosition + sectionHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(section, margin, yPosition);
      yPosition += doc.getLineHeight() * 0.6;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(content, yPosition);
      yPosition += doc.getLineHeight() * 0.5;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    yPosition = addWrappedText(
      `Course Change Summary for Course: ${updatedCourseName || "N/A"}`,
      yPosition
    );
    yPosition = addWrappedText(`Course ID: ${courseId || "N/A"}`, yPosition);
    yPosition = addWrappedText(
      `Semester: ${semId?.semester || "N/A"} - Year: ${semId?.year || "N/A"}`,
      yPosition
    );
    yPosition += doc.getLineHeight() * 0.5;

    // Content Sections
    addContentSection("Context", updatedDescription.context || "");
    addContentSection("Approach", updatedDescription.approach || "");
    addContentSection("Experiences", updatedDescription.experiences || "");

    // Chapters
    if (updatedDescription.chapters) {
      const chapterLines = updatedDescription.chapters.split("\n");
      const chaptersHeight = chapterLines.length * doc.getLineHeight() * 0.8;

      if (yPosition + chaptersHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Chapters", margin, yPosition);
      yPosition += doc.getLineHeight() * 0.5;

      doc.setFont("helvetica", "normal");
      chapterLines.forEach((chapter) => {
        yPosition = addWrappedText(chapter, yPosition);
      });
    }

    // Table
    const headers = ["Field", "Old Value", "New Value", "Change Type", "Date"];
    const columnWidths = [45, 35, 35, 30, 30];
    const startX = margin;
    const rowHeight = doc.getLineHeight();

    if (yPosition + rowHeight * 2 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Course and Content Change History", margin, yPosition);
    yPosition += rowHeight * 0.7;

    let currentX = startX;
    doc.setFillColor(240, 240, 240);
    doc.rect(
      startX,
      yPosition - rowHeight / 2,
      pageWidth - margin * 2,
      rowHeight,
      "F"
    );
    doc.setFontSize(10);

    headers.forEach((header, i) => {
      doc.text(header, currentX, yPosition);
      currentX += columnWidths[i];
    });
    yPosition += rowHeight * 0.5;

    const changes = [...courseChanges, ...contentChanges];
    changes.forEach((change) => {
      const rowData = [
        change.field_name,
        String(change.previous_value),
        String(change.updated_value),
        change.operation_type,
        new Date(change.changed_at).toLocaleDateString(),
      ];

      const maxLines = Math.max(
        ...rowData.map(
          (text) =>
            doc.splitTextToSize(text, Math.min(...columnWidths) - 2).length
        )
      );
      const calculatedRowHeight = maxLines * rowHeight * 0.5;

      if (yPosition + calculatedRowHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      currentX = startX;
      doc.setFont("helvetica", "normal");

      rowData.forEach((text, i) => {
        const wrappedText = doc.splitTextToSize(text, columnWidths[i] - 2);
        doc.text(wrappedText, currentX, yPosition);
        currentX += columnWidths[i];
      });

      yPosition += calculatedRowHeight;
    });

    // Add Course Coordinator, Teacher and Signature Section
    const footerHeight = doc.getLineHeight() * 1; // Adjust space for footer content
    checkAndAddPage(footerHeight);
    yPosition += footerHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Course Coordinator:", margin, yPosition);
    yPosition += doc.getLineHeight();

    doc.setFont("helvetica", "normal");
    doc.text("", margin, yPosition); // You can replace "Dr. John Doe" with the actual course coordinator
    yPosition += doc.getLineHeight() * 1;

    doc.setFont("helvetica", "bold");
    doc.text("Course Teacher:", margin, yPosition);
    yPosition += doc.getLineHeight();

    doc.setFont("helvetica", "normal");
    doc.text("", margin, yPosition); // Replace with actual teacher name
    yPosition += doc.getLineHeight() * 1.3;

    doc.setFont("helvetica", "italic");
    doc.text("Signature: _________", margin, yPosition);

    // Save the PDF
    doc.save(`Course_Change_Summary_${courseId}.pdf`);
  };

  return (
    <div className="p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        {/* Course change Summary for Course ID: {courseId} */}
        Course Change Summary <br />{" "}
        {updatedCourseName
          ? `${updatedCourseName} ( ${courseId})`
          : `Course ID: ${courseId}`}
      </h1>
      <div>
        <p className="text-xl font-medium text-blue-500">
          Year:{" "}
          <span className="font-semibold text-blue-700">
            {semId?.year || "N/A"}
          </span>{" "}
          <br />
          Semester:{" "}
          <span className="font-semibold text-blue-700">
            {semId?.semester || "N/A"}
          </span>
        </p>
      </div>
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
