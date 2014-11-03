package rnd.data.publish;

import java.util.HashMap;

import rnd.data.route.AbstractDataRouter;
import rnd.util.JacksonUtils;

public class DataPublisher extends AbstractDataRouter {

	public String getData() throws Throwable {
		Object data = sendDataRequest("data", new HashMap());
		return JacksonUtils.convertToJSON(data);
	}

}