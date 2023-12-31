import { ChangeEvent, Fragment } from 'react';

import { Button, ListItem, ListItemText, Stack, Typography, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Translator from '../Translator/Translator';

export default function FileUploadRow(props: { title: string, required?: boolean, hasError: boolean, file: File | null, setFile: (file: File) => void, themeColor?: string }) {
    return (
        <ListItem key={props.title.replace(' ', '_') + '-upload_file'}>
            <ListItemText
                primary={
                    <Fragment>
                        <Typography variant="h5" display='inline' component='span' color={props.hasError ? 'error' : props.themeColor ?? 'CaptionText'}>{props.title}</Typography>
                        {props.required ? <Typography variant="h5" display='inline' color='error'> *</Typography> : null}
                    </Fragment>
                }
                secondary={props.file?.name}
                secondaryTypographyProps={props.themeColor ? {color: props.themeColor} : undefined}
            />
            <Stack direction='row' spacing={4}>
                <span />
                <FileUploadButton setFile={props.setFile} />
            </Stack>
        </ListItem>
    )
}

function FileUploadButton(props: { setFile: (file: File) => void }) {
    function selectFile(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target
        if (!files) {
            return
        }
        props.setFile(files[0])
    }

    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            <Translator path='buttons.uploadFile' />
            <VisuallyHiddenInput type="file" onChange={selectFile} />
        </Button>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
