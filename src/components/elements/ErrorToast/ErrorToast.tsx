import { Alert, AlertTitle, Fade, Snackbar } from "@mui/material";
import Translator from "../Translator/Translator";

function ErrorToast(props: { message: string | null, setError: (message: string | null) => void, onClose?: () => void }) {
    function onClose() {
        props.setError(null)
        if (props.onClose) {
            props.onClose()
        }
    }
    return (
        <Snackbar open={props.message != null} autoHideDuration={2000} onClose={onClose} anchorOrigin={{vertical: 'top', horizontal:'center'}} TransitionComponent={Fade}>
            <Alert severity="error" onClose={onClose}>
                <AlertTitle><Translator path="snackbar.error" /></AlertTitle>
                {props.message}
            </Alert>
        </Snackbar>
    );
}

export default ErrorToast;
