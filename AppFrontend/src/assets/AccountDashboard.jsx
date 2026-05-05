import { API_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { AccountActions } from "./AccountActions";
import { HomeButton } from "./HomeButton";
import { Navbar } from "./Navbar";
import { useEffect, useRef, useState } from "react";
import { Popover } from 'bootstrap';
import { LoadingText } from "./LoadingText";
import { Dropdown, Modal } from "react-bootstrap";

export function AccountDashboard() {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState([]);
    const [transactionsDataOut, setTransactionsDataOut] = useState([]);
    const [transactionsDataIn, setTransactionsDataIn] = useState([]);
    const [mostSpentCategories, setMostSpentCategories] = useState([]);
    const [days, setDays] = useState(30);
    const { id } = useParams();
    const navigate = useNavigate();

    const popoverRef = useRef(null);
    useEffect(() => {
        loadPopover();
    }, [account, loading]);
    const loadPopover = () => {
        let popoverInstance = null;

        if (popoverRef.current) {
            popoverInstance = new Popover(popoverRef.current, {
                trigger: 'hover focus',
                content: `${account["currency_name"]}`,
                placement: 'right'
            });
        }
    }

    useEffect(() => {
        getAccountDetails();
    }, [id]);

    const getAccountDetails = async () => {
        try {
            setLoading(true);

            let userId = localStorage.getItem("user_id");

            if (userId == null) {
                navigate("/login");
                return;
            }

            // ACCOUNT DETAILS
            const response = await fetch(`${API_URL}/get_account_details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await response.json();

            if (data.success)
                setAccount(data["account"]);
            else {
                navigate("/home");
                return;
            }
            //

            setLoading(false);

        } catch (error) {
            console.error("Connection error", error);
        }
    }

    useEffect(() => {
        getTransactions();
    }, [id, days]);

    const getTransactions = async () => {
        try {
            setLoading(true);

            // TRANSACTIONS IN DATA
            let response = await fetch(`${API_URL}/get_account_transfers_in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, days })
            });
            let data = await response.json();

            if (data.success)
                setTransactionsDataIn(data["transactions_data"]);
            else {
                navigate("/home");
                return;
            }
            //

            // TRANSACTIONS OUT DATA
            response = await fetch(`${API_URL}/get_account_transfers_out`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, days })
            });
            data = await response.json();

            if (data.success)
                setTransactionsDataOut(data["transactions_data"]);
            else {
                navigate("/home");
                return;
            }
            //

            setLoading(false);

        } catch (error) {
            console.error("Connection error", error);
        }
    }

    useEffect(() => {
        getMostSpentCategories();
    }, [id, days]);

    const getMostSpentCategories = async () => {
        try {
            setLoading(true);

            // CATEGORIES DATA
            const response = await fetch(`${API_URL}/get_most_spent_categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, days })
            });
            const data = await response.json();

            if (data.success)
                setMostSpentCategories(data["categories_data"]);
            else {
                navigate("/home");
                return;
            }


            setLoading(false);

        } catch (error) {
            console.error("Connection error", error);
        }
    }

    const deleteAccount = async () => {
        try {
            if (account == null)
                return;

            let accountId = account["account_id"]
            let response = await fetch(`${API_URL}/delete_account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId })
            });
            let data = await response.json();

            if (data.success)
                navigate("/home");
            else {
                return;
            }
        } catch (error) {
            console.error("Connection error", error);
        }
    }

    return (
        <>
            <div className="d-flex flex-column " style={{ height: '100vh' }}>
                <Navbar navbarContent={
                    <HomeButton />
                } />
                <div className="d-flex h-100 overflow-hidden">
                    <AccountActions accountId={id} />
                    {
                        loading
                            ? <LoadingText />
                            : <div className="content flex-grow-1 p-5">
                                <div className="bg-light px-3 py-1 mb-3 rounded text-body-secondary fs-2 fw-bold d-flex justify-content-between">
                                    {account["account_name"]}
                                    <button className="btn btn-light text-danger" onClick={() => setShowDeleteModal(true)}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>

                                <p className="fs-2 fw-bold bg-light rounded px-3 py-1">
                                    <span className="text-success me-2">
                                        {account["symbol"]}
                                    </span>
                                    {account["balance"]}
                                    <span className="text-muted fs-6 ms-2 fw-medium" ref={popoverRef}>
                                        ({account["code"]})
                                    </span>
                                </p>

                                <div className="bg-light rounded p-3 mb-3">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light">
                                            Transactions last {days} days
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setDays(1)}>1 day</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setDays(7)}>7 days</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setDays(30)}>30 days</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setDays(90)}>90 days</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <div className="d-flex text-center justify-content-between mt-3">
                                        <div className="in w-25">
                                            <p className="text-muted fw-bold border-bottom">In</p>
                                            <p className="fw-light text-muted">
                                                ({transactionsDataIn["amount_transactions"]})
                                                <span className="text-success fw-medium ms-2">+{transactionsDataIn["total_in"]}</span>
                                            </p>
                                        </div>
                                        <div className="border"></div>
                                        <div className="out w-25">
                                            <p className="text-muted fw-bold border-bottom">Out</p>
                                            <p className="fw-light text-muted">
                                                ({transactionsDataOut["amount_transactions"]})
                                                <span className="text-danger fw-medium ms-2">-{transactionsDataOut["total_out"]}</span>
                                            </p>
                                        </div>
                                        <div className="border"></div>
                                        <div className="total w-25">
                                            <p className="text-muted fw-bold border-bottom">Total</p>
                                            <p className="fw-light text-muted">
                                                ({transactionsDataIn["amount_transactions"] + transactionsDataOut["amount_transactions"]})
                                                <span className="text-primary fw-medium ms-2">
                                                    {
                                                        (parseFloat(transactionsDataIn["total_in"]) - parseFloat(transactionsDataOut["total_out"])).toString()
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <div className="bg-light rounded px-3 pt-3 w-50">
                                        <p className="text-muted">Most spent categories:</p>
                                        {
                                            mostSpentCategories.length > 0
                                                ? <ol>
                                                    {
                                                        mostSpentCategories.map((category) => <li key={category["category_id"]}>
                                                            <p>{category["name"]}:
                                                                <span className="fw-light text-muted">
                                                                    ({category["amount_transactions"]}) {category["total_out"]}
                                                                </span>
                                                            </p>
                                                        </li>)
                                                    }
                                                </ol>
                                                : <p className="alert alert-light" >No data</p>
                                        }
                                    </div>
                                    <div className="bg-light rounded px-3 pt-3 w-50">
                                        <p className="text-muted">Least spent categories:</p>
                                        {
                                            mostSpentCategories.length > 0
                                                ? <ol>
                                                    {
                                                        mostSpentCategories.map((category) => <li key={category["category_id"]}>
                                                            <p> {category["name"]} {category["total_out"]}
                                                            </p>
                                                        </li>)
                                                    }
                                                </ol>
                                                : <p className="alert alert-light" >No data</p>
                                        }
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>

            <Modal show={showDeleteModal} backdrop="static" keyboard={false} centered >
                <div className="container text-center py-5">
                    <p className="text-body-secondary fs-4 fw-bold mb-5">
                        Delete
                        <br />
                        <span className="text-danger fs-3">{account.account_name}</span>
                    </p>

                    <p className="text-danger mb-5" style={{ fontSize: '60px' }}>
                        <i className="bi bi-trash3-fill"></i>
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-danger fw-medium" onClick={() => deleteAccount()} >Delete</button>
                        <button className="btn btn-outline-secondary fw-medium" onClick={() => setShowDeleteModal(false)} >Cancel</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}