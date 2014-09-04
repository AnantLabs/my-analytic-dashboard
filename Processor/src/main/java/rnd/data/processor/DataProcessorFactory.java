package rnd.data.processor;

import java.util.HashMap;
import java.util.Map;

public class DataProcessorFactory {

	private Map<String, DataProcessor<?, ?>> dataProcessorRegistry = new HashMap<String, DataProcessor<?, ?>>();

	public void setDataProcessorRegistry(Map<String, DataProcessor<?, ?>> dataProcessorRegistry) {
		this.dataProcessorRegistry = dataProcessorRegistry;
	}

	public DataProcessor<?, ?> getDataProcessor(String type) {
		return dataProcessorRegistry.get(type);
	}

}
