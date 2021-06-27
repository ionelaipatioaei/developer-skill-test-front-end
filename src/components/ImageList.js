import { useState, useEffect, useCallback, useRef } from "react";
import * as flickr from "../services/flickr";
import "../styles/Image.scss";
import ImageContainer from "./ImageContainer";
import Loader from "./Loader";
import SearchIcon from "../assets/icons/search.svg";

// NOTE: Image url formatted based on https://www.flickr.com/services/api/misc.urls.html
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

  // Handles the infinite scroll functionality using IntersectionObserver
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      loadMoreImages();
    }
  }, []);

  // Makes the initial http request for the image data
  useEffect(() => {
    const fetchData = async () => {
      console.log("loading init")
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

  // Handles the infinite scroll
  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  // Refreshes the data based on the query term
  const searchImages = async () => {
    console.log("loading search")
    setLoading(true);
    setImages([]);
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

  // Allows the user to complete the search by pressing enter
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      searchImages();
    }
  };

  // Loads more images once the user scrolled to the bottom page
  const loadMoreImages = async (newSearch, newPage) => {
    console.log("loading more")
    setPage((prev) => prev + 1);
    setLoadingMore(true);
  };

  useEffect(() => {
    const addImages = async () => {
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
    addImages();
  }, [page]);

  // Generates the image list bases the the data returned by the api
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
        <input id="search" type="text" onKeyDown={handleEnterKeyPress} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images by tags..." />
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