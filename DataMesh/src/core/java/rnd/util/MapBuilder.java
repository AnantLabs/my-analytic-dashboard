package rnd.util;

import java.lang.ref.Reference;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("unchecked")
public class MapBuilder {

	private Reference<? extends Map> ref;

	public MapBuilder() {
		ref = new WeakReference<>(new HashMap());
	}

	public MapBuilder map(Object key, Object value) {
		ref.get().put(key, value);
		return this;
	}

	public Map build() {
		return ref.get();
	}

}
