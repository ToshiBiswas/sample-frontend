import { useState } from "react";
import { CloseIcon } from "../../Iconography/Iconography.jsx";
import axios from "axios";
import "./InventoryItemDelete.scss";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const InventoryItemDelete = ({ itemdata }) => {
  console.log(itemdata);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const deleteSingleItem = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/inventories/${itemdata.id}`
      );
      if (response.data.success) {
        console.log("Item deleted successfully.");
        setSuccessMsg(`The ${itemdata.name} was deleted successfully.`);
        itemdata.fun();
      } else {
        console.error("Error deleting:", response.data.message);
        setErrorMsg(`Error deleting ${itemdata.name}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(`Error deleting ${itemdata.name}. Please try again later.`);
    }
  };

  const handleClosePopup = () => {
    setSuccessMsg("");
    setErrorMsg("");
    itemdata.fun();
  };

  return (
    <>
      <div className="popup-overlay" onClick={handleClosePopup}></div>
      <div className={`popup popup--open`}>
        <div className="popup__header">
          <button className="popup__close" onClick={handleClosePopup}>
            <CloseIcon className="popup__close-icon" />
          </button>
        </div>
        <main className="popup__main">
          <h1 className="popup__heading">
            Delete {`${itemdata.name}`} inventory item?
          </h1>
          <p className="popup__details">
            Please confirm that you'd like to delete the
            {`${itemdata.name}`} from the inventory list. You won't be able to
            undo this action.
          </p>
        </main>
        <footer className="popup__footer">
          <div className="popup__buttons">
            <button className="popup__btn" onClick={handleClosePopup}>
              <h4 className="popup__btn-text">Cancel</h4>
            </button>
            <button className="popup__btn--delete" onClick={deleteSingleItem}>
              <h4 className="popup__btn-text">Delete</h4>
            </button>
          </div>
          {successMsg && <p className="popup__message">{successMsg}</p>}
          {errorMsg && <p className="popup__message--error">{errorMsg}</p>}
        </footer>
      </div>
    </>
  );
};

export default InventoryItemDelete;
