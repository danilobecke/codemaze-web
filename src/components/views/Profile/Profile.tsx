import { useNavigate } from "react-router-dom";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";

function Profile(props: {show: boolean, close: () => void}) {
    const navigate = useNavigate()
    const user = Session.getCurrentUser()

    function logOut() {
        props.close()
        Session.logOut()
        navigate('/')
    }

    return (
        user ?
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle>{user.name}</DialogTitle>
            <DialogContent>
                <DialogContentText>{user.email}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={props.close}><Translator path="buttons.cancel" /></Button>
                <Button variant="outlined" color="error" onClick={logOut}><Translator path="profile.logOut" /></Button>
            </DialogActions>
        </Dialog> : null
    )
}

export default Profile;
