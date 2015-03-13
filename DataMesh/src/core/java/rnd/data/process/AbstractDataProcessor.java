package rnd.data.process;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractDataProcessor<Rq, Rs> implements DataProcessor<Rq, Rs> {

	private Map<Object, DataProcessor> delegates = new HashMap<>();

	public void setDelegates(Map<Object, DataProcessor> delegates) {
		this.delegates.putAll(delegates);
	}

	public Map<Object, DataProcessor> getDelegates() {
		return delegates;
	}

	public void setDelegate(String type, DataProcessor delegate) {
		delegates.put(type, delegate);
	}

	public DataProcessor getDelegate(Object type) {
		return delegates.get(type);
	}

	public void setDelegate(DataProcessor delegate) {
		delegates.put(null, delegate);
	}

	public DataProcessor getDelegate() {
		return delegates.get(null);
	}

	public DataProcessorCallback getProcessorCallback(Rq requestPayLoad) {
		return null;
	}

}