import { TestReport } from "../../../models/Report";

function TestReportDetails(props: { visible: boolean, report?: TestReport[] }) {
    return (
        <div hidden={!props.visible}>
            WIP Tests
        </div>
    )
}

export default TestReportDetails;
