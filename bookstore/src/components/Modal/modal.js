import { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import Loader from "react-loader-spinner";
import "./modal.css";
import "bootstrap/dist/css/bootstrap.min.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Modal = (props) => {
  const { bookId } = props;
  const [addToCard, setAddToCard] = useState(false);
  const [count, setCount] = useState(1);
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  });
  const onAddCard = () => {
    setAddToCard(true);
  };

  const onDelete = () => {
    if (count === 1) {
      setAddToCard(false);
    }
  };

  const Counter = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const getBooks = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      });

      const url = `http://localhost:8080/${bookId}`;
      const options = {
        method: "GET",
      };

      const response = await fetch(url, options);
      const responseData = await response.json();
      if (response.ok) {
        setApiResponse((prevApiDetails) => ({
          ...prevApiDetails,
          status: apiStatusConstants.success,
          data: responseData,
        }));
      } else {
        setApiResponse((prevApiDetails) => ({
          ...prevApiDetails,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }));
      }
    };

    getBooks();
  }, []);

  const renderFailureView = () => {
    const { errorMsg } = apiResponse;
    return <div>{errorMsg}</div>;
  };

  const renderSuccessView = () => {
    const { data } = apiResponse;
    console.log(data.data[0]);
    const updatedData = {
      description: data.data[0].desc,
      image: data.data[0].image,
      isbn13: data.data[0].isbn13,
      price: data.data[0].price,
      rating: data.data[0].rating,
      subtitle: data.data[0].subtitle,
      title: data.data[0].title,
      url: data.data[0].url,
      discount: data.data[0].discount,
    };

    return (
      <>
        <div className="row modal-wrapper-bottom">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <img
              src={updatedData.image}
              alt={updatedData.title}
              className="img-fluid w-80"
            />
          </div>
          <div className="col-lg-6">
            <div className="row">
              <p>{updatedData.description}</p>
              <ul className="description-details">
                <li>
                  <p>
                    <span>Description</span>: {updatedData.subtitle}
                  </p>
                </li>
                <li>
                  <p>
                    <span>isbn13</span> : {updatedData.isbn13}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Rating</span> : {updatedData.rating}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Price</span> : ${updatedData.price}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Discoun Price</span>: $
                    {Math.ceil(Number(updatedData.price) -
                      Number(updatedData.discount) / 100)}
                  </p>
                </li>
              </ul>
              {addToCard ? (
                <div className="calculations">
                  <div className="calculations-btn">
                    <button type="button">
                      {count === 1 ? (
                        <span onClick={onDelete}>
                          <MdDeleteOutline />
                        </span>
                      ) : (
                        <span onClick={() => setCount(count - 1)}>
                          <FiMinus />
                        </span>
                      )}
                    </button>
                    <span>{count}</span>
                    <button type="button" onClick={Counter}>
                      <span>
                        <IoIosAdd />
                      </span>
                    </button>
                  </div>
                  <span>{updatedData.price * count}</span>
                </div>
              ) : (
                <button className="add-to-carts-btn btns-primary">
                  <span onClick={onAddCard}>
                    <MdOutlineShoppingCart />
                    Add to cart
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderLoaderView = () => {
    return (
      <div className="loader-container">
        <Loader type="Oval" color="#943E3E" height="50" width="50" />
      </div>
    );
  };

  const renderModal = () => {
    const { status } = apiResponse;

    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoaderView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
};

export default Modal;
