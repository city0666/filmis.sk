<?php
switch (\Route::getFacadeRoot()->current()->uri()) {
    case '/':
        $title = 'MTDb - Movies, TV and Celebrities';
        $description = 'The Movie Database (MTDb) is a popular database for movies, TV shows and celebrities.';
        $keywords = 'movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast';
        break;
    case 'titles/{id}/season/{season}/episode/{episode}':
        $cont = App\Title::find(request()->id);
        $title = $cont->name.' ('.$cont->year.') - Season '.request()->season.' - Episode '.request()->episode.' - MTDb';
        $description = $cont->name.': Season '.request()->season.' - Episode '.request()->episode;
        $keywords = 'reviews,photos,user ratings,synopsis,trailers,credits';
        break;
    case 'titles/{id}/season/{season}':
        $cont = App\Title::find(request()->id);
        $title = $cont->name.' ('.$cont->year.') - Season '.request()->season.' - MTDb';
        $description = 'List of episodes for '.$cont->name.': Season '.request()->season;
        $keywords = 'reviews,photos,user ratings,synopsis,trailers,credits';
        break;
    case 'browse':
        $title = 'Browse - MTDb';
        $description = 'Browse movies and series based on specified filters.';
        $keywords = 'movies, tv, browse, filters, search';
        break;
    case 'titles/{id}':
        $cont = App\Title::find(request()->id);
        $title = $cont->name;
        $description = substr(!empty($cont->description) ? $cont->description : 'No overview has been added yet.', 0, 160);
        $keywords = 'reviews,photos,user ratings,synopsis,trailers,credits';
        break;
    case 'lists/{id}':
        $cont = App\ListModel::find(request()->id);
        $title = $cont->name.' - MTDb';
        $description = substr($cont->description, 0, 160);
        $keywords = 'movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast';
        break;
    case 'news':
        $title = 'Latest News - MTDb';
        $description = 'The Movie Database (MTDb) is a popular database for movies, TV shows and celebrities.';
        $keywords = 'movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast';
        break;
    case 'news/{id}':
        $cont = App\NewsArticle::find(request()->id);
        $title = $cont->title.' - MTDb';
        $description = 'The Movie Database (MTDb) is a popular database for movies, TV shows and celebrities.';
        $keywords = 'movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast';
        break;
    case 'people':
        $title = 'People - MTDb';
        $description = 'The Movie Database (MTDb) is a popular database for movies, TV shows and celebrities.';
        $keywords = 'movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast';
        break;
    case 'people/{id}':
        $cont = App\Person::find(request()->id);
        $title = $cont->name;
        $description = $cont->description;
        $keywords = 'biography, facts, photos, credits';
        break;
}
?>

<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title class="dst">{{ $settings->get('branding.site_name') }}</title>

        <base href="{{ $htmlBaseUri }}">
        @if(!empty($title))
            <meta name="title" content="{{$title}}">
            <meta name="description" content="{{$description}}">
            <meta name="author" content="Filmis">
            <meta name="robots" content="All, Follow">
            <meta name="keywords" content="{{$keywords}}">
        @endif

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
        <link rel="icon" type="image/x-icon" href="{{$settings->get('branding.favicon')}}">
        @yield('progressive-app-tags')

        @yield('angular-styles')

        {{--custom theme begin--}}
        @if ($settings->get('branding.use_custom_theme'))
            <link rel="stylesheet" href="{{asset('storage/appearance/theme.css')}}">
        @endif
        {{--custom theme end--}}

        @if ($settings->has('custom_code.load_css'))
            <link rel="stylesheet" href="{{asset('storage/custom-code/custom-styles.css')}}">
        @endif
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-140902921-2"></script>
        <script>
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('set', {'user_id': '{!! Auth::id() !!}' }); // Set the user ID using signed-in user_id.
             gtag('config', 'UA-140902921-2');
        </script>
	</head>

    <body id="theme">
        <app-root>
            @yield('before-loaded-content')
        </app-root>

        <script>
            window.bootstrapData = "{!! $bootstrapData !!}";
        </script>

        @yield('angular-scripts')

        @if ($settings->has('custom_code.load_js'))
            <script src="{{asset('storage/custom-code/custom-scripts.js')}}"></script>
        @endif

        @if ($code = $settings->get('analytics.tracking_code'))
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

                ga('create', '{{ $settings->get('analytics.tracking_code') }}', 'auto');
                ga('send', 'pageview');
                ga('set', 'userId', '{!! Auth::id() !!}'); // Set the user ID using signed-in user_id.
            </script>
        @endif

        <noscript>You need to have javascript enabled in order to use <strong>{{config('app.name')}}</strong>.</noscript>
	</body>
</html>
