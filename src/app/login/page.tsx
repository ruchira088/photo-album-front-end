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
        <div className={styles.loginForm}>
            <div className={styles.email}>
                <label>Email</label>
                <input value={email} type="email" onChange={event => setEmail(event.target.value)}/>
            </div>
            <div className={styles.password}>
                <label>Password</label>
                <input value={password} type="password" onChange={event => setPassword(event.target.value)}/>
            </div>
            <div className={styles.loginButton}>
                <button onClick={onSubmit}>Login</button>
            </div>
            <div className={styles.signUpLink}>
                <Link href="/sign-up">Sign Up</Link>
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