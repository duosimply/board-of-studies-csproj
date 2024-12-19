"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const login = async (formData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("username"),
    password: formData.get("password"),
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);
  if (error) {
    redirect("/error");
  }

  revalidatePath("/login", "layout");
  redirect("/dashboard");
};

// export const signup = async () => {
//     const supabase = createClient()
//     const {data, error} = await supabase.auth.signUp({
//         email: 'superadmin@supermail.com',
//         password: 'superadminpass'
//     })
// }
