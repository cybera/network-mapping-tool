package ca.cybera.netmap.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Graph {

	private String url;
	private String name;

	public Graph() {}
	
	public Graph(String baseUrl, String name) {
		this.url = baseUrl + "/" + name;
		this.name = name;
	}
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
