'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import './navigation.css'
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
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [status, session])

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
          {user?.name}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="nav-user-item"
          onClick={() => signOut()}
        >
          लॉगआउट
        </motion.button>
      </div>
    )
  }

  return (
    <div className={`nav-wrap ${className || ''}`}>
      <div className="nav-inner">
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
              {user && (
                <>
                  <Image
                    src={user.image || null}
                    alt={user.name || null}
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
                  लॉगिन
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="nav-links">
          <div className="nav-links-left">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/bns" prefetch className="nav-link nav-hide-sm">भारतीय न्याय संहिता 2023</Link>
            <Link href="/bns" prefetch className="nav-link nav-show-sm">वी0एन0एस0 2023</Link>
            <Link href="/blog" prefetch className="nav-link">Blog</Link>
            <Link href={`/forums?user=${encodeURIComponent(user?.name || '')}`} prefetch className="nav-link">Forums</Link>
            {user && user.role === 'admin' && (
              <Link href="/admin" prefetch className="nav-link">Admin</Link>
            )}
          </div>
          <div className="nav-links-right">
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
    </div>
  )
}
