import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import API from "../../api"; // Assuming you have an API instance configured

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirmPassword
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); // State for showing new password
    const { token } = useParams(); // Extract token from URL
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await API.post("/auth/verify-reset-token", { token });
                setIsTokenValid(true);
            } catch (err) {
                if (err.response?.status === 400) { // assuming 400 is returned for expired tokens
                    setError("Your token has expired. Please request a new password reset.");
                } else {
                    setError("Invalid or expired token.");
                }
                setIsTokenValid(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        // Validate new password and confirm password
        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields.");
            setLoading(false);
            return;
        }
        // Password validation
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await API.post("/auth/reset-password", { token, newPassword });
            setSuccess("Your password has been reset successfully.");
            setTimeout(() => navigate("/auth/login-user"), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {isTokenValid ? (
                <form
                    onSubmit={handleResetPassword}
                    className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
                >
                    <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
    
                    {/* Error and success messages */}
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    {success && <p className="text-green-500 mb-2">{success}</p>}
    
                    {/* New Password input */}
                    <div className="mb-4 relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border mb-4 rounded-lg"
                            required
                            aria-label="New Password"
                        />
                        <div
                            className="absolute top-3 right-3 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </div>
                    </div>
    
                    {/* Confirm Password input */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border mb-4 rounded-lg"
                            required
                        />
                    </div>
    
                    {/* Reset Password button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            ) : (
                <p className="text-red-500 text-center">Your reset link is invalid or expired. Please request a new password reset.</p>
            )}
        </div>
    );
    
};

export default ResetPasswordPage;
