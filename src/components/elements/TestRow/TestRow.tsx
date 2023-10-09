import { Button, ListItem, ListItemText, Stack } from "@mui/material";

import TestCase from "../../../models/TestCase";
import Translator from "../Translator/Translator";
import { downloadFile } from "../../../services/Helpers";
import LinkItem from "../LinkItem/LinkItem";

function TestRow(props: { test: TestCase, position: number, setIsLoading: (isLoading: boolean) => void, deleteTouched?: (test: TestCase, position: number) => void }) {
    const testStr = Translator({ path: 'test_row.test' })
    const inputStr = Translator({ path: 'test_row.input' })
    const outputStr = Translator({ path: 'test_row.output' })

    function filename(isInput: boolean) {
        return (props.test.closed ? 'closed' : 'open') + '-test' + props.position + (isInput ? '.in' : '.out')
    }

    return <ListItem key={props.test.id}>
        <ListItemText primary={testStr + ' ' + props.position} primaryTypographyProps={{ variant: 'h5' }} />
        <Stack direction='row' spacing={4}>
            {props.test.input_url ? <LinkItem title={inputStr} onClick={() => downloadFile(props.test.input_url!, filename(true), props.setIsLoading, true, false)} /> : null}
            {props.test.output_url ? <LinkItem title={outputStr} onClick={() => downloadFile(props.test.output_url!, filename(false), props.setIsLoading, true, false)} /> : null}
            {!props.deleteTouched ? null : <Button variant="outlined" color="error" onClick={() => props.deleteTouched!(props.test, props.position)}><Translator path='test_row.delete' /></Button>}
        </Stack>
    </ListItem>
}

export default TestRow;
