import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Container, IconButton, List, Stack, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import Task from "../../../models/Task";
import { get, v1Namespace } from "../../../services/ApiService";
import Row from "../../elements/Row/Row";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";

function TaskDetails() {
    const user = Session.getCurrentUser()
    const { taskID } = useParams()

    const [task, setTask] = useState<Task | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID!), Task, setIsLoading)
                .then((task) => {
                    setTask(task)
                })
        }
        fetch()
            .catch((error) => {
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                } else {
                    alert(error) // fallback
                }
            })
    }, [task?.name, task?.startsOn])

    function showSettings() {

    }

    function showDetails() {

    }

    function showTests() {

    }

    function showLatestResult() {

    }

    function showReport() {

    }

    return (
        <div>
            <NavigationBar>
                {!user || user.role === 'student' ? <></> : <IconButton sx={{ padding: 0 }} onClick={showSettings}><Settings fontSize="large" sx={{ color: 'white' }} /></IconButton>}
            </NavigationBar>
            <Container>
                <Stack direction='column' spacing={4}>
                    {!task ? null :
                        <div>
                            <Typography variant="h1">{task.name}</Typography>
                            {
                                task.isClosed() ? <Typography variant="h5"><Translator path="task.closed" /></Typography> :
                                    <div>
                                        <Typography variant="h5"><Translator path="task.start" />: {task.startsOn().toLocaleString()}</Typography>
                                        {task.endsOn() ? <Typography variant="h5"><Translator path="task.end" />: {task.endsOn()!.toLocaleString()}</Typography> : null}
                                    </div>
                            }
                            {task.max_attempts ? <Typography variant="h5"><Translator path="task.maxAttempts" />: {'' + task.max_attempts!}</Typography> : null}
                            <Typography variant="h5"><Translator path="task.languages" />: {task.languages.join(', ')}</Typography>
                        </div>
                    }
                    <List>
                        <Row key='details' text={Translator({ path: 'task.details' })} onClick={showDetails} />
                        <Row key='tests' text={Translator({ path: 'task.tests' })} onClick={showTests} />
                        {!user || user.role === 'manager' ? null : <Row key='result' text={Translator({ path: 'task.latestResult' })} onClick={showLatestResult} />}
                        {!user || user.role === 'student' ? null : <Row key='report' text={Translator({ path: 'task.report' })} onClick={showReport} />}
                    </List>
                </Stack>
            </Container>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default TaskDetails;
