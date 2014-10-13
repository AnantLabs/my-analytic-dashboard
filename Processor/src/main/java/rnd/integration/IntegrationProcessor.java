//package rnd.integration;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import rnd.data.process.AbstractDataProcessor;
//
//public class IntegrationProcessor extends AbstractDataProcessor {
//
//	@Autowired
//	private static IntegrationService integrationService;
//
//	public IntegrationService getIntegrationService() {
//		return integrationService;
//	}
//
//	@Override
//	public Object processRequest(Object requestPayLoad, DataProcessorCallback callback) throws Throwable {
//		return getIntegrationService().send("direct:" + resource, null, requestPayLoad, String.class);
//	}
//
//	@Override
//	public Object processResponse(Object responseData, Object requestPayLoad, Object responsePayLoad, DataProcessorCallback callback) throws Throwable {
//		return getIntegrationService().receive("direct:" + resource, String.class);
//	}
//
//}