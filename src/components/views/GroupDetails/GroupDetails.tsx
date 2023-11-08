import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { IconButton, List, Stack, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { get, getArray, v1Namespace } from "../../../services/ApiService";
import { Group } from "../../../models/Group";
import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import { JoinRequest } from "../../../models/JoinRequest";
import Row from "../../elements/Row/Row";
import GroupSettings from "../GroupSettings/GroupSettings";
import AppContainer from "../../elements/AppContainer/AppContainer";

function GroupDetails() {
    const { groupID } = useParams()
    const user = Session.getCurrentUser()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [group, setGroup] = useState<Group>(new Group())
    const [requestsCount, setRequestsCount] = useState(0)

    const tasksLabel = Translator({ path: 'group.tasks' })
    const studentsLabel = Translator({ path: 'group.students' })

    const [settingsOpen, setSettingsOpen] = useState(false)

    useEffect(() => {
        async function fetch() {
            return Promise.all([
                get(v1Namespace('groups/' + groupID), Group, setIsLoading),
                user && user.role === 'manager' ?
                    getArray(v1Namespace('groups/' + groupID + '/requests'), 'requests', JoinRequest, setIsLoading)
                        .then(result => result.length)
                    : Promise.resolve(0)
            ])
                .then((results) => {
                    setGroup(results[0])
                    setRequestsCount(results[1])
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
    }, [group?.active, group?.name])

    function showSettings() {
        if (!user || user.role === 'student') {
            return
        }
        setSettingsOpen(true)
    }

    function openTasks() {
        navigate('tasks')
    }

    function openStudents() {
        navigate('students') // relative path
    }

    function closeSettings(updatedGroup: Group | null) {
        setSettingsOpen(false)
        if (updatedGroup) {
            setGroup(updatedGroup)
        }
    }

    return (
        <div>
            <NavigationBar>
                {!user || user.role === 'student' ? <></> : <IconButton sx={{ padding: 0 }} onClick={showSettings}><Settings fontSize="large" sx={{ color: 'white' }} /></IconButton>}
            </NavigationBar>
            <AppContainer>
                {!group || !user ? null :
                    <Stack direction='column' spacing={4}>
                        <div>
                            <Typography variant="h1">{group.name}</Typography>
                            <Typography variant="h5"><b><Translator path="group.manager" />:</b> {group.manager.name} - {group.manager.email}</Typography>
                            <Typography variant="h5"><b><Translator path="group.code" />:</b> {group.code}</Typography>
                        </div>
                        <List>
                            <Row key='tasks' onClick={openTasks} text={tasksLabel} />
                            {
                                user.role === 'student' ? null : <Row key='students' onClick={openStudents} text={studentsLabel} badgeCount={requestsCount} />
                            }
                        </List>
                    </Stack>
                }
            </AppContainer>
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
            <Loader show={isLoading} />
            <GroupSettings show={settingsOpen} onClose={closeSettings} group={group} />
        </div>
    )
}

export default GroupDetails;
