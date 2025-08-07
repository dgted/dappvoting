<?php

// app/Models/Poll.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
     protected $fillable = [
        'title',
        'description',
        'options',
        'start_time',
        'end_time',
        'solana_tx_id',
        'con_id',
        'created_by'
    ];

    public function options(): HasMany
    {
        return $this->hasMany(Option::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
}