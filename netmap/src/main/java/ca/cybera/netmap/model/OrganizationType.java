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

	public OrganizationType() {
	}

	public OrganizationType(String type) {
	
		this.type = type;
		
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
