import { StudentReport } from "../../../models/Report";

function StudentReportDetails(props: { visible: boolean, report?: StudentReport[] }) {
    return (
        <div hidden={!props.visible}>
            WIP Students
        </div>
    )
}

export default StudentReportDetails;
