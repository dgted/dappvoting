import { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilBarcode } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { API_URL } from '../../../config'; 

import axios from 'axios';
const Register = () => {
  const navigate = useNavigate(); // router hook for redirect
  const { publicKey, sendTransaction } = useWallet();
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [name, setName] = useState([]);

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

  const Go = async (e) => {

    try {
      await axios.post(API_URL+'/api/users', {
        name: name,
        con_id: selectedConstituency,
        wallet_address: publicKey.toString(),
      });


    } catch (error) {

      alert(`Something went wrong: ${error.message}`);
      throw new Error('Failed to update vote in backend');
    }

    navigate('/dashboard'); // redirect to dashboard
  };
  const handleChange = (event) => {
    setSelectedConstituency(event.target.value);
    localStorage.setItem('con_id', event.target.value);

  };
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1 className='mb-5'>Register</h1>

                  <CInputGroup className="mb-5">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      autoComplete="name"
                      required
                      id="exampleFormControlInputInline"

                      placeholder="Your name"
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-5">
                    <CInputGroupText>
                      <CIcon icon={cilBarcode} />
                    </CInputGroupText>
                    <CFormSelect
                      onChange={handleChange}
                      aria-label="Slect your constituency"
                      options={constituencies.map(con => ({ label: con.name, value: con.id }))}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton onClick={Go} color="success">Join</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
