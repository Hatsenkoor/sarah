import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Row, Col} from "antd";
import './Navbar.css';

class Navbar extends Component 
{
  onLogoutClick = e => {
      e.preventDefault();
      this.props.logoutUser();
  };


  render() {
      const { user } = this.props.auth;
      const userLinks = (
          <ul className="navbar-nav ml-auto">
              <li className="nav-item mr-2 mt-2">
                  Your Wallet Address is <b>{user.wallet}</b>
              </li>
              <li className="nav-item">
                  <a className="btn btn-outline-primary" onClick={this.props.logoutUser}>Logout</a>
              </li>
          </ul>
      );
      const guestLinks = (
          <ul className="navbar-nav ml-auto">
              <li className="nav-item mr-2">
                  <Link to="/login" className="btn btn-outline-primary">Login</Link>
              </li>
              <li className="nav-item">
                  <Link to="/register" className="btn btn-primary">Register</Link>
              </li>
          </ul>
      );
      return (
        // <div className="navbar-fixed">
        //   <nav className="z-depth-0">
        //     <div className="nav-wrapper white">
        //       <Link
        //         to="/"
        //         style={{
        //           fontFamily: "monospace"
        //         }}
        //         className="col s5 brand-logo center black-text"
        //       >
        //         <i className="material-icons">code</i>
        //         0x21 Domain
        //       </Link>
        //     </div>
        //   </nav>
        // </div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light domainnav">            
            <Link to='/dashboard'><h1 className="navbar-brand domainlogo"><b>0X21 Domain Site</b></h1></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#myNavBar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="myNavBar">
                {this.props.auth.isAuthenticated ? userLinks : guestLinks}
            </div>
        </nav>      
      );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);

