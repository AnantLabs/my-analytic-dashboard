//package rnd.data.integrator;
//
//import java.io.InputStream;
//import java.util.Map;
//
//import rnd.data.process.AbstractDataProcessor;
//import rnd.util.IOUtils;
//
//public class ResourceIntegrator extends AbstractDataProcessor<Map, Map> {
//
//	@Override
//	public Object processRequest(Map requestPayLoad, DataProcessorCallback callback) throws Throwable {
//		InputStream is = IOUtils.getResourceAsStream("/Sample/" + requestPayLoad.get("integrate:param1") + ".xls");
//		return is;
//	}
//
//	@Override
//	public Object processResponse(Object responseData, Map requestPayLoad, Map responsePayLoad, DataProcessorCallback callback) throws Throwable {
//
//		responsePayLoad.put("Type", "Resource");
//		responsePayLoad.put("Name", requestPayLoad.get("integrate:param1"));
//
//		return responsePayLoad;
//	}
//
//}