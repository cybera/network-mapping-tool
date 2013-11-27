package ca.cybera.netmap.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@Entity
@Table(name = "organization_type")
public class OrganizationType {

	@Id
	@Column(name = "type")
	private String type;

	@Column(name = "colour", unique = true, nullable = false)
	private String colour;

	public OrganizationType() {
	}

	public OrganizationType(String type, String colour) {

		this.type = type;
		this.colour = colour;

	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getColour() {
		return colour;
	}

	public void setColour(String colour) {
		this.colour = colour;
	}

}
