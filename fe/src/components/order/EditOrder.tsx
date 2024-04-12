import { orderType } from "../../../types/Order";
import { Modal } from "../common/Modal";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { object, string } from "yup";
import * as yup from "yup";
import { Message } from "../login/Message";
import { useAtom } from "jotai";
import { customerAtom } from "../../jotai/CustomerAtom";
import { productAtom } from "../../jotai/Product";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orderAtom } from "../../jotai/Order";

type Props = {
  orderItem?: orderType;
  isOpen: boolean;
  setIsOpen: Function;
};

export const EditOrder = ({ orderItem, isOpen, setIsOpen }: Props) => {
  const [customer, setCustomer] = useAtom(customerAtom);
  const [product, setProduct] = useAtom(productAtom);
  const [order,setOrder] = useAtom(orderAtom)
  const [selectedProducts, setSelectedProducts] = useState<
    string[] | undefined
  >([]);
  const [validationError, setValidationError] =
    useState<yup.ValidationError | null>(null);
  const authSchema = () => {
    return object({
      order_number: string().min(1).required(),
      comments: string().min(1).required(),
    });
  };
  useEffect(()=> {
    setSelectedProducts(()=>{
      return orderItem?.products?.map((product) => product.name)
    })
  },[orderItem])
  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const inputs = e.target.elements;
      let forValidation = {
        order_number: inputs.order_number?.value,
        comments: inputs.comments?.value,
        customer_id: inputs.customer_id?.value,
      };
      authSchema()
        .validate(forValidation)
        .then(async () => {
          const res = await fetch(
            `http://127.0.0.1:8000/orders/${orderItem?.id}/`,
            {
              method: "PUT",
              body: JSON.stringify({
                ...forValidation,
                products: selectedProducts,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) {
            let dataError = await res.json();
            setValidationError(dataError);
            return;
          }
          const data = await res.json();
          let newOrder = order;
          if(newOrder)
          for (let i = 0; i < newOrder?.length; i++){
               if(newOrder[i].id === data.id){
                newOrder[i] = data;
               }
          }
          setOrder(newOrder);
          if (data?.error) {
            return;
          }
          notify();
          setIsOpen(false);
        })
        .catch((error: yup.ValidationError) => {
          console.log(error);
          setValidationError(error);
          return;
        });
    } catch (error: any) {
      setValidationError(error);
    }
  };

  const handleProductSelect = (e: string) => {
    const selectedProductName = e;
    if (selectedProducts?.includes(selectedProductName)) {
      setSelectedProducts(
        selectedProducts.filter((p) => p !== selectedProductName)
      );
    } else {
      if (selectedProducts)
        setSelectedProducts([...selectedProducts, selectedProductName]);
    }
  };

  const notify = () => toast("Order updated successfully!");
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="w-[400px] h-[500px] bg-white flex justify-center ">
          <form
            className="text-foreground flex w-11/12 flex-col justify-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="order_number">
                Order Number
              </label>
              <section className="mb-6">
                <input
                  defaultValue={orderItem?.order_number}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                  name="order_number"
                  placeholder="202"
                  required
                />
              </section>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="comments">
                Comments
              </label>
              <section className="mb-6">
                <input
                  defaultValue={orderItem?.comments}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                  name="comments"
                  required
                  placeholder="call the customer again"
                />
              </section>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="customer_id">
                Customer Name
              </label>
              <section className="mb-6">
                <select
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 p-2"
                  name="customer_id"
                >
                  {customer?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c?.name}
                    </option>
                  ))}
                </select>
              </section>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="customer_id">
                Products
              </label>
              <section className="mb-1">
                <select
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 p-2"
                >
                  {product?.map((p) => (
                    <option key={p.id} value={p?.name}>
                      {p?.name}
                    </option>
                  ))}
                </select>
              </section>
              <div className="flex gap-2 mb-1">
                {selectedProducts?.map((productName, index) => (
                  <button
                    onClick={() => handleProductSelect(productName)}
                    className="bg-green-300 p-2 rounded-md flex items-center gap-2 w-fit"
                    key={index}
                  >
                    {productName}
                    <IoMdClose />
                  </button>
                ))}
              </div>
            </div>
            <Message validationError={validationError} />
            <button className="mb-2 rounded bg-gray-200 px-4 py-2">Save</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
