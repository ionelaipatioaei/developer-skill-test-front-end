import "../styles/Image.scss";
import ArrowRight from "../assets/icons/arrow-right.svg"

export default function ImageContainer(props) {
  return (
    <div className="image">
      <img alt={props.data.title} src={props.data.url} />
      <div className="content">
        <h2>{props.data.title}</h2>
        <p>{props.data.description}</p>
        <a href="/#">
          Explore
          <img className="right-arrow-icon" src={ArrowRight} alt="right arrow icon" />
        </a>
      </div>
    </div>
  );
}