import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import LinkItem from "../../elements/LinkItem/LinkItem";
import { User } from "../../../models/User";
import PasswordButton from "../../elements/PasswordButton/PasswordButton";
import { clearInput, getInputValue, handleError } from "../../../services/Helpers";
import { patch, v1Namespace } from "../../../services/ApiService";
import { UpdatedUser } from "../../../models/UpdatedUser";
import Loader from "../../elements/Loader/Loader";
import { AppError } from "../../../models/AppError";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";

type UpdatingContext = 'name' | 'password'

function ProfileHome(props: { user: User, show: boolean, close: () => void, setIsLoggingOut: (isLoggingOut: boolean) => void, setUpdatingContext: (updatingContext: UpdatingContext | null) => void }) {
    const changePasswordStr = Translator({ path: 'profile.changePassword' })

    function showUpdateName() {
        props.setUpdatingContext('name')
    }

    function showUpdatePassword() {
        props.setUpdatingContext('password')
    }

    function showLogOut() {
        props.setIsLoggingOut(true)
    }

    return (
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle>{props.user.name}<IconButton onClick={showUpdateName}><EditIcon color="primary" /></IconButton></DialogTitle>
            <DialogContent>
                <DialogContentText>{props.user.email}</DialogContentText>
                <LinkItem title={changePasswordStr} variant="body1" onClick={showUpdatePassword} />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={props.close}><Translator path="buttons.cancel" /></Button>
                <Button variant="outlined" color="error" onClick={showLogOut}><Translator path="profile.logOut" /></Button>
            </DialogActions>
        </Dialog>
    )
}

function LogOutConfirmation(props: { open: boolean, close: () => void }) {
    const navigate = useNavigate()

    function logOut() {
        props.close()
        Session.logOut()
        navigate('/')
    }

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle><Translator path="profile.logOut" /></DialogTitle>
            <DialogActions>
                <Button variant="text" onClick={props.close}><Translator path="buttons.cancel" /></Button>
                <Button variant="outlined" color="error" onClick={logOut}><Translator path="buttons.confirm" /></Button>
            </DialogActions>
        </Dialog>
    )
}

function UpdateUser(props: { user: User, context: UpdatingContext | null, setContext: (context: UpdatingContext | null) => void, showSuccessToast: () => void }) {
    const nameInputName = 'name_profile'
    const currentPasswordInputName = 'current_password_profile'
    const passwordInputName = 'password_profile'
    const passwordValidationInputName = 'password_validation_profile'

    const [nameError, setNameError] = useState(false)
    const [currentPasswordError, setCurrentPasswordError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordValidationError, setPasswordValidationError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    function onClose() {
        switch (props.context) {
            case 'name':
                clearInput(nameInputName)
                break
            case 'password':
                clearInput(currentPasswordInputName)
                clearInput(passwordInputName)
                clearInput(passwordValidationInputName)
                break
        }
        props.setContext(null)
    }

    async function submit(event: React.SyntheticEvent) {
        event.preventDefault()
        let payload = {}
        switch (props.context) {
            case 'name':
                const name = getInputValue(nameInputName, setNameError)
                if (!name) {
                    return
                }
                const hasNameError = name.split(' ').length < 2
                setNameError(hasNameError)
                if (hasNameError) {
                    return
                }
                payload = {
                    'name': name
                }
                break
            case 'password':
                const currentPassword = getInputValue(currentPasswordInputName, setCurrentPasswordError)
                const password = getInputValue(passwordInputName, setPasswordError)
                const passwordValidation = getInputValue(passwordValidationInputName, setPasswordValidationError)
                if (!currentPassword || !password || !passwordValidation) {
                    return
                }
                const hasPasswordError = password !== passwordValidation
                setPasswordError(hasPasswordError)
                setPasswordValidationError(hasPasswordError)
                if (hasPasswordError) {
                    return
                }
                payload = {
                    'password': {
                        'current': currentPassword,
                        'new': password
                    }
                }
        }
        try {
            const user = await patch(v1Namespace('user'), payload, UpdatedUser, setIsLoading)
            Session.updateCurrentUser(user)
            onClose()
            props.showSuccessToast()
        } catch (error) {
            handleError(error, setAppError)
        }
    }

    function getContent(): JSX.Element {
        switch (props.context) {
            case 'name': return (
                <DialogContent>
                    <TextField error={nameError} fullWidth required label={Translator({ 'path': 'profile.name' })} type='text' name={nameInputName} variant="standard" autoCapitalize='words' defaultValue={props.user.name}></TextField>
                </DialogContent>
            )
            case 'password': return (
                <DialogContent>
                    <Stack direction='column' spacing={1}>
                        <PasswordButton title={Translator({ 'path': 'profile.currentPassword' })} name={currentPasswordInputName} error={currentPasswordError} />
                        <PasswordButton title={Translator({ 'path': 'profile.password' })} name={passwordInputName} error={passwordError} />
                        <PasswordButton title={Translator({ 'path': 'profile.passwordConfirmation' })} name={passwordValidationInputName} error={passwordValidationError} />
                    </Stack>
                </DialogContent>
            )
            default: return (<></>) // shouldn't happen
        }
    }

    return (
        <div>
            <Dialog open={props.context !== null} onClose={onClose}>
                <DialogTitle><Translator path="profile.update" /></DialogTitle>
                {getContent()}
                <DialogActions>
                    <Button variant='text' onClick={onClose}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <Loader show={isLoading} />
            <ErrorToast appError={appError} setAppError={setAppError} />
        </div>
    )
}

function Profile(props: { show: boolean, close: () => void }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [updatingContext, setUpdatingContext] = useState<UpdatingContext | null>(null)
    const [isDisplayingSuccessToast, setIsDisplayingSuccessToast] = useState(false)

    function getScene(): JSX.Element {
        const user = Session.getCurrentUser()
        if (user === null) {
            return <></>
        }
        if (isLoggingOut) {
            return <LogOutConfirmation open={isLoggingOut} close={() => setIsLoggingOut(false)} />
        }
        if (updatingContext !== null) {
            return <UpdateUser user={user} context={updatingContext} setContext={setUpdatingContext} showSuccessToast={() => setIsDisplayingSuccessToast(true)} />
        }
        return <ProfileHome user={user} show={props.show} close={props.close} setIsLoggingOut={setIsLoggingOut} setUpdatingContext={setUpdatingContext} />
    }

    return (
        <div>
            {getScene()}
            <SuccessToast show={isDisplayingSuccessToast} close={() => setIsDisplayingSuccessToast(false)} />
        </div>
    )
}

export default Profile;
