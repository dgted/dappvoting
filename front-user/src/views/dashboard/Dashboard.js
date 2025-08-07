
import { useState, useEffect } from 'react';
import {
    Grid,   
    Box, Typography, Card, CardContent, Button, Divider, Chip,
    RadioGroup, FormControlLabel, Radio, CircularProgress,
} from '@mui/material';
import { HowToVote } from '@mui/icons-material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';



import { CheckCircle } from '@mui/icons-material';

import axios from 'axios';
import { API_URL , PROGRAM_ID} from '../../../config'; 

const Dashboard = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState({});
    const [voteStatus, setVoteStatus] = useState({});
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(0);

    const con_id = localStorage.con_id ? localStorage.getItem('con_id') : 0;


    // Fetch active polls from your backend
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get(API_URL+'/api/polls/active/'+con_id);
                setPolls(response.data);
            } catch (err) {
                setError('Failed to fetch polls');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const getBalance = async () => {
            if (publicKey) {
                const balance = await connection.getBalance(publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
        };
        getBalance();

        fetchPolls();
    }, [publicKey, connection]);


    const updatebackendVote = async (pollId, optionId, signature) => {
        try {
            await axios.post(API_URL+'/api/votes', {
                poll_id: pollId,
                option_id: optionId,
                solana_tx_id: signature,
                voter_address: publicKey.toString()
            });

            setVoteStatus(prev => ({ ...prev, [pollId]: 'success' }))

        } catch (error) {
            setVoteStatus(prev => ({ ...prev, [pollId]: 'error' }))
            alert(`Already taken vote form this wallet!`);
            throw new Error('Failed to update vote in backend');
        }

    };



    const handleVote = async (pollId) => {
        if (!publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        try {
            if (!publicKey) throw new Error('Wallet not connected');

            // For local development - airdrop SOL if balance is low
            if (balance < 0.1) {
                await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
            }

            console.log("pub", publicKey);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: PROGRAM_ID,
                    lamports: 1000 // Minimal fee
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');




            updatebackendVote(pollId, selectedOption[pollId], signature);



        } catch (error) {
            console.error("Vote failed:", error);
            setVoteStatus(prev => ({ ...prev, [pollId]: 'error' }));

            // User-friendly error messages
            let message = error.message;
            if (error.logs) {
                const errorLog = error.logs.find(l => l.includes("Error Message:"));
                if (errorLog) message = errorLog.split("Error Message:")[1].trim();
            }

            alert(`Vote failed: ${message}`);
        }
    };
   


    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Your Active Polls
            </Typography>

            {polls.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No active polls available
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {polls.map(poll => (
                        <Grid
                            item
                            key={poll.id}
                            xs={12}      // Full width on extra small screens
                            sm={6}       // 2 columns on small screens
                            md={4}       // 3 columns on medium screens
                            lg={3}       // 4 columns on large screens
                            xl={2}       // 6 columns on extra large screens
                        >
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 3,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 1
                                    }}>
                                        <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                                            {poll.title}
                                        </Typography>
                                        <Chip
                                            label={`Ends: ${new Date(poll.end_time).toLocaleDateString()}`}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {poll.description}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <RadioGroup
                                        value={selectedOption[poll.id] || ''}
                                        onChange={(e) => setSelectedOption({
                                            ...selectedOption,
                                            [poll.id]: parseInt(e.target.value)
                                        })}
                                    >
                                        {poll.options.map(option => (
                                            <Box
                                                key={option.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                    p: 1,
                                                    bgcolor: selectedOption[poll.id] === option.id ? 'action.hover' : 'background.paper',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={option.id}
                                                    control={<Radio size="small" />}
                                                    label={
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                            {option.name}
                                                        </Typography>
                                                    }
                                                    disabled={voteStatus[poll.id] === 'success'}
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                                                    {option.votes_count} votes
                                                </Typography>
                                            </Box>
                                        ))}
                                    </RadioGroup>

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: 2,
                                        pt: 1,
                                        borderTop: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        {voteStatus[poll.id] === 'success' ? (
                                            <Chip
                                                icon={<CheckCircle fontSize="small" />}
                                                label="Voted!"
                                                color="success"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <Button
                                                variant="contained"
                                                startIcon={<HowToVote />}
                                                onClick={() => handleVote(poll.id)}
                                                disabled={
                                                    !selectedOption[poll.id] ||
                                                    voteStatus[poll.id] === 'processing'
                                                }
                                                size="small"
                                                sx={{
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    px: { xs: 1, sm: 2 }
                                                }}
                                            >
                                                {voteStatus[poll.id] === 'processing' ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    'Vote'
                                                )}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;