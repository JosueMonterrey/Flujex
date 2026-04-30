import { useNavigate } from 'react-router-dom';

export function AccountCard( {id, name, balance, description, currencySymbol} ) {

    const navigate = useNavigate();

    let maxDescriptionLength = 100;
    return (
        <div className="bg-light border rounded px-4 pt-3 shadow-sm m-4"
            style={{
                width: '400px',
                maxWidth: '100%',
                cursor: 'pointer'
            }}
            onClick={() => navigate(`/account-dashboard/${id}`)} >

            <p className="fs-5 fw-bold text-body-secondary mb-3"> {name} </p>

            <p className="fs-4 fw-bold">
                <span className="text-success">{currencySymbol} </span>
                {balance}
            </p>

            <p className="fw-light small text-body-secondary">
                {
                    (description.length >= maxDescriptionLength)
                        ? description.substring(0, maxDescriptionLength + 1) + "..."
                        : description
                }
            </p>

        </div>
    );
}