import { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuth from '../context/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        if (isMounted) {
          setTasks(data.data || []);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await api.post('/tasks', { title });
      setTasks([data.data, ...tasks]);
      setTitle('');
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

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="avatar">{getInitials(user?.name || 'U')}</div>
          <div className="user-details">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <button onClick={logout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          maxLength={100}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {loading ? (
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p className="loader-text">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty-state">
          <div className="icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Add your first task using the form above.</p>
        </div>
      ) : (
        tasks.map((task) => (
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
                <button
                  onClick={() => deleteTask(task._id)}
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
        ))
      )}
    </div>
  );
};

export default Dashboard;