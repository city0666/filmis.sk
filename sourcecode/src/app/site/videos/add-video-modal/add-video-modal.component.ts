import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Title} from '../../../models/title';
import {VideoService} from '../video.service';
import {finalize} from 'rxjs/operators';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';
import {Video} from '../../../models/video';
import {Episode} from '../../../models/episode';
import {MEDIA_TYPE} from '../../media-type';
import {openUploadWindow} from '../../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../common/uploads/upload-input-config';
import {UploadQueueService} from '../../../../common/uploads/upload-queue/upload-queue.service';
import {Settings} from '../../../../common/core/config/settings.service';
import {CurrentUser} from '../../../../common/auth/current-user';
import {LANGUAGES} from '../languages';

interface AddVideoModalData {
    mediaItem: Title|Episode;
    video?: Video;
}

@Component({
    selector: 'add-video-modal',
    templateUrl: './add-video-modal.component.html',
    styleUrls: ['./add-video-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class AddVideoModalComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public episodeCount$ = new BehaviorSubject([]);
    public languages$ = [];
    public subtitles$ = [];
    public videoForm = this.fb.group({
        name: [],
        thumbnail: [],
        url: [],
        quality: ['regular'],
        type: ['embed'],
        season: [],
        episode: [],
        language: [],
        subtitles: [],
        source: ['local']
    });

    constructor(
        private fb: FormBuilder,
        private videos: VideoService,
        private toast: Toast,
        private uploadQueue: UploadQueueService,
        private settings: Settings,
        private dialogRef: MatDialogRef<AddVideoModalComponent>,
        public currentUser: CurrentUser,
        @Inject(MAT_DIALOG_DATA) public data: AddVideoModalData,
    ) {}

    ngOnInit() {
        this.hydrateForm();
        this.getLanguages();
    }

    public getLanguages() {
        let languages = JSON.parse(this.settings.get('videos.language')) || [];
        let subtitles = JSON.parse(this.settings.get('videos.subtitles')) || [];
        for (let lang of LANGUAGES) {
            if (languages.includes(lang.value)) {
                this.languages$.push(lang);
            }
            if (subtitles.includes(lang.value)) {
                this.subtitles$.push(lang);
            }
        }
    }

    public confirm() {
        this.loading$.next(true);
        if (this.data.video) {
            this.updateVideo();
        } else {
            this.createVideo();
        }
    }

    private createVideo() {
        this.videos.create(this.getPayload(true))
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(MESSAGES.VIDEO_CREATE_SUCCESS);
                this.close(response.video);
            }, () => {
                this.toast.open(MESSAGES.VIDEO_CREATE_FAILED);
            });
    }

    private updateVideo() {
        this.videos.update(this.data.video.id, this.getPayload(false))
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(MESSAGES.VIDEO_UPDATE_SUCCESS);
                this.close(response.video);
            }, () => {
                this.toast.open(MESSAGES.VIDEO_UPDATE_FAILED);
            });
    }

    public close(video?: Video) {
        this.dialogRef.close(video);
    }

    private getPayload(isNew: boolean) {
        const payload = this.videoForm.value;
        if (this.data.mediaItem.type === MEDIA_TYPE.TITLE) {
            payload.title_id = this.data.mediaItem.id;
        } else {
            payload.title_id = this.data.mediaItem.title_id;
            payload.episode_id = this.data.mediaItem.id;
        }
        if (isNew) {
            payload.user_id = this.currentUser.get('id');
        }
        return payload;
    }

    public uploadThumbnail() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                uri: 'uploads/images',
                httpParams: {
                    path: 'media-images/videos'
                },
            };

            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                this.videoForm.patchValue({
                    thumbnail: this.settings.getBaseUrl(true) + fileEntry.url
                });
            });
        });
    }

    public getIterableFromNumber(number) {
        return Array.from(new Array(number), (v, i) => i + 1);
    }

    public getEpisodeCountForSeason(seasonNum: number) {
        let episodeCount = 24;
        if (this.data.mediaItem.type === MEDIA_TYPE.TITLE) {
            const season = this.data.mediaItem.seasons ? this.data.mediaItem.seasons.find(s => s.number === seasonNum) : null;
            if (season) {
                episodeCount = season.episodes && season.episodes.length ? season.episodes.length : season.episode_count;
            }
        }
        return  this.getIterableFromNumber(episodeCount);
    }

    public isSeries() {
        return this.data.mediaItem.type === MEDIA_TYPE.TITLE &&
            this.data.mediaItem.is_series;
    }

    private hydrateForm() {
        // update episode count, when season number changes
        this.videoForm.get('season').valueChanges.subscribe(number => {
            this.episodeCount$.next(this.getEpisodeCountForSeason(number));
        });

        // set specified video
        if (this.data.video) {
            this.videoForm.patchValue(this.data.video);
        }

        // hydrate season and episode number, if media item is series
        if (this.isSeries() && ! this.videoForm.value.season) {
            this.videoForm.patchValue({
                season: this.getFirstSeasonNumber(),
                episode: 1
            });
        }

        // hydrate season and episode number, if media item is episode
        if (this.data.mediaItem.type === MEDIA_TYPE.EPISODE) {
            this.videoForm.patchValue({
                season: this.data.mediaItem.season_number,
                episode: this.data.mediaItem.episode_number,
            });
        }
    }

    private getFirstSeasonNumber(): number {
        const title = this.data.mediaItem as Title;
        if (title.seasons && title.seasons.length) {
            return title.seasons[0].number;
        } else {
            return 1;
        }
    }
}
