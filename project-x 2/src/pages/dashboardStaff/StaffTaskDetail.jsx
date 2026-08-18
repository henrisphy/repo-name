import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "../../components/reusable/InputField";
import Modal from "../../components/reusable/Modal";
import {
  ButtonActionPositive,
  ButtonActionNegative,
} from "../../components/reusable/ButtonAction";

function StaffTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, addComment, addPhoto } = useTasks();
  const [newComment, setNewComment] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const task = tasks.find((t) => t.id === parseInt(id));

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [task?.comments, task?.photos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPhotoInput]);

  if (!task) {
    return (
      <div className="taskNotFound">
        <h1>Task Not Found</h1>
        <ButtonActionPositive
          onClick={() => navigate("/dashboard/staff/tasks")}
        >
          Back to Task List
        </ButtonActionPositive>
      </div>
    );
  }

  const handleSendComment = () => {
    if (newComment.trim()) {
      addComment(task.id, user.username, user.name, newComment);
      setNewComment("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
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

  const handleUploadPhoto = () => {
    if (!selectedFile) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoUrl = reader.result;
      const caption = photoCaption || selectedFile.name;
      addPhoto(task.id, photoUrl, caption, user);
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
    };
    reader.readAsDataURL(selectedFile);
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

  const isCurrentUser = (commentUser) => {
    return commentUser === user.username;
  };

  const getAllMessages = () => {
    const comments = task.comments.map((c) => ({
      ...c,
      type: "comment",
      sortTime: new Date(c.timestamp).getTime(),
    }));

    const photos = task.photos.map((p) => ({
      id: p.id,
      user: p.user || task.assignedTo,
      userName: p.userName || task.assignedToName,
      text: p.caption,
      type: "photo",
      url: p.url,
      timestamp:
        p.timestamp ||
        new Date(p.id).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortTime: p.id,
    }));

    return [...comments, ...photos].sort((a, b) => a.sortTime - b.sortTime);
  };

  const messages = getAllMessages();

  return (
    <div className="chatLayout">
      <div className="chatHeader">
        <div className="chatHeaderLeft">
          <ButtonActionNegative
            onClick={() => navigate("/dashboard/staff/tasks")}
          >
            Back
          </ButtonActionNegative>
          <div className="chatHeaderInfo">
            <h2>{task.title}</h2>
            <div className="chatHeaderMeta">
              <span className={`statusBadge ${task.status}`}>
                {task.status === "working" ? "Working" : "Completed"}
              </span>
              <span
                className={`priorityBadge ${getPriorityColor(task.priority)}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
              <span className="chatHeaderAssign">
                Assigned by: {task.assignedByName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chatBody" ref={chatContainerRef}>
        <div className="chatMessages">
          {messages.length === 0 ? (
            <div className="chatEmpty">
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`messageItem ${
                  isCurrentUser(msg.user) ? "messageOwn" : "messageOther"
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
                      <img src={msg.url} alt={msg.text} />
                      {msg.text && <p className="photoCaption">{msg.text}</p>}
                    </div>
                  ) : (
                    <div className="messageText">{msg.text}</div>
                  )}
                  <div className="messageTime">{msg.timestamp}</div>
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

      <Modal isOpen={!!selectedPhoto} onClose={handleClosePhoto} size="full">
        <div className="modalImageWrapper">
          <img
            src={selectedPhoto?.url}
            alt={selectedPhoto?.caption}
            className="modalImage"
          />
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
    </div>
  );
}

export default StaffTaskDetail;
