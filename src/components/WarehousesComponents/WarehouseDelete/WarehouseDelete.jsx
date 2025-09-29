import { useState } from "react";
import { CloseIcon } from "../../Iconography/Iconography.jsx";
import axios from "axios";
import "./WarehouseDelete.scss";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// need to pass a warehouse, need to pass the warehouse get function,
// and a switch/toggle from wherever this is used. switchPopup. If change name change SwitchPopup.

const WarehouseDelete = ({ warehousedata }) => {
  console.log(warehousedata);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const deleteSingleWarehouse = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/warehouses/${warehousedata.id}`
      );
      if (response.data.success) {
        console.log("Warehouse deleted successfully.");
        setSuccessMsg(
          `The ${warehousedata.name} warehouse was deleted successfully.`
        );
        warehousedata.fun(); // get warehouses again here.
      } else {
        console.error("Error deleting:", response.data.message);
        setErrorMsg(`Error deleting ${warehousedata.name}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(
        `Error deleting ${warehousedata.name}. Please try again later.`
      );
    }
  };

  const handleClosePopup = () => {
    setSuccessMsg("");
    setErrorMsg("");
    warehousedata.fun();
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
            Delete {`${warehousedata.name}`} warehouse?
          </h1>
          <p className="popup__details">
            Please confirm that you'd like to delete the
            {`${warehousedata.name}`} warehouse from the list of warehouses. You
            won't be able to undo this action.
          </p>
        </main>
        <footer className="popup__footer">
          <div className="popup__buttons">
            <button className="popup__btn" onClick={handleClosePopup}>
              <h4 className="popup__btn-text">Cancel</h4>
            </button>
            <button
              className="popup__btn--delete"
              onClick={deleteSingleWarehouse}
            >
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

export default WarehouseDelete;
