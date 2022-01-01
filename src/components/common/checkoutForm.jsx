import { useState } from "react";
import Box from "@mui/material/Box";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { makeStyles } from "@material-ui/core";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: "500px",
    alignSelf: "center",
    boxShadow:
      "0px 0px 0px 0.5px rgba(50, 50, 93, 0.1), 0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07)",
    borderRadius: "7px",
    padding: theme.spacing(2),
  },
}));

export const CheckoutForm = () => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/settings/history",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  return (
    <Box
      className={classes.form}
      component="form"
      id="payment-form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <PaymentElement id="payment-element" />
      <Box
        component={Button}
        sx={{ mt: 3 }}
        type="submit"
        variant="contained"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            component="span"
          >
            <Loader type="Circles" color="#000" height={20} width={20} />
            <Loader type="Circles" color="#000" height={20} width={20} />
            <Loader type="Circles" color="#000" height={20} width={20} />
          </Box>
        ) : (
          "Pay now"
        )}
      </Box>
      {message && (
        <Alert sx={{ mt: 1 }} severity="info" onClose={() => {}}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default CheckoutForm;
