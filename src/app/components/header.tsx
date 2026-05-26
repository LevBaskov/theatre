import Link from "next/link";

export const Header = () => {
    return ( 
    <div>
        <h1>
            <Link href="/">
                Театр Сатиры  
            </Link>
        </h1>
        <nav>
            <Link href='/'>
                О театре
            </Link>
            <Link href='/profile/123'>
                Тест профиля
            </Link>
            <Link href='/auth' >
                Регистрация
            </Link>
        </nav> 
    </div>
    
    );
}