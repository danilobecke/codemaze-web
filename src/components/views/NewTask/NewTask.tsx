import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Dayjs } from "dayjs";
import { Button, Container, List, Stack, Typography } from "@mui/material";

import DateTimePickerRow from "../../elements/DateTimePickerRow/DateTimePickerRow";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";
import TextFieldRow from "../../elements/TextFieldRow/TextFieldRow";
import FileUploadRow from "../../elements/FileUploadRow/FileUploadRow";
import LanguageSelectRow from "../../elements/LanguageSelectRow/LanguageSelectRow";
import { sendFormData, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { TaskSummary } from "../../../models/TaskSummary";
import TestCard from "../../elements/TestCard/TestCard";
import { zip3 } from "../../../services/Helpers";
import TestCase from "../../../models/TestCase";

class MultipleInput<T> {
    value?: T

    constructor(value?: T) {
        this.value = value
    }
}

function NewTask() {
    const navigate = useNavigate()
    const { groupID } = useParams()

    const nameStr = Translator({ path: 'new_task.name' })
    const detailsStr = Translator({ path: 'new_task.details' })
    const startsOnStr = Translator({ path: 'new_task.startsOn' })
    const endsOnStr = Translator({ path: 'new_task.endsOn' })
    const maxAttmpStr = Translator({ path: 'new_task.maxAttempts' })

    const [name, setName] = useState<String | null>(null)
    const [details, setDetails] = useState<File | null>(null)
    const [startsOn, setStatsOn] = useState<Dayjs | null>(null)
    const [endsOn, setEndsOn] = useState<Dayjs | null>(null)
    const [maxAttempts, setMaxAttpts] = useState<number | null>(null)
    const [languages, setLanguages] = useState<MultipleInput<string>[]>([new MultipleInput()])
    const [testInputs, setTestInputs] = useState<MultipleInput<File>[]>([new MultipleInput()])
    const [testOutputs, setTestOutputs] = useState<MultipleInput<File>[]>([new MultipleInput()])
    const [testKinds, setTestKinds] = useState<MultipleInput<boolean>[]>([new MultipleInput()])
    const [inputErrors, setInputErrors] = useState<boolean[]>([false])
    const [outputErrors, setOutputErrors] = useState<boolean[]>([false])
    const [testKindErrors, setTestKindErrors] = useState<boolean[]>([false])

    const [nameError, setNameError] = useState(false)
    const [detailsError, setDetailsError] = useState(false)
    const [languageError, setLanguageError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [dismissOnError, setDismissOnError] = useState(false)

    function setMaxAttempts(value: number | null) {
        if (value && value < 0) {
            value = 0
        }
        setMaxAttpts(value)
    }

    function setLanguage(postion: number, value: string) {
        setOn(setLanguages, languages, new MultipleInput(value), postion)
    }

    function setOn<T>(setFunction: (value: T[]) => void, current: T[], value: T, index: number) {
        setFunction(current.slice(0, index).concat(value).concat(current.slice(index + 1)))
    }

    function toLanguageRow(language: MultipleInput<string>, index: number) {
        return <LanguageSelectRow position={index} required={index === 0} hasError={index === 0 && languageError} onDelete={index !== 0 ? deleteLanguageRow : undefined} language={language.value ?? ''} setLanguage={setLanguage} />
    }

    function addLanguageRow() {
        addOn(setLanguages, languages, new MultipleInput())
    }

    function addOn<T>(setFunction: (value: T[]) => void, current: T[], value: T) {
        setFunction([...current, value])
    }

    function deleteLanguageRow(position: number) {
        removeFrom(setLanguages, languages, position)
    }

    function removeFrom<T>(setFunction: (value: T[]) => void, current: T[], index: number) {
        setFunction(current.slice(0, index).concat(current.slice(index + 1)))
    }

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
        const _nameError = !name
        setNameError(_nameError)
        const _detailsError = !details
        setDetailsError(_detailsError)
        const _languageError = !languages[0].value
        setLanguageError(_languageError)
        const _testErrors = setTestErrors()
        if (_nameError || _detailsError || _languageError || _testErrors) {
            return
        }
        const formData = new FormData()
        formData.append('name', name!.toString())
        formData.append('file', details!)
        for (const language of new Set(languages.map(element => element.value))) {
            if (!language) {
                continue
            }
            formData.append('languages', language)
        }
        if (startsOn) {
            formData.append('starts_on', startsOn.toISOString())
        }
        if (endsOn) {
            formData.append('ends_on', endsOn.toISOString())
        }
        if (maxAttempts) {
            formData.append('max_attempts', maxAttempts.toString())
        }
        try {
            const taskID = (await sendFormData(v1Namespace('groups/' + groupID + '/tasks'), formData, TaskSummary, setIsLoading)).id
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
                        <List sx={{ minWidth: '48%' }}>
                            <TextFieldRow title={nameStr} required type='text' hasError={nameError} value={name} setValue={setName} />
                            <FileUploadRow title={detailsStr} hasError={detailsError} file={details} setFile={setDetails} themeColor="white" />
                            <DateTimePickerRow title={startsOnStr} date={startsOn} setDate={setStatsOn} />
                            <DateTimePickerRow title={endsOnStr} date={endsOn} setDate={setEndsOn} />
                            <TextFieldRow title={maxAttmpStr} type='number' value={maxAttempts} setValue={setMaxAttempts} />
                            {languages.map(toLanguageRow)}
                            <Button variant="text" onClick={addLanguageRow}><Translator path="new_task.addLanguage" /></Button>
                        </List>
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
