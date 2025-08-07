<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    //
    protected $fillable = [
        'poll_id',
        'option_id',
        'voter_wallet_address',
        'solana_transaction_id',
    ];


  public function option(): BelongsTo
{
    return $this->belongsTo(Option::class);  // vote.option_id → options.id
}

}
