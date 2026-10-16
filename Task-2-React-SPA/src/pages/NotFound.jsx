import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <h1 style={{ fontSize: '72px', color: '#ffc107' }}>404</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>Page not found</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;