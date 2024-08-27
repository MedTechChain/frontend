"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


/**
 * ADMIN DASHBOARD: Allows the admin to view, add, edit, and delete researchers
 */
export default function Dashboard() {
    const router = useRouter();

    // State management
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newConfigKey, setNewConfigKey] = useState("Select a property");
    const [newConfigValue, setNewConfigValue] = useState("");

    const [possibleConfigs, setPossibleConfigs] = useState(["a", "b"]);
    const [updateConfigs, setUpdateConfigs] = useState({});
    const [currentConfigs, setCurrentConfigs] = useState({});


    // Function to toggle the dropdown for encryption schemes
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // API URL from environment values or use default value
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;


    // Function to handle logout
    const handleLogout = () => {
        // Clear user token or session data
        localStorage.removeItem("token");

        // Redirect to login page or any other page you consider as the logout landing page
        router.push('/login');
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        return decoded.exp < currentTime;
    };

    async function handleAddResearcher() {
        router.push("dashboard");
    }

    async function addConfig(event) {
        event.preventDefault();
        if (newConfigKey && newConfigValue && newConfigKey != "Select a property") {
            setUpdateConfigs((prevData) => ({
                ...prevData,
                [newConfigKey]: newConfigValue,
            }));
        }
    }


    async function handleUpdateConfig(event) {
        event.preventDefault();

        // Get token from local storage
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            handleLogout(); // Implement this function to clear the token and redirect
            return Promise.reject("Token expired");
        }

        // Send a POST request to the server to add the new researcher
        try {
            const response = await fetch(`${API_URL}/api/platform/configs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateConfigs),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to update configs");
            }
        } catch (error) {
            console.error("Error during config update:", error);
        }

        router.push('/platformconfig');
    }

    // Function to fetch all researchers
    async function fetchConfigs() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/platform/configs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch configs");
            }

            const data = await response.json();
            setPossibleConfigs(data.keys);
            setCurrentConfigs(data.config);
        } catch (error) {
            console.error("Error fetching researchers:", error);
        }
    }

    useEffect(() => {
        // Initial fetch of researchers
        fetchConfigs();

        // Function to handle click outside the dropdown to close it
        const handleClickOutside = (event) => {
            if (isDropdownOpen && (!event.target.closest('.dropdown-container') && !event.target.closest('#menu-button'))) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener to handle clicks outside the dropdown
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [API_URL, isDropdownOpen]);



    // Footer component
    const Footer = () => (
        <footer className="text-center text-sm text-gray-500 py-4 absolute bottom-0 w-full">
            © {new Date().getFullYear()} Septon. All rights reserved.
        </footer>
    );

    const EllipsisBox = ({ text }) => {
        const style = {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        };

        return (
            <div style={style}>
                {text}
            </div>
        );
    };

    return (
        <main>
            <nav className="text-white p-3 w-full fixed top-0 left-0 z-50" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo Section */}
                    <a href="https://septon-project.eu/" target="_blank" rel="noopener noreferrer">
                        <img src="/images/septon_logo.png" alt="Logo" className="px-5 h-16" />
                    </a>

                    {/* Right Section - Encryption Option and Logout Button */}
                    <div className="flex items-center">

                        <div className="relative inline-block text-left mr-5"> {/* Added margin-right for spacing */}
                            <button
                                onClick={handleAddResearcher}
                                className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                            >
                                Researcher dashboard
                            </button>
                        </div>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="flex h-4/5 w-3/4 p-4 py-10">
                    <div className=" flex flex-col items-center justify-center w-1/2 h-[500px]">
                        <h2 className="text-teal-600 text-4xl font-bold pb-4 select-none">
                            Current Configs
                        </h2>
                        <div className="flex flex-col bg-white h-5/6 w-5/6 overflow-y-scroll shadow-lg rounded-lg">
                            {
                                Object.entries(currentConfigs).map(([key, value], index) => {
                                    const text = `${key} -> ${value}`
                                    return (
                                        <div
                                            key={index}
                                            className="px-4 py-1 hover:bg-gray-200 bg-gray-100 flex  items-center justify-between border-b border-gray-400 border-solid last:border-b-0"
                                        >
                                            <EllipsisBox text={text} />
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                    <div className=" flex flex-col  items-center justify-center w-1/2 border-l-2 border-gray-200 h-[500px]">
                        <h1 className="text-teal-600 text-4xl font-bold pb-4 select-none">
                            Modify Config
                        </h1>
                        <form
                            onSubmit={handleUpdateConfig}
                            className="flex flex-col items-center justify-center w-full"
                        >
                            <div className="relative inline-block text-left mr-5"> {/* Added margin-right for spacing */}
                                <button
                                    type="button"
                                    className="m-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    id="menu-button"
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                    onClick={toggleDropdown}
                                >
                                    {newConfigKey}
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="dropdown-container origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            {
                                                possibleConfigs.map((conf, index) => {
                                                    const id = `"menu-item-${index}"`
                                                    return (
                                                        <a href="#" className={`text-gray-700 block px-4 py-2 text-sm hover:bg-gray-200`} role="menuitem" tabIndex="-1" id={id} onClick={() => setNewConfigKey(conf)}>{conf}</a>
                                                    )
                                                })}

                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="value"
                                onChange={(e) => {
                                    setNewConfigValue(e.target.value);
                                }}
                                className={`outline-none duration-300 border-solid border-2  p-2 w-full max-w-[30ch] rounded-lg mb-4`} />

                            <div className="m-3 flex flex-col bg-white h-3/5 w-3/5 overflow-y-scroll shadow-lg rounded-lg">
                                {
                                    Object.entries(updateConfigs).map(([key, value], index) => {
                                        const text = `${key} -> ${value}`
                                        return (
                                            <div
                                                key={index}
                                                className="px-4 py-1 hover:bg-gray-200 bg-gray-100 flex  items-center justify-between border-b border-gray-400 border-solid last:border-b-0"
                                            >
                                                <EllipsisBox text={text} />
                                            </div>
                                        )
                                    })}
                            </div>
                            <button
                                onClick={addConfig}
                                className="bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                            >
                                Add
                            </button>
                            <button
                                type="submit"
                                className="bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

