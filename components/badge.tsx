import React from 'react'

type Props = {
    name:string
}

function Badge({
    name
}: Props) {
  return (
    <div className='flex items-center justify-center my-5'>
      <div className='rounded-full mx-auto inline-block border bg-black text-gray-300 py-2 px-5 text-sm'>
          {name}
      </div>
    </div>
  )
}

export default Badge