import supabase from "../../../utils/supabase/client"; // Adjust the path if necessary
export async function GET(req, { params }) {
  const { course_id } = await params; // Get course_id from the URL parameter

  // Debugging log to verify course_id
  console.log("Course ID from URL:", course_id);

  try {
    // Query the Semesters table where course_ids contains the given course_id
    const { data, error } = await supabase
      .from("Semesters")
      .select("sem_id")
      .ilike("course_ids", `%${course_id}%`);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return new Response(
        JSON.stringify({ message: "Semester not found for the course" }),
        { status: 404 }
      );
    }

    // Extract the sem_id from the result
    const sem_id = data[0].sem_id;
    return new Response(JSON.stringify({ sem_id }), { status: 200 });
  } catch (error) {
    console.error("Error fetching semester:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
