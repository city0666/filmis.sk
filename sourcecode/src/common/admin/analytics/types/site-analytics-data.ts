export interface DayData {
    date: number;
    pageViews: number;
}

export interface WeeklyPageViews {
    current: DayData[];
    previous: DayData[];
}

export interface MonthlyPageViews {
    current: DayData[];
    previous: DayData[];
}

export interface BrowserData {
    browser: string;
    sessions: number;
}

export interface CountryData {
    country: string;
    sessions: number;
}

export interface Log {
    id: number;
    created_at: string;
    updated_at: string;
    ip_address?: string;
    message?: string;
    city?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    region?: string;
    user_agent?: string;
    user_id?: number;
}

export interface LogData {
    id: number;
    email: string;
    avatar?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    logs: Log[]
}

export interface SiteAnalyticsData {
    browsers: BrowserData[];
    countries: CountryData[];
    monthlyPageViews: MonthlyPageViews;
    weeklyPageViews: WeeklyPageViews;
}
