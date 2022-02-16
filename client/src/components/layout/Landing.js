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
              <b>Gather</b> Interests via collecting whitelist{" "}
              <span style={{ fontFamily: "monospace" }}>Whitelist</span>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Add to your whitelist
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
                Add Now
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Others
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
