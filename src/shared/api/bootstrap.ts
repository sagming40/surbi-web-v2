import { apiClient } from './client';
import { toBootstrap } from './adapters/bootstrap';
import type { BootstrapResponseDto } from './dto/bootstrap';
import type { Bootstrap } from '@/shared/types';

export async function getBootstrap(): Promise<Bootstrap> {
  const response = await apiClient.get<BootstrapResponseDto>('/bootstrap');
  return toBootstrap(response.data);
}