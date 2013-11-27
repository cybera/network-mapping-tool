package ca.cybera.netmap.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@Entity
@Table(name = "connection_speed")
public class ConnectionSpeed {

	@Id
	@Column(name = "speed")
	private String speed;

	@Column(name = "line_thickness", unique = true, nullable = false)
	private Double lineThickness;

	public ConnectionSpeed() {
	}

	public ConnectionSpeed(String speed, Double lineThickness) {
		this.speed = speed;
		this.lineThickness = lineThickness;
	}

	public String getSpeed() {
		return speed;
	}

	public void setSpeed(String speed) {
		this.speed = speed;
	}

	public Double getLineThickness() {
		return lineThickness;
	}

	public void setLineThickness(Double lineThickness) {
		this.lineThickness = lineThickness;
	}

}
