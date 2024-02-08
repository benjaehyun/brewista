import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../utilities/users-service';

export default function SignUpForm({ setUser }) {
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        confirm: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

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
            const user = await signUp(formData);
            setUser(user);
            navigate('/');
        } catch {
            setError('Sign up Failed - Try Again');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-xs">
                <form autoComplete="off" onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm">
                            Confirm Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="confirm" value={formData.confirm} onChange={handleChange} required />
                    </div>
                    <div className="flex items-center justify-center">
                        <button 
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline 
                                        ${formData.password !== formData.confirm ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit" 
                            disabled={formData.password !== formData.confirm}>
                            SIGN UP
                        </button>
                    </div>
                </form>
            </div>
            {error && <p className="text-red-500 text-xs italic text-center">{error}</p>}
        </div>
    );
}
