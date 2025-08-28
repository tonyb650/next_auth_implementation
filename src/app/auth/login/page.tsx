import {LoginForm} from '@/components/auth/LoginForm'
import React, { Suspense } from 'react'

const LoginPage = () => {
  return (
    <Suspense>
      {/* Suspense is needed in the case of 'useSearchParams' in the LoginForm */}
      <LoginForm/>
    </Suspense>
  )
}

export default LoginPage