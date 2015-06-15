package com.almende;

import java.util.Date;

public class Trigger {
	public Date expires = null;
	
	public Trigger (Date expires) {
		this.expires = expires;
	}
	
	public boolean isExprired() {
		return expires != null && new Date().after(expires);
	}
}
