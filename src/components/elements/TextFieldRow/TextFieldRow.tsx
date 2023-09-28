import { ChangeEvent, Fragment, HTMLInputTypeAttribute } from "react";

import { ListItem, ListItemText, TextField, Typography } from "@mui/material";

function TextFieldRow<T>(props: { title: string, required?: boolean, type: HTMLInputTypeAttribute, hasError?: boolean, value: T, setValue: (value: T) => void }) {
    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value as unknown
        props.setValue(value as T)
    }

    return (
        <ListItem>
            <ListItemText
                primary={
                    <Fragment>
                        <Typography variant="h5" display='inline' component='span' color={props.hasError ? 'error' : 'white'}>{props.title}</Typography>
                        {props.required ? <Typography variant="h5" display='inline' color='error'> *</Typography> : null}
                    </Fragment>
                }
            />
            <TextField
                error={props.hasError}
                type={props.type}
                variant="outlined"
                value={props.value}
                onChange={onChange}
                inputProps={{ sx: { color: "white" } }}
                sx={{ "fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'white' }, "&:hover fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'ActiveBorder' } }}
            />
        </ListItem>
    )
}

export default TextFieldRow;
