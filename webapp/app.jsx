function init() {
  var Router = ReactRouter;
  var DefaultRoute = Router.DefaultRoute;
  var Route = Router.Route;

  var routes = (
      <Route name="app" path="/" >
        <DefaultRoute name="home" handler={Login}/>
        <Route name="user" path="/user/:user" handler={Home}/>
      </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('app'));
  });
}


if (document.readyState === 'complete') {
  init();
}
else {
  window.onload = init;
}
