import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  addPhoto,
  uploadPhotoFile,
  completeTask,
  updateTask,
  fetchTaskById,
} from "../../features/tasks/taskSlice";
import InputField from "../../components/reusable/InputField";
import Modal from "../../components/reusable/Modal";
import {
  ButtonActionPositive,
  ButtonActionNegative,
} from "../../components/reusable/ButtonAction";

function LeadTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, currentTask } = useSelector((state) => state.tasks);

  const [newComment, setNewComment] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const task = tasks.find((t) => t.id === id) || currentTask || taskData;

  const getAllMessages = (taskData) => {
    if (!taskData) return [];

    const comments = (taskData.comments || []).map((c) => ({
      ...c,
      type: "comment",
      sortTime: new Date(c.timestamp).getTime(),
      id: c.id || `comment-${Date.now()}-${Math.random()}`,
    }));

    const photos = (taskData.photos || []).map((p) => ({
      id: p.id || `photo-${Date.now()}-${Math.random()}`,
      user: p.username || taskData.assignedTo,
      userName: p.userName || taskData.assignedToName,
      text: p.caption || "",
      type: "photo",
      url: p.url,
      timestamp: p.timestamp || new Date().toISOString(),
      sortTime: p.id || Date.now(),
    }));

    return [...comments, ...photos].sort((a, b) => a.sortTime - b.sortTime);
  };

  const messages = useMemo(() => {
    if (task) {
      return getAllMessages(task);
    }
    return [];
  }, [task]);

  useEffect(() => {
    const fetchTask = async () => {
      if (!task && id) {
        try {
          const result = await dispatch(fetchTaskById(id)).unwrap();
          setTaskData(result);
        } catch (err) {
          console.error("Failed to fetch task:", err);
        }
      }
    };
    fetchTask();
  }, [dispatch, id, task]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isCurrentUser = (commentUser) => {
    return commentUser === user.username;
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !task) return;

    const commentText = newComment;
    setNewComment("");

    try {
      await dispatch(
        addComment({
          taskId: task.id,
          commentData: {
            username: user.username,
            userName: user.name,
            text: commentText,
          },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to send comment:", error);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showPhotoInput) {
        handleUploadPhoto();
      } else {
        handleSendComment();
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoCaption(file.name);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile || !task) return;

    setUploading(true);

    try {
      const uploadResult = await dispatch(
        uploadPhotoFile(selectedFile)
      ).unwrap();

      await dispatch(
        addPhoto({
          taskId: task.id,
          photoData: {
            url: uploadResult.url,
            caption: photoCaption || selectedFile.name,
            username: user.username,
            userName: user.name,
          },
        })
      ).unwrap();

      setPhotoCaption("");
      setSelectedFile(null);
      setShowPhotoInput(false);
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setUploading(false);
      console.error("Failed to upload photo:", error);
      alert("Gagal upload gambar. Silakan coba lagi.");
    }
  };

  const handleMarkComplete = () => {
    setConfirmTitle("Mark as Complete");
    setConfirmMessage("Are you sure you want to mark this task as complete?");
    setConfirmAction(() => () => {
      dispatch(completeTask(task.id));
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleRevertToWorking = () => {
    setConfirmTitle("Revert to Working");
    setConfirmMessage(
      "Are you sure you want to revert this task to working status?"
    );
    setConfirmAction(() => () => {
      dispatch(
        updateTask({
          id: task.id,
          data: { status: "working", completedAt: null },
        })
      );
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleOpenPhoto = (photoUrl, caption, userName) => {
    setSelectedPhoto({ url: photoUrl, caption, userName });
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const getPriorityLabel = (priority) => {
    const labels = { high: "High", medium: "Medium", low: "Low" };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    const classes = {
      high: "priorityHigh",
      medium: "priorityMedium",
      low: "priorityLow",
    };
    return classes[priority] || "";
  };

  const formatDescription = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  if (!task) {
    return (
      <div className="taskNotFound">
        <h1>Task Not Found</h1>
        <p>The task you're looking for doesn't exist or has been removed.</p>
        <ButtonActionPositive onClick={() => navigate("/dashboard/lead/tasks")}>
          Back to Task List
        </ButtonActionPositive>
      </div>
    );
  }

  return (
    <div className="taskDetailContainer">
      <div className="taskDetailHeader">
        <div>
          <ButtonActionNegative
            onClick={() => navigate("/dashboard/lead/tasks")}
          >
            Back
          </ButtonActionNegative>
          <h1>{task.title}</h1>
          <div className="taskDetailMeta">
            <span className={`statusBadge ${task.status}`}>
              {task.status === "working" ? "Working" : "Completed"}
            </span>
            <span
              className={`priorityBadge ${getPriorityColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </span>
            <span className="taskDetailAssign">
              Assigned to: {task.assignedToName}
            </span>
            <span className="taskDetailAssign">By: {task.assignedByName}</span>
            <span className="taskDetailDue">Due: {task.dueDate}</span>
          </div>
        </div>
        <div className="taskDetailActions">
          {task.status === "working" ? (
            <ButtonActionPositive onClick={handleMarkComplete}>
              Mark Complete
            </ButtonActionPositive>
          ) : (
            <ButtonActionNegative onClick={handleRevertToWorking}>
              Revert to Working
            </ButtonActionNegative>
          )}
        </div>
      </div>

      <div className="taskDetailBody">
        <div className="taskDetailDescription">
          <h3>Description</h3>
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: "1.8",
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              background: "var(--bg-primary)",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-primary)",
            }}
          >
            {formatDescription(task.description)}
          </div>
        </div>

        <div className="taskDetailChat">
          <h3>Chat</h3>
          <div className="chatLayout">
            <div className="chatBody" ref={chatContainerRef}>
              <div className="chatMessages">
                {messages.length === 0 ? (
                  <div className="chatEmpty">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`messageItem ${
                        isCurrentUser(msg.user || msg.username)
                          ? "messageOwn"
                          : "messageOther"
                      }`}
                    >
                      <div className="messageContent">
                        <div className="messageSender">{msg.userName}</div>
                        {msg.type === "photo" ? (
                          <div
                            className="messagePhotoContent"
                            onClick={() =>
                              handleOpenPhoto(msg.url, msg.text, msg.userName)
                            }
                          >
                            {msg.url && (
                              <img
                                src={msg.url}
                                alt={msg.text || "Photo"}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "180px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  const parent = e.target.parentElement;
                                  if (parent) {
                                    parent.innerHTML =
                                      "<p>Image failed to load</p>";
                                  }
                                }}
                              />
                            )}
                            {msg.text && (
                              <p className="photoCaption">{msg.text}</p>
                            )}
                          </div>
                        ) : (
                          <div className="messageText">{msg.text}</div>
                        )}
                        <div className="messageTime">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleString()
                            : "Just now"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="chatFooter">
              {showPhotoInput ? (
                <div className="photoUploadArea">
                  <div className="photoUploadRow">
                    <InputField
                      type="text"
                      placeholder="Photo caption..."
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="photoCaptionInput"
                      ref={inputRef}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                    <ButtonActionPositive
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-small"
                    >
                      Browse
                    </ButtonActionPositive>
                    <ButtonActionPositive
                      onClick={handleUploadPhoto}
                      className="btn-small"
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </ButtonActionPositive>
                    <ButtonActionNegative
                      onClick={() => {
                        setShowPhotoInput(false);
                        setPhotoCaption("");
                        setSelectedFile(null);
                        setUploading(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="btn-small"
                    >
                      Cancel
                    </ButtonActionNegative>
                  </div>
                  {selectedFile && (
                    <div className="selectedFileInfo">
                      <span>{selectedFile.name}</span>
                      <span>({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="chatInputArea">
                  <div className="chatInputRow">
                    <InputField
                      type="text"
                      placeholder="Type a message..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="chatMessageInput"
                      ref={inputRef}
                    />
                    <ButtonActionPositive
                      onClick={handleSendComment}
                      className="btn-small"
                      disabled={!newComment.trim()}
                    >
                      Send
                    </ButtonActionPositive>
                    <ButtonActionPositive
                      onClick={() => setShowPhotoInput(true)}
                      className="btn-small"
                    >
                      Photo
                    </ButtonActionPositive>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedPhoto} onClose={handleClosePhoto} size="full">
        <div className="modalImageWrapper">
          {selectedPhoto?.url && (
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Photo"}
              className="modalImage"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  "<p>Image failed to load</p>";
              }}
            />
          )}
          {selectedPhoto?.caption && (
            <p className="modalImageCaption">{selectedPhoto.caption}</p>
          )}
          {selectedPhoto?.userName && (
            <p className="modalImageCaption uploader">
              Uploaded by: {selectedPhoto.userName}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        size="small"
      >
        <h3 className="modalTitle">{confirmTitle}</h3>
        <p className="modalBody">{confirmMessage}</p>
        <div className="modalFooter">
          <ButtonActionNegative onClick={() => setShowConfirmModal(false)}>
            Cancel
          </ButtonActionNegative>
          <ButtonActionPositive onClick={confirmAction}>
            Confirm
          </ButtonActionPositive>
        </div>
      </Modal>
    </div>
  );
}

export default LeadTaskDetail;
