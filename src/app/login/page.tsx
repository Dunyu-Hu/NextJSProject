"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const form = new FormData(e.currentTarget);
        const username = String(form.get("username") || "");
        const password = String(form.get("password") || "");

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (data.ok) {
            router.push("/welcome");
        } else {
            setError(data.error || "登录失败");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="username" placeholder="账号" className="w-full border px-3 py-2 rounded" />
                    <input type="password" name="password" placeholder="密码" className="w-full border px-3 py-2 rounded" />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
                        登录
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-3">{error}</p>}
            </div>
        </div>
    );
}
