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

		String requestURI = request.getRequestURI();

		String resource = requestURI.substring(API_BASE_URL.length());

		String[] params = resource.split("/");

		String name = params[0];
		String exec = params[1];
		String by = params[2];

		DataRouter dataRouter = APIRegistery.getAPIProvider("1.0", name, APIMethod.GET);

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

			Map data = (Map) dataRouter.sendDataRequest(name, payload);

			payload.put("keys", data.keySet());
			payload.put("values", data.values());

			response.setContentType("application/json");
			response.getOutputStream().write(JacksonUtils.convertToJSON(payload).getBytes());
			response.getOutputStream().flush();

		} catch (Throwable e) {
			e.printStackTrace();
			handleException(e, response);
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	public static void handleException(Throwable exception, HttpServletResponse httpResponse) throws IOException {
		handleException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception, httpResponse);
	}

	protected static void handleException(int sc, Throwable exception, HttpServletResponse httpResponse) throws IOException {
		httpResponse.setStatus(sc);
		httpResponse.setContentType("application/json");
		addException(exception, httpResponse);
		httpResponse.getOutputStream().flush();
	}

	protected static void addException(Throwable exception, HttpServletResponse httpResponse) throws IOException {
		byte[] response = ("{\"exception\" : { \"message\" : \"" + exception.getMessage() + "\"} }").getBytes();
		httpResponse.getOutputStream().write(response);
	}

}