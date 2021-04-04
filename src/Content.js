import React from "react";
import {Row,Col,Form,Modal,Spinner,Button} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Context from "./Context.js";

export default class Content extends React.Component{
    full=React.createRef();
    static contextType=React.createContext(Context)
    constructor(props)
    {
        super(props);
        this.state={
            message:"",
            modal:false,
            spinner:false,
            data:null,
            offset:0,
            prev:false,
            next:false
        }
    }

    getAll=async(offset)=>{
        this.setState({data:null})
        try{
           
            let access_token=window.localStorage.access_token;
            let data=await fetch('https://sh-r.herokuapp.com/getallurl/'+offset,{
                method:"POST",
                mode:"cors",
                headers:{
                    'authorization':access_token,
                }
            })
            data=await data.json();
            this.setState({data:data.data,prev:data.prev,next:data.next});
            
            
        }
        catch(err)
        {
            console.log(err);
            
        }

    }
    next=()=>{
        
        this.getAll(this.state.offset+5).then(()=>{
            this.setState({offset:this.state.offset+5});
        })
        .catch((err)=>{
            console.log(err);
           
        })
    }
    prev=()=>{
        this.getAll(this.state.offset-5).then(()=>{
            this.setState({offset:this.state.offset-5});
        })
        .catch((err)=>{
            console.log(err);
            
        })
    }
    componentDidMount(){
        if(window.localStorage.access_token && !this.state.data)
        {
            this.getAll(this.state.offset);
        }
    }
    generate=async(event)=>{
        event.preventDefault();
        this.setState({spinner:true,modal:true})
        try{
            let access_token=window.localStorage.access_token;
            let full=this.full.current.value;
            let details={
                full:full
            }
            let body=[];
            for(let key in details)
            {
                let ek=encodeURIComponent(key);
                let ep=encodeURIComponent(details[key]);
                body.push(ek+"="+ep);
            }
            body=body.join('&');
            let data=await fetch('https://sh-r.herokuapp.com/generate',{
                method:'POST',
                mode:"cors",
                body:body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'authorization':access_token
                }
            });
            data=await data.json();
            (data.new_url)?this.setState({message:data.new_url,spinner:false}):this.setState({message:data.message,spinner:false})

        }
        catch(err)
        {
            console.log(err);
            
        }
    }
    reload=()=>{
        this.setState({modal:false});
        window.location.reload();

    }

    render()
    {
        return (
            window.localStorage.access_token
            ?

            <Col xs="12">
                <Row  className="p-3 justify-content-between">
                
                <Col xs="12" md="5" className="text-center mb-3">
                    
                    <Form onSubmit={this.generate}>
                        <Col xs="12" className="mb-3 header">
                        <h4 className="heading">Generate New Url</h4>
                        </Col>
                        <Col xs="12" className="mb-3 box box-shadow ">
                        Enter URL you want to shorten..
                        <Form.Control type="url" required={true} placeholder="Enter the full url.." className="mb-3 input" ref={this.full}/>
                        <button type="submit" className="buton header mb-2">Submit</button>
                        </Col>
                        
                    </Form>
                </Col>
                <Col xs="12" md="6" className="text-center">
                    <Col xs="12" className="mb-3 header">
                    <h4 className="heading">Dashboard</h4>
                    </Col>
                    {
                            this.state.data ?
                                this.state.data.length>0?
                                        <>
                                    
                                        
                                        
                                        <Col xs="12" className="box box-shadow mb-3">
                                        
                                        {
                                            this.state.data.map((data)=>{
                                                return (
                                                    <Row key={data._id} className="header m-0 mb-2 ">
                                                        <Col xs="12" className=" text-align-left mb-2"><Row><Col xs="4" className="heading ">Original Url: </Col><Col xs="8" className="justify-text"><a href={data.full} className="text p-2 ">{data.full}</a></Col></Row></Col>
                                                        <Col xs="12" className=" text-align-left mb-2"><Row><Col xs="4" className="heading ">Short Url: </Col><Col xs="8"><a href={data.short} className="text p-2 justify-text">{data.short}</a></Col></Row></Col>
                                                        <Col xs="12" className=" text-align-left mb-2"><Row><Col xs="4" className="heading">Hits: </Col><Col xs="8">{data.hits}</Col></Row></Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                        </Col>
                                        <Row className="mb-3 justify-content-between">
                                    <Col xs="6" className="text-align-left">
                                            <Button onClick={this.prev} className="header p-2" hidden={!this.state.prev}>
                                                Prev
                                            </Button>
                                        </Col>
                                        <Col xs="6" className="text-align-right">
                                            <Button onClick={this.next} className="header p-2" hidden={!this.state.next}>
                                                Next
                                            </Button>
                                        </Col>
                                    </Row>
                                    </>
                                    :
                                    <Col xs="12" className="box box-shadow ">
                                        <h4>No URLS yet</h4>
                                    </Col>
                            :
                            <Col xs="12" className="box box-shadow">
                                <Col xs="12">
                                    Loading URLs
                                </Col>
                                <Col xs="12">
                                    <Spinner animation="border"></Spinner>
                                </Col>
                                
                            </Col>
                        }
                   
                </Col>
                </Row>
                <Modal show={this.state.modal} onHide={()=>{
                    this.setState({modal:false})
                }} backdrop="static">
                    {
                        this.state.spinner
                        ?
                        <Modal.Header>Please Wait..<Spinner animation="border" /></ Modal.Header>
                        :
                        <Modal.Header>{this.state.message}<button onClick={this.reload} className="btn btn-info">Close</button></Modal.Header>
                    }
                </Modal>
            </Col>
            :
            <Redirect to="/register"></Redirect>
        )
    }
}