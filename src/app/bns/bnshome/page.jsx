import Link from 'next/link'
import React from 'react'
import Search_comp from '../ai_search/search_comp'

export default function Page() {
  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center bg-gradient-to-r from-gray-200 to-blue-300 text-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Choose Your Preferred Language</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Select your preferred language to read the Bharatiya Nyay Sanhita 2023.
      </p>
      <div className="flex flex-col gap-4">
        <Link href="/bns/mainpage/en">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 cursor-pointer shadow-md">
            Bharatiya Nyay Sanhita 2023 (English)
          </div>
        </Link>
        <Link href="/bns/mainpage/hi">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 cursor-pointer shadow-md">
            भारतीय न्याय संहिता 2023 (हिन्दी)
          </div>
        </Link>
        <Search_comp/>
      </div>
    </div>
  )
}
