package rnd.data.analyze.aggregate;

import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class SumAggregator extends Aggregator {

	@Override
	public Object processRequest(Map<String, String> aggregateInfo, DataProcessorCallback callback) throws Throwable {
		return getDelegate().processRequest(aggregateInfo, null);
	}

	@Override
	public Object processResponse(Object responseData, Map<String, String> aggregateInfo, Map<String, Number> aggrResponseData, DataProcessorCallback callback) throws Throwable {

		String key = aggregateInfo.get("param6");
		String value = aggregateInfo.get("param7");

		List headers = (List) ((Map) responseData).get("headers");
		List<List> data = (List<List>) ((Map) responseData).get("data");

		int keyIndx = headers.indexOf(key);
		int valIndx = headers.indexOf(value);

		for (List columnValues : data) {

			String keyClmn = columnValues.get(keyIndx).toString();
			Number valClmn = (Number) columnValues.get(valIndx);

			Number aggrValue = aggrResponseData.get(keyClmn);
			if (aggrValue == null) {
				aggrValue = new Double(0);
			}

			aggrValue = aggrValue.doubleValue() + valClmn.doubleValue();

			aggrResponseData.put(keyClmn, aggrValue);
		}

		return aggrResponseData;

	}

}