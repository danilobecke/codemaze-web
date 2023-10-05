import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Container, Link, Stack, Typography } from "@mui/material";

import { Result, TestCaseResult } from "../../../models/Result";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";
import { get, v1Namespace } from "../../../services/ApiService";
import Loader from "../../elements/Loader/Loader";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";
import PercentagePieChart from "../../elements/PercentagePieChart/PercentagePieChart";
import { downloadFile } from "../../../services/Helpers";
import ResultCard from "../../elements/ResultCard/ResultCard";


function ResultDetails() {
    const { taskID } = useParams()

    const openResultsStr = Translator({ path: "result_details.open" })
    const closedResultsStr = Translator({ path: "result_details.closed" })

    const [result, setResult] = useState<Result | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetch() {
            return get(v1Namespace('tasks/' + taskID + '/results/latest'), Result, setIsLoading)
                .then(_result => setResult(_result))
        }
        fetch()
            .catch((error) => {
                if (error instanceof Error) {
                    setErrorMessage(error.message)
                } else {
                    alert(error) // fallback
                }
            })
    }, [result?.attempt_number])

    function resultSection(title: string, percentage: number, results: TestCaseResult[]) {
        return (
            <div>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h2">{title}</Typography>
                    <PercentagePieChart percentageCorrect={percentage} />
                </Stack>
                <Stack direction='column' spacing={1} alignItems='start'>
                    {results.map(toCard)}
                </Stack>
            </div>
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

    return (
        <div>
            <NavigationBar />
            {!result ? null :
                <Container>
                    <Stack direction='column' spacing={4}>
                        <div>
                            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                <Typography variant="h1"><Translator path="result_details.title" /></Typography>
                                <PercentagePieChart percentageCorrect={result.result_percentage} />
                            </Stack>
                            <Typography variant="h5"><Translator path="result_details.numberAttempts" arguments={{ number: result.attempt_number }} /></Typography>
                            <Typography variant="h5" sx={{ ['& :hover']: { cursor: 'pointer' } }}><Link onClick={downloadCode}><Translator path='result_details.getCode' /></Link></Typography>
                        </div>
                        {resultSection(openResultsStr, result.open_result_percentage, result.open_results)}
                        {!result.closed_result_percentage ? null :
                            resultSection(closedResultsStr, result.closed_result_percentage, result.closed_results)
                        }
                    </Stack>
                </Container>
            }
            <Loader show={isLoading} />
            <ErrorToast message={errorMessage} setError={setErrorMessage} />
        </div>
    )
}

export default ResultDetails;
