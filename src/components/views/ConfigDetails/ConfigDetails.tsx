import { useEffect, useState } from "react";

import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import AppContainer from "../../elements/AppContainer/AppContainer";
import { LanguageConfig } from "../../../models/Config";
import ConfigService from "../../../services/ConfigService";
import Translator from "../../elements/Translator/Translator";
import { handleError } from "../../../services/Helpers";
import { AppError } from "../../../models/AppError";
import ErrorToast from "../../elements/ErrorToast/ErrorToast";

function ConfigDetails() {
    const [configs, setConfigs] = useState<LanguageConfig[]>([])
    const [appError, setAppError] = useState<AppError | null>(null)

    useEffect(() => {
        async function fetch() {
            return ConfigService.getConfigs()
                .then(_config => setConfigs(_config.configs))
        }
        fetch()
            .catch((error) => {
                handleError(error, setAppError)
            })
    }, [])

    function toTableRow(config: LanguageConfig) {
        return (
            <TableRow>
                <TableCell sx={{ color: 'white' }} align="center">{config.language_name}</TableCell>
                <TableCell sx={{ color: 'white' }} align="center">{config.supported_extensions.join(', ')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{config.help}</TableCell>
            </TableRow>
        )
    }

    return (
        <AppContainer>
            <Stack spacing={2}>
                <Typography variant="h1"><Translator path='configs.title' /></Typography>
                <div>
                    <Typography variant="h3"><Translator path='configs.aboutTitle' /></Typography>
                    <Typography variant="h5"><Translator path='configs.aboutInfo' /></Typography>
                </div>
                <div>
                    <Typography variant="h3"><Translator path='configs.languages' /></Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableCell sx={{ color: 'white' }} align="center"><Translator path='configs.name' /></TableCell>
                                <TableCell sx={{ color: 'white' }} align="center"><Translator path='configs.extensions' /></TableCell>
                                <TableCell sx={{ color: 'white' }} align="center"><Translator path='configs.help' /></TableCell>
                            </TableHead>
                            <TableBody>
                                {configs.map(toTableRow)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Stack>
            <ErrorToast appError={appError} setAppError={setAppError} />
        </AppContainer>
    )
}

export default ConfigDetails;
