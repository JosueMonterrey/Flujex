import { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";
import { Navbar } from "./Navbar";
import { NewCategory } from "./NewCategory";
import { API_URL } from "../config";
import { LoadingText } from './LoadingText';

export function Categories() {

    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [editCategory, setEditCategory] = useState(null)


    const fetchAndSetCategories = async () => {
        setLoading(true);
        const data = await getCategories();

        if (data) {
            console.log(data)
            setCategories(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetCategories();
    }, []);

    const getCategories = async () => {
        try {
            let userId = localStorage.getItem("user_id");

            if (userId == null) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${API_URL}/get_categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            return data.success ? data["categories"] : null

        } catch (error) {
            console.error("Connection error", error);
            return null;
        }
    };


    return (
        <div className="d-flex flex-column" style={{ height: '100vh' }}>
            <Navbar navbarContent={
                <HomeButton />
            } />

            <div className="pt-5 ps-4 flex-fill d-flex flex-column">
                <div><NewCategory onCreateSuccessful={fetchAndSetCategories} editMode={editCategory} /></div>

                <div className="list mt-4 pe-5 flex-fill overflow-y-auto" style={{height: '100px'}}>
                    {
                        loading
                            ? <LoadingText />
                            : categories.length > 0
                                ? categories.map((cat) => (
                                    <div key={cat.category_id}
                                        className="d-flex align-items-center justify-content-between py-2"
                                        style={{
                                            minHeight: '80px',
                                            borderLeftColor: `rgb(${cat.color_r}, ${cat.color_g}, ${cat.color_b})`,
                                            borderLeftWidth: '2px',
                                            borderLeftStyle: 'solid'
                                        }}>
                                        <div className="d-flex flex-column ms-4"
                                            style={{
                                                width: '100%',
                                                maxWidth: '280px'
                                            }}>
                                            <p className="fw-medium h-50 m-0 d-flex align-items-center" >{cat.name}</p>
                                            <p className="small text-muted h-50 m-0 d-flex align-items-center">Type: {cat.type_allowed}</p>
                                        </div>
                                        <div className="d-flex flex-fill h-100 align-items-center border-start px-3 mx-3 small fw-light" >
                                            {cat.description}
                                        </div>
                                        <button className="btn btn-light" style={{ width: '40px', height: '40px' }}
                                            onClick={() => setEditCategory(
                                                {
                                                    "id": cat.category_id,
                                                    "name": cat.name,
                                                    "description": cat.description,
                                                    "color_r": cat.color_r,
                                                    "color_g": cat.color_g,
                                                    "color_b": cat.color_b,
                                                    "allowed": cat.type_allowed
                                                }
                                            )}>
                                            <i className="bi bi-pen"></i>
                                        </button>
                                    </div>
                                ))
                                : <p className="alert alert-info">No categories found</p>
                    }
                </div>
            </div>
        </div>

    );
}