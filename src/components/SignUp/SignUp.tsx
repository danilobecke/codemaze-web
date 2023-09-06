import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { v1Namespace, post } from '../../services/ApiService';
import { Role } from '../../models/Role';
import { clearInput, getInputValue } from '../../services/Helpers';
import PasswordButton from '../PasswordButton/PasswordButton';
import { User } from '../../models/User';
import ErrorToast from '../ErrorToast/ErrorToast';
import Session from '../../services/Session';

function RoleSelector(props: { setRole: (role: Role) => void, show: boolean, close: () => void }) {
    return (
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle>Select a Role</DialogTitle>
            <DialogContent>
                <Button fullWidth variant='outlined' onClick={() => { props.setRole('manager') }}>I'm a Professor</Button><br />
                <Button fullWidth variant='contained' sx={{ marginTop: 1 }} onClick={() => { props.setRole('student') }}>I'm a Student</Button>
            </DialogContent>
        </Dialog>
    );
}

function SingUpInput(props: { role: Role, show: boolean, close: () => void }) {
    const nameInputName = 'name_signup'
    const emailInputName = 'email_signup'
    const passwordInputName = 'password_signup'
    const passwordValidationInputName = 'passwordValidation_signup'

    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordValidationError, setPasswordValidationError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const navigate = useNavigate()

    const roleName = () => {
        let result = ''
        switch (props.role) {
            case 'manager':
                result = 'professor';
                break;
            case 'student':
                result = props.role.toString()
                break;
        }
        return [...result][0].toUpperCase() + [...result].slice(1).join('')
    }

    function close() {
        clearInput(nameInputName)
        clearInput(emailInputName)
        clearInput(passwordInputName)
        clearInput(passwordValidationInputName)
        props.close()
    }

    async function submit(event: React.SyntheticEvent) {
        event.preventDefault()
        const name = getInputValue(nameInputName, setNameError)
        const email = getInputValue(emailInputName, setEmailError)
        const password = getInputValue(passwordInputName, setPasswordError)
        const passwordValidation = getInputValue(passwordValidationInputName, setPasswordValidationError)
        if (!name || !email || !password || !passwordValidation) {
            return
        }
        const hasPasswordError = password !== passwordValidation
        setPasswordError(hasPasswordError)
        setPasswordValidationError(hasPasswordError)
        if (hasPasswordError) {
            return
        }
        let url = ''
        switch (props.role) {
            case 'manager':
                url = v1Namespace('managers')
                break;
            case 'student':
                url = v1Namespace('students')
                break;
        }
        const body = {
            'name': name,
            'email': email,
            'password': password,
        }
        try {
            const user = await post(url, body, User, false)
            Session.logIn(user)
            close()
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
            <Dialog open={props.show} onClose={props.close}>
                <DialogTitle>{roleName()} Sign Up</DialogTitle>
                <DialogContent>
                    <TextField error={nameError} fullWidth required label='Name' type='text' name={nameInputName} variant="standard" autoCapitalize='words'></TextField><br />
                    <TextField error={emailError} fullWidth required label='Email' type='email' name={emailInputName} variant="standard" sx={{ marginTop: 1 }}></TextField><br />
                    <PasswordButton title='Password' name={passwordInputName} error={passwordError} />
                    <PasswordButton title='Confirm Password' name={passwordValidationInputName} error={passwordValidationError} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={close}>Cancel</Button>
                    <Button variant='contained' onClick={submit}>Send</Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    );
}

function SignUp(props: { show: boolean, close: () => void }) {
    const [role, setRole] = useState<Role | null>(null)

    function close() {
        setRole(null)
        props.close()
    }

    switch (role) {
        case null:
            return (<RoleSelector setRole={setRole} show={props.show} close={props.close} />)
        case 'manager':
        case 'student':
            return (<SingUpInput role={role} show={props.show} close={close} />)
    }
};

export default SignUp;
