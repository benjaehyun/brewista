import { useState } from 'react'; 

export default function LogInForm({ onSubmit }) {
    const [credentials, setCredentials] = useState({
        email: '', 
        password: ''
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setCredentials({...credentials, [e.target.name]: e.target.value});
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await onSubmit(credentials);
        } catch (err) {
            setError(err.error || 'Login Failed - Try Again');
        }
    }

    const isDisabled = !credentials.email || !credentials.password;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={credentials.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={credentials.password}
                    onChange={handleChange}
                />
            </div>

            {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <div>
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${!credentials.email || !credentials.password
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    disabled={!credentials.email || !credentials.password}
                >
                    Log In
                </button>
            </div>
        </form>
    );
}