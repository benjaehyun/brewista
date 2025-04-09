import { useState } from 'react'; 
import { useAuth } from '../../hooks/auth-context';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpForm({ onSuccess }) {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        password: '', 
        confirm: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: '', form: '' }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirm) {
            setErrors({ confirm: 'Passwords do not match' });
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            const { confirm, ...submitData } = formData;
            await signup(submitData);
            onSuccess(); // Call the success callback
        } catch (err) {
            console.error('Signup error:', err);
            
            // Handle different error formats
            if (err.fields) {
                // Handle the fields object directly
                setErrors(err.fields);
            } else if (typeof err === 'object') {
                // Handle general error object
                setErrors({ form: err.error || err.message || 'Sign up failed - Please try again' });
            } else {
                // Handle string error
                setErrors({ form: err || 'Sign up failed - Please try again' });
            }
        } finally {
            setIsSubmitting(false);
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
                    disabled={isSubmitting}
                />
                {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className={`block w-full px-3 py-2 pr-10 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="confirm"
                        name="confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className={`block w-full px-3 py-2 pr-10 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.confirm ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.confirm}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
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
                        ${ isDisabled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    disabled={isDisabled || isSubmitting}
                >
                Sign Up
                </button>
            </div>
        </form>
    );
}