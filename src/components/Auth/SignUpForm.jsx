import { useState } from 'react'; 

export default function SignUpForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        password: '', 
        confirm: ''
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (formData.password !== formData.confirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Sign up Failed - Try Again With a Unique Username and Email');
        }
    }

    const isDisabled = !formData.username || !formData.email || !formData.password || formData.password !== formData.confirm;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
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
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.confirm}
                    onChange={handleChange}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${isDisabled 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    disabled={isDisabled}
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
}