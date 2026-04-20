import { Link } from 'react-router-dom';
import { PasswordInput } from './PasswordInput';

export function Login() {

    return (
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <form class="text-center px-5 pt-5 pb-4 bg-body-tertiary rounded shadow-sm">
                <h1 class="text-body-secondary fw-bold mb-5">
                    Login to
                    <span class="text-primary"> Flujex</span>    
                </h1>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="inputUsername" placeholder="Username" />
                    <label for="inputUsername">Username</label>
                </div>

                <PasswordInput></PasswordInput>

                <p class="text-start mb-4"><a href="" class="text-muted small text-decoration-none">Forgot your password?</a></p>

                <input type="submit" class="btn btn-primary fw-medium w-100 mb-3" value="Login" />

                <p class="small">Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );

}