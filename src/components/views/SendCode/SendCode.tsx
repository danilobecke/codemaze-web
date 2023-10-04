import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Loader from "../../elements/Loader/Loader";
import FileUploadRow from "../../elements/FileUploadRow/FileUploadRow";
import { sendFormData, v1Namespace } from "../../../services/ApiService";
import { Result } from "../../../models/Result";


function SendCode(props: { show: boolean, close: (result?: Result) => void }) {
    const { taskID } = useParams()

    const rowTitle = Translator({ path: 'send_code.row' })

    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    function onClose(result?: Result) {
        setFile(null)
        setFileError(false)
        props.close(result)
    }

    async function submit() {
        if (!file) {
            setFileError(true)
        } else {
            setFileError(false)
            const data = new FormData()
            data.append('code', file)
            try {
                const result = await sendFormData(v1Namespace('tasks/' + taskID + '/results'), data, Result, setIsLoading)
                onClose(result)
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                } else {
                    alert(error) // fallback
                }
            }
        }

    }

    return (
        <div>
            <Dialog open={props.show} onClose={() => onClose()}>
                <DialogTitle><Translator path="send_code.title" /></DialogTitle>
                <DialogContent>
                    <FileUploadRow title={rowTitle} required hasError={fileError} file={file} setFile={setFile} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => onClose()}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
        </div>
    )
}

export default SendCode;
