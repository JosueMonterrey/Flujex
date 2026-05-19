import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';

export function NewSubscription({ onCreateSuccessful, accountId, editMode }) {

    const [creationError, setCreationError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState(null)


    const [account, setAccount] = useState(null);

    const [name, setName] = useState("");
    const [isValidName, setIsValidName] = useState(true);
    const checkNameValid = (name) => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        setName(name);
        let isValid = regex.test(name);
        setIsValidName(isValid);
        return isValid;
    };

    const [amount, setAmount] = useState(0);
    const [frequency, setFrequency] = useState(null);
    const [startDate, setStartDate] = useState(null);

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const resetForm = () => {
        setName("");
        setIsValidName(true);
        setAmount(0)
        setFrequency(null);
        setStartDate(null)
        setEditId(null)
        setIsEditMode(false);
        setCreationError("");
    }

    useEffect(() => {
        if (editMode != null) {
            setIsEditMode(true)
            setEditId(editMode["id"])
            setName(editMode["name"])
            setFrequency(editMode["frequency"])
            setAmount(editMode["amount"])
            setStartDate(formatDateForInput(editMode["start_date"]))
            setShowModal(true);
        }
    }, [editMode])

    const submitCreation = async (e) => {
        e.preventDefault();

        try {

            if (!checkNameValid(name))
                return setCreationError("Invalid name. Only lower and uppercase letters accepted");

            if (frequency == null)
                return setCreationError("Please choose a frequency");

            if (startDate == null)
                return setCreationError("Please select a starting date")

            if (amount == null || amount <= 0.00)
                return setCreationError("Please enter a valid amount")

            const response = await fetch(`${API_URL}/create_subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    name,
                    frequency,
                    startDate,
                    amount
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

    const updateSubscription = async (e) => {
        e.preventDefault();

        try {

            if (!checkNameValid(name))
                return setCreationError("Invalid name. Only lower and uppercase letters accepted");

            if (frequency == null)
                return setCreationError("Please choose a frequency");

            if (startDate == null)
                return setCreationError("Please select a starting date")

            if (amount == null || amount <= 0.00)
                return setCreationError("Please enter a valid amount")

            const response = await fetch(`${API_URL}/update_subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    editId,
                    name,
                    frequency,
                    amount
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


    const deleteSubscription = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/delete_subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    editId,
                    name
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

    useEffect(() => {
        getAccountDetails();
    }, [])

    const getAccountDetails = async () => {
        try {
            let id = accountId
            const response = await fetch(`${API_URL}/get_account_details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (data.success) {
                setAccount(data["account"])
            }
            else {
                setCreationError("No account ID set")
            }

        } catch (error) {
            console.error("Connection error", error);
            return null;
        }
    };

    return (
        <>
            <button className="btn btn-primary w-100 mb-3 d-flex align-items-center"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }} >
                New Subscription
                <i className="bi bi-plus-lg ms-2"></i>
            </button>

            <Modal show={showModal} backdrop="static" keyboard={false} centered >
                <form id='new-subscription-form' className='container p-5'>
                    <p className="text-body-secondary fs-3 fw-bold mb-5">
                        {isEditMode ? "Edit Subscription" : "New Subscription"}
                    </p>

                    <div className="row mb-4">
                        <div className="col form-floating">
                            <input type="text"
                                className={`form-control ${isValidName ? '' : 'is-invalid'}`}
                                id="accountNameInput"
                                placeholder="Account Name"
                                maxLength={100}
                                value={name}
                                onChange={(e) => checkNameValid(e.target.value.trim())}
                            />
                            <label htmlFor="accountNameInput" className='px-4'>Name</label>
                        </div>
                        <Dropdown className='col'>
                            <Dropdown.Toggle variant="light" className='text-start w-100 h-100'>
                                {frequency == null ? "Payment frequency" : frequency}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <Dropdown.Item active={frequency == "Daily"} onClick={() => setFrequency("Daily")}> Daily </Dropdown.Item>
                                <Dropdown.Item active={frequency == "Weekly"} onClick={() => setFrequency("Weekly")}> Weekly </Dropdown.Item>
                                <Dropdown.Item active={frequency == "Monthly"} defaultChecked onClick={() => setFrequency("Monthly")}> Monthly </Dropdown.Item>
                                <Dropdown.Item active={frequency == "Annually"} onClick={() => setFrequency("Annually")}> Annually </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="date" className="form-label text-muted small">Start date</label>
                        <input type="date" disabled={isEditMode} className="form-control" id="date" value={startDate == null ? "" : startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div className="mb-5">
                        <label className="form-label text-muted small">
                            Payment amount ({account != null ? account.code : ""})
                        </label>
                        <div className="input-group">
                            <span className='input-group-text'>{account != null ? account.symbol : "?"}</span>
                            <input type="number"
                                min={0.00}
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </div>

                    <div className="mb-3">
                        {
                            isEditMode
                                ? <button className="btn btn-primary fw-medium me-3" onClick={updateSubscription} >Update</button>
                                : <button className="btn btn-primary fw-medium me-3" onClick={submitCreation} >Create</button>
                        }
                        {
                            isEditMode
                                ? <button className="btn btn-danger fw-medium me-3" onClick={deleteSubscription} >Delete</button>
                                : ""
                        }
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