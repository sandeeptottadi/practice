import React from 'react'

export default function Navbar() {
  return (
    <div style={{ backgroundColor: 'var(--background-secondary)' }} className='h-10 w-full pl-4 p-2 flex flex-row gap-6 items-center'>
      <div className=' text-green-400 leading-8 text-2xl'>Practice</div>
      <select className=' rounded p-3' style={{ backgroundColor: 'var(--background-title)' }}>
        <option value="Javascript">Javascript</option>
        <option value="Python">Python</option>
        <option value="C++">C++</option>
      </select>
    </div>
  )
}
