import {environment} from '../environments/environment';

export const MTDB_CONFIG = {
    assetsPrefix: 'client',
    environment: environment.production ? 'production' : 'dev',
    navbar: {
        defaultPosition: 'site',
        dropdownItems: [
            {route: '/watchlist', name: 'Watchlist', icon: 'playlist-add-check'},
            {route: '/lists', name: 'Your Lists', icon: 'list'},
        ]
    },
    auth: {
        color: 'accent',
        redirectUri: '/',
        adminRedirectUri: '/admin',
    },
    accountSettings: {
        hideNavbar: false,
    },
    customPages: {
        hideNavbar: false,
    },
    admin: {
        hideBilling: true,
        pages: [
            {name: 'titles', icon: 'movie', route: 'titles', permission: 'titles.view'},
            {name: 'people', icon: 'recent-actors', route: 'people', permission: 'people.view'},
            {name: 'news', icon: 'description', route: 'news', permission: 'news.view'},
            {name: 'videos', icon: 'slow-motion-video', route: 'videos', permission: 'videos.view'},
            {name: 'lists', icon: 'format-list-numbered', route: 'lists', permission: 'lists.view'},
        ],
        settingsPages: [
            {name: 'content', route: 'content'},
        ],
        analytics: {
            stats: [
                {name: 'users', icon: 'people'},
                {name: 'projects', icon: 'dashboard'},
                {name: 'templates', icon: 'web-design-custom'},
                {name: 'pages', icon: 'insert-drive-file'},
            ]
        },
        ads: [
            {slot: 'ads.shared', description: 'This ad will appear near the top on most pages.'},
            {slot: 'ads.homepage', description: 'This ad will appear between lists on the homepage.'},
            {slot: 'ads.title', description: 'This ad will appear after cast list on movie and tv series pages.'},
            {slot: 'ads.person', description: 'This ad will appear after credits list person page.'},
        ],
        appearance: {
            defaultRoute: '/',
            navigationRoutes: [
                '/',
                'movies',
                'series',
                'account/settings',
                'admin',
            ],
            menus: {
                availableRoutes: [
                    'movies',
                    'series',
                    'news',
                    'people',
                ],
                positions: [
                    'primary',
                    'admin-navbar',
                    'custom-page-navbar',
                    'footer-1',
                    'footer-2',
                    'footer-3',
                ]
            },
            sections: {
                homepage: {
                    name: 'Homepage',
                    position: 1,
                    route: '/',
                    fields: [],
                },

            }
        }
    },
};
