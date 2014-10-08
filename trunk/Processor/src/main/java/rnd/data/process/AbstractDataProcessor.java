package rnd.data.process;

public abstract class AbstractDataProcessor<Rq, Rs> implements DataProcessor<Rq, Rs> {

	private DataProcessor delegate;

	public void setDelegate(DataProcessor delegate) {
		this.delegate = delegate;
	}

	public DataProcessor getDelegate() {
		return delegate;
	}

	public DataProcessorCallback getRequestProcessorCallback(Rq requestPayLoad) {
		return null;
	}

	public DataProcessorCallback getResponseProcessorCallback(Rq requestPayLoad, Rs responsePayLoad) {
		return null;
	}

}
