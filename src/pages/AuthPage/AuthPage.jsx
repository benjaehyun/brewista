import React, { useState } from 'react';
import LogInForm from "../../components/Auth/LogInForm";
import SignUpForm from "../../components/Auth/SignUpForm";

export default function AuthPage({ setUser }) {
    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => setShowLogin(!showLogin);

    return (
        <div className="flex flex-col justify-center items-center px-4 py-4 md:py-8">
            <h1 className="text-2xl font-bold text-center mb-4 md:mb-6">Join Our Community</h1>
            {showLogin ? (
                <>
                    <LogInForm setUser={setUser} />
                    <p className="mt-4 text-center">
                        Don't have an account? <button onClick={toggleForm} className="text-blue-500 underline">Sign up here</button>
                    </p>
                </>
            ) : (
                <>
                    <SignUpForm setUser={setUser} />
                    <p className="mt-4 text-center">
                        Already have an account? <button onClick={toggleForm} className="text-blue-500 underline">Log in here</button>
                    </p>
                </>
            )}
        </div>
    );
}
