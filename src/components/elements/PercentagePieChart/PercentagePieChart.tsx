import { PieChart, pieArcLabelClasses } from "@mui/x-charts";

import Translator from "../../elements/Translator/Translator";

function PercentagePieChart(props: { percentageCorrect: number, size?: { width: number, height: number }, successLabel?: string, errorLabel?: string }) {
    const data = [
        { label: props.successLabel ?? Translator({ path: 'pie_chart.success' }), value: props.percentageCorrect, color: 'green' },
        { label: props.errorLabel ?? Translator({ path: 'pie_chart.error' }), value: 100 - props.percentageCorrect, color: 'red' }
    ]
    const size = {
        width: 250,
        height: 100,
    };

    return (
        <div>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${Math.round(item.value)}%`,
                        arcLabelMinAngle: 180,

                        data,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold'
                    },
                    ['& .MuiChartsLegend-root']: { // Hide legend box
                        display: 'none'
                    }
                }}
                {...props.size ?? size}
            />
        </div>
    )
}

export default PercentagePieChart;
