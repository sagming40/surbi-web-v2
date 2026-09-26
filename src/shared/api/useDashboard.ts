import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./dashboard";
import type { Quarter } from "@/shared/types";

export function useDashboard(quarter: Quarter | null) {
  return useQuery({ 
    queryKey: ['dashboard', quarter],
    queryFn: () => getDashboard(quarter!),
    enabled: quarter !== null, // quarter가 null이면 쿼리를 실행하지 않음
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
   });
  }