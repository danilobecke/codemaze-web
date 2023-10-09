import { HTMLAttributeAnchorTarget } from "react";

import { Link, Typography } from "@mui/material";

function LinkItem(props: { title: string, onClick?: () => void, href?: string, target?: HTMLAttributeAnchorTarget }) {
    return (
        <Typography variant="h5" sx={{ ['& :hover']: { cursor: 'pointer' } }}>
            <Link onClick={props.onClick} href={props.href} target={props.target}>{props.title}</Link>
        </Typography>
    )
}

export default LinkItem;
