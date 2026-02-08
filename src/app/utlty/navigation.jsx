'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import './navigation.css'
import LanguageSelector from './LanguageSelector'
import useStore from '../../../store/useStore'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function Navigation({ className }) {
  const router = useRouter()
  const [searchvalue, setSearchvalue] = useState('')
  const [loginPop, setLoginPop] = useState(false)
  const setSearchbtn = useStore((state => state.setSearchbtn))
  const setLanguages = useStore((state => state.setLanguages))
  const { data: session, status } = useSession()

  const bnsSeachHandler = (e) => setSearchvalue(e)
  const searchbutton = () => {
    if (!searchvalue.trim()) return
    setSearchbtn(searchvalue)
    router.push(`/bns/bnssearch`)
  }

  function LoginPop() {
    return (
      <div className="nav-user-pop">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="nav-user-item"
        >
          {session?.user?.name}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="nav-user-item"
          onClick={() => signOut()}
        >
          Logout
        </motion.button>
      </div>
    )
  }

  return (
    <div className={`nav-wrap ${className || ''}`}>
      <div className="nav-inner">
        <div className="nav-top">
          <div className="nav-disclaimer">
            <span>
              <b>Disclaimer:</b> This is a non-governmental site created for educational purposes, aiming to simplify Bharatiya Nyaya Sanhita 2023 for easy understanding.
            </span>
          </div>
          <div className="nav-lang">
            <LanguageSelector setLanguages={(e) => setLanguages(e)} />
          </div>
        </div>

        <div className="nav-main">
          <div className="nav-brand">
            <div className="nav-title">भारतीय न्याय संहिता 2023</div>
            <div className="nav-subtitle">नया कानून गाइड</div>
          </div>

          <div className="nav-actions">
            <div className="nav-logo">
              <Image src="/bnslogo.png" alt="Logo" width={100} height={40} />
            </div>
            <div className="nav-user" onClick={() => setLoginPop(prev => !loginPop)}>
              {session && (
                <>
                  <Image
                    src={session?.user.image || null}
                    alt={session?.user.name || null}
                    width={36}
                    height={36}
                    className="nav-avatar"
                  />
                  {loginPop && <LoginPop />}
                </>
              )}
              {status === 'unauthenticated' && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  className="nav-login-btn"
                  onClick={() => { signIn('google') }}
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="nav-links">
          <Link href="/" className="nav-link">🏠 Home</Link>
          <Link href="/about" className="nav-link">About Us</Link>
          <Link href="/bns/mainpage/en" className="nav-link nav-hide-sm">Bharatiya Nyaya Sanhita 2023</Link>
          <Link href="/bns/mainpage/en" className="nav-link nav-show-sm">BNS 2023</Link>
          <Link href="/bns/mainpage/hi" className="nav-link nav-hide-sm">भारतीय न्याय संहिता,2023 (Hindi)</Link>
          <Link href="/bns/mainpage/hi" className="nav-link nav-show-sm">भा0न्या0सं0 2023</Link>
          <Link href="/blog" className="nav-link">Blogs</Link>
          <Link href="/forums" className="nav-link">Forums</Link>
          {session?.user && session.user.role === 'admin' && (
            <Link href="/admin" className="nav-link">Admin</Link>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              searchbutton()
            }}
            className="nav-search"
          >
            <input
              id="i"
              type="text"
              placeholder="धारा या अपराध खोजें..."
              value={searchvalue}
              onChange={(e) => bnsSeachHandler(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>
      </div>
    </div>
  )
}
