"use client"

import React, {useState} from "react"
import {createUser} from "@/app/services/UserService"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {loginUser} from "@/app/services/AuthenticationService"

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const router = useRouter()

    const onSubmit = () => {
        createUser({email, password, firstName, lastName})
            .then(() => loginUser({email, password}))
            .then(() => router.push("/home"))
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
                <label>First Name</label>
                <input value={firstName} onChange={event => setFirstName(event.target.value)}/>
            </div>
            <div>
                <label>Last Name</label>
                <input value={lastName} onChange={event => setLastName(event.target.value)}/>
            </div>
            <div>
                <button onClick={onSubmit}>Create</button>
            </div>
            <div>
                <Link href="/login">Login</Link>
            </div>
        </div>
    )
}

export default SignUp