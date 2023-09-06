import { Alert, AlertTitle, Fade, Snackbar } from "@mui/material";

function ErrorToast(props: { message: string | null, setError: (message: string | null) => void }) {
    function onClose() {
        props.setError(null)
    }
    return (
        <Snackbar open={props.message != null} autoHideDuration={2000} onClose={onClose} anchorOrigin={{vertical: 'top', horizontal:'center'}} TransitionComponent={Fade}>
            <Alert severity="error" onClose={onClose}>
                <AlertTitle>Error</AlertTitle>
                {props.message}
            </Alert>
        </Snackbar>
    );
}

export default ErrorToast;
