<?php
// app/Http/Controllers/Api/VotingController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Services\SolanaService;
use Illuminate\Http\Request;

class VotingController extends Controller
{
    public function __construct(
        protected SolanaService $solana
    ) {}

    public function createPoll(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*' => 'string|max:255'
        ]);

        $poll = Poll::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'solana_program_id' => config('services.solana.program_id'),
        ]);

        return response()->json([
            'poll' => $poll,
            'transaction' => $this->solana->initializePoll(
                $poll->id,
                $validated['options']
            )
        ]);
    }

    public function verifyVote(Request $request, Poll $poll)
    {
        $request->validate([
            'transaction_id' => 'required|string',
            'option_index' => 'required|integer'
        ]);

        return $this->solana->verifyVote(
            $request->transaction_id,
            $poll->id,
            $request->option_index
        );
    }
}