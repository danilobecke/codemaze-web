import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';

import Session from '../../../services/Session';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Translator from '../../elements/Translator/Translator';
import NavigationBar from '../../elements/NavigationBar/NavigationBar';

import './Landing.css'

function Landing() {
    const navigate = useNavigate()
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
            <NavigationBar>
                    <Button onClick={openSignUp} variant='outlined' size='large' color='inherit'><Translator path='landing.sign_up' /></Button>
                    <Button onClick={openSignIn} variant='contained' size='large'><Translator path='landing.sign_in' /></Button>
            </NavigationBar>
            <div className='Landing-content'>
                <Typography variant='h1'>Codemaze</Typography>
                <Typography variant='h4'>[School Name]</Typography>
            </div>
            <SignIn show={showSignIn} close={closeSignIn} />
            <SignUp show={showSignUp} close={closeSignUp} />
        </div>
    )
}

export default Landing;