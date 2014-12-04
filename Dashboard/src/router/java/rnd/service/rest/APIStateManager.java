package rnd.service.rest;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@SuppressWarnings("unchecked")
public class APIStateManager {

	public void setAPIState(HttpServletRequest request, API resource, Map requestPayLoad) {

		HttpSession session = request.getSession(true);
		String txStateKey = extractTxStateKey(request);
		Map stateMap = (Map) session.getAttribute(txStateKey);

		if (stateMap == null) {
			stateMap = new HashMap();
			session.setAttribute(txStateKey, stateMap);
		}

		stateMap.put(resource, requestPayLoad);
	}

	public Map getAPIState(HttpServletRequest request, API resource) {

		HttpSession session = request.getSession(true);
		String txStateKey = extractTxStateKey(request);
		Map stateMap = (Map) session.getAttribute(txStateKey);
		return (Map) stateMap.get(resource);
	}

	private String extractTxStateKey(HttpServletRequest request) {
		String transactionType = request.getParameter("TransactionType");
		String transactionID = request.getParameter("TransactionID");
		String txStateKey = transactionType + ":" + transactionID;
		return txStateKey;
	}

}