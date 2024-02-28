"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
//import checkTokenExpiry from "../auth"
//import useAuth from "../auth"


export default function Dashboard() {
    //useAuth();
    //checkTokenExpiry();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [affiliation, setAffiliation] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL === undefined ? "http://localhost:8088" : process.env.NEXT_PUBLIC_API_URL;

    async function handleAddResearcher() {
        //checkTokenExpiry()
        const token = localStorage.getItem('token'); 

        const researcherDetails = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            affiliation: affiliation
        };


        try {
            const response = await fetch(`${API_URL}/api/users/register`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(researcherDetails)
            });

            console.log(response)
    
            if (!response.ok) {
                throw new Error('Failed to register new user');
            }
    
        } catch (error) {
            console.error('Error during user registration:', error);
        }
        setAffiliation();
        setEmail();
        setFirstName();
        setLastName();
        fetchResearchers();
    }

    async function handleRemoveResearcher(userId) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/users/delete?user_id=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete researcher');
            }
    
            fetchResearchers();
        } catch (error) {
            console.error('Error during user deletion:', error);
        }
    }

    const [researchers, setResearchers] = useState([]);

    async function fetchResearchers() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/users/researchers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch researchers');
            }

            const data = await response.json();
            setResearchers(data); 
        } catch (error) {
            console.error('Error fetching researchers:', error);
        }
    }
    
    useEffect(() => {
        fetchResearchers();
    }, []);


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
                                        <p className="text-lg">{researcher.first_name} {researcher.last_name}</p>
                                        <p className="text-sm text-gray-600">
                                            {researcher.affiliation}
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
        </main>
    );
}
