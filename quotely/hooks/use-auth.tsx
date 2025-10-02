import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTokens } from "../lib/auth/token-storage";

type Tokens = { accessToken: string | null; refreshToken: string | null };

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accessToken, refreshToken }: Tokens) => {
      await setTokens(accessToken, refreshToken);

      await queryClient.invalidateQueries({ queryKey: ["session"] });

      return { accessToken, refreshToken };
    },
    onError: async () => {
      await setTokens(null, null);
    },
  });
}
