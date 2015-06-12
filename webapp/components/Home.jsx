var Home = React.createClass({
  getInitialState: function () {
    return {}
  },

  LOCATIONS: {
    'Almende': {latitude: 51.908817, longitude: 4.479589},
    'Rotterdam CS': {latitude: 51.925093, longitude: 4.469424}
  },

  render: function () {
    var contents;

    if (this.props.params.user) {
      contents = <div>
        {this.renderState()}
        {this.renderSimulate()}
      </div>;
    }

    return <div>
      <Account user={this.props.params.user} />
      {contents}
    </div>
  },

  renderState: function () {
    var location = this.formatLocation(this.state.location);
    var driving = this.yesNoUnknown(this.state.driving);
    var onThePhone = this.yesNoUnknown(this.state.onThePhone);

    return <div>
      <h2>Me</h2>
      <p>The table below shows your current state:</p>
      <table>
        <tbody>
        <tr>
          <th>Name</th>
          <td>{this.props.params.user}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>{location}</td>
        </tr>
        <tr>
          <th>Driving</th>
          <td>{driving}</td>
        </tr>
        <tr>
          <th>On the phone</th>
          <td>{onThePhone}</td>
        </tr>
        </tbody>
      </table>
    </div>
  },

  renderNotify: function () {
    return <div>
      <h2>Notify me</h2>
      <p>
        Notify me when user <input ref="publisher" value="user2" /> arrives at my location.
        <input type="button" value="Register" />
      </p>
    </div>
  },

  renderSimulate: function () {
    return <div>
      <h2>Simulate</h2>
      <p>
        Simulate your own state for testing purposes:
      </p>

      <table>
        <tbody>
        <tr>
          <th>Location</th>
          <td>
            <button onClick={this.saveState.bind(this, {location: this.LOCATIONS['Almende']})}>Almende</button>
            <button onClick={this.saveState.bind(this, {location: this.LOCATIONS['Rotterdam CS']})}>Rotterdam CS</button>
          </td>
        </tr>
        <tr>
          <th>Driving</th>
          <td>
            <button onClick={this.saveState.bind(this, {driving: true})}>yes</button>
            <button onClick={this.saveState.bind(this, {driving: false})}>no</button>
          </td>
        </tr>
        <tr>
          <th>On the phone</th>
          <td>
            <button onClick={this.saveState.bind(this, {onThePhone: true})}>yes</button>
            <button onClick={this.saveState.bind(this, {onThePhone: false})}>no</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  },

  componentDidMount: function () {
    this.loadState();
  },

  // TODO: regularly read the current state of the user from the server
  loadState: function () {
    $.ajax({
      url: '/api/v1/state/' + this.props.params.user,
      dataType: 'json',
      type: 'GET',
      success: function (state) {
        this.setState(state);
      }.bind(this),
      error: function (err) {
        console.error('Error', err);
      }.bind(this)
    })  },

  saveState: function (state) {
    $.ajax({
      url: '/api/v1/state/' + this.props.params.user,
      dataType: 'json',
      data: JSON.stringify(state),
      contentType: 'application/json; charset=utf-8',
      type: 'PUT',
      success: function (state) {
        this.setState(state);
      }.bind(this),
      error: function (err) {
        console.error('Error', err);
      }.bind(this)
    })
  },

  formatLocation: function (location) {
    if (!location) {
      return 'unknown';
    }

    var name = this.findLocation(location);
    var latlon = `lat: ${location.latitude}, long: ${location.longitude}`;
    return name ? `${name} (${latlon})` : latlon;
  },

  findLocation: function (location) {
    for (var name in this.LOCATIONS) {
      var l = this.LOCATIONS[name];
      if (location.latitude === l.latitude && location.longitude === l.longitude) {
        return name;
      }
    }

    return null;
  },

  yesNoUnknown: function (value) {
    return value === true ? 'yes' : value === false ? 'no' : 'unknown';
  }
});
