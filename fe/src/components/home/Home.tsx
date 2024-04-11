import { useAtom } from "jotai";
import { userAtom } from "../../jotai/UserAtom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "../addRows/Add";
import { OrdersList } from "../order/OrdersList";
import { EditProducts } from "../product/EditProducts";
import { EditCustomer } from "../customer/EditCustomer";

type Props = {

};

export const Home = (props: Props) => {
    const [user,setUser] = useAtom(userAtom)
    const nav = useNavigate();
  return (
    <div className="flex justify-center items-center h-full w-full">
    {user? 
    <div className="w-11/12 h-full flex flex-col gap-20">
      <Add/>
      <OrdersList/>
      <EditProducts/>
      <EditCustomer/>
    </div>:
     <div className="bg-gray-400 min-h-screen w-full flex justify-center items-center">
     <button className="border w-fit p-4 text-4xl h-fit rounded-md border-black hover:bg-black hover:text-white duration-300" onClick={()=>nav('/login/')}>Login</button>
   </div>
    }
    </div>
  );
};
