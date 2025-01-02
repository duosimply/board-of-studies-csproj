'use client'

import React from 'react'
import { createClient } from '../utils/supabase/client'

const DeleteButton = ({currentSem, currentCourse}) => {

  const handleDelete = async () => {
    const supabase = createClient()

    // await supabase.from('Courses').delete().eq('course_code', currentCourse)
    // await supabase.from('CourseContent').delete().eq('course_id', currentCourse)

    let {data, error} = await supabase.from('Semesters').select('course_ids').eq('sem_id', currentSem)

    let update = data[0].course_ids.split(',').filter(item => item != currentCourse).join(',')
    await supabase.from('Semesters').update({course_ids: update}).eq('sem_id', currentSem)
  }

  return (
    <button onClick={handleDelete} className='text-xs bg-blue-600 rounded-xl px-2 py-1 mx-2 text-white mr-3 mb-3'>
        Delete
    </button>
  )
}

export default DeleteButton