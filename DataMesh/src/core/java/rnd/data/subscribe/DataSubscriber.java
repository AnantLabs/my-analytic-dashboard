package rnd.data.subscribe;

import java.util.HashMap;
import java.util.Map;

import rnd.data.process.AbstractDataProcessor;

@SuppressWarnings("unchecked")
public class DataSubscriber extends AbstractDataProcessor<Map<String, String>, Map<String, Number>> {

	@Override
	public Object processRequest(Map<String, String> requestPayLoad, DataProcessorCallback callback) throws Throwable {

		requestPayLoad.put("key", "MAT_NO");
		requestPayLoad.put("value", "QTY");
		requestPayLoad.put("data-source", requestPayLoad.remove("param1"));

		// if (by.equalsIgnoreCase("Customer")) {
		// payload.put("key", "NAME");
		// } else if (by.equalsIgnoreCase("Product")) {
		// payload.put("key", "MAT_DESC");
		// } else if (by.equalsIgnoreCase("City")) {
		// payload.put("key", "CITY");
		// }

		return getDelegate().processRequest(requestPayLoad, null);
	}

	@Override
	public Object processResponse(Object responseData, Map<String, String> requestPayLoad, Map<String, Number> responsePayLoad, DataProcessorCallback callback) throws Throwable {

		getDelegate().processResponse(responseData, requestPayLoad, responsePayLoad, null);

		Map payload = new HashMap();
		payload.put("keys", responsePayLoad.keySet());
		payload.put("values", responsePayLoad.values());

		return payload;
	}

}
