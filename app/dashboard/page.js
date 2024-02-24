"use client";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function Dashboard() {
    const router = useRouter();
    const [people, setPeople] = useState([
        { id: 1, name: 'John Doe', affiliation: 'Affiliation A' },
        { id: 2, name: 'Jane Doe', affiliation: 'Affiliation B' },
        { id: 3, name: 'Jim Doe', affiliation: 'Affiliation C' },
        { id: 4, name: 'Jill Doe', affiliation: 'Affiliation D' },
        { id: 5, name: 'Jack Doe', affiliation: 'Affiliation E' },
        { id: 6, name: 'Julie Doe', affiliation: 'Affiliation F' },
        { id: 7, name: 'Julie Doe', affiliation: 'Affiliation G' },
        { id: 8, name: 'Julie Doe', affiliation: 'Affiliation H' },
        { id: 9, name: 'Julie Doe', affiliation: 'Affiliation I' },

        // Add more people as needed
    ]);

    function handleAddResearcher() {
        router.push("/dashboard");
    }

    function handleRemoveResearcher(id) {
        const updatedPeople = people.filter(person => person.id !== id);
        setPeople(updatedPeople);
    }

    return (
        <main className="flex min-h-screen justify-center items-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 flex" style={{ width: '70%', height: '80%' }}>
                <div style={{ width: '50%', maxHeight: '500px'}} className="flex flex-col  items-center justify-center">
                    <h2 className="text-blue-500 text-4xl font-bold pb-4 select-none">Researchers List</h2>
                    <div style={{ height: '60%', width: '70%',  overflowY: 'scroll', marginRight: '2%' }} className="flex flex-col  items-center justify-center">
                    {people.map(person => (
                        <div key={person.id} className="p-2 hover:bg-gray-200 flex justify-between">
                            <div>
                                <p className="text-lg">{person.name}</p>
                                <p className="text-sm text-gray-600">{person.affiliation}</p>
                            </div>
                            <button onClick={() => handleRemoveResearcher(person.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-4">
                                Remove
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
                <div style={{ width: '50%', maxHeight: '600px' }} className="flex flex-col  items-center justify-center">
                    <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                        HealthBlocks
                    </h1>
                    <input
                        type="text"
                        placeholder="Email Address"
                        className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-2"
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
                        Add Researcher
                    </button>
                </div>
            </div>
        </main>
    );
}
