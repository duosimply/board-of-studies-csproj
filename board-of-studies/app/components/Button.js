'use client'

import { useRouter } from "next/navigation"

const Button = ({course_code}) => {

    const goTO = useRouter()

    return (
        <button onClick={() => goTO.push('/courses/' + course_code)} className="text-xs bg-blue-600 rounded-xl px-2 py-1 text-white mr-3 mb-3" >
                    Syllabus
        </button>
    )
}

export default Button