
import { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Button,
    TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, List, ListItem, ListItemText,
    FormControl, InputLabel, Select, MenuItem,
    IconButton, Divider, Chip, Stack
} from '@mui/material';
import { Add, Delete, Edit, HowToVote } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, TransactionInstruction, PublicKey, Transaction } from '@solana/web3.js';
import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
  
const PROGRAM_ID = new PublicKey('22CajwZNPM3JbcrCpdgPi4a2V3YQ4GF8EQiACkgTHsMg');

import axios from 'axios';
import { CTab } from '@coreui/react';


const PollList = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const [polls, setPolls] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [Users, setUsers] = useState([]);
    const [newPoll, setNewPoll] = useState({
        title: '',
        description: '',
        options: ['', ''],
        endDate: ''
    });

    // Fetch polls from your backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Replace with actual API call
                const response = await fetch('http://localhost:8000/api/users');
                console.log("Response:", response);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
            }
        };
        fetchUsers();
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

            // ... (your existing Solana transaction code) ...

            // const signature = await sendTransaction(transaction, connection);
            // await connection.confirmTransaction(signature, "confirmed");

            // 2. Then save to Laravel MySQL
            const response = await axios.post('http://127.0.0.1:8000/api/polls', {
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
            await fetch(`http://127.0.0.1:8000/api/polls/${pollId}`, { method: 'DELETE' });
            setPolls(polls.filter(poll => poll.id !== pollId));
            enqueueSnackbar('Poll deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete poll', { variant: 'error' });
        }
    };

    const handleAddOption = () => {
        setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...newPoll.options];
        newOptions[index] = value;
        setNewPoll({ ...newPoll, options: newOptions });
    };

    return ( 
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Voter List
                </Typography>

            </Stack>

            {/* Poll List */}
            <CTable bordered hover responsive  spacing={0}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Wallet Address </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">NID</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>

                    {Users.map((Users, idx) => (
                        <CTableRow key={idx}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>

                            <CTableDataCell>{Users?.wallet}</CTableDataCell>
                            <CTableDataCell>{Users?.name}</CTableDataCell>
                            <CTableDataCell>{Users?.nid}</CTableDataCell>
                           
                            
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>




        </Box>
    );
};

export default PollList;