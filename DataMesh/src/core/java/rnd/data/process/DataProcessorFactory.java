package rnd.data.process;

import java.util.HashMap;
import java.util.Map;

public class DataProcessorFactory {

	private Map<Object, DataProcessor<?, ?>> registry = new HashMap<Object, DataProcessor<?, ?>>();

	public void setRegistry(Map<Object, DataProcessor<?, ?>> registry) {
		this.registry = registry;
	}

	public DataProcessor<?, ?> getDataProcessor(Object type) {
		return registry.get(type);
	}

}