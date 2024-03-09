"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Login page: Allows Admin and Researcher to login to the respective dashboards
 */
export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // New state for error message

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;

    // Function to handle login
    async function handleLogin(event) {
        event.preventDefault();
        setErrorMessage("");

        const loginDetails = {
            username,
            password,
        };

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

            const decoded = jwtDecode(data.jwt);
            console.log(decoded)
            if (decoded.role == "ADMIN") {
                router.push("/dashboard");
            } else if (decoded.role == "RESEARCHER") {
                router.push("/researcher");
            }

        } catch (error) {
            console.error("An error occurred during login:", error);
            setErrorMessage("Login failed. Try again."); // Update this line to set the error message
        }
    }
    return (
        <main>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                        MedTech Chain
                    </h1>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        <input
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            required
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage ? "border-red-500" : "border-gray-200"
                                } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} // Change border color on error

                            value={username}
                            onChange={(e) => {setUsername(e.target.value), setErrorMessage("")}}
                        />
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            required
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage ? "border-red-500" : "border-gray-200"
                                } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} // Change border color on error
                            value={password}
                            onChange={(e) => {setPassword(e.target.value), setErrorMessage("")}}
                        />
                        {errorMessage && ( // Conditionally render error message
                            <div className="text-red-500 mb-4">{errorMessage}</div>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
