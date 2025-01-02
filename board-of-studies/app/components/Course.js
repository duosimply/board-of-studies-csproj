'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import { createClient } from '../utils/supabase/client'
import MoveButton from './MoveButton'
import DeleteButton from './DeleteButton'

const Course = ({ course, index, length, semid, editing }) => {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourseData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Courses')
        .select('*')
        .eq('course_code', course)

      if (error) {
        console.error('Error fetching course data:', error)
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        setInfo(data[0]) // Save the course data
      } else {
        // console.warn("No course found for code:", course);
        setLoading(false)
        return
      }

      setLoading(false)
    }

    fetchCourseData()
  }, [course])

  if (loading) {
    return <div>Loading...</div> // Placeholder while loading
  }

  if (!info) {
    return // Fallback if no course data
  }

  return (
    <div
      className={`border-[1px] w-[90%] mt-6 rounded-md ${
        index === length - 1 ? 'mb-6' : 'mb-0'
      } shadow`}
    >
      <div className='flex flex-row justify-between pb-4'>
        <div className='flex flex-col justify-start'>
          <div>
            <h5 className='text-sm font-medium pt-1 px-2'>
              {info.course_name}
            </h5>
          </div>
          <div>
            <p className='text-xs font-normal px-2'>{info.course_code}</p>
          </div>
        </div>
        <div className='text-xs font-light pt-1.5 px-2 flex flex-row items-start gap-1 justify-start'>
          <Image
            src='/chart-simple-solid.svg'
            width={12}
            height={12}
            alt='credits icon'
          />
          <p>
            {info.lect_points + info.tut_points + info.pract_points} Credits
          </p>
        </div>
      </div>
      <div className={`flex flex-row items-center ${(editing)? 'justify-between':'justify-end'} pt-4`}>
        {editing && (
          <>
            <MoveButton
              currentSem={semid}
              currentCourse={info.course_code}
            />
            <DeleteButton
              currentSem={semid}
              currentCourse={info.course_code}
            />
          </>
        )}
        <Button course_code={info.course_code} page={'courses'} text={'Syllabus'}/>
        <Button course_code={info.course_code} page={'courses3'} text={'Changes'}/>
      </div>
    </div>
  )
}

export default Course
