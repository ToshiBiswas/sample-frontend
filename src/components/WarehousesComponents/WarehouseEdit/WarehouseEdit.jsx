import FieldRequired from "../../FieldRequired/FieldRequired.jsx";
import { ArrowBackIcon } from "../../Iconography/Iconography.jsx";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./WarehouseEdit.scss";

const backendUrl = import.meta.env.VITE_API_URL;

function WarehouseEdit() {
  const { id } = useParams();
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

  const fetchWarehouse = async () => {
    try {
      const response = await axios.get(`${backendUrl}/warehouses/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
    }
  };

  const editWarehouse = async () => {
    console.log("editWarehouse function called with data:", formData);

    try {
      console.log("Making request to:", `${backendUrl}/warehouses/${id}`);

      const payload = {
        id: Number(id),
        warehouse_name: formData.warehouse_name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        contact_name: formData.contact_name,
        contact_position: formData.contact_position,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
      };

      console.log("Payload with matching ID:", payload);

      const response = await axios.put(
        `${backendUrl}/warehouses/${id}`,
        payload
      );
      console.log("Success response:", response.data);
    } catch (error) {
      console.log("Full error object:", error);
      console.log("Full error details:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, [id]); // only on change of warehouse load a new instance and update form

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
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
    ];

    fieldstoValidate.forEach((field) => {
      emptyFields[field] = formData[field] === "";
    });

    if (
      formData.contact_phone === "" &&
      !setIsPhoneValid(formData.contact_phone)
    ) {
      emptyFields.contact_phone = true;
    } else {
      emptyFields.contact_phone = false;
    }

    if (
      formData.contact_email === "" &&
      !setIsEmailValid(formData.contact_email)
    ) {
      emptyFields.contact_email = true;
      setIsEmailValid("");
    } else {
      emptyFields.contact_email = false;
      setIsEmailValid("");
    }
    setErrors(emptyFields);
    setIsEmailValid(isEmailValid);
    setIsPhoneValid(isPhoneValid);

    // do put request and seend back to home
    try {
      editWarehouse();
      navigate(`/warehouses/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-warehouse__container">
      <div className="add-warehouse__title-container">
        <Link to={`/warehouses`} className="add-warehouse__icon">
          <ArrowBackIcon />
        </Link>
        <h1 className="add-warehouse__title">Edit Warehouse</h1>
      </div>
      <div className="divider__line"></div>
      <form className="form__container" onSubmit={handleSubmit}>
        <div className="form__container--tablet">
          <div className="details__container details__container--warehouse">
            <h2 className="details__title">Warehouse Details</h2>
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
          <Link to="/warehouses" type="button" className="button__element">
            Cancel
          </Link>
          <button
            type="submit"
            className="button__element button__element--add"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default WarehouseEdit;
