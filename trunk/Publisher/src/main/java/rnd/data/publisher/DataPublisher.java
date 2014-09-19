package rnd.data.publisher;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.router.AbstractDataRouter;
import rnd.util.AppConfig;
import rnd.util.JacksonUtils;

public class DataPublisher extends AbstractDataRouter {

	public String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		Map requestPayLoad = parseRequest(request);

		Object responseData = processRequest(requestPayLoad, AppConfig.getProperty("APPLICATION"), "data", response, new HashMap());

		if (responseData instanceof String) { return (String) responseData; }

		return JacksonUtils.convertToJSON(responseData);
	}

}
