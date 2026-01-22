import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ isRecoveryMode, setIsRecoveryMode ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsRecoveryMode(true);
            }
        });
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password updated successfully!");
            navigate("/login");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Please enter your new password below.
                </p>

                {isRecoveryMode ? (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors 
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? "Updating..." : "Set New Password"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="text-red-500 font-medium">⚠️ Invalid or expired reset link.</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}