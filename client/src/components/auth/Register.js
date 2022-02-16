import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { addWhitelistAction, modifyWhitelistAction } from "../../actions/authActions";

import './Signup.css';
import './style.css';
import { Space, Checkbox, Steps, Button, message, Descriptions, Badge, Input, Form, Spin, Alert } from 'antd';
import OtpInput from 'react-otp-input';

var mandrill = require('node-mandrill')('OV5uzpu-dDoYmK4UYojIJg');

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
      email: "",
      wallet: "",
      otp: '',
      strCode: "213578",
      orderID:123456,
      errors: {}
    };
  }

  componentDidMount() {
    
    // If logged in and user navigates to Register page, should redirect them to dashboard
    // this.createIPFSPage();
    // this.props.createIPFSAction();
    // if (this.props.auth.isAuthenticated) {
    //    this.props.history.push("/dashboard");
    // }
  }

  componentWillReceiveProps(nextProps) {    
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    console.log(nextProps);
    if (nextProps.auth.status == "add whitelist" && nextProps.auth.success) {
       message.success("Added!");
       this.next();
       return;
    }

    if (nextProps.auth.status == "add whitelist" && !nextProps.auth.success) {
      message.warning("already exists the same wallet");
      return;
    }
  }

  handleOtpChange = (otp) => {
      this.setState({ otp });
      console.log(otp.length);
      if (otp.length == 6) {
          if (otp == this.state.strCode) {
            message.success("confirmed successfully!");
            this.props.modifyWhitelistAction({wallet: this.state.wallet, otp: otp});            
          } else {
            message.error("confirmed failed!");
            return;
          }
      }
  } 

  generateOTPCode = () => {
      this.setState({
         strCode: "213578"
      });
  }
  
  setCurrent = (index) => {
    this.setState({current: index});
  }

  next = () => {
    mandrill('/messages/send', {
      message: {
          to: [{email: this.state.email, name: 'Email Verification'}],
          from_email: this.state.email,
          subject: "Mandrill Verification Team",
          text: this.state.strCode
      }
      }, function(error, response)
      {
      console.log(response);
        //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );

        //everything's good, lets see what mandrill said
        else console.log(response);
    });
    this.setCurrent(this.state.current + 1);
};

prev = () => {
  this.setCurrent(this.state.current - 1);
};

  render() {
    const { strCode, email, errors, current, price, tempDomainName, verifyResult, uniqueIndex, passwordSaved, loading, registerloading, orderID } = this.state;
    
    const onAddingFinish = (values: any) => {
      console.log('Success:', values);
      this.setState({email: values.email, wallet: values.wallet});      
      this.props.addWhitelistAction({wallet: values.wallet, email: values.email});
    };
  
    const onAddingFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    const storeEntry = () => {
        return(
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onAddingFinish}
            onFinishFailed={onAddingFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Wallet Address"
              name="wallet"
              rules={[{ required: true, message: 'Please input your wallet address!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email address!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        );
    }

    const onOTPFinish = (value) => {
      console.log(value.Code);
      if (value.Code == strCode) {
         message.success("Confirmed successfully");
         this.next();
      } else {
         message.error("OTP code wrong!");
      }
    };
  
    const onOTPFinishFailed = () => {
      message.error('Submit failed!');
    };

    const optVerify = () => {
        return(
          <div className="otp-verify">
            <OtpInput
              value={this.state.otp}
              onChange={this.handleOtpChange}
              numInputs={6}
              separator={<span>-</span>}
            />
          </div>          
        );
    }

    const saveWhitelist = () => {
      return(
        <div>
          Thank you
        </div>
      );
    }

    const steps = [
      {
        title: 'Store Entry',
        content: storeEntry(),
      },
      {
        title: 'OPT Code verification',
        content: optVerify(),
      },
      {
        title: 'Final',
        content: saveWhitelist(),
      }
    ];

    

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
                <Button type="primary" onClick={() => this.next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={this.doRegister}>
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
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
  addWhitelistAction: PropTypes.func.isRequired, 
  modifyWhitelistAction: PropTypes.func.isRequired, 
  auth: PropTypes.object.isRequired,  
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,  
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addWhitelistAction, modifyWhitelistAction }
)(withRouter(Register));
