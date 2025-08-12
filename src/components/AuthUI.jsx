import React from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function AuthUI() {
  return (
    <div className="auth-container">
      {/* When user is signed out, show Sign In button */}
      <SignedOut>
        <SignInButton>
          <button className="btn-signin font-semibold text-xl">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      {/* When user is signed in, show user avatar/menu */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
