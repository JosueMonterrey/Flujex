import { Link, useNavigate } from "react-router-dom";
import { NewSubscription } from "./NewSubscription";
import { useEffect, useState } from "react";
import { LoadingText } from "./LoadingText";
import { API_URL } from "../config";

export function AccountActions({ accountId }) {

    const navigate = useNavigate();

    const [subscriptions, setSubscriptions] = useState([])
    const [editSubscription, setEditSubscription] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchAndSetSubscriptions = async () => {
        setLoading(true);
        const data = await getSubscriptions();

        if (data)
            setSubscriptions(data);

        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetSubscriptions();
    }, []);

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

    return (

        <div className="options border-end overflow-y-auto pt-5" style={{ width: '300px', maxWidth: '500px' }}>
            <div className="main-btns d-flex flex-column w-100">
                <button className="btn btn-light border-bottom rounded-0 text-start px-4 py-3" onClick={() => navigate(`/account-dashboard/${accountId}`)}>
                    <i className="bi bi-bar-chart me-3"></i>
                    Dashboard
                </button>
                <button className="btn btn-light border-bottom rounded-0 text-start px-4 py-3" onClick={() => navigate(`/account-transactions/${accountId}`)}>
                    <i className="bi bi-cash-coin me-3"></i>
                    Transactions
                </button>
            </div>
            <div className="accordion accordion-flush" id="opt-acordion">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            <i className="bi bi-piggy-bank me-3"></i>
                            Saving goals
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the first item’s accordion body.</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            <i className="bi bi-wallet2 me-3"></i>
                            Budgets
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the second item’s accordion body. Let’s imagine this being filled with some actual content.</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            <i className="bi bi-calendar-event me-3"></i>
                            Subscriptions
                        </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">
                            <NewSubscription accountId={accountId} onCreateSuccessful={fetchAndSetSubscriptions} editMode={editSubscription}/>
                            {
                                loading
                                    ? <LoadingText />
                                    : subscriptions.length > 0
                                        ? subscriptions.map((sub) => (
                                            <button key={sub.subscription_id}
                                                className="btn btn-light w-100 mb-2 text-start"
                                                onClick={() => setEditSubscription(
                                                    {
                                                        "id": sub.subscription_id,
                                                        "frequency": sub.frequency,
                                                        "name": sub.name,
                                                        "start_date": sub.start_date,
                                                        "amount": sub.amount
                                                    }
                                                )}>
                                                {sub.name}
                                            </button>
                                        ))
                                        : <p className="alert alert-info mt-3">No subscriptions</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}