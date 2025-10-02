import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import apiClient from "../api/client";

export const useNotes = (id?: string, params?: Record<string, any>) => {
  const queryClient = useQueryClient();

  const allNotes = useQuery({
    queryKey: ["all-notes", params],
    queryFn: async () => {
      const { data: res } = await apiClient.get("/notes", { params });
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-notes"] }),
        await queryClient.invalidateQueries({
          queryKey: ["notes"],
        });
    },
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
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log("starting delete", id);
        const { data: res } = await apiClient.delete(`/notes/${id}`);
        console.log("delete response:", res);
        return res;
      } catch (err) {
        if (err instanceof Error) {
          console.error("delete error:", err.message);
          throw err;
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-notes"] }),
        await queryClient.invalidateQueries({
          queryKey: ["notes"],
        });
    },
  });

  return {
    allNotes,
    note,
    create,
    update,
    remove,
  };
};

type NotesResponse = {
  success: boolean;
  message: string;
  data: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const useInfiniteNotes = () => {
  return useInfiniteQuery<NotesResponse>({
    queryKey: ["notes"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data: res } = await apiClient.get(`/notes?page=${pageParam}`);
      console.log(res);
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
