import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List } from "@mui/material";

import TestCase from "../../../models/TestCase";
import Translator from "../../elements/Translator/Translator";
import FileUploadRow from "../../elements/FileUploadRow/FileUploadRow";
import TestVisibilitySelectRow from "../../elements/TestVisibilitySelectRow/TestVisibilitySelectRow";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { sendFormData, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import SuccessToast from "../../elements/SuccessToast/SuccessToast";

function NewTestCase(props: { show: boolean, onClose: (newTestCase?: TestCase) => void }) {
    const { taskID } = useParams()

    const [inputFile, setInputFile] = useState<File | null>(null)
    const [outputFile, setOutputFile] = useState<File | null>(null)
    const [closed, setClosed] = useState<boolean | null>(null)

    const [inputError, setInputError] = useState(false)
    const [outputError, setOutputError] = useState(false)
    const [kindError, setKindError] = useState(false)

    const inputStr = Translator({ path: 'new_test.input' })
    const outputStr = Translator({ path: 'new_test.output' })

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    function close(newTest?: TestCase) {
        setInputFile(null)
        setInputError(false)
        setOutputFile(null)
        setOutputError(false)
        setClosed(null)
        setKindError(false)
        props.onClose(newTest)
    }

    async function submit() {
        const _inputError = !inputFile
        setInputError(_inputError)
        const _outputError = !outputFile
        setOutputError(_outputError)
        const _kindError = closed === null
        setKindError(_kindError)
        if (_inputError || _outputError || _kindError) {
            return
        }
        try {
            const data = new FormData()
            data.append('closed', closed!.toString())
            data.append('input', inputFile!)
            data.append('output', outputFile!)
            const test = await sendFormData(v1Namespace('tasks/' + taskID + '/tests'), data, TestCase, setIsLoading)
            close(test)
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
            <Dialog open={props.show} onClose={() => close()} >
                <DialogTitle>
                    <Translator path='new_test.title' />
                </DialogTitle>
                <DialogContent>
                    <List>
                        <FileUploadRow required title={inputStr} hasError={inputError} file={inputFile} setFile={setInputFile} />
                        <FileUploadRow required title={outputStr} hasError={outputError} file={outputFile} setFile={setOutputFile} />
                        <TestVisibilitySelectRow hasError={kindError} closed={closed} setClosed={setClosed} />
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => close()}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
            <SuccessToast show={showSuccess} close={() => setShowSuccess(false)} />
        </div>
    )
}

export default NewTestCase;
