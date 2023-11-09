import { useNavigate } from "react-router-dom";

import { Container, Stack, Typography } from "@mui/material";

import LinkItem from "../LinkItem/LinkItem";
import NavigationBar from "../NavigationBar/NavigationBar";
import Translator from "../Translator/Translator";

function AppContainer(props: { navigationBarChildren?: JSX.Element | JSX.Element[], children?: JSX.Element | JSX.Element[] | null, flex?: boolean }) {
    const navigate = useNavigate()
    const infoStr = Translator({ path: 'footer.info' })

    function showConfigs() {
        navigate('/configs')
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavigationBar>
                {props.navigationBarChildren}
            </NavigationBar>
            <Container sx={{ paddingBottom: '16px', flexGrow: 1, display: props.flex ? 'flex' : 'box' }} >
                {props.children}
            </Container>
            <footer>
                <hr style={{ borderTop: 0, margin: 0 }} />
                <Stack direction='row' alignItems='center' justifyContent={'center'} spacing={2} style={{ padding: '6px' }}>
                    <Stack direction='row' spacing={0.5}>
                        <Typography variant="caption">© 2023</Typography>
                        <LinkItem title="Codemaze" variant="caption" href="http://github.com/danilobecke/codemaze" target="_blank" />
                        <Typography variant="caption">and</Typography>
                        <LinkItem title="Codemaze-Web" variant="caption" href="http://github.com/danilobecke/codemaze-web" target="_blank" />
                        <Typography variant="caption">by Danilo Cleber Becke</Typography>
                    </Stack>
                    <Typography variant="caption">|</Typography>
                    <LinkItem title={infoStr} variant="caption" onClick={showConfigs} />
                </Stack>
            </footer>
        </div>
    )
}

export default AppContainer;
