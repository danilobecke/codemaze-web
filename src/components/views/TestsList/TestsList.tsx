import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { HelpOutlineRounded } from "@mui/icons-material";

import Session from "../../../services/Session";
import Translator from "../../elements/Translator/Translator";
import TestCase from "../../../models/TestCase";
import { get, v1Namespace } from "../../../services/ApiService";
import { AllTests } from "../../../models/AllTests";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import TestDeletionConfirmation, { TestDeletionConfirmationProps } from "../TestDeletionConfirmation/TestDeletionConfirmation";
import NewTestCase from "../NewTestCase/NewTestCase";
import TestRow from "../../elements/TestRow/TestRow";
import AppContainer from "../../elements/AppContainer/AppContainer";
import { AppError } from "../../../models/AppError";
import { handleError } from "../../../services/Helpers";
import TestHelper from "../TestHelper/TestHelper";

function TestsList() {
    const { taskID } = useParams()
    const user = Session.getCurrentUser()

    const [allTests, setAllTests] = useState<AllTests | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    const testStr = Translator({ path: 'tests.test' })
    const testsStr = Translator({ path: 'tests.tests' })

    const [deletionProps, setDeletionProps] = useState<TestDeletionConfirmationProps | null>(null)
    const [showNewTest, setShowNewTest] = useState(false)
    const [isTestHelperOpen, setIsTestHelperOpen] = useState(false)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID + '/tests'), AllTests, setIsLoading)
                .then(allTests => setAllTests(allTests))
        }
        fetch()
            .catch(error => {
                handleError(error, setAppError)
            })
    }, [])

    function newTest() {
        setShowNewTest(true)
    }

    function closeNewTest(addedTestCase?: TestCase) {
        if (addedTestCase) {
            const newValue = new AllTests()
            newValue.open_tests = allTests!.open_tests
            newValue.closed_tests = allTests!.closed_tests
            if (addedTestCase.closed) {
                newValue.closed_tests.push(addedTestCase)
            } else {
                newValue.open_tests.push(addedTestCase)
            }
            setAllTests(newValue)
        }
        setShowNewTest(false)
    }

    function rows(tests: TestCase[]) {
        let rows: JSX.Element[] = []
        for (const [index, test] of tests.entries()) {
            rows.push(<TestRow test={test} position={index + 1} setIsLoading={setIsLoading} deleteTouched={!user || user.role === 'student' ? undefined : showDelete} />)
        }
        return rows
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

    function navigationButtons(): JSX.Element | JSX.Element[] {
        if (!user || user.role === 'student') {
            return <></>
        }
        return [
            <Button variant="contained" onClick={newTest}><Translator path="tests.newTest" /></Button>,
            <IconButton onClick={() => setIsTestHelperOpen(true)}><HelpOutlineRounded fontSize="medium" color="primary"/></IconButton>
        ]
    }

    return (
        <div>
            <AppContainer navigationBarChildren={navigationButtons()}>
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
            </AppContainer>
            <TestDeletionConfirmation data={deletionProps} />
            <NewTestCase show={showNewTest} onClose={closeNewTest} />
            <TestHelper show={isTestHelperOpen} close={() => setIsTestHelperOpen(false)} />
            <Loader show={isLoading} />
            <ErrorToast appError={appError} setAppError={setAppError} />
        </div>
    )
}

export default TestsList;
