
export const allSpecifications = [
    "hospital",
    "manufacturer",
    "model",
    "firmware_version",
    "device_type",
    "production_date",
    "last_service_date",
    "warranty_expiry_date",
    "last_sync_time",
    "usage_hours",
    "battery_level",
    "sync_frequency_seconds",
    "active_status",
    "speciality",
];

// Device Categories
export const deviceCategories = [
    "Portable",
    "Wearable",
];

// Medical Specialities
export const medicalSpecialityOptions = [
    "Allergy and Immunology",
    "Anesthesiology",
    "Dermatology",
    "Diagnostic Radiology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Medical Genetics",
    "Neurology",
    "Nuclear Medicine",
    "Obstetrics and Gynecology",
    "Ophthalmology",
    "Pathology",
    "Pediatrics",
    "Physical Medicine and Rehabilitation",
    "Preventive Medicine",
    "Psychiatry",
    "Radiation Oncology",
    "Surgery",
    "Urology",
    "Cardiology",
    "Endocrinology",
    "Gastroenterology",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Nephrology",
    "Oncology",
    "Pulmonology",
    "Rheumatology",
    "Orthopedics",
    "Otolaryngology",
    "Plastic Surgery",
    "Vascular Surgery",
    "Thoracic Surgery",
    "Neurosurgery",
    "Podiatry",
    "Dentistry",
    "Oral and Maxillofacial Surgery",
    "Audiology",
    "Speech Language Pathology",
    "Occupational Therapy",
    "Physical Therapy",
    "Chiropractic",
    "Pain Medicine",
    "Sports Medicine",
    "Palliative Care",
    "Pharmacology",
    "Nutrition",
    "Midwifery",
    "Neonatology",
    "Critical Care",
    "Hospice and Palliative Medicine",
    "Sleep Medicine",
    "Clinical Neurophysiology",
];

// Map of specifications to types and default operators
export const specificationTypeMap = {
    "hospital": { type: "STRING", defaultOperator: "EQUALS" },
    "manufacturer": { type: "STRING", defaultOperator: "EQUALS" },
    "model": { type: "STRING", defaultOperator: "EQUALS" },
    "firmware_version": { type: "STRING", defaultOperator: "EQUALS" },
    "device_type": { type: "STRING", defaultOperator: "EQUALS" },
    "production_date": { type: "TIMESTAMP", defaultOperator: "EQUALS" },
    "last_service_date": { type: "TIMESTAMP", defaultOperator: "EQUALS" },
    "warranty_expiry_date": { type: "TIMESTAMP", defaultOperator: "EQUALS" },
    "last_sync_time": { type: "TIMESTAMP", defaultOperator: "EQUALS" },
    "usage_hours": { type: "INTEGER", defaultOperator: "EQUALS" },
    "battery_level": { type: "INTEGER", defaultOperator: "EQUALS" },
    "sync_frequency_seconds": { type: "INTEGER", defaultOperator: "EQUALS" },
    "active_status": { type: "BOOL", defaultOperator: "EQUALS" },
    "speciality": { type: "MEDICAL_SPECIALITY", defaultOperator: "EQUALS" },
    "category": { type: "DEVICE_CATEGORY", defaultOperator: "EQUALS" },
};

// Operators for different types
const stringOperators = ["EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"];
const integerOperators = ["EQUALS", "GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL", "LESS_THAN_OR_EQUAL"];
const timestampOperators = ["EQUALS", "BEFORE", "AFTER"];


// Render input fields based on specification type and include operator selection
export const renderInputField = (specification, inputValue, setInputValue, operator, setOperator) => {
    const specConfig = specificationTypeMap[specification];
    const specType = specConfig.type;

    switch (specType) {
        case "STRING":
            return (
                <>
                    <select
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent mb-2"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                    >
                        {stringOperators.map(op => (
                            <option key={op} value={op}>{op.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter text"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </>
            );
        case "INTEGER":
            return (
                <>
                    <select
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent mb-2"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                    >
                        {integerOperators.map(op => (
                            <option key={op} value={op}>{op.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Enter number"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </>
            );
        case "BOOL":
            return (
                <select
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                >
                    <option value="">Select Boolean Value</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            );
        case "TIMESTAMP":
            return (
                <>
                    <select
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent mb-2"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                    >
                        {timestampOperators.map(op => (
                            <option key={op} value={op}>{op.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </>
            );
        case "MEDICAL_SPECIALITY":
            return (
                <select
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                >
                    <option value="">Select Medical Speciality</option>
                    {medicalSpecialityOptions.map(option => (
                        <option key={option} value={option.toUpperCase().replace(/ /g, '_')}>{option.toUpperCase().replace(/ /g, '_')}</option>
                    ))}
                </select>
            );
        default:
            return null;
    }
};
