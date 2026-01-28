import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">JobLink Pro</Link>
            <div className="space-x-4">
                <Link to="/jobs">Jobs</Link>
                <Link to="/career-advice">Career Advice</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
