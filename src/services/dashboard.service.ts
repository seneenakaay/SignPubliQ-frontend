
import api from '@/lib/axios';
import { encrypt } from '@/utils/crypto';
import { DashboardSummary } from '@/types/dashboard';

export const getSummary = async (userId: string | number): Promise<DashboardSummary | null> => {
    const encryptedId = encodeURIComponent(encrypt(String(userId)));
    try {
        const response = await api.get<{ summary: DashboardSummary }>(`/dashboard/summary/${encryptedId}`);
        // Axios interceptor already merges decrypted data, so we access it directly
        // TypeScript might need a hint if we don't type the axios response strictly, 
        // but our interceptor says it returns the merged object.
        return (response as any).summary;
    } catch (error) {
        console.error('Failed to fetch dashboard summary', error);
        return null;
    }
};
