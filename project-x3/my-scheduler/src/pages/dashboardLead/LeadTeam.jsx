import { useSelector } from "react-redux";
import Avatar from "../../components/reusable/Avatar";

function LeadTeam() {
  const { user } = useSelector((state) => state.auth);
  const { team } = useSelector((state) => state.users);
  const { tasks } = useSelector((state) => state.tasks);

  const getMemberStats = (username) => {
    const memberTasks = tasks.filter((t) => t.assignedTo === username);
    return {
      total: memberTasks.length,
      working: memberTasks.filter((t) => t.status === "working").length,
      completed: memberTasks.filter((t) => t.status === "completed").length,
    };
  };

  return (
    <div>
      <h1>My Team</h1>
      <p>
        {user?.division} Division - {team.length} staffs
      </p>

      <div className="teamGrid">
        {team.map((member) => {
          const stats = getMemberStats(member.username);
          return (
            <div key={member.username} className="teamCard">
              <div className="teamCardHeader">
                <Avatar name={member.name} size="medium" />
                <div>
                  <h3>{member.name}</h3>
                  <p className="teamUsername">@{member.username}</p>
                </div>
              </div>
              <div className="teamCardStats">
                <div className="teamStatItem">
                  <span className="teamStatLabel">Total</span>
                  <span className="teamStatValue">{stats.total}</span>
                </div>
                <div className="teamStatItem">
                  <span className="teamStatLabel">Working</span>
                  <span className="teamStatValue working">{stats.working}</span>
                </div>
                <div className="teamStatItem">
                  <span className="teamStatLabel">Completed</span>
                  <span className="teamStatValue completed">{stats.completed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeadTeam;