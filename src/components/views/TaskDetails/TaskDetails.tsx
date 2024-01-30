import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, IconButton, List, Stack, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import Task from "../../../models/Task";
import { get, v1Namespace } from "../../../services/ApiService";
import Row from "../../elements/Row/Row";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { downloadFile, handleError } from "../../../services/Helpers";
import TaskSettings from "../TaskSettings/TaskSettings";
import SendCode from "../SendCode/SendCode";
import { Result } from "../../../models/Result";
import AppContainer from "../../elements/AppContainer/AppContainer";
import { AppError } from "../../../models/AppError";

function TaskDetails() {
    const user = Session.getCurrentUser()
    const { taskID } = useParams()
    const navigate = useNavigate()

    const [task, setTask] = useState<Task | null>(null)
    const [count, setCount] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isSubmitCodeOpen, setIsSubmitCodeOpen] = useState(false)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID!), Task, setIsLoading)
                .then((task) => {
                    setTask(task)
                })
        }
        fetch()
            .catch((error) => {
                handleError(error, setAppError)
            })
    }, [count])

    function showSubmit() {
        setIsSubmitCodeOpen(true)
    }

    function closeSubmit(result?: Result) {
        setIsSubmitCodeOpen(false)
        if (result) {
            showLatestResult(result)
        }
    }

    function showSettings() {
        setIsSettingsOpen(true)
    }

    function closeSettings(shouldRefresh?: boolean) {
        setIsSettingsOpen(false)
        if (shouldRefresh) {
            setCount(count + 1)
        }
    }

    async function showDetails() {
        if (!task) {
            return
        }
        downloadFile(task.file_url, 'details', setIsLoading)
    }

    function showTests() {
        navigate('tests')
    }

    function showLatestResult(result?: Result) {
        navigate('result', {
            state: {
                result: result
            }
        })
    }

    function showReport() {
        navigate('report')
    }

    return (
        <div>
            <AppContainer navigationBarChildren={
                <div>
                    {!user || user.role === 'student' ?
                        task?.isClosed() === true ? <></> : <Button variant="contained" onClick={showSubmit}><Translator path="task.submit" /></Button>
                        :
                        <IconButton sx={{ padding: 0 }} onClick={showSettings}><Settings fontSize="large" sx={{ color: 'white' }} /></IconButton>
                    }
                </div>
            }>
                <Stack direction='column' spacing={4}>
                    {!task ? null :
                        <div>
                            <Typography variant="h1">{task.name}</Typography>
                            {
                                task.isClosed() ? <Typography variant="h5"><b><Translator path="task.closed" /></b></Typography> :
                                    <div>
                                        <Typography variant="h5"><b><Translator path="task.start" />:</b> {task.startsOn().toLocaleString()}</Typography>
                                        {task.endsOn() ? <Typography variant="h5"><b><Translator path="task.end" />:</b> {task.endsOn()!.toLocaleString()}</Typography> : null}
                                    </div>
                            }
                            {task.max_attempts ? <Typography variant="h5"><b><Translator path="task.maxAttempts" />:</b> {'' + task.max_attempts!}</Typography> : null}
                            <Typography variant="h5"><b><Translator path="task.languages" />:</b> {task.languages.join(', ')}</Typography>
                        </div>
                    }
                    <List>
                        <Row key='details' text={Translator({ path: 'task.details' })} onClick={showDetails} />
                        <Row key='tests' text={Translator({ path: 'task.tests' })} onClick={showTests} />
                        {!user || user.role === 'manager' ? null : <Row key='result' text={Translator({ path: 'task.latestResult' })} onClick={() => showLatestResult()} />}
                        {!user || user.role === 'student' ? null : <Row key='report' text={Translator({ path: 'task.report' })} onClick={showReport} />}
                    </List>
                </Stack>
            </AppContainer>
            <Loader show={isLoading} />
            <ErrorToast appError={appError} setAppError={setAppError} />
            <TaskSettings task={task} show={isSettingsOpen} onClose={closeSettings} />
            <SendCode show={isSubmitCodeOpen} close={closeSubmit} />
        </div>
    )
}

export default TaskDetails;
