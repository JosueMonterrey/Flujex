import React, { useState } from 'react';


export function PasswordInput({ onPasswordChange, validCredentials }) {
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="input-group is-invalid">
        <div className="form-floating">
            <input  type={showPassword ? "text" : "password"}
                    className={`form-control ${!validCredentials ? 'is-invalid' : ''}`}
                    id="inputPassword"
                    placeholder=""
                    onChange={(e) => onPasswordChange(e.target.value)} />
            <label htmlFor="inputPassword">Password</label>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
        </button>
    </div>
  );
};