import { useState } from 'react'; 

export default function SignUpForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        password: '', 
        confirm: ''
    });
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        if (formData.password !== formData.confirm) {
            setErrors({ confirm: 'Passwords do not match' });
            return;
        }
        try {
            const { confirm, ...submitData } = formData;
            await onSubmit(submitData);
        } catch (err) {
            if (err.field) {
                // Handle field-specific errors (e.g., duplicate email)
                setErrors({ [err.field]: err.error });
              } else {
                // Handle general errors
                setErrors({ form: err.error || 'Sign up failed - Please try again' });
            }
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
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
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
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
                        errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
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
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.confirm}
                    onChange={handleChange}
                />
                {errors.confirm && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>
                )}
            </div>

            {errors.form && (
                <p className="text-red-600 text-sm text-center">{errors.form}</p>
            )}

            <div>
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${!formData.username || !formData.email || !formData.password || formData.password !== formData.confirm
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    disabled={!formData.username || !formData.email || !formData.password || formData.password !== formData.confirm}
                >
                Sign Up
                </button>
            </div>
        </form>
    );
}