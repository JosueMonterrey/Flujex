import { API_URL } from '../config';
import { Navbar } from './Navbar';
import { NewAccount } from './NewAccount';
import { SearchBar } from './SearchBar';
import { AccountCard } from './AccountCard';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LoadingText } from './LoadingText';
import { NewTransaction } from './NewTransaction';
import { Popover } from 'bootstrap';

export function Home() {

	const navigate = useNavigate();

	const [accounts, setAccounts] = useState([]);
	const [allAccounts, setAllAccounts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchAndSetAccounts = async () => {
		setLoading(true);
		const data = await getAccounts();

		if (data) {
			setAllAccounts(data);
			setAccounts(data);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchAndSetAccounts();
	}, []);

	const getAccounts = async () => {
		try {
			let userId = localStorage.getItem("user_id");

			if (userId == null) {
				navigate("/login");
				return;
			}

			const response = await fetch(`${API_URL}/get_accounts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			});

			const data = await response.json();

			return data.success ? data["accounts"] : null;

		} catch (error) {
			console.error("Connection error", error);
			return null;
		}
	};

	const searchAccounts = (query) => {
		if (query.length <= 0) {
			setAccounts(allAccounts);
			return;
		}

		let similiar = [];

		allAccounts.forEach(acc => {
			if (acc.account_name == query)
				similiar.push(acc);
		});

		setAccounts(similiar);
	};

	const popoverRef = useRef(null);
	useEffect(() => {
		loadPopover();
	}, [loading]);
	const loadPopover = () => {
		let popoverInstance = null;

		if (popoverRef.current) {
			popoverInstance = new Popover(popoverRef.current, {
				trigger: 'hover focus',
				content: "New Transaction",
				placement: 'left'
			});
		}
	}

	return (
		<>
			<div id='new-transaction-btn' className="position-absolute" ref={popoverRef} style={{
				right: '45px',
				bottom: '35px'
			}}>
				<NewTransaction onCreateSuccessful={fetchAndSetAccounts} />
			</div>
			<div className="d-flex flex-column " style={{ height: '100vh' }}>
				<Navbar navbarContent={
					<>
						<SearchBar placeholder="Search accounts" onSearch={(s) => searchAccounts(s)} />
						<NewAccount onCreateSuccessful={fetchAndSetAccounts} />
						<Link to={"/categories"} className="btn btn-primary d-flex align-items-center">
							Manage Categories
							<i className="bi bi-tag ms-2"></i>
						</Link>
					</>
				} />

				<div id='account-card-list' className="p-5 overflow-y-auto d-flex flex-wrap">
					{
						loading
							? <LoadingText />
							: accounts.length > 0
								? accounts.map((account) => (account.account_name == "[SYSTEM_ORIGIN]" || account.account_name == "[SYSTEM_DESTINY]")
									? ""
									: <AccountCard
										key={account.account_id}
										id={account.account_id}
										name={account.account_name}
										balance={account.balance}
										description={account.description}
										currencySymbol={account.symbol} />)
								: <p className="alert alert-info">No accounts found.</p>
					}
				</div>
			</div>
		</>
	);
}