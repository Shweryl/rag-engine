// pages/auth/signin.tsx
'use client'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

type Errors = {
    [key: string]: string
}

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<Errors>({})
    const { data: session, status, update } = useSession()
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Errors = {}
        if (!email) newErrors.email = "Email is required.";
        if (!password) newErrors.password = "Password is required."

        if (Object.entries(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setIsLoading(true);
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result && result.ok) {
                setIsLoading(false);
                setEmail("")
                setPassword("")
                router.push('/getUrl')
            }

            if (result?.error) {
                setIsLoading(false);
                // setErrors(result.error)
                console.log(result.error)
            }
        } catch (error) {
            setIsLoading(false);
            console.error("An unexpected error occurred:", error)
        }
    }
    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <div className="w-1/3">
                <h2 className="text-3xl font-bold text-primary">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-md rounded-sm border border-white/20 p-8 mt-3">
                    <label className="floating-label">
                        <span>Your Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@site.com" className="input input-md w-full" />
                    </label>
                    <label className="floating-label">
                        <span>Your Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="input input-md w-full" />
                    </label>
                    <button disabled={isLoading} type="submit" className="btn btn-primary">
                        {isLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>
                {/* <div className="oauth-signin mt-4 text-center">
                    <button onClick={() => signIn('google', { callbackUrl: '/' })} className='bg-purple-500'>Sign in with Google</button>
                </div> */}
            </div>
        </div>
    )
}