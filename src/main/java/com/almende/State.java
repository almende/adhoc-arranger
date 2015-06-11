package com.almende;

import org.json.JSONException;
import org.json.JSONObject;

public class State {
	public boolean onThePhone = false;
	public GeoLocation location = new GeoLocation();

	public State () {}
	
	public State (boolean onThePhone, GeoLocation location) {
		this.onThePhone = onThePhone;
		this.location = location;
	}
	
	public State putJSON(JSONObject json) throws JSONException {
		if (json.has("onThePhone")) {
			onThePhone = json.getBoolean("onThePhone");
		}

		if (json.has("location")) {
			location.putJSON(json.getJSONObject("location"));
		}
		
		return this;
	}
	
	public JSONObject toJSON () throws JSONException {
		JSONObject json = new JSONObject();
		json.put("onThePhone", onThePhone);
		json.put("location", location.toJSON());
		return json;
	}

	public static State fromJSON (JSONObject json) throws JSONException {
		return new State(
				json.getBoolean("onThePhone"), 
				GeoLocation.fromJSON(json.getJSONObject("location")));
	}
}
