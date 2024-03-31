import { useState } from "react";
import moment from "moment";

import DatePicker from "react-mobile-datepicker";
import "./DatePicker.css";

const DatePickerContainer = ({
  value,
  onChange,
  format = "DD/MM/YYYY HH:mm",
}) => {
  const [open, setOpen] = useState(false);

  const onSelect = value => {
    onChange(value);
    setOpen(false);
  };

  return (
    <div className="date-picker-box">
      <div className="date-picker-input" onClick={() => setOpen(true)}>
        {value ? moment(value).format(format) : "Hãy chọn"}
      </div>
      <DatePicker
        value={value}
        isOpen={open}
        onSelect={onSelect}
        onCancel={() => setOpen(false)}
        confirmText="Chọn"
        cancelText="Huỷ"
        showCaption={true}
        dateConfig={{
          year: {
            format: "YYYY",
            caption: "Năm",
            step: 1,
          },
          month: {
            format: "M",
            caption: "Tháng",
            step: 1,
          },
          date: {
            format: "D",
            caption: "Ngày",
            step: 1,
          },
          hour: {
            format: "hh",
            caption: "Giờ",
            step: 1,
          },
          minute: {
            format: "mm",
            caption: "Phút",
            step: 1,
          },
        }}
      />
    </div>
  );
};

export default DatePickerContainer;
