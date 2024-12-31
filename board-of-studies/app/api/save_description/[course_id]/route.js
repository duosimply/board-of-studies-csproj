// import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

// export async function POST(request, { params }) {
//   const { course_id } = params;
//   const { context, approach, experiences } = await request.json();

//   try {
//     // Update course description in the database
//     const { data, error } = await supabase.from("description").upsert(
//       {
//         course_id,
//         context,
//         approach,
//         experiences,
//       },
//       { onConflict: ["course_code"] } // Ensure we update if `course_id` already exists
//     );

//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 400,
//       });
//     }

//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }

import supabase from "../../../utils/supabase/client"; // Adjust path if necessary

export async function POST(request, { params }) {
  const { course_id } = await params;
  const body = await request.json();
  console.log("Received body:", body);

  const { context, approach, experiences } = body;

  if (!context || !approach || !experiences) {
    console.log("Missing fields:", { context, approach, experiences });
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    // Update course description in the database
    const { data, error } = await supabase.from("description").upsert(
      {
        course_code: course_id, // Updated field to course_code
        context,
        approach,
        experience: experiences, // Ensure the column name matches
      },
      { onConflict: ["course_code"] } // Ensure we update if `course_code` already exists
    );

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    // Return the updated or inserted data
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
