"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";


/**
 * ADMIN DASHBOARD: Allows the admin to view, add, edit, and delete researchers
 */
export default function Dashboard() {
    const router = useRouter();

    // State management
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentResearcher, setCurrentResearcher] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedResearcherId, setSelectedResearcherId] = useState(null);
    const [encryptionScheme, setEncryptionScheme] = useState("PHE");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [researchers, setResearchers] = useState([]);

    // Function to open the edit modal for a researcher
    const handleEditResearcher = (researcher) => {
        setCurrentResearcher(researcher);
        setIsEditModalOpen(true);
    };

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

    // Function to handle logout
    const handleConfigurePlatform = () => {
        router.push('/platformconfig');
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        return decoded.exp < currentTime;
    };

    // Regular expression pattern for email validation
    const regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" +
        "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

    // Function to add a researcher
    async function handleAddResearcher(event) {
        event.preventDefault();
        setErrorMessage("");

        // Validate email address
        if (!new RegExp(regexPattern).test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Validate all fields are filled
        if (!email.trim() || !firstName.trim() || !lastName.trim() || !affiliation.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        // Get token from local storage
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            handleLogout(); // Implement this function to clear the token and redirect
            return Promise.reject("Token expired");
        }

        // Create a new researcher object
        const researcherDetails = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            affiliation: affiliation,
        };

        // Send a POST request to the server to add the new researcher
        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(researcherDetails),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to register new user");
            }
        } catch (error) {
            console.error("Error during user registration:", error);
        }

        // Clear the form fields and fetch the updated list of researchers
        setAffiliation("");
        setEmail("");
        setFirstName("");
        setLastName("");
        fetchResearchers("");
    }

    // Function to delete a researcher
    async function handleRemoveResearcher(userId) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `${API_URL}/api/users/delete?user_id=${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete researcher");
            }

            fetchResearchers();
        } catch (error) {
            console.error("Error during user deletion:", error);
        }
    }

    async function handleDownloadQueryHistory() {
        const token = localStorage.getItem("token");
        try {
            // const response = await fetch(`${API_URL}/api/queries`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            // });

            // if (!response.ok) {
            //     throw new Error("Failed to fetch queries");
            // }

            const json = await response.json();
            const blob = new Blob([json], { type: 'application/json' }); // Create a blob from the JSON string
            const url = URL.createObjectURL(blob); // Create a URL for the blob
            const link = document.createElement('a'); // Create an anchor element
            link.href = url;
            link.download = `export.json`; // Set the file name for the download
            document.body.appendChild(link);
            link.click(); // Programmatically click the anchor to trigger the download
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error fetching researchers:", error);
        }
    }

    // Function to fetch all researchers
    async function fetchResearchers() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/users/researchers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch researchers");
            }

            const data = await response.json();
            setResearchers(data);
        } catch (error) {
            console.error("Error fetching researchers:", error);
        }
    }

    useEffect(() => {
        // Initial fetch of researchers
        fetchResearchers();

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

    // Delete Confirmation Modal
    function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this researcher?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                        <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </div>
                </div>
            </div>
        );
    }

    // Function to handle delete click
    const handleDeleteClick = (researcherId) => {
        setSelectedResearcherId(researcherId);
        setIsDeleteModalOpen(true);
    };

    // function to edit a researcher
    function EditResearcherModal({ isOpen, onClose, researcher, onSave }) {
        const [email, setEmail] = useState(researcher?.email || "");
        const [firstName, setFirstName] = useState(
            researcher?.first_name || ""
        );
        const [lastName, setLastName] = useState(researcher?.last_name || "");
        const [affiliation, setAffiliation] = useState(
            researcher?.affiliation || ""
        );

        // Function to save the updated researcher details
        const handleSaveReasearcher = () => {
            const updatedResearcher = {
                ...researcher, // Spread the existing researcher details to maintain any other properties
                email,
                first_name: firstName,
                last_name: lastName,
                affiliation: affiliation,
            };
            console.log(updatedResearcher);

            onSave(updatedResearcher);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                    <h2 className="text-xl font-semibold mb-4">
                        Edit Researcher
                    </h2>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value),
                                setErrorMessage("");
                        }}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value),
                                setErrorMessage("");
                        }}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Affiliation"
                        value={affiliation}
                        onChange={(e) => {
                            setAffiliation(e.target.value),
                                setErrorMessage("");
                        }}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-4"
                    />
                    {errorMessage && (
                        <div className="text-red-500 mb-4">{errorMessage}</div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveReasearcher}
                            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Function to update a researcher
    async function updateResearcher(researcher) {
        const token = localStorage.getItem("token");
        const userId = researcher.user_id; // Assuming 'user_id' is a property of the 'researcher' object

        try {
            const response = await fetch(`${API_URL}/api/users/update?user_id=${userId}`, { // Update the URL to include the user ID as a query parameter
                method: "PUT", // Use "PUT" as specified in your backend documentation
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: researcher.first_name,
                    last_name: researcher.last_name,
                    affiliation: researcher.affiliation,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update researcher");
            }
        } catch (error) {
            console.error("Error during researcher update:", error);
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
                                onClick={handleDownloadQueryHistory}
                                className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                            >
                                Download query history
                            </button>
                        </div>

                        <div className="relative inline-block text-left mr-5"> {/* Added margin-right for spacing */}
                            <button
                                onClick={handleConfigurePlatform}
                                className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                            >
                                Configure Platform
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
                            Researchers List
                        </h2>
                        <div className="flex flex-col bg-white h-3/5 w-3/4 overflow-y-scroll shadow-lg rounded-lg">
                            {researchers.map((researcher) => (
                                <div
                                    key={researcher.id}
                                    className="px-8 py-2 hover:bg-gray-200 bg-gray-100 flex  items-center justify-between border-b border-gray-400 border-solid last:border-b-0"
                                >
                                    <div>
                                        <p className="text-lg">
                                            {researcher.first_name}{" "}
                                            {researcher.last_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {researcher.affiliation}
                                        </p>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faPencil}
                                            onClick={() =>
                                                handleEditResearcher(researcher)
                                            }
                                            className="bg-teal-600 text-white p-2 rounded hover:bg-teal-700 ml-4 hover:scale-110"
                                        />
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                handleDeleteClick(researcher.user_id)
                                            }
                                            icon={faTrashCan}

                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 ml-4 hover:scale-110"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className=" flex flex-col  items-center justify-center w-1/2 border-l-2 border-gray-200 h-[500px]">
                        <h1 className="text-teal-600 text-4xl font-bold pb-4 select-none">
                            Add a researcher
                        </h1>
                        <form
                            onSubmit={handleAddResearcher}
                            className="flex flex-col items-center justify-center w-full"
                        >
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value),
                                        setErrorMessage("");
                                }}
                                className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    } p-2 w-full max-w-[30ch] rounded-lg mb-4`}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value),
                                        setErrorMessage("");
                                }}
                                className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    } p-2 w-full max-w-[30ch] rounded-lg mb-4`} />
                            <input
                                type="text"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value),
                                        setErrorMessage("");
                                }}
                                className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    } p-2 w-full max-w-[30ch] rounded-lg mb-4`} />
                            <input
                                type="text"
                                placeholder="Affiliation"
                                value={affiliation}
                                onChange={(e) => {
                                    setAffiliation(e.target.value),
                                        setErrorMessage("");
                                }}
                                className={`outline-none duration-300 border-solid border-2 ${errorMessage
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    } p-2 w-full max-w-[30ch] rounded-lg mb-4`} />
                            {errorMessage && (
                                <div className="text-red-500 mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <EditResearcherModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                researcher={currentResearcher}
                onSave={async (updatedResearcher) => {
                    await updateResearcher(updatedResearcher);
                    fetchResearchers(); // Fetch updated list of researchers
                    setIsEditModalOpen(false); // Close the modal after saving
                }}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    handleRemoveResearcher(selectedResearcherId)
                    setIsDeleteModalOpen(false)
                }}
            />
            <Footer />
        </main>
    );
}