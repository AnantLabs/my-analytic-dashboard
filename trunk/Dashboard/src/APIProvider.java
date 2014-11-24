package rnd.service.rest.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.route.DataRouter;
import rnd.service.rest.APIMethod;
import rnd.service.rest.APIRegistery;
import rnd.util.JacksonUtils;

public class APIProvider extends HttpServlet {

	private static final String API_BASE_URL = "/Publisher/api/data/";

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String name = params[0];
		String exec = params[1];
		String by = params[2];

		Map payload = new HashMap();

		if (by.equalsIgnoreCase("Customer")) {
			payload.put("key", "NAME");
		} else if (by.equalsIgnoreCase("Product")) {
			payload.put("key", "MAT_DESC");
		} else if (by.equalsIgnoreCase("City")) {
			payload.put("key", "CITY");
		}

		payload.put("value", "QTY");

		payload.put("exec", exec);

		try {

			payload.put("keys", data.keySet());
			payload.put("values", data.values());

		} catch (Throwable e) {
			e.printStackTrace();
			handleException(e, response);
		}

	}

}