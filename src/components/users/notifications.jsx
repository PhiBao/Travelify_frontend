import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadNotifications,
  readNotification,
  readAllNotifications,
} from "../../store/session";
import { fromNow } from "../../helpers/timeHelper";

const Notifications = (props) => {
  const {
    id,
    notifications: { list = [], total, unread },
    loadNotifications,
    readNotification,
    readAllNotifications,
  } = props;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const handleRead = async (status, id, tourId) => {
    if (status === "unread") await readNotification(id);
    navigate(`/tours/${tourId}`);
  };

  const handlePageChange = async (e, page) => {
    e.preventDefault();
    await loadNotifications(id, { page });
    setPage(page);
  };

  const handleReadAll = async (e) => {
    e.preventDefault();
    await readAllNotifications(id);
  };

  return (
    <Box bgcolor="background.paper" p={2} borderRadius="15px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{`${unread} unread notification${
          unread > 1 ? "s" : ""
        }`}</Typography>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          startIcon={<DoneAllIcon />}
          onClick={handleReadAll}
        >
          Read all
        </Button>
      </Box>
      {list.map((notification) => (
        <Box
          sx={{
            display: "flex",
            alginItems: "center",
            p: 1,
            mb: 1,
            bgcolor: `${
              notification.status === "unread" ? "#f5f5f5" : "backgroud.paper"
            }`,
          }}
          key={`notification-${notification.id}`}
          onClick={() =>
            handleRead(
              notification.status,
              notification.id,
              notification.tourId
            )
          }
        >
          <Avatar
            alt={notification.user?.username}
            src={
              notification.user?.avatarUrl ||
              `${process.env.PUBLIC_URL}/assets/images/unknown.png`
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#757575", fontStyle: "italic" }}
            >
              {fromNow(notification.updatedAt)}
            </Typography>
            <Typography variant="body1">
              <b>{notification.user?.username}</b>
              {` ${
                notification.others === 0
                  ? ""
                  : `and ${notification.others} other${
                      notification.others > 1 ? "s" : ""
                    }`
              } ${notification.action} ${
                notification.action === "reported" ? "a" : "your"
              } ${notification.notifiableType}`}
            </Typography>
          </Box>
        </Box>
      ))}
      {Math.ceil(total / 10) > 1 && (
        <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 3,
          }}
          count={Math.ceil(total / 10)}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  id: state.entities.session.currentUser.id,
  notifications: state.entities.session.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  loadNotifications: (id, params) => dispatch(loadNotifications(id, params)),
  readNotification: (id) => dispatch(readNotification(id)),
  readAllNotifications: (id) => dispatch(readAllNotifications(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);