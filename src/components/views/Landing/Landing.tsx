import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';

import Session from '../../../services/Session';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Translator from '../../elements/Translator/Translator';

import AppContainer from '../../elements/AppContainer/AppContainer';

function Landing() {
    const navigate = useNavigate()
    const { REACT_APP_SCHOOL_NAME } = process.env

    // Sign In
    const [showSignIn, setShowSignIn] = useState(false)
    function openSignIn() {
        if (Session.getCurrentUser()) {
            navigate('/groups')
            return
        }
        setShowSignIn(true)
    }
    function closeSignIn() { setShowSignIn(false) }
    // Sign Up
    const [showSignUp, setShowSignUp] = useState(false)
    function openSignUp() { setShowSignUp(true) }
    function closeSignUp() { setShowSignUp(false) }

    return (
        <div>
            <AppContainer navigationBarChildren={[
                <Button onClick={openSignUp} variant='outlined' size='large' color='inherit'><Translator path='landing.sign_up' /></Button>,
                <Button onClick={openSignIn} variant='contained' size='large'><Translator path='landing.sign_in' /></Button>
            ]
            } flex>
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h1'>Codemaze</Typography>
                        <Typography variant='h4'>{REACT_APP_SCHOOL_NAME ?? "[School Name]"}</Typography>
                    </div>
                </div>
            </AppContainer>
            <SignIn show={showSignIn} close={closeSignIn} />
            <SignUp show={showSignUp} close={closeSignUp} />
        </div>
    )
}

export default Landing;
