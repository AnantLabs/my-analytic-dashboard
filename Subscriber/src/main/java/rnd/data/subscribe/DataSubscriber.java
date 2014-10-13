//package rnd.data.subscribe;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import rnd.data.route.AbstractDataRouter;
//import rnd.util.AppConfig;
//import rnd.util.JacksonUtils;
//
//public class DataSubscriber extends AbstractDataRouter {
//
//	public String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {
//
//		Map requestPayLoad = parseRequest(request);
//
//		Object responseData = processRequest(requestPayLoad, AppConfig.getProperty("APPLICATION"), "data", response, new HashMap());
//
//		if (responseData instanceof String) {
//			return (String) responseData;
//		}
//
//		return JacksonUtils.convertToJSON(responseData);
//	}
//
//}