import logo from './logo.svg';
import './App.css';
import CheckList from'./component/CheckList';
import CompanyList from './component/CompanyList';
import { Routes, Route ,Link} from 'react-router-dom' 
function App() {
  return (
    <div className="App">
      <CheckList/>
    </div>
  );
}

export default App;
