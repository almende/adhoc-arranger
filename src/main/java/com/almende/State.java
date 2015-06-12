package com.almende;

import org.json.JSONException;
import org.json.JSONObject;

public class State {
	public GeoLocation location = new GeoLocation();
	public boolean driving = false;
	public boolean onThePhone = false;

	public State () {}
	
	public State (GeoLocation location, boolean driving, boolean onThePhone) {
		this.onThePhone = onThePhone;
		this.location = location;
	}
	
	public State putJSON(JSONObject json) throws JSONException {
		if (json.has("location")) {
			location.putJSON(json.getJSONObject("location"));
		}
		
		if (json.has("driving")) {
			driving = json.getBoolean("driving");
		}

		if (json.has("onThePhone")) {
			onThePhone = json.getBoolean("onThePhone");
		}

		return this;
	}
	
	public JSONObject toJSON () throws JSONException {
		JSONObject json = new JSONObject();
		json.put("location", location.toJSON());
		json.put("driving", driving);
		json.put("onThePhone", onThePhone);
		return json;
	}

	public static State fromJSON (JSONObject json) throws JSONException {
		return new State(
				GeoLocation.fromJSON(json.getJSONObject("location")),
				json.getBoolean("driving"), 
				json.getBoolean("onThePhone"));
	}
}
