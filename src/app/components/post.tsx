import Image from "next/image";
const post = () => {
    return ( 
    <div>
        <Image src="/test.ico" width={100} height={100} alt="Превью спектакля"/>
        <h1>
            Заголовок
        </h1>
        <p>
            Текст
        </p>
    </div> 
    );
}
 
export default post;