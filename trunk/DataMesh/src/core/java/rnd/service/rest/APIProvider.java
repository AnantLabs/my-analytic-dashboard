package rnd.service.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.process.AbstractDataProcessor;
import rnd.data.process.DataProcessorFactory;
import rnd.util.ApplicationContextProvider;
import rnd.util.IOUtils;
import rnd.util.JacksonUtils;
import rnd.util.MapBuilder;

@SuppressWarnings("unchecked")
public class APIProvider extends HttpServlet {

	public static DataProcessorFactory getDataProcessorFactory() {
		return ApplicationContextProvider.get().getBean(DataProcessorFactory.class);
	}

	public static APIRegistry getAPIRegistry() {
		return ApplicationContextProvider.get().getBean(APIRegistry.class);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// response.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");
		// response.setHeader("Access-Control-Allow-Origin", "http://my-analytical-dashboard.appspot.com");
		response.setHeader("Access-Control-Allow-Origin", "*");

		APIStateManager.setRequest(request);

		String requestURI = request.getRequestURI();
		String[] params = requestURI.split("/");

		// - /host/<context-root>/api/ <version>/<base>/<resource>
		int startIndx = 3;

		// - /host/api/ <version>/<base>/<resource>
		// int startIndx = 2;

		API resource = new API(params[startIndx++], params[startIndx++], params[startIndx++], APIMethod.valueOf(request.getMethod()));

		Map requestPayLoad = new HashMap();
		for (int i = 0; i < params.length - startIndx; i++) {
			requestPayLoad.put(resource.getResource() + ":param" + i, params[i + startIndx]);
		}

		try {
			Object data = sendDataRequest(resource, requestPayLoad);

			data = new MapBuilder().map("data", data).build();

			APIStateManager.setAPIState(resource, requestPayLoad);

			response.setContentType("application/json");
			if (!(data instanceof String)) {
				data = JacksonUtils.convertToJSON(data);
			}

			response.getOutputStream().write(((String) data).getBytes());
			response.getOutputStream().flush();

		} catch (Throwable e) {
			e.printStackTrace();
			handleException(e, response);
		}

	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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

	protected static Map parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (Map) parseRequest(request, Map.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readPlainContent(request.getInputStream());
		T payLoad = (T) JacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		return payLoad;
	}

	public Object sendDataRequest(API resource, Map requestPayLoad) throws Throwable {

		AbstractDataProcessor dataProcessor = (AbstractDataProcessor) getDataProcessorFactory().getDataProcessor(resource);

		chainDependency(resource, requestPayLoad, dataProcessor);

		Object responseData = dataProcessor.process(requestPayLoad);

		return responseData;
	}

	private void chainDependency(API requiredResource, Map requestPayLoad, AbstractDataProcessor dataProcessor) {

		while ((requiredResource = getAPIRegistry().getDependency(requiredResource)) != null) {

			AbstractDataProcessor requiredDataProcessor = (AbstractDataProcessor) getDataProcessorFactory().getDataProcessor(requiredResource);
			Map requiredPayLoad = APIStateManager.getAPIState(requiredResource);

			dataProcessor.setDelegate(requiredDataProcessor);
			dataProcessor = requiredDataProcessor;

			requestPayLoad.putAll(requiredPayLoad);
		}

	}

}