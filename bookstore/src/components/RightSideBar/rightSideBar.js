import { IoMdClose } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import "./rightSideBar.css";
import CartContext from "../../context/cartContext";

const RightSideBar = (props) => (
  <CartContext.Consumer>
    {(value) => {
      const { cartList } = value;
      console.log(cartList);

      const drawerClass = props.show ? "cart-drawer open" : "cart-drawer ";
      return (
        <nav className={drawerClass}>
          <div className="cart">
            <div className="row">
              <div className="section-title-center text-center">
                <div className="closer">
                  <span>
                    <IoMdClose onClick={props.click} />
                  </span>
                </div>
                <h3>Your cart item</h3>
                <div className="section-divider divider-triangle"></div>
              </div>
            </div>
          </div>
        </nav>
      );
    }}
  </CartContext.Consumer>
);

export default RightSideBar;
