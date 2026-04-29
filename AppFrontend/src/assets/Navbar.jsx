import { useNavigate } from 'react-router-dom';

export function Navbar({ navbarContent }) {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="navbar w-100 p-2 border-bottom">
            <div className="content px-4 py-1 d-flex flex-fill align-items-center">
                {navbarContent}
            </div>
            <div className="options px-2 py-1 border-start">
                <div className="dropdown">
                    <button className="btn dropdown-toggle border border-0 text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-list"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <a className="dropdown-item" href="#">
                                <i className="bi bi-gear me-2"></i>
                                Settings
                            </a>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <a onClick={logout} role='button' className="dropdown-item">
                                <i className="bi bi-box-arrow-left me-2"></i>
                                Log out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}