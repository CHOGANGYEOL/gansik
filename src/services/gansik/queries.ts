import { useMutation, useQuery } from "@tanstack/react-query";
import services from "..";

export const GANSIK_KEYS = {
  ALL: ["gansik"] as const,
  postGansik: () => [...GANSIK_KEYS.ALL, "post"] as const,
  postAddSheet: () => [...GANSIK_KEYS.ALL, "post", "sheet"] as const,
  getGansikSheetNames: () => [...GANSIK_KEYS.ALL, "sheetNames"] as const,
} as const;

export const usePostGansik = () =>
  useMutation({
    mutationKey: GANSIK_KEYS.postGansik(),
    mutationFn: services.gansik.postGansik,
  });

export const usePostAddSheet = () =>
  useMutation({
    mutationKey: GANSIK_KEYS.postAddSheet(),
    mutationFn: services.gansik.postAddSheet,
  });

export const useGetGansikSheetNames = () =>
  useQuery({
    queryKey: GANSIK_KEYS.getGansikSheetNames(),
    queryFn: async () => await services.gansik.getGansikSheetNames(),
    select: (res) => res.data,
  });
