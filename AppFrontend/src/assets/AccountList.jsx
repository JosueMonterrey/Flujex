import { useState } from "react";

export function AccountList({ label }) {
    const [accounts, setAccounts] = useState([]);


    const getAccounts = async (e) => {
        e.preventDefault();

        try {
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
        <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle w-100 h-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {label}
            </button>
            <ul className="dropdown-menu">
            </ul>
        </div>
    );
}