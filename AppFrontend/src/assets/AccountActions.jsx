import { useNavigate } from "react-router-dom";

export function AccountActions( {account_id} ) {

    const navigate = useNavigate();

    return (

        <div className="options border-end overflow-y-auto pt-5" style={{ width: '300px', maxWidth: '500px' }}>
            <div className="main-btns d-flex flex-column w-100">
                <button className="btn btn-light border-bottom rounded-0 text-start px-4 py-3" onClick={() => navigate(`/account-dashboard/${account_id}`)}>
                    <i className="bi bi-bar-chart me-3"></i>
                    Dashboard
                </button>
                <button className="btn btn-light border-bottom rounded-0 text-start px-4 py-3">
                    <i className="bi bi-cash-coin me-3"></i>
                    Transactions
                </button>
            </div>
            <div className="accordion accordion-flush" id="opt-acordion">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            <i className="bi bi-piggy-bank me-3"></i>
                            Saving goals
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the first item’s accordion body.</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            <i className="bi bi-wallet2 me-3"></i>
                            Budgets
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the second item’s accordion body. Let’s imagine this being filled with some actual content.</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light px-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            <i className="bi bi-calendar-event me-3"></i>
                            Subscriptions
                        </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#opt-acordion">
                        <div className="accordion-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ipsum doloribus tempore ab obcaecati molestias vel distinctio temporibus porro quod dolorem libero mollitia id rem at fugit assumenda placeat corporis repellat rerum possimus cumque optio! Aliquid delectus suscipit aspernatur impedit sapiente voluptatum deserunt assumenda accusantium error beatae animi, hic aperiam laborum! Exercitationem magni fuga ea, culpa sint tempore quo quos totam cumque aspernatur, perspiciatis asperiores commodi? Omnis sapiente unde rem ut itaque corrupti quia odio, perferendis laborum? Dolor quis possimus maiores consectetur minus totam! Doloribus fuga facilis eum enim consectetur. Quasi delectus quae sapiente quia ullam sunt sed unde aliquid dolorum enim. Iure animi beatae nulla? Officiis recusandae repellat beatae aspernatur minus molestias est enim impedit adipisci libero perspiciatis dolore aliquid exercitationem quisquam in mollitia necessitatibus, cum quae obcaecati pariatur! Repellat sed ullam, minus reiciendis at sit reprehenderit praesentium dolorem, similique numquam omnis fugiat optio saepe repudiandae recusandae. Odit iure quia, saepe repellendus nihil commodi ab autem aliquam natus cupiditate, amet possimus voluptatem sequi. Reiciendis iste molestiae soluta deserunt nulla, porro ducimus modi minus. Rerum vel tempore harum ut animi, saepe voluptas quasi deserunt. Facere omnis deserunt recusandae odio aut dicta eos voluptatum natus totam, debitis ratione nulla, quasi deleniti distinctio soluta qui minus? Voluptates perspiciatis sequi corporis quam molestias laborum deleniti sunt recusandae ad animi ex earum, dolor consectetur laudantium libero facere placeat qui perferendis labore maiores? Culpa a odio eum inventore veritatis! Sint facilis ipsum ea mollitia similique nihil nam, ad odio non maxime sed vitae veniam perspiciatis voluptatem odit reprehenderit tempore at nulla! Sunt aut sapiente magnam atque dolorem nesciunt ipsam esse? Iure corporis quis quasi totam, suscipit aliquam nostrum dolor id deleniti eum facere veniam, maiores incidunt blanditiis? Eligendi quae quia aspernatur itaque quaerat obcaecati nam perferendis assumenda. Recusandae odio, quos qui nisi iusto asperiores reiciendis.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}