import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Container, Stack, Typography } from "@mui/material";

import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";
import { sendFormData, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { TaskSummary } from "../../../models/TaskSummary";
import TestCard from "../../elements/TestCard/TestCard";
import { MultipleInput, addOn, removeFrom, setOn, zip3 } from "../../../services/Helpers";
import TestCase from "../../../models/TestCase";
import AddTaskFields, { AddTaskHandler } from "../../elements/AddTaskFields/AddTaskFields";

function NewTask() {
    const navigate = useNavigate()
    const { groupID } = useParams()
    const ref = useRef<AddTaskHandler>(null)

    const [testInputs, setTestInputs] = useState<MultipleInput<File>[]>([new MultipleInput()])
    const [testOutputs, setTestOutputs] = useState<MultipleInput<File>[]>([new MultipleInput()])
    const [testKinds, setTestKinds] = useState<MultipleInput<boolean>[]>([new MultipleInput()])
    const [inputErrors, setInputErrors] = useState<boolean[]>([false])
    const [outputErrors, setOutputErrors] = useState<boolean[]>([false])
    const [testKindErrors, setTestKindErrors] = useState<boolean[]>([false])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [dismissOnError, setDismissOnError] = useState(false)

    function toTestCard(values: [File | undefined, File | undefined, boolean | undefined], index: number) {
        return <TestCard index={index} inputError={inputErrors[index]} outputError={outputErrors[index]} kindError={testKindErrors[index]} inputFile={values[0] ?? null} outputFile={values[1] ?? null} closed={values[2] ?? null} setInputFile={setTestInput} setOutputFile={setTestOutput} setClosed={setTestClosed} onDelete={index !== 0 ? deleteTestCard : undefined} />
    }

    function setTestInput(index: number, value: File) {
        setOn(setTestInputs, testInputs, new MultipleInput(value), index)
    }

    function setTestOutput(index: number, value: File) {
        setOn(setTestOutputs, testOutputs, new MultipleInput(value), index)
    }

    function setTestClosed(index: number, value: boolean) {
        setOn(setTestKinds, testKinds, new MultipleInput(value), index)
    }

    function addTestCard() {
        addOn(setTestInputs, testInputs, new MultipleInput())
        addOn(setTestOutputs, testOutputs, new MultipleInput())
        addOn(setTestKinds, testKinds, new MultipleInput())
        addOn(setInputErrors, inputErrors, false)
        addOn(setOutputErrors, outputErrors, false)
        addOn(setTestKindErrors, testKindErrors, false)
    }

    function deleteTestCard(position: number) {
        removeFrom(setTestInputs, testInputs, position)
        removeFrom(setTestOutputs, testOutputs, position)
        removeFrom(setTestKinds, testKinds, position)
        removeFrom(setInputErrors, inputErrors, position)
        removeFrom(setOutputErrors, outputErrors, position)
        removeFrom(setTestKindErrors, testKindErrors, position)
    }

    async function submit() {
        const taskFormData = ref.current?.getFormData()
        const _testErrors = setTestErrors()
        if (!taskFormData || _testErrors) {
            return
        }
        try {
            const taskID = (await sendFormData(v1Namespace('groups/' + groupID + '/tasks'), taskFormData, TaskSummary, setIsLoading)).id
            // send tests synchronously to keep order
            for (let i = 0; i < testInputs.length; i++) {
                try {
                    await sendTest(i, taskID)
                } catch (error) {
                    if (error instanceof Error) {
                        setDismissOnError(true)
                        setErrorMessage(error.message)
                    } else {
                        alert(error) // fallback
                    }
                    return
                }
            }
            dismiss()
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                alert(error) // fallback
            }
        }
    }

    function setTestErrors(): boolean {
        let hasError = false
        for (let i = 0; i < testInputs.length; i++) {
            const [input, output, closed] = [testInputs[i], testOutputs[i], testKinds[i]]
            const [inputError, outputError, closedError] = [!input.value, !output.value, closed.value === undefined]
            setOn(setInputErrors, inputErrors, inputError, i)
            setOn(setOutputErrors, outputErrors, outputError, i)
            setOn(setTestKindErrors, testKindErrors, closedError, i)
            if (inputError || outputError || closedError) {
                hasError = true
            }
        }
        return hasError
    }

    async function sendTest(index: number, taskID: number): Promise<TestCase> {
        const [closed, inputFile, outputFile] = [testKinds[index].value, testInputs[index].value, testOutputs[index].value]
        const data = new FormData()
        data.append('closed', closed!.toString())
        data.append('input', inputFile!)
        data.append('output', outputFile!)
        return sendFormData(v1Namespace('tasks/' + taskID + '/tests'), data, TestCase, setIsLoading)
    }

    function dismiss() {
        navigate('/groups/' + groupID + '/tasks', { replace: true })
    }

    return (
        <div>
            <NavigationBar />
            <Container>
                <Stack direction='column' spacing={4}>
                    <Typography variant="h1"><Translator path='new_task.title' /></Typography>
                    <Stack direction='row' spacing={6}>
                        <AddTaskFields ref={ref} sx={{ minWidth: '48%' }} />
                        <Stack sx={{ minWidth: '48%' }} direction='column' spacing={2} alignItems='start'>
                            <Typography variant="h5"><Translator path="new_task.tests" /></Typography>
                            <Stack sx={{ width: '100%' }} direction='column' alignItems='center' spacing={1}>
                                {zip3(testInputs.map(element => element.value), testOutputs.map(element => element.value), testKinds.map(element => element.value)).map(toTestCard)}
                            </Stack>
                            <Button variant="text" onClick={addTestCard}><Translator path="new_task.addTest" /></Button>
                        </Stack>
                    </Stack>
                    <Stack direction='row-reverse' spacing={2}>
                        <Button variant="contained" size="large" onClick={submit}><Translator path="buttons.send" /></Button>
                        <Button variant="text" size="large" onClick={dismiss}><Translator path="buttons.cancel" /></Button>
                    </Stack>
                </Stack>
            </Container>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} onClose={dismissOnError ? dismiss : undefined} />
        </div>
    )
}

export default NewTask;
