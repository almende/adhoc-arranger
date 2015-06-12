var Login = React.createClass({

  render: function () {
    return <div>
      <Account user={this.props.params.user} />
    </div>
  }
});
