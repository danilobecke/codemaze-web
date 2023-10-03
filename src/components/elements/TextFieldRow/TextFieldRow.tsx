import { ChangeEvent, Fragment, HTMLInputTypeAttribute } from "react";

import { ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";

function TextFieldRow<T>(props: { title: string, required?: boolean, type: HTMLInputTypeAttribute, hasError?: boolean, value: T, setValue: (value: T) => void, themeColor?: string }) {
    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value as unknown
        props.setValue(value as T)
    }

    const color = props.themeColor ?? 'white'

    return (
        <ListItem>
            <ListItemText
                primary={
                    <Fragment>
                        <Typography variant="h5" display='inline' component='span' color={props.hasError ? 'error' : color}>{props.title}</Typography>
                        {props.required ? <Typography variant="h5" display='inline' color='error'> *</Typography> : null}
                    </Fragment>
                }
            />
            <Stack direction='row' spacing={2}>
                <span />
                <TextField
                    error={props.hasError}
                    type={props.type}
                    variant="outlined"
                    value={props.value}
                    onChange={onChange}
                    inputProps={{ sx: { color: color } }}
                    sx={{ "fieldset.MuiOutlinedInput-notchedOutline": { borderColor: color }, "&:hover fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'ActiveBorder' } }}
                />
            </Stack>
        </ListItem>
    )
}

export default TextFieldRow;
