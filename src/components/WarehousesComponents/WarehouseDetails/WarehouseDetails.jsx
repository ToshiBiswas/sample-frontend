import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";

import "./WarehouseDetails.scss";
import WarehouseInventoryList from "../WarehouseInventoryList/WarehouseInventoryList";
import InventoryItemDelete from "../../InventoriesComponents/InventoryItemDelete/InventoryItemDelete";

const backendUrl = import.meta.env.VITE_API_URL;

function WarehouseDetails() {
  const [warehouse, setWarehouse] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [deleteObj, setDeleteObj] = useState(null);

  const { id } = useParams();
  const location = useLocation();

  let fetchWarehouse = async function () {
    try {
      const response = await axios.get(`${backendUrl}/warehouses/${id}`);
      setWarehouse(response.data);
    } catch (err) {
      console.log("could not find warehouse", err.message);
    }
  };

  let fetchWarehouseInventory = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/warehouses/${id}/inventories`
      );
      console.log(response.data);
      setInventory(response.data);
    } catch (err) {
      console.log(
        "could not retrieve inventory for this warehouse",
        err.message
      );
      setInventory([]);
    }
  };

  useEffect(() => {
    fetchWarehouse();
    fetchWarehouseInventory();
  }, []);

  useEffect(() => {
    fetchWarehouse();
    fetchWarehouseInventory();
  }, [deleteObj, id, location.key]);

  if (!warehouse) {
    return <h1>Loading warehouse...</h1>;
  }

  return (
    <div className="warehouse-details">
      <div className="warehouse-details__header">
        <div className="warehouse-details__header-title">
          <Link to="/">
            <img src="/src/assets/icons/arrow_back-24px.svg" alt="Back arrow" />
          </Link>
          <h1>{warehouse.warehouse_name}</h1>
        </div>
        <Link
          className="warehouse-details__header-edit"
          to={`/warehouses/${id}/edit`}
        >
          <img
            src="/src/assets/icons/edit-white-24px.svg"
            alt="edit pencil image"
          />
          <span className="edit-text">Edit</span>
        </Link>
      </div>
      <div className="warehouse-details__information">
        <div className="warehouse-details__information-address">
          <h4>Warehouse Address:</h4>
          <p>
            {warehouse.address}, {warehouse.city}, {warehouse.country}
          </p>
        </div>
        <div className="warehouse-details__information-contact">
          <div className="warehouse-details__information-contact-name">
            <h4>Contact Name:</h4>
            <p>{warehouse.contact_name}</p>
            <p>{warehouse.contact_position}</p>
          </div>
          <div className="warehouse-details__information-contact-info">
            <h4>Contact Information:</h4>
            <p>{warehouse.contact_phone}</p>
            <p>{warehouse.contact_email}</p>
          </div>
        </div>
      </div>
      {/*Here pass in the info for the warehouse get request */}
      {inventory && inventory.length > 0 ? (
        <>
          <WarehouseInventoryList
            inventory={inventory}
            id={id}
            setDeleteObj={setDeleteObj}
          />
          {deleteObj && <InventoryItemDelete itemdata={deleteObj} />}
        </>
      ) : (
        <div className="no-inventory-message">
          There are no inventories yet. Add a new item above!
        </div>
      )}
    </div>
  );
}

export default WarehouseDetails;
