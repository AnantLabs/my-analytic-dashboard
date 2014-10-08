package rnd.data.processor;

public interface DataProcessor<Rq, Rs> {

	public interface DataProcessorCallback {

		public interface DataProcessorCallbackContext {
		}

		void processCallback(DataProcessorCallbackContext context);
	}

	DataProcessorCallback getRequestProcessorCallback(Rq requestPayLoad);

	Object processRequest(Rq requestPayLoad, DataProcessorCallback callback) throws Throwable;

	DataProcessorCallback getResponseProcessorCallback(Rq requestPayLoad, Rs responsePayLoad);

	Object processResponse(Object responseData, Rq requestPayLoad, Rs responsePayLoad, DataProcessorCallback callback) throws Throwable;

}
