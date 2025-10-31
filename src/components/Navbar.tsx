"use client"


import Link from "next/link"
import { useSession, signOut } from "next-auth/react";
export default function Navbar() {
    const { data: session } = useSession();

    return (

        <div className="navbar bg-base-100/20 shadow-sm h-16">
            <div className="flex-1">
                <Link href="/"><p className="text-2xl font-bold text-primary px-3">RAG</p></Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {
                        !session ? (
                            <>
                                <li>
                                    <Link href="/auth/login" className="font-bold text-primary">Login</Link>
                                </li>
                                <li>
                                    <Link href="/auth/register" className="font-bold text-primary">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/getUrl" className="font-bold text-primary">Get Url</Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                        className="font-bold text-primary"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}