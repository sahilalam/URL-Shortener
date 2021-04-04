import React from "react";
import {Row,Col,Form,Modal,Spinner} from "react-bootstrap";

export default class RegisterUser extends React.Component{
    username=React.createRef();
    password=React.createRef();
    confirm_password=React.createRef();


    constructor(props)
    {
        super(props);
        this.state={
            toast:false,
            spinner:false,
            password_confirmed:false,
            password_entered:false,
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

        let email=this.props.match.params.encrypted;
        let username=this.username.current.value;
        let password=this.password.current.value;
        let details={
            username,password
        }
        let body=[];
        for(let property in details)
        {
            let ek=encodeURIComponent(property);
            let ep=encodeURIComponent(details[property]);
            body.push(ek+"="+ep);
        }
        body=body.join('&');
        try{
            let data=await fetch(`https://sh-r.herokuapp.com/register/${email}`,{
            method:"POST",
            body:body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
            
        });
        data=await data.json();
        this.setState({message:data.message+"Please Login to continue..",spinner:false});
        }
        catch(err)
        {
            this.setState({message:err.message,spinner:false});
        }

    }


    passwordStatus=()=>{
        this.confirm_password.current.value="";
        (this.password.current.value.length)?this.setState({password_entered:true,password_confirmed:false}):this.setState({password_entered:false,password_confirmed:false});

    }


    confirmPassword=()=>{
        (this.password.current.value===this.confirm_password.current.value)?this.setState({password_confirmed:true}):this.setState({password_confirmed:false});
    }


    render()
    {
        return (
            <Col xs="12">
                <Row className="justify-content-center">
                    <Col md="5" xs="12">
                        <Form onSubmit={this.register} className=" text-center">
                            <Col xs="12" className="header mb-3">
                            <h5 className="heading">!!E-Mail verified!!</h5>
                            </Col>
                            <Col  xs="12" className="box box-shadow mb-3">
                                Enter new username..
                                <Form.Control ref={this.username} type="text" placeholder="Enter username.." required={true} className="mb-3 input" />
                                Enter new password..
                                <Form.Control ref={this.password} type="password" placeholder="Enter Password.." required={true} className="mb-3 input" onChange={this.passwordStatus} />
                                Confirm your password..
                                <Form.Control ref={this.confirm_password} type="password" placeholder="Confirm Password.." required={true} className="mb-3 input" onChange={this.confirmPassword} disabled={!this.state.password_entered}/>
                                <button type="submit" className="buton mb-2" hidden={!this.state.password_confirmed}>Submit</button>
                            </Col>
                            
                            
                            
                        </Form>
                    </Col>
                </Row>
                <Modal show={this.state.toast} onHide={this.toggleToast} backdrop="static" className="text text-dark">
                        {this.state.spinner ? <Modal.Header>Please Wait..<Spinner animation="border" /> </Modal.Header >: <Modal.Header closeButton>{this.state.message}</Modal.Header> }
                </Modal> 
                
            </Col>
        )
    }
}