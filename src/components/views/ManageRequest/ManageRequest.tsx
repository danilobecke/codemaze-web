import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import { JoinRequest } from "../../../models/JoinRequest";
import Translator from "../../elements/Translator/Translator";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Loader from "../../elements/Loader/Loader";
import { patch, v1Namespace } from "../../../services/ApiService";
import Success from "../../../models/Success";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";
import { AppError } from "../../../models/AppError";
import { handleError } from "../../../services/Helpers";

function ManageRequest(props: { show: boolean, onClose: (success: boolean) => void, request: JoinRequest}) {
    const { groupID } = useParams()

    const [appError, setAppError] = useState<AppError | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const approvalText = Translator({ path: 'manage_request.approve', arguments: { name: props.request.student } })
    const refuseText = Translator({ path: 'manage_request.refuse', arguments: { name: props.request.student } })

    async function submit() {
        const body = {
            'approve': props.request.approve!
        }
        try {
            await patch(v1Namespace('groups/' + groupID + '/requests/' + props.request.id), body, Success, setIsLoading)
            props.onClose(true)
            setShowSuccess(true)
        } catch (error) {
            handleError(error, setAppError)
        }
    }

    return (
        <div>
            <Dialog open={props.show} onClose={() => props.onClose(false)}>
                <DialogTitle><Translator path='manage_request.title' /></DialogTitle>
                <DialogContent>
                    {
                        props.request.approve! ?
                            <Typography sx={{ color: 'green' }}>{approvalText}</Typography>
                            :
                            <Typography color='error' >{refuseText}</Typography>
                    }
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => props.onClose(false)}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast appError={appError} setAppError={setAppError} />
            <Loader show={isLoading} />
            <SuccessToast show={showSuccess} close={() => setShowSuccess(false)}></SuccessToast>
        </div>
    )
}

export default ManageRequest;
