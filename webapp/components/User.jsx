var User = React.createClass({
  render: function () {
    return <div>
      <Account params={this.props.params} />
      <h2>My state</h2>
      <div>name: {this.props.params.user}</div>
    </div>
  }
});
