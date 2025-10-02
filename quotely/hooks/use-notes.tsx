import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

export const useNotes = (id?: string, params?: Record<string, any>) => {
  const queryClient = useQueryClient();

  const allNotes = useQuery({
    queryKey: ["all-notes", params],
    queryFn: async () => {
      const { data: res } = await apiClient.get("/notes", { params });
      console.log(res);

      return res.data;
    },
  });

  const note = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      if (!id) return null;
      const { data: res } = await apiClient.get(`/notes/${id}`);
      console.log(res);
      return res.data;
    },
    enabled: !!id,
  });

  const create = useMutation({
    mutationFn: async (payload: { content: string; bgColor?: string }) => {
      const { data: res } = await apiClient.post("/notes", payload);
      console.log(res);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-notes"] }),
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: { content?: string; bgColor?: string };
    }) => {
      const { data: res } = await apiClient.put(`/notes/${id}`, payload);
      console.log(res);

      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data: res } = await apiClient.delete(`/notes/${id}`);
      console.log(res);

      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-notes"] }),
  });

  return {
    allNotes,
    note,
    create,
    update,
    remove,
  };
};
