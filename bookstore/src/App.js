import { Switch, Route } from "react-router-dom/cjs/react-router-dom.min";
import { Component } from "react";
import BookshelfMinimal from "./components/Home/bookshelf-minimal";
import BookshelfModern from "./components/BookshelfModern/bookshelf-modern";
import AllBooks from "./components/AllBooks/allBooks";
import CartContext from "./context/cartContext";
import "./App.css";

class App extends Component {
  state = { cartList: [] };


  removeAllCartItems = () => {
    this.setState({ cartList: [] });
  };

  incrementCartItemQuantity = (isbn13) => {
    this.setState((prevState) => ({
      cartList: prevState.cartList.map((eachCartItem) => {
        if (isbn13 === eachCartItem.isbn13) {
          const updatedQuantity = eachCartItem.quantity + 1;
          return { ...eachCartItem, quantity: updatedQuantity };
        }
        return eachCartItem;
      }),
    }));
  };

  decrementCartItemQuantity = (isbn13) => {
    const { cartList } = this.state;
    const productObject = cartList.find(
      (eachCartItem) => eachCartItem.isbn13 === isbn13
    );
    if (productObject.quantity > 1) {
      this.setState((prevState) => ({
        cartList: prevState.cartList.map((eachCartItem) => {
          if (isbn13 === eachCartItem.isbn13) {
            const updatedQuantity = eachCartItem.quantity - 1;
            return { ...eachCartItem, quantity: updatedQuantity };
          }
          return eachCartItem;
        }),
      }));
    } else {
      this.removeCartItem(isbn13);
    }
  };

  removeCartItem = (isbn13) => {
    const { cartList } = this.state;
    const updatedCartList = cartList.filter(
      (eachCartItem) => eachCartItem.isbn13 !== isbn13
    );

    this.setState({ cartList: updatedCartList });
  };

  addCartItem = (product) => {
    const { cartList } = this.state;
    const productObject = cartList.find(
      (eachCartItem) => eachCartItem.isbn13 === product.isbn13
    );

    if (productObject) {
      this.setState((prevState) => ({
        cartList: prevState.cartList.map((eachCartItem) => {
          if (productObject.isbn13 === eachCartItem.isbn13) {
            const updatedQuantity = eachCartItem.quantity + product.quantity;

            return { ...eachCartItem, quantity: updatedQuantity };
          }

          return eachCartItem;
        }),
      }));
    } else {
      const updatedCartList = [...cartList, product];

      this.setState({ cartList: updatedCartList });
    }
  };

  render() {
    const { cartList } = this.state;

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Switch>
          <Route exact path="/bookshelf-minimal" component={BookshelfMinimal} />
          <Route exact path="/bookshelf-modern" component={BookshelfModern} />
          <Route exact path="/" component={BookshelfMinimal} />
          <Route exact path="/all-books" component={AllBooks} />
        </Switch>
      </CartContext.Provider>
    );
  }
}

export default App;
