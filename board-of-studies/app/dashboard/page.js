'use client'

import { useEffect, useState } from 'react'
import BatchSelector from '../components/BatchSelector'
import BatchAdder from '../components/BatchAdder'
import SemBox from '../components/SemBox'
import { createClient } from '../utils/supabase/client'

const Dashboard = () => {

    const [batch, setBatch] = useState('')
    const [isEditing, setEditing] = useState(false)
    const [userRole, setUserRole] = useState('')

    const supabase = createClient()
    
    useEffect(() => {
        const getRole = async () => {
            const { data: role, error} = await supabase.from('user_roles').select('role').eq('id', ((await supabase.auth.getUser()).data.user.id))
            setUserRole(role[0].role)
        }

        getRole()
    }, [])

  return (
    <>
      <div className='w-[96vw] mx-auto h-min pb-6 bg-white rounded-md shadow-md'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='font-bold text-xl py-4 px-6'>Semester Overview</h1>

        <div className='flex flex-row justify-evenly items-center mr-6'>
          <BatchSelector set={setBatch} />
          {(userRole === 'superadmin')? 
          <div className='flex flex-row'>
          <BatchAdder />
          <button onClick={() => setEditing(!isEditing)} className='w-max  bg-blue-600 rounded-md py-1.5 px-4 text-white active:bg-blue-800'>Toggle Edit</button>
           </div> : <></>}
          </div>
        </div>
        <div className='flex flex-row justify-center gap-4 flex-wrap'>
          <SemBox
            sem={1}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={2}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={3}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={4}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={5}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={6}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={7}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
          <SemBox
            sem={8}
            batch={batch.slice(-4)}
            editing={isEditing}
          />
        </div>
      </div>
    </>
  )
}

export default Dashboard
