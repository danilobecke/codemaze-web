import { Fragment, useEffect, useState } from "react"

import { FormControl, IconButton, ListItem, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { RemoveCircleOutlineRounded } from "@mui/icons-material"

import { Config } from "../../../models/Config"
import ConfigService from "../../../services/ConfigService"
import Session from "../../../services/Session"
import Translator from "../Translator/Translator"

export default function LanguageSelectRow(props: { position: number, hasError?: boolean, required?: boolean, onDelete?: (position: number) => void, language: string, setLanguage: (position: number, language: string) => void, themeColor?: string }) {
    const color = props.themeColor ?? 'white'

    return (
        <ListItem>
            <ListItemText primary={
                <Fragment>
                    <Typography variant="h5" display='inline' component='span' color={props.hasError ? 'error' : color}><Translator path='language_selector.title' /></Typography>
                    {props.required ? <Typography variant="h5" display='inline' color='error'> *</Typography> : null}
                </Fragment>
            }
            />
            <Stack direction='row' spacing={2}>
                <span />
                <LanguageSelect language={props.language} setLanguage={value => props.setLanguage(props.position, value)} color={color} />
                {props.onDelete ? <IconButton onClick={() => props.onDelete!(props.position)}><RemoveCircleOutlineRounded color="error" /></IconButton> : null}
            </Stack>
        </ListItem>
    )
}

function LanguageSelect(props: { language: string, setLanguage: (language: string) => void, color: string }) {
    const [configs, setConfigs] = useState<Config[] | null>(null)

    useEffect(() => {
        async function fetch() {
            return ConfigService.getConfigs()
                .then(_configs => setConfigs(_configs))
        }
        fetch()
            .catch((_) => {
                Session.logOut()
            })
    }, [])

    function mapToMenuItem(config: Config) {
        const name = config.language_name
        return <MenuItem value={name}>{name}</MenuItem>
    }

    function handleChange(event: SelectChangeEvent) {
        const selected = event.target.value
        props.setLanguage(selected)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
                value={props.language}
                onChange={handleChange}
                inputProps={{ sx: { color: props.color } }}
                sx={{ "fieldset.MuiOutlinedInput-notchedOutline": { borderColor: props.color }, "&:hover fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'ActiveBorder' } }}
            >
                {!configs ? null : configs.map(mapToMenuItem)}
            </Select>
        </FormControl>
    )
}
