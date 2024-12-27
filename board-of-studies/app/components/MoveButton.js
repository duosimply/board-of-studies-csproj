'use client'

import { useState } from "react"
import { createClient } from "../utils/supabase/client"
import { redirect } from "next/navigation"

const  MoveButton = ({ currentSem, currentCourse }) => {

    const supabase = createClient()

    let [value, setValue] = useState(1)

    const updateValue = (e) => {
        setValue(e.target.value)
    }

    const updateSem = async () => {

        let { data, error } = await supabase.from('Semesters').select('course_ids').eq('sem_id', currentSem)
        let currentCourses = data[0].course_ids
        let destSem = currentSem.slice(0, -1) + value

        currentCourses = currentCourses.split(',').filter(i => i !== currentCourse).join(',')
        
        let req = await supabase.from('Semesters').select('course_ids').eq('sem_id', destSem)
        
        let addedCourses = req.data[0].course_ids + ',' + currentCourse
        console.log(addedCourses)

        await supabase.from('Semesters').update({course_ids: currentCourses}).eq('sem_id', currentSem)
        await supabase.from('Semesters').update({course_ids: addedCourses}).eq('sem_id', destSem)
        redirect('/dashboard')
    }

    return (
        <div className="ml-4">
            <input type="number" id="moveNum" min={1} max={8} value={value} onChange={(e) => updateValue(e)}/>
            <button onClick={updateSem} className="text-xs bg-blue-600 rounded-xl px-2 py-1 mx-2 text-white mr-3 mb-3">Move</button>
        </div>
    )
}

export default MoveButton