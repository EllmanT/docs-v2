"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { RadarIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

function Header() {
    const pathname = usePathname();
    const isHomePage = pathname ==="/"
  return (
    <div className={`p-4 flex justify-between items-center ${isHomePage ?"bg-blue-50":"bg-white border-b border-blue-50"}`}>
        <Link href="/" className='flex items-center'>
        <RadarIcon
        className='w-6 h-6 text-blue-500 mr-2 '
        />
        <h1 className='text-xl font-semibold'>FiscalLens 🔍</h1>
        </Link>
        <div className='flex items-center space-x-4'>
            <SignedIn>
                <Link href="/docs">
                    <Button variant="outline"
                      className="hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"

                    >My Docs</Button>
                </Link>
                <Link href="/manage-plan">
                    <Button 
                    className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:cursor-pointer transition duration-300 ease-in-out">

                    Manage Plan</Button>
                </Link>
                <UserButton/>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                      variant="secondary"
  className="bg-blue-200 hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"

                    >
                        Login
                    </Button>
                </SignInButton>
            </SignedOut>
        </div>
    </div>
  )
}

export default Header