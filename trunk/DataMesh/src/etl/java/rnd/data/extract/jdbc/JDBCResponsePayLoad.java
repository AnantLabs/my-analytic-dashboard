package rnd.data.extract.jdbc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JDBCResponsePayLoad {

	private Map payLoad = new HashMap();

	private List<Map<String, String>> rows = new ArrayList<Map<String, String>>(0);

	public Map getPayLoad() {
		return payLoad;
	}

	public List<Map<String, String>> getRows() {
		return rows;
	}

	public void setRows(List<Map<String, String>> rows) {
		this.rows = rows;
	}

}