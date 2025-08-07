import { useState, useEffect } from 'react';
import {
    Box, Typography, Stack
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
    CTable,
    CTableBody, CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from '@coreui/react';
  


import axios from 'axios';

import { API_URL , PROGRAM_ID} from '../../../config'; // Adjust the import based on your project structure



const PollList = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const [polls, setPolls] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [constituencies, setConstituencies] = useState([]);
    const [newPoll, setNewPoll] = useState({
        title: '',
        description: '',
        options: ['', ''],
        endDate: ''
    });

    // Fetch polls from your backend
    useEffect(() => {
        const fetchConstituencies = async () => {
            try {
                // Replace with actual API call
                const response = await fetch(API_URL+'/api/constituencies');
                console.log("Response:", response);
                const data = await response.json();
                setConstituencies(data);
            } catch (error) {
                enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
            }
        };
        fetchConstituencies();
    }, []);

    const handleCreatePoll = async () => {
        if (!publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        try {
            // 1. First create on Solana blockchain
            const [pollPDA, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("poll"), publicKey.toBuffer(), Buffer.from(newPoll.title)],
                PROGRAM_ID
            );
            var signature = "";

     
            const response = await axios.post(API_URL+'/api/polls', {
                title: newPoll.title,
                description: newPoll.description,
                options: newPoll.options.filter(opt => opt.trim() !== ""), // Remove empty options
                end_date: newPoll.endDate,
                solana_tx_id: signature
            }, {
                headers: {
                    'Authorization': `Bearer `,
                    'Content-Type': 'application/json'
                }
            });


            setOpenDialog(false);
            setNewPoll({
                title: '',
                description: '',
                options: ['', ''],
                endDate: ''
            });

            alert("Poll created successfully our database!");
            window.location.reload(); // Reload to fetch new polls

        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };
    const handleDeletePoll = async (pollId) => {
        try {
            // Add your delete transaction logic here
            await fetch(`API_URL+'/api/polls/${pollId}`, { method: 'DELETE' });
            setPolls(polls.filter(poll => poll.id !== pollId));
            enqueueSnackbar('Poll deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete poll', { variant: 'error' });
        }
    };

  

    return ( 
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    List of Constituencies
                </Typography>

            </Stack>

            {/* Poll List */}
            <CTable bordered hover responsive  spacing={0}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Constituencies </CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col"></CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell> */}
                    </CTableRow>
                </CTableHead>
                <CTableBody>

                    {constituencies.map((constituencies, idx) => (
                        <CTableRow key={idx}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>

                            <CTableDataCell> <a href={'/results/'+constituencies.id}> {constituencies.name} </a></CTableDataCell>
                            {/* <CTableDataCell>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                       
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </CTableDataCell>
                            <CTableDataCell>
                                <Stack direction="row" spacing={1}>
                                   
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<Delete />}
                                       
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </CTableDataCell> */}
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>




        </Box>
    );
};

export default PollList;