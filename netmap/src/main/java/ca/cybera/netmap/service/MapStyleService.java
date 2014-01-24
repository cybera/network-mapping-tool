package ca.cybera.netmap.service;

import java.util.List;

import ca.cybera.netmap.model.MapStyle;


public interface MapStyleService {

	public List<MapStyle> get();

	public MapStyle save(MapStyle style);

	public void delete(String uuid);

}
