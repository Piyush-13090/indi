import React from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { motion } from 'framer-motion'

const header = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <header className="relative backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 gap-4 h-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='flex-1'
        >
          <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent'>
            Indi
          </h1>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {publishableKey ? (
            <>
              <SignedOut>
                <SignInButton>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
                <SignUpButton>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl backdrop-blur-sm"
                  >
                    Sign Up
                  </motion.button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "backdrop-blur-xl bg-white/90 dark:bg-black/60 border border-white/20 dark:border-white/10",
                      userButtonPopoverActionButton: "hover:bg-white/50 dark:hover:bg-black/30"
                    }
                  }}
                />
              </SignedIn>
            </>
          ) : (
            <>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </motion.div>        
      </div>
    </header>
  )
}

export default header