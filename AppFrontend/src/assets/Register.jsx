import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PhoneInput } from './PhoneInput';

export function Register() {
    const navigate = useNavigate();
    const cancelButton = () => {
        navigate("/login");
    }


    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form className="text-center px-5 p-5 bg-body-tertiary rounded shadow-sm">
                <h1 className="text-body-secondary fw-bold mb-5">
                    Create an
                    <span className="text-primary"> Account</span>    
                </h1>

                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="inputName" placeholder="Name" />
                    <label htmlFor="inputName">Name</label>
                </div>

                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="inputFirstLastName" placeholder="FirstLastName" />
                        <label htmlFor="inputFirstLastName">First last name</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="inputSecondLastName" placeholder="SecondLastName" />
                        <label htmlFor="inputSecondLastName">Second last name</label>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text">@</span>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="inputUsername" placeholder="Username" />
                        <label htmlFor="inputUsername">Username</label>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <div className="form-floating">
                            <input type="email" className="form-control" id="inputEmail" placeholder="Email" />
                            <label htmlFor="inputEmail">Email</label>
                        </div>
                    </div>
                    <div className="col">
                        <PhoneInput></PhoneInput>
                    </div>
                </div>

                <PasswordInput></PasswordInput>

                <div className="row mt-5">
                    <div className="col">
                        <input type="button" className="btn btn-secondary fw-medium w-100" value="Cancel" onClick={cancelButton}/>
                    </div>
                    <div className="col">
                        <input type="submit" className="btn btn-primary fw-medium w-100" value="Signup" />
                    </div>
                </div>
                
            </form>
        </div>
    );

}