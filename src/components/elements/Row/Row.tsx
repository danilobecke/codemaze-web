import { Key } from "react";

import { ChevronRight } from "@mui/icons-material";
import { Badge, BadgeProps, ListItemButton, ListItemText, Stack, styled } from "@mui/material";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      top: 12,
    },
  }));

function Row(props: { key: Key, text: string, badgeCount?: number, onClick: () => void }) {
    return (
        <ListItemButton key={props.key} onClick={props.onClick}>
            <ListItemText primary={props.text} primaryTypographyProps={{ variant: 'h5' }} />
            <Stack direction='row' spacing={2}>
                <StyledBadge badgeContent={props.badgeCount || 0} color="info" />
                <ChevronRight color="inherit" />
            </Stack>
        </ListItemButton>
    )
}

export default Row;
