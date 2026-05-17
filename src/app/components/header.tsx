import Link from "next/link";

export const Header = () => {
    return ( 
    <nav>
        <Link href=''>
            Страница 1
        </Link>
        <Link href=''>
            Страница 2
        </Link>
        <Link href=''>
            Страница 3
        </Link>
    </nav> 
    );
}