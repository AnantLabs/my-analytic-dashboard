//package rnd.data.transform.json;
//
//import org.codehaus.jackson.map.ObjectMapper;
//
//import rnd.data.process.AbstractDataProcessor;
//import rnd.data.process.DataProcessor;
//
//public class JacksonDataMapper<Rq, Rs> extends AbstractDataProcessor<Rq, Rs> implements DataProcessor<Rq, Rs> {
//
//	public static class JacksonDataMapperCallbackContext implements JSONDataMapperCallbackContext {
//
//		@SuppressWarnings("unused")
//		private ObjectMapper objectMapper;
//
//		public JacksonDataMapperCallbackContext(ObjectMapper objectMapper) {
//			this.objectMapper = objectMapper;
//		}
//
//	}
//
//	@Override
//	public Object process(Rq requestPayLoad, Rs responsePayLoad) throws Throwable {
//		return null;
//	}
//
//}