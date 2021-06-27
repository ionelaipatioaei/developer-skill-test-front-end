import "../styles/App.scss";
import LoaderIcon from "../assets/icons/loader.svg";

export default function Loader() {
  return (
    <div className="loader">
      <img alt="loading icon" src={LoaderIcon} />
    </div>
  );
}