"use client"

import React, {ChangeEvent, useState} from "react"
import {createUser} from "@/app/services/UserService"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {loginUser} from "@/app/services/AuthenticationService"

import styles from "./styles.module.scss"

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const router = useRouter()

    const onSubmit = () => {
        const validationErrors = validate()

        if (validationErrors.length === 0) {
            createUser({email, password, firstName, lastName})
                .then(() => loginUser({email, password}))
                .then(() => router.push("/home"))
        } else {
            setErrors(validationErrors)
        }
    }

    const validate = (): string[] => {
        const errors: string[] = []

        if (email.length === 0) {
            errors.push("Please enter a valid email")
        }

        if (password !== confirmPassword) {
            errors.push("Passwords don't match")
        }

        if (password.length === 0) {
            errors.push("Password cannot be empty")
        }

        if (firstName.length === 0) {
            errors.push("First name cannot be empty")
        }

        return errors
    }

    const inputHandler =
        (fn: (inputValue: string) => void) => (inputEvent: ChangeEvent<HTMLInputElement>): void => {
            setErrors([])
            fn(inputEvent.target.value)
        }

    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Email</label>
                <input className={styles.input} value={email} type="email" onChange={inputHandler(setEmail)} placeholder="Your Email"/>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Password</label>
                <input className={styles.input} value={password} type="password" onChange={inputHandler(setPassword)} placeholder="Password"/>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Confirm Password</label>
                <input className={styles.input} value={confirmPassword} type="password" onChange={inputHandler(setConfirmPassword)} placeholder="Confirm Password"/>
            </div>
            <div className="space-y-2">
                <label className="font-bold">First Name</label>
                <input className={styles.input} value={firstName} onChange={inputHandler(setFirstName)} placeholder="Your First Name"/>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Last Name</label>
                <input className={styles.input} value={lastName} onChange={inputHandler(setLastName)} placeholder="Your Last Name (Optional)"/>
            </div>
            <div className="space-y-2">
                { errors.map((error, index) => <div key={index}>{error}</div>) }
            </div>
            <button className={`w-full ${styles.signUpButton}`} onClick={onSubmit}>Sign Up</button>
            <div className="mt-4 text-center text-sm">
                Already have an account?
                <Link className="underline" href="/login">Login</Link>
            </div>
        </div>
    )
}

export default SignUp