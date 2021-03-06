import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateTimePicker, DatePicker } from "@mui/lab";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CreatableSelect from "react-select/creatable";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import { Editor } from "@tinymce/tinymce-react";

export const TextInputField = ({
  control,
  name,
  label,
  handleChange,
  type = "text",
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          helperText={error?.message}
          id={name}
          error={!!error}
          label={label}
          size="medium"
          onChange={(e) => {
            field.onChange(e);
            if (handleChange) handleChange(e);
          }}
          margin="normal"
          variant="standard"
          type={type}
          fullWidth
          {...rest}
        />
      )}
    />
  );
};

export const FormCheckbox = ({ control, name, label, ...rest }) => {
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => (
            <Checkbox onChange={(e) => onChange(e.target.checked)} {...rest} />
          )}
        />
      }
      label={label}
    />
  );
};

export const Select = ({
  name,
  handleChange,
  label,
  control,
  error,
  ...rest
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Chip label={label} sx={{ borderRadius: 0, fontWeight: 500 }} />
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <ReactSelect
            value={value}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            onChange={(e) => {
              onChange(e);
              if (handleChange) handleChange(e);
            }}
            {...rest}
          />
        )}
      />
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const Creatable = ({
  name,
  handleChange,
  label,
  control,
  error,
  ...rest
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Chip label={label} sx={{ borderRadius: 0, fontWeight: 500 }} />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CreatableSelect
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            {...field}
            {...rest}
            isMulti
            isClearable
          />
        )}
      />
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const DatePickerField = ({
  name,
  label,
  control,
  handleChange,
  error,
  ...rest
}) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onChange={(e) => {
                onChange(e);
                if (handleChange) handleChange(e);
              }}
              label={label}
              {...rest}
              renderInput={(params) => (
                <TextField margin="normal" fullWidth {...params} />
              )}
            />
          )}
        />
      </LocalizationProvider>
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const DateTimePickerField = ({
  name,
  label,
  control,
  error,
  ...rest
}) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value}
              onChange={(e) => onChange(e)}
              label={label}
              {...rest}
              renderInput={(params) => (
                <TextField margin="normal" fullWidth {...params} />
              )}
            />
          )}
        />
      </LocalizationProvider>
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
};

export const RichText = ({ control, name, label }) => {
  return (
    <Box component="div" mt={2}>
      <Chip label={label} sx={{ borderRadius: 0, fontWeight: 500 }} />
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_KEY}
            {...field}
            onEditorChange={onChange}
            init={{
              height: 500,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              images_upload_url: "postAcceptor.php",
              automatic_uploads: false,
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        )}
      />
    </Box>
  );
};
