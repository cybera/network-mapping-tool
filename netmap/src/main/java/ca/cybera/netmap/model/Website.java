package ca.cybera.netmap.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "website")
public class Website {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "UUID")
	private String UUID;

	@Column(name = "url")
	private String url;

	@Column(name = "label")
	private String label;

	public String getUUID() {
		return UUID;
	}

	public void setUUID(String uUID) {
		UUID = uUID;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("UUID: ").append((getUUID() == null) ? "NULL" : getUUID());
		sb.append("\nURL: ").append((getUrl() == null) ? "NULL" : getUrl());
		sb.append("\nLabel: ").append((getLabel() == null) ? "NULL" : getLabel());
		return sb.toString();
	}
}
