import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Stack, Typography } from "@mui/material";

import { Result, TestCaseResult } from "../../../models/Result";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";
import { get, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import PercentagePieChart from "../../elements/PercentagePieChart/PercentagePieChart";
import { downloadFile, handleError } from "../../../services/Helpers";
import ResultCard from "../../elements/ResultCard/ResultCard";
import LinkItem from "../../elements/LinkItem/LinkItem";
import AppContainer from "../../elements/AppContainer/AppContainer";
import { AppError } from "../../../models/AppError";

function ResultDetails() {
    const navigate = useNavigate()
    const { taskID } = useParams()

    const openResultsStr = Translator({ path: "result_details.open" })
    const closedResultsStr = Translator({ path: "result_details.closed" })
    const downloadCodeStr = Translator({ path: 'result_details.getCode' })

    const [result, setResult] = useState<Result | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [appError, setAppError] = useState<AppError | null>(null)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID + '/results/latest'), Result, setIsLoading)
                .then(_result => setResult(_result))
        }
        fetch()
            .catch((error) => {
                handleError(error, setAppError)
            })
    }, [result?.attempt_number])

    function resultSection(title: string, percentage: number, results: TestCaseResult[]) {
        return (
            <Stack direction='column' spacing={1} alignItems='start'>
                <Stack direction='row' alignItems='center'>
                    <Typography variant="h2">{title}</Typography>
                    <PercentagePieChart percentageCorrect={percentage} />
                </Stack>
                {results.map(toCard)}
            </Stack>
        )
    }

    function toCard(result: TestCaseResult, index: number) {
        return <ResultCard result={result} index={index} />
    }

    function downloadCode() {
        if (!result) {
            return
        }
        downloadFile(result.source_url, 'code', setIsLoading)
    }

    function dismiss() {
        navigate(-1) // go back
    }

    return (
        <div>
            <NavigationBar />
            {!result ? null :
                <AppContainer>
                    <Stack direction='column' spacing={4}>
                        <div>
                            <Stack direction='row' alignItems='center'>
                                <Typography variant="h1"><Translator path="result_details.title" /></Typography>
                                <PercentagePieChart percentageCorrect={result.result_percentage} size={{ width: 375, height: 150 }} />
                            </Stack>
                            <Typography variant="h5"><Translator path="result_details.numberAttempts" arguments={{ number: result.attempt_number }} /></Typography>
                            <LinkItem onClick={downloadCode} title={downloadCodeStr} />
                        </div>
                        {resultSection(openResultsStr, result.open_result_percentage, result.open_results)}
                        {!result.closed_result_percentage ? null :
                            resultSection(closedResultsStr, result.closed_result_percentage, result.closed_results)
                        }
                    </Stack>
                </AppContainer>
            }
            <Loader show={isLoading} />
            <ErrorToast appError={appError} setAppError={setAppError} onClose={dismiss} />
        </div>
    )
}

export default ResultDetails;
