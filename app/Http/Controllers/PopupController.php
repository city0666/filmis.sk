<?php

namespace App\Http\Controllers;

use App\Services\Popups\CrupdatePopup;
use App\Popup;
use Common\Core\Controller;
use Common\Database\Paginator;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;

class PopupController extends Controller
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @var Popup
     */
    private $popup;

    /**
     * @param Request $request
     * @param Popup $popup
     */
    public function __construct(Request $request, Popup $popup)
    {
        $this->request = $request;
        $this->popup = $popup;
    }

    public function index() {
        // $this->authorize('index', Popup::class);

        // $paginator = (new Paginator($this->popup));
        $popups = Popup::orderBy('order', 'ASC')->get();
        // $pagination = $paginator->paginate($this->request->all());
        return $this->success(['popups' => $popups]);
    }

    public function store() {
        // $this->authorize('store', Popup::class);

        $this->validate($this->request, [
            'name' => 'required|string|min:3|max:250',
            'url' => 'required|max:250',
        ]);

        $popup = app(CrupdatePopup::class)->execute($this->request->all());

        return $this->success(['popup' => $popup]);
    }

    public function update($id) {
        // $this->authorize('update', Popup::class);

        $this->validate($this->request, [
            'name' => 'required|string|min:3|max:250',
            'url'  => 'required:max:250',
        ]);

        $popup = app(CrupdatePopup::class)->execute($thi->request->all(), $id);

        return $this->success(['popup' => $popup]);
    }

    public function destroy() {
        // $this->authorize('destroy', Popup::class);

        $this->popup->whereIn('id', $this->request->get('ids'))->delete();

        return $this->success();
    }
}
