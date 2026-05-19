import { API_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { AccountActions } from "./AccountActions";
import { HomeButton } from "./HomeButton";
import { Navbar } from "./Navbar";
import { useEffect, useRef, useState } from "react";
import { Popover } from 'bootstrap';
import { LoadingText } from "./LoadingText";
import { Accordion, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export function AccountTransactions() {

    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const [allTransactions, setAllTransactions] = useState([])
    const [transactions, setTransactions] = useState([])

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
                behavior: 'instant',
                block: "nearest",
                inline: "nearest"
            });
        }
    }, [transactions])

    useEffect(() => {
        getTransactions();
        getCategories();
    }, []);

    useEffect(() => {
        if (category != null) {
            let filered_transactions = []

            allTransactions.forEach(t => {
                if (t.category_id == category.category_id)
                    filered_transactions.push(t)
            });
            setTransactions(filered_transactions);
        }
        else {
            setTransactions(allTransactions);
        }
    }, [category]);

    const getTransactions = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/get_transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (data.success) {
                setAllTransactions(data["transactions"]);
                setTransactions(data["transactions"]);
            }

            setLoading(false);

        } catch (error) {
            console.error("Connection error", error);
        }
    }

    const getCategories = async () => {
        try {
            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/get_categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId
                })
            });

            const data = await response.json();

            if (data.success)
                setCategories(data["categories"])
            else
                navigate("/login")
        }
        catch (error) {
            console.error("Connection error", error);
        }
    }

    return (
        <div className="d-flex flex-column " style={{ height: '100vh' }}>
            <Navbar navbarContent={
                <HomeButton />
            } />
            <div id="account-transactions" className="d-flex h-100 overflow-hidden">
                <AccountActions accountId={id} />
                {
                    loading
                        ? <LoadingText />
                        : <div className="content flex-grow-1 d-flex flex-column">
                            <div className="transactions-list p-5 overflow-y-auto d-flex flex-column align-items-center flex-grow-1" >
                                {
                                    transactions.length > 0
                                        ? transactions.map((t) => (
                                            <div key={t.transaction_id} className="w-100 d-flex flex-column align-items-center">

                                                <div className="separator border mb-3" style={{ width: '0px', height: '80px' }}></div>

                                                <p className="text-muted small" >{t.transaction_date}</p>

                                                <div className={
                                                    `transaction-card pb-0 alert
                                                        ${t.origin_id == id
                                                        ? "alert-danger"
                                                        : "alert-success"
                                                    }`

                                                }
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '450px'
                                                    }} >

                                                    <div className="d-flex justify-content-between small" >
                                                        <p>{t.type}</p>
                                                        <p>{t.category_name == "[UNCATEGORIZED]" ? "" : t.category_name}</p>
                                                    </div>

                                                    <div className="d-flex justify-content-between flex-wrap gap-3">
                                                        {
                                                            t.type == "Transfer"
                                                                ? t.origin_id == id
                                                                    ? <Link to={
                                                                        new Date(t.destiny_inactive_date).getTime() > new Date().getTime()
                                                                            ? `/account-dashboard/${t.destiny_id}` : ""
                                                                    }
                                                                        className="alert-link" >
                                                                        <i className="bi bi-box-arrow-down me-3"></i>

                                                                        {t.destiny_name}
                                                                        {
                                                                            new Date(t.destiny_inactive_date).getTime() < new Date().getTime()
                                                                                ? " (deleted)" : ""
                                                                        }
                                                                    </Link>
                                                                    : <Link to={
                                                                        new Date(t.origin_inactive_date).getTime() > new Date().getTime()
                                                                            ? `/account-dashboard/${t.origin_id}` : ""
                                                                    }
                                                                        className="alert-link" >
                                                                        <i className="bi bi-box-arrow-down me-3"></i>

                                                                        {t.origin_name}
                                                                        {
                                                                            new Date(t.origin_inactive_date).getTime() < new Date().getTime()
                                                                                ? " (deleted)" : ""
                                                                        }
                                                                    </Link>
                                                                : ""
                                                        }

                                                        <p className="fw-medium">
                                                            {
                                                                t.type == "Expense" || (t.type == "Transfer" && t.origin_id == id)
                                                                    ? `- ${t.origin_currency_symbol}${t.amount_origin}`
                                                                    : `+ ${t.destiny_currency_symbol}${t.amount_destiny}`
                                                            }
                                                        </p>
                                                    </div>

                                                    {
                                                        t.transaction_description
                                                            ? <p className="small text-muted">{t.transaction_description}</p>
                                                            : ""
                                                    }
                                                </div>
                                            </div>
                                        ))
                                        : <p className="alert alert-info" >No transactions found</p>
                                }
                                <div ref={scrollRef} />
                            </div>
                            <div className="filter p-3 border-top">
                                <label className="form-label text-muted small">Movement Category</label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light">
                                        {category == null ? "All" : category["name"]}
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
                        </div>
                }
            </div>
        </div >
    );
}