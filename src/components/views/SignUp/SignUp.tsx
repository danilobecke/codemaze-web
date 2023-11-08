import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { v1Namespace, post } from '../../../services/ApiService';
import { Role } from '../../../models/Role';
import { clearInput, getInputValue, handleError } from '../../../services/Helpers';
import PasswordButton from '../../elements/PasswordButton/PasswordButton';
import { User } from '../../../models/User';
import ErrorToast from '../../elements/ErrorToast/ErrorToast';
import Session from '../../../services/Session';
import Translator from '../../elements/Translator/Translator';
import Loader from '../../elements/Loader/Loader';
import { AppError } from '../../../models/AppError';

function RoleSelector(props: { setRole: (role: Role) => void, show: boolean, close: () => void }) {
    return (
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle><Translator path='sign_up.roleSelectionTitle' /></DialogTitle>
            <DialogContent>
                <Button fullWidth variant='outlined' onClick={() => { props.setRole('manager') }}><Translator path='sign_up.manager' /></Button><br />
                <Button fullWidth variant='contained' sx={{ marginTop: 1 }} onClick={() => { props.setRole('student') }}><Translator path='sign_up.student' /></Button>
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
    const [appError, setAppError] = useState<AppError | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

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
        const hasNameError = name.split(' ').length < 2
        setNameError(hasNameError)
        const hasPasswordError = password !== passwordValidation
        setPasswordError(hasPasswordError)
        setPasswordValidationError(hasPasswordError)
        if (hasPasswordError || hasNameError) {
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
            const user = await post(url, body, User, setIsLoading, false)
            Session.logIn(user)
            close()
            navigate('/groups')
        } catch (error) {
            handleError(error, setAppError)
        }
    }

    return (
        <div>
            <Dialog open={props.show} onClose={props.close}>
                <DialogTitle><Translator path={'sign_up.' + props.role + 'Title'} /></DialogTitle>
                <DialogContent>
                    <TextField error={nameError} fullWidth required label={Translator({'path': 'sign_up.name'})} type='text' name={nameInputName} variant="standard" autoCapitalize='words'></TextField><br />
                    <TextField error={emailError} fullWidth required label={Translator({'path': 'sign_up.email'})} type='email' name={emailInputName} variant="standard" sx={{ marginTop: 1 }}></TextField><br />
                    <PasswordButton title={Translator({'path': 'sign_up.password'})} name={passwordInputName} error={passwordError} />
                    <PasswordButton title={Translator({'path': 'sign_up.password_confirmation'})} name={passwordValidationInputName} error={passwordValidationError} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={close}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast appError={appError} setAppError={setAppError} />
            <Loader show={isLoading} />
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
