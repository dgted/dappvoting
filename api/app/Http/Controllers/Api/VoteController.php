<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Poll;
use App\Models\Option;
use App\Models\Vote;
use App\Services\SolanaService;

class VoteController extends Controller
{
    protected $solanaService;

    public function __construct(SolanaService $solanaService)
    {
        $this->solanaService = $solanaService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'option_id' => 'required|exists:options,id',
            'solana_tx_id' => 'required|string',
            'voter_address' => 'required|string'
        ]);
        $poll = Poll::findOrFail($request->poll_id);
        $option = Option::findOrFail($request->option_id);
        $isValid =true;
        // Verify the Solana transaction
         if (!app()->environment('local') && !$request->is_mock) {
            $isValid = $this->solanaService->verifyVote(
                $request->solana_tx_id,
                $poll->solana_program_id,
                $request->voter_address
            );
            
            if (!$isValid) return response()->json(['error' => 'Invalid transaction'], 400);
        }

        if (!$isValid) {
            return response()->json(['error' => 'Invalid vote transaction'], 400);
        }

        // Check if wallet already voted
        $alreadyVoted = Vote::where('poll_id', $request->poll_id)
            ->where('voter_wallet_address', $request->voter_address)
            ->exists();

        if ($alreadyVoted) {
            return response()->json(['error' => 'Wallet already voted'], 400);
        }

        // Record the vote
        $vote = Vote::create([
            'poll_id' => $request->poll_id,
            'option_id' => $request->option_id,
            'voter_wallet_address' => $request->voter_address,
            'solana_transaction_id' => $request->solana_tx_id
        ]);

        // Update option votes count
        $option->increment('votes_count');

        return response()->json([
            'message' => 'Vote recorded successfully',
            'vote' => $vote
        ], 201);
    }

     public function  allVotes()
    {
        $votes = Vote::with('option')->get();
        return response()->json($votes);
    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
