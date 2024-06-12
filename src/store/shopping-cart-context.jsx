/************************************************************************************ 
Using React's Context API instead of Component Compositions to avoid Props Drilling
as Component Composition can lead to the <App> component BLOATED.
*************************************************************************************/
import { createContext } from "react";

export const CartContext = createContext({
  items: [],
});
