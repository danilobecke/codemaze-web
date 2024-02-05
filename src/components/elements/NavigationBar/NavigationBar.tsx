import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Session from "../../../services/Session";
import Profile from "../../views/Profile/Profile";

import './NavigationBar.css';

function NavigationBar(props: { children?: JSX.Element | JSX.Element[] }) {
    const navigate = useNavigate()
    const user = Session.getCurrentUser()

    const [isProfileOpen, setIsProfileOpen] = useState(false)

    function stringAvatar(name: string) {
        let components = name.split(' ')
        let lastName = components.slice(-1) ?? components
        return {
            children: `${components[0][0]}${lastName[0][0]}`
        }
    }

    function showProfile() {
        setIsProfileOpen(true)
    }

    function canGoBack(): boolean {
        return window.history.state.idx !== 0
    }

    function goBack() {
        navigate(-1)
    }

    return (
        <nav className='NavigationBar'>
            <Stack direction='row' justifyContent='space-between'>
                <Stack direction={'row'} justifyContent={'flex-start'} alignItems='center' spacing={1}>
                    {canGoBack() ? <IconButton onClick={goBack}><ArrowBackIosNewIcon color="primary" /></IconButton> : <></>}
                    {user ? <IconButton sx={{ padding: 0 }} onClick={showProfile}><Avatar {...stringAvatar(user.name)} /></IconButton> : <div />}
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-end'} spacing={1}>
                    {props.children || <></>}
                </Stack>
            </Stack>
            <Profile show={isProfileOpen} close={() => setIsProfileOpen(false)} />
        </nav>
    )
}

export default NavigationBar;
