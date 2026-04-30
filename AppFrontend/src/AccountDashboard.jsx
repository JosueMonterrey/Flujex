import { HomeButton } from "./assets/HomeButton";
import { Navbar } from "./assets/Navbar";

export function AccountDashboard() {
    return (
        <div className="d-flex flex-column " style={{ height: '100vh' }}>
            <Navbar navbarContent={
                <HomeButton />
            } />
            <div>
                
            </div>
        </div>
    );
}