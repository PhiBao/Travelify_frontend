import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import StyledRating from "../common/rating";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import _ from "lodash";

const schema = Yup.object().shape({
  hearts: Yup.number().required(),
  body: Yup.string().max(2000).required(),
});

const Rate = ({ open, handleClose, review, onSubmit }) => {
  const { hearts = 0, body = "" } = review;

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      body: body,
      hearts: hearts,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [rate, setRate] = useState(0);

  useEffect(() => {
    setValue("hearts", hearts);
    setRate(hearts);
    setValue("body", body);
  }, [review]);

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
      <Box
        id="searchForm"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        noValidate
      >
        <DialogTitle>Review</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            <StyledRating
              {...register("hearts")}
              name="customized-color"
              getLabelText={(value) =>
                `${value} Heart${value !== 1 ? "s" : ""}`
              }
              value={rate}
              onChange={(e, newValue) => {
                e.preventDefault();
                setValue("hearts", newValue);
                setRate(newValue);
              }}
              precision={0.5}
              max={10}
              readOnly={!_.isEmpty(review)}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
            />
          </Typography>
          <Box sx={{ width: "100%", mr: 3, mt: 2 }}>
            <TextareaAutosize
              {...register("body")}
              aria-label="body"
              minRows={4}
              placeholder="Type your review here, maximum 2000 characters."
              style={{ width: "100%" }}
              readOnly={!_.isEmpty(review)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={!_.isEmpty(review)}>
            Rate
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default Rate;