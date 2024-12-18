

import { createClient } from "../utils/supabase/server"
import SemBox from "../components/SemBox"
import { signout } from "./actions"

const Dashboard = () => {

    return (
        <>
            <div className="w-[96vw] mx-auto h-[50vh] bg-white rounded-md shadow-md">
                <h1 className="font-bold text-xl py-4 px-6">Semester Overview</h1>
                
                <SemBox/>
                
            </div>
            <form action={signout}><button type="submit">Sign Out</button></form>
        </>
    )
}

export default Dashboard