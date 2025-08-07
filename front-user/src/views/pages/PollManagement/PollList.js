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
const PROGRAM_ID = new PublicKey('22CajwZNPM3JbcrCpdgPi4a2V3YQ4GF8EQiACkgTHsMg');

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

import axios from 'axios';


const PollList = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [polls, setPolls] = useState([]);

  const [constituencies, setConstituencies] = useState([]);


  const [openDialog, setOpenDialog] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    endDate: '',
    con_id: ''
  });

  // Fetch polls from your backend
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('http://localhost:8000/api/polls');
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        enqueueSnackbar('Failed to fetch polls', { variant: 'error' });
      }
    };


    const fetchConstituencies = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`http://localhost:8000/api/constituencies`);
        const data = await response.json();
        setConstituencies(data);
      } catch (error) {
        enqueueSnackbar('Failed to fetch constituencies', { variant: 'error' });
      }
    };

    fetchConstituencies();

    fetchPolls();
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
        con_id: newPoll.con_id,
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
        con_id: '',
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
          Poll Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create Poll
        </Button>
      </Stack>

      {/* Poll List */}
      <List sx={{ mb: 4 }}>
        {polls.map((poll) => (
          <Card key={poll.id} sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{poll.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={new Date(poll.end_time).toLocaleDateString()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />

                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {poll.description}
              </Typography>

              <Box sx={{ mt: 2 }}>

                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Symbol </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Symbol Name</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>


                    {poll.options.map((option, idx) => (


                      <CTableRow key={idx}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>{""}</CTableDataCell>
                        <CTableDataCell>{option.name}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>

                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => handleDeletePoll(poll.id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </List>

      {/* Create Poll Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Poll</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Poll Title"
            fullWidth
            variant="outlined"
            value={newPoll.title}
            onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newPoll.description}
            onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newPoll.endDate}
            onChange={(e) => setNewPoll({ ...newPoll, endDate: e.target.value })}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">Constituencies</InputLabel>
            <Select
              margin="dense"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newPoll.con_id}
              label="Age"
              onChange={(e) => setNewPoll({ ...newPoll, con_id: e.target.value })}
            >
              <MenuItem value={10}>..</MenuItem>
              {constituencies.map((thanaItem) => (
                <MenuItem key={thanaItem.id} value={thanaItem.id}>
                  {thanaItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



          <Typography variant="subtitle1" className='mt-3'>Options</Typography>
          {newPoll.options.map((option, index) => (
            <TextField
              key={index}
              margin="dense"
              label={`Option ${index + 1}`}
              fullWidth
              variant="outlined"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
          <Button
            startIcon={<Add />}
            onClick={handleAddOption}
          >
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePoll}
            disabled={!newPoll.title || newPoll.options.some(opt => !opt)}
          >
            Create Poll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PollList;