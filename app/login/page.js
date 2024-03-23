"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";


/**
 * Login page: Allows Admin and Researcher to login to the respective dashboards
 */

export default function Login() {
    // State management
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // New state for error message

    // API URL from environment values or use default value
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;

    // Function to handle login
    async function handleLogin(event) {
        event.preventDefault();
        setErrorMessage("");

        if (!username.trim() || !password.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

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

            // Saving JWT in local storage
            localStorage.setItem("token", data.jwt);
            localStorage.setItem("token_type", data.token_type);
            localStorage.setItem("token_expires_in", data.expires_in);

            const decoded = jwtDecode(data.jwt);
            console.log(decoded);
            if (decoded.role == "ADMIN") {
                router.push("/dashboard");
            } else if (decoded.role == "RESEARCHER") {
                router.push("/researchercount");
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            setErrorMessage("Login failed. Try again."); // Update this line to set the error message
        }
    }

    // Function to handle redirection to the Change Password page
    const handleChangePasswordClick = () => {
        router.push('/changepassword');
    };

    // Footer component
    const Footer = () => (
        <footer className="text-center text-sm text-gray-500 py-4 absolute bottom-0 w-full">
            © {new Date().getFullYear()} Septon. All rights reserved.
        </footer>
    );

    return (
        <main>

            <nav className=" text-white p-3 w-full fixed top-0 left-0 z-50 " style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <a href="https://septon-project.eu/" target="_blank" rel="noopener noreferrer">
                        <img src="/images/septon_logo.png" alt="Logo" className="px-5 h-16 mr-10" />
                    </a>
                    <button
                        onClick={handleChangePasswordClick}
                        className="text-teal-600 text-lg hover:bg-teal-700 hover:text-white duration-300 font-bold py-2 px-4 rounded"

                    >
                        Change Password
                    </button>
                </div>
            </nav>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-teal-600 text-4xl font-bold pb-4 select-none">
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
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                ? "border-red-500"
                                : "border-gray-200"
                                } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} // Change border color on error
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value),
                                    setErrorMessage("");
                            }}
                        />
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                ? "border-red-500"
                                : "border-gray-200"
                                } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value),
                                    setErrorMessage("");
                            }}
                        />
                        {errorMessage && ( // Conditionally render error message
                            <div className="text-red-500 mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );
}
