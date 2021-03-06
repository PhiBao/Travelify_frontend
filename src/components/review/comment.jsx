import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Collapse from "@mui/material/Collapse";
import Badge from "@mui/material/Badge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ReportDialog from "../common/reportDialog";
import CommentForm from "../common/commentForm";
import { fromNow } from "../../helpers/timeHelper";
import EditCommentForm from "../common/editCommentForm";

const Comment = (props) => {
  const {
    comment,
    currentUser,
    deleteComment,
    loadReplies,
    commentsList,
    createReply,
    likeComment,
    toggleComment,
    editComment,
  } = props;
  const {
    user: { id: userId, username, avatarUrl },
    id,
    body,
    createdAt,
    liked,
    likes,
    state = "appear",
    size,
    replies = [],
    replyTo,
  } = comment;

  const disabled = currentUser.id === 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState(false);
  const [value, setValue] = useState("Negative words");
  const [openReplies, setOpenReplies] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleCloseDialog = () => {
    setConfirm(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleLike = async () => {
    await likeComment(id);
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
      case "edit":
        setOpenEdit(true);
        break;
      default:
        await toggleComment(id);
        setAnchorEl(null);
    }
  };

  const handleConfirmDialog = async () => {
    setConfirm(false);
    await deleteComment(id);
  };

  const handleCloseReport = (newValue) => {
    setReport(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  const handleShowReplies = async () => {
    if (size > 0 && replies.length === 0) await loadReplies(id, { page: 1 });
    setOpenReplies(!openReplies);
  };

  const handleClickMore = async () => {
    const page = replies.length / 10 + 1;
    await loadReplies(id, { page });
  };

  const handleEdit = async (data, e) => {
    e.preventDefault();
    setOpenEdit(false);
    await editComment(id, data);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          mb: 2,
          pl: 2,
          bgcolor: "#eeeeee",
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
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Typography variant="h6" component="div">
            {username}{" "}
          </Typography>
          <Box
            component={Typography}
            sx={{ mr: 2, color: "#757575" }}
            variant="body2"
          >
            {fromNow(createdAt)}
          </Box>
          {state === "hide" && (
            <Alert sx={{ mr: 2 }} variant="filled" severity="info">
              This comment is hidden!
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
            {replyTo && (
              <Box
                component="span"
                sx={{
                  display: "block",
                  mr: 2,
                  color: "#757575",
                }}
              >
                reply to @{replyTo}
              </Box>
            )}
            {body}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <IconButton aria-label="comment" onClick={handleShowReplies}>
              <Badge badgeContent={size} color="secondary">
                {openReplies ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />}
              </Badge>
            </IconButton>
            <IconButton
              aria-label="like"
              disabled={disabled}
              onClick={handleLike}
            >
              <Badge badgeContent={likes} color="primary">
                {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              </Badge>
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
              {currentUser.admin && (
                <MenuItem onClick={() => handleAction("toggle")}>
                  {state === "hide" ? "appear" : "hide"}
                </MenuItem>
              )}
              {(currentUser.admin || userId === currentUser.id) && (
                <MenuItem onClick={() => handleAction("delete")}>
                  delete
                </MenuItem>
              )}
              {userId === currentUser.id && (
                <MenuItem onClick={() => handleAction("edit")}>edit</MenuItem>
              )}
              <MenuItem
                aria-haspopup="true"
                aria-controls="report-menu"
                aria-label="review report"
                onClick={() => handleAction("report")}
              >
                report
              </MenuItem>
            </Menu>
          </Stack>
          <ReportDialog
            id="report-menu"
            keepMounted
            open={report}
            onClose={handleCloseReport}
            value={value}
            type="comment"
            targetId={id}
          />
          <EditCommentForm
            id="edit-dialog"
            open={openEdit}
            handleClose={handleCloseEdit}
            username={currentUser.email}
            body={body}
            avatarUrl={currentUser.avatarUrl}
            onSubmit={handleEdit}
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
      <Collapse in={openReplies} timeout="auto" unmountOnExit>
        {commentsList
          .filter((item) => replies.includes(item.id))
          .map((comment) => (
            <Comment
              key={`comment-${comment.id}`}
              comment={comment}
              currentUser={currentUser}
              commentsList={commentsList}
              loadReplies={loadReplies}
              deleteComment={deleteComment}
              createReply={createReply}
              editComment={editComment}
              likeComment={likeComment}
              toggleComment={toggleComment}
            />
          ))}
        {size > replies.length && (
          <Box
            component={Button}
            onClick={handleClickMore}
            sx={{ ml: 2, mt: -1 }}
            variant="text"
          >
            Show more...
          </Box>
        )}
        {currentUser.id !== 0 && (
          <CommentForm
            username={currentUser.email}
            avatarUrl={currentUser.avatarUrl}
            id={id}
            label="Reply"
            handleOnSubmit={createReply}
          />
        )}
      </Collapse>
    </Box>
  );
};

export default Comment;
