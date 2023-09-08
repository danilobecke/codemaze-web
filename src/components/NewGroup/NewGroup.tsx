import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import Translator from "../Translator/Translator";
import { clearInput, getInputValue } from "../../services/Helpers";
import { useState } from "react";
import { post, v1Namespace } from "../../services/ApiService";
import { Group } from "../../models/Group";
import ErrorToast from "../ErrorToast/ErrorToast";
import Loader from "../Loader/Loader";

function NewGroup(props: { show: boolean, close: () => void }) {
    const fieldName = 'newGroup-Name'

    const [fieldError, setFieldError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
            await post(v1Namespace('groups'), body, Group, setIsLoading)
            onClose()
            // TODO: open group page
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
                <DialogTitle><Translator path="new_group.title" /></DialogTitle>
                <DialogContent>
                    <TextField error={fieldError} fullWidth required label={Translator({ 'path': 'new_group.name' })} type='text' name={fieldName} variant="standard"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={onClose}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={createGroup}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
        </div>

    );
}

export default NewGroup;
