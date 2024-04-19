"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Count researcher page
export default function ResearcherCount() {
    const router = useRouter();

    const [deviceType, setDeviceType] = useState('');
    const [specification, setSpecification] = useState('');
    const [availableSpecifications, setAvailableSpecifications] = useState([]);
    const [hospital, setHospital] = useState('');
    const [medicalSpeciality, setMedicalSpeciality] = useState('');
    const [manufacturerName, setManufacturerName] = useState('');
    const [operatingSystemVersion, setOperatingSystemVersion] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [versionCount, setVersionCount] = useState(0);

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

    // Function to check if the token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        return decoded.exp < currentTime;
    };

    // Device types
    const deviceTypes = ["Wearable Device", "Portable Device", "Both"];

    // Specifications for each device type
    const portableDeviceSpecs = [
        "medical_speciality", "manufacturer_name", "operating_system"
    ];
    const wearableDeviceSpecs = [
        "medical_speciality", "manufacturer_name", "operating_system"
    ];
    const commonSpecs = [
        "medical_speciality", "manufacturer_name", "operating_system"
    ];

    // Hospital specifications
    const hospitalSpecs = [
        "Medivale", "HealPoint", "LifeCare", "All Hospitals",
    ];

    // Medical speciality and manufacturer name options
    const medicalSpecialityOptions = [
        "Cardiology", "Neurology", "Oncology", "Other", "All Specialities"
    ];
    const manufacturerNameOptions = [
        "MediTech", "HealthCorp", "LifeInstruments", "GlobalMed", "All Manufacturers"
    ];

    // Set available specifications based on the selected device type
    useEffect(() => {
        switch (deviceType) {
            case "Wearable Device":
                setAvailableSpecifications(wearableDeviceSpecs);
                break;
            case "Portable Device":
                setAvailableSpecifications(portableDeviceSpecs);
                break;
            case "Both":
                setAvailableSpecifications(commonSpecs);
                break;
            default:
                setAvailableSpecifications([]);
        }
        // updsate the state of the version count
    }, [deviceType]);

    // Function to execute the query
    async function executeQuery(event) {
        event.preventDefault();
        setErrorMessage("");

        // Check for empty fields
        if (!deviceType || !specification || !hospital || !startDate || !endDate ||
            (specification === "medical_speciality" && !medicalSpeciality) ||
            (specification === "manufacturer_name" && !manufacturerName) ||
            (specification === "operating_system" && !operatingSystemVersion)) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        let selectedHospitals = hospital === "All Hospitals" ? hospitalSpecs.slice(0, -1) : [hospital];
        selectedHospitals = selectedHospitals.map(hosp => hosp.toUpperCase().replace(/ /g, ''));

        // Prepare filters based on the selected specification
        let filters = [];
        if (specification === "medical_speciality" && medicalSpeciality !== "All Specialities") {
            filters.push({ field: "medical_speciality", value: medicalSpeciality.toUpperCase().replace(' ', '_') });
        }
        if (specification === "manufacturer_name" && manufacturerName !== "All Manufacturers") {
            filters.push({ field: "manufacturer_name", value: manufacturerName.toUpperCase().replace(' ', '_') });
        }
        if (specification === "operating_system" && operatingSystemVersion) {
            const versionPattern = /^v\d+\.\d+\.\d+$/;
        if (!versionPattern.test(operatingSystemVersion)) {
            setErrorMessage("Version format should be v{number}.{number}.{number}");
            return;
        }
            filters.push({ field: "operating_system_version", value: operatingSystemVersion.toUpperCase().replace(' ', '_') });
        }

        // Prepare the payload for the query
        const payload = {
            query_type: "COUNT",
            device_type: deviceType === "Both" ? undefined : deviceType.toUpperCase().replace(' ', '_'),
            hospital_list: {
                hospitals: selectedHospitals,
            },
            start_time: startDate + ":00Z",
            stop_time: endDate + ":00Z",
            filter_list: {
                filters: filters
            }
        };

        const token = localStorage.getItem("token");

        // Check if the token is expired
        if (isTokenExpired(token)) {
            handleLogout();
            return Promise.reject("Token expired");
        }

        // Execute the query
        try {
            const response = await fetch(`${API_URL}/api/queries`, { // Make sure to use the correct endpoint
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
            if (!data.queryResult) {
                throw new Error("Query result not found");
            } else {
                setVersionCount(data.queryResult);
            }

            console.log(data);
        } catch (error) {
            console.error("Error while executing the query:", error);
            setErrorMessage("An error occurred");
        }
    }

    // Function to handle redirection to the other calculation pages
    const handleCalculationChange = (path) => {
        setErrorMessage("");
        router.push(path);
    };

    // Footer component
    const Footer = () => (
        <footer className="text-center text-sm text-gray-500 py-2 absolute bottom-0 w-full">
            © {new Date().getFullYear()} Septon. All rights reserved.
        </footer>
    );

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
                            className="py-2 px-6 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researcheraverage')}
                        >Average</button>
                        <button
                            className="py-2 px-8 bg-teal-600 border border-teal-600 border-2 text-white rounded font-bold"
                        >Count</button>
                        <button
                            className="py-2 px-6 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researcherhistogram')}
                        >Count All</button>
                    </div>
                </div>
                <div
                    className="bg-white shadow-lg flex w-full max-w-6xl mx-4 my-8 p-8 space-x-8 min-h-full h-300 "
                    style={{ minHeight: '510px', marginTop: '150px' }}
                >
                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-teal-600 text-3xl font-bold">
                            Query Selection
                        </h1>
                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={deviceType}
                            onChange={(e) => {
                                setDeviceType(e.target.value),
                                    setErrorMessage("");
                            }}
                        >
                            <option value="">Select Device Type</option>
                            {deviceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={specification}
                            onChange={e => {
                                setSpecification(e.target.value),
                                    setErrorMessage("");
                            }}
                        >
                            <option value="">Select Specification</option>
                            {availableSpecifications.map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option> // Replace underscores with spaces for readability
                            ))}
                        </select>
                        {specification === "medical_speciality" && (
                            <select
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                value={medicalSpeciality}
                                onChange={(e) => {
                                    setMedicalSpeciality(e.target.value),
                                        setErrorMessage("");
                                }}
                            >
                                <option value="">Select Medical Speciality</option>
                                {medicalSpecialityOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        )}

                        {specification === "manufacturer_name" && (
                            <select
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                value={manufacturerName}
                                onChange={(e) => {
                                    setManufacturerName(e.target.value),
                                        setErrorMessage("");
                                }}
                            >
                                <option value="">Select Manufacturer Name</option>
                                {manufacturerNameOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        )}

                        {specification === "operating_system" && (
                            <input
                                type="text"
                                placeholder="Operating System Version (e.g v0.0.1)"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                value={operatingSystemVersion}
                                onChange={(e) => {
                                    setOperatingSystemVersion(e.target.value)
                                    setErrorMessage("");
                                }}
                            />
                        )}
                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={hospital}
                            onChange={(e) => {
                                setHospital(e.target.value),
                                    setErrorMessage("");
                            }}
                        >
                            <option value="">Select Hospital</option>
                            {hospitalSpecs.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
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
                                    onChange={(e) => {
                                        setStartDate(e.target.value),
                                            setErrorMessage("");
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
                                    onChange={(e) => {
                                        setEndDate(e.target.value),
                                            setErrorMessage("");
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-red-500">
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
                            Count Results
                        </h1>
                        <div className="w-full p-4 border border-gray-300 rounded">
                            <h2 className="text-gray-600 text-xl font-bold">
                                Total Count: {versionCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
