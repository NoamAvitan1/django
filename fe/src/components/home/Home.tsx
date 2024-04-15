import { useAtom } from "jotai";
import { userAtom } from "../../jotai/UserAtom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "../addRows/Add";
import { OrdersList } from "../order/OrdersList";
import { ProductsList } from "../product/ProductsList";
import { CustomersList } from "../customer/CustomersList";

type Props = {

};

export const Home = (props: Props) => {
  const [orderPagination,setOrderPagination] = useState<number>(10)
  const [customerPagination,setCustomerPagination] = useState<number>(10)
  const [productPagination,setProductPagination] = useState<number>(10)
    const [user,setUser] = useAtom(userAtom)
    const nav = useNavigate();
  return (
    <div className="flex justify-center items-center h-full w-full">
    {user? 
    <div className="w-11/12 h-full flex flex-col gap-20">
      <Add orderPagination={orderPagination} customerPagination={customerPagination} productPagination={productPagination} />
      <OrdersList/>
      <div className="flex justify-center items-center">
      <button onClick={() =>setOrderPagination((prev) => prev + 10)} className="text-2xl bg-slate-600 p-2 text-white rounded-sm">Load more Orders</button>
      </div>
      <ProductsList/>
      <div className="flex justify-center items-center">
      <button onClick={() =>setProductPagination((prev) => prev + 10)} className="text-2xl bg-slate-600 p-2 text-white rounded-sm">Load more Products</button>
      </div>
      <CustomersList/>
      <div className="flex justify-center items-center">
      <button onClick={() =>setCustomerPagination((prev) => prev + 10)} className="text-2xl bg-slate-600 p-2 text-white rounded-sm">Load more Customers</button>
      </div>
    </div>:
     <div className="bg-gray-400 min-h-screen w-full flex justify-center items-center">
     <button className="border w-fit p-4 text-4xl h-fit rounded-md border-black hover:bg-black hover:text-white duration-300" onClick={()=>nav('/login/')}>Login</button>
   </div>
    }
    </div>
  );
};
