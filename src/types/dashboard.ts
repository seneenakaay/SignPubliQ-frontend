export interface DashboardSummary {
    dashboard_id: string;
    user_id: string;
    total_envelopes: number;
    drafts_count: number;
    sent_count: number;
    completed_count: number;
    declined_count: number;
    expired_count: number;
    created_date: string;
    updated_date: string;
}
