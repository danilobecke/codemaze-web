import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, List, Stack, Typography } from "@mui/material";

import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import { TaskSummary } from "../../../models/TaskSummary";
import Row from "../../elements/Row/Row";
import { getArray, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import AppContainer from "../../elements/AppContainer/AppContainer";

function TasksList() {
    const user = Session.getCurrentUser()
    const { groupID } = useParams()
    const navigate = useNavigate()

    const [upcomingTasks, setUpcomingTasks] = useState<TaskSummary[]>([])
    const [openTasks, setOpenTasks] = useState<TaskSummary[]>([])
    const [closedTasks, setClosedTasks] = useState<TaskSummary[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetch() {
            return getArray(v1Namespace('groups/' + groupID + '/tasks'), 'tasks', TaskSummary, setIsLoading)
                .then((tasks) => {
                    const sorted = tasks.sort(sort)
                    const now = new Date()
                    setOpenTasks(sorted.filter((task) => {
                        const endsOn = task.endsOn()
                        const started = task.startsOn() <= now
                        if (!endsOn) {
                            return started
                        }
                        return endsOn > now && started
                    }))
                    setClosedTasks(sorted.filter((task) => { return task.isClosed(now) }))
                    setUpcomingTasks(sorted.filter((task) => {
                        return task.startsOn() > now
                    }))
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
    }, [openTasks.length, closedTasks.length, upcomingTasks.length])

    function sort(lhs: TaskSummary, rhs: TaskSummary) {
        const lhsEndsOn = lhs.endsOn()
        const rhsEndsOn = rhs.endsOn()
        if (lhsEndsOn && rhsEndsOn) {
            return lhsEndsOn < rhsEndsOn ? -1 : 1
        }
        if (lhsEndsOn && !rhsEndsOn) {
            return -1
        }
        return 1
    }

    function newTask() {
        navigate('new', {replace: true})
    }

    function toRow(task: TaskSummary) {
        return (<Row key={task.id} text={task.name} onClick={() => open(task)} />)
    }

    function open(task: TaskSummary) {
        navigate('/tasks/' + task.id)
    }

    return (
        <div>
            <NavigationBar>
                {!user || user.role === 'student' ? <></> :
                    <Button variant="contained" size="large" onClick={newTask}><Translator path='tasks.newTask' /></Button>
                }
            </NavigationBar>
            <AppContainer>
                <Stack direction='column' spacing={4}>
                    <Typography variant="h1"><Translator path='tasks.title' /></Typography>
                    {upcomingTasks.length < 1 ? null :
                        <Stack direction='column'>
                            <Typography variant="h4"><Translator path="tasks.upcoming" /></Typography>
                            <List>
                                {upcomingTasks.map(toRow)}
                            </List>
                        </Stack>
                    }
                    {openTasks.length < 1 ? null :
                        <Stack direction='column'>
                            <Typography variant="h4"><Translator path="tasks.open" /></Typography>
                            <List>
                                {openTasks.map(toRow)}
                            </List>
                        </Stack>
                    }
                    {closedTasks.length < 1 ? null :
                        <Stack direction='column'>
                            <Typography variant="h4"><Translator path="tasks.closed" /></Typography>
                            <List>
                                {closedTasks.map(toRow)}
                            </List>
                        </Stack>
                    }
                    {openTasks.length > 0 || closedTasks.length > 0 || upcomingTasks.length > 0 ? null : <Typography variant="h5"><Translator path="tasks.empty" /></Typography>}
                </Stack>
            </AppContainer>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default TasksList;
