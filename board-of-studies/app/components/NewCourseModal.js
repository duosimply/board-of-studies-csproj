'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { redirect } from 'next/dist/server/api-utils'

const NewCourseModel = ({semid}) => {
  let [isVisible, setIsVisible] = useState(0)

  const onSubmit = async (formData) => {
    const supabase = createClient()

    let updateObj = {
        'course_code' : formData.get('ccode'),
        'course_name' : formData.get('cname'),
        'lect_points' : formData.get('cl'),
        'tut_points' : formData.get('ct'),
        'pract_points' : formData.get('cp'),
    }

    console.log(updateObj)

    let currentCourses = (await supabase.from('Semesters').select('course_ids').eq('sem_id', semid)).data[0].course_ids
    
    currentCourses += updateObj.course_code
    
    await supabase.from('Semesters').update({course_ids: currentCourses}).eq('sem_id', semid)
    await supabase.from('Courses').insert(updateObj)
    await supabase.from('CourseContent').insert({course_id: updateObj.course_code, chapters: 'Title,Description,1'})

    setIsVisible(!isVisible)
  }

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  })

  return (
    <>
      {isVisible ? (
        <div className='fixed top-0 left-0 w-[100vw] h-[100vh] z-50 grid grid-cols-1 grid-rows-1 place-items-center bg-blue-100 bg-opacity-80'>
          <form
            action={onSubmit}
            className='w-1/4 h-min flex flex-col justify-center gap-2 bg-white rounded-xl px-5 py-5'
          >
            <h1 className='text-2xl font-semibold'>Enter Details</h1>
            <input
              className='border-[1px] p-2 rounded-md'
              placeholder='Enter Course Name'
              required
              id='cname'
              name='cname'
            />
            <input
              className='border-[1px] p-2 rounded-md'
              placeholder='Enter Course Code'
              required
              id='ccode'
              name='ccode'
            />
            <div className='flex flex-row justify-evenly gap-2'>
              <input
                className='border-[1px] p-2 rounded-md w-1/3'
                placeholder='L'
                type='number'
                min={0}
                defaultValue={0}
                id='cl'
                name='cl'
              />
              <input
                className='border-[1px] p-2 rounded-md w-1/3'
                placeholder='T'
                type='number'
                min={0}
                defaultValue={0}
                id='ct'
                name='ct'
              />
              <input
                className='border-[1px] p-2 rounded-md w-1/3'
                placeholder='P'
                type='number'
                min={0}
                defaultValue={0}
                id='cp'
                name='cp'
              />
            </div>
            <button
              type='submit'
              className='bg-blue-600 w-full py-2 rounded-md text-white font-semibold'
            >
              Add
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className='border-[2px] hover:bg-blue-600 hover:text-white border-blue-600 w-full py-2 rounded-md text-blue-600 font-semibold'
            >
              Close
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
      <div
        onClick={() => setIsVisible(!isVisible)}
        className='w-[90%] border-[1px] mt-6 grid grid-cols-1 grid-rows-1 place-items-center rounded-md shadow cursor-pointer hover:scale-105 transition-all active:scale-95'
      >
        <Image
          src={'/plus-solid.svg'}
          width={16}
          height={16}
          alt='plus'
          className='py-2'
        />
      </div>
    </>
  )
}

export default NewCourseModel
