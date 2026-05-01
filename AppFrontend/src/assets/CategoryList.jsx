export function CategoryList({ label }) {
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