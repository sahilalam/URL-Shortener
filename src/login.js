import React from "react";
import { Form,Row,Col ,Modal,Spinner} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Context from "./Context.js";

export default class Login extends React.Component{
    static contextType=Context;
    username=React.createRef();
    password=React.createRef();
    constructor(props)
    {
        super(props);
        this.state={
            toast:false,
            successful:false,
            spinner:false,
            data:null
        }
    }
    toggleToast=()=>{
        this.setState({toast:!this.state.toast});
    }
    login=async(event)=>{
        event.preventDefault();
        this.setState({spinner:true});
        this.toggleToast();
        try{
            let details={
                username:this.username.current.value,
                password:this.password.current.value
            }
            let body=[];
            for(let key in details)
            {
                let ek=encodeURIComponent(key);
                let ep=encodeURIComponent(details[key]);
                body.push(ek+"="+ep);
            }
            body=body.join('&');
            let data=await fetch('https://sh-r.herokuapp.com/login',{
                method:'POST',
                body:body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }

            });
            data=await data.json();
            if(data.access_token)
            {
                this.context.login(data.access_token);
                this.setState({successful:true});
                
            }
            else
            {
                this.setState({data:data.message,successful:false,spinner:false});
            }
            
            ;

        }
        catch(err)
        {
            console.log(err)
            this.setState({data:err.message,successful:false,spinner:false});
        }
    }
    render()
    {
        return ( 
            window.localStorage.access_token
            ?
            <Redirect to="/"></Redirect>
            : 
                this.state.successful
                ?
                    <Redirect to="/"></Redirect>
                :
                <Col xs="12"> 
                    <Row className="justify-content-center">
                        <Col md="5" xs="12" className="text-center">
                            <Form onSubmit={this.login} >
                                <Col xs="12" className="header mb-3">
                                <h5 className="heading"> Login </h5>
                                </Col>
                                <Col xs="12" className="box box-shadow">
                                Enter your username..
                                <Form.Control ref={this.username} type="text" placeholder="enter your username.." required={true} className="mb-3 input" />
                                Enter your password..
                                <Form.Control ref={this.password} type="password" placeholder="enter password.." required={true} className="mb-3 input" />
                                <button type="submit" className="buton mb-2">Submit</button>
                                </Col>   
                            </Form>
                            <Modal show={this.state.toast} onHide={this.toggleToast} backdrop="static">
                                {
                                    this.state.spinner
                                    ?
                                    <Modal.Header>Please Wait..<Spinner animation="border" /></ Modal.Header>
                                    :
                                    <Modal.Header closeButton>{this.state.data}</Modal.Header>
                                } 
                            </Modal> 
                        </Col>
                    </Row>
                </Col>            
        )
    }
}