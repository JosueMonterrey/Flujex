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
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <form class="text-center px-5 p-5 bg-body-tertiary rounded shadow-sm">
                <h1 class="text-body-secondary fw-bold mb-5">
                    Create an
                    <span class="text-primary"> Account</span>    
                </h1>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="inputName" placeholder="Name" />
                    <label for="inputName">Name</label>
                </div>

                <div class="input-group mb-3">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="inputFirstLastName" placeholder="FirstLastName" />
                        <label for="inputFirstLastName">First last name</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="inputSecondLastName" placeholder="SecondLastName" />
                        <label for="inputSecondLastName">Second last name</label>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <span class="input-group-text">@</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="inputUsername" placeholder="Username" />
                        <label for="inputUsername">Username</label>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <div class="form-floating">
                            <input type="email" class="form-control" id="inputEmail" placeholder="Email" />
                            <label for="inputEmail">Email</label>
                        </div>
                    </div>
                    <div className="col">
                        <PhoneInput></PhoneInput>
                    </div>
                </div>

                <PasswordInput></PasswordInput>

                <div className="row mt-5">
                    <div className="col">
                        <input type="button" class="btn btn-secondary fw-medium w-100" value="Cancel" onClick={cancelButton}/>
                    </div>
                    <div className="col">
                        <input type="submit" class="btn btn-primary fw-medium w-100" value="Signup" />
                    </div>
                </div>
                
            </form>
        </div>
    );

}