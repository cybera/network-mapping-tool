package ca.cybera.netmap.dto;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@XmlRootElement
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, include=JsonTypeInfo.As.PROPERTY, property="type")
@JsonSubTypes({
		@JsonSubTypes.Type(value=PointDTO.class, name="Point"),
		@JsonSubTypes.Type(value=LineDTO.class, name="LineString"),
		@JsonSubTypes.Type(value=PolygonDTO.class, name="Polygon")
})
public class GeometryDTO {

}
