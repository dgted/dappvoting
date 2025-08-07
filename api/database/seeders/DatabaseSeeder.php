<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


        $con = 1;

       for ($i = 1; $i <= 300; $i++) {
            $pollId = DB::table('polls')->insertGetId([
                'title' => "Constituencies $i",
                'description' => "Description of poll $i",
                'solana_program_id' => null,
                'solana_tx_id' => null,
                'created_by' => 'admin',
                'options' => null,
                'con_id' =>  $con,
                'start_time' => Carbon::now(),
                'end_time' => Carbon::now()->addDays(3),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);



            if ($con < 64) {
                $con++;
            } else {
                $con = 1;
            }   

            foreach (['A', 'B', 'C', 'D'] as $symbol) {
                DB::table('options')->insert([
                    'poll_id' => $pollId,
                    'name' => "Option $symbol$i",
                    'symbol' => $symbol,
                    'votes_count' => 0,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
