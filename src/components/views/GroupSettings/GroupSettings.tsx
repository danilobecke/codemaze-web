import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from "@mui/material";

import { Group } from "../../../models/Group";
import Translator from "../../elements/Translator/Translator";

function GroupSettings(props: { show: boolean, onClose: (didUpdate: boolean) => void, group: Group }) {
    function submit() {
        // TODO
    }

    return (
        <div>
            <Dialog open={props.show} onClose={() => props.onClose(false)}>
                <DialogTitle><Translator path='group_settings.title' /></DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={<Switch defaultChecked={props.group.active} />}
                        label={Translator({ path: 'group_settings.active' })}
                        labelPlacement="start"
                        sx={{ margin: 0, width: '100%' }}
                    />
                    <TextField fullWidth value={props.group.name} label={Translator({ 'path': 'group_settings.name' })} type='text' name='groupName' variant="standard"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => props.onClose(false)}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default GroupSettings;
