<?php

namespace App;

use Common\Auth\BaseUser;
use Illuminate\Support\Collection;
use Carbon\Carbon;

/**
 * @property-read Collection|ListModel[] $watchlist
 */
class User extends BaseUser
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function watchlist()
    {
        return $this->hasOne(ListModel::class)
            ->where('system', 1)
            ->where('name', 'watchlist');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ratings()
    {
        return $this->hasMany(Review::class)
            ->select('id', 'reviewable_id', 'reviewable_type', 'score')
            ->limit(500);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logs()
    {
        return $this->hasMany(Log::class, 'user_id', 'id')
            ->whereBetween('created_at', array(Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()));
    }
}
