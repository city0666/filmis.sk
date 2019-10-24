import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Settings } from '../../../../core/config/settings.service';
import { AppHttpClient } from '../../../../core/http/app-http-client.service';
import { SiteAnalyticsData, LogData } from '../../types/site-analytics-data';
import { transformWeeklyData } from '../../transformers/weekly-data-transformer';
import { transformMonthlyData } from '../../transformers/monthly-data-transformer';
import { transformBrowserData } from '../../transformers/browser-data-transformer';
import { transformCountryData } from '../../transformers/country-data-transformer';
import { ChartConfigs } from '../../types/chart-configs';
import { AnalyticsHeaderData, AnalyticsResponse } from '../../types/analytics-response';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material';

@Component({
    selector: 'analytics-container',
    templateUrl: './analytics-container.component.html',
    styleUrls: ['./analytics-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsContainerComponent implements OnInit {
    public headerData: AnalyticsHeaderData[];
    public logs: LogData[];
    public loading = new BehaviorSubject(true);
    public charts: Partial<ChartConfigs> = {};

    public dataSource = new MatTableDataSource();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    
    constructor(
        public settings: Settings,
        private route: ActivatedRoute,
        private http: AppHttpClient,
    ) {}

    ngOnInit() {
        this.http.get<AnalyticsResponse>('admin/analytics/stats')
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(response => {
                if (Object.keys(response.mainData).length) {
                    this.generateCharts(response.mainData);
                }

                if (response.logs.length) {
                    this.dataSource.data = response.logs;
                }

                if (response.headerData.length) {
                    this.headerData = response.headerData;
                }
            });
    }


    private generateCharts(data: SiteAnalyticsData) {
        this.charts = {
            weeklyPageViews: transformWeeklyData(data.weeklyPageViews),
            monthlyPageViews: transformMonthlyData(data.monthlyPageViews),
            browsers: transformBrowserData(data.browsers),
            countries: transformCountryData(data.countries)
        };
    }
}
