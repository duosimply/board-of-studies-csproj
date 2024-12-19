import { createClient } from "../utils/supabase/server";
import Course from "./Course";

const SemBox = async ({ sem }) => {

    const supabase = await createClient()

    const { data, error } = await supabase.from('Courses').select('*')

    return (
        <div className="border-[1px] w-[26vw] max-w-[26vw] rounded-md">
            <div className="bg-[#f0f6ff]">
                <h1 className="font-semibold py-3 px-4">

                    Sem {sem}
                </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
                {data.map((course, index) => {
                    return <Course data={course} key={course.course_code} index={index} length={data.length}/>
                })}
            </div>
        </div>
    )
}

export default SemBox
