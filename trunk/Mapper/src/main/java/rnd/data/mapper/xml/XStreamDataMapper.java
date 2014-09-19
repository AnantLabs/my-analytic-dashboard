package rnd.data.mapper.xml;

import rnd.data.processor.AbstractDataProcessor;
import rnd.util.XStreamUtils;

import com.thoughtworks.xstream.XStream;

@SuppressWarnings("unchecked")
public class XStreamDataMapper<Rq, Rs> extends AbstractDataProcessor<Rq, Rs> {

	public static class XStreamDataMapperCallbackContext implements XMLDataMapperCallbackContext {

		private XStream xStream;

		public XStreamDataMapperCallbackContext(XStream xStream) {
			this.xStream = xStream;
		}

		public void overrideTagForClass(String tagName, Class<?> clazz) {
			xStream.alias(tagName, clazz);
		}

		public void overrideTagForField(String tagName, Class<?> clazz, String fieldName) {
			xStream.aliasField(tagName, clazz, fieldName);
		}

		public void overrideClassImpl(String tagName, Class<?> interfaceClazz, Class<?> implClazz) {
			xStream.alias(tagName, interfaceClazz, implClazz);
		}

	}

	public String processRequest(Rq requestPayLoad, DataProcessorCallback callback) throws Throwable {

		XStream xStream = XStreamUtils.getXStream();

		if (callback != null) {
			callback.processCallback(new XStreamDataMapperCallbackContext(xStream));
		}

		String requestXML = xStream.toXML(requestPayLoad);
		return requestXML;
	}

	public Object processResponse(Object responseXML, Rq requestPayLoad, Rs responsePayLoad, DataProcessorCallback callback) throws Throwable {

		XStream xStream = XStreamUtils.getXStream();

		if (callback != null) {
			callback.processCallback(new XStreamDataMapperCallbackContext(xStream));
		}

		responsePayLoad = (Rs) xStream.fromXML(responseXML.toString(), responsePayLoad);
		return responsePayLoad;
	}

}
