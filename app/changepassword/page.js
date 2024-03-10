"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function ChangePassword() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
    }

    return (
        <main>
            <nav className="bg-blue-500 text-white p-3 w-full fixed top-0 left-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-bold"></h1>
                    <button
                        onClick={() => router.push('/login')}
                        className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Login
                    </button>
                </div>
            </nav>
            <div className="flex flex-1 min-h-screen pt-16 bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
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
                            className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-2 select-none hover:bg-blue-600 duration-300 mb-2"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
