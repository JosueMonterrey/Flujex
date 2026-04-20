import React, { useState } from 'react';


export function PasswordInput({ onPasswordChange, validCredentials }) {
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div class="input-group is-invalid">
        <div class="form-floating">
            <input  type={showPassword ? "text" : "password"}
                    class={`form-control ${!validCredentials ? 'is-invalid' : ''}`}
                    id="inputPassword"
                    placeholder=""
                    onChange={(e) => onPasswordChange(e.target.value)} />
            <label for="inputPassword">Password</label>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
            <i class={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
        </button>
    </div>
  );
};