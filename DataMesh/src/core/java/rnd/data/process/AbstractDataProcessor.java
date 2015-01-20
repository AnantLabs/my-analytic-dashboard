package rnd.data.process;

import java.util.Map;

public abstract class AbstractDataProcessor<Rq, Rs> implements DataProcessor<Rq, Rs> {

	private Map<Object, DataProcessor> delegates;

	public void setDelegates(Map<Object, DataProcessor> delegates) {
		this.delegates = delegates;
	}

	public DataProcessor getDelegate(Object type) {
		return delegates.get(type);
	}

	public DataProcessorCallback getProcessorCallback(Rq requestPayLoad, Rs responsePayLoad) {
		return null;
	}

}