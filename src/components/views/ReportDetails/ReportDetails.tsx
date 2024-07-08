import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { Assignment, Group, Public } from "@mui/icons-material";

import { get, v1Namespace } from "../../../services/ApiService";
import { Report } from "../../../models/Report";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import { AllTests } from "../../../models/AllTests";
import Translator from "../../elements/Translator/Translator";
import OverallReportDetails from "./OverallReportDetails";
import StudentReportDetails from "./StudentReportDetails";
import TestReportDetails from "./TestReportDetails";
import AppContainer from "../../elements/AppContainer/AppContainer";
import { AppError } from "../../../models/AppError";
import { handleError } from "../../../services/Helpers";

enum ReportTab {
    Overall, Students, Tests
}

function ReportDetails() {
    const { taskID } = useParams()
    const tabColor = 'white'
    const overallStr = Translator({ path: 'report_details.overall' })
    const studentsStr = Translator({ path: 'report_details.students' })
    const testStr = Translator({ path: 'report_details.tests' })

    const [report, setReport] = useState<Report | null>(null)
    const [tests, setTests] = useState<AllTests | undefined>()
    const [selectedTab, setSelectedTab] = useState(ReportTab.Overall)

    const [isLoadingReport, setIsLoadingReport] = useState(false)
    const [isLoadingTests, setIsLoadingTests] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    useEffect(() => {
        async function fetch() {
            return Promise.all([
                get(v1Namespace('tasks/' + taskID + '/results'), Report, setIsLoadingReport),
                get(v1Namespace('tasks/' + taskID + '/tests'), AllTests, setIsLoadingTests),
            ])
                .then(result => {
                    setReport(result[0])
                    setTests(result[1])
                })
        }
        fetch()
            .catch((error) => {
                handleError(error, setAppError)
            })
    }, [])

    function handleChange(event: React.SyntheticEvent, newValue: ReportTab) {
        setSelectedTab(newValue)
    }

    return (
        <div>
            <AppContainer>
                <Stack direction='column' spacing={4}>
                    <Typography variant="h1"><Translator path="report_details.title" /></Typography>
                    {(!report || !tests) ? null :
                        <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth" sx={{ paddingBottom: 0.5, borderBottom: 0.5, borderBottomColor: 'white', borderBottomStyle: 'solid' }}>
                            <Tab label={overallStr} icon={<Public />} value={ReportTab.Overall} sx={{ color: tabColor }} />
                            <Tab label={studentsStr} icon={<Group />} value={ReportTab.Students} sx={{ color: tabColor }} />
                            <Tab label={testStr} icon={<Assignment />} value={ReportTab.Tests} sx={{ color: tabColor }} />
                        </Tabs>
                    }
                    <OverallReportDetails visible={selectedTab === ReportTab.Overall} report={report?.overall} tests={tests} setIsLoading={setIsLoadingTests} />
                    <StudentReportDetails visible={selectedTab === ReportTab.Students} report={report?.students} tests={tests} setIsLoading={setIsLoadingTests}/>
                    <TestReportDetails visible={selectedTab === ReportTab.Tests} report={report?.tests} tests={tests} setIsLoading={setIsLoadingTests} />
                </Stack>
            </AppContainer>
            <Loader show={isLoadingReport || isLoadingTests} />
            <ErrorToast appError={appError} setAppError={setAppError} />
        </div>
    )
}

export default ReportDetails;
