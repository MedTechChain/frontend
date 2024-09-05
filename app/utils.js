import { jwtDecode } from "jwt-decode";

// Footer component
export const Footer = () => (
    <footer className="text-center text-sm text-gray-500 py-4 bg-gray-100">
        © {new Date().getFullYear()} Septon. All rights reserved.
    </footer>
);


export const API_URL =
    process.env.NEXT_PUBLIC_API_URL === undefined
        ? "http://localhost:8088"
        : process.env.NEXT_PUBLIC_API_URL;


// Function to handle logout
export const handleLogout = () => {
    // Clear user token or session data
    localStorage.removeItem("token");

    // Redirect to login page or any other page you consider as the logout landing page
    router.push('/login');
};


// Function to check if the token is expired
export const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp < currentTime;
};

// Function to handle redirection to other calculation pages
export const handleCalculationChange = (path, setErrorMessage, router) => {
    setErrorMessage("");
    router.push(path);
};

/**
 * Adds a new filter to the list of filters.
 * @param {array} filters - The current list of filters.
 * @param {function} setFilters - The state setter function for filters.
 */
export const addFilter = (filters, setFilters) => {
    setFilters([...filters, { specification: '', inputValue: '', operator: '' }]);
};

/**
 * Updates a specific filter in the list of filters.
 * @param {array} filters - The current list of filters.
 * @param {function} setFilters - The state setter function for filters.
 * @param {number} index - The index of the filter to update.
 * @param {string} key - The key of the filter to update (e.g., 'specification', 'inputValue', 'operator').
 * @param {any} value - The new value to set for the specified key.
 */
export const updateFilter = (filters, setFilters, index, key, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index][key] = value;
    setFilters(updatedFilters);
};

/**
 * Removes a filter from the list of filters.
 * @param {array} filters - The current list of filters.
 * @param {function} setFilters - The state setter function for filters.
 * @param {number} index - The index of the filter to remove.
 */
export const removeFilter = (filters, setFilters, index) => {
    setFilters(filters.filter((_, i) => i !== index));
};