import { API_URL } from '../config';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

export function NewAccount({ onCreateSuccessful }) {

    const [creationError, setCreationError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [name, setName] = useState("");
    const [isValidName, setIsValidName] = useState(true);
    const checkNameValid = (name) => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        setName(name);
        let isValid = regex.test(name);
        setIsValidName(isValid);
        return isValid;
    };

    const [currency, setCurrency] = useState("");
    const [isValidCurrency, setIsValidCurrency] = useState(false);
    const getCurrencies = () => ["CRC", "USD", "EUR"];
    const checkCurrencyValid = (currency) => {
        setCurrency(currency);
        let isValid = currency.length > 0;
        setIsValidCurrency(isValid);
        return isValid;
    }

    const [description, setDescription] = useState("");

    const resetForm = () => {
        setName("");
        setIsValidName(true);
        checkCurrencyValid("")
        setDescription("");
        setCreationError("");
    }

    const submitCreation = async (e) => {
        e.preventDefault();

        try {

            if (!checkNameValid(name))
                return setCreationError("Invalid name. Only lower and uppercase letters accepted.");

            if (!checkCurrencyValid(currency))
                return setCreationError("Please choose a currency.");

            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/create_account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    name,
                    currency,
                    description
                })
            });

            const data = await response.json();

            if (data.success) {
                setCreationError("");
                setShowModal(false);
                onCreateSuccessful();
            }

            else {
                setCreationError(data['msg']);
            }


        }
        catch (error) {
            console.error("Connection error", error);
        }
    }

    return (
        <>
            <button className="btn btn-primary mx-4 d-flex align-items-center"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }} >
                New Account
                <i className="bi bi-plus-lg ms-2"></i>
            </button>

            <Modal show={showModal} backdrop="static" keyboard={false} centered >
                <form className='container p-5'>
                    <p className="text-body-secondary fs-3 fw-bold mb-5">New Account</p>

                    <div className="row mb-3">
                        <div className="col form-floating">
                            <input type="text"
                                className={`form-control ${isValidName ? '' : 'is-invalid'}`}
                                id="accountNameInput"
                                placeholder="Account Name"
                                maxLength={100}
                                onChange={(e) => checkNameValid(e.target.value.trim())}
                            />
                            <label htmlFor="accountNameInput" className='px-4'>Account Name</label>
                        </div>
                        <div className="col dropdown">
                            <button className="btn btn-outline-secondary dropdown-toggle w-100 h-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {isValidCurrency ? currency : "Currency"}
                            </button>
                            <ul className="dropdown-menu">
                                {getCurrencies().map((code) => (
                                    <li key={code}>
                                        <a className="dropdown-item"
                                            role="button"
                                            onClick={ () => checkCurrencyValid(`${code}`) } >
                                                {code}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="form-floating mb-5">
                        <textarea className="form-control"
                            placeholder="Description..."
                            id="accountDescriptionInput"
                            maxLength={255}
                            style={
                                {
                                    height: '100px',
                                    maxHeight: '250px'
                                }
                            }
                            onChange={(e) => setDescription(e.target.value.trim())} >
                        </textarea>
                        <label htmlFor="accountDescriptionInput">Description</label>
                    </div>

                    <div className="mb-3">
                        <button className="btn btn-primary fw-medium me-3" onClick={submitCreation} >Create</button>
                        <button className="btn btn-outline-secondary fw-medium me-3" type="button" onClick={() => setShowModal(false)} >Cancel</button>
                    </div>

                    <p className="text-danger small fw-bold">
                        {creationError}
                    </p>
                </form>
            </Modal>
        </>
    );
}