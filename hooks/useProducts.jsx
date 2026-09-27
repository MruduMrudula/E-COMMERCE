import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productApi";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: false,
  });
};
