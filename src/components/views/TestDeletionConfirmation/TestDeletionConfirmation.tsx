import { useState } from "react";

import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

import TestCase from "../../../models/TestCase";
import Translator from "../../elements/Translator/Translator";
import { remove, v1Namespace } from "../../../services/ApiService";
import Success from "../../../models/Success";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";
import { AppError } from "../../../models/AppError";
import { handleError } from "../../../services/Helpers";

export interface TestDeletionConfirmationProps {
    test: TestCase
    position: number
    onClose: (removed?: TestCase) => void
}

function TestDeletionConfirmation(props: { data: TestDeletionConfirmationProps | null }) {
    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    async function submit() {
        const data = props.data
        if (!data) {
            return
        }
        try {
            await remove(v1Namespace('tests/' + data.test.id), Success, setIsLoading)
            data.onClose(data.test)
            setShowSuccess(true)
        } catch (error) {
            handleError(error, setAppError)
        }
    }

    return (
        <div>
            <Dialog open={props.data !== null} onClose={() => props.data?.onClose()}>
                {props.data ? <DialogTitle>{props.data.test.closed ? <Translator path="test_deletion.titleClosed" arguments={{ position: props.data.position }} /> : <Translator path="test_deletion.titleOpen" arguments={{ position: props.data.position }} />}</DialogTitle> : null}
                <DialogActions>
                    <Button variant='text' onClick={() => props.data?.onClose()}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <Loader show={isLoading} />
            <ErrorToast appError={appError} setAppError={setAppError} />
            <SuccessToast show={showSuccess} close={() => setShowSuccess(false)} />
        </div>
    )
}

export default TestDeletionConfirmation;
