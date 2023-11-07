import { useState } from "react";

import { Card, CardContent, FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";

import { StudentReport } from "../../../models/Report";
import Translator from "../../elements/Translator/Translator";
import LinkItem from "../../elements/LinkItem/LinkItem";
import { downloadFile } from "../../../services/Helpers";
import PercentagePieChart from "../../elements/PercentagePieChart/PercentagePieChart";
import { AllTests } from "../../../models/AllTests";
import TestCase from "../../../models/TestCase";
import TestRow from "../../elements/TestRow/TestRow";

function StudentReportDetails(props: { visible: boolean, report?: StudentReport[], tests?: AllTests, setIsLoading: (isLoading: boolean) => void }) {
    const [studentReport, setStudentReport] = useState<StudentReport | null>(null)

    const downloadCodeStr = Translator({ path: 'student_details.downloadCode' })
    const openTestsStr = Translator({ path: 'student_details.openResults' })
    const closedTestsStr = Translator({ path: 'student_details.closedResults' })

    function setStudentReportFromID(id: number) {
        const report = props.report?.find(value => value.id === id)
        if (!report) {
            return
        }
        setStudentReport(report)
    }

    function toStudent(report: StudentReport): Student {
        return {
            id: report.id,
            name: report.name
        }
    }

    function testsFrom(ids: number[], open: boolean): PositionTest[] {
        const tests = open ? props.tests?.open_tests : props.tests?.closed_tests
        if (!tests) {
            return []
        }
        const result = tests.filter(test => ids.includes(test.id))
        return result.map(element => { return { position: tests.indexOf(element) + 1, test: element } })
    }

    return (
        <div hidden={!props.visible}>
            {!props.report ? null :
                <Stack direction='column' spacing={2}>
                    <Card>
                        <CardContent>
                            <StudentsSelect studentID={studentReport?.id} setStudentID={setStudentReportFromID} students={props.report.map(toStudent)} />
                        </CardContent>
                    </Card>
                    {!studentReport ? null :
                        <Card>
                            <CardContent>
                                <Stack direction='column' spacing={1}>
                                    <Stack direction='row' alignContent='space-between' alignItems='center'>
                                        <Typography variant="h4">{studentReport.name}</Typography>
                                        <PercentagePieChart percentageCorrect={studentReport.result_percentage} size={{ width: 250, height: 80 }} />
                                    </Stack>
                                    <Typography variant="h5"><b><Translator path="student_details.attempts" />:</b> {studentReport.number_attempts}</Typography>
                                    {!studentReport.source_code_url ? null :
                                        <LinkItem title={downloadCodeStr} onClick={() => downloadFile(studentReport.source_code_url!, 'source_code', props.setIsLoading)} />
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    }
                    {!studentReport || studentReport.number_attempts === 0 ? null :
                        <TestsCard title={openTestsStr} result={studentReport.open_result_percentage} tests={testsFrom(studentReport.wrong_tests_id, true)} setIsLoading={props.setIsLoading} />
                    }
                    {!studentReport || studentReport.closed_result_percentage == null || studentReport.number_attempts === 0 ? null :
                        <TestsCard title={closedTestsStr} result={studentReport.closed_result_percentage} tests={testsFrom(studentReport.wrong_tests_id, false)} setIsLoading={props.setIsLoading} />
                    }
                </Stack>
            }
        </div>
    )
}

interface Student {
    id: number
    name: string
}

function StudentsSelect(props: { studentID: number | undefined, students: Student[], setStudentID: (id: number) => void }) {
    function mapToMenuItem(student: Student) {
        return <MenuItem value={student.id}>{student.name}</MenuItem>
    }

    function handleChange(event: SelectChangeEvent) {
        const selected = event.target.value
        props.setStudentID(+selected)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: '98%' }} size="small">
            <Select
                value={props.studentID?.toString()}
                onChange={handleChange}
            >
                {props.students.map(mapToMenuItem)}
            </Select>
        </FormControl>
    )
}

interface PositionTest {
    position: number
    test: TestCase
}

function TestsCard(props: { title: string, result: number, tests: PositionTest[], setIsLoading: (isLoading: boolean) => void }) {
    function toTestRow(positionTest: PositionTest) {
        return <TestRow test={positionTest.test} position={positionTest.position} setIsLoading={props.setIsLoading} />
    }

    return (
        <Card>
            <CardContent>
                <Stack direction='column' spacing={2}>
                    <Stack direction='row' alignContent='space-between' alignItems='center'>
                        <Typography variant="h4">{props.title}</Typography>
                        <PercentagePieChart percentageCorrect={props.result} size={{ width: 250, height: 80 }} />
                    </Stack>
                    {props.tests.length === 0 ? null :
                        <div>
                            <Typography variant="h5"><Translator path="student_details.wrongTests" /></Typography>
                            {props.tests.map(toTestRow)}
                        </div>
                    }
                </Stack>
            </CardContent>
        </Card>
    )
}

export default StudentReportDetails;
