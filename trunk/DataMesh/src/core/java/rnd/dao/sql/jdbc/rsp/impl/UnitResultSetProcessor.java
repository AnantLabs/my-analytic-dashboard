package rnd.dao.sql.jdbc.rsp.impl;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import rnd.dao.sql.jdbc.rp.RowProcessor;
import rnd.dao.sql.jdbc.rp.impl.UnitRowProcessor;
import rnd.dao.sql.jdbc.rsp.AbstractResultSetProcessor;

public class UnitResultSetProcessor extends AbstractResultSetProcessor {

	@Override
	protected RowProcessor getRowProcessor(ResultSetMetaData rsmd) {
		return new UnitRowProcessor();
	}

	@Override
	protected Object processRowSet(ResultSet rs, RowProcessor rowProcessor) throws SQLException {
		Object row = null;
		if (rs.next()) {
			row = rowProcessor.processRow(rs);
		}
		return row;
	}

}