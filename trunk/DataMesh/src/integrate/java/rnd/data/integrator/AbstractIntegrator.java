//package rnd.data.integrator;
//
//import java.util.Map;
//
//import rnd.data.process.AbstractDataProcessor;
//import rnd.integration.IntegrationService;
//import rnd.util.ApplicationContextProvider;
//
//public abstract class AbstractIntegrator extends AbstractDataProcessor<Map, Map> {
//
//	public static IntegrationService getIntegrationService() {
//		return ApplicationContextProvider.get().getBean(IntegrationService.class);
//	}
//
//}