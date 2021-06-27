import axios from "axios";

const BASE_URL = "https://www.flickr.com/services/rest/";

const getImages = (options) => {
  const { tags, perPage, page } = options;
  console.log(options);
  return axios.get(`${BASE_URL}?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&tags=${tags}&per_page=${perPage}&page=${page}&extras=description&sort=relevance&format=json&nojsoncallback=true`);
};

export { getImages };