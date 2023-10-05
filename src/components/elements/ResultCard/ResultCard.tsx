import { CSSProperties } from "react";

import { Card, CardContent, Typography } from "@mui/material";

import Translator from "../../elements/Translator/Translator";
import { TestCaseResult } from "../../../models/Result";

export default function ResultCard(props: { result: TestCaseResult, index: number }) {
    return (
        <Card sx={{ minWidth: '40%' }}>
            <CardContent>
                <Typography variant="h5"><Translator path="result_details.cardTitle" arguments={{ index: props.index + 1 }} /></Typography>
                {props.result.success ?
                    <Typography variant="h5" color='green'><Translator path="result_details.cardSuccess" /></Typography>
                    :
                    <Typography variant="h5" color='error'><Translator path="result_details.cardError" /></Typography>
                }
                {!props.result.diff ? null :
                    <DiffBlock diff={props.result.diff} />
                }
            </CardContent>
        </Card>
    )
}

function DiffBlock(props: { diff: string }) {
    enum LineKind {
        ExpectedInfo, ResultInfo, DiffCount, Expected, Result
    }

    const expextedInfoRegex = new RegExp('^--- .+')
    const resultInfoRegex = new RegExp('^\\+\\+\\+ .+')

    function getLineKind(line: string): LineKind {
        if (expextedInfoRegex.test(line)) {
            return LineKind.ExpectedInfo
        } else if (resultInfoRegex.test(line)) {
            return LineKind.ResultInfo
        } else if (line.startsWith('-')) {
            return LineKind.Expected
        } else if (line.startsWith('+')) {
            return LineKind.Result
        } else {
            return LineKind.DiffCount
        }
    }

    function styleFor(lineKind: LineKind): CSSProperties {
        const base: CSSProperties = { paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6 }
        switch (lineKind) {
            case LineKind.ExpectedInfo:
                return { ...base, color: 'green', backgroundColor: 'rgba(0, 0, 0, 0.1)' }
            case LineKind.ResultInfo:
                return { ...base, color: 'red', backgroundColor: 'rgba(0, 0, 0, 0.1)' }
            case LineKind.DiffCount:
                return { ...base, backgroundColor: 'rgba(0, 0, 0, 0.1)' }
            case LineKind.Expected:
                return { ...base, backgroundColor: 'rgba(0, 255, 0, 0.3)' }
            case LineKind.Result:
                return { ...base, backgroundColor: 'rgba(255, 0, 0, 0.5)' }
        }
    }

    function format(line: string, lineKind: LineKind) {
        switch (lineKind) {
            case LineKind.ExpectedInfo:
                return line
            case LineKind.ResultInfo:
                return line
            case LineKind.DiffCount:
                return line
            case LineKind.Expected:
                return line.replace('-', '- ')
            case LineKind.Result:
                return line.replace('+', '+ ')
        }
    }

    function getLine(text: string) {
        const lineKind = getLineKind(text)
        return (
            <span style={styleFor(lineKind)}>{format(text, lineKind)}</span>
        )
    }

    return (
        <div style={{ display: 'flex', justifyItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: 1, borderColor: 'black' }}>
                {props.diff.split('\n').map(getLine)}
            </div>
        </div>
    )
}
