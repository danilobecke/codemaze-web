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

    const [nameError, setNameError] = useState(false)
    const [detailsError, setDetailsError] = useState(false)
    const [languageError, setLanguageError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    function setMaxAttempts(value: number | null) {
        if (value && value < 0) {
            value = 0
        }
        setMaxAttpts(value)
    }

    function setLanguage(postion: number, value: string) {
        setLanguages(languages.slice(0, postion).concat(new MultipleInput(value)).concat(languages.slice(postion + 1)))
    }

    function toLanguageRow(language: MultipleInput<string>, index: number) {
        return <LanguageSelectRow position={index} required={index === 0} hasError={index === 0 && languageError} onDelete={index !== 0 ? deleteLanguageRow : undefined} language={language.value ?? ''} setLanguage={setLanguage} />
    }

    function addLanguageRow() {
        setLanguages([...languages, new MultipleInput()])
    }

    function deleteLanguageRow(position: number) {
        setLanguages(languages.slice(0, position).concat(languages.slice(position + 1)))
    }

    async function submit() {
        const _nameError = !name
        setNameError(_nameError)
        const _detailsError = !details
        setDetailsError(_detailsError)
        const _languageError = !languages[0].value
        setLanguageError(_languageError)
        if (_nameError || _detailsError || _languageError) {
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
            await sendFormData(v1Namespace('groups/' + groupID + '/tasks'), formData, TaskSummary, setIsLoading)
            dismiss()
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                alert(error) // fallback
            }
        }
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
                            <FileUploadRow title={detailsStr} hasError={detailsError} setFile={setDetails} themeColor="white" />
                            <DateTimePickerRow title={startsOnStr} date={startsOn} setDate={setStatsOn} />
                            <DateTimePickerRow title={endsOnStr} date={endsOn} setDate={setEndsOn} />
                            <TextFieldRow title={maxAttmpStr} type='number' value={maxAttempts} setValue={setMaxAttempts} />
                            {languages.map(toLanguageRow)}
                            <Button variant="text" onClick={addLanguageRow}><Translator path="new_task.addLanguage" /></Button>
                        </List>
                        <List sx={{ minWidth: '48%' }}>
                            <Typography variant="h5">WIP Tests</Typography>
                        </List>
                    </Stack>
                    <Stack direction='row-reverse' spacing={2}>
                        <Button variant="contained" size="large" onClick={submit}><Translator path="buttons.send" /></Button>
                        <Button variant="text" size="large" onClick={dismiss}><Translator path="buttons.cancel" /></Button>
                    </Stack>
                </Stack>
            </Container>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default NewTask;
