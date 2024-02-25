"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const router = useRouter();
    const [people, setPeople] = useState([
        { id: 1, name: "John Doe", affiliation: "Affiliation A" },
        { id: 2, name: "Jane Doe", affiliation: "Affiliation B" },
        { id: 3, name: "Jim Doe", affiliation: "Affiliation C" },
        { id: 4, name: "Jill Doe", affiliation: "Affiliation D" },
        { id: 5, name: "Jack Doe", affiliation: "Affiliation E" },
        { id: 6, name: "Julie Doe", affiliation: "Affiliation F" },
        { id: 7, name: "Julie Doe", affiliation: "Affiliation G" },
        { id: 8, name: "Julie Doe", affiliation: "Affiliation H" },
        { id: 9, name: "Julie Doe", affiliation: "Affiliation I" },

        // Add more people as needed
    ]);

    function handleAddResearcher() {
        router.push("/dashboard");
    }

    function handleRemoveResearcher(id) {
        const updatedPeople = people.filter((person) => person.id !== id);
        setPeople(updatedPeople);
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
                            {people.map((person) => (
                                <div
                                    key={person.id}
                                    className="px-8 py-2 hover:bg-gray-200 bg-gray-100 flex  items-center justify-between border-b border-gray-400 border-solid last:border-b-0"
                                >
                                    <div>
                                        <p className="text-lg">{person.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {person.affiliation}
                                        </p>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faPencil}
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ml-4 hover:scale-110"
                                        />
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                handleRemoveResearcher(
                                                    person.id
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
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="First Name"
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Affiliation"
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
        </main>
    );
}
