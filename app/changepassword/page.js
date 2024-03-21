"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePassword() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // API URL from environment values or use default value
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;


    async function handleChangePassword(event) {
        event.preventDefault();
        setErrorMessage("");

        // Check for password match
        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        // Check for empty fields
        if (!newPassword || !confirmPassword || !currentPassword || !username) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        // Validate password length
        if (newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }

        // Regular expression to check for a secure password
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            setErrorMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/users/change_password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    old_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to change password. Please try again.");
            }

            setUsername("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Redirect to log in again
            router.push('/login');

        } catch (error) {
            console.error("Error changing password:", error);
            setErrorMessage(error.message);
        }
    }

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
                        onClick={() => router.push('/login')}
                        className="text-teal-600 text-lg hover:bg-teal-700 hover:text-white duration-300 font-bold py-2 px-4 rounded"

                    >
                        Back to Login
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 min-h-screen pt-16 bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-teal-600 text-4xl font-bold pb-4 select-none">
                        MedTech Chain
                    </h1>
                    <form
                        onSubmit={handleChangePassword}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        <input
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            required
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
                            placeholder="Current Password"
                            required
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage ? "border-red-500" : "border-gray-200"} p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            required
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage ? "border-red-500" : "border-gray-200"} p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            required
                            className={`outline-none duration-300 border-solid border-2 ${errorMessage ? "border-red-500" : "border-gray-200"} p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errorMessage && (
                            <div className="text-red-500 mb-4">{errorMessage}</div>
                        )}
                        <button
                            type="submit"
                            className="bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-2 select-none hover:bg-teal-700 duration-300 mb-2"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );
}
