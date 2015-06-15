var Home = React.createClass({
  getInitialState: function () {
    return {
      subscriptions: [],
      triggers: [],
      publisher: 'user2'
    }
  },

  LOCATIONS: {
    'Almende': {latitude: 51.908817, longitude: 4.479589},
    'Ask CS': {latitude: 51.920505, longitude: 4.454438},
    'Rotterdam CS': {latitude: 51.916563, longitude: 4.481416},
    'Sense OS': {latitude: 51.903598, longitude: 4.45994}
  },

  render: function () {
    var contents;

    if (this.props.params.user) {
      contents = <div>
        {this.renderState()}
        {this.renderSubscribe()}
        {this.renderSimulate()}
        {this.renderNotifications()}
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
        {subscription.publisher} <button onClick={this.deleteSubscription.bind(this, subscription.publisher)}>Remove</button>
      </div>
    }.bind(this));

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
                Object.keys(this.LOCATIONS).sort().map(function (location) {
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

  renderNotifications: function () {
    var notifications = this.state.triggers.map(function (trigger) {
      return <div key={trigger.publisher} className="notification">
        <b>{trigger.publisher}</b> just arrived at your location. <button className="ok" onClick={this.deleteTrigger.bind(this, trigger.publisher)}>Ok</button>
      </div>
    }.bind(this));

    var src = Math.random() > 0.1 ? 'audio/phonering.wav' : 'audio/halleluj.wav';

    return <div className="notifications">
      {notifications}
      <audio id="beep" src={src} preload="auto"></audio>
    </div>;
  },

  componentDidMount: function () {
    this.loadState();
    this.loadSubscriptions();

    this.loadTriggers();
    this.messageTimer = setInterval(function () {
      this.loadTriggers();
    }.bind(this), 10000);

    window.addEventListener('focus', this.loadTriggers);
  },

  componentWillUnmount: function () {
    clearTimeout(this.messageTimer);
    window.removeEventListener('focus', this.loadTriggers);
  },

  handlePublisher: function (event) {
    this.setState({publisher: event.target.value});
  },

  subscribe: function () {
    this.saveSubscription(this.state.publisher);
  },

  deleteTrigger: function (publisher) {
    var triggers = this.state.triggers.filter(function (trigger) {
      return trigger.publisher !== publisher
    });
    this.setState({triggers: triggers});

    this.deleteSubscription(publisher);
  },

  // TODO: use some client rest library
  loadState: function () {
    $.ajax({
      url: `/api/v1/state/${this.props.params.user}`,
      dataType: 'json',
      type: 'GET',
      success: function (state) {
        if (state){
          this.setState(state);
        }
      }.bind(this),
      error: function (err) {
        console.error('Error', err);
      }.bind(this)
    })
  },

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

  deleteSubscription: function (publisher) {
    $.ajax({
      url: `/api/v1/subscriptions/${this.props.params.user}/publisher/${publisher}`,
      dataType: 'json',
      type: 'DELETE',
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

  loadTriggers: function () {
    $.ajax({
      url: `/api/v1/triggers/${this.props.params.user}`,
      dataType: 'json',
      type: 'GET',
      success: function (triggers) {
        console.log('triggers', triggers);

        // play a sound
        if (triggers.length > this.state.triggers.length) {
          document.getElementById('beep').play()
        }

        // FIXME: reloading subscriptions should not be triggered here but in the messageTimer
        if (triggers.length > 0) {
          this.loadSubscriptions();
        }

        this.setState({triggers: triggers});
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
      // TODO: allow deviations of say 20 meters
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
