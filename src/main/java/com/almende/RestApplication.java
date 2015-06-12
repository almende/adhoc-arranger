package com.almende;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@Path("/")
public class RestApplication extends Application {

	protected Map<String, State> users = new HashMap<String, State>();
	protected List<Subscription> subscriptions = new ArrayList<Subscription>();
	
	@Override
	public Set<Class<?>> getClasses() {
		return new HashSet<Class<?>>(Arrays.asList(RestApplication.class));
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String home () {
		// TODO: output a summary with the available API
		return "Home";
	}
	
	@GET
	@Path("/state/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getState (@PathParam("user") String user) throws JSONException {
		State state = users.get(user);
		
		return state != null ? state.toJSON() : null;
	}
	
	@PUT
	@Path("/state/{user}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject putState (@PathParam("user") String user, JSONObject json) throws JSONException {
		// merge with existing status
		State updated = users.containsKey(user) ? users.get(user) : new State();
		
		updated.putJSON(json);
		
		users.put(user, updated);
		
		return updated.toJSON();
	}
	
	@GET
	@Path("/subscriptions/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getSubscriptions (@PathParam("user") String user) throws JSONException {
		JSONArray json = new JSONArray();
		
		for (Subscription subscription : subscriptions) {
			if (subscription.subscriber == user) {
				json.put(subscription.toJSON());
			};
		}
		
		return json;
	}
	
	@PUT
	@Path("/subscriptions/{user}/publisher/{publisher}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray putSubscription (@PathParam("user") String user, 
			@PathParam("publisher") String publisher) throws JSONException {
		subscriptions.add(new Subscription(user, publisher));
		
		return getSubscriptions(user);
	}
}
