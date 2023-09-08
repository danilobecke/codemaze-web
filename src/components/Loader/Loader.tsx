import { createPortal } from "react-dom";

import { Backdrop, CircularProgress } from "@mui/material";

function Loader(props: {show: boolean}) {
    return createPortal(
        <Backdrop open={props.show} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
            <CircularProgress />
        </Backdrop>
        , document.body
    )
}

export default Loader;
