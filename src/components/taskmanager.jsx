import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import "./taskmanager.css";

function TaskManager({ session }) {
  if (!session) {
    return <p>Loading...</p>;
  }
  const userId = session.user.id;
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [newDescription, setNewDescription] = useState({});
  const [taskImage, setTaskImage] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };
  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);
    if (error) {
      console.error("Error deleting task:", error);
    }
    fetchTasks();
  };
  const updateTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription[taskId] })
      .eq("id", taskId)
      .eq("user_id", userId);
    if (error) {
      console.error("Error updating task:", error);
    }
    fetchTasks();
  };
  const uploadImage = async (file) => {
    const filePath = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("task-images")
      .upload(filePath, file);
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    const { data } = supabase.storage
      .from("task-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = null;
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    }
    const { error } = await supabase
      .from("tasks")
      .insert([{ ...newTask, user_id: userId, image_url: imageUrl }]);
    if (error) {
      console.error("Error adding task:", error);
    } else {
      setNewTask({ title: "", description: "" });
      fetchTasks();
      setTaskImage(null);
    }
  };
  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  };
  useEffect(() => {
    if (session) fetchTasks();
  }, [session]);
  return (
    <div className="container">
      <h2>Task Manager</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="textarea"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button className="btn primary" type="submit">
          Add Task
        </button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-card" key={task.id}>
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
            </div>

            <p className="task-desc">{task.description}</p>

            {task.image_url && (
              <img src={task.image_url} alt="Task" className="task-image" />
            )}

            <textarea
              className="task-edit"
              placeholder="Update Description"
              value={newDescription[task.id] || ""}
              onChange={(e) =>
                setNewDescription((prev) => ({
                  ...prev,
                  [task.id]: e.target.value,
                }))
              }
            />

            <div className="task-actions">
              <button
                className="btn update"
                onClick={() => updateTask(task.id)}
              >
                Update
              </button>
              <button
                className="btn delete"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { TaskManager };
