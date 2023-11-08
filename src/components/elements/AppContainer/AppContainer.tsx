import { Container } from "@mui/material";

function AppContainer(props: {children?: JSX.Element | JSX.Element[] | null}) {
    return (
        <Container sx={{paddingBottom: '32px'}}>
            {props.children}
        </Container>
    )
}

export default AppContainer;
