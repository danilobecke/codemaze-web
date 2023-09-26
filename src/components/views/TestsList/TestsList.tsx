import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Container, Link, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import Session from "../../../services/Session";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";
import TestCase from "../../../models/TestCase";
import { get, v1Namespace } from "../../../services/ApiService";
import { AllTests } from "../../../models/AllTests";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { downloadFile } from "../../../services/Helpers";
import TestDeletionConfirmation, { TestDeletionConfirmationProps } from "../TestDeletionConfirmation/TestDeletionConfirmation";

function TestsList() {
    const { taskID } = useParams()
    const user = Session.getCurrentUser()

    const [allTests, setAllTests] = useState<AllTests | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const hoverPointerSX = { "&:hover": { 'cursor': 'pointer' } }
    const testStr = Translator({ path: 'tests.test' })
    const testsStr = Translator({ path: 'tests.tests' })
    const inputStr = Translator({ path: 'tests.input' })
    const outputStr = Translator({ path: 'tests.output' })

    const [deletionProps, setDeletionProps] = useState<TestDeletionConfirmationProps | null>(null)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID + '/tests'), AllTests, setIsLoading)
                .then(allTests => setAllTests(allTests))
        }
        fetch()
            .catch(error => {
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                } else {
                    alert(error) // fallback
                }
            })
    }, [allTests?.open_tests.length, allTests?.closed_tests.length])

    function newTest() {
        // TODO
    }

    function rows(tests: TestCase[]) {
        let rows: JSX.Element[] = []
        for (const [index, test] of tests.entries()) {
            rows.push(toRow(index + 1, test))
        }
        return rows
    }

    function toRow(position: number, test: TestCase) {
        return <ListItem key={test.id}>
            <ListItemText primary={testStr + ' ' + position} primaryTypographyProps={{ variant: 'h5' }} />
            <Stack direction='row' spacing={4}>
                {test.input_url ? <Typography variant="h5"><Link sx={hoverPointerSX} onClick={() => downloadFile(test.input_url!, 'test.in', setIsLoading)}>{inputStr}</Link></Typography> : null}
                {test.output_url ? <Typography variant="h5"><Link sx={hoverPointerSX} onClick={() => downloadFile(test.output_url!, 'test.out', setIsLoading)}>{outputStr}</Link></Typography> : null}
                {!user || user.role === 'student' ? null : <Button variant="outlined" color="error" onClick={() => showDelete(test, position)}><Translator path='tests.delete' /></Button>}
            </Stack>
        </ListItem>
    }

    function showDelete(test: TestCase, position: number) {
        setDeletionProps({
            test: test,
            position: position,
            onClose: onDeletionClose
        })
    }

    function onDeletionClose(removed?: TestCase) {
        if (removed) {
            const newValue = new AllTests()
            newValue.open_tests = allTests!.open_tests.filter(test => test.id !== removed.id)
            newValue.closed_tests = allTests!.closed_tests.filter(test => test.id !== removed.id)
            setAllTests(newValue)
        }
        setDeletionProps(null)
    }

    function singleRow(tests: TestCase[]) {
        const numberOfTests = tests.length
        return <ListItem key='single-row'>
            <ListItemText primary={numberOfTests + ' ' + (numberOfTests > 1 ? testsStr : testStr)} primaryTypographyProps={{ variant: 'h5' }} />
        </ListItem>
    }

    return (
        <div>
            <NavigationBar>
                {!user || user.role === 'student' ? <></> : <Button variant="contained" onClick={newTest}><Translator path="tests.newTest" /></Button>}
            </NavigationBar>
            <Container>
                <Stack direction='column' spacing={4}>
                    <Typography variant="h1"><Translator path="tests.title" /></Typography>
                    {
                        !allTests || allTests.open_tests.length === 0 ? null :
                            <Stack>
                                <Typography variant="h4"><Translator path="tests.open" /></Typography>
                                <List>
                                    {rows(allTests.open_tests)}
                                </List>
                            </Stack>
                    }
                    {
                        !allTests || allTests.closed_tests.length === 0 ? null :
                            <Stack>
                                <Typography variant="h4"><Translator path="tests.closed" /></Typography>
                                {user?.role === 'student' ?
                                    (singleRow(allTests.closed_tests))
                                    :
                                    <List>
                                        {rows(allTests.closed_tests)}
                                    </List>
                                }
                            </Stack>
                    }
                    {
                        !allTests || (allTests.open_tests.length === 0 && allTests.closed_tests.length === 0) ? <Typography variant="h5"><Translator path="tests.empty" /></Typography> : null
                    }
                </Stack>
            </Container>
            <TestDeletionConfirmation data={deletionProps} />
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default TestsList;