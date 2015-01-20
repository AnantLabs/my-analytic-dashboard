package rnd.dao.sql.jdbc.rp.impl;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import rnd.dao.sql.jdbc.rp.AbstractRowProcessor;

public class ArrayRowProcessor extends AbstractRowProcessor {

	protected int endIndex;

	public ArrayRowProcessor(ResultSetMetaData rsmd) {
		try {
			setEndIndex(rsmd.getColumnCount());
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

	public void setEndIndex(int endIndex) {
		this.endIndex = endIndex;
	}

	public Object processRow(ResultSet rs) throws SQLException {

		Object[] row = new Object[this.endIndex - this.startIndex + 1];
		for (int i = this.startIndex; i <= this.endIndex; i++) {
			row[i - this.startIndex] = rs.getObject(i);
		}
		return row;
	}
}