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

    const inputStr = Translator({ path: 'new_test.input' })
    const outputStr = Translator({ path: 'new_test.output' })
    const errorStr = Translator({ path: 'new_test.error' })

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    function close(newTest?: TestCase) {
        setInputFile(null)
        setOutputFile(null)
        setClosed(null)
        props.onClose(newTest)
    }

    async function submit() {
        if (!inputFile || !outputFile || closed === null) {
            setErrorMessage(errorStr)
            return
        }
        try {
            const data = new FormData()
            data.append('closed', closed.toString())
            data.append('input', inputFile)
            data.append('output', outputFile)
            const test = await sendFormData(v1Namespace('tasks/' + taskID + '/tests'), data, TestCase, setIsLoading)
            close(test)
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
                        <FileUploadRow title={inputStr} setFile={setInputFile} />
                        <FileUploadRow title={outputStr} setFile={setOutputFile} />
                        <TestVisibilitySelectRow setClosed={setClosed} />
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
