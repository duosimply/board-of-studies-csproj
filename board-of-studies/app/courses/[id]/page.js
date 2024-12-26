'use client'

import React, { useState, useEffect } from "react";
import createClient from "../../utils/supabase/client"; // Ensure your supabase client is correctly configured

const CourseDetails = ({params}) => {
  const [courseData, setCourseData] = useState([]); // State to hold course data (array of rows)
  const [error, setError] = useState(null); // State to handle errors
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editingCourse, setEditingCourse] = useState(null); // Track the course being edited
  const [newChapter, setNewChapter] = useState({
    Title: '',
    Content: '',
    Hours: ''
  }); // State for the new chapter

  // Function to fetch course details from the database
  const fetchCourseDetails = async () => {
    const supabase = await createClient()

    try {
      const tableName = (await params).id; // Dynamic table name based on courseCode

      // Query Supabase dynamically for all course records in the table based on courseCode and table name
      const { data, error } = await supabase
        .from(tableName) // Dynamically use the table name
        .select("*") // Fetch all rows
        .order("id", { ascending: true }); // Sort chapters by 'id' in ascending order

      if (error) {
        throw new Error(error.message); // Throwing error if Supabase returns an error
      }

      if (data.length === 0) {
        setError('Course with code ${courseCode} not found');
      } else {
        setCourseData(data); // Set course data if found
      }
    } catch (err) {
      console.error("Error fetching course details:", err.message); // Log error
      setError('Failed to fetch course details: ${err.message}'); // Set error state
    }
  };

  useEffect(() => {
    fetchCourseDetails(); // Call the function to fetch data when the component mounts
  }, [courseCode]); // Re-fetch whenever courseCode changes

  // Function to handle delete chapter
  const handleDelete = async (chapterId) => {
    const tableName = courseCode; // Dynamic table name

    try {
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", chapterId);

      if (error) {
        throw new Error(error.message); // Handle delete error
      }

      // Re-fetch the data after deletion to reflect the changes
      fetchCourseDetails(); // Fetch updated data after deletion
      alert("Chapter deleted successfully");
    } catch (err) {
      console.error("Error deleting chapter:", err.message);
      alert('Error deleting chapter: ${err.message}');
    }
  };

  // Function to handle edit chapter (this opens a prompt for editing)
  const handleEdit = (course) => {
    setEditingCourse(course); // Set the course currently being edited
    setIsEditing(true); // Open the editing state
  };

  // Function to handle saving the updated course details
  const handleSave = async (updatedCourse) => {
    const tableName = courseCode; // Dynamic table name
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updatedCourse)
        .eq("id", updatedCourse.id);

      if (error) {
        throw new Error(error.message); // Handle update error
      }

      // Update the courseData state to reflect the changes (without changing the order)
      setCourseData((prevData) => {
        return prevData.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        );
      });

      setIsEditing(false); // Close the edit mode
      alert("Chapter updated successfully");
    } catch (err) {
      console.error("Error updating chapter:", err.message);
      alert('Error updating chapter: ${err.message}');
    }
  };

  // Function to handle adding a new chapter
  // Function to handle adding a new chapter
const handleAddChapter = async () => {
  const tableName = courseCode;
  try {
    // Do not include 'id' in the new chapter data; let Supabase handle the auto-increment
    const { data, error } = await supabase
      .from(tableName)
      .insert([
        {
          Title: newChapter.Title,
          Content: newChapter.Content,
          Hours: newChapter.Hours,
        },
      ]);

    if (error) {
      throw new Error(error.message); // Handle insert error
    }

    // Re-fetch the data after adding the new chapter to reflect the changes
    fetchCourseDetails();
    setNewChapter({ Title: '', Content: '', Hours: '' }); // Reset the form
    alert("New chapter added successfully");
  } catch (err) {
    console.error("Error adding chapter:", err.message);
    alert('Error adding chapter: ${err.message}');
  }
};


  // Handle loading, error, and course data states
  if (error) {
    return <div>{error}</div>; // Show error message if there's an issue
  }

  if (courseData.length === 0) {
    return <div>Loading...</div>; // Show loading message while waiting for data
  }

  // Split the chapters into 3 units (each unit will contain 3 chapters)
  const units = [
    courseData.slice(0, 3),  // Unit 1 (first 3 chapters)
    courseData.slice(3, 6),  // Unit 2 (next 3 chapters)
    courseData.slice(6, 9),  // Unit 3 (next 3 chapters)
  ];

  // Styling for the page
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      borderRadius: "8px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    unit: {
      marginBottom: "20px",
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "1.5em",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "10px",
      textAlign: "left",
    },
    content: {
      color: "#555",
      fontSize: "1em",
      marginBottom: "10px",
    },
    hours: {
      fontSize: "1.1em",
      color: "#8e44ad",
    },
    button: {
      backgroundColor: "#3498db",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "5px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-start",
      gap: "10px",
    },
    editForm: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    error: {
      textAlign: "center",
      color: "red",
      fontSize: "1.2em",
    },
    loading: {
      textAlign: "center",
      fontSize: "1.2em",
      color: "#f39c12",
    },
    unitHeader: {
      textAlign: "center",
      fontSize: "2em",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "10px",
    },
  };

  // Handle editing form for a specific chapter
  const handleEditForm = () => {
    if (!editingCourse) return null;

    return (
      <div style={styles.editForm}>
        <input
          style={styles.input}
          type="text"
          value={editingCourse.Title}
          onChange={(e) =>
            setEditingCourse({ ...editingCourse, Title: e.target.value })
          }
        />
        <textarea
          style={styles.input}
          value={editingCourse.Content}
          onChange={(e) =>
            setEditingCourse({ ...editingCourse, Content: e.target.value })
          }
        />
        <input
          style={styles.input}
          type="number"
          value={editingCourse.Hours}
          onChange={(e) =>
            setEditingCourse({ ...editingCourse, Hours: e.target.value })
          }
        />
        <button
          style={styles.button}
          onClick={() => handleSave(editingCourse)}
        >
          Save Changes
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Course Details</h1>

      {isEditing && handleEditForm()}

      {units.map((unit, unitIndex) => (
        <div key={unitIndex} style={styles.unit}>
          <h2 style={styles.unitHeader}>Unit {unitIndex + 1}</h2>
          {unit.map((course) => (
            <div key={course.id}>
              <p style={styles.title}>{course.Title}</p>
              <p style={styles.content}>{course.Content}</p>
              <p style={styles.hours}>Hours: {course.Hours}</p>

              <div style={styles.buttonContainer}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Add New Chapter Form */}
      <h6>_____________________________________________</h6>
      <h3 style={styles.title}>Add New Chapter</h3>
      <div style={styles.editForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={newChapter.Title}
          onChange={(e) =>
            setNewChapter({ ...newChapter, Title: e.target.value })
          }
        />
        <textarea
          style={styles.input}
          placeholder="Content"
          value={newChapter.Content}
          onChange={(e) =>
            setNewChapter({ ...newChapter, Content: e.target.value })
          }
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Hours"
          value={newChapter.Hours}
          onChange={(e) =>
            setNewChapter({ ...newChapter, Hours: e.target.value })
          }
        />
        <button style={styles.button} onClick={handleAddChapter}>
          Add Chapter
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;