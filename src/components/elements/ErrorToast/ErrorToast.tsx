import { Alert, AlertTitle, Fade, Snackbar } from "@mui/material";
import Translator from "../Translator/Translator";
import { AppError } from "../../../models/AppError";

function ErrorToast(props: { appError: AppError | null, setAppError: (message: AppError | null) => void, onClose?: () => void }) {
    function onClose() {
        props.setAppError(null)
        if (props.onClose) {
            props.onClose()
        }
    }
    return (
        <Snackbar open={props.appError != null} autoHideDuration={2000} onClose={onClose} anchorOrigin={{vertical: 'top', horizontal:'center'}} TransitionComponent={Fade}>
            <Alert severity="error" onClose={onClose}>
                <AlertTitle><Translator path="snackbar.error" />: {props.appError?.title}</AlertTitle>
                {props.appError?.message}
            </Alert>
        </Snackbar>
    );
}

export default ErrorToast;
