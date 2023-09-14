import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Container, List, Stack, Typography } from "@mui/material";

import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import { Task } from "../../../models/Task";
import Row from "../../elements/Row/Row";
import { getArray, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";

function TasksList() {
    const user = Session.getCurrentUser()
    const { groupID } = useParams()

    const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
    const [openTasks, setOpenTasks] = useState<Task[]>([])
    const [closedTasks, setClosedTasks] = useState<Task[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetch() {
            return getArray(v1Namespace('groups/' + groupID + '/tasks'), 'tasks', Task, setIsLoading)
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
                    setClosedTasks(sorted.filter((task) => {
                        const endsOn = task.endsOn()
                        return endsOn && endsOn <= now
                    }))
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

    function sort(lhs: Task, rhs: Task) {
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
        // TODO
    }

    function toRow(task: Task) {
        return (<Row key={task.id} text={task.name} onClick={() => open(task)} />)
    }

    function open(task: Task) {
        // TODO
    }

    return (
        <div>
            <NavigationBar>
                {!user || user.role === 'student' ? <></> :
                    <Button variant="contained" size="large" onClick={newTask}><Translator path='tasks.newTask' /></Button>
                }
            </NavigationBar>
            <Container>
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
            </Container>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default TasksList;
