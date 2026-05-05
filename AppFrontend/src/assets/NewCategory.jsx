import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';

export function NewCategory({ onCreateSuccessful, editMode }) {

    const [creationError, setCreationError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState(null)

    const [name, setName] = useState("");
    const [isValidName, setIsValidName] = useState(true);
    const checkNameValid = (name) => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        setName(name);
        let isValid = regex.test(name);
        setIsValidName(isValid);
        return isValid;
    };

    const [allowed, setAllowed] = useState(null);
    const [description, setDescription] = useState("");
    const [color_r, setColor_r] = useState(0);
    const [color_g, setColor_g] = useState(0);
    const [color_b, setColor_b] = useState(0);

    const rgbToHex = (r, g, b) => {
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const handleColorInput = (color) => {

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        setColor_r(r)
        setColor_g(g)
        setColor_b(b)
    }

    const resetForm = () => {
        setName("");
        setIsValidName(true);
        setDescription("");
        setColor_r(0)
        setColor_g(0)
        setColor_b(0)
        setAllowed(null)
        setEditId(null)
        setCreationError("");
        setIsEditMode(false)
    }

    useEffect(() => {
        if (editMode != null) {
            setIsEditMode(true)
            setEditId(editMode["id"])
            setName(editMode["name"])
            setDescription(editMode["description"])
            setColor_r(editMode["color_r"])
            setColor_g(editMode["color_g"])
            setColor_b(editMode["color_b"])
            setAllowed(editMode["allowed"])
            setShowModal(true);
        }
    }, [editMode])

    const submitCreation = async (e) => {
        e.preventDefault();

        try {

            if (!checkNameValid(name))
                return setCreationError("Invalid name. Only lower and uppercase letters accepted.");

            if (allowed == null)
                return setCreationError("Please choose a movement type.");

            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/create_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    name,
                    description,
                    color_r,
                    color_g,
                    color_b,
                    allowed
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


    const updateCategory = async (e) => {
        e.preventDefault();

        try {

            if (!checkNameValid(name))
                return setCreationError("Invalid name. Only lower and uppercase letters accepted.");

            if (allowed == null)
                return setCreationError("Please choose a movement type.");

            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/update_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    editId,
                    name,
                    description,
                    color_r,
                    color_g,
                    color_b,
                    allowed
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


    const deleteCategory = async (e) => {
        e.preventDefault();

        try {

            let userId = localStorage.getItem("user_id");
            if (!userId)
                return setCreationError("You are not logged in.");

            const response = await fetch(`${API_URL}/delete_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    editId,
                    name
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
        <>
            <button className="btn btn-primary d-flex align-items-center"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }} >
                New Category
                <i className="bi bi-plus-lg ms-2"></i>
            </button>

            <Modal show={showModal} backdrop="static" keyboard={false} centered >
                <form className='container p-5'>
                    <div className="d-flex justify-content-between">
                        <p className="text-body-secondary fs-3 fw-bold mb-5">
                            {
                                isEditMode
                                    ? "Edit Category"
                                    : "New Category"
                            }
                        </p>
                        <input type="color" className="form-control form-control-color" title="Choose your color" onChange={(e) => handleColorInput(e.target.value)}
                            value={rgbToHex(color_r, color_g, color_b)} />
                    </div>

                    <div className="row mb-3">
                        <div className="col form-floating">
                            <input type="text"
                                className={`form-control ${isValidName ? '' : 'is-invalid'}`}
                                id="categoryNameInput"
                                placeholder="Category Name"
                                maxLength={100}
                                value={name}
                                onChange={(e) => checkNameValid(e.target.value.trim())}
                            />
                            <label htmlFor="categoryNameInput" className='px-4'>Category Name</label>
                        </div>
                        <Dropdown className='col'>
                            <Dropdown.Toggle variant="light" className='text-start w-100 h-100'>
                                {allowed == null ? "Type Allowed" : allowed}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item active={allowed == "Deposit"} onClick={() => setAllowed("Deposit")} > Deposit </Dropdown.Item>
                                <Dropdown.Item active={allowed == "Expense"} onClick={() => setAllowed("Expense")} > Expense </Dropdown.Item>
                                <Dropdown.Item active={allowed == "Both"} onClick={() => setAllowed("Both")} > Both </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="form-floating mb-5">
                        <textarea className="form-control"
                            placeholder="Description..."
                            id="categoryDescriptionInput"
                            maxLength={255}
                            style={
                                {
                                    height: '100px',
                                    maxHeight: '250px'
                                }
                            }
                            value={description}
                            onChange={(e) => setDescription(e.target.value.trim())} >
                        </textarea>
                        <label htmlFor="categoryDescriptionInput">Description</label>
                    </div>

                    <div className="mb-3">
                        {
                            isEditMode
                                ? <button className="btn btn-primary fw-medium me-3" onClick={updateCategory} >Update</button>
                                : <button className="btn btn-primary fw-medium me-3" onClick={submitCreation} >Create</button>
                        }
                        {
                            isEditMode
                                ? <button className="btn btn-danger fw-medium me-3" onClick={deleteCategory} >Delete</button>
                                : ""
                        }
                        <button className="btn btn-outline-secondary fw-medium me-3" type="button" onClick={() => setShowModal(false)} >Cancel</button>
                    </div>

                    <p className="text-danger small fw-bold">
                        {creationError}
                    </p>
                </form>
            </Modal>
        </>
    );
}