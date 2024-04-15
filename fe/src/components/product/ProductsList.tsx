import { useAtom } from "jotai";
import { productAtom } from "../../jotai/Product";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { productType } from "../../../types/Product";
import { useState } from "react";
import { EditProduct } from "./EditProduct";

type Props = {};

export const ProductsList = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useAtom(productAtom);
  const [choosedProduct, setChoosedProduct] = useState<productType>();
  const updateChoosedProduct = (p: productType) => {
    setChoosedProduct(p);
    setIsOpen(true);
  };
  const deleteProduct = async (_id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/product/${_id}/`, {
      method: "DELETE",
      body: JSON.stringify(_id),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedProduct = product?.filter((p) => p.id !== _id);
    if (updatedProduct) setProduct(updatedProduct);
  };
  return (
    <div>
      <h1 className="text-2xl ">Products</h1>
      <table className="table-auto w-1/3">
        <thead>
          <tr>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Price</th>
            <th className="px-2 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {product?.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-4">{p.name}</td>
              <td className="border px-2 py-4">{p.price}</td>
              <td className="border px-2 py-4 border-r-0">{p.type}</td>
              <td>
                <button onClick={() => deleteProduct(p.id)}>
                  <MdOutlineDelete className="text-red-500" />
                </button>
                <button onClick={() => updateChoosedProduct(p)}>
                  <MdOutlineEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditProduct
        productItem={choosedProduct}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};
