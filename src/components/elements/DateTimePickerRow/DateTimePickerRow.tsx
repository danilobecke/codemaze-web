import { Dayjs } from "dayjs";
import { ListItem, ListItemText } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";


function DateTimePickerRow(props: { title: string, date: Dayjs | null, setDate: (date: Dayjs | null) => void, minDate?: Dayjs, themeColor?: string }) {
    const color = props.themeColor ?? 'white'
    const alphaColor = props.themeColor ?? 'rgba(255, 255, 255, 0.8)'

    return (
        <ListItem>
            <ListItemText primary={props.title} primaryTypographyProps={{ variant: 'h5' }} />
            <DateTimePicker
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                minDateTime={props.minDate}
                value={props.date}
                onChange={value => props.setDate(value)}
                slotProps={{
                    textField: {
                        InputProps: {
                            sx: { color: color, minWidth: '266px' }
                        },
                        sx: { "fieldset.MuiOutlinedInput-notchedOutline": { borderColor: color }, "&:hover fieldset.MuiOutlinedInput-notchedOutline": { borderColor: 'ActiveBorder' } },
                    },
                    openPickerButton: {
                        sx: { color: alphaColor }
                    }
                }}
            />
        </ListItem>
    )
}

export default DateTimePickerRow;
