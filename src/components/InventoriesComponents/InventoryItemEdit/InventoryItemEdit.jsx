import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowBackIcon, ErrorIcon } from "../../Iconography/Iconography";
import "./InventoryItemEdit.scss";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const InventoryItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [editedItem, setEditedItem] = useState({
    warehouse_id: "",
    item_name: "",
    description: "",
    category: "",
    status: "Out of Stock",
    quantity: 0,
  });

  const getWarehouses = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/warehouses`);
      setWarehouses(response.data);
    } catch (error) {
      console.log("Error at getWarehouses:", error);
    }
  };

  const getInventory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/inventories/${id}`);
      setItem(response.data);
    } catch (error) {
      console.log("Error at getInventory:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/inventories`);
      const data = response.data;
      const allCategories = [...new Set(data.flatMap((item) => item.category))];
      setCategories(allCategories);
    } catch (error) {
      console.log("Error at getCategories:", error);
    }
  };

  useEffect(() => {
    getWarehouses();
    getCategories();
    getInventory();
  }, [id]);

  useEffect(() => {
    if (item) {
      setEditedItem({
        warehouse_id: item.warehouse_id,
        item_name: item.item_name,
        description: item.description,
        category: item.category,
        status: item.quantity > 0 ? "In Stock" : "Out of Stock",
        quantity: item.quantity,
      });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateInputs();
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    setEditedItem({
      ...editedItem,
      status: newStatus,
      quantity: newStatus === "In Stock" ? 1 : 0,
    });
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!editedItem.item_name.trim()) {
      newErrors.item_name = "This field is required.";
    }
    if (!editedItem.description.trim()) {
      newErrors.description = "This field is required.";
    }
    if (editedItem.status === "In Stock" && editedItem.quantity <= 0) {
      newErrors.quantity = "This field is required.";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateInputs();

    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/inventories/${id}`,
        editedItem
      );
      if (response.status === 200) {
        console.log("Form submitted successfully", response.data);
        navigate(`/inventories/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setErrors({
        submitError:
          "An error occurred while submitting the form. Please try again.",
      });
    }
  };

  const fieldError = (field) => {
    return (
      errors[field] && (
        <div className="form__error">
          <ErrorIcon /> {errors[field]}
        </div>
      )
    );
  };

  if (!item || warehouses.length === 0 || categories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit">
      <div className="edit__header">
        <div className="edit__header-content">
          <div className="edit__backlink" onClick={() => navigate(-1)}>
            <ArrowBackIcon className="edit__backarrow" />
          </div>
          <h1 className="edit__heading">Edit Inventory Item</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form__container">
          <div className="form__column">
            <h2 className="form__heading">Item Details</h2>

            <label htmlFor="item_name" className="form__label">
              Item Name
            </label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              className={`form__input ${
                errors.item_name ? "form__input--error" : ""
              }`}
              value={editedItem.item_name}
              onChange={handleInputChange}
            />
            {fieldError("item_name")}

            <label htmlFor="description" className="form__label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`form__input--description ${
                errors.description ? "form__input--error" : ""
              }`}
              value={editedItem.description}
              onChange={handleInputChange}
            />
            {fieldError("description")}

            <label htmlFor="category" className="form__label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className={`form__categories ${
                errors.category ? "form__input--error" : ""
              }`}
              value={editedItem.category}
              onChange={handleInputChange}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form__column">
            <h2 className="form__heading">Item Availability</h2>

            <h3 className="form__status">Status</h3>
            <div className="form__radios">
              <label
                className={`form__radio-label ${
                  editedItem.status !== "In Stock" ? "form__radio--alt" : ""
                }`}
              >
                <input
                  type="radio"
                  value="In Stock"
                  name="status"
                  className="form__radio"
                  checked={editedItem.status === "In Stock"}
                  onChange={handleStatusChange}
                />
                In stock
              </label>
              <label
                className={`form__radio-label ${
                  editedItem.status !== "Out of Stock" ? "form__radio--alt" : ""
                }`}
              >
                <input
                  type="radio"
                  value="Out of Stock"
                  name="status"
                  className="form__radio"
                  checked={editedItem.status === "Out of Stock"}
                  onChange={handleStatusChange}
                />
                Out of stock
              </label>
            </div>

            {editedItem.status === "In Stock" && (
              <>
                <label htmlFor="quantity" className="form__label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className={`form__input ${
                    errors.quantity ? "form__input--error" : ""
                  }`}
                  value={editedItem.quantity}
                  onChange={handleInputChange}
                />
                {fieldError("quantity")}
              </>
            )}

            <label htmlFor="warehouse_id" className="form__label">
              Warehouse
            </label>
            <select
              name="warehouse_id"
              id="warehouse_id"
              className={`form__warehouses ${
                errors.warehouse_id ? "form__input--error" : ""
              }`}
              value={editedItem.warehouse_id}
              onChange={handleInputChange}
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.warehouse_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form__buttons">
          <div className="form__button" onClick={() => navigate(-1)}>
            Cancel
          </div>
          <button type="submit" className="form__button--alt">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryItemEdit;
