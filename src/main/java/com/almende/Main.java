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
		server.setHandler(context);

		RestServlet servlet = new RestServlet();
		ServletHolder sh = new ServletHolder(servlet);
		sh.setInitParameter("javax.ws.rs.Application", RestApplication.class.getName());
		context.addServlet(sh, "/api/v1/*");

		server.start();
		server.join();
	}
}
