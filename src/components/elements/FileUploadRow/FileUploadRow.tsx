import { ChangeEvent, useState } from 'react';

import { Button, ListItem, ListItemText, Stack, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Translator from '../Translator/Translator';

export default function FileUploadRow(props: { title: string, setFile: (file: File) => void }) {
    const [filename, setFilename] = useState<string | null>(null)

    function setFile(file: File) {
        setFilename(file.name)
        props.setFile(file)
    }

    return (
        <ListItem key={props.title.replace(' ', '_') + '-upload_file'}>
            <ListItemText primary={props.title} primaryTypographyProps={{ variant: 'h5' }} secondary={filename} />
            <Stack direction='row' spacing={4}>
                <span />
                <FileUploadButton setFile={setFile} />
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
