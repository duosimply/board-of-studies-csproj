import { createClient } from "../utils/supabase/server";
import Course from "./Course";
import NewCourseModel from "./NewCourseModal";

const SemBox = async ({ sem, batch }) => {

    const supabase = await createClient()
    const semid = 'sem' + batch + sem 

    let { data, error1 } = await supabase.from('Semesters').select('*').eq('sem_id', semid)

    const courses = data[0].course_ids.split(',')
    // console.log(courses)
    return (
        <div className="border-[1px] w-[26vw] max-w-[26vw] rounded-md">
            <div className="bg-[#f0f6ff]">
                <h1 className="font-semibold py-3 px-4">

                    Sem {sem}
                </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
                <NewCourseModel semid={semid} />
                {courses.map((course, index) => {
                    return <Course course={course} key={index} index={index} length={courses.length} semid={semid}/>
                })}
            </div>
        </div>
    )
}

export default SemBox
