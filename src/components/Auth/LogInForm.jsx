import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import * as usersServices from '../../utilities/users-service';

export default function LogInForm({setUser}) {
    const [credentials, setCredentials] = useState({
        email: '', 
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate()

    function handleChange(e) {
        setCredentials({...credentials, [e.target.name]: e.target.value});
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const user = await usersServices.login(credentials);
            setUser(user);
            navigate('/')
        } catch {
            setError('Login Failed - Try Again');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-xs">
                <form autoComplete="off" onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" name="email" value={credentials.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            LOG IN
                        </button>
                    </div>
                </form>
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
}
