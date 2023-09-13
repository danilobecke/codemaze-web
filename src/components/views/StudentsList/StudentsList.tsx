import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Container, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { CheckBox, DisabledByDefaultRounded } from "@mui/icons-material";

import Session from "../../../services/Session";
import { getArray, v1Namespace } from "../../../services/ApiService";
import { PublicUser } from "../../../models/PublicUser";
import { JoinRequest } from "../../../models/JoinRequest";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import Translator from "../../elements/Translator/Translator";
import ManageRequest from "../ManageRequest/ManageRequest";

function StudentsList() {
    const { groupID } = useParams()
    const user = Session.getCurrentUser()

    const [requests, setRequests] = useState<JoinRequest[]>([])
    const [students, setStudents] = useState<PublicUser[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [showManageRequest, setShowManageRequest] = useState(false)
    const [selectedJoinRequest, setSelectedJoinRequest] = useState<JoinRequest>(new JoinRequest())

    useEffect(() => {
        async function fetch() {
            if (!user || user.role !== 'manager') {
                Session.logOut()
                throw Error('Unauthorized')
            }
            return Promise.all([
                getArray(v1Namespace('groups/' + groupID + '/requests'), 'requests', JoinRequest, setIsLoading),
                getArray(v1Namespace('groups/' + groupID + '/students'), 'students', PublicUser, setIsLoading)
            ])
                .then((response) => {
                    setRequests(response[0])
                    setStudents(response[1])
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
    }, [groupID, requests.length, students.length])

    function requestToRow(joinRequest: JoinRequest) {
        return (
            <ListItem
                key={joinRequest.id}
                secondaryAction={
                    <div>
                        <IconButton onClick={() => updateResquest(true, joinRequest)}><CheckBox color='success' fontSize='large' /></IconButton>
                        <IconButton onClick={() => updateResquest(false, joinRequest)}><DisabledByDefaultRounded color='error' fontSize='large' /></IconButton>
                    </div>
                }
            >
                <ListItemText primary={joinRequest.student} primaryTypographyProps={{ variant: 'h5' }} />
            </ListItem>
        )
    }

    function updateResquest(approve: boolean, request: JoinRequest) {
        request.approve = approve
        setSelectedJoinRequest(request)
        setShowManageRequest(true)
    }

    function manageRequestOnClose(success: boolean) {
        setShowManageRequest(false)
        if (success) {
            setRequests(requests.filter((request) => request.id !== selectedJoinRequest.id))
        }
    }

    function studentToRow(student: PublicUser) {
        return (
            <ListItem key={student.name}>
                <ListItemText primary={student.name + ' - ' + student.email} primaryTypographyProps={{ variant: 'h5' }} />
            </ListItem>
        )
    }

    return (
        <div>
            <NavigationBar />
            <Container>
                <Stack direction='column' spacing={4}>
                    <Typography variant="h1"><Translator path="students_list.title" /></Typography>
                    {requests.length < 1 ? null :
                        <Stack>
                            <Typography variant="h4"><Translator path="students_list.requests" /></Typography>
                            <List>
                                {requests.map(requestToRow)}
                            </List>
                        </Stack>
                    }
                    {students.length < 1 ? null :
                        <Stack>
                            <Typography variant="h4"><Translator path="students_list.active" /></Typography>
                            <List>
                                {students.map(studentToRow)}
                            </List>
                        </Stack>
                    }
                    {students.length > 0 || requests.length > 0 ? null :
                        <Typography variant="h5"><Translator path="students_list.empty" /></Typography>
                    }
                </Stack>
            </Container>
            <ManageRequest show={showManageRequest} onClose={manageRequestOnClose} request={selectedJoinRequest}/>
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default StudentsList;
