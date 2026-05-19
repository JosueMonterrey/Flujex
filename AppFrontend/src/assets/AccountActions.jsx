import { Link, useNavigate } from "react-router-dom";
import { NewSubscription } from "./NewSubscription";
import { useEffect, useState } from "react";
import { LoadingText } from "./LoadingText";
import { API_URL } from "../config";
import { NewBudget } from "./NewBudget";
import { Accordion } from "react-bootstrap";

export function AccountActions({ accountId }) {

    const navigate = useNavigate();

    const [subscriptions, setSubscriptions] = useState([])
    const [editSubscription, setEditSubscription] = useState(null)

    const [budgets, setBudgets] = useState([])
    const [editBudget, setEditBudget] = useState(null)
    let monthList = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const [loading, setLoading] = useState(true);
    const [hidden, setHidden] = useState(true);
    const [optActiveKey, setOptActiveKey] = useState(null);

    useEffect(() => {
        fetchAndSetSubscriptions();
        fetchAndSetBudgets();
    }, []);

    const fetchAndSetSubscriptions = async () => {
        setLoading(true);
        const data = await getSubscriptions();

        if (data)
            setSubscriptions(data);

        setLoading(false);
    };

    const getSubscriptions = async () => {
        try {
            const response = await fetch(`${API_URL}/get_subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId })
            });

            const data = await response.json();

            return data.success ? data["subscriptions"] : null;

        } catch (error) {
            console.error("Connection error", error);
            return null;
        }
    };

    const fetchAndSetBudgets = async () => {
        setLoading(true);
        const data = await getBudgets();

        if (data)
            setBudgets(data);

        setLoading(false);
    };

    const getBudgets = async () => {
        try {
            const response = await fetch(`${API_URL}/get_budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId })
            });

            const data = await response.json();

            return data.success ? data["budgets"] : null;

        } catch (error) {
            console.error("Connection error", error);
            return null;
        }
    };

    return (

        <div id="account-actions" className={`${hidden ? "hidden" : ""} options border-end overflow-y-auto`} style={{
            width: '300px',
            maxWidth: '500px',
            transition: 'all 0.6s ease-out'
        }}>
            <div className="hide px-2 my-2 text-end d-none">
                <button className="btn" onClick={() => { setHidden(!hidden); setOptActiveKey(null) }}>
                    {
                        hidden
                            ? <i className="bi bi-arrows-angle-expand text-body-tertiary fs-6"></i>
                            : <i className="bi bi-x-circle text-body-tertiary fs-6"></i>
                    }
                </button>
            </div>
            <div className="main-btns d-flex flex-column w-100">
                <button className="btn border-bottom rounded-0 text-start px-4 py-3 d-flex" onClick={() => navigate(`/account-dashboard/${accountId}`)}>
                    <i className="bi bi-bar-chart me-4"></i>
                    Dashboard
                </button>
                <button className="btn border-bottom rounded-0 text-start px-4 py-3 d-flex" onClick={() => navigate(`/account-transactions/${accountId}`)}>
                    <i className="bi bi-cash-coin me-4"></i>
                    Transactions
                </button>
            </div>
            <Accordion flush activeKey={optActiveKey} >
                <Accordion.Item eventKey="0" >
                    <Accordion.Header className="ps-1" onClick={() => {
                        setHidden(false);
                        setTimeout(() => {
                            setOptActiveKey(optActiveKey == "0" ? "" : "0")
                        }, 125);
                    }}>
                        <i className="bi bi-wallet2 me-4"></i>
                        Budgets
                    </Accordion.Header>
                    <Accordion.Body>
                        <NewBudget accountId={accountId} onCreateSuccessful={fetchAndSetBudgets} editMode={editBudget} />
                        {
                            loading
                                ? <LoadingText />
                                : budgets.length > 0
                                    ? budgets.map((b) => (
                                        <button key={b.budget_id}
                                            className="btn btn-light w-100 mb-2 py-2 text-start"
                                            onClick={() => setEditBudget(
                                                {
                                                    "id": b.budget_id,
                                                    "year": b.year,
                                                    "month": b.month,
                                                    "amount": b.amount_limit
                                                }
                                            )}>
                                            <p>{monthList[b.month - 1]} / {b.year}</p>

                                            <div className="progress" role="progressbar" aria-label="Basic example">
                                                <div className="progress-bar" style={{ width: `${b.current_spent / b.amount_limit * 100}%` }}></div>
                                            </div>
                                            <p className="text-muted small m-0">
                                                {b.current_spent} / {b.amount_limit} ({Math.trunc(b.current_spent / b.amount_limit * 100)}%)
                                            </p>

                                        </button>
                                    ))
                                    : <p className="alert alert-info mt-3">No budgets</p>
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header className="ps-1" onClick={() => {
                        setHidden(false);
                        setTimeout(() => {
                            setOptActiveKey(optActiveKey == "1" ? "" : "1")
                        }, 125);
                    }}>
                        <i className="bi bi-calendar-event me-4"></i>
                        Subscriptions
                    </Accordion.Header>
                    <Accordion.Body>
                        <NewSubscription accountId={accountId} onCreateSuccessful={fetchAndSetSubscriptions} editMode={editSubscription} />
                        {
                            loading
                                ? <LoadingText />
                                : subscriptions.length > 0
                                    ? subscriptions.map((sub) => (
                                        <button key={sub.subscription_id}
                                            className="btn btn-light w-100 mb-2 d-flex justify-content-between align-items-center"
                                            onClick={() => setEditSubscription(
                                                {
                                                    "id": sub.subscription_id,
                                                    "frequency": sub.frequency,
                                                    "name": sub.name,
                                                    "start_date": sub.start_date,
                                                    "amount": sub.amount
                                                }
                                            )}>
                                            <span>{sub.name}</span>
                                            <span className="text-muted small">{sub.amount}/{sub.frequency[0]}</span>
                                        </button>
                                    ))
                                    : <p className="alert alert-info mt-3">No subscriptions</p>
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    );
}