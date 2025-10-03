import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const header = () => {
  return (
    <header className="flex justify-center items-center p-4 gap-4 h-16">
        <div className='flex-1'>
            <h1 className='text-3xl font-bold'>Indi</h1>
        </div>
        <div>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>        
    </header>
  )
}

export default header