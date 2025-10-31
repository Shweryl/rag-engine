
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function register() {
    type Form = {
        name: string,
        email: string,
        password: string
    }

    type Errors = {
        [key: string]: string;
    };

    const initialForm = {
        name: "",
        email: "",
        password: ""
    };

    const form = {
        name: "",
        email: "",
        password: ""
    };

    const [formData, setFormData] = useState(form);
    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();



    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const newErrors: Errors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                newErrors[key] = "This field is required."
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setIsLoading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json();
            if (data.user) {
                setIsLoading(false);
                setFormData(initialForm)
                router.push('/auth/login')
            }
        } catch (error) {
            setIsLoading(false);
            console.error("An unexpected error occurred:", error);
        }



    };

    return <>
        <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-center">
            <div className="w-1/3">
                <h1 className="text-3xl mb-3 font-bold text-primary">Register Account</h1>
                <form onSubmit={handleSubmit} className="p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                    <label className="floating-label mb-4">
                        <span>Your Name</span>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Son" className="input input-md w-full" />
                    </label>
                    <label className="floating-label mb-4">
                        <span>Your Email</span>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="mail@site.com" className="input input-md w-full" />
                    </label>
                    <label className="floating-label mb-4">
                        <span>Your Password</span>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="password" className="input input-md w-full" />
                    </label>

                    <button disabled={isLoading} type="submit" className="btn btn-primary">
                        {isLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>

    </>
}