import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Container, List, Stack, Typography } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import { Group } from "../../../models/Group";
import { getArray, v1Namespace } from "../../../services/ApiService";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Session from "../../../services/Session";
import { Role } from "../../../models/Role";
import NewGroup from "../NewGroup/NewGroup";
import JoinGroup from "../JoinGroup/JoinGroup";
import Loader from "../../elements/Loader/Loader";
import Row from "../../elements/Row/Row";

function Groups() {
    const user = Session.getCurrentUser()

    const [activeGroups, setActiveGroups] = useState<Group[]>([])
    const [inactiveGroups, setInactiveGroups] = useState<Group[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [showNewGroup, setShowNewGroup] = useState(false)
    const [showJoinGroup, setShowJoinGroup] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            return getArray(v1Namespace('groups', [{ key: 'member_of', value: true }]), 'groups', Group, setIsLoading)
                .then(groups => {
                    const sorted = groups.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
                    setActiveGroups(sorted.filter(group => group.active))
                    setInactiveGroups(sorted.filter(group => !group.active))
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
    }, [])

    function buttonAction(role: Role) {
        switch (role) {
            case "manager":
                setShowNewGroup(true)
                break;
            case "student":
                setShowJoinGroup(true)
                break;
        }
    }

    function toListItem(group: Group) {
        return (<Row key={group.id} onClick={() => { openGroup(group.id) }} text={group.name} />)
    }

    function openGroup(id: number) {
        navigate('' + id) // relative path
    }

    return (
        !user ? null :
            <div>
                <NavigationBar>
                    <Button variant="contained" size="large" onClick={() => buttonAction(user.role)}>{user.role === 'manager' ? <Translator path="groups.new" /> : <Translator path="groups.join" />}</Button>
                </NavigationBar>
                <Container>
                    <Stack direction='column' spacing={4}>
                        <Typography variant="h1"><Translator path="groups.title" /></Typography>
                        {activeGroups.length === 0 ? null :
                            <Stack>
                                <Typography variant="h4"><Translator path="groups.active" /></Typography>
                                <List>
                                    {activeGroups.map(toListItem)}
                                </List>
                            </Stack>
                        }
                        {inactiveGroups.length === 0 ? null :
                            <Stack>
                                <Typography variant="h4"><Translator path="groups.inactive" /></Typography>
                                <List>
                                    {inactiveGroups.map(toListItem)}
                                </List>
                            </Stack>
                        }
                        {activeGroups.length === 0 && inactiveGroups.length === 0 ? <Typography variant="h5"><Translator path="groups.empty" /></Typography> : null}
                    </Stack>
                    <ErrorToast message={errorMessage} setError={setErrorMessage} />
                </Container>
                <NewGroup show={showNewGroup} close={() => setShowNewGroup(false)} />
                <JoinGroup show={showJoinGroup} close={() => setShowJoinGroup(false)} />
                <Loader show={isLoading} />
            </div>
    )
}

export default Groups;
