import { useEffect, useState } from "react";

import { Button, Container, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

import Translator from "../Translator/Translator";
import { Group } from "../../models/Group";
import { getArray, v1Namespace } from "../../services/ApiService";
import ErrorToast from "../ErrorToast/ErrorToast";
import NavigationBar from "../NavigationBar/NavigationBar";
import Session from "../../services/Session";
import { Role } from "../../models/Role";
import NewGroup from "../NewGroup/NewGroup";
import JoinGroup from "../JoinGroup/JoinGroup";
import Loader from "../Loader/Loader";

function Groups() {
    const user = Session.getCurrentUser()

    const [activeGroups, setActiveGroups] = useState<Group[]>([])
    const [inactiveGroups, setInactiveGroups] = useState<Group[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [showNewGroup, setShowNewGroup] = useState(false)
    const [showJoinGroup, setShowJoinGroup] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function fetch() {
            const groups = await getArray(v1Namespace('groups', [{ key: 'member_of', value: true }]), 'groups', Group, setIsLoading)
            const sorted = groups.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
            setActiveGroups(sorted.filter(group => group.active))
            setInactiveGroups(sorted.filter(group => !group.active))
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
        return (<ListItemButton key={group.id} onClick={() => { openGroup(group.id) }}><ListItemText primary={group.name} primaryTypographyProps={{ variant: 'h5' }} /><ChevronRight color="inherit" /></ListItemButton>)
    }

    function openGroup(id: number) {
        console.log(id)
    }

    return (
        !user ? null :
        <div>
            <NavigationBar>
                <Button variant="contained" size="large" onClick={() => buttonAction(user.role)}>{user.role === 'manager' ? <Translator path="groups.new"/> : <Translator path="groups.join"/> }</Button>
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
