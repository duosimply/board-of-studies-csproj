import supabase from "../../../utils/supabase/client"; // Adjust the path if necessary

// Named export for handling GET requests
export async function GET(req, { params }) {
  const { course_id } = await params; // Get courseId from the URL parameter

  // Debugging log to verify course_id
  console.log("Course ID from URL:", course_id);

  try {
    // Fetch the log course content data (replace 'log_course_content' with your actual table name)
    const { data: logData, error: logError } = await supabase
      .from("log_course_content") // The table name for log course content
      .select("course_code, old_chapter_text, new_chapter_text")
      .eq("course_code", course_id); // Filtering based on course_id

    if (logError) {
      // Return error if fetching log data fails
      return new Response(
        JSON.stringify({ error: "Failed to fetch log data" }),
        { status: 500 }
      );
    }

    // Return the log data if fetched successfully
    return new Response(JSON.stringify(logData), { status: 200 });
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error fetching log course content:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch log course content" }),
      { status: 500 }
    );
  }
}
