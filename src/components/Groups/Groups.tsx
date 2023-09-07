import { useEffect, useState } from "react";

import { Container, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

import Translator from "../Translator/Translator";
import { Group } from "../../models/Group";
import { getArray, v1Namespace } from "../../services/ApiService";
import ErrorToast from "../ErrorToast/ErrorToast";

function Groups() {
    const [activeGroups, setActiveGroups] = useState<Group[]>([])
    const [inactiveGroups, setInactiveGroups] = useState<Group[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetch() {
            const groups = await getArray(v1Namespace('groups', [{ key: 'member_of', value: true }]), 'groups', Group)
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

    function toListItem(group: Group) {
        return (<ListItemButton key={group.id} onClick={() => { openGroup(group.id) }}><ListItemText primary={group.name} primaryTypographyProps={{ variant: 'h5' }} /><ChevronRight color="inherit" /></ListItemButton>)
    }

    function openGroup(id: number) {
        console.log(id)
    }

    return (
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
    )
}

export default Groups;
