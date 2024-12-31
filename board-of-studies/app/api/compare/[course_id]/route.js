// import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

// export async function GET(request, { params }) {
//   const { course_id } = params;

//   try {
//     // Fetch course change history from the `course_changes` table for the given course_id
//     const { data, error } = await supabase
//       .from("log_course_table")
//       .select(
//         "id, operation_type,course_code,previous_value, updated_value, change_status, changed_at"
//       )
//       .eq("course_code", course_id)
//       .order("changed_at", { ascending: false }); // Order by most recent change

//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 400,
//       });
//     }

//     // Return the data as JSON
//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }

import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

export async function GET(request, { params }) {
  const { course_id } = await params; // Extract the `course_id` from the URL parameters
  console.log("Params:", params);
  console.log("Course ID:", course_id);
  try {
    // Fetch course change history from the `log_course_table` for the given `course_id`
    const { data, error } = await supabase
      .from("log_course_table") // The table containing course change logs
      .select(
        "id, operation_type, course_code, previous_value, updated_value, change_status, changed_at"
      ) // Select necessary columns
      .eq("course_code", course_id) // Filter by `course_code` (this corresponds to `course_id`)
      .order("changed_at", { ascending: false }); // Order by the most recent change (descending)

    // Check if there was an error during the query execution
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }), // Return the error message in JSON format
        {
          status: 400, // Set HTTP status to 400 for bad request
        }
      );
    }

    // If the query is successful, return the fetched data as JSON
    return new Response(JSON.stringify(data), { status: 200 }); // HTTP status 200 for success
  } catch (err) {
    // Catch any errors during the process and return them as a 500 error (server error)
    return new Response(
      JSON.stringify({ error: err.message }), // Return the error message in JSON format
      {
        status: 500, // Internal server error
      }
    );
  }
}
