import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

// Named export for handling GET requests
export async function GET(req, { params }) {
  const { course_id } = await params; // Get courseId from the URL parameter

  try {
    // Query the 'Courses' table for the course with the given course_id
    const { data, error } = await supabase
      .from("Courses") // Assuming the table is called 'Courses'
      .select("*")
      .eq("course_code", course_id) // Adjust this field if needed
      .single(); // Only expect one course based on course_code

    if (error) {
      throw error; // Throw error if database query fails
    }

    if (data) {
      // Return the course data if found
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      // If no course is found, return a 404 error
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    // Handle any errors (e.g., database connection issues)
    return new Response(
      JSON.stringify({
        error: "Failed to fetch course details",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
