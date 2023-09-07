import { Alert, Fade, Snackbar } from "@mui/material";

import Translator from "../Translator/Translator";

function SuccessToast(props: { show: boolean, close: () => void }) {
    return (
        <Snackbar open={props.show} autoHideDuration={2000} onClose={props.close} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={Fade}>
            <Alert severity="success">
                <Translator path="snackbar.success" />
            </Alert>
        </Snackbar>
    );
}

export default SuccessToast;
