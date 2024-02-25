"use client"

import React, {useState} from "react"
import {loginUser} from "@/app/services/AuthenticationService"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = () => {
        loginUser({email, password})
    }

    return (
        <div>
            <div>
                <label>Email</label>
                <input value={email} onChange={event => setEmail(event.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input value={password} onChange={event => setPassword(event.target.value)}/>
            </div>
            <div>
                <button onClick={onSubmit}>Login</button>
            </div>
        </div>
    )

}

export default LoginPage