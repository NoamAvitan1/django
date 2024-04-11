import { useAtom } from "jotai";
import { Outlet, useNavigate } from "react-router-dom";
import { userAtom } from "../../jotai/UserAtom";

type Props = {

};

export const Header = (props: Props) => {
  const [user] = useAtom(userAtom)
  const nav = useNavigate();
  return (
    <div className="">
      <header className="flex justify-between items-center border-b-2 border-black p-2">
        <img onClick={()=>nav('/')} className='cursor-pointer' src="https://fabios.io/wp-content/uploads/2022/06/logo.png" alt="" />
        {user ? 
        <h1 className="text-2xl border-gray-500 border p-2 rounded-md">{user?.username}</h1>
      : <div className="flex flex-col items-center">
      <h1 className="text-2xl">Order</h1>
      <h1 className="text-3xl">System</h1>
    </div>}
       
      </header>
        <main className="">
            <Outlet/>
        </main>
    </div>
  );
};
