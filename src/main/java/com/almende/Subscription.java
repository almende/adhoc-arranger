package com.almende;

import org.json.JSONException;
import org.json.JSONObject;

public class Subscription {
	public String subscriber = "";
	public String publisher = "";	
	
	public Subscription() {}
	
	public Subscription(String subscriber, String publisher) {
		this.subscriber = subscriber;
		this.publisher = publisher;
	}
	
	public String getId() {
		return this.subscriber + "," + this.publisher;
	}

	public Subscription putJSON(JSONObject json) throws JSONException {
		if (json.has("subscriber")) {
			subscriber = json.getString("subscriber");
		}
		if (json.has("publisher")) {
			publisher = json.getString("publisher");
		}		
		return this;
	}
	
	public JSONObject toJSON () throws JSONException {
		JSONObject json = new JSONObject();
		json.put("subscriber", subscriber);
		json.put("publisher", publisher);
		return json;
	}
	
	public static Subscription fromJSON (JSONObject json) throws JSONException {
		return new Subscription(
				json.getString("subscriber"), 
				json.getString("publisher"));
	}	
}
