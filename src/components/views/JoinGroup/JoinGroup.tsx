import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import { clearInput, getInputValue, handleError } from "../../../services/Helpers";
import { useState } from "react";
import { post, v1Namespace } from "../../../services/ApiService";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Success from "../../../models/Success";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";
import Loader from "../../elements/Loader/Loader";
import { AppError } from "../../../models/AppError";

function JoinGroup(props: { show: boolean, close: () => void }) {
    const fieldName = 'joinGroup-Name'

    const [fieldError, setFieldError] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
            await post(v1Namespace('groups/join'), body, Success, setIsLoading)
            onClose()
            setSnackbarOpen(true)
        } catch (error) {
            handleError(error, setAppError)
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
            <ErrorToast appError={appError} setAppError={setAppError} />
            <SuccessToast show={snackbarOpen} close={() => setSnackbarOpen(false)} />
            <Loader show={isLoading} />
        </div>
    );
}

export default JoinGroup;
