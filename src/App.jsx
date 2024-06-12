import { useState } from "react";

import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import Product from "./components/Product.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";

// Using React's Context API instead of Component Compositions
// to solve issue with Props Drilling
import { CartContext } from "./store/shopping-cart-context.jsx";

function App() {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  });

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart, // Exposing a state-updating function through Context
  };

  return (
    // Use Provider property of the 'CartContext' to wrap all the components that
    // need to access state that is stored in the context.
    // Note: The default 'value' is set only for component that was not wrapped by
    //       the <Provider> component and that tries to access the context value
    <CartContext.Provider value={ctxValue}>
      <Header
        cart={shoppingCart}
        onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
      />
      {/* Moved <Product> up to be wrapped by <Shop> in the <App>.
          This way, we can reduce 1 layer of drilling props. Thus, we can
          pass pointer of the function 'handleAddItemToCart' directly from
          the <App> component to the <Product> and bypass the <Shop>.
          This technique is called 'COMPONENT COMPOSITIONS'.
          However, the downsize of this solution is that the <App> component
          can be BLOATED with too many Component Compositions when we keep
          moving components up to be wrapped inside of the <App>. 
      */}
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
        ))}
      </Shop>
    </CartContext.Provider>
  );
}

export default App;
