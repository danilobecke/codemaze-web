import { Card, CardContent, Stack, Typography } from "@mui/material";

import { TestReport } from "../../../models/Report";
import { AllTests } from "../../../models/AllTests";
import TestCase from "../../../models/TestCase";
import PercentagePieChart from "../../elements/PercentagePieChart/PercentagePieChart";
import TestRow from "../../elements/TestRow/TestRow";
import Translator from "../../elements/Translator/Translator";

function TestReportDetails(props: { visible: boolean, report?: TestReport[], tests?: AllTests, setIsLoading: (isLoading: boolean) => void }) {
    function testCards(tests: TestCase[]) {
        if (!props.report) {
            return null
        }
        return tests.map(test => <TestResultCard test={test} position={tests.indexOf(test) + 1} percentage={props.report!.find(element => element.id === test.id)!.correct_percentage} setIsLoading={props.setIsLoading} />)
    }

    return (
        <div hidden={!props.visible}>
            <Stack direction='column' spacing={2}>
                <Typography variant="h4"><Translator path='tests_details.open' /></Typography>
                {testCards(props.tests?.open_tests ?? [])}
                <Typography variant="h4"><Translator path='tests_details.closed' /></Typography>
                {testCards(props.tests?.closed_tests ?? [])}
            </Stack>
        </div>
    )
}

function TestResultCard(props: { test: TestCase, position: number, percentage: number, setIsLoading: (isLoading: boolean) => void }) {
    return (
        <Card>
            <CardContent>
                <PercentagePieChart percentageCorrect={props.percentage} size={{ width: 250, height: 80 }} />
                <TestRow test={props.test} position={props.position} setIsLoading={props.setIsLoading} />
            </CardContent>
        </Card>
    )
}

export default TestReportDetails;
