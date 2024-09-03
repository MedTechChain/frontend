"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
    const router = useRouter();

    // State management
    const [newConfigKey, setNewConfigKey] = useState("Select a property");
    const [newConfigValue, setNewConfigValue] = useState("");
    const [possibleConfigs, setPossibleConfigs] = useState([]);
    const [updateConfigs, setUpdateConfigs] = useState([]);
    const [currentConfigs, setCurrentConfigs] = useState([]);
    const [placeholder, setPlaceholder] = useState("value");

    // API URL from environment values or use default value
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";

    // Function to handle logout
    const handleLogout = () => {
        // Clear user token or session data
        localStorage.removeItem("token");
        // Redirect to login page
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
        if (newConfigKey && newConfigValue && newConfigKey !== "Select a property") {
            setUpdateConfigs([...updateConfigs, {"key": newConfigKey, "value": newConfigValue}]);

            // Remove the added config key from the dropdown
            setPossibleConfigs(possibleConfigs.filter(config => config !== newConfigKey));
            // Reset the dropdown and input field
            setNewConfigKey("Select a property");
            setNewConfigValue("");
        }
    }

    async function handleUpdateConfig(event) {
        event.preventDefault();

        if (updateConfigs.length != 0) {

            const token = localStorage.getItem("token");
            if (isTokenExpired(token)) {
                handleLogout();
                return Promise.reject("Token expired");
            }

            console.log(JSON.stringify({ "map": updateConfigs }))

            try {
                const response = await fetch(`${API_URL}/api/configs/platform`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({"map": updateConfigs}),
                });

                if (!response.ok) {
                    throw new Error("Failed to update configs");
                }
            } catch (error) {
                console.error("Error during config update:", error);
            }

            window.location.reload();
        }
    }

    async function fetchConfigs() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/configs/platform`, {
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
            setPossibleConfigs(data.map.map(o => o.key));
            setCurrentConfigs(data.map);
        } catch (error) {
            console.error("Error fetching configs:", error);
        }
    }

    useEffect(() => {
        fetchConfigs();
    }, [API_URL]);

    // Footer component
    const Footer = () => (
        <footer className="text-center text-sm text-gray-500 py-4">
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
            <div style={style} title={text}>
                {text}
            </div>
        );
    };

    return (
        <main className="bg-gray-100 flex flex-col min-h-screen">
            <nav className="text-white p-3 w-full fixed top-0 left-0 z-50" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo Section */}
                    <a href="https://septon-project.eu/" target="_blank" rel="noopener noreferrer">
                        <img src="/images/septon_logo.png" alt="Logo" className="px-5 h-16" />
                    </a>

                    {/* Right Section - Researcher Dashboard and Logout Button */}
                    <div className="flex items-center">
                        <button
                            onClick={handleAddResearcher}
                            className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded mr-5"
                        >
                            Researcher dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="flex flex-1 items-center justify-center mt-24 mb-16">
                <div className="bg-white shadow-2xl rounded-xl p-8 flex flex-col lg:flex-row h-[70vh] w-3/4 space-y-8 lg:space-y-0 lg:space-x-8 overflow-hidden">
                    <div className="flex flex-col w-full lg:w-1/2 h-full">
                        <h2 className="text-teal-600 text-4xl font-bold pb-4 select-none text-center">
                            Current Configs
                        </h2>
                        <div className="flex flex-col bg-gray-50 h-full w-full overflow-hidden shadow-inner rounded-lg p-4">
                            <div className="overflow-auto h-full hover:overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                                {currentConfigs.map((o, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col py-2 px-3 mb-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
                                    >
                                        <div className="text-sm font-bold text-gray-500">Key:</div>
                                        <div className="text-lg text-gray-900 mb-1 truncate">
                                            <EllipsisBox text={o.key} />
                                        </div>
                                        <div className="text-sm font-semibold text-gray-500">Value:</div>
                                        <div className="text-lg text-gray-900 truncate">
                                            <EllipsisBox text={o.value} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 h-full">
                        <h1 className="text-teal-600 text-4xl font-bold pb-4 select-none text-center">
                            Modify Config
                        </h1>
                        <form
                            onSubmit={handleUpdateConfig}
                            className="flex flex-col items-center justify-center w-full"
                        >
                            <div className="relative text-left mb-6 w-full max-w-lg">
                                <label htmlFor="config-select" className="block text-sm font-medium text-gray-700 mb-2">Select Property:</label>
                                <select
                                    id="config-select"
                                    value={newConfigKey}
                                    onChange={(e) => {
                                        setNewConfigKey(e.target.value);
                                        const selectedConfig = currentConfigs.find(c => c.key === e.target.value);
                                        setPlaceholder(selectedConfig ? selectedConfig.value : "value");
                                        setNewConfigValue(""); // Clear the input field when a new property is selected
                                    }}
                                    className="bg-gray-100 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                    <option disabled>Select a property</option>
                                    {possibleConfigs.map((conf, index) => (
                                        <option key={index} value={conf}>
                                            {conf}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full max-w-lg mb-6">
                                <label htmlFor="config-value" className="block text-sm font-medium text-gray-700 mb-2">Value:</label>
                                <input
                                    type="text"
                                    id="config-value"
                                    value={newConfigValue}
                                    placeholder={placeholder}
                                    onChange={(e) => setNewConfigValue(e.target.value)}
                                    className="bg-gray-100 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                />
                            </div>
                            <div className="relative w-full max-w-lg mt-6 mb-6">
                                <h2 className="text-teal-600 text-2xl font-semibold pb-2">Current Updates</h2>
                                <div className="bg-gray-100 h-32 overflow-y-auto shadow-inner rounded-lg p-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                                    {
                                        updateConfigs.map((o, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col py-1 px-2 mb-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
                                            >
                                                <div className="text-sm font-bold text-gray-500">Key:</div>
                                                <div className="text-sm text-gray-900 mb-1 truncate">
                                                    <EllipsisBox text={o.key} />
                                                </div>
                                                <div className="text-sm font-semibold text-gray-500">Value:</div>
                                                <div className="text-sm text-gray-900 truncate">
                                                    <EllipsisBox text={o.value} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="w-full max-w-lg mb-6">
                                <button
                                    onClick={addConfig}
                                    className="bg-teal-600 text-gray-100 rounded-lg w-full py-2 select-none hover:bg-teal-700 duration-300 mb-4"
                                >
                                    Add
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-600 text-gray-100 rounded-lg w-full py-2 select-none hover:bg-teal-700 duration-300"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
