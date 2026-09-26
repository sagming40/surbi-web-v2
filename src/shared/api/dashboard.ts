import { apiClient } from './client';
import { toDashboard } from './adapters/dashboard';
import { toPeriodCode } from './convert';
import type { DashboardResponseDto } from './dto/dashboard';
import type { DashboardResponse, Quarter } from '@/shared/types';

export async function getDashboard(quarter: Quarter): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponseDto>('/dashboard', {
        params: { period: toPeriodCode(quarter) }
    });
    return toDashboard(response.data);
}