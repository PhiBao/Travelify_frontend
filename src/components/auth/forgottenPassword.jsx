import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { forgottenPassword } from "../../store/session";
import { TextInputField } from "../common/form";
import Loading from "../layout/loading";
import auth from "../../services/authService";
import useDocumentTitle from "../../utils/useDocumentTitle";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
});

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px !important",
    padding: theme.spacing(3),
    maxWidth: 800,
  },
}));

export const ForgottenPassword = (props) => {
  useDocumentTitle("Forgotten password");
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const classes = useStyles();

  const { currentUser, loading, forgottenPassword } = props;

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await forgottenPassword(data);
  };

  if (auth.getCurrentUser()) return <Navigate to="/" replace />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}

      <Card className={classes.card}>
        {currentUser.resetEmailSent === true ? (
          <Box>
            <CardHeader
              avatar={<MarkEmailUnreadIcon style={{ fontSize: 200 }} />}
              title="Your Mail Sent Successfully!"
              subheader={new Date().toLocaleString()}
            />
            <CardContent>
              <Typography variant="h5" color="text.secondary">
                Please check your email. The email will be active within two
                hours from the time we send it
              </Typography>
              <Typography sx={{ mt: 3 }} variant="body2" color="text.secondary">
                Have you not received the email yet?{" "}
                <Button
                  variant="text"
                  onClick={() => {
                    props.forgottenPassword({
                      email: currentUser.email,
                    });
                  }}
                  sx={{ mb: "2px" }}
                >
                  Resend the email
                </Button>
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="text"
                onClick={() => {
                  window.location.href = "/login";
                }}
                sx={{ ml: 1 }}
              >
                Login
              </Button>
            </CardActions>
          </Box>
        ) : (
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography variant="h3">Forgot password</Typography>
            <TextInputField
              control={control}
              name="email"
              label="Enter your email address"
            />
            <Box
              component={Button}
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              style={{
                backgroundColor: "#26c6da",
                color: "#212121",
                fontWeight: 700,
              }}
              fullWidth
            >
              Reset
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 3,
              }}
            >
              <i>Have you not had an account yet?</i>
              <Link
                style={{ paddingLeft: "5px", fontWeight: "500" }}
                to="/register"
              >
                <u>Register here</u>
              </Link>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  forgottenPassword: (data) => dispatch(forgottenPassword(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPassword);
