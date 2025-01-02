'use client'

import { useRouter } from "next/navigation"

const Button = ({course_code, page, text}) => {

    const goTO = useRouter()

    return (
        <button onClick={() => goTO.push('/' + page + '/' + course_code)} className="text-xs bg-blue-600 rounded-xl px-2 py-1 max-w-16 text-white mr-3 mb-3 max-h-6" >
                    {text}
        </button>
    )
}

export default Button