<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

use App\Models\Constituencie;
use App\Models\Vote;

class Constituencies extends Controller
{
    //

     public function index()
    {
      
        return Constituencie::get();

        //return response()->json($poll);
    }

    public function ResultByConstitution()
    {
        $groupedVotes = Vote::select(
            'upazilas.name as constituency',
            'upazilas.id as constituency_id',
            'options.symbol',
            'options.name as option_name',
            DB::raw('COUNT(votes.id) as votes_for_option')
        )
        ->join('polls', 'votes.poll_id', '=', 'polls.id')
        ->join('upazilas', 'polls.con_id', '=', 'upazilas.id')
        ->join('options', 'votes.option_id', '=', 'options.id')
        ->groupBy(
            'upazilas.name',
            'upazilas.id',
            'options.symbol',
            'options.name'
        )
        ->get();

        // Step 2: Group by constituency and find winner + total
        $winners = $groupedVotes
        ->groupBy('constituency_id')
       ->map(function ($group, $constituency_id) {
            $totalVotes = $group->sum('votes_for_option');
            $winner = $group->sortByDesc('votes_for_option')->first();

            return [
                'id' => $winner->constituency_id,
                'constituency' => $winner->constituency,
                'symbol' => $winner->symbol,
                'option_name' => $winner->option_name,
                'votes_for_option' => $winner->votes_for_option,
                'total_votes_in_constituency' => $totalVotes,
                'percentage' => round(($winner->votes_for_option / $totalVotes) * 100, 2) . '%'
            ];
        })
        ->values(); // reset index

    return response()->json($winners);   //
    }


    public function ResultByConstitutionId($id)
    {
        return Poll::with('options')
           ->withCount('votes_count') 
            ->where('con_id', $id)
            ->latest()
            ->get();
    
    }


}
