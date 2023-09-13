import { useState } from "react";

import { Avatar, IconButton, Stack } from "@mui/material";

import Session from "../../../services/Session";
import Profile from "../../views/Profile/Profile";

import './NavigationBar.css';

function NavigationBar(props: { children?: JSX.Element | JSX.Element[]}) {
    const user = Session.getCurrentUser()

    const [isProfileOpen, setIsProfileOpen] = useState(false)

    function stringAvatar(name: string) {
        return {
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
        }
    }

    function showProfile() {
        setIsProfileOpen(true)
    }

    return (
        <nav className='NavigationBar'>
            <Stack direction='row' justifyContent='space-between'>
                { user ? <IconButton sx={{padding: 0}} onClick={showProfile}><Avatar {...stringAvatar(user.name)} /></IconButton> : <div /> }
                <Stack direction={'row'} justifyContent={'flex-end'} spacing={1}>
                    {props.children || <></>}
                </Stack>
            </Stack>
            <Profile show={isProfileOpen} close={() => setIsProfileOpen(false)} />
        </nav>
    )
}

export default NavigationBar;
