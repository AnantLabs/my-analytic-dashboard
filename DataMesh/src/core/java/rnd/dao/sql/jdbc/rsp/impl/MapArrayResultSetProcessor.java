package rnd.dao.sql.jdbc.rsp.impl;

import java.sql.ResultSetMetaData;

import rnd.dao.sql.jdbc.rp.RowProcessor;
import rnd.dao.sql.jdbc.rp.impl.ArrayRowProcessor;

public class MapArrayResultSetProcessor extends MapResultSetProcessor {

	@Override
	protected RowProcessor getRowProcessor(ResultSetMetaData rsmd) {
		return new ArrayRowProcessor(rsmd);
	}
}