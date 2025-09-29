import "./WarehouseAdd.scss";
import FieldRequired from "../../FieldRequired/FieldRequired.jsx";
import { ArrowBackIcon } from "../../Iconography/Iconography.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

function WarehouseAdd() {
  const handleAddWarehouse = async (newWarehouse) => {
    console.log(newWarehouse);
    try {
      const response = await axios.post(
        `${backendUrl}/warehouses`,
        newWarehouse
      );
      const newWarehouseId = response.data.id;
      nav(`/warehouses/${newWarehouseId}`);
    } catch {
      alert("Error: Nah, try adding your website again.");
    }
  };

  const nav = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^(\+?\d{1,4}[\s.-]?)?(\(?\d{1,3}\)?[\s.-]?)?[\d\s.-]{7,}$/;
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [errors, setErrors] = useState({
    warehouse_name: "",
    address: "",
    city: "",
    country: "",
    contact_name: "",
    contact_position: "",
    contact_phone: "",
    contact_email: "",
  });

  const [formData, setFormData] = useState({
    warehouse_name: "",
    address: "",
    city: "",
    country: "",
    contact_name: "",
    contact_position: "",
    contact_phone: "",
    contact_email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousFormDataState) => ({
      ...previousFormDataState,
      [name]: value, // update field in formData
    }));
    // console.log(event.target.value);
  };

  let emptyFields = { ...errors };

  const handleSubmit = (event) => {
    event.preventDefault();

    // validate warehouse name
    if (formData.warehouse_name === "") {
      emptyFields.warehouse_name = true;
    } else {
      emptyFields.warehouse_name = false;
    }

    // // validate address
    if (formData.address === "") {
      emptyFields.address = true;
    } else {
      emptyFields.address = false;
    }

    // // validate city
    if (formData.city === "") {
      emptyFields.city = true;
    } else {
      emptyFields.city = false;
    }

    // validate country
    if (formData.country === "") {
      emptyFields.country = true;
    } else {
      emptyFields.country = false;
    }

    // validate contact_name
    if (formData.contact_name === "") {
      emptyFields.contact_name = true;
    } else {
      emptyFields.contact_name = false;
    }

    // validate contact_position
    if (formData.contact_position === "") {
      emptyFields.contact_position = true;
    } else {
      emptyFields.contact_position = false;
    }

    // validate contact_phone
    if (
      !phoneRegex.test(formData.contact_phone) ||
      formData.contact_phone === ""
    ) {
      emptyFields.contact_phone = true;
      setIsPhoneValid("");
    } else {
      emptyFields.contact_phone = false;
    }

    // validate contact_email
    if (
      !emailRegex.test(formData.contact_email) ||
      formData.contact_email === ""
    ) {
      emptyFields.contact_email = true;
      setIsEmailValid("");
    } else {
      emptyFields.contact_email = false;
      // setIsEmailValid("");
    }
    setErrors(emptyFields);
    setIsEmailValid(isEmailValid);
    setIsPhoneValid(isPhoneValid);
    console.log(emptyFields["address"]);

    let isFormValid = true;
    if (Object.keys(emptyFields).some((key) => emptyFields[key])) {
      isFormValid = false;
    }
    // console.log(emptyFields[]);
    if (isFormValid) {
      const newWarehouse = {
        warehouse_name: formData.warehouse_name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        contact_name: formData.contact_name,
        contact_position: formData.contact_position,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
      };
      handleAddWarehouse(newWarehouse);
    } else {
      return;
    }
  };

  return (
    <div className="add-warehouse__container">
      <div className="add-warehouse__title-container">
        <Link to={`/warehouses`} className="add-warehouse__icon">
          <ArrowBackIcon />
        </Link>
        <h1 className="add-warehouse__title">Add New Warehouse</h1>
      </div>
      <div className="divider__line"></div>
      <form className="form__container" onSubmit={handleSubmit}>
        <div className="form__container--tablet">
          <div className="details__container details__container--warehouse">
            <h2 className="details__ ">Warehouse Details</h2>
            <div>
              <label htmlFor="warehouseName">
                <h3 className="details__label details__label--name">
                  Warehouse Name
                </h3>
              </label>
              <input
                id="warehouseName"
                className={`details__input details__input--warehouse-name ${
                  errors.warehouse_name ? "details__input--error" : ""
                }`}
                placeholder="Warehouse Name"
                name="warehouse_name"
                value={formData.warehouse_name}
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired
                errors={errors.warehouse_name}
                setErrors={setErrors}
              />
              <label htmlFor="address">
                <h3 className="details__label details__label--street">
                  Street Address
                </h3>
                <input
                  id="address"
                  className={`details__input details__input--address ${
                    errors.address ? "details__input--error" : ""
                  }`}
                  placeholder="Address"
                  value={formData.address}
                  name="address"
                  type="text"
                  onChange={(event) => handleInputChange(event)}
                ></input>
                <FieldRequired errors={errors.address} />
              </label>
              <label htmlFor="city">
                <h3 className="details__label details__label--city">City</h3>
              </label>
              <input
                id="city"
                className={`details__input details__input--city ${
                  errors.city ? "details__input--error" : ""
                }`}
                placeholder="City"
                name="city"
                value={formData.city}
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired errors={errors.city} />
              <label htmlFor="country">
                <h3 className="details__label details__label--country">
                  Country
                </h3>
              </label>
              <input
                id="country"
                className={`details__input details__input--country ${
                  errors.country ? "details__input--error" : ""
                }`}
                placeholder="Country"
                name="country"
                value={formData.country}
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired errors={errors.country} />
            </div>
          </div>
          <div className="divider__line"></div>
          <div className="divider__line--tablet"></div>
          <div className="details__container details__container--contact">
            <h2 className="details__title">Contact Details</h2>
            <div>
              <label htmlFor="contact-name">
                <h3 className="details__label details__label--name">
                  Contact Name
                </h3>
              </label>
              <input
                id="contact-name"
                className={`details__input details__input--name ${
                  errors.contact_name ? "details__input--error" : ""
                }`}
                placeholder="Contact Name"
                name="contact_name"
                value={formData.contact_name}
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired errors={errors.contact_name} />
              <label htmlFor="contact-position">
                <h3 className="details__label details__label--position">
                  Position
                </h3>
              </label>
              <input
                id="contact-position"
                className={`details__input details__input--position ${
                  errors.contact_position ? "details__input--error" : ""
                }`}
                placeholder="Position"
                value={formData.contact_position}
                name="contact_position"
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired errors={errors.contact_position} />
              <label htmlFor="contact-phone">
                <h3 className="details__label details__label--phone">
                  Phone Number
                </h3>
              </label>
              <input
                id="contact-phone"
                className={`details__input details__input--phone ${
                  errors.contact_phone && !isPhoneValid
                    ? "details__input--error"
                    : ""
                }`}
                placeholder="Phone Number"
                value={formData.contact_phone}
                name="contact_phone"
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired
                errors={errors.contact_phone}
                isPhoneValid={isPhoneValid}
              />
              <label htmlFor="contact-email">
                <h3 className="details__label details__label--email">Email</h3>
              </label>
              <input
                id="contact-email"
                className={`details__input details__input--email ${
                  errors.contact_email && !isEmailValid
                    ? "details__input--error"
                    : ""
                }`}
                placeholder="Email"
                value={formData.contact_email}
                name="contact_email"
                type="text"
                onChange={(event) => handleInputChange(event)}
              ></input>
              <FieldRequired
                errors={errors.contact_email}
                isEmailValid={isEmailValid}
              />
            </div>
          </div>
        </div>
        <div className="button__container">
          <Link to="/warehouses" className="button__element">
            Cancel
          </Link>
          <button
            type="submit"
            className="button__element button__element--add"
          >
            + Add Warehouse
          </button>
        </div>
      </form>
    </div>
  );
}

export default WarehouseAdd;
