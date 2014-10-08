package rnd.data.transform.xml;

import rnd.data.process.DataProcessor.DataProcessorCallback.DataProcessorCallbackContext;

public interface XMLDataMapperCallbackContext extends DataProcessorCallbackContext {

	void overrideTagForClass(String tagName, Class<?> clazz);

	void overrideTagForField(String tagName, Class<?> clazz, String fieldName);

	void overrideClassImpl(String tagName, Class<?> interfaceClazz, Class<?> implClazz);

}