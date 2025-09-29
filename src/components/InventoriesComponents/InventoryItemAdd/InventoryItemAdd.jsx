import "./InventoryItemAdd.scss";
import FieldRequired from "../../FieldRequired/FieldRequired.jsx";
import { ArrowBackIcon } from "../../Iconography/Iconography.jsx";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

function InventoryItemAdd() {
  const phoneRegex = /^[0-9]+$/;
  const [isNumberInput, setIsNumberInput] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [category, setCategory] = useState([]);
  const [errors, setErrors] = useState({
    item_name: "",
    description: "",
    category: "",
    status: "",
    quantity: "",
    warehouse_id: "",
  });

  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    category: "",
    status: "",
    quantity: 0,
    warehouse_id: "",
  });

  const handleGetWarehouses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/warehouses`);
      setWarehouses(response.data);
    } catch (error) {
      alert("Error: Failed to get warehouse data.");
      console.log(error);
    }
  };

  const handleGetInventories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/inventories`);
      // console.log(response.data);
      const allCategories = response.data.map((item) => item.category);
      const uniqueCategories = allCategories.filter(
        (item, index, self) => self.indexOf(item) === index
      );
      setCategory(uniqueCategories);
    } catch (error) {
      alert("Error: Failed to get inventories data.");
      console.log(error);
    }
  };

  const handleAddInventoryItem = async (newInventory) => {
    try {
      const response = await axios.post(
        `${backendUrl}/inventories`,
        newInventory
      );
      return response.data;
    } catch (error) {
      alert(
        "Error: Nah, not sneaky. Please fill the inventory item's empty fields please."
      );
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetWarehouses();
    handleGetInventories();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousFormDataState) => ({
      ...previousFormDataState,
      [name]: value, // update field in formData
    }));
  };

  let emptyFields = { ...errors };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const fieldstoValidate = [
      "item_name",
      "description",
      "category",
      "status",
      "quantity",
      "warehouse_id",
    ];

    // check if status is in stock
    if (formData.status === "In Stock") {
      const what = fieldstoValidate.push("quantity");
    }

    fieldstoValidate.forEach((field) => {
      emptyFields[field] = formData[field] === "";
    });

    setErrors(emptyFields);
    console.log(emptyFields["item_name"]);

    try {
      const newInventory = {
        warehouse_id: formData.warehouse_id,
        item_name: formData.item_name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        quantity: formData.quantity,
      };

      handleAddInventoryItem(newInventory);
      navigate("/inventories");
    } catch (error) {
      console.error(error);
    }

    if (!phoneRegex.test(formData.quantity)) {
      emptyFields.quantity === true;
      setIsNumberInput(emptyFields.quantity);
    } else {
      emptyFields.quantity === false;
    }

    setIsNumberInput(isNumberInput);

    try {
      navigate(`/inventories/add`);
    } catch (error) {
      console.error(error);
    }
  };
  // const setIsFormValid

  return (
    <div className="add-inventory__container">
      <div className="add-inventory__title-container">
        <Link to={`/inventories`} className="add-inventory__icon">
          <ArrowBackIcon />
        </Link>
        <h1 className="add-inventory__title">Add New Inventory Item</h1>
      </div>
      <div className="divider__line"></div>
      <form className="form__container" onSubmit={handleSubmit}>
        <div className="form__container--tablet details__container--tablet">
          <div className="details__container details__container--left">
            <h2 className="details__item">Item Details</h2>
            <div>
              <label htmlFor="inventoryItemName">
                <h3 className="details__label details__label--name">
                  Item Name
                </h3>
              </label>
              <input
                id="inventoryItemName"
                className={`details__input details__input--inventory-name ${
                  errors.item_name ? "details__input--error" : ""
                }`}
                placeholder="Item Name"
                name="item_name"
                value={formData.item_name}
                type="text"
                onChange={(event) => handleInputChange(event)}
              />
              <FieldRequired errors={errors.item_name} />
              <label htmlFor="item_name">
                <h3 className="details__label details__label--street">
                  Description
                </h3>
                <textarea
                  id="item_name"
                  className={`details__input details__input--description ${
                    errors.item_name ? "details__input--error" : ""
                  }`}
                  placeholder="Please enter a brief item description..."
                  name="description"
                  value={formData.description}
                  type="text"
                  onChange={(event) => handleInputChange(event)}
                />
                <FieldRequired errors={errors.description} />
              </label>
              <label htmlFor="category">
                <h3 className="details__label details__label--category">
                  Category
                </h3>
              </label>
              <select
                id="category"
                className={`details__input details__input--category details__arrow ${
                  errors.category
                    ? "details__input--error details__arrow--error"
                    : ""
                }`}
                placeholder="Please select"
                name="category"
                value={formData.category}
                type="text"
                onChange={(event) => handleInputChange(event)}
              >
                <option value="" className="details__warehouse">
                  Please select
                </option>
                {category.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldRequired errors={errors.category} />
            </div>
          </div>
          <div className="divider__line"></div>
          <div className="divider__line--tablet divider__line--inventory"></div>
          <div className="details__container details__container--right">
            <h2 className="details__item">Item Availability</h2>
            <div>
              <label htmlFor="status-in-stock">
                <h3 className="details__label details__label--name">Status</h3>
              </label>
              <div className="status__container">
                <div className="status__in-out">
                  <label
                    className={`status__stock-in form__radio-label ${
                      formData.status !== "In Stock" ? "form__radio--alt" : ""
                    }`}
                  >
                    <input
                      id="status-in-stock"
                      className="details__radio details__input--name"
                      type="radio"
                      name="status"
                      value="in-stock"
                      checked={formData.status === "In Stock"}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          status: "In Stock",
                        }));
                      }}
                    />
                    In stock
                  </label>
                  <label
                    className={`status__stock-out form__radio-label ${
                      formData.status !== "Out of Stock"
                        ? "form__radio--alt"
                        : ""
                    }`}
                  >
                    <input
                      id="status-out-of-stock"
                      className="details__radio details__input--name"
                      type="radio"
                      name="status"
                      value="out-of-stock"
                      checked={formData.status === "Out of Stock"}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          status: "Out of Stock",
                        }));
                      }}
                    />
                    Out of stock
                  </label>
                </div>
                <label className="details__quantity">
                  {formData.status === "In Stock" && (
                    <>
                      <label htmlFor="quantity">
                        <h3 className="details__label status__quantity">
                          Quantity
                        </h3>
                      </label>
                      <input
                        id="quantity"
                        className={`details__input details__input--quantity ${
                          errors.quantity && !isNumberInput
                            ? "details__input--error"
                            : ""
                        }`}
                        placeholder="0"
                        name="quantity"
                        type="text"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                      <FieldRequired errors={errors.quantity} />
                    </>
                  )}
                </label>
              </div>
              <label htmlFor="warehouse_id">
                <h3 className="details__label details__label--warehouse">
                  Warehouse
                </h3>
              </label>
              <select
                id="warehouse_id"
                className={`details__input details__input--warehouse details__arrow ${
                  errors.warehouse_id
                    ? "details__input--error details__arrow--error"
                    : ""
                }`}
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={(event) => handleInputChange(event)}
              >
                <option className="details__warehouse ">Please select</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.warehouse_name}
                  </option>
                ))}
              </select>
              <FieldRequired errors={errors.warehouse_id} />
            </div>
          </div>
        </div>
        <div className="button__container button__container--inventory">
          <Link to="/inventories" className="button__element">
            Cancel
          </Link>
          <button type="submit" className="button__element--add">
            + Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryItemAdd;
