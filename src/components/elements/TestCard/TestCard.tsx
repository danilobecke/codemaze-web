import { Card, CardContent, IconButton, Stack, Typography } from "@mui/material";

import Translator from "../Translator/Translator";
import FileUploadRow from "../FileUploadRow/FileUploadRow";
import TestVisibilitySelectRow from "../TestVisibilitySelectRow/TestVisibilitySelectRow";
import { RemoveCircleOutlineRounded } from "@mui/icons-material";

function TestCard(props: { index: number, inputError: boolean, outputError: boolean, kindError: boolean, inputFile: File | null, outputFile: File | null, closed: boolean | null, setInputFile: (index: number, file: File) => void, setOutputFile: (index: number, file: File) => void, setClosed: (index: number, closed: boolean) => void, onDelete?: (index: number) => void }) {
    const inputStr = Translator({ path: 'new_test.input' })
    const outputStr = Translator({ path: 'new_test.output' })

    return (
        <Card>
            <CardContent>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h5"><Translator path="new_test.cardTitle" arguments={{ position: props.index + 1 }} /></Typography>
                    {props.onDelete ? <IconButton onClick={() => props.onDelete!(props.index)}><RemoveCircleOutlineRounded color="error" /></IconButton> : null}
                </Stack>
                <FileUploadRow title={inputStr} hasError={props.inputError} file={props.inputFile} setFile={file => props.setInputFile(props.index, file)} />
                <FileUploadRow title={outputStr} hasError={props.outputError} file={props.outputFile} setFile={file => props.setOutputFile(props.index, file)} />
                <TestVisibilitySelectRow hasError={props.kindError} closed={props.closed} setClosed={closed => props.setClosed(props.index, closed)} />
            </CardContent>
        </Card >
    )
}

export default TestCard;
