import { useNavigate } from "react-router-dom";

export function HomeButton() {
    const navigate = useNavigate();

    return (
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
            <i className="bi bi-house me-2"></i>
            Home
        </button>
    );
}