package ca.cybera.netmap.assembler;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import ca.cybera.netmap.dto.GeometryDTO;
import ca.cybera.netmap.dto.LineDTO;
import ca.cybera.netmap.dto.PointDTO;
import ca.cybera.netmap.dto.PolygonDTO;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.WKTReader;

@Component
public class GeometryAssembler {

	public GeometryAssembler() {}
	

	public List<GeometryDTO> getDTO(List<Geometry> geometries) {
		ArrayList<GeometryDTO> list = new ArrayList<>();
		for(Geometry geom : geometries)
			list.add(getDTO(geom));
		return list;
	}

	public GeometryDTO getDTO(Geometry geometry) {
		if (geometry == null)
			return null;

		if ("Point".equals(geometry.getGeometryType()))
			return getPointDTO(geometry);

		if ("LineString".equals(geometry.getGeometryType()))
			return getLineDTO(geometry);

		if ("Polygon".equals(geometry.getGeometryType()))
			return getPolygonDTO((Polygon) geometry);

		return null;
	}

	private PointDTO getPointDTO(Geometry geometry) {
		PointDTO point = new PointDTO();
		ArrayList<Double> coordinates = new ArrayList<Double>();
		coordinates.add(geometry.getCoordinate().x);
		coordinates.add(geometry.getCoordinate().y);
		point.setCoordinates(coordinates);
		return point;
	}

	private LineDTO getLineDTO(Geometry geometry) {
		LineDTO line = new LineDTO();
		List<List<Double>> coordinates = new ArrayList<List<Double>>();
		for (Coordinate coordinate : geometry.getCoordinates()) {
			List<Double> coords = new ArrayList<Double>();
			coords.add(coordinate.x);
			coords.add(coordinate.y);
			coordinates.add(coords);

		}
		line.setCoordinates(coordinates);
		return line;
	}

	private PolygonDTO getPolygonDTO(Polygon geometry) {
		PolygonDTO polygon = new PolygonDTO();
		List<List<List<Double>>> coordinates = new ArrayList<List<List<Double>>>();

		LineString exterior = geometry.getExteriorRing();
		List<List<Double>> exteriorCoordinates = new ArrayList<List<Double>>();
		for (Coordinate coordinate : exterior.getCoordinates()) {
			List<Double> coords = new ArrayList<Double>();
			coords.add(coordinate.x);
			coords.add(coordinate.y);
			exteriorCoordinates.add(coords);
		}
		coordinates.add(exteriorCoordinates);

		polygon.setCoordinates(coordinates);
		return polygon;
	}

	public Geometry assemble(GeometryDTO dto) throws Exception {
		if (dto instanceof PointDTO)
			return assemble((PointDTO) dto);
		if (dto instanceof LineDTO)
			return assemble((LineDTO) dto);
		if (dto instanceof PolygonDTO)
			return assemble((PolygonDTO) dto);
		return null;
	}

	private Geometry assemble(PointDTO dto) throws Exception {
		if (dto == null)
			return null;

		StringBuffer sb = new StringBuffer();
		sb.append("POINT(");
		sb.append(dto.getCoordinates().get(0));
		sb.append(" ").append(dto.getCoordinates().get(1));
		sb.append(")");
		WKTReader reader = new WKTReader();
		return reader.read(sb.toString());
	}

	private Geometry assemble(LineDTO dto) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("LINESTRING");
		sb.append(buildCoordinateGeometry(dto.getCoordinates()));
		WKTReader reader = new WKTReader();
		return reader.read(sb.toString());
	}

	private Geometry assemble(PolygonDTO dto) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("POLYGON(");
		int index = 0;
		int size = dto.getCoordinates().size();
		for (List<List<Double>> polygon : dto.getCoordinates()) {
			sb.append(buildCoordinateGeometry(polygon));
			index++;
			if (size > index)
				sb.append(",");
		}
		sb.append(")");
		System.err.println("POLYGON: " + sb.toString());
		WKTReader reader = new WKTReader();
		return reader.read(sb.toString());
	}

	private String buildCoordinateGeometry(List<List<Double>> coordinates) {
		StringBuffer ret = new StringBuffer();
		int index = 0;
		int size = coordinates.size();

		ret.append("(");
		for (List<Double> coordinate : coordinates) {
			index++;
			ret.append(coordinate.get(0)).append(" ").append(coordinate.get(1));
			if (size > index)
				ret.append(", ");
		}
		ret.append(")");

		return ret.toString();
	}


}
