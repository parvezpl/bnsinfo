'use client'

import React, { useState } from 'react'
import getEmbedding from './getEmbedding';
// import { section_extractor } from './section_extracter';
import { vactorseter } from './setvactor';
import getHindiEmbedding from './HindiEmbedding';

export default function Page() {
    const [inputdata, setInputdata] = useState('')
    const [actnumber, setActnumber] = useState(276)
    const createhandler = async () => {
        const res = await fetch('/api/embed/helper', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await res.json();
        console.log(data);
    };
    const uploadEmbedhandler = async () => {
        const res = await fetch('/api/embed/helper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // your data here
                key1: 'value1',
                key2: 'value2'
            })
        });

        const data = await res.json();
        console.log(data);
    };
    const getcollectionhandler = async () => {
        const res = await fetch('/api/embed/helper');
        const data = await res.json();
        console.log(data);
    };



    const vacterhandler = async () => {
        // const vector = await getEmbedding(inputdata)
        const vector = await getHindiEmbedding(inputdata)
        console.log("vacter", vector)
        const res = await fetch('/api/ai/vector_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vector: vector,
            })
        })
        const data = await res.json()
        console.log("res", data)
    }

    const setvactor = async () => {

        const res = await vactorseter(actnumber)
        console.log(res)
    }
    const getdatabyid = async () => {
        const res = await fetch('/api/ai/getdatbyid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: [406051816]
            })
        })
        const data = await res.json()
        console.log(data)
    }
    return (
        <div className='flex flex-col justify-center items-center space-y-4'>
            <div>
                <input type="text" value={inputdata} onChange={(e) => setInputdata(e.target.value)} />
                <button className='w-fit py-2 px-1 bg-green-400 text-black rounded-sm' onClick={() => vacterhandler()} >vacter</button>
            </div>
            <button
                className='w-fit py-2 px-1 bg-green-400 text-black rounded-sm'
                onClick={() => createhandler()}
            >dir create</button>
            <button
                className='w-fit py-2 px-1 bg-blue-400 text-black rounded-sm'
                onClick={() => uploadEmbedhandler()}
            >upload</button>
            <button
                className='w-fit py-2 px-1 bg-blue-400 text-black rounded-sm'
                onClick={() => getcollectionhandler()}
            >get connection name</button>
            <div className='flex flex-col gap-2 items-center bg-gray-300 p-4'>
                {/* <div className='w-[90vw] h-40 bg-gray-200 overflow-auto border'> </div> */}
                <div className='flex gap-4'>
                    <button onClick={() => setActnumber(prev => prev - 1)} className='bg-gray-500 px-2 rounded-sm'>prev {actnumber}</button>
                    <button onClick={() => setActnumber(prev => prev + 1)}>next {actnumber}</button>
                </div>
                <button
                    className='w-fit py-2 px-1 bg-yellow-400 text-black rounded-sm'
                    onClick={() => setvactor()}
                >set vactor</button>
            </div>
            <button
                className='w-fit py-2 px-1 bg-red-400 text-black rounded-sm'
                onClick={() => getdatabyid()}
            >get data by id </button>
        </div>
    )
}
