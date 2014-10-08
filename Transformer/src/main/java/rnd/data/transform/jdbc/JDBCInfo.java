package rnd.data.mapper.jdbc;

import java.util.List;
import java.util.Map;

public class JDBCInfo {

	public static enum Type {
		SP, SQL
	}

	private Type type;

	private String stmt;

	private String selectInfo;

	private Map<String, List<Map<String, String>>> paramsInfo;

	private Map payLoad;

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getStmt() {
		return stmt;
	}

	public void setStmt(String info) {
		this.stmt = info;
	}

	public String getSelectInfo() {
		return selectInfo;
	}

	public void setSelectInfo(String selectInfo) {
		this.selectInfo = selectInfo;
	}

	public void setParamsInfo(Map<String, List<Map<String, String>>> paramsInfo) {
		this.paramsInfo = paramsInfo;
	}

	public Map<String, List<Map<String, String>>> getParamsInfo() {
		return paramsInfo;
	}

	public Map getPayLoad() {
		return payLoad;
	}

	public void setPayLoad(Map payLoad) {
		this.payLoad = payLoad;
	}

}