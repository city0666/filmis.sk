import { SiteAnalyticsData, LogData } from './site-analytics-data';
import { BackendResponse } from '../../../core/types/backend-response';

export interface AnalyticsHeaderData {
    icon: string;
    name: string;
    type: 'number'|'fileSize';
    value: number;
}

export type AnalyticsResponse = BackendResponse<{
    mainData: SiteAnalyticsData,
    headerData: AnalyticsHeaderData[],
    logs: LogData[],
}>;
