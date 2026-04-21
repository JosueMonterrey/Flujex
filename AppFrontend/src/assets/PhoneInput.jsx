import { useState } from 'react';
import countries from 'react-phone-number-input/locale/en';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';

import 'react-phone-number-input/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

export function PhoneInput({ onPhoneChange }) {
    const [country, setCountry] = useState('CR');

    const countryDropdownBtnStyle = {
        minWidth: '80px'
    };

    const countyDropownStyle = {
        maxHeight: '400px',
        overflowY: 'scroll'
    };

    return (
        <div className="input-group dropup">
            <button className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={countryDropdownBtnStyle} >

                +{getCountryCallingCode(country)}

            </button>

            <ul className="dropdown-menu"
                style={countyDropownStyle} >

                {getCountries().map((code) => (
                    <li key={code}>
                        <a  role="button"
                            className="dropdown-item"
                            onClick={() => setCountry(code)}>
                                {countries[code]}
                        </a>
                    </li>
                ))}
                
            </ul>

            <div className="form-floating">
                <Input
                    country={country}
                    value=""
                    onChange={(ph) => onPhoneChange(ph)}
                    className="form-control"
                    id="floatingInput"
                    placeholder="12345678"
                    maxLength={20}
                />
                <label htmlFor="inputPhone">Phone</label>
            </div>
        </div>
    );
}