<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Symbols;

class SymbolController extends Controller
{
    //

     public function index()
    {
        //$poll = Poll::get();
        return Symbols::get();

        //return response()->json($poll);
    }
}
