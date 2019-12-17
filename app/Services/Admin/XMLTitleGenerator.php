<?php namespace App\Services\Admin;

use Common\Core\Contracts\AppUrlGenerator;
use App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Storage;
use Carbon\Carbon;
use Common\Settings\Settings;
use App\Title;

class XMLTitleGenerator {

    /**
     * @var Settings
     */
    private $settings;

    /**
     * @var Filesystem
     */
    private $fs;

    /**
     * @var integer
     */
    private $queryLimit = 6000;

    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var string
     */
    private $storageUrl;

    /**
     * Current date and time string.
     *
     * @var string
     */
    private $currentDateTimeString;

    /**
     * Xml sitemap string.
     *
     * @var string|boolean
     */
    private $xml = false;

    /**
     * @var AppUrlGenerator
     */
    private $urlGenerator;

    /**
     * @param Settings $settings
     * @param Filesystem $fs
     * @param AppUrlGenerator $urlGenerator
     */
    public function __construct(Settings $settings, Filesystem $fs, AppUrlGenerator $urlGenerator)
    {
        $this->fs = $fs;
        $this->settings = $settings;
        $this->urlGenerator = $urlGenerator;
        $this->baseUrl = url('') . '/';
        $this->storageUrl = url('storage') . '/';
        $this->currentDateTimeString = Carbon::now()->toDateTimeString();

        ini_set('memory_limit', '160M');
        ini_set('max_execution_time', 7200);
    }

    /**
     * Create a sitemap index from all individual sitemaps.
     *
     * @param array $index
     * @return void
     */
    private function makeIndex($index)
    {
    }

    /**
     * @return bool
     */
    public function generate()
    {
        $string = '<?xml version="1.0" encoding="UTF-8"?>'."\n".
            '<Titles>'."\n";
        
        $titles = Title::whereHas('videos', function ($q) {
            $q->where('videos.source', '=', 'local')
                ->where('videos.type', '=', 'embed');
        })
        ->with('videos', 'genres', 'credits')
        ->where('is_series', false)
        ->limit($this->queryLimit)
        ->get();

        foreach ($titles as $title) {
            $string .= '<Film>';
            $string .= '<Type>Movie</Type>';
            $string .= '<Certification>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->certification).'</Certification>';
            $string .= '<Title>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->name).'</Title>';
            $string .= '<OriginalTitle>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->original_title).'</OriginalTitle>';
            $string .= '<CzTitle/>';
            $string .= '<Tagline>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->tagline).'</Tagline>';
            $string .= '<Poster>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', str_replace('https://image.tmdb.org/t/p/original', '', $title->poster)).'</Poster>';
            $string .= '<MainBackdrop>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->backdrop).'</MainBackdrop>';
            $string .= '<Backdrops/>';
            $string .= '<ID-Filmis>'.$title->id.'</ID-Filmis>';
            $string .= '<ID-IMDb>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->imdb_id).'</ID-IMDb>';
            $string .= '<IMDbVoteAverage>'.$title->local_vote_average.'</IMDbVoteAverage>';
            $string .= '<IMDbVoteCount></IMDbVoteCount>';
            $string .= '<ID-TMDb>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->tmdb_id).'</ID-TMDb>';
            $string .= '<TMDbVoteAverage>'.$title->tmdb_vote_average.'</TMDbVoteAverage>';
            $string .= '<TMDbVoteCount>'.$title->tmdb_vote_count.'</TMDbVoteCount>';
            $string .= '<Budget>'.$title->budget.'</Budget>';
            $string .= '<Revenue>'.$title->revenue.'</Revenue>';
            $string .= '<RunTime>'.$title->runtime.'</RunTime>';
            $string .= '<Country>'.'USA'.'</Country>';
            $string .= '<Genres>';
            for ($i = 0; $i < count($title->genres); $i++) {
                $string .= preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->genres[$i]->display_name);
                if ($i + 1 != count($title->genres)) {
                    $string .= ', ';
                }
            }
            $string .= '</Genres>';
            if (!empty($title->credits)) {
                foreach ($title->credits as $credit) {
                    if (!empty($credit->pivot) && $credit->pivot->department == 'directing') {
                        $string .= '<DirectorName>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $credit->name).'</DirectorName>';
                        $string .= '<DirectorPhoto>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', str_replace('https://image.tmdb.org/t/p/original', '', $credit->poster)).'</DirectorPhoto>';
                        $string .= '<DirectorNamePhoto>['.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', str_replace('https://image.tmdb.org/t/p/original', '', $credit->poster)).';'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $credit->name).']</DirectorNamePhoto>';
                        break;
                    }
                }
    
                $string .= '<Cast>';
                foreach ($title->credits as $credit) {
                    if (!empty($credit->pivot) && $credit->pivot->department == 'cast') {
                        $string .= '['.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', str_replace('https://image.tmdb.org/t/p/original', '', $credit->poster)).';'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $credit->name).','.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $credit->pivot->character).']';
                    }
                }
                $string .= '</Cast>';
            }



            $string .= '<Year>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->year).'</Year>';
            $string .= '<ReleaseDate>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->release_date).'</ReleaseDate>';
            $string .= '<Plot>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->description).'</Plot>';
            

            $string .= '<IframeVideos>';
            foreach ($title->videos as $video) {
                $string .= '<Video>';
                $string .= '<VideoName>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->name).'</VideoName>';
                $string .= '<VideoUrl>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->url).'</VideoUrl>';
                $string .= '<VideoType>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->type).'</VideoType>';
                $string .= '<VideoQuality>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->quality).'</VideoQuality>';
                $string .= '<VideoSource>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->source).'</VideoSource>';
                $string .= '<VideoNegative_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->negative_votes).'</VideoNegative_votes>';
                $string .= '<VideoPositive_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->positive_votes).'</VideoPositive_votes>';
                $string .= '<VideoApproved>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->approved).'</VideoApproved>';
                $string .= '<VideoOrder>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->order).'</VideoOrder>';
                $string .= '<VideoLanguage>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->language).'</VideoLanguage>';
                $string .= '<VideoSubtitles>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->subtitles).'</VideoSubtitles>';
                $string .= '</Video>';
            }
            $string .= '</IframeVideos>';

            $string .= '</Film>';
        }

        $string .= '</Titles>';

        Storage::disk('public')->put('titles/titles.xml', $string);

        return true;
    }

    /**
     * @param $config
     * @return Model
     */
    private function getModel($config)
    {
        $model = app($config['model']);

        if ($wheres = Arr::get($config, 'wheres')) {
            $model->where($wheres);
        }

        $model->select($config['columns']);

        return $model;
    }

    /**
     * @param Model $model
     * @param string $name
     * @return integer
     */
    private function createSitemapForResource($model, $name)
    {
        $model->orderBy('id')
            ->chunk($this->queryLimit, function($records) use($name) {
                foreach ($records as $record) {
                    $this->addNewLine(
                        $this->getModelUrl($record),
                        $this->getModelUpdatedAt($record),
                        $name
                    );
                }
            });

        // check for unused items
        if ($this->xml) {
            $this->save("$name-sitemap-{$this->sitemapCounter}");
        }

        $index = $this->sitemapCounter - 1;

        $this->sitemapCounter = 1;
        $this->lineCounter = 0;

        return $index;
    }

    /**
     * @param Model $model
     * @return string
     */
    private function getModelUrl($model)
    {
        $namespace = get_class($model);
        $name = strtolower(substr($namespace, strrpos($namespace, '\\') + 1));
        return $this->urlGenerator->$name($model);
    }

    /**
     * Add new url line to xml string.
     *
     * @param string $url
     * @param string $updatedAt
     * @param string $name
     */
    private function addNewLine($url, $updatedAt, $name = null)
    {
        if ($this->xml === false) {
            $this->startNewXmlFile();
        }

        if ($this->lineCounter === 50000) {
            $this->save("$name-sitemap-{$this->sitemapCounter}");
            $this->startNewXmlFile();
        }

        $updatedAt = $this->formatDate($updatedAt);

        $line = "\t"."<url>\n\t\t<loc>".htmlspecialchars($url)."</loc>\n\t\t<lastmod>".$updatedAt."</lastmod>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>1.00</priority>\n\t</url>\n";

        $this->xml .= $line;

        $this->lineCounter++;
    }

    /**
     * @param string $date
     * @return string
     */
    private function formatDate($date = null)
    {
        if ( ! $date) $date = $this->currentDateTimeString;
        return date('Y-m-d\TH:i:sP', strtotime($date));
    }

    /**
     * @param Model $model
     * @return string
     */
    private function getModelUpdatedAt($model)
    {
        return ( ! $model->updated_at || $model->updated_at == '0000-00-00 00:00:00')
            ? $this->currentDateTimeString
            : $model->updated_at;
    }

    /**
     * Generate sitemap and save it to a file.
     *
     * @param string $fileName
     */
    private function save($fileName)
    {
        $this->xml .= "\n</urlset>";

        Storage::disk('public')->put("sitemaps/$fileName.xml", $this->xml);

        $this->xml = false;
        $this->lineCounter = 0;
        $this->sitemapCounter++;
    }


    /**
     * Create a sitemap for static pages.
     *
     * @return void
     */
    private function makeStaticMap()
    {
        $this->addNewLine($this->baseUrl, $this->currentDateTimeString);
        $this->addNewLine($this->baseUrl . 'browse?type=series', $this->currentDateTimeString);
        $this->addNewLine($this->baseUrl . 'browse?type=movie', $this->currentDateTimeString);
        $this->addNewLine($this->baseUrl . 'people', $this->currentDateTimeString);
        $this->addNewLine($this->baseUrl . 'news', $this->currentDateTimeString);

        $this->save("static-urls-sitemap");
    }

}
