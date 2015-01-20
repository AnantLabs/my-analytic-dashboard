package rnd.dao.sql.jdbc.rsmdp.impl;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import rnd.dao.sql.jdbc.rsmdp.ResultSetMetaDataProcessor;

public class NameRSMDProcessor implements ResultSetMetaDataProcessor {

	@Override
	public Object processResultSetMetaData(ResultSetMetaData rsmd) throws SQLException {

		List columnNames = new ArrayList();
		int count = rsmd.getColumnCount();

		for (int i = 1; i <= count; i++) {
			columnNames.add(rsmd.getColumnName(i));
		}

		return columnNames;
	}

}