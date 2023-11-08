import { useRef, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import AddTaskFields, { AddTaskHandler } from "../../elements/AddTaskFields/AddTaskFields";
import Task from "../../../models/Task";
import { patchFormData, v1Namespace } from "../../../services/ApiService";
import { TaskSummary } from "../../../models/TaskSummary";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Loader from "../../elements/Loader/Loader";
import { AppError } from "../../../models/AppError";
import { handleError } from "../../../services/Helpers";

function TaskSettings(props: { task: Task | null, show: boolean, onClose: (shouldRefresh?: boolean) => void }) {

    const ref = useRef<AddTaskHandler>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    async function submit() {
        const formData = ref.current?.getFormData()
        if (!formData || !props.task) {
            return
        }
        try {
            await patchFormData(v1Namespace('tasks/' + props.task.id), formData, TaskSummary, setIsLoading)
            props.onClose(true)
        } catch (error) {
            handleError(error, setAppError)
        }
    }

    return (
        <div>
            <Dialog open={props.show} onClose={() => props.onClose()}>
                <DialogTitle><Translator path="task_settings.title" /></DialogTitle>
                <DialogContent>
                    <AddTaskFields ref={ref} task={props.task ?? undefined} />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => props.onClose()}><Translator path='buttons.cancel' /></Button>
                    <Button variant='contained' onClick={submit}><Translator path='buttons.send' /></Button>
                </DialogActions>
            </Dialog>
            <ErrorToast appError={appError} setAppError={setAppError} />
            <Loader show={isLoading} />
        </div>
    )
}

export default TaskSettings;
