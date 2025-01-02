'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import Course from './Course'
import NewCourseModel from './NewCourseModal'

const SemBox = ({ sem, batch, editing }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const semid = `sem${batch}${sem}`

        const { data: semesterData, error: semesterError } = await supabase
          .from('Semesters')
          .select('*')
          .eq('sem_id', semid)

        if (semesterError) {
          console.error('Error fetching semester data:', semesterError)
          setLoading(false)
          return
        }

        if (semesterData?.length > 0) {
          const courses = semesterData[0].course_ids.split(',')
          setCourses(courses)
        } else {
          //   console.warn("No semester data found for:", semid);
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sem, batch])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='border-[1px] w-[26vw] max-w-[26vw] rounded-md'>
      <div className='bg-[#f0f6ff]'>
        <h1 className='font-semibold py-3 px-4'>Sem {sem}</h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
        {editing && <NewCourseModel semid={`sem${batch}${sem}`} />}
        {courses.map((course, index) => (
          <Course
            course={course}
            key={index}
            index={index}
            length={courses.length}
            semid={`sem${batch}${sem}`}
            editing={editing}
          />
        ))}
      </div>
    </div>
  )
}

export default SemBox
