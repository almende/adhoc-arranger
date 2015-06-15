package com.almende;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@Path("/")
public class RestApplication extends Application {
	private static final Logger logger = LogManager.getLogger("RestApplication");

	protected static final long EXPIRES_IN = 3 * 60 * 1000; // expiration of triggers in milliseconds
	
	protected Map<String, State> users = new HashMap<String, State>();
	protected Map<String, Subscription> subscriptions = new HashMap<String, Subscription>();
	protected Map<String, Trigger> triggers = new HashMap<String, Trigger>();
	
	@Override
	public Set<Class<?>> getClasses() {
		return new HashSet<Class<?>>(Arrays.asList(RestApplication.class));
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String home () {
		// TODO: output a summary with the available API
		return "REST API";
	}
	
	@GET
	@Path("/state/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getState (@PathParam("user") String user) throws JSONException {
		logger.info("Get user " + user);
		
		State state = users.get(user);
		
		return state != null ? state.toJSON() : null;
	}
	
	@PUT
	@Path("/state/{user}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject putState (@PathParam("user") String user, JSONObject json) throws JSONException {
		logger.info("Put user " + user + " " + json.toString());
		
		State updated = users.containsKey(user) ? users.get(user) : new State();
		
		// merge with existing status
		updated.putJSON(json);
		users.put(user, updated);
		
		updateTriggers(user);
		
		return updated.toJSON();
	}
	
	@GET
	@Path("/subscriptions/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getSubscriptions (@PathParam("user") String user) throws JSONException {
		logger.info("Get subscriptions of " + user);

		JSONArray json = new JSONArray();
		
		for (Subscription subscription : subscriptions.values()) {
			if (user.equals(subscription.subscriber)) {
				json.put(subscription.toJSON());
			};
		}
		
		return json;
	}
	
	@PUT
	@Path("/subscriptions/{user}/publisher/{publisher}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray putSubscription (@PathParam("user") String user, 
			@PathParam("publisher") String publisher) throws JSONException {
		logger.info("Subscribe " + user + " to " + publisher);

		Subscription subscription = new Subscription(user, publisher);
		subscriptions.put(subscription.getId(), subscription);
		
		return getSubscriptions(user);
	}

	@DELETE
	@Path("/subscriptions/{user}/publisher/{publisher}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray deleteSubscription (@PathParam("user") String user, 
			@PathParam("publisher") String publisher) throws JSONException {
		logger.info("Delete subscription " + user + " to " + publisher);

		String id = new Subscription(user, publisher).getId();
		subscriptions.remove(id);
		triggers.remove(id);
		
		return getSubscriptions(user);
	}
	
	@GET
	@Path("/triggers/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getTriggers (@PathParam("user") String user) throws JSONException {
		JSONArray json = new JSONArray();
		
		for (Subscription subscription : subscriptions.values()) {
			if (user.equals(subscription.subscriber)) {
				String id = subscription.getId();
				
				if (triggers.containsKey(id)) {
					Trigger trigger = triggers.get(id);
	
					if (trigger.isExprired()) {
						// remove expired triggers
						logger.info("Trigger " + id + " is expired");
	
						triggers.remove(id);
					}
					else {
						json.put(subscription.toJSON());
					}
				}
			}
		}

		return json;
	}
	
	protected void updateTriggers (String publisher) {
		logger.info("Update triggers " + publisher);
		
		for (Subscription subscription : subscriptions.values()) {
			if (publisher.equals(subscription.publisher)) {
				String id = subscription.getId();
				
				State p = users.get(subscription.publisher);
				State s = users.get(subscription.subscriber);

				if (p != null && s != null 
						&& p.location.equals(s.location) 
						&& !triggers.containsKey(id)) {
					Date now = new Date();
					Date expires = new Date(now.getTime() + EXPIRES_IN);
					
					triggers.put(id, new Trigger(expires));

					logger.info("Add trigger for subscriber " + subscription.subscriber + 
							", publisher " + subscription.publisher);
				}
			}
		}
	}	
}
