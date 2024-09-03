"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Footer, API_URL, handleLogout, isTokenExpired, handleCalculationChange } from './../utils';
import { deviceCategories, allSpecifications, renderInputField } from './../specifications'; // Ensure the path is correct

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Count All researcher page
export default function ResearcherHistogram() {
    const router = useRouter();

    const [deviceType, setDeviceType] = useState('');
    const [specification, setSpecification] = useState('');
    const [availableSpecifications, setAvailableSpecifications] = useState([]);
    const [inputValue, setInputValue] = useState(''); // State for input field value
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [showHistogram, setShowHistogram] = useState(false); // State to control histogram visibility

    // State to store histogram data
    const [histogramData, setHistogramData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Dataset Label',
                data: [],
                backgroundColor: 'rgba(13, 148, 136, 0.2)',
                borderColor: 'rgba(115, 118, 110, 1)',
                borderWidth: 1,
            },
        ],
    });

    // Set available specifications based on the selected device type
    useEffect(() => {
        if (deviceType) {
            setAvailableSpecifications(allSpecifications);
        } else {
            setAvailableSpecifications([]);
        }

        // Reset histogram data when device type changes
        setShowHistogram(false); 
        setHistogramData({
            labels: [],
            datasets: [
                {
                    label: 'Dataset Label',
                    data: [],
                    backgroundColor: 'rgba(13, 148, 136, 0.2)',
                    borderColor: 'rgba(115, 118, 110, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, [deviceType]);

    async function handleExecuteQuery(event) {
        event.preventDefault();
        setErrorMessage("");

        // Check for empty fields
        if (!deviceType || !specification || !startDate || !endDate || !inputValue) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        // Payload for the query
        const payload = {
            query_type: "COUNT_ALL",
            device_data: {
                device_type: { plain: deviceType === "Both" ? undefined : deviceType.toUpperCase().replace(' ', '_') },
                filters: [{ field: specification.toLowerCase(), value: { plain: inputValue.toUpperCase().replace(/ /g, '_') } }],
            },
            timestamp: {
                start_time: { plain: startDate + ":00Z" },
                stop_time: { plain: endDate + ":00Z" },
            },
        };

        const token = localStorage.getItem("token");

        // Check if the token is expired
        if (isTokenExpired(token)) {
            handleLogout(); 
            return Promise.reject("Token expired");
        }

        // Execute the query
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
            const personalizedLabel = `Histogram for ${deviceType} - ${specification}`;

            // Update the histogram data
            setHistogramData({
                labels: Object.keys(data.result),
                datasets: [
                    {
                        label: personalizedLabel,
                        data: Object.values(data.result),
                        backgroundColor: 'rgba(13, 148, 136, 0.2)',
                        borderColor: 'rgba(115, 118, 110, 1)',
                        borderWidth: 1,
                    },
                ],
            });

            setShowHistogram(true);
        } catch (error) {
            console.error("Error while executing the query:", error);
            setErrorMessage(error.message || "An error occurred");
        }
    };

    return (
        <main>
            <div className="flex flex-1 min-h-screen bg-gray-100 items-center justify-center flex-col">
                <nav className="text-white p-3 w-full fixed top-0 left-0 z-50" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div className="container mx-auto flex justify-between items-center">
                        <a href="https://septon-project.eu/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/septon_logo.png" alt="Logo" className="px-5 h-16 mr-10" />
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-8 text-teal-600 border border-teal-600 border-2 hover:text-white hover:bg-teal-600 duration-300 font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
                <div className="fixed top-[20px] left-0 w-full flex justify-center z-40">
                    <div className="justify-center space-x-6 py-4 mt-16">
                        <button
                            className="py-2 px-6 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researcheraverage', setErrorMessage, router)}
                        >Average</button>
                        <button
                            className="py-2 px-8 border border-teal-600 border-2 text-teal-600 rounded hover:bg-teal-600 hover:text-white font-bold"
                            onClick={() => handleCalculationChange('/researchercount', setErrorMessage, router)}
                        >Count</button>
                        <button
                            className="py-2 px-6 bg-teal-600 border border-teal-600 border-2 text-white rounded font-bold"
                        >Count All</button>
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
                            onChange={(e) => {
                                setDeviceType(e.target.value.toUpperCase().replace(/ /g, '_'));
                                setErrorMessage("");
                            }}
                        >
                            <option value="">Select Device Type</option>
                            {deviceCategories.map(type => (
                                <option key={type} value={type.toUpperCase().replace(/ /g, '_')}>{type.toUpperCase().replace(/ /g, '_')}</option>
                            ))}
                        </select>

                        <select
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            value={specification}
                            onChange={e => {
                                setSpecification(e.target.value);
                                setErrorMessage("");
                            }}
                        >
                            <option value="">Select Specification</option>
                            {availableSpecifications.map(spec => (
                                <option key={spec} value={spec}>{spec.toUpperCase().replace(/ /g, '_')}</option>
                            ))}
                        </select>

                        {/* Render input field based on the selected specification */}
                        {specification && renderInputField(specification, inputValue, setInputValue)}


                        <div className="flex w-full">
                            <div className="flex-1 mr-2">
                                <label htmlFor="startDateTime" className="block text-sm font-medium" style={{ color: 'rgba(13, 148, 136, 1)' }}>From</label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
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
                                        setEndDate(e.target.value);
                                        setErrorMessage("");
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
                            onClick={handleExecuteQuery}
                            className="w-full py-3 bg-teal-600 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-teal-700 duration-300 mb-2"
                        >
                            Execute Query
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-teal-600 text-3xl font-bold">
                            Count All Results
                        </h1>
                        {showHistogram && ( // Conditionally render the histogram
                            <div style={{ width: '450px', height: '300px' }}> {/* Adjust the width and height as needed */}
                                <Bar data={histogramData} options={{ maintainAspectRatio: false }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main >
    );
}
