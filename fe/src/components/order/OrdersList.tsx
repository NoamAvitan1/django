import { useAtom } from "jotai";
import { orderAtom } from "../../jotai/Order";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { useState } from "react";
import { EditOrder } from "./EditOrder";

type Props = {};

export const OrdersList = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useAtom(orderAtom);
  const deleteOrder = async (_id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/orders/${_id}/`, {
      method: "DELETE",
      body: JSON.stringify(_id),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedOrder = order?.filter((o) => o.id !== _id);
    console.log(updatedOrder);
    if (updatedOrder) setOrder(updatedOrder);
  };
  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl">Orders</h1>
      <table className="table-auto w-full">
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
          {order?.map((o) => (
            <tr key={o.id}>
              <td className="border px-2 py-4">{o.date}</td>
              <td className="border px-2 py-4">{o.order_number}</td>
              <td className="border px-2 py-4">{o.customer.name}</td>
              <td className="border px-2 py-4">{o.comments}</td>
              <td className="border border-r-0 px-2 py-4">
                {o.products.length > 0
                  ? o.products.map((p) => p.name).join(", ")
                  : "No products"}
              </td>
              <td>
                <button onClick={() => deleteOrder(o.id)}>
                  <MdOutlineDelete className="text-red-500" />
                </button>
                <button onClick={() => setIsOpen(true)}>
                  <MdOutlineEdit />
                </button>
                <EditOrder
                  orderItem={o}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
