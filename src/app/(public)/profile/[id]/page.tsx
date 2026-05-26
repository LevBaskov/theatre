import Image from 'next/image'
type Props = 
{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductPage({ params }: Props) 
{
  const { id } = await params; 
  return (
    <div>
      <Image src="/test.ico" width={100} height={100} alt="Picture of the author"/>
      <h1>
        Пользователь номер: {id}
      </h1>
      <p>
        Твой логин
      </p>
    </div>
  )
}