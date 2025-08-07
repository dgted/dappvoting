<?php

use App\Http\Controllers\Api\PollController;
use App\Http\Controllers\Api\VoteController;

use App\Http\Controllers\Constituencies;

use App\Http\Controllers\Api\SymbolController;
use App\Http\Controllers\Api\UsersController;



use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');



Route::delete('polls/{pollid}', [PollController::class, 'destroy']);


Route::post('votes', [VoteController::class, 'store']);
Route::get('polls', [PollController::class, 'index']);
Route::post('polls', [PollController::class, 'store']);
Route::get('polls/active/{con_id}', [PollController::class, 'active']);


Route::get('constituencies', [Constituencies::class, 'index']);

Route::get('results', [Constituencies::class, 'ResultByConstitution']);


Route::get('results/{id}', [Constituencies::class, 'ResultByConstitutionId']);




Route::get('symbols',[SymbolController::class, 'index']);

Route::get('users',[UsersController::class, 'index']);

Route::post('users',[UsersController::class, 'store']);

Route::get('votes',[VoteController::class, 'allVotes']);





// Route::post('/faucet', function (Request $request) {
//     $request->validate(['wallet' => 'required|string']);

//     $client = new \GuzzleHttp\Client();
//     $response = $client->post('http://localhost:9900', [
//         'json' => [
//             'jsonrpc' => '2.0',
//             'id' => 1,
//             'method' => 'requestAirdrop',
//             'params' => [
//                 $request->wallet,
//                 1000000000 // 1 SOL in lamports
//             ]
//         ]
//     ]);

//     return response()->json(json_decode($response->getBody()));
// });