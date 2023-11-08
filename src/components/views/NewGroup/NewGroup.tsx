import { useNavigate } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import { clearInput, getInputValue, handleError } from "../../../services/Helpers";
import { useState } from "react";
import { post, v1Namespace } from "../../../services/ApiService";
import { Group } from "../../../models/Group";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Loader from "../../elements/Loader/Loader";
import { AppError } from "../../../models/AppError";

function NewGroup(props: { show: boolean, close: () => void }) {
    const fieldName = 'newGroup-Name'

    const [fieldError, setFieldError] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    function onClose() {
        clearInput(fieldName)
        props.close()
    }
    async function createGroup() {
        const name = getInputValue(fieldName, setFieldError)
        if (!name) {
            return
        }
        const body = {
            'name': name
        }
        try {
            const group = await post(v1Namespace('groups'), body, Group, setIsLoading)
            onClose()
            navigate('/groups/' + group.id)
        } catch (error) {
            handleError(error, setAppError)
        }
    }
    return (
        <div>
            <Dialog open={props.show} onClose={props.close}>
                <DialogTitle><Translator path="new_group.title" /></DialogTitle>
                <DialogContent>
                    <TextField error={fieldError} fullWidth required label={Translator({ 'path': 'new_group.name' })} type='text' name={fieldName} variant="standard"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={onClose}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={createGroup}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast appError={appError} setAppError={setAppError} />
            <Loader show={isLoading} />
        </div>

    );
}

export default NewGroup;
