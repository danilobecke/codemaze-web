import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '../../models/User';
import { v1Namespace, post } from '../../services/ApiService';
import PasswordButton from '../PasswordButton/PasswordButton';
import { getInputValue, clearInput } from '../../services/Helpers';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import ErrorToast from '../ErrorToast/ErrorToast';
import Session from '../../services/Session';

function SignIn(props: { show: boolean, close: () => void }) {
    const emailName = 'email_signin'
    const passwordName = 'password_signin'

    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const navigate = useNavigate()

    function onClose() {
        clearInput(emailName)
        clearInput(passwordName)
        props.close()
    }

    async function submit(event: React.SyntheticEvent) {
        event.preventDefault()
        const email = getInputValue(emailName, setEmailError)
        const password = getInputValue(passwordName, setPasswordError)
        if (!email || !password) {
            return
        }
        let url = v1Namespace('session')
        let body = {
            'email': email,
            'password': password
        }
        try {
            const user = await post(url, body, User, false)
            Session.logIn(user)
            onClose()
            navigate('/groups')
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                alert(error) // fallback
            }
        }
    }

    return (
        <div>
            <Dialog open={props.show} onClose={onClose}>
                <DialogTitle>Sign In</DialogTitle>
                <DialogContent>
                    <TextField error={emailError} fullWidth required label='Email' type='email' name={emailName} variant="standard"></TextField><br />
                    <PasswordButton title='Password' name={passwordName} error={passwordError} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={onClose}>Cancel</Button>
                    <Button variant='contained' onClick={submit}>Send</Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage}/>
        </div>
    )
};

export default SignIn;
