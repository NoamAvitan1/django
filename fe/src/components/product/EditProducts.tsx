import { useAtom } from "jotai";
import { productAtom } from "../../jotai/Product";

type Props = {};

export const EditProducts = (props: Props) => {
  const [product, setProduct] = useAtom(productAtom);
  return (
    <div>
      <h1 className="text-2xl">Products</h1>
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
              <td className="border px-2 py-4">{p.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
