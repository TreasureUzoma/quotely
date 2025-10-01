import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTokens } from "../lib/auth/token-storage";

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: async () => {
      await setTokens(null, null);
    },
  });
}
