import React, { Component } from "react";
import { Link } from "react-router-dom";
import img1 from "../../assets/img/domain1.png";
import "./Landing.css";

class Landing extends Component {
  render() {
    return (<div className = "slider-domain">
          
      <div style={{ height: "100vh" , background: img1 }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Build</b> a login/auth app with the{" "}
              <span style={{ fontFamily: "monospace" }}>0x21</span> domain 
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Buy and Manage your 0x21 domains
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Landing;
