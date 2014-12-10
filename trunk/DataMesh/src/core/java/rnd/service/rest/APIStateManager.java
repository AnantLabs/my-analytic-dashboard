package rnd.service.rest;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@SuppressWarnings("unchecked")
public class APIStateManager {

	private static ThreadLocal<HttpServletRequest> requestTL = new ThreadLocal<HttpServletRequest>();

	public static void setRequest(HttpServletRequest request) {
		requestTL.set(request);
	}

	public static HttpServletRequest getRequest() {
		return requestTL.get();
	}

	public static void setAPIState(API resource, Map requestPayLoad) {

		HttpSession session = getRequest().getSession(true);
		String txStateKey = extractTxStateKey();
		Map stateMap = (Map) session.getAttribute(txStateKey);

		if (stateMap == null) {
			stateMap = new HashMap();
			session.setAttribute(txStateKey, stateMap);
		}

		stateMap.put(resource, requestPayLoad);
	}

	public static Map getAPIState(API resource) {

		HttpSession session = getRequest().getSession(true);
		String txStateKey = extractTxStateKey();
		Map stateMap = (Map) session.getAttribute(txStateKey);
		return (Map) stateMap.get(resource);
	}

	private static String extractTxStateKey() {
		String transactionType = getRequest().getParameter("TransactionType");
		String transactionID = getRequest().getParameter("TransactionID");
		String txStateKey = transactionType + ":" + transactionID;
		return txStateKey;
	}

}