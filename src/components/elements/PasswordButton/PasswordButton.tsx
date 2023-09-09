import { useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputLabel, FormControl, InputAdornment, IconButton, Input } from "@mui/material";

function PasswordButton(props: {title: string, name: string, error: boolean}) {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
        <FormControl error={props.error} fullWidth required sx={{ m: 1, margin: 0, marginTop: 1}} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">{props.title}</InputLabel>
            <Input
                name={props.name}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}

export default PasswordButton;
