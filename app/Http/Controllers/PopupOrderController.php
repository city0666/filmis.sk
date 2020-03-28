<?php

namespace App\Http\Controllers;

use Common\Core\Controller;
use DB;
use Illuminate\Http\Request;

class PopupOrderController extends Controller
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @param Popup $popup
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param int $popupId
     * @return \Illuminate\Http\JsonResponse
     */
    public function changeOrder() {
        $this->validate($this->request, [
            'ids'   => 'array|min:1',
            'ids.*' => 'integer'
        ]);

        $queryPart = '';
        foreach($this->request->get('ids') as $order => $id) {
            $queryPart .= " when id=$id then $order";
        }

        DB::table('popups')
            ->whereIn('id', $this->request->get('ids'))
            ->update(['order' => DB::raw("(case $queryPart end)")]);

        return $this->success();
    }
}
