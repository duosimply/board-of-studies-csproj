'use client'

import { createClient } from "../utils/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const signout = async () => {
    const supabase = createClient()

    const {error} = await supabase.auth.signOut()

    redirect('/login')
}