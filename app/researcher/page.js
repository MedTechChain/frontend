"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Researcher() {
    const router = useRouter();

    const [deviceType, setDeviceType] = useState('');
    const [specification, setSpecification] = useState('');
    const [operation, setOperation] = useState('');
    const [value, setValue] = useState('');
    const [view, setView] = useState('Count'); // State to track which view is currently selected
    const [availableSpecifications, setAvailableSpecifications] = useState([]);
    const [version, setVersion] = useState("");
    const [versionCount, setVersionCount] = useState(null); // Temporarily used for the demo

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL === undefined
            ? "http://localhost:8088"
            : process.env.NEXT_PUBLIC_API_URL;


    // Device types
    const deviceTypes = ["Wearable Device", "Bedside Monitor", "Both"];

    // Specifications for each device type
    const bedsideMonitorSpecs = [
        "device_manufacturer", "software_version", "has_ecg_module", "has_resp_module", "has_spo2_module",
        "has_nibp_module", "has_temp_module", "has_2_channel_invbp_module", "has_sidestream_co2_module",
        "has_entropy_module", "has_sidestream_n2o_module", "has_neuromuscular_transmission_module",
        "has_cardiac_output_module"
    ];

    const wearableDeviceSpecs = [
        "device_serial_number", "software_version", "has_heart_rate_sensor", "has_accelerometer",
        "has_gyroscope", "has_barometric", "has_microphone", "has_magnetometer", "has_temperature_sensor", "has_gps"
    ];

    const commonSpecs = [
        "software_version"
    ];

    const operations = ["=", "<", ">", ">=", "<="];

    // Set available specifications based on the selected device type
    useEffect(() => {
        switch (deviceType) {
            case "Wearable Device":
                setAvailableSpecifications(wearableDeviceSpecs);
                break;
            case "Bedside Monitor":
                setAvailableSpecifications(bedsideMonitorSpecs);
                break;
            case "Both":
                setAvailableSpecifications(commonSpecs);
                break;
            default:
                setAvailableSpecifications([]);
        }
    }, [deviceType]);

    // Demo get version count
    async function handleGetVersion() {
        // Check if the version matches the pattern
        const versionPattern = /^v\d+\.\d+\.\d+$/;
        if (!versionPattern.test(version)) {
            alert("Version format should be v{number}.{number}.{number}");
            return;
        }

        console.log(version)
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `${API_URL}/api/queries?version=${version}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get version");
            }

            const data = await response.json();
            setVersionCount(data.count);
        } catch (error) {
            console.error("Error while getting the version:", error);
        }
    }

    // Function to render content based on selected view
    const renderContent = () => {
        if (view === 'Demo') {
            return (
                <div className="bg-white shadow-lg flex w-full max-w-6xl mx-4 my-8 p-8 space-x-8 min-h-full h-300">
                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-blue-500 text-3xl font-bold">
                            Query Selection
                        </h1>
                        <input
                            type="text"
                            placeholder="Watch Version"
                            value={version}
                            onChange={e => setVersion(e.target.value)}
                            className="outline-none border border-gray-300 p-2 w-full rounded mb-4"
                        />
                        <button
                            type="button"
                            className="w-full py-3 bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                            onClick={handleGetVersion}
                        >
                            Get Watch Version
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-blue-500 text-3xl font-bold">
                            Query Results
                        </h1>
                        {versionCount && (
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">Version Count: {versionCount}</h2>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        if (view === 'Count') {
            return (
                <div className="bg-white shadow-lg flex w-full max-w-6xl mx-4 my-8 p-8 space-x-8 min-h-full h-300">
                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-blue-500 text-3xl font-bold">
                            Query Selection
                        </h1>
                        <select className="w-full p-3 border border-gray-300 rounded" value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                            <option value="">Select Device Type</option>
                            {deviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select className="w-full p-3 border border-gray-300 rounded" value={specification} onChange={e => setSpecification(e.target.value)}>
                            <option value="">Select Specification</option>
                            {availableSpecifications.map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option> // Replace underscores with spaces for readability
                            ))}
                        </select>
                        <select className="w-full p-3 border border-gray-300 rounded" value={operation} onChange={e => setOperation(e.target.value)}>
                            <option value="">Select Operation</option>
                            {operations.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Value"
                            className="w-full p-3 border border-gray-300 rounded"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                        <button
                            type="button"
                            className="w-full py-3 bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                        >
                            Execute Query
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                        <h1 className="text-blue-500 text-3xl font-bold">
                            Query Results
                        </h1>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex w-full h-full bg-white">
                </div>
            );
        }
    };

    return (
        <main>
            <div className="flex flex-1 min-h-screen bg-gray-100 items-center justify-center flex-col">
                <div className="flex justify-center space-x-4 py-4">
                    <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setView('Count')}>Count</button>
                    <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setView('Display')}>Display</button>
                    <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setView('Average')}>Average</button>
                    <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setView('Demo')}>Demo</button>
                </div>

                {renderContent()}
            </div>
        </main>
    );
}
