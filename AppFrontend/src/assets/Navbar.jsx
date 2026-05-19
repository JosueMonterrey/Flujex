import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function Navbar({ navbarContent }) {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div id='navbar' className="navbar w-100 p-2 border-bottom">
            <div className="content px-4 py-1 d-flex flex-fill align-items-center gap-4">
                {navbarContent}
            </div>
            <div className="options px-2 py-1 border-start">
                <Dropdown>
                    <Dropdown.Toggle variant="light">
                        <i className="bi bi-list"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate("/settings")}>
                            <i className="bi bi-gear me-2"></i>
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(logout)}>
                            <i className="bi bi-box-arrow-left me-2"></i>
                            Log out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}