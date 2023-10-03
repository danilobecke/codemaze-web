import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import AddTaskFields from "../../elements/AddTaskFields/AddTaskFields";
import Task from "../../../models/Task";

function TaskSettings(props: { task: Task | null, show: boolean, onClose: (task?: Task) => void }) {

    async function submit() {

    }

    return (
        <div>
            <Dialog open={props.show} onClose={() => props.onClose()}>
                <DialogTitle><Translator path="task_settings.title" /></DialogTitle>
                <DialogContent>
                    <AddTaskFields task={props.task ?? undefined} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => props.onClose()}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TaskSettings;
