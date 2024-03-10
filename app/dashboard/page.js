"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

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
    const [researchers, setResearchers] = useState([]);

    // Function to open the edit modal for a researcher
    const handleEditResearcher = (researcher) => {
        setCurrentResearcher(researcher);
        setIsEditModalOpen(true);
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

    // useEffect hook to fetch the list of researchers when the component mounts
    useEffect(() => {
        fetchResearchers();
    }, []);

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
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

    // Function to handle redirection to the Change Password page
    const handleChangePasswordClick = () => {
        router.push('/changepassword');
    };

    return (
        <main>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
                <div className="absolute top-4 right-8">
                    <button
                        onClick={handleLogout}
                        className="text-blue-500 border border-blue-500 border-2 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white shadow-lg flex h-4/5 w-3/4 p-4">
                    <div className="bg-white flex flex-col items-center justify-center w-1/2 h-[500px]">
                        <h2 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                            Researchers List
                        </h2>
                        <div className="bg-white flex flex-col h-3/5 w-3/4 overflow-y-scroll shadow-lg rounded-lg">
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
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ml-4 hover:scale-110"
                                        />
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                handleRemoveResearcher(
                                                    researcher.user_id
                                                )
                                            }
                                            icon={faTrashCan}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 ml-4 hover:scale-110"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white flex flex-col  items-center justify-center w-1/2 border-l-2 border-gray-200 h-[500px]">
                        <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                            Add a researcher
                        </h1>
                        <form
                            onSubmit={handleAddResearcher}
                            className="flex flex-col items-center justify-center w-full"
                        >
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
                                    } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} />
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
                                    } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`}
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
                                    } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} />
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
                                    } p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4`} />
                            {errorMessage && (
                                <div className="text-red-500 mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
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
                    fetchResearchers();
                }}
            />
        </main>
    );
}