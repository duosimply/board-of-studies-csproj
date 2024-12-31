import supabase from "../../../utils/supabase/client"; // Adjust the path if necessary

// Named export for handling GET requests
export async function GET(req, { params }) {
  const { course_id } = await params; // Get course_id from the URL parameter

  // Debugging log to verify course_id
  console.log("Course ID from URL:", course_id);

  try {
    // Fetch the course content data from the 'CourseContent' table
    const { data: courseContentData, error: courseContentError } =
      await supabase
        .from("CourseContent") // The table name for course content
        .select("course_id, chapters") // Selecting course_id and chapters fields
        .eq("course_id", course_id); // Filtering based on course_id

    if (courseContentError) {
      // Return error if fetching course content fails
      return new Response(
        JSON.stringify({ error: "Failed to fetch course content" }),
        { status: 500 }
      );
    }

    // Return the course content data if fetched successfully
    return new Response(JSON.stringify(courseContentData), { status: 200 });
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error fetching course content:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch course content" }),
      { status: 500 }
    );
  }
}
