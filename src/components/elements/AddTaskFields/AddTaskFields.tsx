import { forwardRef, useImperativeHandle, useState } from "react";

import { Dayjs } from "dayjs";
import { Theme } from "@emotion/react";
import { Button, List, SxProps } from "@mui/material";

import TextFieldRow from "../TextFieldRow/TextFieldRow";
import FileUploadRow from "../FileUploadRow/FileUploadRow";
import DateTimePickerRow from "../DateTimePickerRow/DateTimePickerRow";
import Translator from "../Translator/Translator";
import { MultipleInput, addOn, removeFrom, setOn } from "../../../services/Helpers";
import LanguageSelectRow from "../LanguageSelectRow/LanguageSelectRow";

export type AddTaskHandler = {
    getFormData: () => FormData | null
}

export type AddTaskFieldsProps = {
    sx?: SxProps<Theme>
}

const AddTaskFields = forwardRef<AddTaskHandler, AddTaskFieldsProps>((props, ref) => {
    const nameStr = Translator({ path: 'add_task.name' })
    const detailsStr = Translator({ path: 'add_task.details' })
    const startsOnStr = Translator({ path: 'add_task.startsOn' })
    const endsOnStr = Translator({ path: 'add_task.endsOn' })
    const maxAttmpStr = Translator({ path: 'add_task.maxAttempts' })

    const [name, setName] = useState<String | null>(null)
    const [details, setDetails] = useState<File | null>(null)
    const [startsOn, setStatsOn] = useState<Dayjs | null>(null)
    const [endsOn, setEndsOn] = useState<Dayjs | null>(null)
    const [maxAttempts, setMaxAttpts] = useState<number | null>(null)
    const [languages, setLanguages] = useState<MultipleInput<string>[]>([new MultipleInput()])

    const [nameError, setNameError] = useState(false)
    const [detailsError, setDetailsError] = useState(false)
    const [languageError, setLanguageError] = useState(false)

    function setMaxAttempts(value: number | null) {
        if (value && value < 0) {
            value = 0
        }
        setMaxAttpts(value)
    }

    function setLanguage(postion: number, value: string) {
        setOn(setLanguages, languages, new MultipleInput(value), postion)
    }

    function toLanguageRow(language: MultipleInput<string>, index: number) {
        return <LanguageSelectRow position={index} required={index === 0} hasError={index === 0 && languageError} onDelete={index !== 0 ? deleteLanguageRow : undefined} language={language.value ?? ''} setLanguage={setLanguage} />
    }

    function addLanguageRow() {
        addOn(setLanguages, languages, new MultipleInput())
    }

    function deleteLanguageRow(position: number) {
        removeFrom(setLanguages, languages, position)
    }

    useImperativeHandle(ref, () => ({
        getFormData() {
            const _nameError = !name
            setNameError(_nameError)
            const _detailsError = !details
            setDetailsError(_detailsError)
            const _languageError = !languages[0].value
            setLanguageError(_languageError)
            if (_nameError || _detailsError || _languageError) {
                return null
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
            return formData
        }
    }))

    return (
        <List sx={props.sx}>
            <TextFieldRow title={nameStr} required type='text' hasError={nameError} value={name} setValue={setName} />
            <FileUploadRow title={detailsStr} hasError={detailsError} file={details} setFile={setDetails} themeColor="white" />
            <DateTimePickerRow title={startsOnStr} date={startsOn} setDate={setStatsOn} />
            <DateTimePickerRow title={endsOnStr} date={endsOn} setDate={setEndsOn} />
            <TextFieldRow title={maxAttmpStr} type='number' value={maxAttempts} setValue={setMaxAttempts} />
            {languages.map(toLanguageRow)}
            <Button variant="text" onClick={addLanguageRow}><Translator path="add_task.addLanguage" /></Button>
        </List>
    )
})

export default AddTaskFields;
