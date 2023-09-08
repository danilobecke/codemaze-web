import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { User } from '../../models/User';
import { v1Namespace, post } from '../../services/ApiService';
import PasswordButton from '../PasswordButton/PasswordButton';
import { getInputValue, clearInput } from '../../services/Helpers';
import ErrorToast from '../ErrorToast/ErrorToast';
import Session from '../../services/Session';
import Translator from '../Translator/Translator';
import Loader from '../Loader/Loader';

function SignIn(props: { show: boolean, close: () => void }) {
    const emailName = 'email_signin'
    const passwordName = 'password_signin'

    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
            const user = await post(url, body, User, setIsLoading, false)
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
                <DialogTitle><Translator path='sign_in.title' /></DialogTitle>
                <DialogContent>
                    <TextField error={emailError} fullWidth required label={Translator({ 'path': 'sign_in.email' })} type='email' name={emailName} variant="standard"></TextField><br />
                    <PasswordButton title={Translator({ 'path': 'sign_in.password' })} name={passwordName} error={passwordError} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={onClose}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
        </div>
    )
};

export default SignIn;
