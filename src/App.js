import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import OrderInfo from './Components/OrderInfo'
import OldOrders from './Components/PastOrders'
import MissingPage from './Components/MissingPage';
import RequireAuth from './Components/RequireAuth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


// auth & redux
// import AuthRoute from './Components/AuthRoute';
// import BasicRoute from './Components/BasicRoute';
// import connect from 'react-redux';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          {/* <Route path='/Register' element={<Register />}></Route> */}

          {/* Protected Route */}
          <Route element={<RequireAuth></RequireAuth>}>
            <Route path='/OrderInfo' element={<OrderInfo />}></Route>
            <Route path='/PastOrders' element={<OldOrders/>}></Route>
          </Route>


          {/* catch all */}
          <Route path='*' element={<MissingPage />}></Route>
        </Routes>
      </BrowserRouter>
      {/* <Login /> */}
      {/* <Register/> */}
    </div>
  );
}
// const mapStateToProps = ({session}) => ({
//   checked: session.checked,
// })

// export default connect(mapStateToProps)(App);
export default App;
