import { useEffect } from "react";
import { useParams } from "react-router-dom";

type Props = {

};

export const SummaryCustomer = (props: Props) => {
    const {id} = useParams();
    useEffect(() => {
        const getData = async() => {
            const res = await fetch(`http://127.0.0.1:8000/total-sales/${id}`,{
                    headers:{
                        'Content-Type': 'application/json',
                      }
            })
            const data = await res.json();
            console.log(data);
        }
        getData();
    },[])
  return (
    <div>

    </div>
  );
};
