import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'


import { Typography } from '@mui/material';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {

  const { disconnect } = useWallet();
  const navigate = useNavigate(); // router hook for redirect

  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      navigate('/login'); // redirect to dashboard
    }
  }, [connected, navigate]);

  const Logout = async () => {
    try {
      await disconnect();
      localStorage.clear(); // clear the local storage
      navigate('/login'); // redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <Typography variant="h6" color="inherit" className="mt-2" component="div">
          <CIcon icon={cilUser} size="lg" />
        </Typography>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={() => Logout()} href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
