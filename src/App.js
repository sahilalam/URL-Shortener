import './App.css';
import React from "react";
import {BrowserRouter,Route,NavLink, Redirect} from "react-router-dom";
import RegisterMail from "./register_mail.js";
import RegisterUser from "./register_user.js";
import Login from "./login.js";
import {Row,Col,Button } from "react-bootstrap";
import Context from "./Context.js";
import Content from './Content';


class App extends React.Component{
username=React.createRef();
login=(access_token)=>{
    window.localStorage.setItem('access_token',access_token);

    this.forceUpdate();
    
}
  logout=()=>{
    window.localStorage.clear();
    this.forceUpdate();
  }
  verify=async()=>{
    try{
      
        const access_token=window.localStorage.access_token;
        let data=await fetch('https://sh-r.herokuapp.com/verify_token&get_user_details',{
            method:"GET",
            mode:"cors",
            headers:{
                'authorization':access_token
            }
        })
        data=await data.json();
        if(!data.data)
        {
          this.logout();
        }
        if(!window.localStorage.name)
        {
          window.localStorage.setItem('name',data.data.name);
          this.username.current.innerHTML=window.localStorage.name
          
        }
       
        
    }
    catch(err)
    {
      console.log(err);
      this.logout();
    }
}
componentDidMount(){
  if(window.localStorage.access_token)
    {
      this.verify();
    }

}
componentDidUpdate(){
  if(!window.localStorage.name && window.localStorage.access_token)
  {
    this.verify()
  }
}
  render(){
    
    
    return (
      <div>
      <BrowserRouter>
          <Row className="nav-bar ">
            <Col md="7" xs="12" className="text-align-left">
            <h3 className="heading">URL-Shortner</h3>
            </Col>
            <Col md="5" xs="12">
              <Row className="justify-content-end">
              {
              window.localStorage.access_token
              ?
                <>
                <Col xs="6" md="5" className="p-0 m-0">
                  <div  className="tube " ref={this.username}>
                    {window.localStorage.name}
                  </div>
                </Col>
                  
                  <Col xs="6" md="5" onClick={this.logout}>
                    <NavLink to="/register" className="nav-link buton">
                      Logout
                    </NavLink>
                  </Col>
                </>
              :
              <>
                <Col xs="6" md="5">
                <NavLink to="/register" className="nav-link buton">
                  Register
                </NavLink>
                </Col>
                <Col xs="6" md="5">
                  <NavLink to="/login" className="nav-link buton">
                      Login
                  </NavLink>
                </Col>
              </>
            }
              </Row>
            </Col>
            
          </Row>
          <Row className="p-3">
            <Route exact path="/">
              {
                window.localStorage.access_token
                ?
                <Redirect to="/home"></Redirect>
                :
                <Redirect to="/register"></Redirect>
              }
              
            </Route>
            <Route exact path="/register" component={RegisterMail}></Route>
            <Route exact path="/register/:encrypted" component={RegisterUser}></Route>
            <Context.Provider value={
              {
                login:this.login,
                logout:this.logout
              }
            }>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/home" component={Content}/>
            </Context.Provider>
          </Row>
        
          
          
      </BrowserRouter>
      </div>
      
      
    )
  }
}

export default App;
