package rnd.data.process;

@SuppressWarnings("unchecked")
public class DelegatingDataProcessor<Rq, Rs> extends AbstractDataProcessor<Rq, Rs> {

	@Override
	public Object processRequest(Rq requestPayLoad, DataProcessorCallback callback) throws Throwable {
		return getDelegate().processRequest(requestPayLoad, callback);
	}

	@Override
	public Object processResponse(Object responseData, Rq requestPayLoad, Rs responsePayLoad, DataProcessorCallback callback) throws Throwable {
		return getDelegate().processResponse(responseData, requestPayLoad, responsePayLoad, callback);
	}

}
