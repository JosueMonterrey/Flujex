import { useState } from "react";


export function SearchBar({ placeholder, onSearch }) {

    const [search, setSearch] = useState("");

    const submitSearch = (e) => {
        e.preventDefault();

        if (search.length > 0)
            onSearch(search);
    };

    return (
        <form onSubmit={submitSearch} >
            <div className="input-group">
                <input type="text"
                    name="searchBar"
                    className="form-control border-secondary"
                    placeholder={placeholder}
                    onChange={ (e) => setSearch(e.target.value.trim()) }
                    />

                <button className="btn btn-outline-secondary" type="submit" >
                    <i className="bi bi-search"></i>
                </button>
            </div>
        </form>
    );
}