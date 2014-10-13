package rnd.service.rest.web;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.route.DataRouter;
import rnd.service.rest.APIMethod;
import rnd.service.rest.APIRegistery;
import rnd.util.JacksonUtils;

@WebServlet(urlPatterns = "/api/*", loadOnStartup = 1)
public class APIProvider extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String requestURI = request.getRequestURI();
		String resource = requestURI.substring(requestURI.lastIndexOf('/') + 1);
		DataRouter dataRouter = APIRegistery.getAPIProvider("1.0", resource, APIMethod.GET);

		try {
			Object data = dataRouter.sendDataRequest(resource, new HashMap());
			response.setContentType("application/json");
			response.getOutputStream().write(JacksonUtils.convertToJSON(data).getBytes());
			response.getOutputStream().flush();
		} catch (Throwable e) {
			e.printStackTrace();
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}