package rnd.data.process;

@SuppressWarnings("unchecked")
public class DelegatingDataProcessor<Rq, Rs> extends AbstractDataProcessor<Rq, Rs> {

	@Override
	public Rs process(Rq requestPayLoad) throws Throwable {
		return (Rs) getDelegate().process(requestPayLoad);
	}

}