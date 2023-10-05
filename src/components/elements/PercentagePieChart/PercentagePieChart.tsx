import { PieChart, pieArcLabelClasses } from "@mui/x-charts";

import Translator from "../../elements/Translator/Translator";

function PercentagePieChart(props: { percentageCorrect: number }) {
    const data = [
        { label: Translator({ path: 'pie_chart.success' }), value: props.percentageCorrect, color: 'green' },
        { label: Translator({ path: 'pie_chart.error' }), value: 100 - props.percentageCorrect, color: 'red' }
    ]
    const size = {
        width: 250,
        height: 100,
    };

    return (
        <PieChart
            series={[
                {
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 90,
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
                },
            }}
            {...size}
        />
    )
}

export default PercentagePieChart;
