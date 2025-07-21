import { createContext } from "react";
import { products } from "../assets/assets";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const value = {
        products, currency

    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider >
    )
}

export default ShopContextProvider;