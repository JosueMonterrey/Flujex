import { API_URL } from '../config';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingText } from './LoadingText';
import { Modal } from 'react-bootstrap';
import { HomeButton } from './HomeButton';

export function Settings() {

	const navigate = useNavigate();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [user, setUser] = useState(null);
	const [allAccounts, setAllAccounts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchAndSetUserDetails = async () => {
		setLoading(true);
		const data = await getUserDetails();

		if (data) {
			setUser(data);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchAndSetUserDetails();
	}, []);

	const getUserDetails = async () => {
		try {
			let userId = localStorage.getItem("user_id");

			if (userId == null) {
				navigate("/login");
				return;
			}

			const response = await fetch(`${API_URL}/get_user`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			});

			const data = await response.json();

			return data.success ? data["user"] : null;

		} catch (error) {
			console.error("Connection error", error);
			return null;
		}
	};

	const logout = () => {
		localStorage.clear();
		navigate("/login");
	}

	const deleteUser = async () => {
		try {
			if (user == null)
				return;

			let userId = user["user_id"]
			let response = await fetch(`${API_URL}/delete_user`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			});
			let data = await response.json();

			if (data.success)
				logout();
			else {
				return;
			}
		} catch (error) {
			console.error("Connection error", error);
		}
	}

	return (
		<div className="d-flex flex-column " style={{ height: '100vh' }}>
			<Navbar navbarContent={<HomeButton />} />

			<div className="p-5 overflow-y-auto d-flex flex-wrap">
				{
					loading
						? <LoadingText />
						: <>
							<div className='d-flex flex-wrap gap-3 flex-fill mb-4'>
								<div className='p-3 rounded bg-light' style={{ width: '48%', minWidth: '400px' }}>
									<p className="small text-muted ">Name</p>
									<div className='d-flex gap-3'>
										<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["first_name"]}</p>
										<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["last_name_1"]}</p>
										<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["last_name_2"]}</p>
									</div>
								</div>
								<div className='p-3 rounded bg-light' style={{ width: '48%', minWidth: '400px' }}>
									<p className="small text-muted ">Username</p>
									<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["username"]}</p>
								</div>
								<div className='p-3 rounded bg-light' style={{ width: '48%', minWidth: '400px' }}>
									<p className="small text-muted ">Email</p>
									<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["email"]}</p>
								</div>
								<div className='p-3 rounded bg-light' style={{ width: '48%', minWidth: '400px' }}>
									<p className="small text-muted ">Joined</p>
									<p className='bg-secondary-subtle p-3 m-0 rounded'>{user["signup_date"]}</p>
								</div>
							</div>
							<button className="btn btn-danger ms-3" onClick={() => setShowDeleteModal(true)}>
								Delete user
								<i className="bi bi-trash3 ms-2"></i>
							</button>
							<Modal show={showDeleteModal} backdrop="static" keyboard={false} centered >
								<div className="container text-center py-5">
									<p className="text-body-secondary fs-4 fw-bold mb-5">
										Delete
										<br />
										<span className="text-danger fs-3">{user["username"]}</span>
									</p>

									<p className="text-danger mb-5" style={{ fontSize: '60px' }}>
										<i className="bi bi-trash3-fill"></i>
									</p>

									<div className="d-flex justify-content-center gap-3">
										<button className="btn btn-danger fw-medium" onClick={deleteUser} >Delete</button>
										<button className="btn btn-outline-secondary fw-medium" onClick={() => setShowDeleteModal(false)} >Cancel</button>
									</div>
								</div>
							</Modal>
						</>
				}
			</div>
		</div>
	);
}