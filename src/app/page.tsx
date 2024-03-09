import React from "react"
import Link from "next/link"

const Index = () => (
    <div>
        <Link href="/home">
            <div>Home</div>
        </Link>
        <Link href="/login">
            <div>Login</div>
        </Link>
        <Link href="/sign-up">
            <div>Sign Up</div>
        </Link>
    </div>
)

export default Index