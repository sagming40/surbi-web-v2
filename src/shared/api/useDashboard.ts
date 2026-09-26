import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./dashboard";
import type { Quarter } from "@/shared/types";

export function useDashboard(quarter: Quarter) {
  return useQuery({ 
    queryKey: ['dashboard', quarter],
    queryFn: () => getDashboard(quarter),
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
   });
  }
