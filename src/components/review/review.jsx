import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Badge from "@mui/material/Badge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { connect } from "react-redux";
import Comment from "./comment";
import StyledRating from "../common/rating";
import ReportDialog from "../common/reportDialog";
import { dateFormatter } from "../../helpers/tour_helper";
import {
  deleteReview,
  loadComments,
  loadReplies,
  deleteComment,
} from "../../store/tours";

const Review = (props) => {
  const {
    commentsList,
    review,
    currentUser,
    deleteReview,
    loadComments,
    loadReplies,
    deleteComment,
  } = props;
  const {
    user: { username, avatarUrl },
    id,
    body,
    hearts,
    createAt,
    liked = false,
    likes = 0,
    state = "appear",
    size = 0,
    comments = [],
  } = review;

  const disabled = currentUser.id === 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [like, setLike] = useState(liked);
  const [numLikes, setNumLikes] = useState(likes);
  const [hidden, setHidden] = useState(state === "hide");
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState(false);
  const [value, setValue] = useState("Negative words");
  const [openComments, setOpenComments] = useState(false);

  const handleCloseDialog = () => {
    setConfirm(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    await axios.get(`reviews/${id}/like`);
    like ? setNumLikes(numLikes - 1) : setNumLikes(numLikes + 1);
    setLike(!like);
  };

  const handleAction = async (type) => {
    switch (type) {
      case "report":
        setReport(true);
        setAnchorEl(null);
        break;
      case "delete":
        setConfirm(true);
        setAnchorEl(null);
        break;
      default:
        await axios.get(`reviews/${id}/${type}`);
        setAnchorEl(null);
        setHidden(!hidden);
    }
  };

  const handleConfirmDialog = async () => {
    setConfirm(false);
    await deleteReview(id);
  };

  const handleCloseReport = (newValue) => {
    setReport(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  const handleShowComments = async () => {
    if (comments.length === 0) await loadComments(id, { page: 1 });
    setOpenComments(!openComments);
  };

  const handleClickMore = async () => {
    const page = comments.length / 10 + 1;
    await loadComments(id, { page });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          mb: 2,
          pl: 2,
        }}
      >
        <Box mt={1} mr={2}>
          <Avatar
            alt={username}
            src={
              avatarUrl || `${process.env.PUBLIC_URL}/assets/images/unknown.png`
            }
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" component="div">
            {username}
          </Typography>
          <Typography variant="body2">
            <StyledRating
              name="customized-color"
              value={hearts}
              readOnly={true}
              getLabelText={(value) =>
                `${value} Heart${value !== 1 ? "s" : ""}`
              }
              precision={0.5}
              max={10}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
            />
          </Typography>
          {hidden && (
            <Alert sx={{ mr: 2 }} variant="filled" severity="info">
              This review is hidden!
            </Alert>
          )}
          <Box
            sx={{
              py: 1,
              mr: 2,
              lineHeight: 1.5,
              fontSize: "18px",
            }}
            component={Typography}
            variant="body1"
          >
            {body}
          </Box>
          <Box
            component={Typography}
            sx={{ mr: 2, pb: 2, borderBottom: 1, color: "#757575" }}
            variant="body2"
          >
            {dateFormatter(createAt)}
          </Box>
          <Box
            component={Typography}
            sx={{ mr: 2, py: 1, borderBottom: 1, color: "#757575" }}
            variant="body2"
          >
            <Box
              component="span"
              sx={{ fontWeight: 700, fontSize: 16, color: "#111" }}
            >
              {numLikes}
            </Box>{" "}
            Likes
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <IconButton aria-label="comment" onClick={handleShowComments}>
              <Badge badgeContent={size} color="secondary">
                {openComments ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />}
              </Badge>
            </IconButton>
            <IconButton
              aria-label="like"
              disabled={disabled}
              onClick={handleLike}
            >
              {like ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            </IconButton>
            <IconButton
              disabled={disabled}
              aria-label="more"
              id={`button-${id}`}
              aria-controls={open ? `menu-${id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={`menu-${id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": `button-${id}`,
              }}
            >
              {currentUser.admin ? (
                <Box>
                  <MenuItem
                    onClick={() => handleAction(hidden ? "appear" : "hide")}
                  >
                    {hidden ? "appear" : "hide"}
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("delete")}>
                    delete
                  </MenuItem>
                </Box>
              ) : (
                <MenuItem
                  aria-haspopup="true"
                  aria-controls="report-menu"
                  aria-label="review report"
                  onClick={() => handleAction("report")}
                >
                  report
                </MenuItem>
              )}
            </Menu>
          </Stack>
          <ReportDialog
            id="report-menu"
            keepMounted
            open={report}
            onClose={handleCloseReport}
            value={value}
            type="review"
            targetId={id}
          />
          <Dialog
            open={confirm}
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-description"
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              Confirmable
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure about this action?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDialog}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Collapse in={openComments} timeout="auto" unmountOnExit>
        {commentsList
          .filter((item) => comments.includes(item.id))
          .map((comment) => (
            <Comment
              key={`comment-${comment.id}`}
              comment={comment}
              currentUser={currentUser}
              commentsList={commentsList}
              loadReplies={loadReplies}
              deleteComment={deleteComment}
            />
          ))}
        {size > comments.length && (
          <Box
            component={Button}
            onClick={handleClickMore}
            sx={{ ml: 2, mt: -1 }}
            variant="text"
          >
            Show more...
          </Box>
        )}
        <Box>
          <TextareaAutosize
            aria-label="comment"
            minRows={3}
            placeholder="Type your comment here"
          />
        </Box>
      </Collapse>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
  commentsList: state.entities.tours.current.commentsList,
});

const mapDispatchToProps = (dispatch) => ({
  deleteReview: (id) => dispatch(deleteReview(id)),
  loadComments: (id, params) => dispatch(loadComments(id, params)),
  loadReplies: (id, params) => dispatch(loadReplies(id, params)),
  deleteComment: (id) => dispatch(deleteComment(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Review);