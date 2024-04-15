import React from 'react'

export default function Message({ children, avatar, userName, description }) {
  return (
    <div className="bg-white p-8 flex items-center gap-2">
        <div className="flex">
            <img src = {avatar} className="w-10 rounded-full"/>
            <h2>{userName}</h2>
        </div>
        <div>
            <p className="text-black text-sm">{description}</p>
        </div>
        {children}
    </div>
  )
}
