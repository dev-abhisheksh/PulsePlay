import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/login", { username, password },
                { withCredentials: true }
            );
            navigate("/")
        } catch (error) {
            console.log("Erroe", error)
        }
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" required />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login