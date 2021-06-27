import axios from "axios";

const BASE_URL = "https://www.flickr.com/services/rest/";

const getImages = (options) => {
  const { tags, perPage, page } = options;
  return axios.get(`${BASE_URL}?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&tags=${tags}&per_page=${perPage}&page=${page}&extras=description&format=json&nojsoncallback=true`);
};

export { getImages };