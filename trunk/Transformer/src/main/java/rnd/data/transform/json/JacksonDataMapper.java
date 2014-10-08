package rnd.data.mapper.json;

import org.codehaus.jackson.map.ObjectMapper;

import rnd.data.processor.AbstractDataProcessor;
import rnd.data.processor.DataProcessor;

public class JacksonDataMapper<Rq, Rs> extends AbstractDataProcessor<Rq, Rs> implements DataProcessor<Rq, Rs> {

	public static class JacksonDataMapperCallbackContext implements JSONDataMapperCallbackContext {

		@SuppressWarnings("unused")
		private ObjectMapper objectMapper;

		public JacksonDataMapperCallbackContext(ObjectMapper objectMapper) {
			this.objectMapper = objectMapper;
		}

	}

	@Override
	public Object processRequest(Rq requestPayLoad, DataProcessorCallback callback) throws Throwable {
		throw new UnsupportedOperationException();
	}

	@Override
	public Object processResponse(Object responseXML, Rq requestPayLoad, Rs responsePayLoad, DataProcessorCallback callback) throws Throwable {
		throw new UnsupportedOperationException();
	}

}
