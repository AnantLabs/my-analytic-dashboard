package rnd.data.process;

public interface DataProcessor<Rq, Rs> {

	public static interface DataProcessorCallback {

		public static interface DataProcessorCallbackContext {
		}

		void processCallback(DataProcessorCallbackContext context);
	}

	DataProcessorCallback getProcessorCallback(Rq requestPayLoad);

	Rs process(Rq rqPayload) throws Throwable;

}