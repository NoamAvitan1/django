import { BaseSyntheticEvent, useState } from "react";
import { object, string } from "yup";
import * as yup from "yup";
import { Message } from "../login/Message";
import { ToastContainer, toast } from "react-toastify";
import { productType } from "../../../types/Product";
import { Modal } from "../common/Modal";
import { useAtom } from "jotai";
import { productAtom } from "../../jotai/Product";
type Props = {
  productItem?: productType;
  isOpen: boolean;
  setIsOpen: Function;
};

export const EditProduct = ({ productItem, isOpen, setIsOpen }: Props) => {
  const [product,setProduct] = useAtom(productAtom);
  const [validationError, setValidationError] =
    useState<yup.ValidationError | null>(null);
  const authSchema = () => {
    return object({
      type: string().min(2).required(),
      name: string().min(3).required(),
      price: string().min(1),
    });
  };
  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const inputs = e.target.elements;
      let forValidation = {
        name: inputs.name?.value,
        type: inputs.type?.value,
        price: inputs.price?.value,
      };
      authSchema()
        .validate(forValidation)
        .then(async () => {
          const res = await fetch(
            `http://127.0.0.1:8000/product/${productItem?.id}/`,
            {
              method: "PUT",
              body: JSON.stringify(forValidation),
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
          let newProduct = product;
          if(newProduct)
          for (let i = 0; i < newProduct?.length; i++) {
            if (newProduct[i].id === data.id) {
              newProduct[i] = data;
            }
          }
          setProduct(newProduct);
          console.log(data);
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
  const notify = () => toast("Product updated successfully!");

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="w-[400px] h-[450px] bg-white flex justify-center ">
        <form
          className="text-foreground flex w-11/12 flex-col justify-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex flex-col gap-1">
            <label className="text-md" htmlFor="name">
              Name
            </label>
            <section className="mb-6">
              <input
                defaultValue={productItem?.name}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                name="name"
                placeholder="Mary Popins"
                required
              />
            </section>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md" htmlFor="type">
              Type
            </label>
            <section className="mb-6">
              <input
                defaultValue={productItem?.type}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                name="type"
                required
                placeholder="flour"
              />
            </section>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md" htmlFor="price">
              Price
            </label>
            <section className="mb-6">
              <input
                defaultValue={productItem?.price}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                name="price"
                required
                placeholder="30"
              />
            </section>
          </div>
          <Message validationError={validationError} />
          <button className="mb-2 rounded bg-gray-200 px-4 py-2">Save</button>
        </form>
      </div>
    </Modal>
  );
};
