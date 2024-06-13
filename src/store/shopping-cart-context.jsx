/************************************************************************************ 
Using React's Context API instead of Component Compositions to avoid Props Drilling
as Component Composition can lead to the <App> component BLOATED.
*************************************************************************************/

// Using "useReducer" hook to replace "useState" hook
import { createContext, useReducer } from "react";

import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  // We define the value here just for auto completion purpose in IDE only
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

/*****************************************************************************************
 The below Reducer function is defined outside of the component function
 "CartContextProvider" because it does not need to be re-executed when component
 is re-rendered and it will not access any props directly at all.
 The Reducer function always accepts 2 paramenters:
    1. state: which is guaranteed by React give value of the latest state snapshot
    2. action:
*****************************************************************************************/
function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // not needed here because we have only 1 state value
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state, // not really necessary here since we have only 1 value of state
      items: updatedItems,
    };
  }

  return state;
}

// We outsourced the logics for controlling state
// from the <App> component to the below function (Context Provider)
export default function CartContextProvider({ children }) {
  /*****************************************************************************************
   The useReducer hook below is for managing state instead of using useState hook.
   The useReducer() returns an array of 2 items: 'state', and 'dispatch' function.
   The dispatch() dispatches actions taken by the function which is the 1 of the 2
   parameters of the useReducer() hook, in this case "shoppingCartReducer".
   The 2nd parameter of the useReducer() is the initial state.
  *****************************************************************************************/
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  function handleAddItemToCart(id) {
    // Dispatching action that will be taken by Reducer function
    // The action is the parameter of the dispatch function.
    // The action param can be anything (text, object,...so on).
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    // Dispatching another action by Reducer function
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  // HERE IS THE REAL VALUE OF THE CONTEXT WE DEFINED AT THE TOP
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart, // Exposing a state-updating function through Context
    updateItemQuantity: handleUpdateCartItemQuantity, // Exposing a state-updating function through Context
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
