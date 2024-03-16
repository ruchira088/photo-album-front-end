"use client"

import React, {ChangeEvent, useState} from "react"
import {createUser} from "@/app/services/UserService"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {loginUser} from "@/app/services/AuthenticationService"

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const router = useRouter()

    const onSubmit = () => {
        createUser({email, password, firstName, lastName})
            .then(() => loginUser({email, password}))
            .then(() => router.push("/home"))
    }

    const inputHandler =
        (fn: (inputValue: string) => void) => (inputEvent: ChangeEvent<HTMLInputElement>): void => {
            fn(inputEvent.target.value)
        }

    return (
        <div>
            <div>
                <label>Email</label>
                <input value={email} type="email" onChange={inputHandler(setEmail)}/>
            </div>
            <div>
                <label>Password</label>
                <input value={password} type="password" onChange={inputHandler(setPassword)}/>
            </div>
            <div>
                <label>Confirm Password</label>
                <input value={confirmPassword} type="password" onChange={inputHandler(setConfirmPassword)}/>
            </div>
            <div>
                <label>First Name</label>
                <input value={firstName} onChange={inputHandler(setFirstName)}/>
            </div>
            <div>
                <label>Last Name</label>
                <input value={lastName} onChange={inputHandler(setLastName)}/>
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