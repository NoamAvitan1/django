import { useAtom } from "jotai";
import { productAtom } from "../../jotai/Product";
import { customerAtom } from "../../jotai/CustomerAtom";

type Props = {};

export const EditCustomer = (props: Props) => {
  const [customer, setCustomer] = useAtom(customerAtom);
  return (
    <div>
      <h1 className="text-2xl">Customers</h1>
      <table className="table-auto w-1/3">
        <thead>
          <tr>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {customer?.map((c) => (
            <tr key={c.id}>
              <td className="border px-2 py-4">{c.name}</td>
              <td className="border px-2 py-4">{c.email}</td>
              <td className="border px-2 py-4">{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
