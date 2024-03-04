"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    // State management
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentResearcher, setCurrentResearcher] = useState(null);

    const handleEditResearcher = (researcher) => {
        setCurrentResearcher(researcher);
        setIsEditModalOpen(true);
    };

    // API URL from environment values or use default value
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;

    // Functions to handle user actions (add, remove, edit researchers).
    async function handleAddResearcher() {
        const token = localStorage.getItem("token");

        const researcherDetails = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            affiliation: affiliation,
        };

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
        setAffiliation("");
        setEmail("");
        setFirstName("");
        setLastName("");
        fetchResearchers("");
    }

    async function handleRemoveResearcher(userId) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `/api/users/delete?user_id=${userId}`,
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

    const [researchers, setResearchers] = useState([]);

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

    function EditResearcherModal({ isOpen, onClose, researcher, onSave }) {
        const [email, setEmail] = useState(researcher?.email || "");
        const [firstName, setFirstName] = useState(
            researcher?.first_name || ""
        );
        const [lastName, setLastName] = useState(researcher?.last_name || "");
        const [affiliation, setAffiliation] = useState(
            researcher?.affiliation || ""
        );

        const handleSaveReasearcher = () => {
            const updatedResearcher = {
                ...researcher, // Spread the existing researcher details to maintain any other properties
                email,
                first_name: firstName,
                last_name: lastName,
                affiliation,
            };

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
                        onChange={(e) => setFirstName(e.target.value)}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Affiliation"
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        className="outline-none border border-gray-300 p-2 w-full rounded mb-4"
                    />
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

    async function updateResearcher(researcher) {
        const token = localStorage.getItem("token");
        // try {
        //     const response = await fetch(`${API_URL}/api/users/update`, { // Adjust the URL as needed for your API
        //         method: "PUT", // or "PATCH" depending on your API
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`,
        //         },
        //         body: JSON.stringify(researcher),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to update researcher");
        //     }

        //     // Optionally, you can check the response from the server here
        //     // const data = await response.json();
        //     // console.log("Update response:", data);
        // } catch (error) {
        //     console.error("Error during researcher update:", error);
        // }
    }

    return (
        <main>
            <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
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
                        <input
                            type="text"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Affiliation"
                            value={affiliation}
                            onChange={(e) => setAffiliation(e.target.value)}
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <button
                            onClick={handleAddResearcher}
                            type="button"
                            className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
            {/* Place the EditResearcherModal invocation here */}
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
