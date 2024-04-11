import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { customerAtom } from "../../jotai/CustomerAtom";
import { orderAtom } from "../../jotai/Order";
import { productAtom } from "../../jotai/Product";
import { IoMdAdd } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "../common/Modal";
import { OrderForm } from "../order/OrderForm";
import { ProductForm } from "../product/ProductForm";
import { CustomerForm } from "../customer/CustomerForm";

type Props = {};

export const Add = (props: Props) => {
  const [customer, setCustomer] = useAtom(customerAtom);
  const [product, setProduct] = useAtom(productAtom);
  const [order, setOrder] = useAtom(orderAtom);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<"order" | "customer" | "product">();
  const getData = async () => {
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      fetch("http://127.0.0.1:8000/orders/"),
      fetch("http://127.0.0.1:8000/customers/"),
      fetch("http://127.0.0.1:8000/products/"),
    ]);
    const ordersData = await ordersRes.json();
    const customersData = await customersRes.json();
    const productsData = await productsRes.json();
    setOrder(ordersData.results);
    setCustomer(customersData.results);
    setProduct(productsData.results);
  };
  useEffect(() => {
    getData();
  }, []);

  const notify = () => toast("Add customer and product first!");
  return (
    <div className="flex gap-10 mt-10">
      <button
        onClick={() => {
          if (!customer || !product) notify();
          else {
            setIsOpen(true);
            setType("order");
          }
        }}
        className={`flex items-center p-2 w-36 justify-center ${
          product && customer !== null ? "bg-green-400" : "bg-gray-400"
        }`}
      >
        Add order{<IoMdAdd />}
      </button>
      <button
        onClick={() => {
          setIsOpen(true), setType("product");
        }}
        className={`flex items-center p-2 w-36 justify-center bg-green-400`}
      >
       Add Product{<IoMdAdd />}
      </button>
      <button
        onClick={() => {
          setIsOpen(true), setType("customer");
        }}
        className={`flex items-center p-2 w-36 justify-center bg-green-400`}
      >
        Add Customer {<IoMdAdd />}
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {type === "customer" && <CustomerForm getData={getData} setIsOpen={setIsOpen}/>}
        {type === "product" && <ProductForm getData={getData} setIsOpen={setIsOpen}/>}
        {type === "order" && <OrderForm getData={getData} setIsOpen={setIsOpen}/>}
      </Modal>
      <ToastContainer />
    </div>
  );
};
