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

			setValidCredentials(true);
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
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <form class="text-center px-5 pt-5 pb-4 bg-body-tertiary rounded shadow-sm" onSubmit={submitLogin} noValidate >
                <h1 class="text-body-secondary fw-bold mb-5">
                    Login to
                    <span class="text-primary"> Flujex</span>    
                </h1>

                <div class="form-floating mb-3">
                    <input  type="text"
                            class={`form-control ${!validCredentials ? 'is-invalid' : ''}`}
                            id="inputUsername"
                            placeholder="Username"
                            required
                            onChange={(e) => setUsername(e.target.value)} />
                    <label for="inputUsername">Username</label>
					<div className="invalid-feedback">
						Invalid username or password
					</div>
                </div>

                <PasswordInput onPasswordChange={(pwd) => setPassword(pwd)} validCredentials={validCredentials} ></PasswordInput>

                <p class="text-start mb-4"><a href="" class="text-muted small text-decoration-none">Forgot your password?</a></p>

                <input type="submit" class="btn btn-primary fw-medium w-100 mb-3" value="Login" />

                <p class="small">Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );

}