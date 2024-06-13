import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import Product from "./components/Product.jsx";
import CartContextProvider from "./store/shopping-cart-context.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";

// Using React's Context API instead of Component Compositions
// to solve issue with Props Drilling
import { CartContext } from "./store/shopping-cart-context.jsx";

function App() {
  return (
    <CartContextProvider>
      <Header />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))}
      </Shop>
    </CartContextProvider>
  );
}

export default App;
