'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

const BatchSelector = ({ set }) => {
  let [batches, setBatches] = useState([])
  let [selectedOption, setSelectedOption] = useState('')
  useEffect(() => {
    const fetchBatches = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.from('Batches').select('batch_id')
    //   console.log(data)
      setBatches(data)
    }

    fetchBatches()
  }, [])

  const handleSelectionChange = async (e) => {
    const value = e.target.value
    setSelectedOption(value)
    
    set(value)
  }

  return (
    <select
      className='h-min max-w-64 px-6 py-2 mr-6 rounded-md bg-blue-100'
      id='options'
      value={selectedOption}
      onChange={handleSelectionChange}
    >
        <option value={0}>Select Batch</option>
      {batches.map((batch) => (
        <option
          key={batch.batch_id}
          value={batch.batch_id}
        >
          {batch.batch_id.slice(-4)}-{Number(batch.batch_id.slice(-4)) + 4}
        </option>
      ))}
    </select>
  )
}

export default BatchSelector
