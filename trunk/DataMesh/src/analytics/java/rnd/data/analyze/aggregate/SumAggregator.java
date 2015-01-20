package rnd.data.analyze.aggregate;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SumAggregator extends Aggregator {

	@Override
	public Object process(Map<String, String> aggregateInfo, Map<String, Number> aggrData) throws Throwable {

		String key = aggregateInfo.get("analyze:param0");
		String value = aggregateInfo.get("analyze:param1");

		Map processedData = (Map) getDelegate().process(aggregateInfo, new HashMap());

		List headers = (List) processedData.get("headers");
		List<List> data = (List<List>) processedData.get("data");

		int keyIndx = headers.indexOf(key);
		int valIndx = headers.indexOf(value);

		for (List columnValues : data) {

			String keyClmn = columnValues.get(keyIndx).toString();
			Number valClmn = (Number) columnValues.get(valIndx);

			Number aggrValue = aggrData.get(keyClmn);
			if (aggrValue == null) {
				aggrValue = new Double(0);
			}

			aggrValue = aggrValue.doubleValue() + valClmn.doubleValue();

			aggrData.put(keyClmn, aggrValue);
		}

		Map<String, Collection> newProcessedData = new HashMap<>();

		newProcessedData.put("keys", aggrData.keySet());
		newProcessedData.put("values", aggrData.values());

		return newProcessedData;

	}

}