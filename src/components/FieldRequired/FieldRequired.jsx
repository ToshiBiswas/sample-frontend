import "./FieldRequired.scss";
import { ErrorIcon } from "../Iconography/Iconography.jsx";

function FieldRquired({ errors }) {
  return (
    <div className={`error__text ${errors ? "error__text--error" : ""}`}>
      <ErrorIcon className="error__icon" />
      <div className="error__field">This field is required</div>
    </div>
  );
}

export default FieldRquired;
