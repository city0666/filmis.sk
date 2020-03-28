<?php

namespace App\Console\Commands;

use App\Services\Admin\XMLTitleGenerator;
use Illuminate\Console\Command;

class GenerateXMLTitle extends Command
{
    /**
     * @var string
     */
    protected $signature = 'title:generate';

    /**
     * @var string
     */
    protected $description = 'Generate xml titles.';

    /**
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        return app(XMLTitleGenerator::class)->generate();
    }
}
