"use client"

import React, {useState} from "react"
import {loginUser} from "@/app/services/AuthenticationService"
import {useRouter, useSearchParams} from "next/navigation"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const searchParams = useSearchParams()
    const router = useRouter()

    console.log()

    const onSubmit = () => {
        loginUser({email, password})
            .then(() => {
                const next = searchParams.get("next")

                if (next != null) {
                    router.push(next)
                    // window.location.href = next
                } else {

                }
            })
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