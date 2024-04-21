import { useAtom } from "jotai";
import { customerAtom } from "../../jotai/CustomerAtom";
import { useState } from "react";
import { Modal } from "../common/Modal";
import { orderType } from "../../../types/Order";

interface CurrentCustomerType{
  total_sales:number;
  orders:orderType[];
}

type Props = {};

export const CustomersList = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useAtom(customerAtom);
  const [currentCustomer, setCurrentCustomer] = useState<CurrentCustomerType>();
  
  const func = async(id:number) => {
      const res = await fetch(`http://127.0.0.1:8000/total-sales/${id}/`,{
          headers:{
            'Content-Type': 'application/json',
          }
      })
      const data = await res.json();
      console.log(data);
      setCurrentCustomer(data)
    setIsOpen(true);
  };
  return (
    <div>
      <h1 className="text-2xl ">Customers</h1>
      <table className="table-auto w-1/3">
        <thead>
          <tr>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2">Phone</th>
            <th className="px-2 py-2">Summary</th>
          </tr>
        </thead>
        <tbody>
          {customer?.map((c) => (
            <tr key={c.id}>
              <td    
                className="border px-2 py-4"
              >
                {c.name}
              </td>
              <td className="border px-2 py-4">{c.email}</td>
              <td className="border px-2 py-4">{c.phone}</td>
              <td onClick={() => func(c.id)} className="border cursor-pointer px-2 py-4 whitespace-nowrap">Click to view</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="w-[600px] h-[500px] bg-white flex flex-col items-center ">
          <h1>Summary of customer</h1>
             <table className="table-auto w-full p-10">
        <thead>
          <tr>
            <th className="px-2 py-2">Date</th>
            <th className="px-2 py-2">Order Number</th>
            <th className="px-2 py-2">Customer Name</th>
            <th className="px-2 py-2">Comments</th>
            <th className="px-2 py-2">Products</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomer?.orders?.map((o:orderType) => (
            <tr key={o.id}>
              <td className="border px-2 py-4 whitespace-nowrap">{o.date}</td>
              <td className="border px-2 py-4">{o.order_number}</td>
              <td className="border px-2 py-4">{o.customer.name}</td>
              <td className="border px-2 py-4">{o.comments}</td>
              <td className="border border-r-0 px-2 py-4">
                {o.products.length > 0
                  ? o.products.map((p) => p.name).join(", ")
                  : "No products"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-8"> Total Price: {currentCustomer?.total_sales}</p>
        </div>
      </Modal>
    </div>
  );
};
