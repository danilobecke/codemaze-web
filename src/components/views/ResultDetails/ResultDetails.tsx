import { Container, Stack, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";

import { Result } from "../../../models/Result";
import NavigationBar from "../../elements/NavigationBar/NavigationBar";
import Translator from "../../elements/Translator/Translator";

function ResultDetails() {
    const result = 1



    return (
        <div>
            <NavigationBar />
            {!result ? null :
                <Container>
                    <Stack direction='column' spacing={4}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant="h1"><Translator path="result_details.title" /></Typography>
                            <ResultPieChart />
                        </Stack>
                    </Stack>
                </Container>
            }
        </div>
    )
}

function ResultPieChart(props: { percentageCorrect: number }) {
    const data = [
        { label: 'Success', value: 75, color: 'green' },
        { label: 'Error', value: 25, color: 'red' }
    ]
    const size = {
        width: 300,
        height: 150,
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
            }}
            {...size}
        />
    )
}

export default ResultDetails;
