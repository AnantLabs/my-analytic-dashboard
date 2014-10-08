package rnd.data.mapper.xml;

import rnd.data.processor.DataProcessor.DataProcessorCallback.DataProcessorCallbackContext;

public interface XMLDataMapperCallbackContext extends DataProcessorCallbackContext {

	void overrideTagForClass(String tagName, Class<?> clazz);

	void overrideTagForField(String tagName, Class<?> clazz, String fieldName);

	void overrideClassImpl(String tagName, Class<?> interfaceClazz, Class<?> implClazz);

}