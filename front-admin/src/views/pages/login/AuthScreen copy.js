import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

import './wallet.css'
import '@solana/wallet-adapter-react-ui/styles.css';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthScreen = () => {
    const { connected } = useWallet(); // gets the connection status
    const navigate = useNavigate(); // router hook for redirect

    useEffect(() => {
        if (connected) {
            if(localStorage.con_id){
                navigate('/dashboard'); // redirect to dashboard
            }else{
                navigate('/register'); // redirect to register
            }
            
        }
    }, [connected, navigate]);
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 3
                }}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                        Design and Development of a Blockchain-based Electronic Voting System
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Connect your wallet to access the decentralized voting platform
                    </Typography>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <WalletMultiButton

                    />
                </motion.div>
            </Box>
        </Container>
    );
};

export default AuthScreen;