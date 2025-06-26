import React from 'react'
import Image from 'next/image'

export const Loading = () => {
  return (
    <div className='relative flex items-center justify-center h-screen'>
      {/* Fondo con blur */}
      <div className='absolute inset-0 backdrop-blur-sm bg-white/30'></div>
      
      <div className='relative'>
        {/* Círculo giratorio exterior */}
        <div className='absolute inset-0 -m-8 animate-spin'>
          <div className='w-full h-full border-t-4 border-b-4 border-blue-800 rounded-full'></div>
        </div>
        
        {/* Logo central */}
        <div className='relative z-10 flex items-center justify-center w-32 h-32 bg-white rounded-full'>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={80}
            className='object-contain'
          />
        </div>
      </div>
    </div>
  )
}
