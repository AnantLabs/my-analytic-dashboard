package rnd.data.route;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import rnd.data.process.DataProcessor;
import rnd.data.process.DataProcessorFactory;
import rnd.util.ApplicationContextProvider;
import rnd.util.IOUtils;
import rnd.util.JacksonUtils;

public abstract class AbstractDataRouter implements DataRouter {

	public DataProcessorFactory getDataProcessorFactory() {
		return ApplicationContextProvider.get().getBean(DataProcessorFactory.class);
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