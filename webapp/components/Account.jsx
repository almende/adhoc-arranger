var Account = React.createClass({
  getInitialState: function () {
    return {
      user: 'user1'
    }
  },

  render: function () {
    if (this.props.user) {
      return <div className="account">
          You are logged in as <b>{this.props.user}</b> &nbsp;
          <a href="#/">[log out]</a>
        </div>
    }
    else {
      return <div className="account">
        <form id="login" onSubmit={this.login}>
          Log in: &nbsp;
          <input ref="name" value={this.state.user} placeholder="username" onChange={this.handleUser} /> &nbsp;
          <input type="submit" value="Log in"/>
        </form>
      </div>
    }
  },

  handleUser: function () {
    var user = React.findDOMNode(this.refs.name).value;

    this.setState({user: user});

    if (this.props.onChange) {
      this.props.onChange(user);
    }
  },

  login: function (event) {
    event.preventDefault();

    var user = React.findDOMNode(this.refs.name).value;

    location.hash = '#/user/' + encodeURIComponent(user);
  },

  logout: function (event) {
    event.preventDefault();

    location.hash = '#/';
  }

});
