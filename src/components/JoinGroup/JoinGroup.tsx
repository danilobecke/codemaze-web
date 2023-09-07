import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import Translator from "../Translator/Translator";
import { clearInput, getInputValue } from "../../services/Helpers";
import { useState } from "react";
import { post, v1Namespace } from "../../services/ApiService";
import ErrorToast from "../ErrorToast/ErrorToast";
import Success from "../../models/Success";
import SuccessToast from "../SuccessToast/SuccessToast";

function JoinGroup(props: { show: boolean, close: () => void }) {
    const fieldName = 'joinGroup-Name'

    const [fieldError, setFieldError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    function onClose() {
        clearInput(fieldName)
        props.close()
    }
    async function joinGroup() {
        const code = getInputValue(fieldName, setFieldError)
        if (!code) {
            return
        }
        const body = {
            'code': code
        }
        try {
            await post(v1Namespace('groups/join'), body, Success)
            onClose()
            setSnackbarOpen(true)
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
                <DialogTitle><Translator path="join_group.title" /></DialogTitle>
                <DialogContent>
                    <TextField error={fieldError} fullWidth required label={Translator({ 'path': 'join_group.code' })} type='text' name={fieldName} variant="standard"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={onClose}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={joinGroup}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <SuccessToast show={snackbarOpen} close={() => setSnackbarOpen(false)} />
        </div>
    );
}

export default JoinGroup;
