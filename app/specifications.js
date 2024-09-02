
export const allSpecifications = [
    "HOSPITAL",
    "MANUFACTURER",
    "MODEL",
    "FIRMWARE_VERSION",
    "DEVICE_TYPE",
    "PRODUCTION_DATE",
    "LAST_SERVICE_DATE",
    "WARRANTY_EXPIRY_DATE",
    "LAST_SYNC_TIME",
    "USAGE_HOURS",
    "BATTERY_LEVEL",
    "SYNC_FREQUENCY_SECONDS",
    "ACTIVE_STATUS",
    "SPECIALITY",
];

// Device Categories
export const deviceCategories = [
    "Portable Device",
    "Wearable Device",
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

export const specificationTypeMap = {
    "HOSPITAL": "STRING",
    "MANUFACTURER": "STRING",
    "MODEL": "STRING",
    "FIRMWARE_VERSION": "STRING",
    "DEVICE_TYPE": "STRING",
    "PRODUCTION_DATE": "TIMESTAMP",
    "LAST_SERVICE_DATE": "TIMESTAMP",
    "WARRANTY_EXPIRY_DATE": "TIMESTAMP",
    "LAST_SYNC_TIME": "TIMESTAMP",
    "USAGE_HOURS": "INTEGER",
    "BATTERY_LEVEL": "INTEGER",
    "SYNC_FREQUENCY_SECONDS": "INTEGER",
    "ACTIVE_STATUS": "BOOL",
    "SPECIALITY": "MEDICAL_SPECIALITY",
    "CATEGORY": "DEVICE_CATEGORY",
};

export const renderInputField = (specification, inputValue, setInputValue) => {
    const specType = specificationTypeMap[specification];

    switch (specType) {
        case "STRING":
            return (
                <input
                    type="text"
                    placeholder="Enter text"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            );
        case "INTEGER":
            return (
                <input
                    type="number"
                    placeholder="Enter number"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
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
                <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
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

