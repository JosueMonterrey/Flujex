import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { AccountList } from './AccountList';
import { CategoryList } from './CategoryList';

export function NewTransaction({ onCreateSuccessful }) {

    const [creationError, setCreationError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [movementType, setMovementType] = useState("Transfer");
    const [description, setDescription] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [accountOrigin, setAccountOrigin] = useState(null);
    const [accountDestiny, setAccountDestiny] = useState(null);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);

    const [amount, setAmount] = useState(0);

    const checkAccountsValid = () => {
        if (movementType == "Transfer") {

            if (accountOrigin == null || accountDestiny == null) {
                setCreationError("Please select origin and destiny accounts")
                return false;
            }

            if (accountOrigin["account_id"] == accountDestiny["account_id"]) {
                setCreationError("Origin and destiny accounts must not be the same")
                return false;
            }
        }

        if (movementType == "Expense" && accountOrigin == null) {
            setCreationError("Please select origin account")
            return false;
        }

        if (movementType == "Deposit" && accountDestiny == null) {
            setCreationError("Please select destiny account")
            return false;
        }

        setCreationError("");
        return true;
    };

    const checkAmountValid = () => {
        if (amount == null || amount <= 0.00) {
            setCreationError("Please enter a valid amount to transfer")
            return false;
        }

        if (movementType != "Deposit" && amount > parseFloat(accountOrigin["balance"])) {
            setCreationError("Not enough funds");
            return false;
        }

        return true;
    }

    const resetForm = () => {
        setDescription("");
        setAccountOrigin(null);
        setAccountDestiny(null);
        setCategory(null);
        setAmount(0);
        setMovementType("Transfer")
        setCreationError("");
    };

    useEffect(() => {
        getAccounts();
    }, []);

    const getAccounts = async () => {
        try {
            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/get_accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (data.success) {
                setCreationError("");
                setAccounts(data["accounts"])
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
        getCategories();
    }, [movementType])

    const getCategories = async () => {
        try {
            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/get_categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    movementType
                 })
            });

            const data = await response.json();

            if (data.success) {
                setCreationError("");
                setCategory(null);
                setCategories(data["categories"])
            }

            else {
                setCreationError(data['msg']);
            }


        }
        catch (error) {
            console.error("Connection error", error);
        }
    }

    const submitTransaction = async (e) => {
        e.preventDefault();

        try {
            if (!checkAccountsValid() || !checkAmountValid())
                return;

            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/new_transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    accountOrigin,
                    accountDestiny,
                    category,
                    movementType,
                    amount,
                    description
                })
            });

            const data = await response.json();

            if (data.success) {
                setCreationError("");
                setShowModal(false);
                setShowSuccessModal(true);
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
            <button className="btn btn-primary rounded-circle"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}
                style={{
                    width: '65px',
                    aspectRatio: '1 / 1'
                }}
            >
                <i className="bi bi-currency-exchange fs-4"></i>
            </button>

            <Modal show={showSuccessModal} backdrop="static" keyboard={false} centered >
                <div className="container text-center py-5">
                    <p className="text-body-secondary fs-4 fw-bold mb-5">
                        Transaction
                        <br />
                        <span className="text-success fs-3">Successful!</span>
                    </p>

                    <p className="text-success mb-5" style={{ fontSize: '60px' }}>
                        <i className="bi bi-check-circle"></i>
                    </p>

                    <button className="btn btn-success fw-medium" onClick={() => setShowSuccessModal(false)} >Finish</button>
                </div>
            </Modal>

            <Modal show={showModal} backdrop="static" keyboard={false} centered >
                <form className='container px-4 pt-4 pb-1'>
                    <p className="text-body-secondary fs-3 fw-bold mb-4">New Transaction</p>

                    <div className="btn-group w-100" role="group">
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" onClick={() => setMovementType("Transfer")} defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor="btnradio1">Transfer</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={() => setMovementType("Deposit")} />
                        <label className="btn btn-outline-primary" htmlFor="btnradio2">Deposit</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={() => setMovementType("Expense")} />
                        <label className="btn btn-outline-primary" htmlFor="btnradio3">Expense</label>
                    </div>

                    <hr />

                    <div className="mb-4 d-flex flex-row">
                        <div className={`flex-fill me-1 ${movementType == "Deposit" ? "d-none" : ""}`} style={{ maxWidth: '50%' }}>
                            <label className="form-label text-muted small">Origin Account</label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className='w-100 text-start'>
                                    {accountOrigin == null ? "Origin" : accountOrigin["account_name"]}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        accounts.map((acc) => (
                                            <Dropdown.Item key={acc.account_id} onClick={() => setAccountOrigin(acc)}>{acc.account_name}</Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className={`flex-fill ${movementType == "Expense" ? "d-none" : ""}`} style={{ maxWidth: '50%' }}>
                            <label className="form-label text-muted small">Destiny Account</label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className='w-100 text-start'>
                                    {accountDestiny == null ? "Destiny" : accountDestiny["account_name"]}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        accounts.map((acc) => (
                                            <Dropdown.Item key={acc.account_id} onClick={() => setAccountDestiny(acc)}>{acc.account_name}</Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small">
                            Amount transfered
                            ({
                                movementType == "Deposit"
                                    ? accountDestiny == null
                                        ? "?"
                                        : accountDestiny["code"]
                                    : accountOrigin == null
                                        ? "?"
                                        : accountOrigin["code"]
                            })
                        </label>
                        <div className="input-group">
                            <span className='input-group-text'>
                                {
                                    movementType == "Deposit"
                                        ? accountDestiny == null
                                            ? "?"
                                            : accountDestiny["symbol"]
                                        : accountOrigin == null
                                            ? "?"
                                            : accountOrigin["symbol"]
                                }
                            </span>
                            <input type="number"
                                min={0.00}
                                max={accountOrigin == null ? 0.00 : accountOrigin["balance"]}
                                className="form-control"
                                onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small">Movement Category</label>
                        <Dropdown>
                            <Dropdown.Toggle variant="light">
                                {category == null ? "No category" : category["name"]}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item key={-1} onClick={() => setCategory(null)} className='fst-italic'>No category</Dropdown.Item>
                                {
                                    categories.map((cat) => (
                                        <Dropdown.Item key={cat.category_id} onClick={() => setCategory(cat)}>{cat.name}</Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="form-floating mb-4">
                        <textarea className="form-control"
                            placeholder="Description..."
                            id="transactionDescriptionInput"
                            maxLength={255}
                            style={
                                {
                                    height: '100px',
                                    maxHeight: '100px'
                                }
                            }
                            onChange={(e) => setDescription(e.target.value.trim())} >
                        </textarea>
                        <label htmlFor="transactionDescriptionInput">Movement description</label>
                    </div>

                    <hr />

                    <div className="mb-3 mt-3">
                        <button className="btn btn-primary fw-medium me-3" onClick={submitTransaction} >Finish</button>
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