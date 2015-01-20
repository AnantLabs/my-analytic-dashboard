package rnd.dao.sql.jdbc.rsp.impl;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import rnd.dao.sql.jdbc.rp.RowProcessor;
import rnd.dao.sql.jdbc.rp.impl.UnitRowProcessor;
import rnd.dao.sql.jdbc.rsp.AbstractResultSetProcessor;

public class ListResultSetProcessor extends AbstractResultSetProcessor {

	@Override
	protected RowProcessor getRowProcessor(ResultSetMetaData rsmd) {
		return new UnitRowProcessor();
	}

	@Override
	protected Object processRowSet(ResultSet rs, RowProcessor rowProcessor) throws SQLException {
		
		List rowList = new ArrayList(rs.getFetchSize());
		
		while (rs.next()) {
			rowList.add(rowProcessor.processRow(rs));
		}
		
		return rowList;
	}
}