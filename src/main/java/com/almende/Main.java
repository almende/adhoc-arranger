package com.almende;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.*;
import org.apache.wink.server.internal.servlet.RestServlet;

public class Main {

	public static void main(String[] args) throws Exception {
		Server server = new Server(Integer.valueOf(System.getenv("PORT")));
		ServletContextHandler context = new ServletContextHandler(
				ServletContextHandler.SESSIONS);
		context.setContextPath("/");

		// Static file handling
		context.setResourceBase("webapp");
		context.addServlet(new ServletHolder(new DefaultServlet()), "/*");
		
		// REST API 
		ServletHolder sh = new ServletHolder(new RestServlet());
		sh.setInitParameter("javax.ws.rs.Application", RestApplication.class.getName());
		context.addServlet(sh, "/api/v1/*");
		
		server.setHandler(context);
		server.start();
		server.join();
	}
}
