import dayjs, { Dayjs } from "dayjs";
import { ListItem, ListItemText } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";


function DateTimePickerRow(props: { title: string, date: Dayjs | null, setDate: (date: Dayjs | null) => void }) {
    return (
        <ListItem>
            <ListItemText primary={props.title} primaryTypographyProps={{ variant: 'h5' }} />
            <DateTimePicker
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                minDateTime={dayjs()}
                value={props.date}
                onChange={value => props.setDate(value)}
                slotProps={{
                    textField: {
                        InputProps: {
                            sx: { color: "white" }
                        },
                        sx: { "fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'white' }, "&:hover fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'ActiveBorder' } },
                    },
                    openPickerButton: {
                        sx: { color: "rgba(255, 255, 255, 0.8)" }
                    }
                }}
            />
        </ListItem>
    )
}

export default DateTimePickerRow;
