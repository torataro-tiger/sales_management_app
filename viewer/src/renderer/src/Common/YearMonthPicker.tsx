import React from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

type YearMonthPickerProps = {
    value: Dayjs;
    label: string;
    onChange: (value: Dayjs) => void;
}

const YearMonthPicker: React.FC<YearMonthPickerProps> = ({ value, label, onChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                views={['year', 'month']}
                value={value}
                slotProps={{ textField: { fullWidth: true } }}
                label={label}
                onChange={(e) => {
                    const newValue = e ? e.startOf('month') : null;
                    if (newValue) {
                        onChange(newValue);
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default YearMonthPicker;
