import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import { Link } from 'react-router-dom';
import { PasswordInput } from './PasswordInput';

export function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validCredentials, setValidCredentials] = useState(true);

    const navigate = useNavigate();

    const submitLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            setValidCredentials(data.success);

            if (data.success) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);

                navigate("/home");
            }

        } catch (error) {
            console.error("Connection error", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form className="text-center px-5 pt-5 pb-4 bg-body-tertiary rounded shadow-sm" onSubmit={submitLogin} noValidate >
                <h1 className="text-body-secondary fw-bold mb-5">
                    Login to
                    <span className="text-primary"> Flujex</span>    
                </h1>

                <div className="form-floating mb-3">
                    <input  type="text"
                            className={`form-control ${!validCredentials ? 'is-invalid' : ''}`}
                            id="inputUsername"
                            placeholder="Username"
                            required
                            onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="inputUsername">Username</label>
					<div className="invalid-feedback">
						Invalid username or password
					</div>
                </div>

                <PasswordInput placeholder={"Password"} onPasswordChange={(pwd) => setPassword(pwd)} validCredentials={validCredentials} ></PasswordInput>

                <p className="text-start mb-4"><a href="" className="text-muted small text-decoration-none">Forgot your password?</a></p>

                <input type="submit" className="btn btn-primary fw-medium w-100 mb-3" value="Login" />

                <p className="small">Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );

}