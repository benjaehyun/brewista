import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import {signUp} from '../../utilities/users-service'

export default function SignUpForm ({setUser}) {
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        confirm: ''
    })
    const [error, setError] = useState('')

    const navigate = useNavigate()

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value})
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            delete formData.confirm
            const user = await signUp(formData)
            setUser(user)
            navigate('/')
        } catch {
            setError('Sign up Failed - Try Again')
        }
    }

    const disable = (formData.password !== formData.confirm);

    return (
        <div>
            <div className="form-container">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    <label>Email</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <label>Confirm</label>
                    <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} required />
                    <button variant='primary' type="submit" disabled={disable}>SIGN UP</button>
                </form>
            </div>
            <p className="error-message">&nbsp;{error}</p>
        </div>
    )
}
