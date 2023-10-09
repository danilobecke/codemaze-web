import { Card, CardContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import Translator from "../../elements/Translator/Translator"
import TestRow from "../../elements/TestRow/TestRow"
import LinkItem from "../../elements/LinkItem/LinkItem"
import { OverallReport, ResultPercentage } from "../../../models/Report"
import { AllTests } from "../../../models/AllTests"
import PercentagePieChart from "../../elements/PercentagePieChart/PercentagePieChart"

function OverallReportDetails(props: { visible: boolean, report?: OverallReport, tests?: AllTests, setIsLoading: (isLoading: boolean) => void }) {
    const submissionsStr = Translator({ path: 'overall_details.submissions' })
    const noSubmissionsStr = Translator({ path: 'overall_details.noSubmissions' })
    const openReportStr = Translator({ path: 'overall_details.plagiarismReport' })

    function toLinkRow(reportURL: string, index: number) {
        return <LinkItem title={openReportStr + ' #' + (index + 1)} href={reportURL} target="_blank" />
    }

    function testsSection(closed: boolean) {
        if (!props.report || !props.tests) {
            return null
        }
        const allTests = closed ? props.tests.closed_tests : props.tests.open_tests
        const tests = allTests.filter(test => props.report!.tests_more_failures.includes(test.id))
        if (tests.length === 0) {
            return null
        }
        return (
            <Stack direction='column'>
                <Typography variant="h5"><Translator path={closed ? "overall_details.closedTests" : "overall_details.openTests"} /></Typography>
                {tests.map(test => <TestRow test={test} position={allTests.indexOf(test) + 1} setIsLoading={props.setIsLoading} />)}
            </Stack>
        )
    }

    function toPercentageRow(data: ResultPercentage) {
        return (
            <TableRow>
                <TableCell align="center">{data.students_percentage}%</TableCell>
                <TableCell align="center">{data.result_percentage}%</TableCell>
            </TableRow>
        )
    }

    return (
        <div hidden={!props.visible}>
            <Stack direction='column' spacing={2}>
                <Card>
                    <CardContent>
                        <Stack direction='column' spacing={1}>
                            {!props.report ? null :
                                <Stack direction='row' alignItems='center'>
                                    <Typography variant="h5"><Translator path="overall_details.submissionPercentage" />:</Typography>
                                    <PercentagePieChart percentageCorrect={props.report.submissions_percentage} size={{ width: 250, height: 80 }} successLabel={submissionsStr} errorLabel={noSubmissionsStr} />
                                </Stack>
                            }
                            {props.report?.mean_attempts_success_all ? <Typography variant="h5"><Translator path="overall_details.meanSuccess" />: {props.report?.mean_attempts_success_all}</Typography> : null}
                            {props.report?.plagiarism_report_urls.length === 0 || undefined ? null : props.report?.plagiarism_report_urls.map(toLinkRow)}
                        </Stack>
                    </CardContent>
                </Card>
                {!props.tests || !props.report || props.report.tests_more_failures.length === 0 ? null :
                    <Card>
                        <CardContent>
                            <Stack direction='column' spacing={2}>
                                <Typography variant="h4"><Translator path="overall_details.testsCardTitle" /></Typography>
                                {testsSection(false)}
                                {testsSection(true)}
                            </Stack>
                        </CardContent>
                    </Card>
                }
                {!props.report ? null :
                    <Card>
                        <CardContent>
                            <Stack direction='column' spacing={1}>
                                <Typography variant="h4"><Translator path="overall_details.results" /></Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center"><Translator path="overall_details.students" /></TableCell>
                                                <TableCell align="center"><Translator path="overall_details.result" /></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {props.report.results_percentages.map(toPercentageRow)}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </CardContent>
                    </Card>
                }
            </Stack>
        </div>
    )
}

export default OverallReportDetails;
