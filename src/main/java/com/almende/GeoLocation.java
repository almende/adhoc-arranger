package com.almende;

import org.json.JSONException;
import org.json.JSONObject;

public class GeoLocation {
	public double latitude = 0;
	public double longitude = 0;	
	
	public GeoLocation() {}
	
	public GeoLocation(double latitude, double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	public boolean equals(GeoLocation other) {
		return latitude == other.latitude && longitude == other.longitude;
	}

	public GeoLocation putJSON(JSONObject json) throws JSONException {
		if (json.has("longitude")) {
			longitude = json.getDouble("longitude");
		}
		if (json.has("latitude")) {
			latitude = json.getDouble("latitude");
		}		
		return this;
	}
	
	public JSONObject toJSON () throws JSONException {
		JSONObject json = new JSONObject();
		json.put("longitude", longitude);
		json.put("latitude", latitude);
		return json;
	}
	
	public static GeoLocation fromJSON (JSONObject json) throws JSONException {
		return new GeoLocation(
				json.getDouble("longitude"), 
				json.getDouble("latitude"));
	}
}
