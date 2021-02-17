import { BrowserRouter as Router, Route } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';

const App = () => {
  return (
    <div className="app container">
      <h2 className="title is-2 has-text-centered">
        Welcome to Breadcrumb File-Browser
      </h2>
      <Router>
        <Route component={Breadcrumb} />
      </Router>
    </div>
  );
};

export default App;
