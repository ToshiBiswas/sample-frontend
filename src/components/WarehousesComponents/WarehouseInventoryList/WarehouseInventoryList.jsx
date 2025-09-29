import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DeleteOutlineIcon } from "../../Iconography/Iconography";
import "./WarehouseInventoryList.scss";

function WarehouseInventoryList({ inventory, id, setDeleteObj }) {
  const cancelDelete = () => {
    setDeleteObj(null);
  };

  // State for sorting
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedInventory, setSortedInventory] = useState([...inventory]);

  // When the inventory prop changes, update the sorted list.
  useEffect(() => {
    setSortedInventory(inventory);
  }, [inventory]);

  // Sort the inventory whenever inventory, sortField, or sortOrder changes.
  useEffect(() => {
    let sorted = [...inventory];
    if (sortField) {
      sorted.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        // If both values are numbers, compare numerically.
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        // Otherwise, compare as strings (case-insensitive).
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setSortedInventory(sorted);
  }, [inventory, sortField, sortOrder]);

  // Handle sort icon clicks. If clicking the same column, toggle the order.
  const handleSort = (column) => {
    if (sortField === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="inventory-list">
      <div className="inventory-list--header">
        <h3
          className="inventory-list--header_item"
          onClick={() => handleSort("item_name")}
        >
          Inventory Item
          <img src="/src/assets/Icons/sort-24px.svg" alt="sort-button" />
        </h3>
        <h3
          className="inventory-list--header_item"
          onClick={() => handleSort("category")}
        >
          Category
          <img src="/src/assets/Icons/sort-24px.svg" alt="sort-button" />
        </h3>
        <h3
          className="inventory-list--header_item"
          onClick={() => handleSort("status")}
        >
          Status
          <img src="/src/assets/Icons/sort-24px.svg" alt="sort-button" />
        </h3>
        <h3
          className="inventory-list--header_item"
          onClick={() => handleSort("quantity")}
        >
          Quantity
          <img src="/src/assets/Icons/sort-24px.svg" alt="sort-button" />
        </h3>
        <h3>Actions</h3>
      </div>
      {sortedInventory.map((inventoryItem) => (
        <div key={inventoryItem.id} className="inventory-list__item">
          <div className="inventory-list__item-name">
            <h3>Inventory Item</h3>
            <Link
              className="inventory-list__item-name__item"
              to={`/inventories/${id}`}
            >
              <p>
                {inventoryItem.item_name}
                <img
                  src="/src/assets/icons/chevron_right-24px.svg"
                  alt="chevron"
                />
              </p>
            </Link>
          </div>
          <div className="inventory-list__item-status">
            <h3>Status</h3>
            <p
              className={`inventory-list__status-tag inventory-list__status-tag--${
                inventoryItem.status === "In Stock" ? "green" : "red"
              }`}
            >
              {inventoryItem.status}
            </p>
          </div>
          <div className="inventory-list__item-category">
            <h3>Category</h3>
            <p>{inventoryItem.category}</p>
          </div>
          <div className="inventory-list__item-quantity">
            <h3>Qty</h3>
            <p>{inventoryItem.quantity}</p>
          </div>
          <div className="inventory-list__item-cta">
            <div
              style={{ color: "#c94515", cursor: "pointer" }}
              onClick={() =>
                setDeleteObj({
                  id: inventoryItem.id,
                  name: inventoryItem.item_name,
                  fun: cancelDelete,
                })
              }
            >
              <DeleteOutlineIcon />
            </div>
            <Link to={`/inventories/${inventoryItem.id}/edit`}>
              <img
                className="inventory-list__item-cta--edit"
                src="/src/assets/icons/edit-24px.svg"
                alt="edit"
              />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WarehouseInventoryList;
