import { jwtDecode } from "jwt-decode";

// Footer component
export const Footer = () => (
    <footer className="text-center text-sm text-gray-500 py-4 absolute bottom-0 w-full">
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
