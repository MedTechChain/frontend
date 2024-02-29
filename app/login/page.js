"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;

    async function handleLogin(event) {
        event.preventDefault();

        const loginDetails = {
            username,
            password,
        };

        console.log(loginDetails);

        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginDetails),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Login failed");
            }

            // Assuming your backend sends a token or some user data on successful login
            console.log(response);
            const data = await response.json();

            if (
                !data.jwt ||
                !data.token_type ||
                typeof data.expires_in === "undefined"
            ) {
                console.error("Expected data not present in the response");
                return;
            }

            localStorage.setItem("token", data.jwt);
            localStorage.setItem("token_type", data.token_type);
            localStorage.setItem("token_expires_in", data.expires_in);

            router.push("/dashboard");
        } catch (error) {
            console.error("An error occurred during login:", error);
            //TODO
        }
    }
    return (
        <main>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                        MedTech Chain
                    </h1>
                    <p className="select-none mb-4">Sign in</p>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        <input
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            required
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                            alue={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            required
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
