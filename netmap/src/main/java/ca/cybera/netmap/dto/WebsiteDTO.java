package ca.cybera.netmap.dto;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class WebsiteDTO {

	private String UUID;
	private String url;
	private String label;
	private Boolean isGraph;

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

	public Boolean getIsGraph() {
		return isGraph;
	}

	public void setIsGraph(Boolean isGraph) {
		this.isGraph = isGraph;
	}

}
