import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EtherumQRCode from './EthereumQRCode';
import $ from "jquery";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { create } from 'ipfs-http-client';
import { registerUser, verifyUniqueAction, insertOwnerLoginAction, createIPFSAction, insertOwnerDomainAction } from "../../actions/authActions";
import classnames from "classnames";
import {useState, useEffect} from 'react';
import QRcode from 'qrcode.react';
// import Order from './Order.js';
// import Checkout from './Checkout.js';
import './Signup.css';

import { Steps, Button, message, Descriptions, Badge, Input, Form, Spin, Alert } from 'antd';
import { verify } from "jsonwebtoken";

var BigNumber = require('big-number');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('7f7707b84eee87b7ac79', 'd442b22760a00cc32377624db6028a59f58079c8e511378e715f4e9576cba95e');
const fs = require('fs');
var qrCanvas = '';
var pngUrl = '';
// const IPFS= require('ipfs-api');
/* Create an instance of the client */

const { Step } = Steps;

class Register extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      registerloading: false,
      current: 0,
      name: "",
      email: "",
      password: "",
      password2: "",
      verifyResult : "",
      tempDomainName: "",
      price : 0,
      uniqueIndex : 0,
      passwordSaved: false,
      qrCodeDestination: '',
      downloadQRCode: false,
      wallet: "0xaEAD721Ec86dD4a0E9c41d4d41A856327B725b66",
      ipfshash: "",
      recoveryPhase : "foam pumpkin road educate valley gain unique guess nurse small doctor return",
      orderID:123456,
      errors: {}
    };
  }

  componentDidMount() {
    this.generateOrderID();
    // If logged in and user navigates to Register page, should redirect them to dashboard
    // this.createIPFSPage();
    // this.props.createIPFSAction();
    // if (this.props.auth.isAuthenticated) {
    //    this.props.history.push("/dashboard");
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.success && nextProps.auth.status == "Create IPFS Page") {
       this.setState({
          ipfshash : nextProps.auth.ipfsHash
       });
       const domainParam = {
        wallet: this.state.wallet,
        domain: this.state.tempDomainName,
        price: this.state.price,
        ipfshash: nextProps.auth.ipfsHash
       } 
       this.props.insertOwnerDomainAction(domainParam);
       return;
    }
    if (nextProps.auth.success && nextProps.auth.status == "Domain Register"){
        this.setState({registerloading: false});
        message.success("Register Success!");
        this.props.history.push("/dashboard");
        return;
    } 
    if (nextProps.auth.status == "Verify Domain Unique" && nextProps.auth.success == true){
        this.setState({loading: false});
        if (nextProps.auth.isUniqueDomain) {
           this.setState({
              uniqueIndex : 1,
              verifyResult: "Your domain is unique. You can use this domain!",         
           });
           return;
        } else {
           this.setState({
              uniqueIndex: 0,
              verifyResult: "This domain name already exists. Please input another domain name!"
           });
           return;
        }
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }


  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  //======================= Register Steps =-============================================
  onDomainInputChange = (e) => {
      this.setState({tempDomainName: e.target.value});
  }

  verifyUnique = () => {
      const domainInfo = {
         domain: this.state.tempDomainName
      };
      switch(this.state.tempDomainName.length){
        case 1:                
            this.setState({ price: 10000000000 });
            break;
        case 2:
            this.setState({ price: 100000000 });
            break;
        case 3:                
            this.setState({ price: 1000000 });
            break;
        case 4:                 
            this.setState({ price: 10000 });
            break;
        case 5:
            this.setState({ price: 100 });          
            break;
        default:
            this.setState({ price: 1 });                
            break;
      }
      this.setState({loading: true});
      this.props.verifyUniqueAction(domainInfo);
  }

  onSubmit = e => {
      e.preventDefault();

      const newUser = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          password2: this.state.password2
      };

      this.props.registerUser(newUser, this.props.history);
  };

  onSetPasswordFinished = (values) => {      
      if (values.password != values.confirm){
         message.error("Confirm password doesn't match!");
         return;
      }

      this.setState({
          password: values.password,
          passwordSaved: true
      })

      message.success("Saved Password!");
      
  }  

  doRegister = async () => {      
      this.setState({registerloading: true});
      qrCanvas = document.getElementById("qr-gen");
      // pngUrl = qrCanvas
      //   .toDataURL("image/png")
      //   .replace("image/png", "image/octet-stream");
      console.log(qrCanvas);
      return;
      const param = {
          wallet: this.state.wallet,
          password: this.state.password,
          recovery: this.state.recoveryPhase
      };
      const ipfsParam = {
          domain: this.state.tempDomainName,
          price: this.state.price,
          qrcode: 'pngUrl',
          created: Date.now(),
          updated: Date.now()
      }
      
      this.props.insertOwnerLoginAction(param);
      await this.props.createIPFSAction(ipfsParam);
           
  }

  generateOrderID = () => {
    let h = Math.floor(100000 + Math.random() * 900000);
    console.log(h);
    this.setState({orderID: h});
 }

  render() {
    const { errors, current, price, tempDomainName, verifyResult, uniqueIndex, passwordSaved, loading, registerloading, orderID } = this.state;
    
    const domainVerify = () => {
        return(<Spin tip="Loading..." spinning = {loading}>
          <div className = "domain-register-box domain-verify-description">
              <Input className="register-domain-input" onChange = {this.onDomainInputChange}/>
              <Button type = "primary" onClick = {this.verifyUnique}>Verify Unique</Button>
              <div>
                  <Descriptions title = {tempDomainName} layout="vertical" bordered>
                      <Descriptions.Item label="Unique Verification" span={3}>                            
                          <Badge status= {uniqueIndex == 1? "success" : "error"} text={verifyResult} />
                      </Descriptions.Item>
                      <Descriptions.Item label="Generate Price">{price}JIN( {price * 6}$ ), {tempDomainName}</Descriptions.Item>
                  </Descriptions>
              </div>
          </div>
          </Spin>
        );
    }

    const Order = () => {
        const [products, setProducts] = useState();
        const [qrcode, setQrcode] = useState(false);
        useEffect(() => {
            const fetchProducts = async () => {
                const productsData = await fetch('/get-products').then(res => res.json());
                setProducts(productsData.data);
            }
            fetchProducts();
        }, []);
    
        const ProductsDisplay = () => {
            const handleClick = () => {
                setQrcode(true);
            }
            return( products?
                (<div className = "order">
                    {
                        products.map(product  => {
                            return(
                                <div className = "product" key = {product.id}>
                                    <h2>{product.name}</h2>
                                </div>
                            );                        
                        })
                    }
                    <button onClick = {handleClick}>Order with QR code</button>
                </div>) : <p className="loading-msg">Loading...</p>
            );
        }
        
        

        const QrcodeDisplay = () => {
            const qrCodeDestination = `${window.location.origin}/checkout`;
            console.log(window.location.origin);            
            const downloadQRCode = () => {
              // Generate download with use canvas and stream
              qrCanvas = document.getElementById("qr-gen");
              pngUrl = qrCanvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
              let downloadLink = document.createElement("a");
              downloadLink.href = pngUrl;
              downloadLink.download = `${qrCodeDestination}.png`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
          };
            return (<div>
                        <QRcode 
                            id = "qr-gen1"
                            value = {qrCodeDestination}
                            size = {350}
                            includeMargin = {true}
                        />
                        <p>
                          Click for{" "}
                          <button type="button" onClick={downloadQRCode}>
                              Download QR Code
                          </button>
                        </p>                   
                    </div>
            );
        }
        return <QrcodeDisplay />
    }

    const paymentSuccess = () => {
        console.log("Payment Success");
        setCurrent(current + 1);
    }

    const doPayment = () => {
        var p = new BigNumber(price).multiply(10000000).plus(orderID).multiply(100000000000);
        console.log(EtherumQRCode.value)
        return(
           <div className = "domain-register-box">
              <EtherumQRCode ref = {node => this.refs.myCanvas = node } id = "qr-gen" value={p} gas={1300} to={"0xaEAD721Ec86dD4a0E9c41d4d41A856327B725b66"} paymentSuccess = {paymentSuccess}/>               
           </div>
        );
    }

    

    const setPassword = () => {
        return(<Spin tip="Saving..." spinning = {false}>
          <div className = "domain-register-box">
              <Form
                  name="basic"
                  labelCol={{
                      span: 8,
                  }}
                  wrapperCol={{
                      span: 16,
                  }}
                  initialValues={{
                      remember: true,
                  }}
                  onFinish={this.onSetPasswordFinished}
                  onFinishFailed={this.onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                      {
                          required: true,
                          message: 'Please input your password!',
                      },
                      ]}
                  >
                      <Input />
                  </Form.Item>
  
                  <Form.Item
                      label="Conform Password"
                      name="confirm"
                      rules={[
                      {
                          required: true,
                          message: 'Please input your confirm password!',
                      },
                      ]}
                  >
                      <Input.Password />
                  </Form.Item>
                  <Form.Item
                      wrapperCol={{
                      offset: 8,
                      span: 16,
                      }}
                  >
                      <Button type="primary" htmlType="submit">
                      Save Password
                      </Button>
                  </Form.Item>
              </Form>
          </div></Spin>
        );
    }

    const secretRecovery = () => {
        return(
          <div className = "domain-register-box">
              <div>
                  <p>Your Secret Recovery Phrase makes it easy to back up and restore your account.</p>
                  <p>WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.</p>
              </div>
              <div className="domain-phase-box">
                  <p>foam pumpkin road educate valley gain unique guess nurse small doctor return</p>
              </div>
          </div>
        );
    }

    const steps = [
      {
        title: 'Domain Verify',
        content: domainVerify(),
      },
      {
        title: 'Payment',
        content: doPayment(),
      },
      {
        title: 'Set Password',
        content: setPassword(),
      },
      {
        title: 'Secret Recovery Phrase',
        content: secretRecovery(),
      },
    ];

    const setCurrent = (index) => {
         this.setState({current: index});
    }

    const next = () => {
      if (current == 0 && uniqueIndex == 0) {
          message.error("Please input the valid domain");
          return;
      }
      // if (current == 1 && pngUrl == ''){
      //     message.error("Please do the payment first!");
      //     return;
      // }
      if (current == 1) {
          // qrCanvas = document.getElementById("qr-gen");
          
          // console.log(this.refs.myCanvas);
      }
      if (current == 2 && !passwordSaved){
          message.error("Please save your password firstly!");
          return;
      }
      setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return (<Spin tip = "Registering Domain/Creating IPFS Page..." spinning = {registerloading}>
      <div className="domain-register-container">
        <div className = "row">
            <Link to="/" className="btn-flat waves-effect">
                  <i className="material-icons left">keyboard_backspace</i> Back to
                  home
            </Link>
        </div>
        <div className="row">
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="register-steps-content">{steps[current].content}</div>
            <div className="register-steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={this.doRegister}>
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
            </div>    
        </div>
      </div></Spin>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  verifyUniqueAction: PropTypes.func.isRequired,
  createIPFSAction: PropTypes.func.isRequired,
  insertOwnerLoginAction: PropTypes.func.isRequired,
  insertOwnerDomainAction: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser, verifyUniqueAction, insertOwnerLoginAction, createIPFSAction, insertOwnerDomainAction }
)(withRouter(Register));
