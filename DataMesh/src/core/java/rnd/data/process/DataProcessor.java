package rnd.data.process;

public interface DataProcessor<Rq, Rs> {

	public static interface DataProcessorCallback {

		public static interface DataProcessorCallbackContext {
		}

		void processCallback(DataProcessorCallbackContext context);
	}

	DataProcessorCallback getRequestProcessorCallback(Rq requestPayLoad);

	Object processRequest(Rq requestPayLoad, DataProcessorCallback callback) throws Throwable;

	DataProcessorCallback getResponseProcessorCallback(Rq requestPayLoad, Rs responsePayLoad);

	Object processResponse(Object responseData, Rq requestPayLoad, Rs responsePayLoad, DataProcessorCallback callback) throws Throwable;

}