import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/tasks');
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? data.data : t))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p className="loader-text">Fetching tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <span className="badge">⚡ InternSpark</span>
        <h1>
          Task <span className="gradient-text">Manager</span>
        </h1>
        <p className="subtitle">
          Organize your day, one task at a time
        </p>
        <Link to="/create" className="btn btn-primary">

          New Task
        </Link>
      </header>

      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button className="btn btn-secondary btn-sm" onClick={fetchTasks}>
            Retry
          </button>
        </div>
      )}

      {!error && tasks.length === 0 && (
        <div className="card empty-state">
          <div className="icon">📝</div>
          <h3>No tasks yet</h3>
          <p>
            Click <strong>New Task</strong> to create your first task.
          </p>
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task._id}
          className={`card card-task ${task.completed ? 'completed' : ''}`}
        >
          <div className="card-task-header">
            <div className="card-task-title">
              <input
                type="checkbox"
                className="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <h3 className={task.completed ? 'completed' : ''}>
                {task.title}
              </h3>
            </div>
            <div className="card-task-actions">
              <Link
                to={`/edit/${task._id}`}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(task._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
          {task.description && (
            <p className="card-task-description">{task.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;