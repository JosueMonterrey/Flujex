import { Navbar } from './Navbar';
import { PasswordInput } from './PasswordInput';

export function Home() {
    return (
        <>
        <Navbar navbarContent={
            <p className='text-body-secondary fw-bold small'>
                Welcome to
                <span className='text-primary'> Flujex</span>
            </p>
        } />
        </>
    );
}