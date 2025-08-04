import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  return (
    <div className='bg-gray-200 p-4 w-64 h-full '>
      <h2 className='text-xl font-bold bg-gray-400'>Admin Sidebar</h2>
      <ul className='mt-4 space-y-2 pl-4'>
        <li><Link href="/admin/blog">Write blogs</Link></li>
        <li><Link href="/admin/users">Manage Users</Link></li>
        <li><Link href="/admin/roles">Manage Roles</Link></li>
        <li><Link href="/admin/settings">Settings</Link></li>
      </ul>
    </div>
  )
}
