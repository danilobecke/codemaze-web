import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField, Typography } from "@mui/material";

import { Group } from "../../../models/Group";
import Translator from "../../elements/Translator/Translator";
import { getInputValue } from "../../../services/Helpers";
import { patch, v1Namespace } from "../../../services/ApiService";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Loader from "../../elements/Loader/Loader";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";

function GroupSettings(props: { show: boolean, onClose: (updatedGroup: Group | null) => void, group: Group }) {
    const nameField = 'group_settings.nameField'
    const activeField = 'group_settings.activeField'
    
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    async function submit() {
        const name = getInputValue(nameField)
        const activeElement = document.getElementsByName(activeField)[0] as HTMLInputElement
        const active = activeElement.checked
        const body = {
            name: name && name !== props.group.name ? name : null,
            active: active !== props.group.active ? active : null,
        }
        try {
            const updated = await patch(v1Namespace('groups/' + props.group.id), body, Group, setIsLoading)
            props.onClose(updated)
            setShowSuccess(true)
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
            <Dialog open={props.show} onClose={() => props.onClose(null)}>
                <DialogTitle><Translator path='group_settings.title' /></DialogTitle>
                <DialogContent>
                    <Stack direction='row' justifyContent='space-between' >
                        <Typography alignSelf='center' display='inline'><Translator path='group_settings.active' /></Typography>
                        <Switch name={activeField} defaultChecked={props.group.active} />
                    </Stack>
                    <TextField fullWidth defaultValue={props.group.name} label={Translator({ 'path': 'group_settings.name' })} type='text' name={nameField} variant="standard"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => props.onClose(null)}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
            <SuccessToast show={showSuccess} close={() => setShowSuccess(false)} />
        </div>
    )
}

export default GroupSettings;
