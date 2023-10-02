import { Fragment, useState } from "react";

import { FormControl, ListItem, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";

import Translator from "../Translator/Translator";

export default function TestVisibilitySelectRow(props: { hasError: boolean, closed: boolean | null, setClosed: (closed: boolean) => void }) {
    return (
        <ListItem key={'visibility_selection'}>
            <ListItemText primary={
                <Fragment>
                    <Typography variant="h5" display='inline' component='span' color={props.hasError ? 'error' : 'CaptionText'}><Translator path='visibility_selector.title' /></Typography>
                    <Typography variant="h5" display='inline' color='error'> *</Typography>
                </Fragment>
            }
            />
            <Stack direction='row' spacing={4}>
                <span />
                <TestVisibilitySelect closed={props.closed} setClosed={props.setClosed} />
            </Stack>
        </ListItem>
    )
}

function TestVisibilitySelect(props: { closed: boolean | null, setClosed: (closed: boolean) => void }) {
    function handleChange(event: SelectChangeEvent) {
        const selected = event.target.value
        switch (selected) {
            case 'open':
                props.setClosed(false)
                break
            case 'closed':
                props.setClosed(true)
                break
        }
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
                id="visibility-selectt"
                value={props.closed !== null ? (props.closed ? 'closed' : 'open') : ''}
                onChange={handleChange}
            >
                <MenuItem value={'open'}><Translator path='visibility_selector.open' /></MenuItem>
                <MenuItem value={'closed'}><Translator path='visibility_selector.closed' /></MenuItem>
            </Select>
        </FormControl>
    )
}
