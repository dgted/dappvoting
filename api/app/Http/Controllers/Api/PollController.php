<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Poll;
use App\Models\Option;

class PollController extends Controller
{
     public function index()
    {
        //$poll = Poll::get();
        return Poll::with('options')->get();

        //return response()->json($poll);
    }
     public function active($con_id)
    {
        return Poll::with('options')
            ->where('con_id', $con_id)
              ->where('start_time', '<=', now())
             ->where('end_time', '>=', now())
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'title' => 'required|string|max:255',
        //     'description' => 'required|string',
        //     'options' => 'required|array|min:2',
        //     'options.*' => 'string|max:255',
        //     'end_date' => 'required|date|after:now',
        //     'solana_tx_id' => 'required|string' // Store the Solana transaction ID
        // ]);

        // if ($validator->fails()) {
        //     return response()->json($validator->errors(), 422);
        // }

        try {
            $poll = Poll::create([
                'title' => $request->title,
                'description' => $request->description,
                'options' => json_encode($request->options),
                'start_time' => $request->start_date,
                'end_time' => $request->end_date,
                'solana_tx_id' => $request->solana_tx_id,
                'con_id' => $request->con_id,
                'created_by' => ""
            ]);
             foreach ($request->options as $option) {
                if (!empty(trim($option))) {
                    $poll->options()->create([
                        'name' => $option,
                        'votes_count' => 0
                    ]);
                }
            }


            return response()->json($poll, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $poll = Poll::with('options')->findOrFail($id);
        return response()->json($poll);
    }

    public function results($id)
    {
        $poll = Poll::with(['options' => function($query) {
            $query->withCount('votes')->orderBy('votes_count', 'desc');
        }])->findOrFail($id);

        return response()->json($poll);
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
                $vote = Poll::findOrFail($id);
                $vote->delete();
                //$vote->option()->decrement('votes_count');
                return response()->json([
                    'message' => 'Vote deleted successfully',
                    'data' => $vote
                ], 200);
    }
}
