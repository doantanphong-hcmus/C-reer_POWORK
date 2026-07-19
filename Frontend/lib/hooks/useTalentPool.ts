import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { talentPoolAPI } from '@/lib/api/talent-pool';
import type { TalentPoolStatus } from '@/lib/types';
import toast from 'react-hot-toast'; 

export function useTalentPool() {
  return useQuery({
    queryKey: ['talent-pool'],
    queryFn: () => talentPoolAPI.getTalentPool(),
  });
}

export function useUpdateTalentPoolStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poolId, status }: { poolId: string; status: TalentPoolStatus }) =>
      talentPoolAPI.updateTalentPoolStatus(poolId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talent-pool'],
      });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: Error) => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      console.error('Update Talent Pool Error:', error);
    },
  });
}

export function useAddToTalentPool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => talentPoolAPI.addToTalentPool(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talent-pool'],
      });
      toast.success('Lưu ứng viên vào Talent Pool thành công!');
    },
    onError: (error: Error) => {
      toast.error('Có lỗi xảy ra khi lưu ứng viên');
      console.error('Add To Talent Pool Error:', error);
    },
  });
}