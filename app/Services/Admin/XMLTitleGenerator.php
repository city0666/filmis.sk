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
            '<movies>'."\n";
        

        $titles = Title::join('videos', function ($q) {
            $q->on('titles.id', '=', 'videos.title_id')
                ->where('videos.type', '=', 'embed');
        })
        ->with('videos')
        ->where('is_series', false)
        ->limit($this->queryLimit)
        ->get();

        foreach ($titles as $title) {
            $string .= '<film>';
            $string .= '<id>'.$title->id.'</id>';
            $string .= '<name>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->name).'</name>';
            $string .= '<release_date>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->release_date).'</release_date>';
            $string .= '<year>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->year).'</year>';
            $string .= '<description>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->description).'</description>';
            $string .= '<tagline>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->tagline).'</tagline>';
            $string .= '<poster>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->poster).'</poster>';
            $string .= '<backdrop>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->backdrop).'</backdrop>';
            $string .= '<runtime>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->runtime).'</runtime>';
            $string .= '<trailer>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->trailer).'</trailer>';
            $string .= '<budget>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->budget).'</budget>';
            $string .= '<revenue>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->revenue).'</revenue>';
            $string .= '<views>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->views).'</views>';
            $string .= '<popularity>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->popularity).'</popularity>';
            $string .= '<imdb_id>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->imdb_id).'</imdb_id>';
            $string .= '<tmdb_id>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->tmdb_id).'</tmdb_id>';
            $string .= '<season_count>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->season_count).'</season_count>';
            $string .= '<fully_synced>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->fully_synced).'</fully_synced>';
            $string .= '<allow_update>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->allow_update).'</allow_update>';
            $string .= '<created_at>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->created_at).'</created_at>';
            $string .= '<updated_at>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->updated_at).'</updated_at>';
            $string .= '<language>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->language).'</language>';
            $string .= '<country>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->country).'</country>';
            $string .= '<original_title>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->original_title).'</original_title>';
            $string .= '<affiliate_link>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->affiliate_link).'</affiliate_link>';
            $string .= '<certification>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->certification).'</certification>';
            $string .= '<episode_count>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->episode_count).'</episode_count>';
            $string .= '<series_ended>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->series_ended).'</series_ended>';
            $string .= '<adult>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->adult).'</adult>';
            $string .= '<thumbnail>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->thumbnail).'</thumbnail>';
            $string .= '<url>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->url).'</url>';
            $string .= '<quality>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->quality).'</quality>';
            $string .= '<title_id>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->title_id).'</title_id>';
            $string .= '<episode_id>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->episode_id).'</episode_id>';
            $string .= '<season>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->season).'</season>';
            $string .= '<episode>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->episode).'</episode>';
            $string .= '<source>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->source).'</source>';
            $string .= '<negative_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->negative_votes).'</negative_votes>';
            $string .= '<positive_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->positive_votes).'</positive_votes>';
            $string .= '<reports>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->reports).'</reports>';
            $string .= '<approved>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->approved).'</approved>';
            $string .= '<subtitles>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->subtitles).'</subtitles>';
            $string .= '<rating>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->rating).'</rating>';

            $string .= '<genres>';
            for ($i = 0; $i < count($title->genres); $i++) {
                $string .= preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $title->genres[$i]->display_name);
                if ($i + 1 != count($title->genres)) {
                    $string .= ', ';
                }
            }
            $string .= '</genres>';

            $string .= '<videos>';
            foreach ($title->videos as $video) {
                $string .= '<video>';
                $string .= '<video_name>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->name).'</video_name>';
                $string .= '<video_url>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->url).'</video_url>';
                $string .= '<video_type>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->type).'</video_type>';
                $string .= '<video_quality>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->quality).'</video_quality>';
                $string .= '<video_source>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->source).'</video_source>';
                $string .= '<video_negative_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->negative_votes).'</video_negative_votes>';
                $string .= '<video_positive_votes>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->positive_votes).'</video_positive_votes>';
                $string .= '<video_approved>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->approved).'</video_approved>';
                $string .= '<video_order>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->order).'</video_order>';
                $string .= '<video_language>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->language).'</video_language>';
                $string .= '<video_subtitles>'.preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $video->subtitles).'</video_subtitles>';
                $string .= '</video>';
            }
            $string .= '</videos>';

            $string .= '</film>';
        }

        $string .= '</movies>';

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
