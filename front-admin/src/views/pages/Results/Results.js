import { useState, useEffect } from 'react';
import {
    Grid, Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, Chip, Stack
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


import { API_URL } from '../../../config'; // Adjust the import based on your project structure

const Results = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const [polls, setPolls] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [constituencies, setConstituencies] = useState([]);

    const [conName, setConName] = useState("");


    const [loading, setLoading] = useState(true);


    const [constituency, setConstituency] = useState([]);

    const [newPoll, setNewPoll] = useState({
        title: '',
        description: '',
        options: ['', ''],
        endDate: ''
    });
    //API_URL+'/
    // Fetch polls from your backend
    useEffect(() => {
        const fetchConstituencies = async () => {
            try {
                // Replace with actual API call
                const response = await fetch(API_URL+'/api/results');
                console.log("Response:", response);
                const data = await response.json();
                setConstituencies(data);
            } catch (error) {
                enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
            }
        };
        fetchConstituencies();
    }, []);


    const showResults = async (constituencyId , conName) => {
        // Logic to show results for the selected constituency
        console.log("Showing results for constituency:", constituencyId);
        // You can navigate to a results page or display results in a dialog
        setOpenDialog(true);
        setConName(conName);

        setLoading(true);
        setConstituency([]); // Reset constituency data before fetching new data
        try {
            // Replace with actual API call
            const response = await fetch(API_URL+'/api/results/' + constituencyId);
            console.log("Response:", response);
            const data = await response.json();
            setConstituency(data);
            console.log("Constituency Data:", data);
            setLoading(false);
        } catch (error) {
            enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
        }


    }


    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Results By Constituencies
                </Typography>

            </Stack>

            {/* Poll List */}
            <CTable bordered hover responsive spacing={0}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Constituencies </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Count Vote</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Results</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>

                    {constituencies.map((constituencies, idx) => (
                        <CTableRow key={idx}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>

                            <CTableDataCell>  {constituencies.constituency} </CTableDataCell>

                            <CTableDataCell>
                                {constituencies.total_votes_in_constituency}
                            </CTableDataCell>

                            <CTableDataCell>
                                <Button variant="contained" color="primary" onClick={() => showResults(constituencies.id , constituencies.constituency)}>
                                    View
                                </Button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>


            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xl" padding={2}>
                {loading ? (
                    <DialogContent>
                        <Typography>Loading results...</Typography>
                    </DialogContent>
                ) : (
                    <>
                        <DialogTitle>Results for {conName}</DialogTitle>
                        <Grid container spacing={3} padding={3}>
                            {constituency.map(poll => (
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




                                            {poll.options.map(option => (
                                                <Box
                                                    key={option.id}

                                                >
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        {option.name} - {option.votes_count} votes
                                                    </Typography>
                                                    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: `${(option.votes_count / poll.votes_count) * 100}%`,
                                                                backgroundColor: 'primary.main',
                                                                height: 8,
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" sx={{ textAlign: 'right', color: 'text.secondary' }}>
                                                        {((option.votes_count / poll.votes_count) * 100).toFixed(2)}%
                                                    </Typography>
                                                </Box>
                                            ))}


                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                mt: 2,
                                                pt: 1,
                                                borderTop: '1px solid',
                                                borderColor: 'divider'
                                            }}>

                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}




                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>




        </Box>
    );
};

export default Results;