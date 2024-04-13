"use client"

import React, {Suspense, useEffect, useState} from "react"
import {authenticatedUser, loginUser} from "@/app/services/AuthenticationService"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "next/link"

import styles from "./styles.module.scss"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        authenticatedUser()
            .then(() => router.push("/home"))
            .catch(() => {})
    }, [])

    const onSubmit = () => {
        loginUser({email, password})
            .then(() => {
                    const next = searchParams.get("next")

                    if (next != null) {
                        router.push(next)
                    } else {
                        router.push("/home")
                    }
                }
            )
    }

    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your credential to login</p>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Email</label>
                <input className={styles.input} value={email} type="email"
                       onChange={event => setEmail(event.target.value)}/>
            </div>
            <div className="space-y-2">
                <label className="font-bold">Password</label>
                <input className={styles.input} value={password} type="password"
                       onChange={event => setPassword(event.target.value)}/>
            </div>
            <button className={`w-full ${styles.loginButton}`} onClick={onSubmit}>Login</button>
            <div className="mt-4 text-center text-sm">
                Already have an account?
                <Link className="underline" href="/sign-up">Sign Up</Link>
            </div>
        </div>
    )
}

const LoginPageContainer =
    () => (
        <Suspense>
            <LoginPage/>
        </Suspense>
    )

export default LoginPageContainer