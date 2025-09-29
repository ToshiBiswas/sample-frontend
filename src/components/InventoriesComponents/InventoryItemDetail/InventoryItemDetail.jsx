import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import "./InventoryItemDetail.scss";

const backendUrl = import.meta.env.VITE_API_URL;

function InventoryItemDetail() {
  const [item, setItem] = useState(null);
  const [warehouseInfo, setWarehouseInfo] = useState(null);

  const { id } = useParams();

  const fetchItem = async () => {
    try {
      const response = await axios.get(`${backendUrl}/inventories/${id}`);
      setItem(response.data);

      if (response.data.warehouse_id) {
        fetchWarehouseDetails(response.data.warehouse_id);
      }
    } catch (err) {
      console.log(`Could not retrieve item, ${err.message}`);
    }
  };

  const fetchWarehouseDetails = async (warehouseId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/warehouses/${warehouseId}`
      );
      setWarehouseInfo(response.data);
    } catch (err) {
      console.log(`Could not retrieve warehouse details, ${err.message}`);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  if (!item) {
    return <h1>Fetching item...</h1>;
  }

  return (
    <div className="item-details">
      <div className="warehouse-details__header">
        <div className="warehouse-details__header-title">
          <Link to="/inventories">
            <img src="/src/assets/icons/arrow_back-24px.svg" alt="Back arrow" />
          </Link>
          <h1>{item.item_name}</h1>
        </div>
        <Link
          className="warehouse-details__header-edit"
          to={`/inventories/${id}/edit`}
        >
          <img
            src="/src/assets/icons/edit-white-24px.svg"
            alt="edit pencil image"
          />
          <span className="edit-text">Edit</span>
        </Link>
      </div>
      <div className="warehouse-details__information">
        <div className="warehouse-details__information__description">
          <h4>Item Description</h4>
          <p> {item.description}</p>
          <h4>Category</h4>
          <p> {item.category}</p>
        </div>
        <div className="warehouse-details__information_moreInformation">
          <div className="status-quantity-container">
            <div className="status-container">
              <h4>Status</h4>
              <p
                className={
                  item.status === "In Stock" ? "in-stock" : "out-of-stock"
                }
              >
                {item.status}
              </p>
            </div>
            <div className="quantity-container">
              <h4>Quantity</h4>
              <p>{item.quantity}</p>
            </div>
          </div>
          <div className="warehouse-container">
            <h4>Warehouse</h4>
            <p>
              {warehouseInfo ? warehouseInfo.warehouse_name : item.warehouse}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryItemDetail;
