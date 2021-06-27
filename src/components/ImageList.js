import { useState, useEffect, useCallback, useRef } from "react";
import * as flickr from "../services/flickr";
import "../styles/Image.scss";
import ImageContainer from "./ImageContainer";
import Loader from "./Loader";
import SearchIcon from "../assets/icons/search.svg";

const formatImageData = (data) => ({
  url: `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_n.jpg`,
  title: data.title,
  description: data.description._content
});

export default function ImageList() {
  const PER_PAGE = 10;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("mountains");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const loader = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      console.log("123");
      loadMoreImages();
      // setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imgs = await flickr.getImages({ tags: search, perPage: PER_PAGE, page });
        const parsedImgData = imgs.data.photos.photo.map((img) => formatImageData(img));
        setImages(parsedImgData);
      } catch (error) {
        console.log(error);
        setImagesError("Something went wrong while trying to fetch the images!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const searchImages = async () => {
    setLoading(true);
    setPage(1);
    try {
      const imgs = await flickr.getImages({ tags: search, perPage: PER_PAGE, page });
      const parsedImgData = imgs.data.photos.photo.map((img) => formatImageData(img));
      setImages(parsedImgData);
    } catch (error) {
      console.log(error);
      setImagesError("Something went wrong while trying to fetch the images!");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      searchImages();
    }
  };

  const loadMoreImages = async () => {
    setPage(page + 1);
    setLoadingMore(true);
    try {
      const imgs = await flickr.getImages({ tags: search, perPage: PER_PAGE, page });
      const parsedImgData = imgs.data.photos.photo.map((img) => formatImageData(img));
      setImages((prev) => [...prev, ...parsedImgData]);
    } catch (error) {
      console.log(error);
      setImagesError("Something went wrong while trying to fetch the images!");
    } finally {
      setLoadingMore(false);
    }
  };

  const genImages = (imgs) => {
    const items = imgs.map((img, i) => <ImageContainer key={i} data={img} />);
    return (
      <div className="images">
        {items}
      </div>
    );
  };

  return (
    <div className="image-list-container">
      <div className="search">
        <input type="text" onKeyDown={handleEnterKeyPress} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images by tags..." />
        <button onClick={searchImages}><img alt="search icon" src={SearchIcon} /></button>
      </div>
      {loading && <div className="info">
        <Loader />
        <p>Loading images, please wait...</p>
      </div>}
      {!loading && imagesError === "" && genImages(images)}
      <div ref={loader} />
      {!loading && imagesError !== "" && <div className="info">
        <p>{imagesError}</p>
      </div>}
      {loadingMore && <p>Loading more images...</p>}
    </div>
  );
}