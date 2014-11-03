package rnd.data.analyze.aggregate;

import java.util.List;
import java.util.Map;

public class SumAggregator extends Aggregator {

	@Override
	public Object processRequest(Map<String, String> aggregateInfo, DataProcessorCallback callback) throws Throwable {
		return getDelegate().processRequest(aggregateInfo, null);
	}

	@Override
	public Object processResponse(Object responseData, Map<String, String> aggregateInfo, Map<String, Number> aggrResponseData, rnd.data.process.DataProcessor.DataProcessorCallback callback) throws Throwable {

		String key = aggregateInfo.get("key");
		String value = aggregateInfo.get("value");

		List headers = (List) ((Map) responseData).get("header");
		List<List> data = (List<List>) ((Map) responseData).get("data");

		int keyIndx = headers.indexOf(key);
		int valIndx = headers.indexOf(value);

		for (List columnValues : data) {

			String keyClmn = (String) columnValues.get(keyIndx);
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