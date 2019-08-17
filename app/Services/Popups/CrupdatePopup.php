<?php

namespace App\Services\Popups;

use App\Popup;
use Illuminate\Support\Arr;

class CrupdatePopup
{
    /**
     * @var Popup
     */
    private $popup;

    /**
     * @param Popup $popup
     */
    public function __construct(Popup $popup)
    {
        $this->popup = $popup;
    }

    /**
     * @param array $params
     * @param int|null $videoId
     * @return Popup
     */
    public function execute($params, $popupId = null)
    {
        if ($popupId) {
            $popup = $this->popup->findOrFail($popupId);
            $popup->fill($params)->save();
        } else {
            $params['views'] = 0;
            $popup = $this->popup->create($params);
        }

        return $popup;
    }
}