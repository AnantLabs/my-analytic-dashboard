package rnd.data.route;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.process.DataProcessor;
import rnd.data.process.DataProcessorFactory;
import rnd.util.ApplicationContextProvider;
import rnd.util.IOUtils;
import rnd.util.JacksonUtils;

public abstract class AbstractDataRouter implements DataRouter {

	public DataProcessorFactory getDataProcessorFactory() {
		return ApplicationContextProvider.get().getBean(DataProcessorFactory.class);
	}

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
		byte[] response = ("{\"exception\" : " + JacksonUtils.convertToJSON(exceptionMap) + "}").getBytes();

		httpServletResponse.setContentType("application/json");
		httpServletResponse.getOutputStream().write(response);
	}

	public Object sendDataRequest(String resource, Object requestPayLoad) throws Throwable {
		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(resource);
		Object responseData = dataProcessor.processRequest(requestPayLoad, null);
		responseData = dataProcessor.processResponse(responseData, requestPayLoad, new HashMap(), null);
		return responseData;
	}

	public Object receiveDataResponse(String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {
		DataProcessor dataProcessor = getDataProcessorFactory().getDataProcessor(resource);
		Object responseData = dataProcessor.processResponse(null, requestPayLoad, responsePayLoad, null);
		return responseData;
	}

	protected static Map parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (Map) parseRequest(request, Map.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readContent(request.getInputStream());
		T payLoad = (T) JacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		return payLoad;
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