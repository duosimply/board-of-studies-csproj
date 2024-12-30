'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client.js'; // Ensure your Supabase client is correctly configured

const CourseDetails = ({ params }) => {
  const [courseData, setCourseData] = useState([]); // State to hold course data (array of rows)
  const [error, setError] = useState(null); // State to handle errors
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editingCourse, setEditingCourse] = useState({}); // Track the course being edited
  const [newChapter, setNewChapter] = useState({
    Title: '',
    Content: '',
    Hours: ''
  }); // State for the new chapter
  let [chapToUpdate, setChapToUpdate] = useState(0);

  const courseCode = React.use(params).id; // Unwrap the params and extract id (courseCode)

  // Function to fetch course details from the database
  const fetchCourseDetails = async () => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from('CourseContent') // Ensure the table name is correct
        .select('*') // Select all columns
        .eq('course_id', courseCode); // Query by course_id

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        setError(`Course with code ${courseCode} not found`);
        return;
      }

      // Assuming the chapters are stored as a string in the format: "Title|Content|Hours"
      let temp = data[0].chapters.split('|').map(chapter => {
        const [Title, Content, Hours] = chapter.split(',');
        return { Title, Content, Hours };
      });
      setCourseData(temp); // Update the state
    } catch (err) {
      console.error('Error fetching course details:', err.message);
      setError(`Failed to fetch course details: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchCourseDetails(); // Call the function to fetch data when the component mounts
  }, [courseCode]); // Re-fetch whenever courseCode changes

  // Function to handle delete chapter
  const handleDelete = async (unitIndex, chapterIndex) => {
    const supabase = createClient();
    try {
      // Calculate global chapter index
      const globalIndex = unitIndex * 3 + chapterIndex; // Assuming 3 chapters per unit

      const updatedChapters = [...courseData];
      updatedChapters.splice(globalIndex, 1); // Remove the chapter at the global index

      const { data, error } = await supabase
        .from('CourseContent')
        .update({ chapters: updatedChapters.map(ch => `${ch.Title},${ch.Content},${ch.Hours}`).join('|') })
        .eq('course_id', courseCode);

      if (error) {
        throw new Error(error.message);
      }

      setCourseData(updatedChapters);
      alert('Chapter deleted successfully');
    } catch (err) {
      console.error('Error deleting chapter:', err.message);
      alert(`Error deleting chapter: ${err.message}`);
    }
  };

  // Function to handle saving the updated course details
  const handleSave = async () => {
    try {
      const supabase = createClient();

      // Only update the chapter that has been edited
      const updatedChapters = [...courseData];
      
      // Ensure that the edited chapter is updated with the latest values
      updatedChapters[chapToUpdate] = {
        Title: editingCourse.Title,
        Content: editingCourse.Content,
        Hours: editingCourse.Hours
      };

      const { data, error } = await supabase
        .from('CourseContent')
        .update({
          chapters: updatedChapters.map(ch => `${ch.Title},${ch.Content},${ch.Hours}`).join('|')
        })
        .eq('course_id', courseCode);

      if (error) {
        throw new Error(error.message);
      }

      setCourseData(updatedChapters); // Update the local state with the modified chapter
      setIsEditing(false); // Close the edit mode
      alert('Chapter updated successfully');
    } catch (err) {
      console.error('Error updating chapter:', err.message);
      alert(`Error updating chapter: ${err.message}`);
    }
  };

  // Function to handle edit action
  const handleEdit = (unitIndex, chapterIndex) => {
    const globalIndex = unitIndex * 3 + chapterIndex; // Calculate the global chapter index
    setIsEditing(true);
    setChapToUpdate(globalIndex); // Set the global index to be updated

    const chapterDetails = courseData[globalIndex]; // Get the details of the chapter to edit
    setEditingCourse({
      Title: chapterDetails.Title,
      Content: chapterDetails.Content,
      Hours: chapterDetails.Hours,
    }); // Set the fields to be edited
  };

  // Function to handle adding a new chapter
  const handleAddNewChapter = async () => {
    const supabase = createClient();
    try {
      const newChapterData = {
        Title: newChapter.Title,
        Content: newChapter.Content,
        Hours: newChapter.Hours,
      };

      // Append the new chapter to the existing chapters
      const updatedChapters = [...courseData, newChapterData];

      const { data, error } = await supabase
        .from('CourseContent')
        .update({
          chapters: updatedChapters.map(ch => `${ch.Title},${ch.Content},${ch.Hours}`).join('|')
        })
        .eq('course_id', courseCode);

      if (error) {
        throw new Error(error.message);
      }

      setCourseData(updatedChapters); // Update the local state
      setNewChapter({ Title: '', Content: '', Hours: '' }); // Reset the form fields
      alert('New chapter added successfully');
    } catch (err) {
      console.error('Error adding new chapter:', err.message);
      alert(`Error adding new chapter: ${err.message}`);
    }
  };

  // Handle loading, error, and course data states
  if (error) {
    return <div>{error}</div>;
  }

  if (courseData.length === 0) {
    return <div>Loading...</div>;
  }

  const units = [
    courseData.slice(0, 3),
    courseData.slice(3, 6),
    courseData.slice(6, 9),
  ];

  const styles = {
    container: {
      padding: '30px',
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      maxWidth: '900px',
      margin: '20px auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
      fontSize: '32px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #4e73df, #2e59d9)',
      color: '#fff',
      padding: '10px',
      borderRadius: '6px',
    },
    unit: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px',
      textAlign: 'left',
    },
    content: {
      color: '#555',
      fontSize: '1em',
      marginBottom: '10px',
    },
    hours: {
      fontSize: '1.1em',
      color: '#00308F',
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#4e73df',
      color: 'white',
      padding: '10px 18px',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      margin: '5px',
      fontSize: '0.9em',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      gap: '10px',
    },
    editForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '30px',
      padding: '15px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1em',
    },
    formButton: {
      backgroundColor: '#4e73df',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.1em',
    },
    unitheader: {
      fontSize: '1.8em',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px',
      textAlign: 'center',
      color: '#4e73df',
    }
  };

  return (
    <div style={styles.container} className='font-space_grotesk'>
      <div style={styles.header}>Course Details</div>

      {/* Edit Form */}
      {isEditing && (
        <div style={styles.editForm}>
          <div style={styles.header}>Edit Course Details</div>
          <input
            style={styles.input}
            type="text"
            value={editingCourse.Title}
            onChange={(e) => setEditingCourse({ ...editingCourse, Title: e.target.value })}
          />
          <textarea
            style={styles.input}
            value={editingCourse.Content}
            onChange={(e) => setEditingCourse({ ...editingCourse, Content: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            value={editingCourse.Hours}
            onChange={(e) => setEditingCourse({ ...editingCourse, Hours: e.target.value })}
          />
          <button
            style={styles.formButton}
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            style={styles.formButton}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {units.map((unit, unitIndex) => (
        <div key={unitIndex} style={styles.unit}>
          <h2 style={styles.unitheader}>Unit {unitIndex + 1}</h2>
          {unit.map((chapter, chapIndex) => (
            <div key={chapIndex}>
              <div style={styles.title}>{chapter.Title}</div>
              <div style={styles.content}>{chapter.Content}</div>
              <div style={styles.hours}>{chapter.Hours} hours</div>

              <br />
              <div style={styles.buttonContainer}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(unitIndex, chapIndex)} // Pass both unit and chapter index
                >
                  Edit
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(unitIndex, chapIndex)} // Pass both unit and chapter index
                >
                  Delete
                </button>
              </div>
              <br />
              <hr />
              <br />
            </div>
          ))}
        </div>
      ))}

       {/* New Chapter Form */}
       <div style={styles.header}>Add new Course</div>
       <div style={styles.editForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={newChapter.Title}
          onChange={(e) => setNewChapter({ ...newChapter, Title: e.target.value })}
        />
        <textarea
          style={styles.input}
          placeholder="Content"
          value={newChapter.Content}
          onChange={(e) => setNewChapter({ ...newChapter, Content: e.target.value })}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Hours"
          value={newChapter.Hours}
          onChange={(e) => setNewChapter({ ...newChapter, Hours: e.target.value })}
        />
        <button
          style={styles.formButton}
          onClick={handleAddNewChapter}
        >
          Add New Chapter
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
