import { Navbar } from './Navbar';
import { NewAccount } from './NewAccount';
import { SearchBar } from './SearchBar';

export function Home() {

    return (
        <>
        <Navbar navbarContent={
            <>
                <SearchBar placeholder="Search accounts" onSearch={(s) => console.log(s)} />
                <NewAccount />
            </>
        } />
        </>
    );
}