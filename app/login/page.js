"use client";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    function handleLogin() {
        router.push("/dashboard");
    }
    return (
        <main>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="flex flex-col bg-white shadow-lg py-16 px-32 items-center justify-center">
                    <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                        HealthBlocks
                    </h1>
                    <input
                        type="text"
                        placeholder="Email Address"
                        className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                    />
                    <button
                        onClick={handleLogin}
                        type="button"
                        className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                    >
                        Login
                    </button>
                </div>
            </div>
        </main>
    );
}
