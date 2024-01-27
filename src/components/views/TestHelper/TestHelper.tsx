import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import { downloadFile } from "../../../services/Helpers";
import Loader from "../../elements/Loader/Loader";
import ConfigService from "../../../services/ConfigService";

function TestHelper(props: { show: boolean, close: () => void }) {
    const [isLoading, setIsLoading] = useState(false)

    async function downloadScript() {
        ConfigService
            .getConfigs()
            .then(configs => downloadFile(configs.create_test_script_url, 'create_test_case', setIsLoading, false))
    }

    return (
        <div>
            <Dialog open={props.show} onClose={props.close}>
                <DialogTitle><Translator path="test_helper.title" /></DialogTitle>
                <DialogContent>
                    <DialogContentText><Translator path="test_helper.description" /></DialogContentText>
                    <DialogActions>
                        <Button variant='text' onClick={props.close}><Translator path='buttons.cancel' /></Button>
                        <Button variant='contained' onClick={downloadScript}><Translator path='test_helper.download' /></Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Loader show={isLoading} />
        </div>
    )
}

export default TestHelper;
