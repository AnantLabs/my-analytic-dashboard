package rnd.dao.sql.jdbc.rp.impl;

import java.sql.ResultSet;
import java.sql.SQLException;

import rnd.dao.sql.jdbc.rp.AbstractRowProcessor;

public class UnitRowProcessor extends AbstractRowProcessor {

	public Object processRow(ResultSet rs) throws SQLException {
		return rs.getObject(this.startIndex);
	}

}