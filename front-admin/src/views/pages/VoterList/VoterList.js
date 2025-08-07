
import { useState, useEffect } from 'react';
import {
    Box, Typography, Stack
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    CTable,
    CTableBody, CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from '@coreui/react';
  


import { API_URL } from '../../../config';

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
                const response = await fetch(API_URL+'/api/users');
                console.log("Response:", response);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
            }
        };
        fetchUsers();
    }, []);

 

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

                            <CTableDataCell>{Users?.wallet_address}</CTableDataCell>
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