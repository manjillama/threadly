import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from 'actions';
import './Header.css';
import { withRouter } from 'react-router-dom';
import { openModal } from 'actions/loginModal';
import Notification from './Notification';

class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      showUserDropdown: false,
      showNotication: false
    };
  }

  triggerSignInModal(){
    this.props.openModal();
  }

  toggleUserDropdown = () => {
    this.setState({showUserDropdown: !this.state.showUserDropdown});
  }

  hideUserDropDown = () => {
    this.setState({showUserDropdown: false});
  }

  toggleNotificationBar = () => {
    this.setState({showNotication: !this.state.showNotication});
  }

  hideNotificationBar = () => {
    this.setState({showNotication: false});
  }

  signOut = () => {
    this.setState({showUserDropdown: false});
    this.props.signOut(() => {
      this.props.history.push('/');
    });
  }

  _renderUserImage(){
    if(this.props.auth.user.profile_image){
      return <img src={this.props.auth.user.profile_image} className="user--img" alt={this.props.auth.user.fullname}/>
    }else{
      const initial = this.props.auth.user.fullname.charAt(0);
      return <div className="user--img"><span>{initial}</span></div>;
    }
  }

  renderLinks(){
    if(this.props.auth){
      return (
        <div className="inline-continue">
          <li>
            <button id="popNotificationPanel" style={{position:'relative'}} className="btn-chromeless" onClick={this.toggleNotificationBar}>
              <span className="svgIcon">
                <svg className="svgIcon-use" width="25" height="25" viewBox="-293 409 25 25">
                  <path d="M-273.327 423.67l-1.673-1.52v-3.646a5.5 5.5 0 0 0-6.04-5.474c-2.86.273-4.96 2.838-4.96 5.71v3.41l-1.68 1.553c-.204.19-.32.456-.32.734V427a1 1 0 0 0 1 1h3.49a3.079 3.079 0 0 0 3.01 2.45 3.08 3.08 0 0 0 3.01-2.45h3.49a1 1 0 0 0 1-1v-2.59c0-.28-.12-.55-.327-.74zm-7.173 5.63c-.842 0-1.55-.546-1.812-1.3h3.624a1.92 1.92 0 0 1-1.812 1.3zm6.35-2.45h-12.7v-2.347l1.63-1.51c.236-.216.37-.522.37-.843v-3.41c0-2.35 1.72-4.356 3.92-4.565a4.353 4.353 0 0 1 4.78 4.33v3.645c0 .324.137.633.376.85l1.624 1.477v2.373z"></path>
                </svg>
              </span>
              {this.state.showNotication &&
                <Notification
                  hideNotificationbar={this.hideNotificationBar}
                  />
              }

            </button>
          </li>
          <li className="popover-p-wrap">
            <div id="popUserPanel" style={{position:'relative'}} className="popover-userIcon" onClick={this.toggleUserDropdown}>
              {this._renderUserImage()}
              {this.state.showUserDropdown &&
                <UserProfileDropDown
                  user={this.props.auth.user}
                  signOut={this.signOut} hideUserDropDown={this.hideUserDropDown}/>}
            </div>
          </li>
        </div>
      );
    }else{
      return (
        <li><button className="btn--p-hollow mjl-btn" onClick={this.triggerSignInModal.bind(this)}>Get Started</button></li>
      );
    }
  }

  render(){
    return (
      <div>
        <div className="nav-top-bar">
          <nav className="mjl-container">
            <div className="tb-flex1">
              <Link to="/" id="ThLogo">
                <img src="/static/images/threadly-logo.png" className="logo-l" height="25px" alt="Threadly Logo"/>
                <img src="/static/images/t-logo-min.png" className="logo-x" height="25px" alt="Threadly Logo"/>
              </Link>
            </div>
            <div className="tb-flex0">
              <ul className="list-inline th-nav-main">
                <li>
                  <Link to="/search">
                    <svg className="svgIcon" width="25" height="25">
                      <path d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z">
                      </path>
                    </svg>
                  </Link>
                </li>
                {this.renderLinks()}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {auth: state.auth.authenticated};
}

export default withRouter(connect(mapStateToProps, {openModal, signOut})(Header));


class UserProfileDropDown extends Component{

  componentDidMount(){
    document.addEventListener('click', this.handleBlur, true);
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.handleBlur, true);
  }

  handleBlur = (e) => {
    let node = document.getElementById('pUserActionPanel');
    let userBtn = document.getElementById('popUserPanel');
    let links = node.getElementsByTagName("ul");
    if(node){
      // If user clicks outside the dropdown menu
      if(!node.contains(e.target) && !userBtn.contains(e.target)){
        this.props.hideUserDropDown();
      }else{
        /*
        * If links are clicked
        * setTimeout is so that dropdown gets unvisible only after link is clicked
        */
        if(links[0].contains(e.target)){
          setTimeout(()=>{
            this.props.hideUserDropDown();
          }, 100);
        }
      }
    }
  }

  render(){
    return (
      <div className="popover-userAction usr-drd" id="pUserActionPanel">
        <ul>
          <li><Link to="/new-story">New Story</Link></li>
          <li><Link to="/me/stories/drafts">Stories</Link></li>
          <li><Link to={`/@${this.props.user.username}`}>Profile</Link></li>
          <li><Link to="/me/settings">Settings</Link></li>
          <li style={{cursor: 'pointer'}} onClick={this.props.signOut}>Sign Out</li>
        </ul>
      </div>
    );
  }
}
