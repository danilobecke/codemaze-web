import { useState } from 'react';

import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';

import './Landing.css';
import { Button, Stack, Typography } from '@mui/material';

function Landing() {
    // Sign In
    const [showSignIn, setShowSignIn] = useState(false)
    function openSignIn() { setShowSignIn(true) }
    function closeSignIn() { setShowSignIn(false) }
    // Sign Up
    const [showSignUp, setShowSignUp] = useState(false)
    function openSignUp() { setShowSignUp(true) }
    function closeSignUp() { setShowSignUp(false) }

    return (
        <div>
            <nav className='Landing-nav'>
                <Stack direction={'row'} justifyContent={'flex-end'} spacing={1}>
                    <Button onClick={openSignUp} variant='outlined' size='large' color='inherit'>Sign Up</Button>
                    <Button onClick={openSignIn} variant='contained' size='large'>Sign In</Button>
                </Stack>
            </nav>
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
