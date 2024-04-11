import { BaseSyntheticEvent, useState } from "react";
import { object, string } from "yup";
import * as yup from "yup";
import { Message } from "../login/Message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
setIsOpen: Function;
getData: Function;
};

export const ProductForm = ({setIsOpen, getData} : Props) => {
    const [validationError, setValidationError] =
    useState<yup.ValidationError | null>(null)
    const authSchema = () => {
        return object({
            type: string().min(2).required(),
            name : string().min(3).required(),
            price : string().min(1)
        })
    }
    const handleSubmit = (e: BaseSyntheticEvent) =>{
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
                const res = await fetch("http://127.0.0.1:8000/product/create",{
                  method: 'POST',
                  body: JSON.stringify(forValidation),
                  headers:{
                    'Content-Type': 'application/json',
                  }
                });
                if (!res.ok) {
                  let dataError = await res.json();
                  setValidationError(dataError)
                  return;
                }
                const data = await res.json();
                if (data?.error) {
                  return
                }
                notify()
                setIsOpen(false)
              })
              .catch((error: yup.ValidationError) => {
                console.log(error);
                setValidationError(error);
                return
              });
          } catch (error: any) {
            setValidationError(error);
          }
    }
    const notify = () => toast("Product added successfully!");

  return (
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
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                name="price"
                required
                placeholder="30"
                        />
                      </section>
              </div>
          <Message validationError={validationError} />
          <button className="mb-2 rounded bg-gray-200 px-4 py-2">
              Add
          </button>
        </form>
    </div>
  );
};
