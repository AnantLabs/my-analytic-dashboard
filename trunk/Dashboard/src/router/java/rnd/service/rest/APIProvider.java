package rnd.service.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.process.DataProcessor;
import rnd.data.process.DataProcessorFactory;
import rnd.service.rest.API;
import rnd.service.rest.APIMethod;
import rnd.util.ApplicationContextProvider;
import rnd.util.IOUtils;
import rnd.util.JacksonUtils;

@SuppressWarnings("unchecked")
public class APIProvider extends HttpServlet {

	public DataProcessorFactory getDataProcessorFactory() {
		return ApplicationContextProvider.get().getBean(DataProcessorFactory.class);
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String requestURI = request.getRequestURI();

		APIMethod method = APIMethod.valueOf(request.getMethod());

		try {

			String[] params = requestURI.split("/");

			API api = new API("1.0", params[2], params[3], method);
			if (params.length > 4) {
				api.setResource(params[4]);
			}

			Map requestPayLoad = new HashMap();
			Map responsePayLoad = new HashMap();

			Object data;
			if (method == APIMethod.GET) {
				data = receiveDataResponse(api, requestPayLoad, responsePayLoad);
			} else {
				data = sendDataRequest(api, requestPayLoad);
			}

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

	protected static Map parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (Map) parseRequest(request, Map.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readContent(request.getInputStream());
		T payLoad = (T) JacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		return payLoad;
	}

	public Object sendDataRequest(Object resource, Object requestPayLoad) throws Throwable {
		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(resource);
		Object responseData = dataProcessor.processRequest(requestPayLoad, null);
		responseData = dataProcessor.processResponse(responseData, requestPayLoad, new HashMap(), null);
		return responseData;
	}

	public Object receiveDataResponse(Object resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {
		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(resource);
		Object responseData = dataProcessor.processResponse(null, requestPayLoad, responsePayLoad, null);
		return responseData;
	}

	// protected List<Map<String, String>> executeStmt(Type type, String query)
	// throws Throwable {
	// return executeStmt(type, query, new HashMap());
	// }
	//
	// protected List<Map<String, String>> executeStmt(Type type, String query,
	// Map payLoad) throws Throwable {
	//
	// JDBCInfo jdbcInfo = new JDBCInfo();
	// jdbcInfo.setType(type);
	// jdbcInfo.setStmt(query);
	// jdbcInfo.setPayLoad(payLoad);
	// JDBCResponsePayLoad result = (JDBCResponsePayLoad)
	// sendDataRequest("JDBC", "service", jdbcInfo, new JDBCResponsePayLoad());
	//
	// List<Map<String, String>> rows = result.getRows();
	// return rows;
	// }

}