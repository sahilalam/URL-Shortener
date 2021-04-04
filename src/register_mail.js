import React from "react";
import {Row,Col,Form,Modal,Spinner} from "react-bootstrap";
import {Redirect} from "react-router-dom"

export default class RegisterMail extends React.Component{
    email=React.createRef();
    constructor(props)
    {
        super(props);
        this.state={
            toast:false,
            spinner:false,
            message:""
        }
    }
    toggleToast=()=>{
        this.setState({toast:!this.state.toast});
    }
    register=async(event)=>{
        event.preventDefault();
        this.setState({spinner:true})
        this.toggleToast();
        try{
            
            if(this.email.current.checkValidity()){
                let details={
                    email:this.email.current.value
                }
                let body=[];
                for(let property in details)
                {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(details[property]);
                    body.push(encodedKey + "=" + encodedValue);
                }
                body=body.join('&');
                
                let data=await fetch("https://sh-r.herokuapp.com/register",{
                    method:"POST",
                    body:body,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                })
                data=await data.json();
                this.setState({message:data.message,spinner:false});
                
            }
            
        }
        catch(err)
        {
            this.setState({message:err.message,spinner:false});
            
        }
    }
    
    render()
    {
        return (
            window.localStorage.access_token
            ?
            <Redirect to="/"></Redirect>
            :
            <Col xs="12">
                <Row className="justify-content-center">
                <Col md="5" xs="12">
                    <Form onSubmit={this.register} className="text-center">
                    <Col xs="12" className="header text-center mb-3">
                    <h5 className="heading">Register your E-Mail</h5>
                    </Col>
                    <Col xs="12" className="box box-shadow ">
                        Enter Your E-Mail to sign up..
                        <Form.Control ref={this.email} type="email" required={true} placeholder="Enter your email to register.." className="mb-3 input" />
                        <button type="submit" className="buton mb-2">Submit</button>
                    </Col>
                    </Form>
                </Col>  
                <Modal show={this.state.toast} onHide={this.toggleToast} backdrop="static">
                        {this.state.spinner ? <Modal.Header>Please Wait..<Spinner animation="border" /> </Modal.Header >: <Modal.Header closeButton>{this.state.message}</Modal.Header> }
                </Modal> 
                </Row>
                
            </Col>
            
        )
    }
}