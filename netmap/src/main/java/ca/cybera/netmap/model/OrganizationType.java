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
@Table(name = "organization_type")
public class OrganizationType {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "UUID")
	private String UUID;
	
	@Column(name = "type")
	private String type;
	
	@Column(name = "mapIcon", nullable = false)
	private String mapIcon;

	@Column(name = "legendIcon", nullable = false)
	private String legendIcon;

	public OrganizationType() {
	}

	public OrganizationType(String type, String legendIcon, String mapIcon) {
		this.type = type;
		this.legendIcon = legendIcon;
		this.mapIcon = mapIcon;

	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}


	public String getMapIcon() {
		return mapIcon;
	}

	public void setMapIcon(String mapIcon) {
		this.mapIcon = mapIcon;
	}

	public String getLegendIcon() {
		return legendIcon;
	}

	public void setLegendIcon(String legendIcon) {
		this.legendIcon = legendIcon;
	}

	public String getUUID() {
		return UUID;
	}

	public void setUUID(String UUID) {
		this.UUID = UUID;
	}

	
}
