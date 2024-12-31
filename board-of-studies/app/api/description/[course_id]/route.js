// import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

// export async function GET(request, { params }) {
//   const { course_id } = params;

//   try {
//     // Fetch course description from the `coursedescription` table for the given course_id
//     const { data, error } = await supabase
//       .from("description")
//       .select("context, approach, experience")
//       .eq("course_code", course_id)
//       .single(); // Ensure you get a single row (or a `null` if not found)

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

import supabase from "../../../utils/supabase/client.js"; // Adjust path if necessary

export async function GET(request, { params }) {
  const { course_id } = await params; // Retrieving the `course_id` from the dynamic route

  try {
    // Fetch course description from the `description` table for the given course_id
    const { data, error } = await supabase
      .from("description") // Make sure the table is named `description`
      .select("context, approach, experience") // Columns to fetch
      .eq("course_code", course_id) // Ensure this matches the column in the table (course_code)
      .limit(1); // Return a single row

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    // Return the data as JSON
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
