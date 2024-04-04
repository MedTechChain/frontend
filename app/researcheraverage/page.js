"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ResearcherAverage() {
    const router = useRouter();

    const [deviceType, setDeviceType] = useState('');
    const [specification, setSpecification] = useState('');
    const [hospital, setHospital] = useState('');
    const [availableSpecifications, setAvailableSpecifications] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

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

    // Device types
    const deviceTypes = ["Wearable Device", "Portable Device"];

    // Specifications for each device type
    const portableDeviceSpecs = [
        "aquired_price", // "rental_price", "usage_frequency"
    ];
    const wearableDeviceSpecs = [
        "aquired_price", // "rental_price", "data_sync_frequency"
    ];

    // Hospital specifications
    const hospitalSpecs = [
        "Medivale", "HealPoint", "LifeCare", "All Hospitals"
    ];

    const operations = ["=", "<", ">", ">=", "<="];

    // Set available specifications based on the selected device type
    useEffect(() => {
        switch (deviceType) {
            case "Wearable Device":
                setAvailableSpecifications(wearableDeviceSpecs);
                break;
            case "Portable Device":
                setAvailableSpecifications(portableDeviceSpecs);
                break;
            default:
                setAvailableSpecifications([]);
        }
    }, [deviceType]);

    // Footer component
    const Footer = () => (
        <footer className="text-center text-sm text-gray-500 py-2 absolute bottom-0 w-full">
            © {new Date().getFullYear()} Septon. All rights reserved.
        </footer>
    );

    // Function to handle redirection to the other calculation pages
    const handleCalculationChange = (path) => {
        setErrorMessage("");
        router.push(path);
    };

    // Function to execute the query
    async function executeQuery (event) {
        event.preventDefault();
        setErrorMessage("");

        if (!deviceType || !specification || !hospital || !startDate || !endDate) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        let selectedHospitals = hospital === "All Hospitals" ? hospitalSpecs.slice(0, -1) : [hospital]; 
        selectedHospitals = selectedHospitals.map(hosp => hosp.toUpperCase().replace(/ /g, '')); 

        const payload = {
            query_type: "AVERAGE",
            device_type: deviceType.toUpperCase().replace(' ', '_'),
            hospital_list: {
                hospitals: selectedHospitals.map(hospital => hospital.toUpperCase().replace(' ', '')),
            },
            start_time:  startDate + ":00Z",
            stop_time: endDate + ":00Z",
            filter_list: {
                filters: null
            },
            field: specification.replace(/ /g, '_').toLowerCase(),
            value: null,
        };

        const token = localStorage.getItem("token");

        console.log(payload);
        console.log(token);

        try {
            const response = await fetch(`${API_URL}/api/queries`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to execute query");
            }
            const data = await response.json();
            console.log(data); 
        } catch (error) {
            setErrorMessage("An error occurred");
            console.error("Error while executing the query:", error);
        }
        setDeviceType('');
        setSpecification('');
        setHospital('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <main>
            <div className="flex flex-1 min-h-screen bg-gray-100 items-center justify-center flex-col">
                <nav className=" text-white p-3 w-full fixed top-0 left-0 z-50 " style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div className="container mx-auto flex justify-between items-center">
                        <a href="https://septon-project.eu/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/septon_logo.png" alt="Logo" className="px-5 h-16 mr-10" />
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white  hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
                <div className="fixed top-[20px] left-0 w-full flex justify-center z-40">
                    <div className="justify-center space-x-6 py-4 mt-16"> 
                        <button
                            className="py-2 px-8 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researchercount')}
                        >Count</button>
                        <button
                            className="py-2 px-6 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researcherhistogram')}
                        >Count All</button>
                        <button
                            className="py-2 px-6 bg-teal-600 border border-teal-600 border-2 text-white rounded font-bold"
                        >Average</button>
                    </div>
                </div>

                <div
                    className="bg-white shadow-lg flex w-full max-w-6xl mx-4 my-8 p-8 space-x-8 min-h-full h-300"
                    style={{ minHeight: '510px', marginTop: '150px' }}
                >
                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-teal-600 text-3xl font-bold">
                            Query Selection
                        </h1>
                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={deviceType}
                            onChange={(e) => {setDeviceType(e.target.value),
                                setErrorMessage("")
                            }}
                        >
                            <option value="">Select Device Type</option>
                            {deviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>

                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={specification}
                            onChange={(e) => {setSpecification(e.target.value),
                                setErrorMessage("")
                            }}
                        >
                            <option value="">Select Specification</option>
                            {availableSpecifications.map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option> // Replace underscores with spaces for readability
                            ))}
                        </select>
                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={hospital}
                            onChange={(e) => {setHospital(e.target.value),
                                setErrorMessage("")
                            }}
                        >
                            <option value="">Select Hospital</option>
                            {hospitalSpecs.map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option> // Replace underscores with spaces for readability
                            ))}
                        </select>
                        {/* "From" and "To" date and time input containers*/}
                        <div className="flex w-full">
                            <div className="flex-1 mr-2">
                                <label htmlFor="startDateTime" className="block text-sm font-medium" style={{ color: 'rgba(13, 148, 136, 1)' }}>From</label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    value={startDate}
                                    onChange={(e) => {setStartDate(e.target.value),
                                        setErrorMessage("")
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1 ml-2">
                                <label htmlFor="endDateTime" className="block text-sm font-medium" style={{ color: 'rgba(13, 148, 136, 1)' }}>To</label>
                                <input
                                    type="datetime-local"
                                    id="endDateTime"
                                    value={endDate}
                                    onChange={(e) => {setEndDate(e.target.value),
                                        setErrorMessage("")
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-red-500 mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={executeQuery}
                            className="w-full py-3 bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                        >
                            Execute Query
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-teal-600 text-3xl font-bold">
                            Average Results
                        </h1>
                    </div>
                </div>
            </div>
            <Footer />
        </main >
    );
}
