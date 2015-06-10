package com.almende;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

@Path("/")
public class RestApplication extends Application {

	@Override
	public Set<Class<?>> getClasses() {
		return new HashSet<Class<?>>(Arrays.asList(RestApplication.class));
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String home () {
		return "Home";
	}
	
	@Path("/status")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String status () {
		return "Status";
	}
	
}
