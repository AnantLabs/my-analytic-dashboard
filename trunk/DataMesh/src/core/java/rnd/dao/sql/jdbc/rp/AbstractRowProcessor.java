package rnd.dao.sql.jdbc.rp;

public abstract class AbstractRowProcessor implements RowProcessor {

	protected int startIndex = 1;

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

}