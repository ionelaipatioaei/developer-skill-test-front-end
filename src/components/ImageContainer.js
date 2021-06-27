import "../styles/Image.scss";
import ArrowRightIcon from "../assets/icons/arrow-right.svg"

export default function ImageContainer(props) {
  return (
    <div className="image">
      <img alt={props.data.title} src={props.data.url} />
      <div className="content">
        <h2>{props.data.title.slice(0, 42)}{props.data.title.length > 42 && " ..."}</h2>
        <p>{props.data.description.slice(0, 256)}{props.data.description.length > 256 && " ..."}</p>
        {/* <p>{props.data.description}</p> */}
        <a href="/#">
          Explore
          <img className="right-arrow-icon" src={ArrowRightIcon} alt="right arrow icon" />
        </a>
      </div>
    </div>
  );
}