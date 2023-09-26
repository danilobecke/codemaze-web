import { useState } from "react";

import { FormControl, ListItem, ListItemText, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";

import Translator from "../Translator/Translator";

export default function TestVisibilitySelectRow(props: { setClosed: (closed: boolean) => void }) {
    return (
        <ListItem key={'visibility_selection'}>
            <ListItemText primary={Translator({ path: 'visibility_selector.title' })} primaryTypographyProps={{ variant: 'h5' }} />
            <Stack direction='row' spacing={4}>
                <span />
                <TestVisibilitySelect setClosed={props.setClosed} />
            </Stack>
        </ListItem>
    )
}

function TestVisibilitySelect(props: { setClosed: (closed: boolean) => void }) {
    const [visibility, setVisibility] = useState<string | undefined>()

    function handleChange(event: SelectChangeEvent) {
        const selected = event.target.value
        setVisibility(selected)
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
                value={visibility}
                onChange={handleChange}
            >
                <MenuItem value={'open'}><Translator path='visibility_selector.open' /></MenuItem>
                <MenuItem value={'closed'}><Translator path='visibility_selector.closed' /></MenuItem>
            </Select>
        </FormControl>
    )
}
