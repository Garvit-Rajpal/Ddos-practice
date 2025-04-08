import { Turnstile } from '@marsidev/react-turnstile'

import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState<string>("")

  return (
    <>
      <input placeholder='OTP'></input>
      <input placeholder='New password'></input>

      <Turnstile onSuccess={(token) => {
        setToken(token)
      }} siteKey={process.env.SITE_KEY||''}/>

      <button onClick={() => {
        axios.post("http://localhost:3000/reset-password", {
          email: "garvit@gmail.com",
          otp: "711291",
          token: token,
          newPassword:"garv"
        })
      }}>Update password</button>
    </>
  )
}

export default App