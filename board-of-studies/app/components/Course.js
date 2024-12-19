import Image from "next/image"

const Course = ({ data, index, length }) => {
    return (
        <div className={`border-[1px] w-[90%] mt-6 rounded-md ${(index === length - 1) ? 'mb-6' : 'mb-0'} `}>
            <div className="flex flex-row justify-between pb-4">
                <div className="flex flex-col justify-start">
                    <div>
                        <h5 className="text-sm font-medium pt-1 px-2">{data.course_name}</h5>
                    </div>
                    <div>
                        <div>
                            <p className="text-xs font-normal px-2">
                                {data.course_code}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-xs font-light pt-1.5 px-2 flex flex-row items-start gap-1 justify-start">
                    <Image src='/chart-simple-solid.svg' width={12} height={12} alt='credits icon'/>

                    <p>
                        {data.lect_points + data.tut_points + data.pract_points} Credits
                    </p> 
                </div>
            </div>
            <div className="flex flex-row justify-end pt-4">
                <button className="text-xs bg-blue-600 rounded-xl px-2 py-1 text-white mr-3 mb-3">
                    Syllabus
                </button>
            </div>
        </div>
    )
}

export default Course