package ca.cybera.netmap.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.GenericGenerator;

@XmlRootElement
@Entity
@Table(name = "connection_speed")
public class ConnectionSpeed {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "UUID")
	private String UUID;
	
	@Column(name = "speed", unique = true, nullable = false)
	private String speed;

	@Column(name = "line_thickness",  nullable = false)
	private Double lineThickness;

	public ConnectionSpeed() {
	}

	public ConnectionSpeed(String speed, Double lineThickness) {
		this.speed = speed;
		this.lineThickness = lineThickness;
	}
	
	public String getUUID() {
		return UUID;
	}

	public void setUUID(String uUID) {
		UUID = uUID;
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
