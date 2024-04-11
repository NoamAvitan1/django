export type orderType = {
    id: number;
    order_number: string;
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    date: string; 
    comments: string;
    last_update_date: string; 
    creation_date: string; 
    products: {
        id: number;
        name: string;
        price: string; 
        type: string;
    }[];
};