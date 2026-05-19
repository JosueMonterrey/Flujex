import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';

export function NewBudget({ onCreateSuccessful, accountId, editMode }) {

    const [creationError, setCreationError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState(null)

    const [account, setAccount] = useState(null);

    const [amount, setAmount] = useState(0);
    let monthList = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    const [year, setYear] = useState(new Date().getFullYear());
    const [isValidYear, setIsValidYear] = useState(true);
    const [month, setMonth] = useState(null);
    const checkYearValid = (year) => {
        setYear(year)
        let isValid = year != null && year >= new Date().getFullYear();
        setIsValidYear(isValid);
        return isValid;
    }

    const resetForm = () => {
        setAmount(0)
        setYear(new Date().getFullYear())
        setIsValidYear(true);
        setMonth(null);
        setEditId(null)
        setIsEditMode(false);
        setCreationError("");
    }

    useEffect(() => {
        if (editMode != null) {
            setIsEditMode(true)
            setEditId(editMode["id"])
            setYear(editMode["year"])
            setMonth(editMode["month"])
            setAmount(editMode["amount"])
            setShowModal(true);
        }
    }, [editMode])

    const submitCreation = async (e) => {
        e.preventDefault();

        try {
            if (!checkYearValid(year))
                return setCreationError("Please enter a valid year")

            if (month == null)
                return setCreationError("Please select a month")

            if (amount == null || amount <= 0.00)
                return setCreationError("Please enter a valid amount")

            const response = await fetch(`${API_URL}/create_budget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    amount,
                    month,
                    year
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

    const updateBudget = async (e) => {
        e.preventDefault();

        try {
            if (!checkYearValid(year))
                return setCreationError("Please enter a valid year")

            if (month == null)
                return setCreationError("Please select a month")

            if (amount == null || amount <= 0.00)
                return setCreationError("Please enter a valid amount")

            const response = await fetch(`${API_URL}/update_budget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    editId,
                    amount,
                    month,
                    year
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

    const deleteBudget = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/delete_budget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    editId
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
                New Budget
                <i className="bi bi-plus-lg ms-2"></i>
            </button>

            <Modal show={showModal} backdrop="static" keyboard={false} centered >
                <form id='new-budget-form' className='container p-5'>
                    <p className="text-body-secondary fs-3 fw-bold mb-5">
                        {isEditMode ? "Edit Budget" : "New Budget"}
                    </p>

                    <div className="row mb-4">
                        <div className="col form-floating">
                            <input type="text"
                                className={`form-control ${isValidYear ? '' : 'is-invalid'}`}
                                id="accountYearInput"
                                placeholder="Budget Year"
                                maxLength={100}
                                value={year}
                                onChange={(e) => checkYearValid(e.target.value.trim())}
                            />
                            <label htmlFor="accountYearInput" className='px-4'>Budget year</label>
                        </div>
                        <Dropdown className='col'>
                            <Dropdown.Toggle variant="light" className='text-start w-100 h-100'>
                                {month == null ? "Budget month" : monthList[month - 1]}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <Dropdown.Item active={month == 1} onClick={() => setMonth(1)}> January </Dropdown.Item>
                                <Dropdown.Item active={month == 2} onClick={() => setMonth(2)}> Febuary </Dropdown.Item>
                                <Dropdown.Item active={month == 3} onClick={() => setMonth(3)}> March </Dropdown.Item>
                                <Dropdown.Item active={month == 4} onClick={() => setMonth(4)}> April </Dropdown.Item>
                                <Dropdown.Item active={month == 5} onClick={() => setMonth(5)}> May </Dropdown.Item>
                                <Dropdown.Item active={month == 6} onClick={() => setMonth(6)}> June </Dropdown.Item>
                                <Dropdown.Item active={month == 7} onClick={() => setMonth(7)}> July </Dropdown.Item>
                                <Dropdown.Item active={month == 8} onClick={() => setMonth(8)}> August </Dropdown.Item>
                                <Dropdown.Item active={month == 9} onClick={() => setMonth(9)}> September </Dropdown.Item>
                                <Dropdown.Item active={month == 10} onClick={() => setMonth(10)}> October </Dropdown.Item>
                                <Dropdown.Item active={month == 11} onClick={() => setMonth(11)}> November </Dropdown.Item>
                                <Dropdown.Item active={month == 12} onClick={() => setMonth(12)}> December </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="mb-5">
                        <label className="form-label text-muted small">
                            Limit amount ({account != null ? account.code : ""})
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
                                ? <button className="btn btn-primary fw-medium me-3" onClick={updateBudget} >Update</button>
                                : <button className="btn btn-primary fw-medium me-3" onClick={submitCreation} >Create</button>
                        }
                        {
                            isEditMode
                                ? <button className="btn btn-danger fw-medium me-3" onClick={deleteBudget} >Delete</button>
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