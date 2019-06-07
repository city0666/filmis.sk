import {Title} from '../../../models/title';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {
    LoadRelatedVideos,
    PlayerOverlayClosed,
    PlayerOverlayOpened,
    PlayVideo,
    ToggleSidebar
} from './player-state-actions';
import {Video} from '../../../models/video';
import {TitlesService} from '../../titles/titles.service';
import {Episode} from '../../../models/episode';

interface PlayerStateModel {
    activeVideo?: Video;
    mediaItem?: Title|Episode;
    relatedVideos: Video[];
    isOpen: boolean;
    sidebarOpen: boolean;
}

@State<PlayerStateModel>({
    name: 'player',
    defaults: {
        relatedVideos: [],
        isOpen: false,
        sidebarOpen: true,
    }
})
export class PlayerState {
    constructor(private titles: TitlesService) {}

    @Selector()
    static isOpen(state: PlayerStateModel) {
        return state.isOpen;
    }

    @Selector()
    static activeVideo(state: PlayerStateModel) {
        return state.activeVideo;
    }

    @Selector()
    static relatedVideos(state: PlayerStateModel) {
        return state.relatedVideos;
    }

    @Selector()
    static mediaItem(state: PlayerStateModel) {
        return state.mediaItem;
    }

    @Selector()
    static sidebarOpen(state: PlayerStateModel) {
        return state.sidebarOpen;
    }

    @Action(PlayVideo)
    playVideo(ctx: StateContext<PlayerStateModel>, action: PlayVideo) {
        const state = ctx.getState();

        // already have this video and title loaded
        if (state.activeVideo && state.activeVideo.id === action.video.id) {
            return;
        }

        ctx.patchState({activeVideo: action.video, mediaItem: action.mediaItem});
        ctx.dispatch(new LoadRelatedVideos());
    }

    @Action(LoadRelatedVideos)
    loadRelatedVideos(ctx: StateContext<PlayerStateModel>) {
        const mediaItem =  ctx.getState().mediaItem;
        return this.titles.getRelatedVideos(
            mediaItem['title_id'] || mediaItem.id,
            ctx.getState().activeVideo.id
        ).pipe(tap(response => {
            ctx.patchState({relatedVideos: response.videos});
        }));
    }

    @Action(PlayerOverlayClosed)
    playerOverlayClosed(ctx: StateContext<PlayerStateModel>) {
        return ctx.patchState({isOpen: false});
    }

    @Action(PlayerOverlayOpened)
    playerOverlayOpened(ctx: StateContext<PlayerStateModel>) {
        return ctx.patchState({isOpen: true});
    }

    @Action(ToggleSidebar)
    toggleSidebar(ctx: StateContext<PlayerStateModel>, action: ToggleSidebar) {
        const state = action.open === null ? !ctx.getState().sidebarOpen : action.open;
        return ctx.patchState({sidebarOpen: state});
    }
}
