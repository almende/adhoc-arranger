var Home = React.createClass({
  getInitialState: function () {
    return {
      subscriptions: [],
      publisher: 'user2'
    }
  },

  LOCATIONS: {
    'Almende': {latitude: 51.908817, longitude: 4.479589},
    'Ask CS': {latitude: 51.920505, longitude: 4.454438},
    'Sense OS': {latitude: 51.903598, longitude: 4.45994},
    'Rotterdam CS': {latitude: 51.916563, longitude: 4.481416}
  },

  render: function () {
    var contents;

    if (this.props.params.user) {
      contents = <div>
        {this.renderState()}
        <h2>Notify me</h2>
        <p>
          Notify me when a user I subscribed for arrives at my location.
        </p>
        <p>
          <i>To be implemented...</i>
        </p>
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
      <p>The table below shows your current state.</p>
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

  renderSubscribe: function () {
    return <div>
      <h2>Notify me</h2>
      <p>
        Notify me when:
      </p>
      <div className="form">
        <p>
          User <input ref="publisher" value={this.state.publisher} onChange={this.handlePublisher} /> arrives at my location. <input type="button" value="Subscribe" onClick={this.subscribe} />
        </p>
      </div>

      {this.renderSubscriptions()}
    </div>
  },

  renderSubscriptions: function () {
    var subscriptions = this.state.subscriptions.map(function (subscription) {
      return <div key={subscription.publisher}>
        {subscription.publisher}
      </div>
    });

    return <div>
          <h3>Subscriptions</h3>
          {subscriptions.length > 0 ? subscriptions : '(none)'}
        </div>
  },

  renderSimulate: function () {
    return <div>
      <h2>Simulate</h2>
      <p>
        Simulate your own state for testing purposes.
      </p>

      <table>
        <tbody>
        <tr>
          <th>Location</th>
          <td>
            {
                Object.keys(this.LOCATIONS).map(function (location) {
                  return <button key={location} onClick={this.saveState.bind(this, {location: this.LOCATIONS[location]})}>{location}</button>
                }.bind(this))
            }
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
    this.loadSubscriptions();
  },

  handlePublisher: function (event) {
    this.setState({publisher: event.target.value});
  },

  subscribe: function () {
    this.saveSubscription(this.state.publisher);
  },

  // TODO: regularly read the current state of the user from the server
  loadState: function () {
    $.ajax({
      url: `/api/v1/state/${this.props.params.user}`,
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
      url: `/api/v1/state/${this.props.params.user}`,
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

  saveSubscription: function (publisher) {
    $.ajax({
      url: `/api/v1/subscriptions/${this.props.params.user}/publisher/${publisher}`,
      dataType: 'json',
      type: 'PUT',
      success: function (subscriptions) {
        this.setState({subscriptions: subscriptions});
      }.bind(this),
      error: function (err) {
        console.error('Error', err);
      }.bind(this)
    })
  },

  loadSubscriptions: function () {
    $.ajax({
      url: `/api/v1/subscriptions/${this.props.params.user}`,
      dataType: 'json',
      type: 'GET',
      success: function (subscriptions) {
        this.setState({subscriptions: subscriptions});
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
