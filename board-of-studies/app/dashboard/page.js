

import { createClient } from "../utils/supabase/server"
import SemBox from "../components/SemBox"
import { signout } from "./actions"

const Dashboard = () => {

    return (
        <>
            <div className="w-[96vw] mx-auto h-min pb-6 bg-white rounded-md shadow-md">
                <h1 className="font-bold text-xl py-4 px-6">Semester Overview</h1>
                
                <div className="flex flex-row justify-center gap-4">

                <SemBox sem={1}/>
                </div>
                
            </div>
            
        </>
    )
}

export default Dashboard