<?php
// app/Services/SolanaService.php
// app/Services/SolanaService.php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SolanaService
{
     protected $client;
    protected $rpcUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->rpcUrl = 'http://localhost:8899'; // Local validator
    }

    public function verifyVote($transactionId, $programId, $walletAddress)
    {
        try {
            $response = $this->client->post($this->rpcUrl, [
                'json' => [
                    'jsonrpc' => '2.0',
                    'id' => 1,
                    'method' => 'getTransaction',
                    'params' => [
                        $transactionId,
                        'jsonParsed'
                    ]
                ],
                'timeout' => 5 // Shorter timeout for local
            ]);

            $data = json_decode($response->getBody(), true);

            return $this->validateLocalTransaction($data, $programId, $walletAddress);

        } catch (\Exception $e) {
            Log::error("Local validator error: " . $e->getMessage());
            return false;
        }
    }
      protected function validateLocalTransaction($data, $programId, $walletAddress)
    {
        // Simplified validation for local development
        return isset($data['result']) && 
               $data['result']['meta']['err'] === null &&
               in_array($programId, $data['result']['transaction']['message']['accountKeys']);
    }

    protected function checkWalletInvolved($transactionData, $walletAddress)
    {
        // Implement actual wallet verification logic
        // This is a placeholder - adjust based on your Solana program
        return in_array($walletAddress, $transactionData['result']['transaction']['message']['accountKeys']);
    }
}