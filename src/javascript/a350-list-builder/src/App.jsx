import logo from './logo.svg';
import styles from './App.module.css';
import NavBar from  './components/NavBar';
import ForceEditor from  './components/ForceEditor';
import {ActiveForceStoreProvider} from './components/ActiveForceStore';


function App() {
  return (
    <div class={styles.App}>
      <ActiveForceStoreProvider>
          <NavBar/>
          <ForceEditor/>
      </ActiveForceStoreProvider>
    </div>
  );
}

export default App;
