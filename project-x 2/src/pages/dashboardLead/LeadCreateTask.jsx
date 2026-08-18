import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTasks } from "../../contexts/TaskContext";
import InputField from "../../components/reusable/InputField";
import {
  ButtonActionNegative,
  ButtonActionPositive,
} from "../../components/reusable/ButtonAction";

function LeadCreateTask() {
  const navigate = useNavigate();
  const { user, getTeamMembers } = useAuth();
  const { addTask } = useTasks();
  const team = getTeamMembers();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Task title is required";
    if (!formData.description)
      newErrors.description = "Task description is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Select a team member";
    if (!formData.dueDate) newErrors.dueDate = "Deadline is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignedMember = team.find((m) => m.username === formData.assignedTo);

    addTask({
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assignedToName: assignedMember?.name || formData.assignedTo,
      assignedBy: user.username,
      assignedByName: user.name,
      division: user.division,
      dueDate: formData.dueDate,
      priority: formData.priority,
    });

    navigate("/dashboard/lead/tasks");
  };

  return (
    <div>
      <div className="dashboardHeader">
        <h1>Create New Task</h1>
        <ButtonActionNegative
          to="/dashboard/lead/tasks"
          className="btn btn-positive"
        >
          Back
        </ButtonActionNegative>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit} className="taskForm">
          <InputField
            label="Task Title"
            type="text"
            name="title"
            id="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            name="description"
            id="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            rows="4"
          />

          <InputField
            label="Assigned to"
            type="select"
            name="assignedTo"
            id="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            error={errors.assignedTo}
            required
          >
            <option value="">Select team member</option>
            {team.map((member) => (
              <option key={member.username} value={member.username}>
                {member.name}
              </option>
            ))}
          </InputField>

          <div className="formRow">
            <InputField
              label="Deadline"
              type="date"
              name="dueDate"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              required
            />

            <InputField
              label="Priority"
              type="select"
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </InputField>
          </div>

          <div className="formActions">
            <ButtonActionPositive type="submit" className="btn-full">
              Create Task
            </ButtonActionPositive>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeadCreateTask;
