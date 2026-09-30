import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}?limit=0`, {
    headers: {
      Accept: "application/json",
    },
    responseType: "json",
  });

  // console.log("STATUS:", response.status);
  // console.log("PRODUCTS:", response.data?.products);
  // console.log("IS ARRAY:", Array.isArray(response.data?.products));

  return response.data.products;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Accept: "application/json",
    },
    responseType: "json",
  });

  return response.data;
};
