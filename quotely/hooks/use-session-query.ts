import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import { getAccessTokenFromStorage } from "../lib/auth/token-storage";

export const useSession = () => {
  const hasToken = getAccessTokenFromStorage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await apiClient.get("/session");
      console.log(res);
      return res.data.data;
    },
    enabled: !!hasToken,
    staleTime: Infinity,
    retry: false,
  });

  const user = data || null;
  const isAuthenticated = !!data && !error;

  const isInitialLoading = isLoading;

  return {
    user,
    isAuthenticated,
    isLoading: isInitialLoading,
    error,
  };
};
