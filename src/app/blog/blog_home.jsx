
import React from 'react'

export default async function Blog_home() {
    const getdata = async () => {
        const tempblogs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blog`, {
            cache: 'no-store',
        });
        if (!tempblogs.ok) throw new Error('Failed to fetch blogs');
        return tempblogs.json();
    };

    const blogs = await getdata();
    // console.log('Blogs fetched:', blogs);
    return (
        <div className="min-h-screen  bg-white text-gray-800 m-auto">
            {/* Header */}
            <header className="bg-[#002147] text-white py-6 text-center shadow-md mb-4">
                <h1 className="text-3xl font-bold">भारतीय कानून की जानकारी - BNS Info ब्लॉग</h1>
                <p className="text-lg mt-2">न्याय संहिता, कानून एवं नीतियों की सरल जानकारी व अपडेट</p>
            </header>
            {/* Main Container */}
            <div className='flex flex-row gap-8 max-w-[90vw] m-auto p-[20px] '>
                <div className='flex-3'>
                    {blogs.map((blog) => (
                        <div key={blog._id} className="flex flex-col md:flex-row mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={blog.image || '/default-image.jpg'} alt="thumbnail" className="w-full md:w-48 h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">
                                    <a href={`/blog/${blog._id}`} className="text-blue-600 hover:underline">
                                        {blog.title}
                                    </a>
                                </h2>
                                <div className="text-sm text-gray-600 mt-1">लेखक: {blog.author} | {blog.date}</div>
                                <p className="mt-2">{blog.excerpt}</p>
                                <p className="mt-2">{blog.image.base64}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Sidebar */}
                <aside className="flex-1 flex flex-col gap-6">
                    {/* Author Box */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-start gap-4">
                        <img src="/a2.jpg" alt="Author" className="w-16 h-16 float-left rounded-full object-cover " />
                        <div>
                            <h3 className="text-lg font-semibold">About Blog</h3>
                            <p className="text-sm mt-1">कानून विश्लेषक और लेखक। BNS Info पर सटीक और सरल जानकारी देने के लिए प्रतिबद्ध।</p>
                        </div>
                    </div>

                    {/* Archive */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">आर्काइव (महीनों के अनुसार)</h3>
                        <ul className="space-y-1 text-blue-700">
                            <li><a href="#">जून 2025</a></li>
                            <li><a href="#">मई 2025</a></li>
                            <li><a href="#">अप्रैल 2025</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">श्रेणियाँ</h3>
                        <ul className="space-y-1 text-blue-700">
                            <li><a href="#">BNS Updates</a></li>
                            <li><a href="#">कानूनी समाचार</a></li>
                            <li><a href="#">विश्लेषण</a></li>
                            <li><a href="#">धाराएँ और धाराएँ</a></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
