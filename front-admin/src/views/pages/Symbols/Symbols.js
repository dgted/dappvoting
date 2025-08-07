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

import { API_URL , PROGRAM_ID} from '../../../config'; 


const Symbols = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const [polls, setPolls] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [symbols, setsymbols] = useState([]);
    const [newPoll, setNewPoll] = useState({
        title: '',
        description: '',
        options: ['', ''],
        endDate: ''
    });

    // Fetch polls from your backend
    useEffect(() => {
        const fetchsymbols = async () => {
            try {
                // Replace with actual API call
                const response = await fetch(API_URL+'/api/symbols');
                console.log("Response:", response);
                const data = await response.json();
                setsymbols(data);
            } catch (error) {
                enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
            }
        };
        fetchsymbols();
    }, []);

  

    return ( 
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    List of Symbols
                </Typography>

            </Stack>

            {/* Poll List */}
            <CTable bordered hover responsive  spacing={0}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">symbols </CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col"></CTableHeaderCell> */}
                        
                    </CTableRow>
                </CTableHead>
                <CTableBody>

                    {symbols.map((symbol, idx) => (
                        <CTableRow key={idx}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>

                            <CTableDataCell>{symbol.name}</CTableDataCell>
                            {/* <CTableDataCell>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                       
                                    >
                                        Edit
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

export default Symbols;