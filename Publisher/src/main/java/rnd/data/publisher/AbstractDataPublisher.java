package rnd.data.publisher;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;

import rnd.data.mapper.jdbc.JDBCInfo;
import rnd.data.mapper.jdbc.JDBCInfo.Type;
import rnd.data.mapper.jdbc.JDBCResponsePayLoad;
import rnd.data.processor.DataProcessor;
import rnd.data.processor.DataProcessorFactory;
import rnd.integration.IntegrationService;
import rnd.util.IOUtils;
import rnd.util.UXJacksonUtils;

@SuppressWarnings(value =
	{ "unchecked", "rawtypes" })
public abstract class AbstractDataPublisher {

	private static IntegrationService integrationService;

	private static DataProcessorFactory dataProcessorFactory;

	public static IntegrationService getIntegrationService() {
		return integrationService;
	}

	protected static DataProcessorFactory getDataProcessorFactory() {
		return dataProcessorFactory;
	}

	@ExceptionHandler(Throwable.class)
	public static void handleException(Throwable exception, HttpServletResponse httpServletResponse) throws Throwable {
		handleException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception, httpServletResponse);
	}

	protected static void handleException(int sc, Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		httpServletResponse.setStatus(sc);
		setExceptionTrace(exception, httpServletResponse);
		httpServletResponse.getOutputStream().flush();
	}

	protected static void setExceptionTrace(Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		Map<String, String> exceptionMap = new HashMap<String, String>();

		String defaultMessage = exception.getMessage();
		exceptionMap.put("message", defaultMessage);

		httpServletResponse.setContentType("application/json");
		httpServletResponse.getOutputStream().write(("{\"exception\" : " + UXJacksonUtils.convertToJSON(exceptionMap) + "}").getBytes());
	}

	protected static Object sendDataRequest(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(requestType);
		Object requestData = dataProcessor.processRequest(requestPayLoad, null);

		String responseData = getIntegrationService().send("direct:" + resource, null, requestData, String.class).replace((char) 0, ' ');

		Object responsePayLoadObj = dataProcessor.processResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}

	protected static Object recieveDataResponse(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		String responseData = getIntegrationService().receive("direct:" + resource, String.class);

		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(requestType);
		Object responsePayLoadObj = dataProcessor.processResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}

	protected static Map parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (Map) parseRequest(request, Map.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readContent(request.getInputStream());
		T payLoad = (T) UXJacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		return payLoad;
	}

	protected static Object processRequest(Object requestData, String requestType, String resource, HttpServletResponse response, Object responsePayload) throws IOException, Throwable {

		Object responseData = sendDataRequest(requestType, resource, requestData, responsePayload);

		if (responseData instanceof String) {
			String responseJSON = (String) responseData;
			if (responseJSON.contains("{\"exception\":")) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return responseJSON;
		} else {
			return responseData;
		}

	}

	protected List<Map<String, String>> executeStmt(Type type, String query) throws Throwable {
		return executeStmt(type, query, new HashMap());
	}

	protected List<Map<String, String>> executeStmt(Type type, String query, Map payLoad) throws Throwable {

		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(type);
		jdbcInfo.setStmt(query);
		jdbcInfo.setPayLoad(payLoad);
		JDBCResponsePayLoad result = (JDBCResponsePayLoad) sendDataRequest("JDBC", "service", jdbcInfo, new JDBCResponsePayLoad());

		List<Map<String, String>> rows = result.getRows();
		return rows;
	}

}
