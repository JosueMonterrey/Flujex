import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PhoneInput } from './PhoneInput';
import { Modal } from 'react-bootstrap';

export function Register() {
	const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const backToLogin = () => {
        navigate("/login");
    };

	const [registrationError, setRegistrationError] = useState("");

	const [name, setName] = useState("");
	const [isValidName, setIsValidName] = useState(true);
	const checkNameValid = (name) => {
		const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ' ]+$/
		setName(name);
		let isValid = regex.test(name)
		setIsValidName(isValid);
		return isValid
	};

	const [lastname1, setLastname1] = useState("");
	const [isValidLastname1, setIsValidLastname1] = useState(true);
	const checkLastName1Valid = (lastname1) => {
		const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ' ]+$/
		setLastname1(lastname1);
		let isValid = regex.test(lastname1)
		setIsValidLastname1(isValid);
		return isValid
	};

	const [lastname2, setLastname2] = useState("");
	const [isValidLastname2, setIsValidLastname2] = useState(true);
	const checkLastName2Valid = (lastname2) => {
		const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ' ]+$/
		setLastname2(lastname2);
		let isValid = lastname2 === '' || regex.test(lastname2)
		setIsValidLastname2(isValid);
		return isValid
	};

	const [username, setUsername] = useState("");
	const [isValidUsername, setIsValidUsername] = useState(true);
	const checkUsernameValid = (username) => {
		const regex = /^[a-z0-9_.' ]+$/
		setUsername(username);
		let isValid = regex.test(username)
		setIsValidUsername(isValid);
		return isValid
	};

	const [email, setEmail] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(true);
	const checkEmailValid = (email) => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		setEmail(email);
		let isValid = regex.test(email)
		setIsValidEmail(isValid);
		return isValid
	};

	const [phone, setPhone] = useState("");

	const [password, setPassword] = useState("");
	const [isValidPassword, setIsValidPassword] = useState(true);
	const checkPasswordValid = (pwd) => {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
		setPassword(pwd);
		let isValid = regex.test(pwd)
		setIsValidPassword(isValid);
		return isValid
	};

    const submitRegister = async (e) => {
    	e.preventDefault();

        try {

			if (!checkNameValid(name) ||
				!checkLastName1Valid(lastname1) ||
				!checkLastName2Valid(lastname2) ||
				!checkUsernameValid(username) ||
				!checkEmailValid(email) ||
				!checkPasswordValid(password))
				return;

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
					name,
					lastname1,
					lastname2,
					username,
					email,
					phone,
					password })
            });

            const data = await response.json();

            if (data.success) {
				setRegistrationError("");
				setShowModal(true);
            }
			else {
				setRegistrationError(data['msg'])
			}

        } catch (error) {
            console.error("Connection error", error);
        }
    };

    return (
		<>
			<div className="d-flex justify-content-center align-items-center min-vh-100">
				<form className="text-center px-5 pt-5 bg-body-tertiary rounded shadow-sm" onSubmit={submitRegister} noValidate>
					<h1 className="text-body-secondary fw-bold mb-4">
						Create an
						<span className="text-primary"> Account</span>    
					</h1>

					<div className="form-floating mb-3">
						<input type="text"
							className={`form-control ${isValidName ? '' : 'is-invalid'}`}
							id="inputName"
							placeholder="Name"
							maxLength={50}
							onChange={(e) => checkNameValid(e.target.value)} />
						<label htmlFor="inputName">
							<span className="text-danger">* </span>
							Name
						</label>
						<div className="invalid-feedback">
							Invalid name
						</div>
					</div>

					<div className="input-group mb-3">
						<div className="form-floating">
							<input type="text"
								className={`form-control ${isValidLastname1 ? '' : 'is-invalid'}`}
								id="inputFirstLastName"
								placeholder="FirstLastName"
								maxLength={50}
								onChange={(e) => checkLastName1Valid(e.target.value)} />
							<label htmlFor="inputFirstLastName">
								<span className="text-danger">* </span>
								First last name
							</label>
							<div className="invalid-feedback">
								Invalid first lastname
							</div>
						</div>
						<div className="form-floating">
							<input type="text"
								className={`form-control ${isValidLastname2 ? '' : 'is-invalid'}`}
								id="inputSecondLastName"
								placeholder="SecondLastName"
								maxLength={50}
								onChange={(e) => checkLastName2Valid(e.target.value)} />
							<label htmlFor="inputSecondLastName">Second last name</label>
							<div className="invalid-feedback">
								Invalid second lastname
							</div>
						</div>
					</div>

					<div className="input-group mb-3">
						<span className="input-group-text">@</span>
						<div className="form-floating">
							<input type="text"
								className={`form-control ${isValidUsername ? '' : 'is-invalid'}`}
								id="inputUsername"
								placeholder="Username"
								maxLength={50}
								onChange={(e) => checkUsernameValid(e.target.value)} />
							<label htmlFor="inputUsername">
								<span className="text-danger">* </span>
								Username
							</label>
						</div>
						<input type="hidden" name="" className={`form-control ${isValidUsername ? '' : 'is-invalid'}`} />
						<div className="invalid-feedback">
							Invalid username.
							Accepted characters: a-z, 0-9, '_' and '.'
						</div>
					</div>

					<div className="row mb-3">
						<div className="col">
							<div className="form-floating">
								<input type="email"
									className={`form-control ${isValidEmail ? '' : 'is-invalid'}`}
									id="inputEmail"
									placeholder="Email"
									maxLength={100}
									onChange={(e) => checkEmailValid(e.target.value)} />
								<label htmlFor="inputEmail">
									<span className="text-danger">* </span>
									Email
								</label>
								<div className="invalid-feedback">
									Invalid email
								</div>
							</div>
						</div>
						<div className="col">
							<PhoneInput onPhoneChange={(ph) => setPhone(ph)} ></PhoneInput>
						</div>
					</div>

					<PasswordInput placeholder={
						<label htmlFor="inputPassword">
							<span className="text-danger">* </span>
							Password
						</label>}
						onPasswordChange={(pwd) => checkPasswordValid(pwd)}
						validCredentials={isValidPassword} />
					<div>
						<input type="hidden" name="" className={`form-control ${isValidPassword ? '' : 'is-invalid'}`} />
						<div className="invalid-feedback">
							Invalid password
						</div>
					</div>

					<p className="text-start small text-muted mt-3 mb-4">
						<span className="text-danger">*</span> required
					</p>

					<div className="row mb-4">
						<div className="col">
							<input type="button" className="btn btn-secondary fw-medium w-100" value="Cancel" onClick={backToLogin}/>
						</div>
						<div className="col">
							<input type="submit" className="btn btn-primary fw-medium w-100" value="Signup" />
						</div>
					</div>

					<p className="text-danger small fw-bold">
						{ registrationError }
					</p>
				</form>
			</div>

			<Modal show={showModal} backdrop="static" keyboard={false} centered >
				<div className="container text-center py-5">
					<p className="text-body-secondary fs-4 fw-bold mb-5">
						Your account was created
						<br />
						<span className="text-success fs-3">Successfully!</span>
					</p>

					<p className="text-success mb-5" style={{ fontSize: '60px' }}>
						<i className="bi bi-check-circle"></i>
					</p>
					
					<button className="btn btn-success fw-medium" onClick={backToLogin} >Login</button>
				</div>
			</Modal>
	  </>
    );

}