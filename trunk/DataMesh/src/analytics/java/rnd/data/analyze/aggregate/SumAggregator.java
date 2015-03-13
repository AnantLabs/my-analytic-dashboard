package rnd.data.analyze.aggregate;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SumAggregator extends Aggregator {

	@Override
	public Map<String, Collection> process(Map<String, String> aggregateInfo) throws Throwable {

		String key = aggregateInfo.get("analyze:param0");
		String value = aggregateInfo.get("analyze:param1");

		Map extractedData = (Map) getDelegate().process(aggregateInfo);

		List headers = (List) extractedData.get("headers");
		List<List> data = (List<List>) extractedData.get("data");

		int keyIndx = headers.indexOf(key);
		int valIndx = headers.indexOf(value);

		Map<String, Number> aggrData = new HashMap<String, Number>();

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