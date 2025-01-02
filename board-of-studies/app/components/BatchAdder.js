'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { createClient } from '../utils/supabase/client'

const BatchAdder = () => {

    const supabase = createClient()
    const [addingBatch, setAddingBatch] = useState(false)
    const [newBatch, setNewBatch] = useState('')

    const createNewBatch = async () => {
        let batchid = 'BAT' + newBatch
        let arr = []
        for (let i = 0; i < 8; i++) {
            arr[i] = 'sem' + newBatch + (i+1)
            await supabase.from('Semesters').insert({sem_id: arr[i], course_ids: ''})
        }

        let sems = arr.join(',')
        console.log(sems)
        console.log(batchid)
        await supabase.from('Batches').insert({batch_id: batchid, sem_ids: sems})

        setAddingBatch(false)
    }
  return (
    <>
    {(!addingBatch)? 
    <button className='bg-blue-600 text-white mr-4 px-6 py-1.5 rounded-md active:bg-blue-800 max-w-64' onClick={() => setAddingBatch(!addingBatch)}>Add Batch</button> : 
    <div className='grid grid-cols-3 grid-rows-1 max-w-64'>
        <input type='number' min={0} max={3500} className='border-[1px] p-1.5 rounded-s-md col-span-2' onChange={(e) => setNewBatch(e.target.value)}/>
        <button onClick={createNewBatch} className='w-max p-1.5 bg-blue-600 col-span-1 rounded-e-md hover:cursor-pointer active:bg-blue-800'>
            <Image width={16} height={16} src={'/check-solid.svg'} alt='batch input'/>
        </button>
    </div>
}
</>
  )
}

export default BatchAdder