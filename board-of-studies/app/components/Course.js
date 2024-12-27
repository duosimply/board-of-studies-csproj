import Image from "next/image"
import Button from "./Button"
import { createClient } from "../utils/supabase/server"
import MoveButton from "./MoveButton"

const Course = async ({ course, index, length, semid }) => {

    const supabase = await createClient()
    const { data, error } = await supabase.from('Courses').select('*').eq('course_code', course)
    
    if (data === null)
        return
    const info = data[0]

    if (info === undefined || info === null)
        return

    return (
        <div className={`border-[1px] w-[90%] mt-6 rounded-md ${(index === length - 1)? 'mb-6': 'mb-0'} shadow`}>
            <div className="flex flex-row justify-between pb-4">
                <div className="flex flex-col justify-start">
                    <div>
                        <h5 className="text-sm font-medium pt-1 px-2">{info.course_name}</h5>
                    </div>
                    <div>
                        <div>
                            <p className="text-xs font-normal px-2">
                                {info.course_code}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-xs font-light pt-1.5 px-2 flex flex-row items-start gap-1 justify-start">
                    <Image src='/chart-simple-solid.svg' width={12} height={12} alt='credits icon'/>

                    <p>
                        {info.lect_points + info.tut_points + info.pract_points} Credits
                    </p> 
                </div>
            </div>
            <div className="flex flex-row justify-between pt-4">
                <MoveButton currentSem={semid} currentCourse={info.course_code}/>
                <Button course_code={info.course_code}/>
            </div>
        </div>
    )
}

export default Course